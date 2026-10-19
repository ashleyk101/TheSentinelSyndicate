const { esc, icons } = require('../lib/helpers');
const c = require('../lib/components');
const { whatsappUrl } = require('../lib/layout');

module.exports = ({ site, tiers, horses }) => {
  const own = tiers.ownership;
  const mem = tiers.membership;
  const wa = whatsappUrl(site);

  const body = `
${c.pageHero({
  eyebrow: 'Membership & enquiries',
  title: 'Find the Ownership Level That Suits You',
  lead: 'Ownership opportunities are available at different levels. Compare the tiers below, then contact our team to discuss current availability, ownership terms and associated costs.',
  image: 'gallop',
  crumbs: [{ href: '/', label: 'Home' }, { label: 'Membership' }],
  extra: `<div class="btn-row"><a class="btn" href="#enquire">Discuss Membership Options</a><a class="btn btn--outline" href="#ownership">Compare Tiers</a></div>`,
})}

<section class="section section--forest" id="ownership" aria-labelledby="own-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${esc(own.title)}</p>
      <h2 id="own-title">Own a Share of the Syndicate</h2>
      <p class="lead">${esc(own.intro)}</p>
    </div>
    <div class="tier-grid">${own.tiers.map((t) => c.ownershipTier(t, tiers.currency)).join('')}</div>
    ${c.structurePanel(own.structure)}
    <p class="disclaimer">${c.prizeMoneyNote}</p>
  </div>
</section>

<section class="section section--ivory" id="club" aria-labelledby="club-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">${esc(mem.title)}</p>
      <h2 id="club-title">Sport, Network, Adventure</h2>
      <p class="lead">${esc(mem.intro)}</p>
    </div>
    <div class="tier-grid">${mem.tiers.map((t) => c.membershipTier(t, tiers.currency, { light: true })).join('')}</div>
    <p class="disclaimer">${esc(mem.footnote)} Prices are shown in US dollars as published; Kenya shilling amounts are available on request.</p>
  </div>
</section>

<section class="section section--white" id="enquire" aria-labelledby="enquire-title">
  <div class="container">
    <div class="split split--wide-text" style="align-items:start">
      <div>
        <div class="section-head" style="margin-bottom:2rem">
          <p class="eyebrow">Make an enquiry</p>
          <h2 id="enquire-title">Membership Enquiry</h2>
          <p class="lead">Tell us about your interests and budget. It takes around two minutes, and there is no obligation.</p>
        </div>
        ${c.membershipForm({ site, horses, tiers })}
      </div>
      <aside class="reveal" aria-label="What happens next">
        <div class="ownership-card">
          <p class="tier__label">What happens next</p>
          <ol class="updates" style="margin:1.25rem 0 1.75rem">
            <li><h3 style="font-size:1.35rem;margin:0 0 .25rem">We review your enquiry</h3><p class="small" style="color:var(--muted-on-dark);margin:0">A member of the team reads every enquiry personally.</p></li>
            <li><h3 style="font-size:1.35rem;margin:0 0 .25rem">We contact you</h3><p class="small" style="color:var(--muted-on-dark);margin:0">By phone, WhatsApp or email, as you prefer, to discuss availability, costs and terms.</p></li>
            <li><h3 style="font-size:1.35rem;margin:0 0 .25rem">You review the terms</h3><p class="small" style="color:var(--muted-on-dark);margin:0">You receive the written agreement and documentation before deciding.</p></li>
            <li><h3 style="font-size:1.35rem;margin:0 0 .25rem">Joining is finalised offline</h3><p class="small" style="color:var(--muted-on-dark);margin:0">Payment is arranged directly with the syndicate once terms are agreed.</p></li>
          </ol>
          ${wa ? `<a class="btn btn--block" href="${esc(wa)}" rel="noopener">${icons.whatsapp} Enquire on WhatsApp</a>` : ''}
          <p class="small" style="color:var(--muted-on-dark);margin:1rem 0 0">Prefer to talk? Call <a href="tel:${esc(site.contact.phone)}" style="color:var(--ivory)">${esc(site.contact.phoneDisplay)}</a> or email <a href="mailto:${esc(site.contact.email)}" style="color:var(--ivory)">${esc(site.contact.email)}</a>.</p>
        </div>
      </aside>
    </div>
  </div>
</section>`;

  return [{
    path: '/membership/',
    title: 'Membership & Ownership Tiers',
    description: 'Compare racehorse ownership shares (3%, 5% and 10%) and Silver, Gold and Diamond club memberships with The Sentinel Syndicate, Kenya. Enquire with no obligation.',
    ogImage: 'gallop',
    body,
  }];
};
