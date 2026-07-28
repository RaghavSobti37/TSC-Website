const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  for (const route of ['/blog-1', '/blog-2', '/blog-3']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 5000));
    const info = await p.evaluate(() => {
      const ids = ['comp-mrfydh6w', 'comp-mrfyyjk0', 'comp-mrfzl2q9', 'comp-mrfzgctc', 'comp-mrfznxkz', 'comp-mreu9zoc'];
      const found = {};
      ids.forEach((id) => {
        found[id] = !!document.getElementById(id);
      });
      const containers = [...document.querySelectorAll('main [class*="-container"].max-width-container')]
        .slice(0, 10)
        .map((el) => {
          const kids = [...el.children].filter((c) => c.id);
          const overlaps = [];
          for (let i = 0; i < kids.length; i++) {
            const a = kids[i].getBoundingClientRect();
            for (let j = i + 1; j < kids.length; j++) {
              const b = kids[j].getBoundingClientRect();
              const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
              const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
              if (ox > 40 && oy > 30) overlaps.push([kids[i].id, kids[j].id, Math.round(oy)]);
            }
          }
          return {
            cls: el.className.toString().slice(0, 55),
            kidCount: kids.length,
            overlaps: overlaps.slice(0, 6),
            display: getComputedStyle(el).display,
          };
        })
        .filter((x) => x.overlaps.length || x.kidCount >= 3);
      return { route: location.pathname, found, containers };
    });
    console.log(JSON.stringify(info, null, 2));
  }

  await p.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 5000));
  const ig = await p.evaluate(() => {
    const texts = [...document.querySelectorAll('[data-testid="richTextElement"], .wixui-rich-text, a')];
    const hit = texts.find((el) => /Latest On Instagram/i.test(el.innerText || ''));
    const visit = texts.find((el) => /Visit Us/i.test(el.innerText || ''));
    let sec = hit;
    while (sec && sec.tagName !== 'SECTION') sec = sec.parentElement;
    const container = sec && (sec.querySelector('[data-testid="responsive-container-content"]') || sec);
    const kids = container
      ? [...container.children]
          .filter((el) => el.id && el.id.startsWith('comp-'))
          .slice(0, 15)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              id: el.id,
              t: Math.round(r.top + scrollY),
              l: Math.round(r.left),
              w: Math.round(r.width),
              h: Math.round(r.height),
              text: (el.innerText || '').slice(0, 35).replace(/\s+/g, ' '),
            };
          })
      : [];
    const dump = (el) =>
      el
        ? {
            id: el.id,
            t: Math.round(el.getBoundingClientRect().top + scrollY),
            l: Math.round(el.getBoundingClientRect().left),
            w: Math.round(el.getBoundingClientRect().width),
            text: (el.innerText || '').slice(0, 40),
          }
        : null;
    return { hit: dump(hit), visit: dump(visit), secId: sec && sec.id, kids };
  });
  console.log('IG', JSON.stringify(ig, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
