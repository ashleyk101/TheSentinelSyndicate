const { esc, picture, credit, icons } = require('../lib/helpers');
const c = require('../lib/components');

module.exports = ({ site, horses, tiers }) => {
  const featured = horses.slice(0, 3);
  const hasSamples = featured.some((h) => h.sample);
  const own = tiers.ownership;
  const mem = tiers.membership;
  const memFrom = Math.min(...mem.tiers.map((t) => t.price));

  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">${picture('hero', { eager: true, sizes: '100vw' })}</div>
  <div class="container hero__content">
    <p class="eyebrow">Racehorse ownership · Kenya</p>
    <h1 id="hero-title">Own the Experience. Share the Ambition.</h1>
    <p class="hero__copy">Discover racehorse ownership through The Sentinel Syndicate. Share in the excitement of Kenyan horse racing, follow your horse's journey and experience the sport from a closer perspective.</p>
    <div class="btn-row">
      <a class="btn" href="/horses/">Explore Our Horses</a>
      <a class="btn btn--outline" href="/how-ownership-works/">Discover Syndicate Ownership</a>
    </div>
    <div class="hero__foot" aria-hidden="true"><span>Sport</span><span>Network</span><span>Adventure</span><span>Opportunity</span></div>
  </div>
</section>

<section class="section section--ivory" aria-labelledby="intro-title">
  <div class="container">
    <div class="split split--wide-text">
      <div class="reveal">
        <p class="eyebrow">The syndicate</p>
        <h2 id="intro-title">A Different Way to Experience Racing</h2>
        <p class="lead">Syndication allows a group of members to share ownership of a racehorse under an agreed ownership structure, so the cost, the responsibility and the excitement are shared.</p>
        <p>As a member you are part of the horse's journey: its preparation, its progress on the gallops and its racing career. When it runs, you experience race day as one of its owners, alongside people who share the same interest in the sport.</p>
        <a class="text-link" href="/our-syndicate/">About The Sentinel Syndicate ${icons.arrow}</a>
      </div>
      <figure class="figure reveal">
        <div class="frame frame--portrait frame--bordered">${picture('ngongHills', { sizes: '(min-width:900px) 40vw, 92vw' })}</div>
        <figcaption class="figcaption">The Ngong Hills, Nairobi. ${credit('ngongHills')}</figcaption>
      </figure>
    </div>
    <hr class="rule">
    <ol class="values">
      <li class="value reveal"><span class="value__num">I.</span><h3>Shared Ownership</h3><p>Explore opportunities to take part in racehorse ownership through different share and membership tiers.</p></li>
      <li class="value reveal"><span class="value__num">II.</span><h3>Closer to the Sport</h3><p>Follow the development, preparation and racing journey of the horses through regular syndicate updates.</p></li>
      <li class="value reveal"><span class="value__num">III.</span><h3>The Race Day Experience</h3><p>Become more involved in the excitement and community that surround horse racing in Kenya.</p></li>
    </ol>
  </div>
</section>

<section class="section section--white" aria-labelledby="horses-title">
  <div class="container">
    <div class="section-head section-head--row">
      <div>
        <p class="eyebrow">Our horses</p>
        <h2 id="horses-title">Horses Available for Syndication</h2>
        <p class="lead">Each profile sets out the horse's background, pedigree, current status and the ownership opportunity available.</p>
      </div>
      <a class="btn btn--ghost-dark" href="/horses/">Explore All Horses</a>
    </div>
    ${featured.length ? `${hasSamples ? c.sampleBanner() : ''}<div class="horse-grid">${featured.map((h) => c.horseCard(h)).join('')}</div>` : c.noHorsesPanel()}
  </div>
</section>

<section class="section section--green" aria-labelledby="how-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">How it works</p>
      <h2 id="how-title">From First Enquiry to Ownership</h2>
      <p class="lead">A simple, personal process. You will always have the full terms in writing before you commit to anything.</p>
    </div>
    <ol class="steps">
      <li class="step reveal"><span class="step__num" aria-hidden="true">I</span><h3>Explore</h3><p>Browse available horses and learn about each horse's background.</p></li>
      <li class="step reveal"><span class="step__num" aria-hidden="true">II</span><h3>Enquire</h3><p>Submit an enquiry about a horse or an ownership tier.</p></li>
      <li class="step reveal"><span class="step__num" aria-hidden="true">III</span><h3>Discuss</h3><p>We explain the available shares, fees, ownership arrangements and relevant documentation.</p></li>
      <li class="step reveal"><span class="step__num" aria-hidden="true">IV</span><h3>Join</h3><p>Membership and payment are finalised offline, once the terms have been agreed.</p></li>
    </ol>
    <p class="notice-line">${icons.info}<span>An enquiry does not constitute a purchase, reservation or completed transfer of ownership. No payment is taken through this website.</span></p>
  </div>
</section>

<section class="section section--forest" aria-labelledby="tiers-title">
  <div class="container">
    <div class="section-head centre">
      <p class="eyebrow">Ownership tiers</p>
      <h2 id="tiers-title">Ownership at a Level That Suits You</h2>
      <p class="lead">Ownership opportunities are available at different levels. Contact our team to discuss current availability, ownership terms and associated costs.</p>
    </div>
    <div class="tier-grid">${own.tiers.map((t) => c.ownershipTier(t, tiers.currency)).join('')}</div>
    ${c.structurePanel(own.structure)}
    <div class="structure reveal" style="grid-template-columns:1fr auto">
      <div>
        <p class="tier__label" style="margin:0 0 .4rem">Club membership</p>
        <p class="serif-quote" style="margin:0">Silver, Gold and Diamond annual memberships, from USD ${memFrom.toLocaleString('en-GB')} per year.</p>
      </div>
      <a class="btn btn--outline" href="/membership/#club">View Memberships</a>
    </div>
    <p class="disclaimer">${c.prizeMoneyNote} Prices are shown in US dollars as published by the syndicate; Kenya shilling amounts are available on request.</p>
    <div class="btn-row" style="margin-top:2rem"><a class="btn" href="/membership/#enquire">Discuss Membership Options</a></div>
  </div>
</section>

<section class="statement" aria-labelledby="statement-title">
  <div class="statement__media">${picture('maraSunset', { sizes: '100vw' })}</div>
  <div class="container">
    <div class="statement__content reveal">
      <span class="chequer" aria-hidden="true" style="margin-bottom:2rem"></span>
      <h2 id="statement-title">More Than Watching the Race. Being Part of the Journey.</h2>
      <p>Ownership begins long before the stalls open. It is the early mornings and the training reports, the first entry and the walk into the parade ring, and the anticipation you share with fellow owners as the field turns for home.</p>
    </div>
  </div>
  <p class="credit">Northern Mara, Kenya. ${credit('maraSunset')}</p>
</section>

${c.ctaBand({
  title: 'Your Journey into Racehorse Ownership Starts Here',
  text: 'Discover the available horses and speak with The Sentinel Syndicate about the ownership opportunities that suit you.',
  label: 'Make an Enquiry',
  tone: 'ivory',
  secondary: site.contact.whatsapp ? `<a class="btn btn--ghost-dark" href="/contact/">Contact the Team</a>` : '',
})}`;

  return [
    {
      path: '/',
      title: `${site.name} | Racehorse Syndication in Kenya`,
      ogTitle: 'Own the Experience. Share the Ambition.',
      description: 'Shared racehorse ownership in Kenya. Explore horses available for syndication, ownership tiers and membership with The Sentinel Syndicate.',
      overlayHeader: true,
      body,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: site.name,
          url: site.url,
          foundingDate: String(site.established),
          email: site.contact.email || undefined,
          telephone: site.contact.phone || undefined,
          areaServed: 'KE',
          description: site.description,
        },
        { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'en-GB' },
      ],
    },
  ];
};
