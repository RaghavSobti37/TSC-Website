/**
 * Desktop animation audit — all primary + key subpages @1440.
 * Flags stuck reveals, paused Wix enter motions, missing motion boot, hero blur.
 *
 * Usage: node scripts/audit-animations.cjs [baseUrl]
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const base = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '');
const outDir = path.join(__dirname, '..', 'artifacts', '_animation-audit');
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  '/',
  '/about',
  '/work',
  '/artists',
  '/artist-path',
  '/learn-with-tsc',
  '/films',
  '/resources',
  '/academy',
  '/harshad-duhita',
  '/yugm',
  '/book-an-artist',
  '/artist-query',
  '/collab-query',
  '/book-a-call',
  '/music-production',
  '/roots-of-hindustani-classical',
  '/the-heart-of-composition',
  '/mba',
  '/kalki',
  '/mahaprbhu',
  '/mahavatar-narsimha',
  '/hanuman-ansh',
  '/affiliate',
];

async function auditPage(page, route) {
  await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    try {
      sessionStorage.removeItem('wix-motion-played-animations');
    } catch (e) {}
  });
  // Fresh load after clearing storage so enter motions can play
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2200));

  // Scroll through page to trigger reveals / slideshows
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const max = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const step = Math.max(400, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await sleep(180);
    }
    window.scrollTo(0, 0);
    await sleep(400);
  });
  await new Promise((r) => setTimeout(r, 1600));

  const report = await page.evaluate((routePath) => {
    const vh = window.innerHeight || 900;
    const issues = [];
    const notes = [];

    const hasWixMotion = !!document.querySelector(
      'script[src*="tsc-wix-motion"], link[href*="tsc-wix-motion"], link[data-tsc-wix-motion-css]'
    );
    const hasReveal = !!document.querySelector('script[src*="tsc-animations"]');
    const hasPageAnim =
      !!document.querySelector('script[src*=".animations.js"]') ||
      !!document.getElementById('wix-skip-played-animations');

    if (!hasWixMotion) issues.push('missing tsc-wix-motion boot');
    if (!hasPageAnim) notes.push('no page animations script tag (may be inlined)');
    if (!hasReveal) notes.push('tsc-animations.js not loaded yet');

    // Stuck TSC reveals in viewport
    document.querySelectorAll('.tsc-reveal-pending').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (r.top > vh * 0.95 || r.bottom < 0) return;
      const op = parseFloat(getComputedStyle(el).opacity);
      if (op < 0.15) {
        issues.push(
          `stuck tsc-reveal-pending opacity=${op.toFixed(2)} #${el.id || el.className.slice(0, 40)}`
        );
      }
    });

    // Paused Wix enter motions still not done after settle window
    let pausedEnter = 0;
    let doneEnter = 0;
    document.querySelectorAll('[id^="comp-"]').forEach((el) => {
      if (!el.id || el.id.indexOf('__item-') !== -1) return;
      const cs = getComputedStyle(el);
      const names = String(cs.animationName || '');
      if (!names || names === 'none' || names.indexOf('motion-') === -1) return;
      const isEnter = /motion-(fadeIn|blurIn|flipIn|glideIn)/.test(names);
      if (!isEnter) return;
      if (el.dataset.motionEnter === 'done') {
        doneEnter += 1;
        return;
      }
      const playState = String(cs.animationPlayState || '');
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      if (playState.indexOf('paused') !== -1) {
        pausedEnter += 1;
        if (pausedEnter <= 8) {
          issues.push(`paused enter motion #${el.id} (${names.split(',')[0]})`);
        }
      }
    });
    notes.push(`enter done=${doneEnter} pausedLeft=${pausedEnter}`);

    // Home hero UNFOLD
    if (routePath === '/') {
      const unfold = document.getElementById('comp-mrxkm2y2');
      if (!unfold) {
        issues.push('home UNFOLD node missing');
      } else {
        const cs = getComputedStyle(unfold);
        const blur = cs.filter || '';
        const op = parseFloat(cs.opacity);
        if (/blur\(/i.test(blur) && !/blur\(0/.test(blur)) {
          issues.push(`UNFOLD still blurred: ${blur.slice(0, 60)}`);
        }
        if (unfold.dataset.motionEnter !== 'done') {
          issues.push('UNFOLD data-motion-enter not done');
        }
        notes.push(`UNFOLD opacity=${op} enter=${unfold.dataset.motionEnter || 'unset'}`);
      }
      const slides = document.querySelectorAll('[data-testid="slideshow"] .p9hNc1');
      const active = document.querySelectorAll(
        '[data-testid="slideshow"] .p9hNc1.xjQkF3, [data-testid="slideshow"] .p9hNc1.fABPvj'
      );
      notes.push(`slideshow slides=${slides.length} active=${active.length}`);
      if (slides.length >= 2 && active.length === 0) {
        issues.push('slideshow has slides but none active');
      }
    }

    // Artist heroes should be visible
    if (routePath === '/harshad-duhita' || routePath === '/yugm') {
      const hero = document.querySelector('main section');
      if (!hero) issues.push('no main section');
      else {
        const r = hero.getBoundingClientRect();
        const op = parseFloat(getComputedStyle(hero).opacity);
        if (r.height < 200) issues.push(`hero too short h=${Math.round(r.height)}`);
        if (op < 0.2) issues.push(`hero opacity ${op}`);
        const h = document.querySelector('h1, h2');
        notes.push(`title=${(h && h.textContent || '').trim().slice(0, 40)}`);
      }
    }

    // Invisible main text in first viewport
    let invisibleText = 0;
    document.querySelectorAll('main [data-testid="richTextElement"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > vh || r.bottom < 0 || r.width < 2 || r.height < 2) return;
      const op = parseFloat(getComputedStyle(el).opacity);
      const vis = getComputedStyle(el).visibility;
      if (op < 0.05 || vis === 'hidden') invisibleText += 1;
    });
    if (invisibleText > 3) {
      issues.push(`${invisibleText} richText nodes invisible in first viewport`);
    }

    return {
      route: routePath,
      ok: issues.length === 0,
      issues,
      notes,
      scripts: {
        wixMotion: hasWixMotion,
        pageAnim: hasPageAnim,
        reveal: hasReveal,
      },
    };
  }, route);

  const slug = route === '/' ? 'home' : route.slice(1).replace(/\//g, '-');
  await page.screenshot({ path: path.join(outDir, slug + '.png') });
  return report;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  page.setDefaultTimeout(60000);

  const results = [];
  for (const route of routes) {
    process.stdout.write(`audit ${route} ... `);
    try {
      const r = await auditPage(page, route);
      results.push(r);
      console.log(r.ok ? 'OK' : `FAIL (${r.issues.length})`);
      if (!r.ok) r.issues.forEach((i) => console.log('  -', i));
    } catch (e) {
      results.push({ route, ok: false, issues: [String(e.message || e)], notes: [], scripts: {} });
      console.log('ERROR', e.message || e);
    }
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  const summary = {
    base,
    at: new Date().toISOString(),
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  };
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(summary, null, 2));
  console.log('\n==== SUMMARY ====');
  console.log(`passed ${summary.passed}/${summary.total}`);
  if (failed.length) {
    failed.forEach((f) => {
      console.log(`\n${f.route}`);
      (f.issues || []).forEach((i) => console.log('  -', i));
    });
    process.exit(2);
  }
  console.log('all animation checks green');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
