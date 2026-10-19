const { picture } = require('../lib/helpers');

module.exports = () => [{
  path: '/404.html',
  file: '404.html',
  title: 'Page Not Found',
  description: 'The page you were looking for could not be found.',
  noindex: true,
  body: `
<section class="page-hero not-found">
  <div class="page-hero__media">${picture('loose', { eager: true })}</div>
  <div class="container page-hero__content">
    <p class="eyebrow">Error 404</p>
    <h1>This One Has Bolted</h1>
    <p class="lead">The page you were looking for has moved or no longer exists. Let us take you back to familiar ground.</p>
    <div class="btn-row" style="margin-top:2rem">
      <a class="btn" href="/">Return Home</a>
      <a class="btn btn--outline" href="/horses/">View Our Horses</a>
      <a class="btn btn--outline" href="/contact/">Contact Us</a>
    </div>
  </div>
</section>`,
}];
