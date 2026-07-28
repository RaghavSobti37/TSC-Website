const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/learn-with-tsc', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4500));
  const r = await p.evaluate(() => {
    const box = document.querySelector('#comp-mrufx9pg1');
    const h2 = box.querySelector('h2');
    const card = document.querySelector('#comp-mrufx9pp4');
    const m = document.querySelector('#comp-mrufx9qb1');
    const kids = [...m.children]
      .filter((c) => c.id)
      .map((k) => ({
        t: k.innerText.trim(),
        top: Math.round(k.getBoundingClientRect().top),
        l: Math.round(k.getBoundingClientRect().left),
      }));
    const slides = [...document.querySelectorAll('.comp-mrufx9t72-container > .p9hNc1')].map((s) =>
      getComputedStyle(s).visibility
    );
    const tile = document.querySelector('#comp-mrufx9we');
    const icon = document.querySelector('#comp-mrufx9ne');
    const feat = document.querySelector('#comp-mrufx9nc5');
    return {
      coursesW: Math.round(box.getBoundingClientRect().width),
      cardW: Math.round(card.getBoundingClientRect().width),
      gap: Math.round(card.getBoundingClientRect().top - box.getBoundingClientRect().bottom),
      placeSelf: getComputedStyle(box).placeSelf,
      width: getComputedStyle(box).width,
      grid: getComputedStyle(box.parentElement).gridTemplateColumns,
      mentorKids: kids,
      mentorFlex: getComputedStyle(m).flexDirection,
      slides,
      tileW: tile ? Math.round(tile.getBoundingClientRect().width) : null,
      iconWH: icon
        ? { w: Math.round(icon.getBoundingClientRect().width), h: Math.round(icon.getBoundingClientRect().height) }
        : null,
      featFlex: feat ? getComputedStyle(feat).flexDirection : null,
      fs: getComputedStyle(h2).fontSize,
      ws: getComputedStyle(h2).whiteSpace,
    };
  });
  console.log(JSON.stringify(r, null, 2));
  await p.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 3000));
  const u = await p.evaluate(() => getComputedStyle(document.querySelector('[data-text="UNFOLD"]')).fontSize);
  console.log('UNFOLD', u);
  await b.close();
})();
