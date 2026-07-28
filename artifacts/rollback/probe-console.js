const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2];
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  page.on('console', m => { if (['error','warning'].includes(m.type())) console.log(`[${m.type()}] ${m.text().slice(0,220)}`); });
  page.on('pageerror', e => console.log(`[pageerror] ${String(e).slice(0,300)}`));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  console.log('sections:', await page.evaluate(() => document.querySelectorAll('section').length), 'bodyH:', await page.evaluate(() => document.body.scrollHeight));
  await browser.close();
})();
