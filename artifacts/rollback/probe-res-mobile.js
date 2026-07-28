const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  for (const route of ['/resources', '/blog-1']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 7000));
    const info = await p.evaluate(() => {
      const vw = window.innerWidth;
      const overflows = [];
      document.querySelectorAll('main *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > vw + 4 && r.height > 10) {
          overflows.push({
            id: el.id || '',
            cls: (el.className || '').toString().slice(0, 50),
            tag: el.tagName,
            w: Math.round(r.width),
          });
        }
      });
      const overlaps = [];
      const comps = [...document.querySelectorAll('main [id^="comp-"]')];
      for (let i = 0; i < comps.length; i++) {
        const a = comps[i].getBoundingClientRect();
        if (a.height < 30 || a.width < 30) continue;
        for (let j = i + 1; j < Math.min(i + 12, comps.length); j++) {
          if (comps[i].parentElement !== comps[j].parentElement) continue;
          const b = comps[j].getBoundingClientRect();
          if (b.height < 30 || b.width < 30) continue;
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 50 && oy > 30) {
            overlaps.push({ a: comps[i].id, b: comps[j].id, ox: Math.round(ox), oy: Math.round(oy) });
          }
        }
      }
      const sheets = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.getAttribute('href'));
      const blogSection = document.querySelector('#comp-mrdp2u69');
      const blogKids = blogSection
        ? [...blogSection.querySelectorAll(':scope > *, [data-testid="responsive-container-content"] > [id^="comp-"]')].slice(0, 12).map((el) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return {
              id: el.id,
              w: Math.round(r.width),
              h: Math.round(r.height),
              t: Math.round(r.top),
              l: Math.round(r.left),
              pos: cs.position,
              display: cs.display,
              gridArea: cs.gridArea,
            };
          })
        : [];
      const tools = document.querySelector('#comp-mp2vpkoa');
      const toolKids = tools
        ? [...(tools.querySelector('[data-testid="responsive-container-content"]') || tools).children]
            .slice(0, 8)
            .map((el) => {
              const r = el.getBoundingClientRect();
              const cs = getComputedStyle(el);
              return { id: el.id, w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), pos: cs.position };
            })
        : [];
      // blog body mesh
      const bodyRoot =
        document.querySelector('#comp-mreu9zoc') ||
        document.querySelector('[data-testid="page-bg"]') ||
        document.querySelector('main');
      const absKids = [...document.querySelectorAll('main [id^="comp-"]')]
        .filter((el) => getComputedStyle(el).position === 'absolute')
        .slice(0, 25)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { id: el.id, t: Math.round(r.top + window.scrollY), h: Math.round(r.height), w: Math.round(r.width), l: Math.round(r.left) };
        });
      return {
        route: location.pathname,
        docW: document.documentElement.scrollWidth,
        bodyW: document.body.scrollWidth,
        overflows: overflows.slice(0, 12),
        overlaps: overlaps.slice(0, 25),
        sheets: sheets.filter((h) => h && /resources|blog|editorial|mobile/.test(h)),
        blogKids,
        toolKids,
        absKids,
      };
    });
    console.log(JSON.stringify(info, null, 2));
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
