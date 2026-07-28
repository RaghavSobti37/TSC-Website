const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));

  const d = await p.evaluate(() => {
    const sections = [...document.querySelectorAll('main section[data-testid="section-container"]')].map((s) => {
      const r = s.getBoundingClientRect();
      const content = s.querySelector('[data-testid="responsive-container-content"]');
      const cs = getComputedStyle(s);
      const ccs = content ? getComputedStyle(content) : null;
      return {
        id: s.id,
        y: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
        height: cs.height,
        minH: cs.minHeight,
        contentRows: ccs?.gridTemplateRows,
        contentH: content ? Math.round(content.getBoundingClientRect().height) : null,
        text: (s.innerText || '').trim().slice(0, 50).replace(/\s+/g, ' '),
      };
    });

    // empty space detectors: elements with h>400 and little text
    const emptyish = [];
    document.querySelectorAll('main [id^="comp-"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height < 400) return;
      const txt = (el.innerText || '').trim().replace(/\s+/g, ' ');
      const ratio = txt.length / r.height;
      if (ratio < 0.3 || /844px|2532|1181/.test(getComputedStyle(el).height)) {
        emptyish.push({
          id: el.id,
          h: Math.round(r.height),
          y: Math.round(r.top + window.scrollY),
          height: getComputedStyle(el).height,
          minH: getComputedStyle(el).minHeight,
          rows: getComputedStyle(el).gridTemplateRows,
          pos: getComputedStyle(el).position,
          txtLen: txt.length,
          txt: txt.slice(0, 40),
        });
      }
    });

    // curriculum kids
    const curr = document.getElementById('comp-mqqg5lnm');
    const currContent = curr?.querySelector('[data-testid="responsive-container-content"]');
    const currKids = currContent
      ? [...currContent.children].filter((c) => c.id).map((c) => {
          const r = c.getBoundingClientRect();
          return {
            id: c.id,
            h: Math.round(r.height),
            w: Math.round(r.width),
            y: Math.round(r.top + window.scrollY),
            pos: getComputedStyle(c).position,
            height: getComputedStyle(c).height,
            txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
          };
        })
      : [];

    // market section
    const market = document.getElementById('comp-mqp9ymcj');
    const marketContent = market?.querySelector('[data-testid="responsive-container-content"]');
    const marketKids = marketContent
      ? [...marketContent.children].filter((c) => c.id).slice(0, 15).map((c) => {
          const r = c.getBoundingClientRect();
          return {
            id: c.id,
            h: Math.round(r.height),
            w: Math.round(r.width),
            left: Math.round(r.left),
            y: Math.round(r.top + window.scrollY),
            txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
          };
        })
      : [];

    // five pillars
    const pillars = document.getElementById('comp-mqrzoh2l');
    const pillarsH = pillars ? Math.round(pillars.getBoundingClientRect().height) : null;

    return {
      sections,
      emptyish: emptyish.sort((a, b) => b.h - a.h).slice(0, 20),
      currKids,
      marketKids,
      pillarsH,
      scrollH: document.documentElement.scrollHeight,
    };
  });

  console.log(JSON.stringify(d, null, 2));

  // crop accurate sections
  const sharp = require('sharp');
  const path = require('path');
  const shot = path.join(__dirname, 'ma2-artist-path.png');
  const meta = await sharp(shot).metadata();
  for (const s of d.sections) {
    if (s.h < 80) continue;
    const top = Math.max(0, s.y);
    const h = Math.min(s.h, 700, meta.height - top);
    if (h < 40) continue;
    const name = s.text.slice(0, 24).replace(/[^a-z0-9]+/gi, '-').toLowerCase() || s.id;
    await sharp(shot)
      .extract({ left: 0, top, width: 390, height: h })
      .toFile(path.join(__dirname, `ma2-sec-${s.id}.png`));
  }
  console.log('crops done');
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
