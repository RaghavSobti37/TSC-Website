const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/harshad-duhita';
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 1500));

  const report = await page.evaluate(() => {
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top + scrollY),
        left: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    };
    const cs = (el) => {
      const s = getComputedStyle(el);
      return { display: s.display, pos: s.position, overflow: s.overflow };
    };

    const sections = [...document.querySelectorAll('section')].map((sec) => {
      const r = rect(sec);
      const s = cs(sec);
      const txt = (sec.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
      const content =
        sec.querySelector('[data-testid="responsive-container-content"]') ||
        sec.querySelector('[class*="-container"]');
      let kids = [];
      if (content) {
        kids = [...content.children].slice(0, 20).map((c) => ({
          id: c.id,
          ...rect(c),
          ...cs(c),
          txt: (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
        }));
      }
      return {
        id: sec.id,
        ...r,
        ...s,
        scrollH: Math.round(sec.scrollHeight),
        txt,
        kidCount: kids.length,
        kids,
      };
    });

    // Overlaps: elements whose boxes intersect another sibling significantly
    const overlaps = [];
    for (const sec of sections) {
      const kids = sec.kids || [];
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i];
          const b = kids[j];
          const ix = Math.max(0, Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left));
          const iy = Math.max(0, Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top));
          const area = ix * iy;
          if (area > 800 && a.h > 20 && b.h > 20) {
            overlaps.push({
              sec: sec.id,
              a: a.id,
              b: b.id,
              area,
              aTxt: a.txt,
              bTxt: b.txt,
            });
          }
        }
      }
    }

    return {
      bodyH: document.body.scrollHeight,
      pageCss: [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).filter((h) => /pages\/|forms/.test(h)),
      sections,
      overlaps: overlaps.slice(0, 40),
    };
  });

  console.log('URL', url, 'bodyH', report.bodyH);
  console.log('CSS', report.pageCss.join('\n'));
  console.log('\n=== SECTIONS ===');
  for (const s of report.sections) {
    console.log(
      `\n#${s.id || '-'} top=${s.top} h=${s.h}/${s.scrollH} ${s.display}/${s.pos} kids=${s.kidCount}`
    );
    console.log(' ', s.txt);
    for (const k of s.kids.slice(0, 14)) {
      console.log(`   - #${k.id} ${k.w}x${k.h} @(${k.left},${k.top}) ${k.pos}/${k.display} | ${k.txt}`);
    }
  }
  console.log('\n=== OVERLAPS ===');
  for (const o of report.overlaps) {
    console.log(`#${o.sec}: ${o.a} ∩ ${o.b} area=${o.area}`);
    console.log(`   A: ${o.aTxt}`);
    console.log(`   B: ${o.bTxt}`);
  }
  await browser.close();
})();
