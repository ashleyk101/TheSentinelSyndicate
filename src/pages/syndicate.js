const { esc, picture, credit, icons } = require('../lib/helpers');
const c = require('../lib/components');

module.exports = ({ site, horses }) => {
  const team = site.team || [];
  const milestones = site.milestones || [];

  const teamHtml = team.length
    ? `<div class="grid grid--3">${team
        .map((m) => `<article class="reveal">${m.image ? `<div class="frame frame--portrait" style="margin-bottom:1.25rem">${picture(m.image, { sizes: '(min-width:760px) 30vw, 92vw' })}</div>` : ''}<p class="eyebrow eyebrow--plain">${esc(m.role)}</p><h3>${esc(m.name)}</h3><p class="muted">${esc(m.bio)}</p></article>`)
        .join('')}</div>`
    : `<p class="placeholder-note"><strong>Team profiles to be added.</strong> Verified biographies of the syndicate's founder, management and racing partners will be published here once confirmed.</p>`;

  const milestonesHtml = milestones.length
    ? `<ol class="updates">${milestones.map((m) => `<li><time>${esc(m.date)}</time><h3 style="margin:.2em 0">${esc(m.title)}</h3><p class="muted">${esc(m.text)}</p></li>`).join('')}</ol>`
    : `<p class="placeholder-note"><strong>Racing activity to be added.</strong> Verified milestones, race-day highlights and news will appear here as they are confirmed.</p>`;

  const body = `
${c.pageHero({
  eyebrow: `Our syndicate · Est. ${site.established}`,
  title: 'Bringing Owners Closer to the Sport',
  lead: 'The Sentinel Syndicate offers shared ownership of thoroughbred racehorses in Kenya, for people who want to experience racing as owners rather than spectators.',
  image: 'ngongRidge',
  crumbs: [{ href: '/', label: 'Home' }, { label: 'Our Syndicate' }],
})}

<section class="section section--ivory" aria-labelledby="who-title">
  <div class="container">
    <div class="split split--wide-text">
      <div class="reveal">
        <p class="eyebrow">Who we are</p>
        <h2 id="who-title">People, Horses, Opportunity</h2>
        <p class="lead">Established in ${esc(site.established)}, The Sentinel Syndicate is a Kenyan racehorse syndicate built around a simple idea: that the experience of owning a racehorse should be open to more people, and shared.</p>
        <p>We bring members together to share ownership of horses under a clear, written structure. Alongside ownership, our club membership brings members into a wider circle of sport, networking and shared experiences.</p>
      </div>
      <figure class="figure reveal">
        <div class="frame frame--landscape">${picture('stableAisle', { sizes: '(min-width:900px) 40vw, 92vw' })}</div>
        <figcaption class="figcaption">Illustrative photograph.</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="section section--white" aria-labelledby="approach-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">How we work</p>
      <h2 id="approach-title">Our Approach to Syndication</h2>
    </div>
    <ul class="topic-list">
      <li class="topic reveal">
        <h3>A clear ownership structure</h3>
        <p>Every member's share is defined in units of ownership and set out in a written agreement before any commitment is made. You will know what you own, what it costs and how decisions are taken.</p>
      </li>
      <li class="topic reveal">
        <h3>Transparent communication</h3>
        <p>We are committed to keeping members informed: regular updates on each horse's training and racing, clear explanations of costs, and prompt notice of anything that affects your share.</p>
      </li>
      <li class="topic reveal">
        <h3>What to understand before joining</h3>
        <p>Shared ownership is a way to enjoy the sport, not a financial investment. Racing results are uncertain, horses can be injured, and costs continue whether or not a horse wins. We encourage every prospective member to read the full terms carefully.</p>
      </li>
      <li class="topic reveal">
        <h3>The professionals around each horse</h3>
        <p>Owners share in the decisions and the experience; licensed trainers, jockeys, veterinary surgeons and farriers take care of the horse's preparation and welfare day to day. The syndicate manages the relationship between members and these professionals.</p>
      </li>
    </ul>
  </div>
</section>

<section class="statement" aria-labelledby="ambition-title">
  <div class="statement__media">${picture('ngongHills', { sizes: '100vw' })}</div>
  <div class="container">
    <div class="statement__content reveal">
      <p class="eyebrow">Our ambitions</p>
      <h2 id="ambition-title">A Place in Kenyan Racing</h2>
      <p>Kenyan racing has a long tradition, centred on Ngong Racecourse in Nairobi. Our ambition is to bring a new generation of owners into the sport, to campaign our horses with care and ambition, and to make ownership in Kenya a more connected and rewarding experience.</p>
    </div>
  </div>
  <p class="credit">Ngong Hills, Kenya. ${credit('ngongHills')}</p>
</section>

<section class="section section--ivory" aria-labelledby="team-title">
  <div class="container">
    <div class="grid grid--2" style="gap:4rem">
      <div>
        <p class="eyebrow">The team</p>
        <h2 id="team-title">Who You Will Work With</h2>
        ${teamHtml}
      </div>
      <div>
        <p class="eyebrow">Racing activity</p>
        <h2>Milestones &amp; News</h2>
        ${milestonesHtml}
      </div>
    </div>
  </div>
</section>

${c.ctaBand({
  title: 'Meet the Horses',
  text: horses.length ? 'See the horses currently available for syndication and read their profiles.' : 'Speak to us about the horses currently in the syndicate and the shares available now.',
  href: horses.length ? '/horses/' : '/membership/#enquire',
  label: horses.length ? 'Explore Our Horses' : 'Enquire About Ownership',
})}`;

  return [{
    path: '/our-syndicate/',
    title: 'Our Syndicate',
    description: 'The Sentinel Syndicate is a Kenyan racehorse syndicate established in 2024, offering shared ownership with clear structures and transparent communication.',
    ogImage: 'ngongRidge',
    body,
  }];
};
