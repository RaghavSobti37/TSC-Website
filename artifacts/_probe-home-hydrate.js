const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const failed = [];
  page.on('requestfailed', (req) => failed.push({ url: req.url().slice(0, 120), err: req.failure() && req.failure().errorText }));
  page.on('response', async (res) => {
    if (res.status() >= 400 && /thunderbolt|pages\/|home|c1dmp/i.test(res.url())) {
      failed.push({ url: res.url().slice(0, 140), status: res.status() });
    }
  });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 8000));
  const data = await page.evaluate(() => {
    const main = document.querySelector('main');
    return {
      textLen: document.body.innerText.length,
      mainLen: main && main.innerHTML.length,
      sitePagesLen: (document.getElementById('SITE_PAGES') || {}).innerHTML?.length,
      sections: [...document.querySelectorAll('section')].map((s) => s.id),
      // Is SSR content still in a template?
      templates: document.querySelectorAll('template').length,
      hasWarmup: !!document.getElementById('wix-warmup-data'),
      pageHtmlHasCard: document.documentElement.innerHTML.includes('comp-mrlr0ide'),
      // Try finding via querySelector class
      byClass: !!document.querySelector('.comp-mrlr0ide'),
      byContainer: !!document.querySelector('.comp-mrlr0ide-container'),
    };
  });
  console.log(JSON.stringify({ data, failed: failed.slice(0, 40) }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
