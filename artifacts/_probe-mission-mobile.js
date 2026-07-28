const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000/pages/home.html', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await page.waitForSelector('#comp-mrjf9qo2', { timeout: 30000 });
  await page.evaluate(() => {
    document.getElementById('comp-mrjghajj')?.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));

  const metrics = await page.evaluate(() => {
    const card = document.getElementById('comp-mrjghajj');
    const text = document.getElementById('comp-mrjf9qo2');
    const book = document.getElementById('comp-mrgdw3wu');
    const collab = document.getElementById('comp-mrgdw3uq');
    const italic = text?.querySelector('span[style*="italic"]');
    const p = text?.querySelector('p.wixui-rich-text__text');
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const cardCs = cs(card);
    const textCs = cs(text);
    const pCs = cs(p);
    const italCs = cs(italic);
    const bookCs = cs(book);
    const collabCs = cs(collab);
    const cardRect = card?.getBoundingClientRect();
    const textRect = text?.getBoundingClientRect();
    const pRect = p?.getBoundingClientRect();
    return {
      viewport: window.innerWidth,
      card: {
        w: Math.round(cardRect?.width || 0),
        padL: cardCs?.paddingLeft,
        padR: cardCs?.paddingRight,
      },
      text: {
        w: Math.round(textRect?.width || 0),
        maxW: textCs?.maxWidth,
        width: textCs?.width,
      },
      p: {
        w: Math.round(pRect?.width || 0),
        fontSize: pCs?.fontSize,
        lineHeight: pCs?.lineHeight,
        maxW: pCs?.maxWidth,
      },
      italic: {
        display: italCs?.display,
        fontSize: italCs?.fontSize,
        marginTop: italCs?.marginTop,
      },
      book: { display: bookCs?.display, visibility: bookCs?.visibility },
      collab: {
        w: Math.round(collab?.getBoundingClientRect().width || 0),
        gridColumn: collabCs?.gridColumn,
      },
      cssLoaded: !!document.querySelector('link[href*="mobile/home"]'),
    };
  });

  console.log(JSON.stringify(metrics, null, 2));
  await page.screenshot({
    path: 'artifacts/mission-orange-mobile-fix.png',
    fullPage: false,
  });
  console.log('screenshot: artifacts/mission-orange-mobile-fix.png');
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
