const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  async function dump(route, sectionIds) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));
    const data = await page.evaluate((ids) => {
      function box(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          id: el.id,
          display: cs.display,
          visibility: cs.visibility,
          h: Math.round(r.height),
          w: Math.round(r.width),
          top: Math.round(r.top + window.scrollY),
          children: Array.from(el.children || []).slice(0, 12).map((c) => {
            const cr = c.getBoundingClientRect();
            return { id: c.id || c.className?.toString?.().slice(0, 40), h: Math.round(cr.height), w: Math.round(cr.width), top: Math.round(cr.top + window.scrollY) };
          }),
        };
      }
      const out = { h1: document.querySelector('main h1')?.textContent?.trim(), sections: {} };
      ids.forEach((id) => { out.sections[id] = box(document.getElementById(id)); });
      // first visible main section kids with absolute positioning
      const main = document.querySelector('main');
      const abs = Array.from(main.querySelectorAll('[id^="comp-"]')).filter((el) => {
        const cs = getComputedStyle(el);
        return cs.position === 'absolute' && el.getBoundingClientRect().width > 50;
      }).slice(0, 25).map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, left: Math.round(r.left), top: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
      });
      out.absSample = abs;
      return out;
    }, sectionIds);
    console.log('\n====', route);
    console.log(JSON.stringify(data, null, 2));
  }

  await dump('/harshad-duhita', ['comp-mq6h99jp', 'comp-mq7lr7m2', 'comp-mq6ig1tw', 'comp-mq7r4iw7', 'comp-mq7z6hk6', 'comp-mq84m6ve']);
  await dump('/yugm', ['comp-mqhqa6vo', 'comp-mqhqa6yo', 'comp-mqhqa6zr', 'comp-mqjigv1b', 'comp-mqhqa72r', 'comp-mqhqa74u']);
  await browser.close();
})();
