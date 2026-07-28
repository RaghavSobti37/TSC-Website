const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  for (const route of ['/blog-1', '/blog-2', '/blog-3']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 6000));
    const info = await p.evaluate(() => {
      const all = [...document.querySelectorAll('main a, main button, main [id^="comp-"], main [role="button"]')];
      const back = all
        .filter((el) => /Back\s*to\s*Resources/i.test(el.innerText || '') || /Back\s*to\s*Resources/i.test(el.getAttribute('aria-label') || ''))
        .map((el) => {
          let cur = el;
          while (cur && !cur.id && cur.parentElement) cur = cur.parentElement;
          const r = (cur || el).getBoundingClientRect();
          const cs = getComputedStyle(cur || el);
          return {
            id: cur && cur.id,
            tag: el.tagName,
            text: (el.innerText || '').slice(0, 40),
            t: Math.round(r.top + scrollY),
            l: Math.round(r.left),
            w: Math.round(r.width),
            h: Math.round(r.height),
            pos: cs.position,
            z: cs.zIndex,
            parent: (cur && cur.parentElement && cur.parentElement.className.toString().slice(0, 50)) || '',
          };
        });
      // arrows / chevrons
      const arrows = [...document.querySelectorAll('main [id^="comp-"]')]
        .filter((el) => {
          const t = (el.innerText || '').trim();
          const r = el.getBoundingClientRect();
          if (r.width < 5 || r.height < 5) return false;
          if (t === '<' || t === '>' || t === '‹' || t === '›') return true;
          if (el.querySelector('svg') && r.width < 60 && r.height < 60 && r.top + scrollY > 200) return true;
          return false;
        })
        .slice(0, 12)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.id, text: (el.innerText || '').slice(0, 10), t: Math.round(r.top + scrollY), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), pos: getComputedStyle(el).position };
        });
      // white gap: sections bg
      const secs = [...document.querySelectorAll('main section')].map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return { id: el.id, t: Math.round(r.top + scrollY), h: Math.round(r.height), bg: cs.backgroundColor };
      });
      return { route: location.pathname, back, arrows, secs };
    });
    console.log(JSON.stringify(info, null, 2));
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
