const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 90000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await new Promise(r => setTimeout(r, 8000));
  let t = Date.now();
  try {
    await page.screenshot({ path: 'artifacts/rollback/t1-viewport.png' });
    console.log('viewport shot OK', (Date.now()-t)/1000);
  } catch (e) { console.log('viewport shot FAIL', e.message); }
  t = Date.now();
  try {
    await page.screenshot({ path: 'artifacts/rollback/t2-full.png', fullPage: true });
    console.log('fullpage shot OK', (Date.now()-t)/1000);
  } catch (e) { console.log('fullpage shot FAIL', e.message); }
  await browser.close();
})();
