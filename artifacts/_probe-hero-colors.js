const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/harshad-duhita', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const data = await page.evaluate(() => {
    const ids = ['comp-mq6i6vma', 'comp-mq6igg7l', 'comp-mq9gnhcn', 'comp-mq7kv6vq', 'comp-mq7lgwyt', 'comp-mq7limoj', 'comp-mq6ibhwz', 'comp-mq6h99jp'];
    return ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const cs = getComputedStyle(el);
      const text = el.querySelector('.wixui-rich-text__text, span, p, h1');
      const tcs = text ? getComputedStyle(text) : null;
      return {
        id,
        color: cs.color,
        bg: cs.backgroundColor,
        textColor: tcs && tcs.color,
        fontSize: tcs && tcs.fontSize,
        opacity: cs.opacity,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      };
    });
  });
  console.log(JSON.stringify(data, null, 2));

  // yugm track item structure
  await page.goto('http://127.0.0.1:3000/yugm', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const tracks = await page.evaluate(() => {
    const item = document.querySelector('#comp-mqhqa73a [id*="__item1"]') || document.querySelector('#comp-mqhqa73a [id*="__item"]');
    if (!item) return { missing: true };
    return Array.from(item.querySelectorAll('[id^="comp-"]')).slice(0, 20).map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.id, w: Math.round(r.width), h: Math.round(r.height), text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40) };
    });
  });
  console.log('TRACK', JSON.stringify(tracks, null, 2));
  await browser.close();
})();
