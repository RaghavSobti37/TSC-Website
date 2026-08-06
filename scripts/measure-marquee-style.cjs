const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 800 });
  await page.goto('http://127.0.0.1:3000/roots-of-hindustani-classical', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 1500));
  const info = await page.evaluate(() => {
    const el = document.getElementById('comp-mrf1e0bb');
    if (!el) return { missing: true };
    const s = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return {
      dataPage: document.body.dataset.page,
      position: s.position,
      left: s.left,
      right: s.right,
      width: s.width,
      maxWidth: s.maxWidth,
      transform: s.transform,
      overflow: s.overflow,
      inset: s.inset,
      justifySelf: s.justifySelf,
      marginLeft: s.marginLeft,
      bbox: { left: b.left, right: b.right, w: b.width },
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
