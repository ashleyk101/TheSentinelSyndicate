// Builds the static site into dist/ from src/content/*.json and src/pages/*.js.
// Usage: node scripts/build.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');

const readJson = (f) => JSON.parse(fs.readFileSync(path.join(SRC, 'content', f), 'utf8'));
const { setImageLibrary } = require('../src/lib/helpers');
const { render } = require('../src/lib/layout');

const site = readJson('site.json');
const images = readJson('images.json');
const tiers = readJson('tiers.json');
const allHorses = readJson('horses.json').horses;
setImageLibrary(images);

// Validate content so mistakes are caught at build time, not by visitors.
const errors = [];
const slugs = new Set();
for (const h of allHorses) {
  if (!h.slug || !/^[a-z0-9-]+$/.test(h.slug)) errors.push(`Horse "${h.name}" needs a lowercase slug (letters, numbers, hyphens).`);
  if (slugs.has(h.slug)) errors.push(`Duplicate horse slug "${h.slug}".`);
  slugs.add(h.slug);
  if (!h.name) errors.push(`Horse "${h.slug}" has no name.`);
  if (!images[h.image]) errors.push(`Horse "${h.slug}" uses unknown image "${h.image}".`);
}
if (errors.length) {
  console.error('Content errors:\n - ' + errors.join('\n - '));
  process.exit(1);
}

const horses = allHorses.filter((h) => !h.sample || site.showSampleHorses);
const ctx = { site, tiers, horses, images };
const buildId = Date.now().toString(36);

const pageModules = ['home', 'syndicate', 'horses', 'ownership', 'membership', 'contact', 'legal', 'not-found'];
const pages = pageModules.flatMap((m) => require(path.join(SRC, 'pages', m + '.js'))(ctx));

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const page of pages) {
  const out = page.file
    ? path.join(DIST, page.file)
    : path.join(DIST, page.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(site, { ...page, buildId }));
}

// Static assets
fs.cpSync(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { recursive: true });

// SEO files
const base = site.url.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);
const indexable = pages.filter((p) => !p.noindex && !p.file);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

const samples = horses.filter((h) => h.sample).length;
console.log(`Built ${pages.length} pages into dist/ (${indexable.length} in sitemap).`);
if (samples) console.warn(`Note: ${samples} SAMPLE horse listing(s) are included. Set "showSampleHorses": false in site.json before launch.`);
if (!site.forms.accessKey) console.warn('Note: no Web3Forms access key set in site.json - enquiry forms will show direct contact options instead of sending.');
