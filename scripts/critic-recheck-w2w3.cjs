const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 800 });
  const routes = [
    '/artist-path',
    '/learn-with-tsc',
    '/roots-of-hindustani-classical',
    '/the-heart-of-composition',
  ];
  let fail = 0;

  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 1500));
    const info = await page.evaluate(() => {
      const vw = window.innerWidth;
      const bad = [];
      document.querySelectorAll('.wixui-text-marquee, h1.font_0, #comp-mrufx9mw8').forEach((el) => {
        const s = getComputedStyle(el);
        if (s.display === 'none' || s.visibility === 'hidden') return;
        const b = el.getBoundingClientRect();
        if (b.width < 2) return;
        if (b.right > vw + 2 || b.left < -2) {
          bad.push({
            id: el.id || el.tagName,
            left: Math.round(b.left),
            right: Math.round(b.right),
            w: Math.round(b.width),
          });
        }
      });
      const ctaVisible = [...document.querySelectorAll('a, button')].some((el) => {
        const t = (el.textContent || '').trim();
        if (!/enroll|apply now|book a call|book an artist|learn/i.test(t)) return false;
        const b = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return s.display !== 'none' && b.width > 0 && b.height > 0;
      });
      return {
        overflow: Math.max(document.documentElement.scrollWidth - vw, 0),
        bad,
        ctaVisible,
      };
    });
    const ok = info.overflow <= 1 && info.bad.length === 0 && info.ctaVisible;
    console.log(ok ? 'OK' : 'FAIL', route, JSON.stringify(info));
    if (!ok) fail++;
  }

  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
