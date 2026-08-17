const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const hits = [];
  page.on('request', (r) => {
    const u = r.url();
    if (/viewerScript|thunderbolt-platform|site-assets-webworker|FormViewerWidget/.test(u)) {
      hits.push(r.method() + ' ' + u.slice(0, 180));
    }
  });
  const base = process.argv[2] || 'http://127.0.0.1:3100';
  const route = process.argv[3] || '/artist-query';
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 12000));
  console.log(JSON.stringify(hits, null, 1));
  await browser.close();
})();
