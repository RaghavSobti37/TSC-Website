const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 800 });
  const routes = [
    '/artist-path',
    '/learn-with-tsc',
    '/roots-of-hindustani-classical',
    '/the-heart-of-composition',
  ];

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 1500));
    const info = await page.evaluate(() => {
      const vw = window.innerWidth;
      const offenders = [];
      const sel =
        '.wixui-text-marquee, [data-testid="marquee-unit"], [data-testid="marquee-item-text"], h1, .font_0, main [data-testid="richTextElement"]';
      document.querySelectorAll(sel).forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width > 2 && (b.right > vw + 8 || b.left < -8 || b.width > vw + 8)) {
          offenders.push({
            tag: el.tagName,
            id: el.id || '',
            cls: String(el.className || '').slice(0, 80),
            left: Math.round(b.left),
            right: Math.round(b.right),
            w: Math.round(b.width),
            text: (el.textContent || '').trim().slice(0, 50),
          });
        }
      });
      return {
        vw,
        overflow: Math.max(document.documentElement.scrollWidth - vw, 0),
        offenders: offenders.slice(0, 15),
      };
    });
    console.log(route, JSON.stringify(info, null, 2));
  }

  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
