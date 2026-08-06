const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // Heart @1024 structure
  await page.setViewport({ width: 1024, height: 900 });
  await page.goto('http://127.0.0.1:3000/the-heart-of-composition', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  const heart = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        id: el.id,
        display: s.display,
        color: s.color,
        bg: s.backgroundColor,
        fs: s.fontSize,
        left: Math.round(b.left),
        right: Math.round(b.right),
        w: Math.round(b.width),
        h: Math.round(b.height),
        text: (el.innerText || '').trim().slice(0, 80),
      };
    };
    const darkText = [...document.querySelectorAll('main p, main span, main h1, main h2')]
      .filter((el) => {
        const s = getComputedStyle(el);
        if (s.display === 'none' || !(el.textContent || '').trim()) return false;
        const c = s.color;
        // rgb dark
        const m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return false;
        const lum = (Number(m[1]) + Number(m[2]) + Number(m[3])) / 3;
        return lum < 80 && parseFloat(s.fontSize) >= 10;
      })
      .slice(0, 8)
      .map((el) => ({
        id: el.closest('[id^=comp-]')?.id,
        color: getComputedStyle(el).color,
        fs: getComputedStyle(el).fontSize,
        sample: (el.textContent || '').trim().slice(0, 50),
      }));
    return {
      page: document.body.dataset.page,
      enroll: pick('#comp-mpmjflor'),
      heroBox: pick('#comp-mpmjflon'),
      tags: pick('[id^="comp-mpmw"]') || pick('#comp-mpmwah7z'),
      darkText,
      firstSections: [...document.querySelectorAll('main section, main [data-testid="mesh-container-content"]')]
        .slice(0, 3)
        .map((el) => ({
          id: el.id,
          h: Math.round(el.getBoundingClientRect().height),
          children: el.children.length,
        })),
    };
  });
  console.log('HEART', JSON.stringify(heart, null, 2));

  // Resources cards @375
  await page.setViewport({ width: 375, height: 900 });
  await page.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(() => window.scrollTo(0, 600));
  const resources = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('#comp-mparh5c7 [id^="comp-"], .wixui-box')]
      .filter((el) => {
        const t = (el.innerText || '').trim();
        return /Waveform|Cakewalk|BandLab|Get Resource/i.test(t);
      })
      .slice(0, 6)
      .map((el) => {
        const b = el.getBoundingClientRect();
        const title = el.querySelector('p, h2, span, .wixui-rich-text__text');
        return {
          id: el.id,
          h: Math.round(b.height),
          w: Math.round(b.width),
          titleFs: title ? getComputedStyle(title).fontSize : null,
          sample: (el.innerText || '').trim().slice(0, 60),
        };
      });
    const tabs = [...document.querySelectorAll('[role="tab"], [id^="tab-comp-"]')].map((el) => {
      const b = el.getBoundingClientRect();
      return { id: el.id, left: Math.round(b.left), right: Math.round(b.right), text: (el.innerText || '').trim().slice(0, 30) };
    });
    return { cards, tabs };
  });
  console.log('RESOURCES', JSON.stringify(resources, null, 2));

  // Academy course cards + button scale
  await page.setViewport({ width: 375, height: 900 });
  await page.goto('http://127.0.0.1:3000/academy', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  const academy = await page.evaluate(() => {
    const btn = document.querySelector('#comp-mqwe17k6 a, #comp-mqwe17k6 .wixui-button');
    const label = btn?.querySelector('.wixui-button__label') || btn;
    const ls = label ? getComputedStyle(label) : null;
    return {
      btn: btn
        ? {
            fs: ls.fontSize,
            transform: ls.transform,
            h: Math.round(btn.getBoundingClientRect().height),
            text: (label.textContent || '').trim(),
          }
        : null,
      course1: (() => {
        const el = document.querySelector('#comp-mpjvo1xd, .comp-mpjvo1xd-container');
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return { id: el.id, h: Math.round(b.height), w: Math.round(b.width) };
      })(),
    };
  });
  console.log('ACADEMY', JSON.stringify(academy, null, 2));

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
