// Full-page capture via viewport-resize (fullPage:true deadlocks in this Chrome build).
// Usage: node artifacts/rollback/shot2.js <baseUrl> <prefix> <width> [routesCsv]
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

const defaultRoutes = [
  ['home', '/'], ['about', '/about'], ['work', '/work'], ['artists', '/artists'],
  ['artist-path', '/artist-path'], ['learn-with-tsc', '/learn-with-tsc'],
  ['films', '/films'], ['resources', '/resources'], ['academy', '/academy'],
];

(async () => {
  const [baseUrl, prefix, widthArg, routesCsv] = process.argv.slice(2);
  const width = Number(widthArg || 1280);
  const routes = routesCsv
    ? routesCsv.split(',').map(r => [r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-'), r])
    : defaultRoutes;
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();

  for (const [slug, route] of routes) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    const url = baseUrl.replace(/\/$/, '') + route;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (e) {
      console.log(`WARN ${slug}: goto ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 7000));
    // scroll through to trigger lazy loading / animations
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 700) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 1500));
    const height = Math.min(await page.evaluate(() => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)), 16384);
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 1200));
    const file = path.join(__dirname, `${prefix}-${slug}.png`);
    await page.screenshot({ path: file });
    console.log(`${slug}: ${height}px -> ${path.basename(file)}`);
  }
  await browser.close();
})();
