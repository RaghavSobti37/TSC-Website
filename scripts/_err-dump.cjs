const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  page.on('requestfailed', (r) => errs.push('REQFAIL: ' + r.url() + ' :: ' + (r.failure() && r.failure().errorText)));
  const base = process.argv[2] || 'http://127.0.0.1:3100';
  const route = process.argv[3] || '/artist-query';
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 12000));
  console.log(JSON.stringify(errs, null, 1));
  await browser.close();
})();
