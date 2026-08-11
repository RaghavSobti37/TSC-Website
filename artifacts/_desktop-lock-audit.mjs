import puppeteer from 'puppeteer';
import fs from 'fs';

const out = 'artifacts/desktop-lock-audit';
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const routes = ['/', '/about', '/films'];
const report = [];

for (const route of routes) {
  console.log('goto', route);
  await page.goto('http://127.0.0.1:3000' + route, {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await new Promise((r) => setTimeout(r, 2500));

  const name = route === '/' ? 'home' : route.slice(1);
  try {
    await page.screenshot({
      path: `${out}/${name}-hero.png`,
      type: 'jpeg',
      quality: 60,
      clip: { x: 0, y: 0, width: 1440, height: 800 },
    });
    console.log('shot ok', name);
  } catch (e) {
    console.log('shot fail', name, e.message);
  }

  const info = await page.evaluate(() => {
    const hero = document.querySelector('#comp-mp2vlkbh2');
    const logos = [...document.querySelectorAll('img')].filter((img) => {
      const s = (img.currentSrc || img.src || '').toLowerCase();
      return s.includes('logo') || s.includes('shakti') || s.includes('wordmark');
    });
    const mobileEl = document.querySelector('.tsc-mobile-site-header');
    const bodyW = document.body.scrollWidth;
    const htmlW = document.documentElement.clientWidth;
    let mobileHeaderVisible = false;
    if (mobileEl) {
      const s = getComputedStyle(mobileEl);
      const r = mobileEl.getBoundingClientRect();
      mobileHeaderVisible =
        s.display !== 'none' && s.visibility !== 'hidden' && r.height > 0;
    }

    const filmCards = [...document.querySelectorAll('.tsc-film-report-card')].slice(0, 4).map((el) => {
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    });

    const dupHide = ['comp-mqmhowf1', 'comp-mqmhp1sq', 'comp-mqmhpx0p'].map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, present: false };
      const s = getComputedStyle(el);
      return { id, present: true, display: s.display, visibility: s.visibility };
    });

    return {
      dataPage: document.body.getAttribute('data-page'),
      overflowX: bodyW > htmlW + 2,
      bodyW,
      htmlW,
      mobileHeaderVisible,
      hero: hero
        ? (() => {
            const r = hero.getBoundingClientRect();
            const s = getComputedStyle(hero);
            const container = hero.querySelector('.comp-mp2vlkbh2-container');
            const cs = container ? getComputedStyle(container) : null;
            return {
              w: Math.round(r.width),
              h: Math.round(r.height),
              display: s.display,
              flex: cs?.display,
              gap: cs?.gap,
            };
          })()
        : null,
      logos: logos.slice(0, 5).map((img) => {
        const r = img.getBoundingClientRect();
        return {
          w: Math.round(r.width),
          h: Math.round(r.height),
          src: (img.currentSrc || img.src || '').split('/').pop(),
        };
      }),
      filmCards,
      dupHide,
    };
  });

  report.push({ route, ...info });
  console.log(JSON.stringify({ route, ...info }, null, 2));
}

fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log('done');
