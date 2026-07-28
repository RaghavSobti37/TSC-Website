const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));
  const info = await p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const cs = (el) => getComputedStyle(el);
    const box = (el) => {
      const r = el.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: +r.top.toFixed(1) };
    };
    const chain = [];
    let n = q('#comp-mr69hwvu1');
    while (n && chain.length < 10) {
      chain.push({
        id: n.id || n.className.slice(0, 40),
        box: box(n),
        pos: cs(n).position,
        h: cs(n).height,
        display: cs(n).display,
        overflow: cs(n).overflow,
      });
      n = n.parentElement;
    }
    return {
      chain,
      hostBox: box(q('#comp-mr69hwoy')),
      ctaBox: box(q('#comp-mruek03p')),
      visibleImgs: [...document.querySelectorAll('#comp-mr69hwoy img')].map((i) => box(i)),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
