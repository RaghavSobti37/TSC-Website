const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2];
  const block = (process.argv[3] || '').split(',').filter(Boolean);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.setRequestInterception(true);
  page.on('request', r => {
    if (block.some(b => r.url().includes(b))) return r.abort();
    r.continue();
  });
  let crashed = false;
  page.on('pageerror', e => { if (String(e).includes('rangeStart')) crashed = true; });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 8000));
  const n = await page.evaluate(() => document.querySelectorAll('section').length);
  console.log(`block=[${block}] rangeStartCrash=${crashed} sections=${n} bodyH=${await page.evaluate(() => document.body.scrollHeight)}`);
  await browser.close();
})();
