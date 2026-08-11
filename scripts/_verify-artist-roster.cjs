const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const out = path.join(__dirname, '..', 'artifacts', '_verify-artist-roster');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.setDefaultTimeout(25000);

  await page.goto('http://127.0.0.1:3000/artists', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4000));
  await page.evaluate(() => document.getElementById('comp-mqtnpars')?.scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 800));

  const info = await page.evaluate(() => {
    const mohit = document.getElementById('comp-mqutenq5');
    return {
      mohitExists: !!mohit,
      mohitDisplay: mohit ? getComputedStyle(mohit).display : null,
      mohitW: mohit ? Math.round(mohit.getBoundingClientRect().width) : 0,
      harshad: !!document.getElementById('comp-mqtpn27i'),
      yugm: !!document.getElementById('comp-mqtq8rsp'),
      responsiveCss: [...document.styleSheets].some((s) => (s.href || '').includes('tsc-responsive')),
      pageCss: [...document.styleSheets].some((s) => (s.href || '').includes('artists.css')),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: path.join(out, 'meet-artists.png') });

  for (const route of ['/harshad-duhita', '/yugm']) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    const title = await page.evaluate(() => document.querySelector('h1,h2')?.textContent?.trim());
    console.log(route, title);
    await page.screenshot({ path: path.join(out, route.slice(1) + '-top.png') });
  }

  await browser.close();
  console.log('wrote', out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
