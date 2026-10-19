const { esc } = require('../lib/helpers');
const c = require('../lib/components');

const draftNote = `<div class="placeholder-note" style="margin-bottom:2.5rem"><strong>Draft for legal review.</strong> This document has been prepared as a starting point and must be reviewed by a qualified Kenyan advocate, including against the Data Protection Act, 2019, before it is relied upon. Items in [square brackets] need to be completed by The Sentinel Syndicate.</div>`;

module.exports = ({ site, images }) => {
  const email = site.contact.email;
  const updated = '[date of approval]';

  const privacy = `
${c.pageHero({ eyebrow: 'Legal', title: 'Privacy Policy', crumbs: [{ href: '/', label: 'Home' }, { label: 'Privacy policy' }] })}
<section class="section section--ivory"><div class="container container--text prose">
${draftNote}
<p class="muted">Last updated: ${updated}</p>
<h2>Who we are</h2>
<p>${esc(site.name)} ("we", "us") is a racehorse syndicate operating in Kenya. For the purposes of the Data Protection Act, 2019 we are the data controller of the personal data described in this policy. [Insert registered business name, registration number, physical address and Office of the Data Protection Commissioner registration details, if applicable.]</p>
<p>Contact for privacy matters: <a href="mailto:${esc(email)}">${esc(email)}</a>.</p>

<h2>What we collect</h2>
<p>When you submit an enquiry or contact form we collect the details you choose to provide: your name, email address, telephone number, preferred contact method, budget range, the horse or tier you are interested in, your racing experience and any message you write. We do not collect payment details through this website.</p>
<p>If analytics are enabled and you consent, we collect information about how you use the site, such as pages visited, device type and approximate location derived from your IP address.</p>

<h2>Why we use it, and our lawful basis</h2>
<ul>
  <li>To respond to your enquiry and discuss membership or ownership with you - based on your consent and on steps taken at your request before entering into an agreement.</li>
  <li>To keep records of enquiries and correspondence - based on our legitimate interests in running the syndicate.</li>
  <li>To understand and improve how the website is used - only with your consent to analytics cookies.</li>
</ul>
<p>We do not sell your personal data or use it for advertising. We will only send you marketing messages if you separately agree to receive them.</p>

<h2>Who we share it with</h2>
<p>Form submissions are delivered to us by Web3Forms, an email-forwarding service that processes data on our behalf. If analytics are enabled, Google Analytics processes usage data on our behalf. These providers may store data outside Kenya; where this happens we rely on appropriate safeguards as required by sections 48 to 50 of the Data Protection Act, 2019. [Confirm the providers in use and the safeguards relied on.]</p>
<p>We may also share information with professional advisers, or where required by law.</p>

<h2>How long we keep it</h2>
<p>We keep enquiry details for as long as needed to deal with your enquiry and for [period, e.g. 24 months] afterwards, unless you become a member, in which case your data is handled under the member privacy terms provided with your agreement. [Confirm retention periods.]</p>

<h2>Your rights</h2>
<p>Under the Data Protection Act, 2019 you have the right to be informed of how your data is used, to access your personal data, to object to processing, to have inaccurate data corrected and to have false or misleading data deleted, and to withdraw consent at any time. To exercise these rights, email <a href="mailto:${esc(email)}">${esc(email)}</a>.</p>
<p>If you are unhappy with how we have handled your data, you may complain to the Office of the Data Protection Commissioner (ODPC) of Kenya.</p>

<h2>Cookies</h2>
<p>This website does not use advertising cookies. Analytics cookies are only set if analytics are enabled and you accept them in the cookie banner; you can change your choice at any time using "Cookie preferences" in the footer. A small entry in your browser's local storage remembers your choice.</p>

<h2>Security</h2>
<p>This website is served over an encrypted connection and form submissions are sent securely. No method of transmission over the internet is completely secure, so please do not include sensitive information, such as identity or financial details, in enquiry messages.</p>

<h2>Changes</h2>
<p>We may update this policy from time to time. The latest version will always be published on this page.</p>
</div></section>`;

  const terms = `
${c.pageHero({ eyebrow: 'Legal', title: 'Terms and Conditions', crumbs: [{ href: '/', label: 'Home' }, { label: 'Terms and conditions' }] })}
<section class="section section--ivory"><div class="container container--text prose">
${draftNote}
<p class="muted">Last updated: ${updated}</p>
<h2>About these terms</h2>
<p>These terms govern your use of the ${esc(site.name)} website. By using the website you accept them. [Insert registered business name and address.]</p>

<h2>Information only - not an offer</h2>
<p>The website provides general information about ${esc(site.name)}, its horses and its membership and ownership tiers. Nothing on the website is an offer to sell, a solicitation of investment, or financial, legal or tax advice. Any membership or ownership is subject solely to a separate written agreement, which prevails over anything on this website.</p>

<h2>Enquiries</h2>
<p>Submitting an enquiry does not create a purchase, reservation, membership or transfer of ownership, and does not oblige you or us to enter into any agreement. Prices, share availability and benefits shown on the website are indicative, may change and are confirmed in writing before any commitment.</p>

<h2>Risk</h2>
<p>Horse racing involves sporting and financial uncertainty. Ownership or membership does not guarantee prize money, profits or the recovery of any contribution. Past racing performance is not a guide to future performance.</p>

<h2>Accuracy</h2>
<p>We take care to keep the website accurate, but information about horses, racing records and availability may change and is provided without warranty. Sample listings and placeholder content are labelled as such and do not describe real horses or offers. Photographs are illustrative unless stated otherwise.</p>

<h2>Intellectual property</h2>
<p>The website content, name and branding belong to ${esc(site.name)} or its licensors. Third-party photographs are used under their respective licences, listed on our <a href="/credits/">photo credits</a> page.</p>

<h2>Liability</h2>
<p>To the extent permitted by Kenyan law, we are not liable for any loss arising from reliance on the website's content. Nothing in these terms limits liability that cannot be limited by law.</p>

<h2>Governing law</h2>
<p>These terms are governed by the laws of Kenya, and the Kenyan courts have jurisdiction over any dispute.</p>

<h2>Contact</h2>
<p>Questions about these terms: <a href="mailto:${esc(email)}">${esc(email)}</a>.</p>
</div></section>`;

  const credited = Object.entries(images).filter(([k, v]) => k[0] !== '_' && v.credit);
  const unsplash = Object.entries(images).filter(([k, v]) => k[0] !== '_' && v.unsplash);
  const credits = `
${c.pageHero({ eyebrow: 'Legal', title: 'Photo Credits', crumbs: [{ href: '/', label: 'Home' }, { label: 'Photo credits' }] })}
<section class="section section--ivory"><div class="container container--text prose">
<p class="lead">Photography on this website is illustrative. Unless a caption says otherwise, images do not show horses owned by ${esc(site.name)}.</p>
<h2>Kenyan photography</h2>
<ul class="credits">${credited.map(([, v]) => `<li><strong>${esc(v.credit.title)}</strong><br>by ${esc(v.credit.author)}, licensed under <a href="${esc(v.credit.licenceUrl)}" rel="noopener license">${esc(v.credit.licence)}</a>, via <a href="${esc(v.credit.source)}" rel="noopener">Wikimedia Commons</a>. Cropped for layout.</li>`).join('')}</ul>
<h2>Racing photography</h2>
<p>${unsplash.length} photographs are used under the <a href="https://unsplash.com/license" rel="noopener">Unsplash Licence</a>.</p>
</div></section>`;

  return [
    { path: '/privacy/', title: 'Privacy Policy', description: `How ${site.name} collects and uses personal data, in line with Kenya's Data Protection Act, 2019.`, body: privacy },
    { path: '/terms/', title: 'Terms and Conditions', description: `Terms of use for the ${site.name} website.`, body: terms },
    { path: '/credits/', title: 'Photo Credits', description: `Photography credits for the ${site.name} website.`, body: credits },
  ];
};
