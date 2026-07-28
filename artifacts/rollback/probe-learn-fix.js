const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/learn-with-tsc', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 9000));
  const info = await page.evaluate(() => {
    const box = document.querySelector('#comp-mrufx9nf7');
    const h = box.querySelector('h1');
    const hCs = getComputedStyle(h);
    let foundH1Rule = null;
    let learnMedia = null;
    for (const sheet of document.styleSheets) {
      if (!sheet.href || !sheet.href.includes('mobile/learn.css')) continue;
      try {
        for (const rule of sheet.cssRules) {
          if (rule.media) learnMedia = rule.media.mediaText;
          const nest = rule.cssRules || [];
          for (const r of nest) {
            if (r.selectorText && r.selectorText.includes('mrufx9n35 h1') && r.style.fontSize) {
              foundH1Rule = { sel: r.selectorText, fs: r.style.fontSize, media: learnMedia };
            }
          }
        }
      } catch (e) {
        return { err: String(e) };
      }
    }
    const q = document.querySelector('[id^="comp-mrufx9tw"]');
    const qcs = q && getComputedStyle(q);
    const c3 = document.querySelector('.comp-mrufx9rt2-container');
    const c3cs = getComputedStyle(c3);
    return {
      foundH1Rule,
      learnMedia,
      hFs: hCs.fontSize,
      hW: hCs.width,
      hWw: hCs.overflowWrap,
      boxInline: box.getAttribute('style'),
      hInline: h.getAttribute('style'),
      boxW: getComputedStyle(box).width,
      quote: qcs && { w: qcs.width, h: qcs.height, order: qcs.order },
      c3fd: c3cs.flexDirection,
      // title ids for feature cards
      titleIds: [...document.querySelectorAll('#comp-mrufx9n35 h1')].map((el) => el.closest('[id^="comp-"]').id),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
