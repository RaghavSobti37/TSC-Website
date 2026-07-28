const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/';
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  page.on('pageerror', e => console.log(`[pageerror] ${String(e).slice(0,200)}`));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));
  console.log('before scroll sections:', await page.evaluate(() => document.querySelectorAll('section').length));
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 2500));
  console.log('after scroll sections:', await page.evaluate(() => document.querySelectorAll('section').length), 'bodyH:', await page.evaluate(() => document.body.scrollHeight));
  await browser.close();
})();
