const puppeteer = require('puppeteer');
const http = require('http');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve(data));
      })
      .on('error', reject);
  });
}

(async () => {
  const src = await fetchText('http://127.0.0.1:3001/js/content-replacements.js?v=cachebust2');
  console.log('served has re-link', src.includes('a[href="/artist-query"]'));
  console.log('served has promote', src.includes('promoteButtonToLink'));
  console.log('served has linkFindYourCourseCta', src.includes('linkFindYourCourseCta'));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3001/academy', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });

  const snaps = [];
  for (const delay of [0, 800, 1600, 3200, 5000, 8000]) {
    await new Promise((r) => setTimeout(r, delay === 0 ? 0 : delay - (snaps.length ? [0, 800, 1600, 3200, 5000][snaps.length - 1] : 0)));
    const info = await page.evaluate(() => {
      const w = document.querySelector('#comp-mr0g77kb');
      const a = w && w.querySelector('a');
      return {
        href: a && a.getAttribute('href'),
        child: w && w.firstElementChild && w.firstElementChild.tagName,
        linked: w && w.dataset.tscFindCourseLinked,
        html: w ? w.outerHTML.slice(0, 280) : null
      };
    });
    snaps.push({ delay, info });
    console.log(JSON.stringify({ delay, info }));
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
