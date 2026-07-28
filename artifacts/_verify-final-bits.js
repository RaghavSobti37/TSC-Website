const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));
const sharp = require(path.resolve(__dirname, '..', 'node_modules', 'sharp'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  // artists accordion crop
  await page.goto('http://127.0.0.1:3000/artists', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 5000));
  const meet = await page.evaluate(() => {
    const el = document.querySelector('#comp-mqtnpars, .tsc-artists-accordion');
    const acc = document.querySelector('.tsc-artists-accordion');
    const r = (acc || el)?.getBoundingClientRect();
    return {
      top: Math.round((r?.top || 0) + window.scrollY),
      h: Math.round(r?.height || 0),
      links: Array.from(document.querySelectorAll('.tsc-artist-acc__cta')).map((a) => ({
        href: a.getAttribute('href'),
        name: a.closest('.tsc-artist-acc')?.querySelector('.tsc-artist-acc__bar-name, .tsc-artist-acc__collapsed-name')?.textContent?.trim(),
      })),
    };
  });
  console.log('MEET', JSON.stringify(meet, null, 2));
  await page.evaluate((t) => window.scrollTo(0, Math.max(0, t - 40)), meet.top);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: 'artifacts/rollback/v390b-artists-meet.png' });

  // yugm tracks
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const tracks = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('#comp-mqhqa73a [id*="__item"]')).filter((el) => /__item[^_]*$/.test(el.id) || /__item1$|__item-/.test(el.id));
    // unique top-level items
    const top = Array.from(document.querySelectorAll('#comp-mqhqa73a [id^="comp-mqhqa73q4__item"]'));
    return {
      top: top.map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left) };
      }),
      heroDesc: (() => {
        const el = document.getElementById('comp-mqhqa6wl3');
        if (!el) return null;
        const t = el.querySelector('*');
        return { color: getComputedStyle(t || el).color, text: el.textContent.trim().slice(0, 50), w: el.offsetWidth };
      })(),
    };
  });
  console.log('TRACKS', JSON.stringify(tracks, null, 2));

  await page.goto('http://127.0.0.1:3000/harshad-duhita', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const hd = await page.evaluate(() => {
    const el = document.getElementById('comp-mq6igg7l');
    const nodes = el ? Array.from(el.querySelectorAll('*')).slice(0, 5) : [];
    return {
      desc: nodes.map((n) => ({ tag: n.tagName, color: getComputedStyle(n).color, fs: getComputedStyle(n).fontSize, t: n.textContent.trim().slice(0, 30) })),
      badge: (() => {
        const b = document.getElementById('comp-mq9gnhcn');
        if (!b) return null;
        return { display: getComputedStyle(b).display, w: b.offsetWidth, color: getComputedStyle(b).color, t: b.textContent.trim().slice(0, 40) };
      })(),
    };
  });
  console.log('HD', JSON.stringify(hd, null, 2));
  await browser.close();
})();
