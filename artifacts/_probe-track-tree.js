const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const tree = await page.evaluate(() => {
    const item = document.getElementById('comp-mqhqa73q4__item1');
    const chain = [];
    let n = item;
    while (n && chain.length < 10) {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      chain.push({
        id: n.id || n.className?.toString?.().slice(0, 40),
        display: cs.display,
        pos: cs.position,
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        grid: cs.gridTemplateColumns,
      });
      n = n.parentElement;
    }
    // siblings of item parent
    const parent = item?.parentElement;
    const sibs = parent ? Array.from(parent.children).slice(0, 8).map((c) => {
      const r = c.getBoundingClientRect();
      return { id: c.id || c.className?.toString?.().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left) };
    }) : [];
    return { chain, sibs };
  });
  console.log(JSON.stringify(tree, null, 2));
  await browser.close();
})();
