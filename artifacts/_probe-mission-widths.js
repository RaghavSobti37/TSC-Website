const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000/pages/home.html?cb=' + Date.now(), {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await page.waitForSelector('#comp-mrjf9qo2');

  const m = await page.evaluate(() => {
    const cardEl = document.getElementById('comp-mrjghajj');
    const textEl = document.getElementById('comp-mrjf9qo2');
    const card = cardEl.getBoundingClientRect();
    const text = textEl.getBoundingClientRect();
    const paras = [...document.querySelectorAll('#comp-mrjf9qo2 p.wixui-rich-text__text')].filter(
      (p) => !p.querySelector('.wixGuard')
    );
    const ranges = paras.map((p) => {
      const r = document.createRange();
      r.selectNodeContents(p);
      const rects = [...r.getClientRects()];
      const maxW = Math.max(0, ...rects.map((x) => x.width));
      return {
        text: p.innerText.slice(0, 48),
        maxLineW: Math.round(maxW),
        paraW: Math.round(p.getBoundingClientRect().width),
      };
    });
    return {
      cardW: Math.round(card.width),
      textW: Math.round(text.width),
      textLeftPad: Math.round(text.left - card.left),
      textRightPad: Math.round(card.right - text.right),
      fillRatio: +(text.width / card.width).toFixed(3),
      ranges,
    };
  });

  console.log(JSON.stringify(m, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
