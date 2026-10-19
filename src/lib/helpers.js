// Shared build-time helpers.

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isSet = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);

const money = (amount, currency = 'USD') =>
  isSet(amount) ? `${currency} ${Number(amount).toLocaleString('en-GB')}` : null;

const tbc = (v, fallback = 'To be confirmed') => (isSet(v) ? esc(v) : `<span class="tbc">${fallback}</span>`);

// --- Images -------------------------------------------------------------
let library = {};
const setImageLibrary = (lib) => (library = lib);

const COMMONS_WIDTHS = [960, 1280, 1920];
const UNSPLASH_WIDTHS = [480, 800, 1200, 1600, 2000];

function imageSources(key, { ratio } = {}) {
  const img = library[key];
  if (!img) throw new Error(`Unknown image key "${key}" - add it to src/content/images.json`);
  if (img.src) return { src: img.src, srcset: '', img };
  if (img.commons) {
    const file = img.commons.split('/').pop();
    const widths = COMMONS_WIDTHS.filter((w) => !img.maxWidth || w < img.maxWidth);
    const url = (w) => `https://upload.wikimedia.org/wikipedia/commons/thumb/${img.commons}/${w}px-${file}`;
    return { src: url(widths[1] || widths[0]), srcset: widths.map((w) => `${url(w)} ${w}w`).join(', '), img };
  }
  const crop = ratio ? `&h=__H__&fit=crop&crop=entropy` : '';
  const url = (w) =>
    `https://images.unsplash.com/photo-${img.unsplash}?auto=format&q=70&w=${w}${crop.replace('__H__', ratio ? Math.round(w / ratio) : '')}`;
  return { src: url(1200), srcset: UNSPLASH_WIDTHS.map((w) => `${url(w)} ${w}w`).join(', '), img };
}

/**
 * Responsive <img>. Below-the-fold images lazy-load unless eager is set.
 */
function picture(key, { sizes = '100vw', eager = false, ratio, className = '', alt } = {}) {
  const { src, srcset, img } = imageSources(key, { ratio });
  return `<img src="${esc(src)}"${srcset ? ` srcset="${esc(srcset)}" sizes="${esc(sizes)}"` : ''} alt="${esc(alt ?? img.alt)}"${
    eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'
  }${className ? ` class="${className}"` : ''}>`;
}

function credit(key) {
  const c = library[key] && library[key].credit;
  if (!c) return '';
  return `Photo: <a href="${esc(c.source)}" rel="noopener">${esc(c.author)}</a>, <a href="${esc(c.licenceUrl)}" rel="noopener license">${esc(c.licence)}</a>`;
}

function imageUrl(key, w = 1200, h = 630) {
  const img = library[key];
  if (img.src) return img.src;
  if (img.commons) return imageSources(key).src;
  return `https://images.unsplash.com/photo-${img.unsplash}?auto=format&q=70&w=${w}&h=${h}&fit=crop`;
}

const icons = {
  arrow: '<svg class="arrow" width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" stroke-width="1.2"/></svg>',
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="m3 6 9 7 9-7"/></svg>',
  whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/></svg>',
  pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  scales: '<svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M24 6v36M14 42h20M8 14h32M8 14l-5 12a6 6 0 0 0 10 0L8 14Zm32 0-5 12a6 6 0 0 0 10 0l-5-12Z"/><circle cx="24" cy="10" r="2.5"/></svg>',
  check: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><circle cx="32" cy="32" r="30"/><path d="m20 33 8 8 16-17"/></svg>',
};

// The crest: a fine double roundel enclosing a serif "S" over a chequered band.
const crest = `<svg class="wordmark__crest" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
  <circle cx="24" cy="24" r="22.5" fill="none" stroke="#B69A5A" stroke-width="1"/>
  <circle cx="24" cy="24" r="19" fill="none" stroke="#B69A5A" stroke-width="0.6" opacity="0.7"/>
  <text x="24" y="31.5" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="23" font-weight="600" fill="#F5F1E8">S</text>
  <g fill="#B69A5A" opacity="0.9"><rect x="15" y="35" width="2.5" height="2.5"/><rect x="20" y="35" width="2.5" height="2.5"/><rect x="25" y="35" width="2.5" height="2.5"/><rect x="30" y="35" width="2.5" height="2.5"/><rect x="17.5" y="37.5" width="2.5" height="2.5"/><rect x="22.5" y="37.5" width="2.5" height="2.5"/><rect x="27.5" y="37.5" width="2.5" height="2.5"/></g>
</svg>`;

module.exports = { esc, isSet, money, tbc, setImageLibrary, picture, credit, imageUrl, icons, crest };
