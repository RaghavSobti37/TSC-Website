const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4000));
  const data = await page.evaluate(() => {
    const hero = document.getElementById('comp-mqhqa6vo');
    hero.style.setProperty('display', 'flex', 'important');
    hero.style.setProperty('--l_display', 'flex', 'important');
    const content = hero.querySelector('[data-testid="responsive-container-content"]');
    return Array.from((content || hero).querySelectorAll('[id^="comp-"]')).slice(0, 30).map((el) => ({
      id: el.id,
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      tag: el.tagName,
      aria: el.getAttribute('aria-label') || '',
    })).filter((x) => x.text || /button|link/i.test(x.aria) || x.tag === 'A');
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
