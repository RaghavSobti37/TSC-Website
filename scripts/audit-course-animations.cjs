/**
 * Course animation smoke test.
 *
 * Verifies each standalone course page loads its own page animation bootstrap,
 * the shared Wix motion release helper, and leaves no visible Wix enter motion
 * paused after the static clone settles.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const base = (process.argv[2] || 'http://127.0.0.1:3000').replace(/\/$/, '');
const outDir = path.join(__dirname, '..', 'artifacts', '_course-animation-audit');
fs.mkdirSync(outDir, { recursive: true });

const routes = [
  {
    route: '/the-heart-of-composition',
    mentor: /Sandesh Shandilya/i,
    animationScript: '/js/pages/the-heart-of-composition.animations.js',
  },
  {
    route: '/roots-of-hindustani-classical',
    mentor: /Prasad Khaparde/i,
    animationScript: '/js/pages/roots-of-hindustani-classical.animations.js',
  },
  {
    route: '/music-production',
    mentor: /Luca Petracca/i,
    animationScript: '/js/pages/music-production.animations.js',
  },
];

async function auditRoute(page, spec) {
  await page.goto(base + spec.route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    try {
      sessionStorage.removeItem('wix-motion-played-animations');
    } catch (e) {}
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 2600));

  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const step = Math.max(420, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await sleep(160);
    }
    window.scrollTo(0, 0);
    await sleep(600);
  });

  const result = await page.evaluate((routeSpec) => {
    const issues = [];
    const notes = [];
    const expectedScript = routeSpec.animationScript;
    const bodyText = document.body ? document.body.innerText || '' : '';

    const pageScript = !!document.querySelector(`script[src="${expectedScript}"]`);
    const wixMotion = !!document.querySelector('script[src*="tsc-wix-motion.js"]');
    const reveal = !!document.querySelector('script[src*="tsc-animations.js"]');
    const contentReplacements = !!document.querySelector('script[src*="content-replacements.js"]');
    if (!pageScript) issues.push(`missing page animation script ${expectedScript}`);
    if (!wixMotion) issues.push('missing tsc-wix-motion.js');
    if (!reveal) issues.push('missing tsc-animations.js');
    if (!contentReplacements) issues.push('missing content-replacements.js');
    if (!new RegExp(routeSpec.mentor.source, 'i').test(bodyText)) {
      issues.push(`missing mentor copy ${routeSpec.mentor.source}`);
    }

    let pausedEnter = 0;
    let visibleEnter = 0;
    let runningLoop = 0;
    document.querySelectorAll('[id^="comp-"]').forEach((el) => {
      if (!el.id || el.id.indexOf('__item-') !== -1) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const styles = getComputedStyle(el);
      const animationName = String(styles.animationName || '');
      const playState = String(styles.animationPlayState || '');
      if (animationName.indexOf('motion-') === -1) return;
      if (/motion-(fadeIn|blurIn|flipIn|glideIn)/.test(animationName)) {
        visibleEnter += 1;
        if (el.dataset.motionEnter !== 'done' && playState.indexOf('paused') !== -1) {
          pausedEnter += 1;
          if (pausedEnter <= 5) issues.push(`paused visible enter motion #${el.id}`);
        }
      }
      if (/motion-(breathe|pulse|wiggle)/.test(animationName) && playState.indexOf('running') !== -1) {
        runningLoop += 1;
      }
    });

    const ctaHref = Array.from(document.querySelectorAll('a[href]'))
      .map((anchor) => anchor.getAttribute('href') || '')
      .find((href) => href === '/book-a-call' || href.indexOf('/book-a-call') === 0);
    if (!ctaHref) issues.push('missing book-a-call CTA link');

    notes.push(`visibleEnter=${visibleEnter}`);
    notes.push(`pausedEnter=${pausedEnter}`);
    notes.push(`runningLoop=${runningLoop}`);

    return {
      route: routeSpec.route,
      ok: issues.length === 0,
      issues,
      notes,
      scripts: { pageScript, wixMotion, reveal, contentReplacements },
    };
  }, {
    route: spec.route,
    mentor: { source: spec.mentor.source },
    animationScript: spec.animationScript,
  });

  const slug = spec.route.slice(1).replace(/\//g, '-');
  await page.screenshot({ path: path.join(outDir, `${slug}.png`), fullPage: false });
  return result;
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
  for (const spec of routes) {
    process.stdout.write(`course animation ${spec.route} ... `);
    try {
      const result = await auditRoute(page, spec);
      results.push(result);
      console.log(result.ok ? 'OK' : `FAIL (${result.issues.length})`);
      result.issues.forEach((issue) => console.log('  -', issue));
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      results.push({ route: spec.route, ok: false, issues: [message], notes: [], scripts: {} });
      console.log('ERROR', message);
    }
  }

  await browser.close();

  const failed = results.filter((result) => !result.ok);
  const summary = {
    base,
    at: new Date().toISOString(),
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    results,
  };
  fs.writeFileSync(path.join(outDir, 'report.json'), `${JSON.stringify(summary, null, 2)}\n`);

  console.log('\n==== COURSE ANIMATION SUMMARY ====');
  console.log(`passed ${summary.passed}/${summary.total}`);
  if (failed.length) process.exit(2);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
