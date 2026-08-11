import puppeteer from 'puppeteer';
import fs from 'fs';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
});
const page = await browser.newPage();
await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3000/academy', {
  waitUntil: 'domcontentloaded',
  timeout: 45000,
});
await new Promise((r) => setTimeout(r, 4500));

const info = await page.evaluate(() => {
  const kids = Array.from(
    document.querySelectorAll('.comp-mqwcognj-container > [id^="comp-"]')
  ).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      id: el.id,
      order: getComputedStyle(el).order,
      top: Math.round(r.top),
      h: Math.round(r.height),
      w: Math.round(r.width),
    };
  });

  const tops = [];
  document.querySelectorAll('main [id^="comp-"], .tsc-luca-course-card').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.height > 60 && r.top > -50 && r.top < 1100) {
      tops.push({
        id: el.id || el.className,
        top: Math.round(r.top),
        h: Math.round(r.height),
        text: (el.innerText || '').slice(0, 50).replace(/\s+/g, ' '),
      });
    }
  });
  tops.sort((a, b) => a.top - b.top);

  return {
    scrollY: window.scrollY,
    kids,
    tops: tops.slice(0, 15),
    luca: (() => {
      const el = document.querySelector('.tsc-luca-course-card');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), parent: el.parentElement?.id || el.parentElement?.className };
    })(),
  };
});

fs.writeFileSync('artifacts/academy-responsive/tablet-dom.json', JSON.stringify(info, null, 2));
console.log(JSON.stringify(info, null, 2));
await page.screenshot({
  path: 'artifacts/academy-responsive/tablet-y0.jpg',
  type: 'jpeg',
  quality: 60,
});
await browser.close();
