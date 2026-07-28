const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  for (const route of ['/blog-2', '/blog-3']) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 5000));
    const info = await p.evaluate(() => {
      const containers = [...document.querySelectorAll('main [class*="-container"].max-width-container')];
      return containers.slice(0, 4).map((el) => {
        const kids = [...el.children].filter((c) => c.id);
        return {
          cls: el.className.toString().match(/comp-[a-z0-9]+-container/)?.[0],
          display: getComputedStyle(el).display,
          kids: kids.map((c) => {
            const r = c.getBoundingClientRect();
            const cs = getComputedStyle(c);
            return {
              id: c.id,
              h: Math.round(r.height),
              t: Math.round(r.top + scrollY),
              mt: cs.marginTop,
              area: cs.gridArea,
              text: (c.innerText || '').slice(0, 45).replace(/\s+/g, ' '),
              tag: c.getAttribute('data-testid') || c.className.toString().slice(0, 30),
            };
          }),
        };
      });
    });
    console.log(route, JSON.stringify(info, null, 2));
  }
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
