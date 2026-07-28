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
    const cs = (el) => el && getComputedStyle(el);
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: +r.top.toFixed(1), l: +r.left.toFixed(1) };
    };
    function dump(el, depth, max) {
      if (!el || depth > max) return null;
      const kids = [...el.children].map((c) => dump(c, depth + 1, max)).filter(Boolean);
      const interesting =
        (el.id && el.id.startsWith('comp-')) ||
        (el.className && /container|overflow|wixui-box|wixui-image|column/i.test(String(el.className)));
      if (!interesting && !kids.length) return null;
      return {
        id: el.id || '',
        cls: String(el.className || '').slice(0, 70),
        box: box(el),
        display: cs(el).display,
        gt: cs(el).gridTemplateColumns,
        ga: cs(el).gridArea,
        kids: kids.slice(0, 12),
      };
    }
    const wrap = q('#comp-mr69hwsy');
    // find column boxes
    const cols = ['#comp-mr69hwvq', '#comp-mr69hwub', '#comp-mr69hwvm1', '#comp-mr69hwu9', '#comp-mr69hwvf5', '#comp-mr69hww9', '#comp-mr69hwvs2'].map((id) => {
      const el = q(id);
      return el
        ? { id, box: box(el), display: cs(el).display, gt: cs(el).gridTemplateColumns, parent: el.parentElement && (el.parentElement.id || el.parentElement.className.slice(0, 40)) }
        : { id, missing: true };
    });
    // parent of both columns
    const leftCol = q('#comp-mr69hwvq');
    const rightCol = q('#comp-mr69hwub');
    let common = null;
    if (leftCol && rightCol) {
      const leftAnc = new Set();
      let n = leftCol;
      while (n) {
        leftAnc.add(n);
        n = n.parentElement;
      }
      n = rightCol;
      while (n) {
        if (leftAnc.has(n)) {
          common = n;
          break;
        }
        n = n.parentElement;
      }
    }
    return {
      cols,
      common: common
        ? {
            id: common.id,
            cls: String(common.className).slice(0, 80),
            display: cs(common).display,
            gt: cs(common).gridTemplateColumns,
            gr: cs(common).gridTemplateRows,
            box: box(common),
            kids: [...common.children].map((c) => ({
              id: c.id,
              cls: String(c.className).slice(0, 50),
              box: box(c),
              display: cs(c).display,
              ga: cs(c).gridArea,
            })),
          }
        : null,
      tree: dump(wrap, 0, 3),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
