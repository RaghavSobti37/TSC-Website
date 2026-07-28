const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();

  async function check(url, width) {
    await p.setViewport({ width, height: 844 });
    await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 7000));
    return p.evaluate((w) => {
      const q = (s) => document.querySelector(s);
      const cs = (el) => el && getComputedStyle(el);
      const box = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: +r.top.toFixed(1), l: +r.left.toFixed(1) };
      };
      const left = q('#comp-mr69hwvm1');
      const right = q('#comp-mr69hwt41');
      const sameRow =
        left && right ? Math.abs(left.getBoundingClientRect().top - right.getBoundingClientRect().top) < 8 : null;
      const btn = q('#comp-mrgdrumi');
      const partner = q('#comp-mruem86b');
      const card = q('#comp-mrlr0ide');
      const mesh = q('.comp-mr69hwsy-container');
      return {
        path: location.pathname,
        width: w,
        overflow: document.documentElement.scrollWidth > w + 1,
        scrollW: document.documentElement.scrollWidth,
        homeCtaFs: btn ? cs(btn.querySelector('span') || btn).fontSize : null,
        homeCtaH: btn ? box(btn) : null,
        homeCardW: card ? box(card) : null,
        workCols: mesh ? cs(mesh).gridTemplateColumns : null,
        workFlex: mesh ? cs(mesh).display + '/' + cs(mesh).flexDirection : null,
        workSameRow: sameRow,
        leftW: left && box(left),
        rightW: right && box(right),
        partnerFs: partner ? cs(partner.querySelector('span') || partner).fontSize : null,
        partnerBox: partner && box(partner),
        quoteText: (q('#comp-mr4pwv07') || {}).innerText?.slice(0, 80),
        quoteColor: q('#comp-mr4pwv07') && cs(q('#comp-mr4pwv07')).color,
      };
    }, width);
  }

  console.log(JSON.stringify(await check('http://127.0.0.1:3000/', 390), null, 2));
  console.log(JSON.stringify(await check('http://127.0.0.1:3000/work', 390), null, 2));
  console.log(JSON.stringify(await check('http://127.0.0.1:3000/', 768), null, 2));
  console.log(JSON.stringify(await check('http://127.0.0.1:3000/work', 768), null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
