const path = require('path');
const fs = require('fs');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/the-heart-of-composition';
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));

  const info = await page.evaluate(() => {
    const sections = [...document.querySelectorAll('main section.wixui-section')].map(sec => {
      const r = sec.getBoundingClientRect();
      const txt = (sec.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      return {
        id: sec.id,
        y: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
        w: Math.round(r.width),
        txt,
      };
    });

    // Find elements mentioning Mentor / Curriculum / Chapter / COURSE
    const hits = [];
    const walk = (el) => {
      if (!el || el.nodeType !== 1) return;
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      const id = el.id || '';
      if (id && (
        /^Mentor:/i.test(t.slice(0, 40)) ||
        t === 'COURSE 001' || t === 'COURSE 002' || t === 'COURSE 003' ||
        /Curriculum Overview/i.test(t.slice(0, 40)) ||
        /^Chapter\s/i.test(t.slice(0, 30)) ||
        /writing-mode|sideways/.test(getComputedStyle(el).writingMode || '')
      )) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        hits.push({
          id,
          tag: el.tagName,
          w: Math.round(r.width),
          h: Math.round(r.height),
          x: Math.round(r.left),
          y: Math.round(r.top + window.scrollY),
          wm: cs.writingMode,
          transform: cs.transform,
          display: cs.display,
          pos: cs.position,
          txt: t.slice(0, 60),
        });
      }
      // rotated text via transform
      if (id) {
        const cs = getComputedStyle(el);
        if (cs.transform && cs.transform !== 'none' && /matrix/.test(cs.transform)) {
          const m = cs.transform.match(/matrix\(([^)]+)\)/);
          if (m) {
            const parts = m[1].split(',').map(Number);
            // approx 90deg rotation: a~0 b~±1
            if (Math.abs(parts[0]) < 0.2 && Math.abs(parts[1]) > 0.8) {
              const r = el.getBoundingClientRect();
              const t2 = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
              if (t2) hits.push({
                id, tag: el.tagName, rotated: true,
                w: Math.round(r.width), h: Math.round(r.height),
                x: Math.round(r.left), y: Math.round(r.top + window.scrollY),
                transform: cs.transform, txt: t2,
              });
            }
          }
        }
      }
      [...el.children].forEach(walk);
    };
    walk(document.querySelector('main'));

    // Accordion roots
    const acc = [...document.querySelectorAll('[class*="AccordionContainer"]')].slice(0, 20).map(el => {
      const r = el.getBoundingClientRect();
      const root = el.closest('[id^="comp-"]') || el;
      return {
        id: root.id || el.className.toString().slice(0, 40),
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.left),
        y: Math.round(r.top + window.scrollY),
        txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      };
    });

    return { sections, hits, acc };
  });

  console.log('=== SECTIONS ===');
  info.sections.forEach(s => console.log(`${s.id} y=${s.y} h=${s.h} w=${s.w} | ${s.txt}`));
  console.log('=== HITS ===');
  info.hits.forEach(h => console.log(JSON.stringify(h)));
  console.log('=== ACCORDIONS ===');
  info.acc.forEach(a => console.log(JSON.stringify(a)));
  await browser.close();
})();
