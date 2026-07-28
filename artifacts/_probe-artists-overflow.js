const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  const paths = [
    '/artists',
    '/harshad-duhita',
    '/yugm',
    '/artist-path',
    '/book-an-artist',
    '/artist-query',
    '/collab-query'
  ];
  const results = [];
  for (const path of paths) {
    await page.goto('http://127.0.0.1:3477' + path, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await new Promise((r) => setTimeout(r, 1500));
    const info = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const sw = Math.max(doc.scrollWidth, body.scrollWidth);
      const cw = Math.max(doc.clientWidth, body.clientWidth);
      const css = [...document.querySelectorAll('link[href*="mobile/artists"]')].map(
        (l) => l.href
      );
      return {
        sw,
        cw,
        overflow: sw > cw + 2,
        dataPage: body.getAttribute('data-page'),
        artistsCss: css
      };
    });
    results.push({ path, ...info });
  }
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  const bad = results.filter((r) => r.overflow || !r.artistsCss.length);
  process.exit(bad.length ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
