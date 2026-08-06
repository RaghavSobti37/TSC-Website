/**
 * Crawl all routes; flag buttons/links with blank, numeric Wix names, or stale blog-N.
 */
const puppeteer = require('puppeteer');
const http = require('http');

const base = process.argv[2] || 'http://127.0.0.1:3000';
const BAD = /\/(blank(?:-[\w-]*)?|work\d+(?:-[\w-]*)?|about-\d+(?:-[\w-]*)?|blog-[0-9]+)(?:\/|$|\?|#)/i;

const routes = [
  '/', '/about', '/work', '/artists', '/artist-path', '/learn-with-tsc', '/films', '/resources', '/academy',
  '/mba', '/havells-myousic', '/insta-music-league', '/young-gunns',
  '/harshad-duhita', '/yugm',
  '/mahavatar-narsimha', '/hanuman-ansh', '/mahaprbhu', '/kalki',
  '/start-making-music', '/online-music-course-worth-it', '/artist-release-playbook',
  '/from-bhajan-to-clubbing', '/you-released-a-song-now-what',
  '/how-i-curate-music-with-independent-artists',
  '/roots-of-hindustani-classical', '/the-heart-of-composition',
  '/book-a-call', '/book-an-artist', '/artist-query', '/collab-query',
  '/masterclass-review01', '/masterclass-review02', '/classicalreview',
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const allBad = [];
  const statusFails = [];

  for (const route of routes) {
    const res = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!res || res.status() >= 400) statusFails.push({ route, status: res && res.status() });
    await new Promise((r) => setTimeout(r, 1200));
    const found = await page.evaluate((badReSource) => {
      const re = new RegExp(badReSource, 'i');
      return [...document.querySelectorAll('a[href]')].map((a) => {
        const href = a.getAttribute('href') || '';
        return { href, text: (a.textContent || '').trim().slice(0, 40) };
      }).filter((x) => re.test(x.href));
    }, BAD.source);
    if (found.length) allBad.push({ route, found });
    console.log(`${found.length ? 'BAD' : 'OK'}\t${route}\tbadLinks=${found.length}`);
  }

  await browser.close();
  console.log(JSON.stringify({ statusFails, badRoutes: allBad.length, sample: allBad.slice(0, 5) }, null, 2));
  process.exit(statusFails.length || allBad.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
