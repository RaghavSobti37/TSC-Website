/**
 * Visual + layout diagnostic for academy family routes.
 * Flags: overflow, tiny text, clipped text, overlapping boxes, zero-height sections,
 * broken images, marquee bbox bleed, stacked hero failures.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  '/academy',
  '/learn-with-tsc',
  '/resources',
  '/artist-path',
  '/roots-of-hindustani-classical',
  '/the-heart-of-composition',
];
const WIDTHS = [375, 768, 1024];
const OUT = path.join(__dirname, '../artifacts/academy-fix');

async function diagnose(page, route, vw) {
  return page.evaluate((viewportW) => {
    const issues = [];
    const vw = viewportW;
    const docOverflow = Math.max(0, document.documentElement.scrollWidth - vw);

    // elements past viewport
    const bleed = [];
    document.querySelectorAll('main *, footer, header, .tsc-nav, [id^="comp-"]').forEach((el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return;
      const b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) return;
      if (b.right > vw + 4 || b.left < -4) {
        const id = el.id || el.className?.toString?.().slice(0, 40) || el.tagName;
        if (bleed.length < 12) {
          bleed.push({
            id: String(id).slice(0, 60),
            left: Math.round(b.left),
            right: Math.round(b.right),
            w: Math.round(b.width),
            tag: el.tagName,
          });
        }
      }
    });

    // tiny text in main
    const tiny = [];
    document.querySelectorAll('main p, main span, main h1, main h2, main h3, main li, main a, main button, main label').forEach((el) => {
      const s = getComputedStyle(el);
      if (s.display === 'none') return;
      const fs = parseFloat(s.fontSize);
      const t = (el.textContent || '').trim();
      if (!t || t.length < 2) return;
      if (fs > 0 && fs < 12) {
        tiny.push({ id: el.id || el.tagName, fs: Math.round(fs * 10) / 10, sample: t.slice(0, 40) });
      }
    });

    // small tap targets that look like buttons
    const smallTap = [];
    document.querySelectorAll('main a.wixui-button, main button, main a.PoVCDy').forEach((el) => {
      const b = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      if (s.display === 'none' || b.width < 1) return;
      if (b.height > 0 && b.height < 40) {
        smallTap.push({
          id: el.id || (el.textContent || '').trim().slice(0, 30),
          h: Math.round(b.height),
          w: Math.round(b.width),
        });
      }
    });

    // broken images
    const brokenImg = [...document.querySelectorAll('main img')].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src?.slice(-80));

    // COURSES title / hero key checks for academy
    const page = document.body.dataset.page || '';
    const coursesTitle = document.querySelector('#comp-mpjyp5wu');
    let coursesTitleInfo = null;
    if (coursesTitle) {
      const b = coursesTitle.getBoundingClientRect();
      const s = getComputedStyle(coursesTitle.querySelector('.wixui-rich-text__text') || coursesTitle);
      coursesTitleInfo = {
        left: Math.round(b.left),
        right: Math.round(b.right),
        overflow: b.right > vw + 2,
        fontSize: s.fontSize,
        whiteSpace: s.whiteSpace,
      };
    }

    // overlapping absolute children still pinned
    const pinned = [];
    document.querySelectorAll('main [id^="comp-"]').forEach((el) => {
      const s = getComputedStyle(el);
      if (s.position !== 'absolute' && s.position !== 'fixed') return;
      if (s.display === 'none') return;
      const b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) return;
      // only flag if parent is flex/grid (should have been flattened)
      const p = el.parentElement;
      if (!p) return;
      const ps = getComputedStyle(p);
      if ((ps.display.includes('flex') || ps.display.includes('grid')) && (parseFloat(s.top) > 40 || parseFloat(s.left) > 40)) {
        if (pinned.length < 8) {
          pinned.push({
            id: el.id,
            pos: s.position,
            top: s.top,
            left: s.left,
            parent: p.id || p.className?.toString?.().slice(0, 30),
          });
        }
      }
    });

    // marquee visibility
    const marquees = [...document.querySelectorAll('.wixui-text-marquee')].map((el) => ({
      id: el.id,
      display: getComputedStyle(el).display,
      b: (() => {
        const r = el.getBoundingClientRect();
        return { l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) };
      })(),
    }));

    // hero first fold content height / empty
    const mainH = document.querySelector('main')?.getBoundingClientRect().height || 0;

    return {
      page,
      docOverflow,
      bleedCount: bleed.length,
      bleed: bleed.slice(0, 8),
      tiny: tiny.slice(0, 8),
      smallTap: smallTap.slice(0, 8),
      brokenImg: brokenImg.slice(0, 5),
      coursesTitleInfo,
      pinned: pinned.slice(0, 6),
      marquees,
      mainH: Math.round(mainH),
    };
  }, vw);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const report = [];

  for (const vw of WIDTHS) {
    await page.setViewport({ width: vw, height: 900, deviceScaleFactor: 1 });
    for (const route of ROUTES) {
      const slug = route.replace(/^\//, '') || 'home';
      await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() =>
        page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
      );
      await new Promise((r) => setTimeout(r, 1200));
      const info = await diagnose(page, route, vw);
      const shot = path.join(OUT, `${slug}-${vw}.png`);
      await page.screenshot({ path: shot, fullPage: false });
      // also mid-page shot for course cards on academy
      if (route === '/academy') {
        await page.evaluate(() => window.scrollTo(0, 900));
        await new Promise((r) => setTimeout(r, 400));
        await page.screenshot({ path: path.join(OUT, `academy-mid-${vw}.png`), fullPage: false });
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      const fail =
        info.docOverflow > 2 ||
        info.bleedCount > 0 ||
        info.tiny.length > 0 ||
        info.brokenImg.length > 0 ||
        (info.coursesTitleInfo && info.coursesTitleInfo.overflow);
      report.push({ route, vw, fail: !!fail, ...info, shot });
      console.log(
        fail ? 'FAIL' : 'OK  ',
        `${route}@${vw}`,
        `overflow=${info.docOverflow}`,
        `bleed=${info.bleedCount}`,
        `tiny=${info.tiny.length}`,
        `tap=${info.smallTap.length}`,
        `page=${info.page}`
      );
      if (info.bleed.length) console.log('  bleed:', JSON.stringify(info.bleed.slice(0, 3)));
      if (info.tiny.length) console.log('  tiny:', JSON.stringify(info.tiny.slice(0, 3)));
      if (info.coursesTitleInfo) console.log('  courses:', JSON.stringify(info.coursesTitleInfo));
      if (info.marquees.length) console.log('  marquee:', JSON.stringify(info.marquees));
    }
  }

  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
  const fails = report.filter((r) => r.fail).length;
  console.log(`\nDONE fails=${fails}/${report.length} → ${OUT}`);
  process.exit(fails ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
