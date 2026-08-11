import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';
const outDir = 'artifacts/nav-flash';
fs.mkdirSync(outDir, { recursive: true });

const routes = ['/', '/work', '/academy', '/artist-path'];

async function probe(route) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.evaluateOnNewDocument(() => {
    window.__shots = [];
    const snap = (label) => {
      const headers = Array.from(document.querySelectorAll('header, .tsc-desktop-site-header, .tsc-mobile-site-header'));
      const visible = headers
        .map((h) => {
          const s = getComputedStyle(h);
          const r = h.getBoundingClientRect();
          return {
            id: h.id,
            cls: String(h.className || '').slice(0, 90),
            display: s.display,
            vis: s.visibility,
            opacity: s.opacity,
            w: Math.round(r.width),
            h: Math.round(r.height),
            top: Math.round(r.top),
            locked: h.getAttribute('data-tsc-locked-desktop-header'),
            brand: h.getAttribute('data-tsc-brand-locked'),
            legacy: h.classList.contains('tsc-legacy-header'),
            hiddenCls: h.classList.contains('tsc-locked-desktop-header-hidden'),
            text: (h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70),
            logos: Array.from(h.querySelectorAll('img, svg')).slice(0, 4).map((el) => {
              const lr = el.getBoundingClientRect();
              return {
                tag: el.tagName,
                src: (el.getAttribute('src') || '').split('/').pop(),
                w: Math.round(lr.width),
                h: Math.round(lr.height),
                display: getComputedStyle(el).display,
              };
            }),
          };
        })
        .filter((h) => h.display !== 'none' && h.vis !== 'hidden' && h.w > 0 && h.h > 0 && Number(h.opacity) > 0);
      window.__shots.push({
        t: Math.round(performance.now()),
        label,
        visibleCount: visible.length,
        visible,
        customDesktop: !!document.querySelector('.tsc-desktop-site-header'),
        customMobile: !!document.querySelector('.tsc-mobile-site-header'),
      });
    };
    const times = [0, 50, 100, 200, 400, 800, 1200, 2000, 3500];
    document.addEventListener('DOMContentLoaded', () => {
      times.forEach((ms) => setTimeout(() => snap(String(ms)), ms));
    });
  });

  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.screenshot({
    path: `${outDir}/${route.replace(/\//g, '_') || 'home'}-t0.png`,
    clip: { x: 0, y: 0, width: 1440, height: 220 },
  });
  await new Promise((r) => setTimeout(r, 3800));
  await page.screenshot({
    path: `${outDir}/${route.replace(/\//g, '_') || 'home'}-late.png`,
    clip: { x: 0, y: 0, width: 1440, height: 220 },
  });
  const shots = await page.evaluate(() => window.__shots);
  fs.writeFileSync(`${outDir}/${route.replace(/\//g, '_') || 'home'}.json`, JSON.stringify(shots, null, 2));
  console.log('\n====', route, '====');
  for (const s of shots) {
    console.log(
      s.label,
      'vis=',
      s.visibleCount,
      'customD=',
      s.customDesktop,
      'customM=',
      s.customMobile,
      s.visible.map((h) => `${h.id || h.cls.slice(0, 24)} h=${h.h} logos=${JSON.stringify(h.logos)} text=${h.text}`).join(' || ')
    );
  }
  await browser.close();
}

for (const route of routes) {
  await probe(route);
}
