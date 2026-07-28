const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/blog-1', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 7000));
  await p.evaluate(() => window.scrollTo(0, 900));
  await new Promise((r) => setTimeout(r, 400));

  const info = await p.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const visible = [];
    document.querySelectorAll('main [id^="comp-"], header [id^="comp-"], #SITE_HEADER [id^="comp-"], body > [id^="comp-"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return;
      if (r.width < 8 || r.height < 8) return;
      const text = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 50);
      if (/Back|Resource|‹|›|^<$|^>$/i.test(text) || (r.width < 120 && r.height < 80 && r.left < 80)) {
        visible.push({
          id: el.id,
          text,
          top: Math.round(r.top),
          left: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
          pos: getComputedStyle(el).position,
          z: getComputedStyle(el).zIndex,
        });
      }
    });
    // also any element with Back text anywhere
    const backs = [];
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length > 3) return;
      const t = (el.innerText || '').trim();
      if (/Back\s*To\s*Resources/i.test(t) && t.length < 40) {
        const r = el.getBoundingClientRect();
        let cur = el;
        while (cur && !cur.id && cur.parentElement) cur = cur.parentElement;
        backs.push({
          id: cur && cur.id,
          text: t,
          top: Math.round(r.top),
          left: Math.round(r.left),
          w: Math.round(r.width),
          h: Math.round(r.height),
          docY: Math.round(r.top + scrollY),
          pos: getComputedStyle(cur || el).position,
          display: getComputedStyle(cur || el).display,
        });
      }
    });
    return { scrollY: window.scrollY, visible, backs };
  });
  console.log(JSON.stringify(info, null, 2));

  // highlight backs
  await p.evaluate(() => {
    document.querySelectorAll('*').forEach((el) => {
      if (el.children.length > 3) return;
      if (/Back\s*To\s*Resources/i.test((el.innerText || '').trim()) && (el.innerText || '').trim().length < 40) {
        el.style.outline = '3px solid red';
        let cur = el;
        while (cur && !cur.id && cur.parentElement) cur = cur.parentElement;
        if (cur) cur.style.outline = '3px solid lime';
      }
    });
  });
  await p.screenshot({ path: 'artifacts/rollback/live-b1-highlight.png' });
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
