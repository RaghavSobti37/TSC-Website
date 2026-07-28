const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  // force show hero to inspect structure
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/harshad-duhita', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4000));
  const data = await page.evaluate(() => {
    const hero = document.getElementById('comp-mq6h99jp');
    if (!hero) return { missing: true };
    hero.style.setProperty('display', 'flex', 'important');
    hero.style.setProperty('--l_display', 'flex', 'important');
    const content = hero.querySelector('[data-testid="responsive-container-content"]') || hero;
    return Array.from(content.querySelectorAll(':scope > [id^="comp-"], [id^="comp-"]')).slice(0, 40).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        pos: cs.position,
        left: Math.round(r.left),
        top: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      };
    }).filter((x) => x.w > 0 || x.h > 0 || /book|explore|harshad|winner|award/i.test(x.text));
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
