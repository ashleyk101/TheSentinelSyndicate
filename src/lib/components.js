// Reusable page components.
const { esc, isSet, money, tbc, picture, credit, icons } = require('./helpers');
const { whatsappUrl } = require('./layout');

const STATUS = {
  available: { label: 'Available for syndication', cls: 'tag--available', open: true },
  racing: { label: 'Racing · shares available', cls: 'tag--available', open: true },
  'in-training': { label: 'In training', cls: '', open: false },
  'fully-subscribed': { label: 'Fully subscribed', cls: 'tag--muted', open: false },
  retired: { label: 'Retired', cls: 'tag--muted', open: false },
  sold: { label: 'Sold', cls: 'tag--muted', open: false },
};
const statusOf = (h) => STATUS[h.status] || { label: h.status || 'Status to be confirmed', cls: '', open: false };

function pedigreeLine(h) {
  if (h.sire && h.dam) return `By ${esc(h.sire)} out of ${esc(h.dam)}`;
  if (h.sire) return `By ${esc(h.sire)}`;
  return 'Pedigree to be confirmed';
}
const metaLine = (h) => [h.age ? `${h.age}yo` : null, h.sex, h.colour].filter(Boolean).map(esc).join(' · ');

function priceLine(h) {
  const o = h.ownership;
  if (!o) return `<span class="horse-card__price">${statusOf(h).open ? 'Share details on enquiry' : 'Register interest in future opportunities'}</span>`;
  const from = o.fromKES ? `KES ${Number(o.fromKES).toLocaleString('en-GB')}` : money(o.from);
  return `<span class="horse-card__price">${esc(o.available || 'Shares')}${from ? `<strong>From ${esc(from)}</strong>` : ''}</span>`;
}

function horseCard(h, { headingLevel = 3 } = {}) {
  const s = statusOf(h);
  const H = `h${headingLevel}`;
  const ageBand = h.age ? (h.age <= 2 ? '2' : h.age === 3 ? '3' : '4+') : '';
  return `<article class="horse-card reveal" data-horse
    data-name="${esc((h.name + ' ' + (h.sire || '') + ' ' + (h.dam || '')).toLowerCase())}"
    data-status="${esc(h.status)}" data-sex="${esc(h.sex || '')}" data-age="${ageBand}">
  <div class="horse-card__media">
    ${picture(h.image, { sizes: '(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw', ratio: 0.8 })}
    <div class="horse-card__tags">
      <span class="tag ${s.cls}">${esc(s.label)}</span>
      ${h.sample ? '<span class="tag tag--sample">Sample listing</span>' : ''}
    </div>
  </div>
  <p class="horse-card__meta">${metaLine(h) || 'Details to be confirmed'}</p>
  <${H} class="horse-card__name"><a href="/horses/${esc(h.slug)}/">${esc(h.name)}</a></${H}>
  <p class="horse-card__pedigree">${pedigreeLine(h)}</p>
  <p class="horse-card__summary">${esc(h.summary)}</p>
  <div class="horse-card__foot">
    ${priceLine(h)}
    <a class="text-link" href="/horses/${esc(h.slug)}/" aria-label="View ${esc(h.name)}">View horse ${icons.arrow}</a>
  </div>
</article>`;
}

function sampleBanner() {
  return `<div class="sample-banner" role="note">${icons.info}<div><strong>Design preview</strong>The horses below are sample listings that show how profiles will look. They are not real horses, prices or offers. Current opportunities are shared on enquiry.</div></div>`;
}

function noHorsesPanel() {
  return `<div class="empty-state">
  <span class="chequer" aria-hidden="true" style="margin:0 auto 1.5rem"></span>
  <h3>Current opportunities are shared on enquiry</h3>
  <p>Horse profiles will be published here as they become available for syndication. Speak to us to hear about horses currently in the syndicate and shares available now.</p>
  <a class="btn btn--green" href="/membership/#enquire">Enquire About Ownership</a>
</div>`;
}

function pageHero({ eyebrow, title, lead, image, crumbs, extra = '' }) {
  const crumbHtml = crumbs
    ? `<nav class="breadcrumb" aria-label="Breadcrumb"><ol>${crumbs
        .map((c, i) => (i === crumbs.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${c.href}">${esc(c.label)}</a></li>`))
        .join('')}</ol></nav>`
    : '';
  return `<section class="page-hero${image ? '' : ' page-hero--plain'}">
  ${image ? `<div class="page-hero__media">${picture(image, { eager: true })}</div>` : ''}
  <div class="container page-hero__content">
    ${crumbHtml}
    ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
    ${extra}
  </div>
