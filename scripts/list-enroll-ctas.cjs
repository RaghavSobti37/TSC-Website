const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 800 });
  for (const route of ['/roots-of-hindustani-classical', '/artist-path']) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1000));
    const ctas = await page.evaluate(() =>
      [...document.querySelectorAll('a, button')]
        .map((el) => (el.textContent || '').trim())
        .filter((t) => /enroll|book|apply|join/i.test(t))
        .slice(0, 12)
    );
    console.log(route, ctas);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
