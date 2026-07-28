const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));
  const d = await p.evaluate(() => {
    const dump = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        id,
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: cs.display,
        height: cs.height,
        minH: cs.minHeight,
        overflow: cs.overflow,
        pos: cs.position,
        kids: [...el.children].slice(0, 12).map((c) => ({
          id: c.id || c.className?.toString?.().slice(0, 30),
          h: Math.round(c.getBoundingClientRect().height),
          w: Math.round(c.getBoundingClientRect().width),
          display: getComputedStyle(c).display,
          txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
        })),
      };
    };

    const nrbhw = document.getElementById('comp-mqqnrbhw');
    const nrbKids = nrbhw
      ? [...nrbhw.querySelectorAll(':scope > [id^="comp-"], :scope [id^="comp-"]')].slice(0, 25).map((c) => ({
          id: c.id,
          parent: c.parentElement?.id,
          h: Math.round(c.getBoundingClientRect().height),
          w: Math.round(c.getBoundingClientRect().width),
          left: Math.round(c.getBoundingClientRect().left),
          top: Math.round(c.getBoundingClientRect().top + window.scrollY),
          pos: getComputedStyle(c).position,
          txt: (c.innerText || '').trim().slice(0, 35).replace(/\s+/g, ' '),
        }))
      : [];

    return {
      curr: dump('comp-mqqg5lnm'),
      currContent: dump(document.querySelector('#comp-mqqg5lnm [data-testid="responsive-container-content"]')?.id || 'x'),
      ghn: dump('comp-mqqghn86'),
      framework: dump('comp-mqphxnu3'),
      nrbhw: dump('comp-mqqnrbhw'),
      nrbKids,
    };
  });
  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
