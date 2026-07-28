const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const html = fs.readFileSync(path.join(__dirname, '../public/pages/home.html'), 'utf8');
const id = 'comp-mrlr0ide';
const needle = 'id="' + id + '"';
const i = html.indexOf(needle);
console.log('html idx', i);
if (i >= 0) console.log(html.slice(i, i + 1600));

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 6000));
  const data = await page.evaluate(() => {
    const ids = ['comp-mrlr0ide', 'comp-mrlrorgn', 'comp-mrlrqzuf', 'comp-mrlrv5on', 'comp-mrlrv5ly'];
    return {
      path: location.pathname,
      textLen: document.body.innerText.length,
      hasMentorship: document.body.innerText.includes('Mentorship-led'),
      hasWWB: document.body.innerText.includes('What We Build'),
      cards: ids.map((id) => {
        const host = document.getElementById(id);
        const cta = host && host.querySelector('.tsc-wwb-cta');
        return {
          id,
          host: !!host,
          cta: cta
            ? {
                t: cta.textContent.trim(),
                h: cta.getAttribute('href'),
                w: Math.round(cta.getBoundingClientRect().width),
                ht: Math.round(cta.getBoundingClientRect().height),
                display: getComputedStyle(cta).display,
              }
            : null,
        };
      }),
      ctaGlobal: document.querySelectorAll('.tsc-wwb-cta').length,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: path.join(__dirname, 'wwb-puppeteer.png'), fullPage: true });
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
