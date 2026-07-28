const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  for (const route of ['/blog-1', '/blog-2', '/blog-3']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 5000));
    await p.evaluate(() => window.scrollTo(0, 600));
    await new Promise((r) => setTimeout(r, 300));
    const info = await p.evaluate(() => {
      const fixed = [...document.querySelectorAll('[id^="comp-"], [id*="pinned"]')]
        .filter((el) => getComputedStyle(el).position === 'fixed' && el.getBoundingClientRect().width > 10)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            id: el.id,
            top: Math.round(r.top),
            left: Math.round(r.left),
            w: Math.round(r.width),
            h: Math.round(r.height),
            text: (el.innerText || '').slice(0, 40).replace(/\s+/g, ' '),
          };
        });
      return { route: location.pathname, fixed };
    });
    console.log(JSON.stringify(info, null, 2));
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
