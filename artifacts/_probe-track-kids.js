const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const kids = await page.evaluate(() => {
    const item = document.getElementById('comp-mqhqa73q4__item1');
    return Array.from(item.querySelectorAll('[id^="comp-"]')).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.height < 8) return null;
      return {
        id: el.id,
        display: cs.display,
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      };
    }).filter(Boolean);
  });
  console.log(JSON.stringify(kids, null, 2));
  await browser.close();
})();
