const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });

  for (const route of ['/blog-1', '/blog-2', '/blog-3']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 8000));
    await p.evaluate(() => window.scrollTo(0, 700));
    await new Promise((r) => setTimeout(r, 500));
    const info = await p.evaluate(() => {
      const all = [...document.querySelectorAll('*')].filter((el) => {
        try {
          return getComputedStyle(el).position === 'fixed';
        } catch (e) {
          return false;
        }
      });
      return {
        route: location.pathname,
        fixed: all
          .filter((el) => el.getBoundingClientRect().width > 5)
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              id: el.id || el.className.toString().slice(0, 40),
              tag: el.tagName,
              top: Math.round(r.top),
              left: Math.round(r.left),
              w: Math.round(r.width),
              h: Math.round(r.height),
              text: (el.innerText || '').slice(0, 35).replace(/\s+/g, ' '),
            };
          })
          .slice(0, 20),
        pinned: [...document.querySelectorAll('[id*="pinned"]')].map((el) => ({
          id: el.id,
          pos: getComputedStyle(el).position,
          display: getComputedStyle(el).display,
        })),
      };
    });
    console.log(JSON.stringify(info, null, 2));
    await p.screenshot({ path: `artifacts/rollback/live2-${route.replace('/', '')}.png` });
  }

  // resources blog buttons font
  await p.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 7000));
  await p.evaluate(() => window.scrollTo(0, 1900));
  await new Promise((r) => setTimeout(r, 400));
  await p.screenshot({ path: 'artifacts/rollback/live2-resources-blog.png' });
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
