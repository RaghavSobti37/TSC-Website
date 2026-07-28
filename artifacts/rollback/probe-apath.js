const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));

  const data = await page.evaluate(() => {
    const findByText = (re) => {
      const els = [...document.querySelectorAll('[data-testid="richTextElement"], h1, h2, h3, p')];
      return els.filter(el => re.test((el.innerText || '').trim())).map(el => {
        const sec = el.closest('section[data-testid="section-container"]');
        const box = el.closest('[id^="comp-"]');
        const r = el.getBoundingClientRect();
        return {
          text: (el.innerText || '').trim().slice(0, 80),
          id: el.id || null,
          boxId: box?.id || null,
          sectionId: sec?.id || null,
          fontSize: getComputedStyle(el).fontSize,
          w: Math.round(r.width),
          h: Math.round(r.height),
          y: Math.round(r.top + window.scrollY),
        };
      });
    };

    const sectionInfo = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const content = el.querySelector('[data-testid="responsive-container-content"]') || el;
      const kids = [...content.children].filter(c => c.id).map(c => {
        const cr = c.getBoundingClientRect();
        return {
          id: c.id,
          w: Math.round(cr.width),
          h: Math.round(cr.height),
          top: Math.round(cr.top + window.scrollY),
          left: Math.round(cr.left),
          position: getComputedStyle(c).position,
          display: getComputedStyle(c).display,
        };
      });
      return {
        id,
        h: Math.round(r.height),
        w: Math.round(r.width),
        minH: cs.minHeight,
        height: cs.height,
        display: cs.display,
        kids,
      };
    };

    // Program glance tiles text wrap check
    const glanceTexts = [...document.querySelectorAll('#comp-mqpa1hfr [data-testid="richTextElement"]')]
      .map(el => {
        const r = el.getBoundingClientRect();
        const t = (el.innerText || '').trim();
        return { id: el.id, t, w: Math.round(r.width), h: Math.round(r.height), fs: getComputedStyle(el.querySelector('.wixui-rich-text__text') || el).fontSize };
      });

    // Find sections by headings
    const headings = [
      /Program at a Glance/i,
      /What Is The Artist Path/i,
      /Why We Built This/i,
      /What Artists Receive/i,
      /What You Will Work On/i,
      /The Framework/i,
    ];
    const found = {};
    for (const re of headings) {
      found[re.source] = findByText(re);
    }

    // All main sections heights
    const sections = [...document.querySelectorAll('main section[data-testid="section-container"]')].map(s => {
      const r = s.getBoundingClientRect();
      const firstText = (s.innerText || '').trim().slice(0, 60).replace(/\s+/g, ' ');
      return {
        id: s.id,
        h: Math.round(r.height),
        y: Math.round(r.top + window.scrollY),
        text: firstText,
        minH: getComputedStyle(s).minHeight,
        height: getComputedStyle(s).height,
      };
    });

    // Overlap detector for kids in a section
    const overlapsIn = (sid) => {
      const el = document.getElementById(sid);
      if (!el) return [];
      const content = el.querySelector('[data-testid="responsive-container-content"]') || el;
      const kids = [...content.querySelectorAll(':scope > [id^="comp-"]')];
      const overs = [];
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect();
          const b = kids[j].getBoundingClientRect();
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 8 && oy > 8) {
            overs.push({ a: kids[i].id, b: kids[j].id, ox: Math.round(ox), oy: Math.round(oy) });
          }
        }
      }
      return overs;
    };

    return {
      found,
      glanceTexts,
      sections: sections.filter(s => s.h > 50),
      glanceSec: sectionInfo('comp-mqrxqf3i'),
      pa1hfr: sectionInfo('comp-mqpa1hfr'),
      scrollH: document.documentElement.scrollHeight,
      scrollW: document.documentElement.scrollWidth,
    };
  });

  // Resolve section IDs from found headings, probe overlaps
  const sectionIds = new Set();
  for (const arr of Object.values(data.found)) {
    for (const x of arr) if (x.sectionId) sectionIds.add(x.sectionId);
  }

  const more = await page.evaluate((ids) => {
    const sectionInfo = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const content = el.querySelector('[data-testid="responsive-container-content"]') || el;
      const kids = [...content.children].filter(c => c.id).slice(0, 30).map(c => {
        const cr = c.getBoundingClientRect();
        const txt = (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' ');
        return {
          id: c.id,
          w: Math.round(cr.width),
          h: Math.round(cr.height),
          top: Math.round(cr.top + window.scrollY),
          left: Math.round(cr.left),
          position: getComputedStyle(c).position,
          txt,
        };
      });
      return {
        id,
        h: Math.round(r.height),
        minH: cs.minHeight,
        height: cs.height,
        display: getComputedStyle(content).display,
        gridCols: getComputedStyle(content).gridTemplateColumns,
        kids,
      };
    };
    const overlapsIn = (sid) => {
      const el = document.getElementById(sid);
      if (!el) return [];
      const content = el.querySelector('[data-testid="responsive-container-content"]') || el;
      const kids = [...content.querySelectorAll(':scope > [id^="comp-"]')];
      const overs = [];
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect();
          const b = kids[j].getBoundingClientRect();
          if (a.width < 2 || b.width < 2) continue;
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 12 && oy > 12) {
            overs.push({ a: kids[i].id, b: kids[j].id, ox: Math.round(ox), oy: Math.round(oy) });
          }
        }
      }
      return overs;
    };
    const out = {};
    for (const id of ids) {
      out[id] = { info: sectionInfo(id), overlaps: overlapsIn(id) };
    }
    return out;
  }, [...sectionIds]);

  console.log(JSON.stringify({ ...data, sectionsDetail: more }, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
