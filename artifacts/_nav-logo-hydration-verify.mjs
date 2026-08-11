/**
 * Verify navbar logo is not mutated/shrunk after load.
 * TSC_BASE=http://127.0.0.1:3000 node artifacts/_nav-logo-hydration-verify.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

const out = 'artifacts/nav-logo-hydration';
fs.mkdirSync(out, { recursive: true });

function measureLogo() {
  const logo = document.querySelector(
    '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img.tsc-desktop-brand-logo-unified, header a.tsc-desktop-brand-link img.tsc-desktop-brand-logo-unified'
  );
  if (!logo) return { missing: true };
  const r = logo.getBoundingClientRect();
  const cs = getComputedStyle(logo);
  const header = logo.closest('header');
  const hcs = header ? getComputedStyle(header) : null;
  return {
    missing: false,
    src: (logo.getAttribute('src') || '').split('/').pop().replace(/\?.*$/, ''),
    attrW: logo.getAttribute('width'),
    attrH: logo.getAttribute('height'),
    w: Math.round(r.width),
    h: Math.round(r.height),
    cssW: cs.width,
    cssMaxH: cs.maxHeight,
    mixBlend: cs.mixBlendMode,
    filter: cs.filter,
    navBg: hcs ? hcs.backgroundColor : null,
    locked: header ? header.getAttribute('data-tsc-brand-locked') : null,
    htmlLen: logo.parentElement ? logo.parentElement.innerHTML.length : 0,
  };
}

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';
const routes = ['/', '/about', '/films', '/academy'];
/* Locked desktop nav mark — Collective trim-nav on ALL routes (footer stays academy-aware). */
const expectSrc = {
  '/': 'tsc-logo-trim-nav.png',
  '/about': 'tsc-logo-trim-nav.png',
  '/films': 'tsc-logo-trim-nav.png',
  '/academy': 'tsc-logo-trim-nav.png',
};
const report = [];

for (const route of routes) {
  process.stdout.write(`verify ${route} ... `);
  await page.goto(BASE + route, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });

  await page.waitForFunction(
    () =>
      !!document.querySelector(
        '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img.tsc-desktop-brand-logo-unified, header a.tsc-desktop-brand-link img.tsc-desktop-brand-logo-unified'
      ),
    { timeout: 15000 }
  );
  const early = await page.evaluate(measureLogo);

  await new Promise((r) => setTimeout(r, 3200));
  const late = await page.evaluate(measureLogo);

  const expected = expectSrc[route];
  const brandOk = !late.missing && (late.src || '') === expected;
  /* Locked look @ 1440: clamp(220px,18vw,340px) → ~259×72, mix-blend screen, no invert. */
  const sizeOk =
    late.w >= 220 &&
    late.w <= 340 &&
    late.h >= 60 &&
    late.h <= 76 &&
    Math.abs(late.w - early.w) <= 4 &&
    Math.abs(late.h - early.h) <= 4;
  const lookOk =
    late.mixBlend === 'screen' &&
    (!late.filter || late.filter === 'none');
  const attrsOk = late.attrW == null && late.attrH == null;
  const stable =
    brandOk &&
    lookOk &&
    !early.missing &&
    !late.missing &&
    early.w === late.w &&
    early.h === late.h &&
    early.src === late.src &&
    early.htmlLen === late.htmlLen &&
    early.mixBlend === late.mixBlend &&
    early.filter === late.filter &&
    early.navBg === late.navBg &&
    attrsOk &&
    sizeOk &&
    late.locked === '1';

  const row = { route, early, late, expected, brandOk, stable };
  report.push(row);
  console.log(
    stable ? 'STABLE' : 'DRIFT',
    `early=${early.w}x${early.h}`,
    `late=${late.w}x${late.h}`,
    `attrs=${late.attrW}x${late.attrH}`,
    `blend=${late.mixBlend}`,
    late.src,
    brandOk ? 'brandOK' : `want=${expected}`
  );
}

fs.writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
await browser.close();

const allStable = report.every((r) => r.stable);
console.log(allStable ? '\nPASS: nav logos stable + brand-correct' : '\nFAIL: logo drifted or wrong brand');
process.exit(allStable ? 0 : 1);
