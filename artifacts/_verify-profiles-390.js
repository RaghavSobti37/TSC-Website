const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  for (const route of ['/harshad-duhita', '/yugm']) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));
    const report = await page.evaluate(() => {
      const hero = document.querySelector('main section');
      const book = Array.from(document.querySelectorAll('a, [role="button"]')).filter((el) =>
        /book for events/i.test(el.textContent || el.getAttribute('aria-label') || '')
      ).map((el) => ({
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        href: el.getAttribute('href'),
        visible: !!(el.offsetWidth && el.offsetHeight),
        w: el.offsetWidth,
        section: el.closest('section')?.id,
      }));
      const firstH = Array.from(document.querySelectorAll('main h1, main [data-testid="richTextElement"]')).slice(0, 6).map((el) => ({
        t: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        visible: !!(el.offsetWidth && el.offsetHeight),
        w: el.offsetWidth,
        top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      }));
      const heroSec = document.getElementById(location.pathname.includes('yugm') ? 'comp-mqhqa6vo' : 'comp-mq6h99jp');
      const hs = heroSec ? getComputedStyle(heroSec) : null;
      const videos = ['comp-mqhv0mup', 'comp-mqhv0mup_img', 'comp-mqji4hyt', 'comp-mqji4hyt_img'].map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { id, w: Math.round(r.width), h: Math.round(r.height) };
      }).filter(Boolean);
      return {
        path: location.pathname,
        heroDisplay: hs && hs.display,
        heroH: heroSec && Math.round(heroSec.getBoundingClientRect().height),
        book,
        firstH,
        videos,
        scrollH: document.body.scrollHeight,
      };
    });
    console.log(JSON.stringify(report, null, 2));
  }
  await browser.close();
})();
