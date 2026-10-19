const { esc, isSet, money, tbc, picture, icons } = require('../lib/helpers');
const c = require('../lib/components');

function directory({ site, horses }) {
  const distinct = (k) => [...new Set(horses.map((h) => h[k]).filter(Boolean))];
  const sexes = distinct('sex');
  const ageBands = [...new Set(horses.map((h) => (h.age ? (h.age <= 2 ? '2' : h.age === 3 ? '3' : '4+') : null)).filter(Boolean))];
  const statuses = distinct('status');
  const hasOpen = horses.some((h) => c.statusOf(h).open);
  // Only show filters that have meaningful data behind them.
  const showStatus = statuses.length > 1;
  const showSex = sexes.length > 1;
  const showAge = ageBands.length > 1;
  const showFilters = horses.length > 1;

  const filters = showFilters
    ? `<form class="filters" role="search" aria-label="Filter horses" data-horse-filters>
  <div class="field"><label for="f-q">Search by name or pedigree</label><input class="input" id="f-q" name="q" type="search" autocomplete="off" placeholder="e.g. horse, sire or dam"></div>
  ${showStatus ? `<div class="field"><label for="f-status">Status</label><select class="select" id="f-status" name="status"><option value="">All horses</option>${hasOpen ? '<option value="open">Available for syndication</option>' : ''}${statuses.includes('racing') ? '<option value="racing">Currently racing</option>' : ''}${statuses.filter((s) => !['available', 'racing'].includes(s)).map((s) => `<option value="${esc(s)}">${esc(c.STATUS[s] ? c.STATUS[s].label : s)}</option>`).join('')}</select></div>` : ''}
  ${showSex ? `<div class="field"><label for="f-sex">Sex</label><select class="select" id="f-sex" name="sex"><option value="">Any</option>${sexes.map((s) => `<option>${esc(s)}</option>`).join('')}</select></div>` : ''}
  ${showAge ? `<div class="field"><label for="f-age">Age</label><select class="select" id="f-age" name="age"><option value="">Any</option>${ageBands.sort().map((a) => `<option value="${a}">${a === '4+' ? '4 years and older' : `${a} years old`}</option>`).join('')}</select></div>` : ''}
  <button class="filters__reset" type="reset">Clear filters</button>
</form>
<p class="filters__count" aria-live="polite" data-horse-count></p>`
    : '';

  const body = `
${c.pageHero({
  eyebrow: 'Our horses',
  title: 'Horses Available for Syndication',
  lead: 'Browse the horses in The Sentinel Syndicate, review their background and current status, and enquire about the ownership opportunity that interests you.',
  image: 'stables',
  crumbs: [{ href: '/', label: 'Home' }, { label: 'Our Horses' }],
})}
<section class="section section--ivory">
  <div class="container">
    ${horses.length
      ? `${horses.some((h) => h.sample) ? c.sampleBanner() : ''}
    ${filters}
    <div class="horse-grid">${horses.map((h) => c.horseCard(h, { headingLevel: 2 })).join('')}</div>
    <div class="empty-state no-results" data-no-results>
      <h2 style="font-size:1.9rem">No horses match those filters</h2>
      <p>Try clearing the filters, or tell us what you are looking for and we will let you know about suitable opportunities.</p>
      <a class="btn btn--green" href="/membership/#enquire">Tell Us What You're Looking For</a>
    </div>`
      : c.noHorsesPanel()}
  </div>
</section>
${c.ctaBand({
  title: 'Not Sure Which Horse Is Right for You?',
  text: 'Our team can talk you through current horses, share availability and the costs involved.',
  label: 'Speak to Us About Ownership',
})}`;

  return {
    path: '/horses/',
    title: 'Our Horses - Racehorses Available for Syndication',
    description: 'Racehorses available for shared ownership in Kenya. View profiles, pedigrees, racing status and ownership opportunities with The Sentinel Syndicate.',
    ogImage: 'stables',
    body,
  };
}

