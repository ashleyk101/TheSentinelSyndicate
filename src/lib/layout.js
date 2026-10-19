// Page shell: <head>, header, mobile menu, footer.
const { esc, crest, icons, imageUrl } = require('./helpers');

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/our-syndicate/', label: 'Our Syndicate' },
  { href: '/horses/', label: 'Our Horses' },
  { href: '/how-ownership-works/', label: 'How Ownership Works' },
  { href: '/membership/', label: 'Membership' },
  { href: '/contact/', label: 'Contact' },
];

const isCurrent = (href, path) => (href === '/' ? path === '/' : path.startsWith(href));

function wordmark(site) {
  return `<a class="wordmark" href="/" aria-label="${esc(site.name)} - home">${crest}<span class="wordmark__text">THE SENTINEL<br>SYNDICATE<small>EST. ${esc(site.established)} · KENYA</small></span></a>`;
}

function whatsappUrl(site, message) {
  const c = site.contact;
  if (!c.whatsapp) return null;
  return `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(message || c.whatsappMessage || '')}`;
}

function header(site, page) {
  const links = NAV.map(
    (n) => `<li><a class="nav__link" href="${n.href}"${isCurrent(n.href, page.path) ? ' aria-current="page"' : ''}>${n.label}</a></li>`
  ).join('');
  const mobileLinks = NAV.map(
    (n) => `<li><a href="${n.href}"${isCurrent(n.href, page.path) ? ' aria-current="page"' : ''}>${n.label}${icons.arrow}</a></li>`
  ).join('');
  const c = site.contact;
  const contactBits = [
    c.phone ? `<a href="tel:${esc(c.phone)}">${esc(c.phoneDisplay || c.phone)}</a>` : '',
    c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '',
  ].filter(Boolean).join('<br>');

  return `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header${page.overlayHeader ? ' site-header--overlay' : ''}" data-header>
  <div class="container site-header__inner">
    ${wordmark(site)}
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">${links}</ul>
    </nav>
    <a class="btn btn--outline btn--small header-cta" href="/membership/#enquire">Enquire About Ownership</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
      <span class="menu-toggle__bars" aria-hidden="true"></span><span data-menu-label>Menu</span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
  <nav aria-label="Mobile">
    <ul class="mobile-menu__list">${mobileLinks}</ul>
  </nav>
  <div class="mobile-menu__foot">
    <a class="btn btn--block" href="/membership/#enquire">Enquire About Ownership</a>
    ${whatsappUrl(site) ? `<a class="btn btn--outline btn--block" href="${esc(whatsappUrl(site))}" rel="noopener">${icons.whatsapp} Enquire on WhatsApp</a>` : ''}
    ${contactBits ? `<p class="mobile-menu__contact">${contactBits}</p>` : ''}
  </div>
</div>`;
}

function footer(site) {
  const c = site.contact;
  const year = new Date().getFullYear();
  const contactItems = [
    c.phone ? `<li><a href="tel:${esc(c.phone)}">${esc(c.phoneDisplay || c.phone)}</a></li>` : '',
    c.whatsapp ? `<li><a href="${esc(whatsappUrl(site))}" rel="noopener">WhatsApp</a></li>` : '',
    c.email ? `<li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>` : '',
    c.location ? `<li>${esc(c.location)}</li>` : c.operatingRegion ? `<li>${esc(c.operatingRegion)}</li>` : '',
  ].join('');
  const social = (site.social || []).filter((s) => s.url && s.label);

  return `
<footer class="site-footer on-dark">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        ${wordmark(site)}
        <p>${esc(site.footerBlurb)}</p>
        <span class="chequer" aria-hidden="true"></span>
      </div>
      <div>
        <h2 class="footer-title">Explore</h2>
        <ul class="footer-links">${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h2 class="footer-title">Contact</h2>
        <ul class="footer-links">${contactItems}</ul>
      </div>
      <div>
        <h2 class="footer-title">Follow</h2>
        ${
          social.length
            ? `<ul class="footer-links">${social.map((s) => `<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>`
            : `<p class="small">Official social media accounts will be listed here once confirmed.</p>`
        }
        <p style="margin-top:1.5rem"><a class="btn btn--outline btn--small" href="/membership/#enquire">Make an Enquiry</a></p>
      </div>
    </div>
    <p class="footer-note">Horse racing involves sporting and financial uncertainty. Membership or ownership does not guarantee prize money, profits or the return of any contribution. Nothing on this website is an offer of investment or financial advice. Photography is illustrative and does not show horses owned by the syndicate unless stated.</p>
    <div class="footer-bottom">
      <p style="margin:0">&copy; ${year} ${esc(site.name)}. All rights reserved.</p>
      <ul>
        <li><a href="/privacy/">Privacy policy</a></li>
        <li><a href="/terms/">Terms and conditions</a></li>
        <li><a href="/credits/">Photo credits</a></li>
        ${site.analytics && site.analytics.ga4MeasurementId ? '<li><button class="footer-cookie-btn" type="button" data-consent-open>Cookie preferences</button></li>' : ''}
      </ul>
    </div>
  </div>
</footer>`;
}

function consentBanner(site) {
  if (!site.analytics || !site.analytics.ga4MeasurementId) return '';
  return `
<div class="consent" role="dialog" aria-labelledby="consent-title" aria-live="polite" data-consent>
  <h2 id="consent-title" class="footer-title">Your privacy</h2>
  <p>With your permission we use analytics cookies to understand how visitors use this site. We do not use advertising cookies. See our <a href="/privacy/">privacy policy</a>.</p>
  <div class="btn-row">
    <button class="btn btn--small" type="button" data-consent-accept>Accept analytics</button>
    <button class="btn btn--outline btn--small" type="button" data-consent-decline>Decline</button>
  </div>
</div>`;
}

function render(site, page) {
  const url = site.url.replace(/\/$/, '') + page.path;
  const title = page.path === '/' ? page.title : `${page.title} | ${site.name}`;
  const ogImage = imageUrl(page.ogImage || 'hero');
  const jsonLd = (page.jsonLd || []).map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('\n');
  const config = {
    forms: { endpoint: site.forms.endpoint, accessKey: site.forms.accessKey, provider: site.forms.provider },
    contact: { phone: site.contact.phone, phoneDisplay: site.contact.phoneDisplay, email: site.contact.email, whatsapp: whatsappUrl(site) },
    ga4: (site.analytics && site.analytics.ga4MeasurementId) || '',
    siteName: site.name,
  };

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : ''}
${page.file ? "" : `<link rel="canonical" href="${esc(url)}">`}
<meta name="theme-color" content="#12382D">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@400;500&display=swap">
<link rel="stylesheet" href="/assets/css/main.css?v=${page.buildId}">
<script>document.documentElement.classList.add('js');window.SENTINEL=${JSON.stringify(config)};</script>
<script src="/assets/js/main.js?v=${page.buildId}" defer></script>
${jsonLd}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
${header(site, page)}
<main id="main" tabindex="-1">
${page.body}
</main>
${footer(site)}
${consentBanner(site)}
</body>
</html>
`;
}

module.exports = { render, NAV, whatsappUrl };
