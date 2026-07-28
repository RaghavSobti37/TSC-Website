const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const empty = await page.evaluate(() => {
    const host = document.getElementById('comp-mqi6hst3');
    if (!host) return [];
    return Array.from(host.children).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        id: el.id || el.className?.toString?.().slice(0, 40),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      };
    });
  });
  console.log('EMPTYHOST', JSON.stringify(empty, null, 2));

  await page.goto('http://127.0.0.1:3000/artists', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 5000));
  const acc = await page.evaluate(() => {
    const el = document.querySelector('.tsc-artists-accordion');
    if (!el) return null;
    el.scrollIntoView({ block: 'start' });
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height), cards: el.querySelectorAll('.tsc-artist-acc').length };
  });
  console.log('ACC', acc);
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: 'artifacts/rollback/v390c-artists-meet.png' });

  await browser.close();
})();
