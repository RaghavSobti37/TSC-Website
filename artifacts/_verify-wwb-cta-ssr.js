const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Inject mobile home CSS so no-JS layout matches
  await page.addStyleTag({ url: 'http://127.0.0.1:3000/css/mobile/home.css' });
  await page.addStyleTag({ url: 'http://127.0.0.1:3000/css/mobile/_tokens.css' });
  await page.evaluate(() => {
    const el = document.getElementById('comp-mrlqkj5b') || document.getElementById('comp-mrlr0ide');
    if (el) el.scrollIntoView({ block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 300));
  const metrics = await page.evaluate(() => {
    const ids = ['comp-mrlr0ide', 'comp-mrlrorgn', 'comp-mrlrqzuf', 'comp-mrlrv5on', 'comp-mrlrv5ly'];
    return ids.map((id) => {
      const host = document.getElementById(id);
      const cta = host && host.querySelector('.tsc-wwb-cta');
      if (!cta) return { id, ok: false };
      cta.scrollIntoView({ block: 'center' });
      const r = cta.getBoundingClientRect();
      const cs = getComputedStyle(cta);
      const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const hit = !!(el && (el === cta || cta.contains(el)));
      return {
        id,
        ok: true,
        label: cta.textContent.trim(),
        href: cta.getAttribute('href'),
        w: Math.round(r.width),
        h: Math.round(r.height),
        bg: cs.backgroundColor,
        color: cs.color,
        order: cs.order,
        hit,
        cardFlex: getComputedStyle(host).flexDirection,
      };
    });
  });
  console.log(JSON.stringify(metrics, null, 2));
  await page.screenshot({ path: path.join(__dirname, 'wwb-cta-ssr-390.png') });
  // full section shot
  const card = await page.$('#comp-mrjla1pr');
  if (card) await card.screenshot({ path: path.join(__dirname, 'wwb-cta-section-390.png') });
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
