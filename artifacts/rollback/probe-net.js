const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/about';
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const pending = new Map();
  page.on('request', r => pending.set(r.url(), Date.now()));
  page.on('requestfinished', r => pending.delete(r.url()));
  page.on('requestfailed', r => pending.delete(r.url()));
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    console.log('domcontentloaded OK');
  } catch (e) {
    console.log('goto failed:', e.message);
  }
  await new Promise(r => setTimeout(r, 15000));
  console.log(`pending after settle: ${pending.size}`);
  for (const [u, t] of pending) console.log(`  ${(Date.now() - t) / 1000}s  ${u.slice(0, 160)}`);
  const title = await page.evaluate(() => document.title).catch(e => 'EVAL FAIL ' + e.message);
  console.log('title:', title);
  await browser.close();
})();
