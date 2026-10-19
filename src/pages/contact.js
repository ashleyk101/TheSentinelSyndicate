const { esc, icons, credit } = require('../lib/helpers');
const c = require('../lib/components');
const { whatsappUrl } = require('../lib/layout');

module.exports = ({ site }) => {
  const wa = whatsappUrl(site);
  const body = `
${c.pageHero({
  eyebrow: 'Contact',
  title: 'Speak with The Sentinel Syndicate',
  lead: 'Whether you have a question about a horse, ownership costs or membership, we would be pleased to hear from you.',
  image: 'nairobi',
  crumbs: [{ href: '/', label: 'Home' }, { label: 'Contact' }],
  extra: wa ? `<div class="btn-row"><a class="btn" href="${esc(wa)}" rel="noopener">${icons.whatsapp} Enquire on WhatsApp</a></div>` : '',
})}
<section class="section section--ivory">
  <div class="container">
    <div class="split" style="align-items:start">
      <div class="reveal">
        <p class="eyebrow">Direct contact</p>
        <h2>Get in Touch</h2>
        <p class="lead" style="margin-bottom:2rem">Based in Kenya. Phone numbers are shown in international format for visitors calling from abroad.</p>
        ${c.contactList(site)}
        ${site.contact.hours ? `<p class="muted small" style="margin-top:1.5rem">${esc(site.contact.hours)}</p>` : ''}
        <p class="small muted" style="margin-top:2rem">Interested in a share or membership? The <a href="/membership/#enquire">membership enquiry form</a> asks a few extra questions so we can prepare the right information for you.</p>
      </div>
      <div>
        <p class="eyebrow">Send a message</p>
        <h2>Contact Form</h2>
        ${c.contactForm()}
      </div>
    </div>
  </div>
</section>
<p class="container small muted" style="padding-bottom:1.5rem;background:var(--ivory);margin:0;max-width:none">Header image: Nairobi skyline. ${credit('nairobi')}</p>`;

  return [{
    path: '/contact/',
    title: 'Contact Us',
    description: 'Contact The Sentinel Syndicate in Kenya by phone, WhatsApp or email to discuss racehorse ownership and membership.',
    ogImage: 'nairobi',
    body,
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact The Sentinel Syndicate',
      url: site.url + '/contact/',
      mainEntity: { '@type': 'Organization', name: site.name, url: site.url, email: site.contact.email || undefined, telephone: site.contact.phone || undefined, areaServed: 'KE' },
    }],
  }];
};
