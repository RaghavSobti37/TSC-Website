/**
 * Clone-faithful harden — skip heavy /films puppeteer evaluate (Wix thrash).
 * Films checks are static HTML + HTTP status.
 */
const puppeteer = require('puppeteer');
const http = require('http');

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';

function fetchText(path) {
  return new Promise((resolve, reject) => {
    http.get(BASE + path, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function check(path, fn) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    protocolTimeout: 60000,
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise((r) => setTimeout(r, 2000));
    const info = await page.evaluate(fn);
    console.log('\n===' + path + '===');
    console.log(JSON.stringify(info, null, 2));
    return info;
  } finally {
    await browser.close();
  }
}

(async () => {
  let failed = 0;

  const home = await check('/', () => {
    const ads = document.querySelector('#WIX_ADS, .WIX_ADS');
    const footer = document.querySelector('.tsc-desktop-footer');
    const titles = footer
      ? Array.from(footer.querySelectorAll('h2,h3')).map((n) => (n.textContent || '').trim()).filter(Boolean)
      : [];
    return {
      vw: innerWidth,
      adsGone: !ads || getComputedStyle(ads).display === 'none',
      footerTitles: titles,
    };
  });
  if (home.vw !== 1280 || !home.adsGone || home.footerTitles.join('|') !== 'Start Here|Quick Links|Explore|Join Our Community') {
    console.error('FAIL home');
    failed += 1;
  }

  const about = await check('/about', () => ({
    originalsInDom: !!document.getElementById('comp-mqmh352i'),
  }));
  if (about.originalsInDom) {
    console.error('FAIL about originals present');
    failed += 1;
  }

  const academy = await check('/academy', () => {
    const footer = document.querySelector('.tsc-desktop-footer');
    const titles = footer
      ? Array.from(footer.querySelectorAll('h2,h3')).map((n) => (n.textContent || '').trim()).filter(Boolean)
      : [];
    return { footerTitles: titles, hasLucaLink: !!document.querySelector('a[href="/music-production"]') };
  });
  if (academy.footerTitles[1] !== 'Academy' || !academy.hasLucaLink) {
    console.error('FAIL academy', academy);
    failed += 1;
  }

  const films = await fetchText('/films');
  console.log('\n===/films (static)===', films.status, 'len', films.body.length);
  if (films.status !== 200) {
    console.error('FAIL films status');
    failed += 1;
  }
  if (!/#comp-mqmh352i[\s\S]{0,80}display:\s*none/.test(films.body) && !films.body.includes('#comp-mqmh352i')) {
    console.error('FAIL films missing originals hide target');
    failed += 1;
  }
  if (films.body.includes('MutationObserver(schedule)')) {
    console.error('FAIL films still has thrashing MutationObserver');
    failed += 1;
  }
  if (films.body.includes('setText(labelSelectors')) {
    console.error('FAIL films still rewrites card copy');
    failed += 1;
  }
  ['/mahavatar-narsimha-impact', '/hanuman-ansh-impact', '/mahaprabhu-jagannath-impact', '/kalki-impact'].forEach((h) => {
    if (!films.body.includes(h)) {
      console.error('FAIL films missing href', h);
      failed += 1;
    }
  });

  const lucaPage = await fetchText('/music-production');
  console.log('\n===/music-production (static)===', lucaPage.status);
  if (lucaPage.status !== 200 || !/Luca Petracca/i.test(lucaPage.body)) {
    console.error('FAIL luca content');
    failed += 1;
  }
  if (!lucaPage.body.includes('music-production.animations.js') || !lucaPage.body.includes('tsc-wix-motion')) {
    console.error('FAIL luca motion assets');
    failed += 1;
  }

  const impact = await fetchText('/mahavatar-narsimha-impact');
  console.log('\n===/impact (static)===', impact.status);
  if (impact.status !== 200 || !/report-page|Impact/i.test(impact.body)) {
    console.error('FAIL impact');
    failed += 1;
  }

  const css = await fetchText('/css/tsc-desktop-nav-lock.css?v=nav-lock-noop-1');
  if (/width:\s*205|mix-blend|filter:\s/.test(css.body)) {
    console.error('FAIL nav-lock not noop');
    failed += 1;
  }

  if (failed) {
    console.error('\nVERIFY FAILED', failed);
    process.exit(1);
  }
  console.log('\nVERIFY OK');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
