// Capture full-page desktop screenshots of the 9 main pages from a server.
// Usage: node artifacts/rollback/shot.js <baseUrl> <prefix> [width]
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

const routes = [
  ['home', '/'],
  ['about', '/about'],
  ['work', '/work'],
  ['artists', '/artists'],
  ['artist-path', '/artist-path'],
  ['learn-with-tsc', '/learn-with-tsc'],
  ['films', '/films'],
  ['resources', '/resources'],
  ['academy', '/academy'],
];

(async () => {
  const [baseUrl, prefix, widthArg] = process.argv.slice(2);
  const width = Number(widthArg || 1280);
  const outDir = __dirname;
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });

  for (const [slug, route] of routes) {
    const url = baseUrl.replace(/\/$/, '') + route;
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch (e) {
      console.log(`WARN ${slug}: goto ${e.message}`);
    }
    // scroll through to trigger lazy loading / animations
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 800) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await new Promise(r => setTimeout(r, 1500));
    const file = path.join(outDir, `${prefix}-${slug}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const height = await page.evaluate(() => document.body.scrollHeight);
    console.log(`${slug}: ${height}px -> ${path.basename(file)}`);
  }
  await browser.close();
})();
