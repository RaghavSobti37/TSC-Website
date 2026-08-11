/**
 * Prove / and /academy desktop nav logos match locked Collective mark.
 * TSC_BASE=http://127.0.0.1:3000 node artifacts/_logo-match-verify.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

const out = 'artifacts/logo-probe';
fs.mkdirSync(out, { recursive: true });
const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';

function measure() {
  const logo = document.querySelector(
    '.tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img.tsc-desktop-brand-logo-unified'
  );
  if (!logo) return { missing: true };
  const r = logo.getBoundingClientRect();
  const cs = getComputedStyle(logo);
  const header = logo.closest('header');
  return {
    missing: false,
    src: (logo.getAttribute('src') || '').split('?')[0].split('/').pop(),
    fullSrc: logo.getAttribute('src'),
    w: Math.round(r.width * 10) / 10,
    h: Math.round(r.height * 10) / 10,
    filter: cs.filter,
    blend: cs.mixBlendMode,
    cssW: cs.width,
    maxH: cs.maxHeight,
    locked: header ? header.getAttribute('data-tsc-brand-locked') : null,
    brand: logo.closest('a') ? logo.closest('a').dataset.tscBrandLogo : null,
    headerKind: header
      ? header.classList.contains('tsc-desktop-site-header')
        ? 'custom'
        : 'wix-locked'
      : null,
  };
}

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.setDefaultNavigationTimeout(90000);

const report = {};
for (const route of ['/', '/academy']) {
  const samples = [];
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForFunction(
    () => !!document.querySelector('.tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img'),
    { timeout: 20000 }
  ).catch(() => null);

  for (const wait of [0, 600, 2000, 4000]) {
    if (wait) await new Promise((r) => setTimeout(r, wait === 600 ? 600 : wait === 2000 ? 1400 : 2000));
    samples.push({ atMs: wait, ...(await page.evaluate(measure)) });
  }

  const slug = route === '/' ? 'home' : 'academy';
  await page.screenshot({ path: `${out}/${slug}-nav.png`, clip: { x: 0, y: 0, width: 1440, height: 130 } });
  const late = samples[samples.length - 1];
  const lx = late.missing ? 20 : Math.max(0, 20);
  await page.screenshot({ path: `${out}/${slug}-logo.png`, clip: { x: lx, y: 8, width: 340, height: 110 } });
  report[route] = samples;
  console.log(route, JSON.stringify(samples, null, 2));
}

fs.writeFileSync(`${out}/match-report.json`, JSON.stringify(report, null, 2));

const home = report['/'][report['/'].length - 1];
const acad = report['/academy'][report['/academy'].length - 1];
const sameSrc = home.src === 'tsc-logo-trim-nav.png' && acad.src === 'tsc-logo-trim-nav.png';
const sameBlend = home.blend === 'screen' && acad.blend === 'screen';
const noInvert =
  (!home.filter || home.filter === 'none') && (!acad.filter || acad.filter === 'none');
const sizeOk =
  home.w >= 220 &&
  home.w <= 340 &&
  acad.w >= 220 &&
  acad.w <= 340 &&
  Math.abs(home.w - acad.w) <= 8 &&
  Math.abs(home.h - acad.h) <= 8;
const stableHome = report['/'].every(
  (s) => !s.missing && s.src === home.src && Math.abs(s.w - home.w) <= 4
);
const stableAcad = report['/academy'].every(
  (s) => !s.missing && s.src === acad.src && Math.abs(s.w - acad.w) <= 4
);

const pass = sameSrc && sameBlend && noInvert && sizeOk && stableHome && stableAcad;
console.log('\nSUMMARY', {
  sameSrc,
  sameBlend,
  noInvert,
  sizeOk,
  stableHome,
  stableAcad,
  home: { src: home.src, w: home.w, h: home.h, blend: home.blend, filter: home.filter },
  academy: { src: acad.src, w: acad.w, h: acad.h, blend: acad.blend, filter: acad.filter },
  pass,
});

await browser.close();
process.exit(pass ? 0 : 1);