</section>`;
}

function ctaBand({ title, text, href = '/membership/#enquire', label = 'Make an Enquiry', tone = 'green', secondary }) {
  return `<section class="section section--${tone} cta-band">
  <div class="container reveal">
    <span class="chequer" aria-hidden="true" style="margin:0 auto 2rem"></span>
    <h2>${title}</h2>
    ${text ? `<p class="lead">${text}</p>` : ''}
    <div class="btn-row"><a class="btn" href="${href}">${label}</a>${secondary || ''}</div>
  </div>
</section>`;
}

// ---- Tiers -------------------------------------------------------------
function priceBlock(t, currency) {
  const usd = money(t.price, currency);
  if (!usd && !t.priceKES) return `<div class="tier__price"><strong>On enquiry</strong><span>Contribution confirmed on enquiry</span></div>`;
  const kes = t.priceKES ? ` · approx. KES ${Number(t.priceKES).toLocaleString('en-GB')}` : '';
  return `<div class="tier__price"><strong>${esc(usd)}</strong><span>${esc(t.pricePeriod || '')}${kes}</span></div>`;
}

function ownershipTier(t, currency, { light = false } = {}) {
  return `<article class="tier${light ? ' tier--light' : ''} reveal">
  <p class="tier__label">Ownership share</p>
  <h3 class="tier__name">${esc(t.name)}</h3>
  <p class="tier__sub">${esc(t.share)} · ${esc(t.units)}</p>
  ${priceBlock(t, currency)}
  <ul class="tier__list">${t.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  <dl class="tier__facts">
    <div><dt>Ongoing costs: </dt><dd>${tbc(t.ongoingCosts, 'Confirmed on enquiry')}</dd></div>
    <div><dt>Eligibility: </dt><dd>${tbc(t.eligibility, 'Subject to the ownership agreement')}</dd></div>
  </dl>
  <a class="btn${light ? ' btn--green' : ''} btn--block" href="/membership/?tier=${esc(t.id)}#enquire">Enquire about ${esc(t.name)}</a>
</article>`;
}

function membershipTier(t, currency, { light = false } = {}) {
  return `<article class="tier${light ? ' tier--light' : ''} reveal">
  <p class="tier__label">Club membership</p>
  <h3 class="tier__name">${esc(t.name)}</h3>
  <p class="tier__sub">${esc(t.audience)}</p>
  ${priceBlock(t, currency)}
  <ul class="tier__list">${t.benefits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  <dl class="tier__facts">
    <div><dt>Eligibility: </dt><dd>${tbc(t.eligibility, 'Subject to membership terms')}</dd></div>
  </dl>
  <a class="btn${light ? ' btn--green' : ''} btn--block" href="/membership/?tier=${esc(t.id)}#enquire">Enquire about ${esc(t.name)}</a>
  ${t.motto ? `<p class="tier__motto">${esc(t.motto)}</p>` : ''}
</article>`;
}

function structurePanel(s) {
  if (!s) return '';
  return `<div class="structure reveal">
  <div class="structure__ring" role="img" aria-label="Ownership structure: ${esc(s.syndicateShare)} retained by the syndicate, ${esc(s.memberShare)} offered to members"><span>100%</span></div>
  <div>
    <p class="tier__label" style="margin:0">Syndicate structure · stated valuation ${esc(s.valuation)}</p>
    <ul class="structure__legend">
      <li><i></i> ${esc(s.syndicateShare)} The Sentinel Syndicate (founder and management)</li>
      <li><i></i> ${esc(s.memberShare)} offered to members</li>
    </ul>
    <p class="small muted" style="margin:0">${esc(s.note)}</p>
  </div>
</div>`;
}

const prizeMoneyNote = `Prize money, if any is earned, is distributed under the applicable ownership agreement and after relevant expenses. There are no guaranteed returns: racing involves sporting and financial uncertainty, and members may not recover their contributions.`;

// ---- Contact list --------------------------------------------------------
function contactList(site) {
  const c = site.contact;
  const rows = [];
  if (c.whatsapp) rows.push({ href: whatsappUrl(site), icon: icons.whatsapp, label: 'WhatsApp', value: c.phoneDisplay || c.phone, ext: true });
  if (c.phone) rows.push({ href: `tel:${c.phone}`, icon: icons.phone, label: 'Telephone', value: c.phoneDisplay || c.phone });
  if (c.email) rows.push({ href: `mailto:${c.email}`, icon: icons.mail, label: 'Email', value: c.email });
  rows.push({ href: site.url, icon: icons.globe, label: 'Website', value: site.url.replace(/^https?:\/\//, '') });
  if (c.location) rows.push({ icon: icons.pin, label: 'Location', value: c.location });
  else if (c.operatingRegion) rows.push({ icon: icons.pin, label: 'Operating region', value: c.operatingRegion });

  return `<ul class="contact-list">${rows
    .map((r) =>
      r.href
        ? `<li><a href="${esc(r.href)}"${r.ext ? ' rel="noopener"' : ''}><span class="contact-list__icon">${r.icon}</span><span><span class="contact-list__label">${esc(r.label)}</span><span class="contact-list__value">${esc(r.value)}</span></span>${icons.arrow}</a></li>`
        : `<li><div class="contact-list__static"><span class="contact-list__icon">${r.icon}</span><span><span class="contact-list__label">${esc(r.label)}</span><span class="contact-list__value">${esc(r.value)}</span></span></div></li>`
    )
    .join('')}</ul>`;
}

// ---- Forms -------------------------------------------------------------
const uid = (() => { let n = 0; return (p) => `${p}-${++n}`; })();

function field({ id, name, label, type = 'text', required, optional, autocomplete, hint, full, inputmode, options, placeholder, value }) {
  const req = required ? ' <span class="req" aria-hidden="true">*</span>' : optional ? ' <span class="optional">(optional)</span>' : '';
  const describedBy = [hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ');
  const common = `id="${id}" name="${name}"${required ? ' required aria-required="true"' : ''} aria-describedby="${describedBy}"`;
  let control;
  if (type === 'select') {
    control = `<select class="select" ${common}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}>
      <option value="">${esc(placeholder || 'Please select')}</option>
      ${options.map((o) => { const v = typeof o === 'string' ? o : o.value; const l = typeof o === 'string' ? o : o.label; return `<option value="${esc(v)}"${value === v ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}
    </select>`;
  } else if (type === 'textarea') {
    control = `<textarea class="textarea" ${common} rows="5" maxlength="3000"></textarea>`;
  } else {
    control = `<input class="input" type="${type}" ${common}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''} maxlength="200">`;
  }
  return `<div class="field${full ? ' field--full' : ''}" data-field>
  <label for="${id}">${esc(label)}${req}</label>
  ${hint ? `<p class="hint" id="${id}-hint">${hint}</p>` : ''}
  ${control}
  <p class="field__error" id="${id}-error" data-error></p>
</div>`;
}

function choiceGroup({ id, name, legend, options, required, full }) {
  return `<fieldset class="field${full ? ' field--full' : ''}" data-field data-group="${name}">
  <legend>${esc(legend)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</legend>
  <div class="choice-group" role="radiogroup" aria-describedby="${id}-error"${required ? ' aria-required="true"' : ''}>
    ${options.map((o, i) => `<label class="choice"><input type="radio" name="${name}" value="${esc(o)}"${required && i === 0 ? ' required' : ''}><span>${esc(o)}</span></label>`).join('')}
  </div>
  <p class="field__error" id="${id}-error" data-error></p>
</fieldset>`;
}

function consentField(id) {
  return `<div class="field field--full" data-field data-summary="Consent to be contacted">
  <label class="check" for="${id}"><input type="checkbox" id="${id}" name="consent" value="yes" required aria-required="true" aria-describedby="${id}-error">
  <span>I agree to The Sentinel Syndicate contacting me about this enquiry and processing my details as described in the <a href="/privacy/">privacy policy</a>. <span class="req" aria-hidden="true">*</span></span></label>
  <p class="field__error" id="${id}-error" data-error></p>
</div>`;
}

function formShell({ id, subject, intro = '', fields, submitLabel, successTitle, successText, context = {} }) {
  return `<div class="form-panel" data-form-wrap>
  <form id="${id}" class="enquiry-form" novalidate data-enquiry-form data-subject="${esc(subject)}">
    <div class="form-status" role="alert" tabindex="-1" data-form-status></div>
    ${intro}
    <div class="form-grid">
      ${fields}
    </div>
    ${Object.entries(context).map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}
    <div class="hp" aria-hidden="true"><label>Leave this field empty <input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label></div>
    <div class="form-foot">
      <p class="small muted">Fields marked <span class="req">*</span> are required. An enquiry is not a purchase, reservation or transfer of ownership.</p>
      <button class="btn btn--green" type="submit" data-submit>${esc(submitLabel)}</button>
    </div>
  </form>
  <div class="form-success" tabindex="-1" data-form-success>
    <div class="form-success__mark">${icons.check}</div>
    <h3>${esc(successTitle)}</h3>
    <p>${successText}</p>
    <a class="text-link" href="/horses/">Continue exploring our horses ${icons.arrow}</a>
  </div>
</div>`;
}

const ENQUIRY_TYPES = [
  'General membership enquiry',
  'Enquiry about a particular horse',
  'Ownership costs and share availability',
  'Racing and owner experiences',
  'Other',
];
const CONTACT_METHODS = ['Phone call', 'WhatsApp', 'Email'];

function membershipForm({ site, horses, tiers, horse }) {
  const p = uid('m');
  const tierOptions = [
    ...tiers.ownership.tiers.map((t) => ({ value: t.id, label: `Ownership · ${t.name} (${t.share})` })),
    ...tiers.membership.tiers.map((t) => ({ value: t.id, label: `Club membership · ${t.name}` })),
    { value: 'not-sure', label: 'Not sure yet' },
  ];
  const horseOptions = [...horses.map((h) => ({ value: h.name, label: h.name + (h.sample ? ' (sample listing)' : '') })), { value: 'Any / not sure yet', label: 'Any / not sure yet' }];

  const fields = [
    field({ id: `${p}-type`, name: 'enquiry_type', label: 'Enquiry type', type: 'select', required: true, options: ENQUIRY_TYPES, value: horse ? 'Enquiry about a particular horse' : undefined, full: true }),
    field({ id: `${p}-name`, name: 'name', label: 'Full name', required: true, autocomplete: 'name' }),
    field({ id: `${p}-email`, name: 'email', label: 'Email address', type: 'email', required: true, autocomplete: 'email', inputmode: 'email' }),
    field({ id: `${p}-phone`, name: 'phone', label: 'Telephone number', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', placeholder: '+254 7XX XXX XXX', hint: 'Include your country code if you are outside Kenya.' }),
    choiceGroup({ id: `${p}-method`, name: 'preferred_contact', legend: 'Preferred contact method', options: CONTACT_METHODS, required: true }),
    field({ id: `${p}-budget`, name: 'budget', label: 'Ownership budget range', type: 'select', required: true, options: site.budgetRanges.options, full: true }),
    horse
      ? `<input type="hidden" name="horse" value="${esc(horse.name)}">`
      : field({ id: `${p}-horse`, name: 'horse', label: 'Horse of interest', type: 'select', optional: true, options: horseOptions, placeholder: 'No preference' }),
    field({ id: `${p}-tier`, name: 'tier', label: 'Preferred ownership tier', type: 'select', optional: true, options: tierOptions, placeholder: 'No preference', full: !!horse }),
    field({ id: `${p}-exp`, name: 'experience', label: 'Previous racing or syndication experience', type: 'select', optional: true, full: true, placeholder: 'Please select', options: ['New to racehorse ownership', 'I follow racing as a spectator', 'I have owned or part-owned a racehorse', 'I have been a member of a syndicate'] }),
    field({ id: `${p}-msg`, name: 'message', label: 'Questions or additional information', type: 'textarea', optional: true, full: true }),
    consentField(`${p}-consent`),
  ].join('\n');

  return formShell({
    id: `${p}-form`,
    subject: horse ? `Ownership enquiry: ${horse.name}` : 'New membership enquiry',
    fields,
    submitLabel: 'Send Enquiry',
    successTitle: 'Thank you - your enquiry has been received',
    successText: 'A member of The Sentinel Syndicate team will be in touch using your preferred contact method to discuss current availability, ownership terms and costs. Submitting this form does not commit you to anything.',
    context: horse ? { horse_profile: `${site.url}/horses/${horse.slug}/` } : {},
  });
}

function contactForm() {
  const p = uid('c');
  const fields = [
    field({ id: `${p}-name`, name: 'name', label: 'Full name', required: true, autocomplete: 'name' }),
    field({ id: `${p}-email`, name: 'email', label: 'Email address', type: 'email', required: true, autocomplete: 'email', inputmode: 'email' }),
    field({ id: `${p}-phone`, name: 'phone', label: 'Telephone number', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', placeholder: '+254 7XX XXX XXX' }),
    choiceGroup({ id: `${p}-method`, name: 'preferred_contact', legend: 'Preferred contact method', options: CONTACT_METHODS, required: true }),
    field({ id: `${p}-msg`, name: 'message', label: 'Your message', type: 'textarea', required: true, full: true }),
    consentField(`${p}-consent`),
  ].join('\n');
  return formShell({
    id: `${p}-form`,
    subject: 'New website contact message',
    fields,
    submitLabel: 'Send Message',
    successTitle: 'Thank you - your message has been sent',
    successText: 'We will reply using your preferred contact method as soon as possible.',
    context: { enquiry_type: 'Contact page message' },
  });
}

module.exports = {
  STATUS, statusOf, horseCard, sampleBanner, noHorsesPanel, pageHero, ctaBand,
  ownershipTier, membershipTier, structurePanel, prizeMoneyNote, contactList,
  membershipForm, contactForm, pedigreeLine, metaLine, credit,
};
