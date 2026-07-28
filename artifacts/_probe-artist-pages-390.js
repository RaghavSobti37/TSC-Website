/**
 * Quick DOM layout probe for artist profile pages @390.
 */
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const routes = ['/artists', '/harshad-duhita', '/yugm'];
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

  for (const route of routes) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 4500));
    const report = await page.evaluate(() => {
      const vw = window.innerWidth;
      const links = Array.from(document.querySelectorAll('main a[href]')).map((a) => ({
        href: a.getAttribute('href'),
        text: (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      })).filter((x) => /learn more|harshad|yugm|young|blank/i.test(x.href + ' ' + x.text));

      const accordion = Array.from(document.querySelectorAll('.tsc-artist-acc__cta')).map((a) => ({
        href: a.getAttribute('href'),
        name: a.closest('.tsc-artist-acc')?.querySelector('.tsc-artist-acc__bar-name, .tsc-artist-acc__collapsed-name')?.textContent?.trim(),
      }));

      const sections = Array.from(document.querySelectorAll('main section.wixui-section')).map((sec) => {
        const r = sec.getBoundingClientRect();
        const kids = Array.from(sec.querySelectorAll('[id^="comp-"]')).slice(0, 40);
        const overlaps = [];
        const boxes = kids.map((el) => ({ id: el.id, r: el.getBoundingClientRect() })).filter((x) => x.r.width > 20 && x.r.height > 20);
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < Math.min(boxes.length, i + 8); j++) {
            const a = boxes[i].r;
            const b = boxes[j].r;
            const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
            const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
            const area = ox * oy;
            if (area > 800 && ox > 40 && oy > 40) {
              // skip parent/child
              const elA = document.getElementById(boxes[i].id);
              const elB = document.getElementById(boxes[j].id);
              if (elA && elB && (elA.contains(elB) || elB.contains(elA))) continue;
              overlaps.push({ a: boxes[i].id, b: boxes[j].id, area: Math.round(area) });
            }
          }
        }
        const overflowX = Math.max(0, Math.round(r.right - vw));
        return {
          id: sec.id,
          h: Math.round(r.height),
          overflowX,
          overlaps: overlaps.slice(0, 8),
        };
      });

      return {
        path: location.pathname,
        page: document.body.getAttribute('data-page'),
        scrollH: document.body.scrollHeight,
        accordion,
        links: links.slice(0, 20),
        badSections: sections.filter((s) => s.overflowX > 2 || s.overlaps.length || s.h < 8),
        sectionCount: sections.length,
        tinySections: sections.filter((s) => s.h > 0 && s.h < 40).map((s) => s.id + ':' + s.h),
      };
    });
    console.log(JSON.stringify(report, null, 2));
  }
  await browser.close();
})();
