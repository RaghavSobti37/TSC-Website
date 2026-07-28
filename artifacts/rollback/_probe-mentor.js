const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/learn-with-tsc', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const r = await p.evaluate(() => {
    const m = document.querySelector('#comp-mrufx9qb1');
    const kids = [...m.querySelectorAll(':scope > [id^="comp-"]')].map((k) => {
      const cs = getComputedStyle(k);
      const box = k.getBoundingClientRect();
      return {
        id: k.id,
        t: (k.innerText || '').trim(),
        w: Math.round(box.width),
        h: Math.round(box.height),
        l: Math.round(box.left),
        top: Math.round(box.top),
        display: cs.display,
        width: cs.width,
        flex: cs.flex,
        position: cs.position,
      };
    });
    const mcs = getComputedStyle(m);
    const h2 = document.querySelector('#comp-mrufx9pg1 h2');
    const h2cs = getComputedStyle(h2);
    return {
      mentor: {
        flexDir: mcs.flexDirection,
        wrap: mcs.flexWrap,
        w: Math.round(m.getBoundingClientRect().width),
        kids,
      },
      courses: {
        fs: h2cs.fontSize,
        ls: h2cs.letterSpacing,
        ws: h2cs.whiteSpace,
        w: Math.round(h2.getBoundingClientRect().width),
        h: Math.round(h2.getBoundingClientRect().height),
        text: h2.innerText,
      },
    };
  });
  console.log(JSON.stringify(r, null, 2));
  await b.close();
})();
