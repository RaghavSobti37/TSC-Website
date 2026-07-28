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
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: +r.top.toFixed(1), b: +(r.top + r.height).toFixed(1) };
    };
    // hero cream boxes
    const heroKids = [...(q('#comp-mp3okkrk')?.querySelector('[data-testid=responsive-container-content]') || q('#comp-mp3okkrk')).children]
      .filter((c) => c.id)
      .map((c) => ({
        id: c.id,
        box: box(c),
        bg: cs(c).backgroundColor,
        display: cs(c).display,
        text: (c.innerText || '').trim().slice(0, 60),
      }));
    const quote = q('#comp-mr68f97q');
    const quoteInner = quote && quote.querySelector('.inner-box');
    // card bottoms vs next tops
    const cards = ['#comp-mr69hwub', '#comp-mr69hwvf5', '#comp-mr69hwvs2', '#comp-mr69hww9'].map((sel) => {
      const el = q(sel);
      return el ? { id: sel, box: box(el), pos: cs(el).position } : { id: sel, missing: true };
    });
    const stats = ['#comp-mrum0w6f', '#comp-mruporej', '#comp-mruphxpt1', '#comp-mrupljhn3'].map((sel) => {
      const el = q(sel);
      return el ? { id: sel, box: box(el), pos: cs(el).position, text: el.innerText.trim().slice(0, 40) } : { id: sel, missing: true };
    });
    return {
      heroKids,
      quote: quote && { box: box(quote), bg: cs(quote).backgroundColor, pad: cs(quote.querySelector('[data-testid=responsive-container-content]') || quote).padding },
      quoteInner: quoteInner && { box: box(quoteInner), display: cs(quoteInner).display, bg: cs(quoteInner).backgroundColor },
      quoteText: q('#comp-mr4pwv07') && box(q('#comp-mr4pwv07')),
      cards,
      stats,
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