function profile({ site, horses, tiers }, h) {
  const s = c.statusOf(h);
  const facts = [
    ['Age', h.age ? `${h.age} years` : null],
    ['Sex', h.sex],
    ['Colour', h.colour],
    ['Foaled', h.foaled],
    ['Trainer', h.trainer],
    ['Status', h.racingStatus],
  ].filter(([, v]) => isSet(v));

  const pedigree = `<dl class="pedigree">
    <div><dt>Sire</dt><dd>${tbc(h.sire)}</dd></div>
    <div><dt>Dam</dt><dd>${tbc(h.dam)}</dd></div>
    <div><dt>Dam's sire</dt><dd>${tbc(h.damsire)}</dd></div>
    <div><dt>Breeder</dt><dd>${tbc(h.breeder)}</dd></div>
  </dl>`;

  const r = h.record;
  const recordHtml = r && r.verified
    ? `<div class="record"><div><strong>${esc(r.starts ?? 0)}</strong><span>Starts</span></div><div><strong>${esc(r.wins ?? 0)}</strong><span>Wins</span></div><div><strong>${esc(r.places ?? 0)}</strong><span>Places</span></div></div>`
    : `<p class="placeholder-note"><strong>Racing record to be confirmed.</strong> ${h.status === 'available' || h.racingStatus === 'In training' ? 'This horse has not yet raced, or its record has not been verified for publication.' : 'Verified starts, wins and placings will be published here.'}</p>`;

  const runs = (h.recentRuns || []).length
    ? `<div class="table-wrap"><table class="data-table data-table--stack"><caption class="visually-hidden">Recent race performances</caption><thead><tr><th scope="col">Date</th><th scope="col">Course</th><th scope="col">Race</th><th scope="col">Distance</th><th scope="col">Position</th><th scope="col">Notes</th></tr></thead><tbody>${h.recentRuns
        .map((x) => `<tr><td data-label="Date">${tbc(x.date)}</td><td data-label="Course">${tbc(x.course)}</td><td data-label="Race">${tbc(x.race)}</td><td data-label="Distance">${tbc(x.distance, '-')}</td><td data-label="Position">${tbc(x.position, '-')}</td><td data-label="Notes">${tbc(x.notes, '')}</td></tr>`)
        .join('')}</tbody></table></div>`
    : '';

  const updates = (h.updates || []).length
    ? `<ol class="updates">${h.updates.map((u) => `<li><time>${esc(u.date)}</time><h3 style="margin:.2em 0;font-size:1.5rem">${esc(u.title)}</h3><p class="muted" style="margin:0">${esc(u.text)}</p></li>`).join('')}</ol>`
    : '';

  const o = h.ownership;
  const ownershipCard = `<div class="ownership-card">
  <p class="tier__label">Ownership opportunity</p>
  <h2>${s.open ? 'Shares in ' + esc(h.name) : esc(s.label)}</h2>
  ${o
    ? `<dl>
      <div><dt>Availability</dt><dd>${esc(o.available || 'On enquiry')}</dd></div>
      <div><dt>Indicative share price</dt><dd>${o.fromKES ? `From KES ${Number(o.fromKES).toLocaleString('en-GB')}` : o.from ? `From ${esc(money(o.from, tiers.currency))}` : 'On enquiry'}</dd></div>
      <div><dt>Ongoing costs</dt><dd>${tbc(h.fees, 'Confirmed on enquiry')}</dd></div>
    </dl>${o.notes ? `<p class="small" style="color:var(--muted-on-dark)">${esc(o.notes)}</p>` : ''}`
    : `<p style="color:var(--muted-on-dark)">${s.open ? 'Share sizes and pricing are confirmed on enquiry.' : 'There are no shares currently available in this horse. Register your interest and we will contact you about future opportunities.'}</p>`}
  <a class="btn btn--block" href="#horse-enquiry">${s.open ? 'Enquire About This Horse' : 'Register Interest'}</a>
  <p class="small" style="color:var(--muted-on-dark);margin:1rem 0 0">Ownership is finalised offline after the written terms are agreed. No payment is taken online.</p>
</div>`;

  const body = `
<section class="profile-hero" aria-labelledby="horse-title">
  <div class="profile-hero__media">${picture(h.image, { eager: true, sizes: '(min-width:960px) 52vw, 100vw' })}</div>
  <div class="profile-hero__body on-dark">
    <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/horses/">Our Horses</a></li><li aria-current="page">${esc(h.name)}</li></ol></nav>
    <div class="tags"><span class="tag ${s.cls}">${esc(s.label)}</span>${h.sample ? '<span class="tag tag--sample">Sample listing - not a real horse</span>' : ''}</div>
    <h1 id="horse-title">${esc(h.name)}</h1>
    <p class="serif-quote" style="color:var(--gold);margin-bottom:1rem">${c.pedigreeLine(h)}</p>
    <p class="lead">${esc(h.introduction || h.summary)}</p>
    ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
  </div>
</section>

<section class="section section--ivory">
  <div class="container profile-layout">
    <div>
      ${h.sample ? c.sampleBanner() : ''}
      <div class="profile-block reveal">
        <p class="eyebrow">Breeding</p>
        <h2>Pedigree</h2>
        ${pedigree}
      </div>
      <div class="profile-block reveal">
        <p class="eyebrow">Form</p>
        <h2>Racing Record</h2>
        ${recordHtml}
        ${runs ? `<h3 style="margin-top:2rem">Recent performances</h3>${runs}` : ''}
      </div>
      ${updates ? `<div class="profile-block reveal"><p class="eyebrow">From the yard</p><h2>Training &amp; Career Updates</h2>${updates}</div>` : ''}
      <p class="small muted" style="margin-top:3rem">Racing performance is uncertain. Past results do not guarantee future performance, and ownership does not guarantee prize money or the return of contributions.</p>
    </div>
    <aside class="profile-aside" aria-label="Ownership opportunity">${ownershipCard}</aside>
  </div>
</section>

<section class="section section--white" id="horse-enquiry" aria-labelledby="horse-enquiry-title">
  <div class="container container--narrow">
    <div class="section-head centre">
      <p class="eyebrow">Enquire</p>
      <h2 id="horse-enquiry-title">${s.open ? `Enquire About ${esc(h.name)}` : 'Register Your Interest'}</h2>
      <p class="lead">${s.open ? 'Tell us a little about yourself and we will be in touch to discuss share availability, costs and the ownership agreement.' : 'This horse is not currently available. Leave your details and we will contact you about future opportunities.'}</p>
    </div>
    ${c.membershipForm({ site, horses, tiers, horse: h })}
  </div>
</section>`;

  const jsonLd = h.sample ? [] : [{
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Our Horses', item: site.url + '/horses/' },
      { '@type': 'ListItem', position: 3, name: h.name, item: `${site.url}/horses/${h.slug}/` },
    ],
  }];

  return {
    path: `/horses/${h.slug}/`,
    title: `${h.name} - ${[h.age ? `${h.age}yo` : '', h.sex].filter(Boolean).join(' ')} Racehorse`.replace(/ - {1,2}Racehorse$/, ' - Racehorse'),
    description: `${h.name}: ${h.summary}`.slice(0, 158),
    ogImage: h.image,
    noindex: !!h.sample,
    jsonLd,
    body,
  };
}

module.exports = (ctx) => [directory(ctx), ...ctx.horses.map((h) => profile(ctx, h))];
