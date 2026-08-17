const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const bad = [];
  page.on('response', (r) => {
    if (r.status() >= 400) bad.push(r.status() + ' ' + r.url());
  });
  const base = process.argv[2] || 'http://127.0.0.1:3100';
  const route = process.argv[3] || '/artist-query';
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 12000));
  console.log(JSON.stringify(bad, null, 1));
  await browser.close();
})();
