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
    function kids(id) {
      const el = q('#' + id);
      if (!el) return { id, missing: true };
      const cont = el.querySelector('[class*="-container"]') || el;
      return {
        id,
        box: box(el),
        contCls: cont.className?.slice?.(0, 60),
        contDisplay: cs(cont).display,
        children: [...cont.children].map((c) => ({
          id: c.id || c.className.slice(0, 40),
          tag: c.tagName,
          box: box(c),
          pos: cs(c).position,
          ga: cs(c).gridArea,
          top: cs(c).top,
          left: cs(c).left,
          text: (c.innerText || '').trim().slice(0, 40),
        })),
      };
    }
    return {
      vs2: kids('comp-mr69hwvs2'),
      ww9: kids('comp-mr69hww9'),
      ub: kids('comp-mr69hwub'),
      vf5: kids('comp-mr69hwvf5'),
      // how is hwvm1 structured
      vm1: kids('comp-mr69hwvm1'),
      wt41: kids('comp-mr69hwt41'),
      vq: kids('comp-mr69hwvq'),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
