// Usage: node shot-one.js <baseUrl> <route> <outfile> [width]
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const [baseUrl, route, outfile, widthArg] = process.argv.slice(2);
  const width = Number(widthArg || 1280);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 240000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  await page.goto(baseUrl.replace(/\/$/, '') + route, { waitUntil: 'load', timeout: 90000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 800) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(__dirname, outfile), fullPage: true });
  console.log(`${route} -> ${outfile} (${await page.evaluate(() => document.body.scrollHeight)}px)`);
  await browser.close();
})();
