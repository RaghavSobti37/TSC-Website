const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });

  await p.goto('http://127.0.0.1:3000/blog-1', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 7000));
  const b1 = await p.evaluate(() => {
    // find small square overlays near article body
    const comps = [...document.querySelectorAll('main [id^="comp-"]')];
    const small = comps
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          id: el.id,
          w: Math.round(r.width),
          h: Math.round(r.height),
          t: Math.round(r.top + scrollY),
          l: Math.round(r.left),
          pos: getComputedStyle(el).position,
          text: (el.innerText || '').slice(0, 40).replace(/\s+/g, ' '),
          hasImg: !!el.querySelector('img, svg'),
        };
      })
      .filter((x) => x.w > 20 && x.w < 90 && x.h > 20 && x.h < 90 && x.t > 400 && x.t < 2000);
    // overlaps still?
    const container = document.querySelector('.comp-mrfydh6w-container');
    const kids = container
      ? [...container.children].filter((c) => c.id).map((c) => {
          const r = c.getBoundingClientRect();
          return { id: c.id, t: Math.round(r.top + scrollY), h: Math.round(r.height), display: getComputedStyle(c).display };
        })
      : [];
    return { small, kids, dataPage: document.body.getAttribute('data-page') };
  });
  console.log('B1', JSON.stringify(b1, null, 2));

  await p.goto('http://127.0.0.1:3000/blog-2', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 7000));
  const b2 = await p.evaluate(() => {
    const hits = [...document.querySelectorAll('main *')].filter((el) => /1\/\d+|<\s*$|›|‹/.test((el.innerText || '').trim()) && (el.innerText || '').length < 20);
    const pagers = hits.slice(0, 15).map((el) => {
      const r = el.getBoundingClientRect();
      let cur = el;
      while (cur && !cur.id && cur.parentElement) cur = cur.parentElement;
      return {
        id: cur && cur.id,
        text: (el.innerText || '').slice(0, 20),
        t: Math.round(r.top + scrollY),
        l: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
        pos: getComputedStyle(cur || el).position,
      };
    });
    // vector images / arrows
    const vecs = [...document.querySelectorAll('main [id^="comp-"]')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const t = (el.innerText || '').trim();
        return (t === '<' || t === '>' || /\d+\/\d+/.test(t) || el.querySelector('[data-testid="vectorButton"], .wixui-vector-image')) && r.width < 120;
      })
      .slice(0, 20)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, text: (el.innerText || '').slice(0, 15), t: Math.round(r.top + scrollY), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) };
      });
    return { pagers, vecs };
  });
  console.log('B2', JSON.stringify(b2, null, 2));

  // resources blog card button layout
  await p.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 7000));
  const res = await p.evaluate(() => {
    const card = document.getElementById('comp-mrdpew4h');
    if (!card) return { missing: true };
    const r = card.getBoundingClientRect();
    const kids = [...card.children].filter((c) => c.id).map((c) => {
      const cr = c.getBoundingClientRect();
      return { id: c.id, w: Math.round(cr.width), h: Math.round(cr.height), t: Math.round(cr.top + scrollY), text: (c.innerText || '').slice(0, 30) };
    });
    const overlaps = [];
    const comps = [...document.querySelectorAll('main [id^="comp-"]')];
    for (let i = 0; i < comps.length; i++) {
      const a = comps[i].getBoundingClientRect();
      if (a.height < 40 || a.width < 40) continue;
      for (let j = i + 1; j < Math.min(i + 6, comps.length); j++) {
        if (comps[i].parentElement !== comps[j].parentElement) continue;
        const b = comps[j].getBoundingClientRect();
        if (b.height < 40 || b.width < 40) continue;
        const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (ox > 80 && oy > 40) overlaps.push({ a: comps[i].id, b: comps[j].id, oy: Math.round(oy) });
      }
    }
    return {
      cardH: Math.round(r.height),
      kids,
      blogCardW: Math.round((document.getElementById('comp-mrdq81q0') || {}).getBoundingClientRect?.().width || 0),
      overlaps: overlaps.filter((o) => !/mpcksyp|mpck4px|mpcccw|mpbii8|mrd98n55/.test(o.a + o.b)).slice(0, 15),
    };
  });
  console.log('RES', JSON.stringify(res, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
