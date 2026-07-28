const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const data = await page.evaluate(() => {
    const host = document.getElementById('comp-mqi6gg5f');
    if (!host) return null;
    const items = Array.from(host.querySelectorAll('[id*="__item"]')).filter((el) => el.id.match(/__item[^_]*$/));
    return {
      kids: Array.from(host.querySelectorAll(':scope > [id^="comp-"], :scope [id^="comp-"]')).slice(0, 15).map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, w: Math.round(r.width), h: Math.round(r.height), text: (el.textContent||'').replace(/\s+/g,' ').trim().slice(0,35) };
      }).filter((x) => x.h > 20),
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
