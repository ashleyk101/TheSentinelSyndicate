const { icons } = require('../lib/helpers');
const c = require('../lib/components');

const TOPICS = [
  ['What racehorse syndication means',
    `<p>A syndicate is a group of people who together own a racehorse, or a share of one. Instead of carrying the full purchase price and running costs alone, each member owns a portion and contributes in proportion to it, while sharing in the experience of ownership.</p>`],
  ['How multiple people share ownership of a horse',
    `<p>The syndicate holds the horse under a single ownership structure, and each member's interest is recorded against it. Day-to-day decisions about training and racing are made with the trainer and managed by the syndicate, with members kept informed. How decisions are taken, and which matters members are consulted on, is set out in the written agreement.</p>`],
  ['How ownership percentages or shares are defined',
    `<p>The Sentinel Syndicate expresses ownership in <strong>units</strong>, where one unit represents a 1% ownership interest. Current published tiers are 3%, 5% and 10% shares. The exact share you hold, and what it relates to, is stated in your agreement.</p>`],
  ['How initial purchase contributions are determined',
    `<p>Your initial contribution reflects the size of your share and the value placed on the horse or horses in the syndicate. Current published contributions are shown on our <a href="/membership/">Membership page</a>. The figure that applies to you is confirmed in writing before you commit.</p>`],
  ['How training, veterinary, transport and entry costs may be allocated',
    `<p>Keeping a racehorse in training involves ongoing costs, typically including training fees, veterinary care, farriery, transport, race entries, jockey fees and insurance. How these costs are shared between members, and whether any are included in your contribution, is defined in the syndicate agreement and explained to you during the discussion stage.</p>`],
  ['How ongoing contributions are handled',
    `<p>Where members contribute to ongoing costs, the amount, frequency and method of payment are set out in the agreement. All payments are arranged offline; this website never takes payments or card details.</p>`],
  ['How prize money is distributed',
    `<p>If a horse earns prize money, it is distributed under the applicable ownership agreement, normally in proportion to each member's share and after relevant expenses and deductions. Prize money is never guaranteed, and many horses earn little or none.</p>`],
  ['How ownership records and documentation are managed',
    `<p>The syndicate keeps a record of each member's share and provides the documentation that sets out your ownership and obligations. Ask us which documents you will receive, and when, as part of your enquiry.</p>`],
  ['What happens if a horse is injured, retires or is sold',
    `<p>Injury, retirement and sale are a normal part of a racehorse's life. The agreement explains how each situation is handled, including how decisions are made, how any sale proceeds or costs are shared, and what happens to your membership. We will walk you through these provisions before you join.</p>`],
  ['How to obtain the full terms before committing',
    `<p>Ask us at any stage for the full written terms. We encourage every prospective member to read them carefully, ask questions and take independent advice if they wish, before making any commitment.</p>`],
];

module.exports = () => {
  const body = `
${c.pageHero({
  eyebrow: 'How ownership works',
  title: 'Racehorse Syndication, Clearly Explained',
  lead: 'Everything you need to understand before becoming a member of The Sentinel Syndicate, in plain language.',
  image: 'riftValley',
  crumbs: [{ href: '/', label: 'Home' }, { label: 'How Ownership Works' }],
})}

<section class="section section--ivory" aria-labelledby="basics-title">
  <div class="container">
    <div class="split split--wide-text" style="align-items:start">
      <div class="reveal">
        <p class="eyebrow">The essentials</p>
        <h2 id="basics-title">Shared Ownership, Shared Experience</h2>
        <p class="lead">Syndication makes racehorse ownership accessible by sharing a horse, and its costs, between members. The specifics of any arrangement are always governed by the syndicate's written agreement.</p>
        <p>The answers below describe how syndication generally works and how The Sentinel Syndicate approaches it. They are a guide, not a contract. Where your agreement says something different, the agreement applies.</p>
      </div>
      <figure class="figure reveal">
        <div class="frame frame--landscape">${require('../lib/helpers').picture('tack', { sizes: '(min-width:900px) 40vw, 92vw' })}</div>
        <figcaption class="figcaption">Illustrative photograph.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section section--white" aria-labelledby="questions-title">
  <div class="container container--narrow">
    <div class="section-head">
      <p class="eyebrow">Your questions</p>
      <h2 id="questions-title">How It Works in Practice</h2>
    </div>
    <div class="explainer">
      ${TOPICS.map(([q, a], i) => `<details${i < 2 ? ' open' : ''}><summary>${q}</summary><div class="explainer__body prose">${a}</div></details>`).join('')}
    </div>
  </div>
</section>

<section class="section section--sand" aria-labelledby="risk-title">
  <div class="container container--narrow">
    <div class="risk-panel reveal">
      ${icons.scales}
      <div>
        <h2 id="risk-title">Please Read: Racing Involves Uncertainty</h2>
        <p>Horse racing involves sporting and financial uncertainty. Membership does not guarantee prize money, profits or recovery of contributions. Horses may be injured, lose form or never win a race, and costs continue regardless of results.</p>
        <p style="margin:0">Syndicate ownership should be approached as a way to enjoy the sport, using money you can afford to commit. The Sentinel Syndicate does not provide financial, legal or tax advice.</p>
      </div>
    </div>
  </div>
</section>

${c.ctaBand({
  title: 'Speak to Us About Ownership',
  text: 'Ask us anything, request the full terms or talk through which tier might suit you. There is no obligation.',
  label: 'Speak to Us About Ownership',
})}`;

  return [{
    path: '/how-ownership-works/',
    title: 'How Racehorse Syndication Works in Kenya',
    description: 'A clear guide to racehorse syndication in Kenya: shares, contributions, costs, prize money, documentation and what happens if a horse is injured, retires or is sold.',
    ogImage: 'riftValley',
    body,
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: TOPICS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })),
    }],
  }];
};
