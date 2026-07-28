// Full-page capture via scroll-and-stitch (no viewport resize; Wix-safe).
// Usage: node artifacts/rollback/shot3.js <baseUrl> <prefix> <width> [routesCsv]
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));
const sharp = require(path.resolve(__dirname, '..', '..', 'node_modules', 'sharp'));

const defaultRoutes = [
  ['home', '/'], ['about', '/about'], ['work', '/work'], ['artists', '/artists'],
  ['artist-path', '/artist-path'], ['learn-with-tsc', '/learn-with-tsc'],
  ['films', '/films'], ['resources', '/resources'], ['academy', '/academy'],
];

(async () => {
  const [baseUrl, prefix, widthArg, routesCsv] = process.argv.slice(2);
  const width = Number(widthArg || 390);
  const vh = 844;
  const routes = routesCsv
    ? routesCsv.split(',').map(r => [r === '/' ? 'home' : r.replace(/^\//, '').replace(/\//g, '-'), r])
    : defaultRoutes;
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: vh, deviceScaleFactor: 1 });

  for (const [slug, route] of routes) {
    const url = baseUrl.replace(/\/$/, '') + route;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    } catch (e) {
      console.log(`WARN ${slug}: goto ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 8000));
    // warm-up scroll for lazy content
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 1500));
    const total = Math.min(await page.evaluate(() => document.body.scrollHeight), 20000);
    const shots = [];
    for (let y = 0; y < total; y += vh) {
      const target = Math.min(y, total - vh < 0 ? 0 : total - vh);
      await page.evaluate(t => window.scrollTo(0, t), target);
      await new Promise(r => setTimeout(r, 350));
      const buf = await page.screenshot();
      shots.push({ buf, y: target });
      if (target < y) break;
    }
    // stitch
    const canvasH = Math.max(total, vh);
    const composites = shots.map(s => ({ input: s.buf, left: 0, top: s.y }));
    const file = path.join(__dirname, `${prefix}-${slug}.png`);
    await sharp({ create: { width, height: canvasH, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
      .composite(composites)
      .png()
      .toFile(file);
    console.log(`${slug}: ${canvasH}px -> ${path.basename(file)}`);
  }
  await browser.close();
})();
