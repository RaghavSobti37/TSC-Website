/**
 * Slice D — mobile CSS ownership + desktop media gate + no H-scroll.
 *
 * Prefers puppeteer (package.json); falls back to playwright if present.
 * Target: http://127.0.0.1:$PORT (default 3001). Starts serve-mirror if needed.
 *
 * Exit 0 pass / 1 fail. Prints JSON summary.
 */
import { createRequire } from 'module';
import { spawn } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const require = createRequire(path.join(ROOT, 'package.json'));

const PORT = Number(process.env.PORT || 3001);
const BASE = `http://127.0.0.1:${PORT}`;
const MEDIA_NEEDLE = 'max-width: 1024';

const PATHS = [
  '/',
  '/about',
  '/work',
  '/artists',
  '/yugm',
  '/learn-with-tsc',
  '/films',
  '/resources',
  '/academy',
  '/mba',
];

/** H-scroll checked on these (primaries + sample) */
const NO_HSCROLL = new Set(PATHS);

const VIEW_DESKTOP = { width: 1280, height: 800 };
const VIEW_PHONE = { width: 390, height: 844 };
const VIEW_TABLET = { width: 768, height: 1024 };

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadPkgDeps() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  return { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
}

async function resolveBrowser() {
  const deps = loadPkgDeps();
  if (deps.puppeteer) {
    try {
      const puppeteer = require('puppeteer');
      return { kind: 'puppeteer', puppeteer };
    } catch (e) {
      /* fall through */
    }
  }
  const healingPlaywright = path.join(
    ROOT,
    '..',
    '..',
    '.cursor',
    'healing-loop',
    'node_modules',
    'playwright'
  );
  const candidates = [
    deps.playwright ? 'playwright' : null,
    fs.existsSync(healingPlaywright) ? healingPlaywright : null,
  ].filter(Boolean);
  for (const c of candidates) {
    try {
      const pw = require(c);
      return { kind: 'playwright', playwright: pw };
    } catch (e) {
      /* try next */
    }
  }
  throw new Error(
    'No browser driver: install puppeteer (preferred) or playwright. package.json lists puppeteer.'
  );
}

function httpOk(url, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(timeoutMs, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function ensureServer() {
  if (await httpOk(BASE + '/')) {
    return { started: false, url: BASE };
  }
  const script = path.join(ROOT, 'scripts', 'serve-mirror.js');
  if (!fs.existsSync(script)) {
    throw new Error(
      `Server not up at ${BASE} and scripts/serve-mirror.js missing. Start: node scripts/serve-mirror.js ${PORT}`
    );
  }
  const child = spawn(process.execPath, [script, String(PORT)], {
    cwd: ROOT,
    stdio: 'ignore',
    detached: true,
    windowsHide: true,
  });
  child.unref();
  for (let i = 0; i < 40; i++) {
    await sleep(250);
    if (await httpOk(BASE + '/')) {
      return { started: true, url: BASE, pid: child.pid };
    }
  }
  throw new Error(
    `Server not reachable at ${BASE}. Start manually: node scripts/serve-mirror.js ${PORT}`
  );
}

function slugFromPath(p) {
  if (p === '/' || p === '/home') return 'home';
  return p.replace(/^\//, '').split('/')[0] || 'home';
}

function expectedCssFile(slug, routeMap) {
  const map = routeMap && routeMap.SLUG_TO_CSS;
  if (map && map[slug]) return map[slug];
  return slug + '.css';
}

async function withPage(browserApi, viewport, fn) {
  if (browserApi.kind === 'puppeteer') {
    const browser = await browserApi.puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    });
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(60000);
      await page.setViewport(viewport);
      return await fn(page, 'puppeteer');
    } finally {
      await browser.close();
    }
  }
  const browser = await browserApi.playwright.chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(60000);
    return await fn(page, 'playwright');
  } finally {
    await browser.close();
  }
}

async function goto(page, kind, url) {
  if (kind === 'puppeteer') {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  } else {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  await sleep(2200);
}

/** Collect mobile ownership + media gate state from the live page. */
async function inspectPage(page) {
  return page.evaluate((mediaNeedle) => {
    function isMobileOwnerLink(link) {
      const href = link.getAttribute('href') || '';
      return (
        href.indexOf('/css/mobile/') !== -1 ||
        href.indexOf('tsc-mobile-system') !== -1 ||
        (link.getAttribute('data-tsc-href') || '').indexOf('/css/mobile/') !== -1 ||
        (link.getAttribute('data-tsc-href') || '').indexOf('tsc-mobile-system') !== -1
      );
    }

    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(
      isMobileOwnerLink
    );

    const linkReports = links.map((link) => {
      const href = link.href || link.getAttribute('href') || '';
      const media = String(link.media || '');
      const mediaOk = media.toLowerCase().indexOf(mediaNeedle) !== -1;
      let sheetDisabled = false;
      try {
        // CSSOM: unmatched media → sheet null / disabled
        const sheet = link.sheet;
        sheetDisabled = !sheet || sheet.disabled === true;
      } catch (e) {
        sheetDisabled = true;
      }
      const mqMatches =
        !media ||
        (window.matchMedia && window.matchMedia(media).matches);
      const applied = mqMatches && !sheetDisabled;
      return {
        href,
        media,
        mediaOk,
        sheetDisabled,
        mqMatches: !!mqMatches,
        applied,
        ok: mediaOk || !applied,
      };
    });

    const map = window.TSCMobileRouteMap || null;
    const expectedHref = map && typeof map.hrefForPath === 'function' ? map.hrefForPath() : null;
    const expectedBare = expectedHref ? expectedHref.split('?')[0] : null;

    const pageOwnerLinks = links.filter((l) => {
      const h = l.getAttribute('href') || l.href || '';
      return (
        h.indexOf('/css/mobile/') !== -1 &&
        h.indexOf('/css/mobile/boot.css') === -1 &&
        h.indexOf('/_') === -1
      );
    });

    const ownerHrefs = pageOwnerLinks.map((l) => (l.getAttribute('href') || l.href || '').split('?')[0]);

    const scrollWidth = document.documentElement.scrollWidth;
    const innerWidth = window.innerWidth;

    return {
      path: location.pathname,
      viewport: { w: innerWidth, h: window.innerHeight },
      linkReports,
      ownerHrefs,
      expectedBare,
      mapPresent: !!map,
      mapVersion: map && map.VERSION,
      scrollWidth,
      innerWidth,
      hScrollOk: scrollWidth <= innerWidth + 2,
    };
  }, MEDIA_NEEDLE);
}

function fail(msg, detail) {
  return { ok: false, error: msg, ...detail };
}

async function runDesktop(browserApi) {
  return withPage(browserApi, VIEW_DESKTOP, async (page, kind) => {
    const results = [];
    for (const route of PATHS) {
      const url = BASE + route + '?v=mobile-own-verify';
      try {
        await goto(page, kind, url);
        const d = await inspectPage(page);
        const badLinks = (d.linkReports || []).filter((r) => !r.ok);
        const mediaOk = badLinks.length === 0;
        // At desktop, mobile sheets must not apply. Vacuous OK if none injected.
        const noneApplied = (d.linkReports || []).every((r) => !r.applied || r.mediaOk);
        const ok = mediaOk && noneApplied;
        results.push({
          route,
          check: 'desktop-media-gate',
          ok,
          links: d.linkReports.length,
          badLinks,
          appliedLeak: (d.linkReports || []).filter((r) => r.applied && !r.mediaOk),
        });
      } catch (e) {
        results.push({ route, check: 'desktop-media-gate', ok: false, error: e.message });
      }
    }
    return results;
  });
}

async function runNarrow(browserApi, viewport, label) {
  return withPage(browserApi, viewport, async (page, kind) => {
    const results = [];
    for (const route of PATHS) {
      const url = BASE + route + '?v=mobile-own-verify';
      try {
        await goto(page, kind, url);
        // Wait briefly for boot / wireMobileAssets links
        await page
          .waitForFunction(
            () =>
              !!document.querySelector(
                'link[href*="/css/mobile/"], link[data-tsc-href*="/css/mobile/"], link[href*="tsc-mobile-system"]'
              ) || !!window.TSCMobileRouteMap,
            { timeout: 8000 }
          )
          .catch(() => {});
        await sleep(800);
        const d = await inspectPage(page);
        const slug = slugFromPath(route);
        const expectedFile = expectedCssFile(
          slug,
          await page.evaluate(() => window.TSCMobileRouteMap || null)
        );
        const expectedBare = '/css/mobile/' + expectedFile;

        const ownerMatch =
          d.ownerHrefs.length === 0
            ? false
            : d.ownerHrefs.some((h) => h === expectedBare || h.endsWith(expectedBare));

        // Prefer single owner file (ignore boot.css already filtered)
        const uniqueOwners = Array.from(new Set(d.ownerHrefs.filter((h) => h.indexOf(expectedBare) !== -1 || h.endsWith('/' + expectedFile))));
        const oneOwner =
          d.ownerHrefs.filter((h) => /\/css\/mobile\/[^/_][^/]*\.css$/.test(h) || /\/css\/mobile\/[^/]+\.css$/.test(h))
            .length <= 2; /* page css + optional legacy; fail if many unrelated */

        const pageCssOwners = d.ownerHrefs.filter(
          (h) =>
            h.indexOf('/css/mobile/') !== -1 &&
            !h.endsWith('/boot.css') &&
            h.indexOf('/_') === -1
        );
        const distinctPageCss = Array.from(new Set(pageCssOwners));
        const singleOwnerOk =
          distinctPageCss.length === 1 && distinctPageCss[0].endsWith('/' + expectedFile);

        const checks = {
          ownership: singleOwnerOk || ownerMatch,
          hScroll: NO_HSCROLL.has(route) ? d.hScrollOk : true,
        };
        const ok = checks.ownership && checks.hScroll;

        results.push({
          route,
          check: label,
          ok,
          expectedBare,
          ownerHrefs: d.ownerHrefs,
          distinctPageCss,
          scrollWidth: d.scrollWidth,
          innerWidth: d.innerWidth,
          hScrollOk: d.hScrollOk,
          mapPresent: d.mapPresent,
          failures: [
            !checks.ownership ? 'owner-mismatch' : null,
            !checks.hScroll ? 'h-scroll' : null,
          ].filter(Boolean),
        });
      } catch (e) {
        results.push({ route, check: label, ok: false, error: e.message });
      }
    }
    return results;
  });
}

async function main() {
  const summary = {
    base: BASE,
    port: PORT,
    driver: null,
    server: null,
    results: [],
    failed: 0,
    passed: 0,
    exit: 1,
  };

  try {
    summary.server = await ensureServer();
    const browserApi = await resolveBrowser();
    summary.driver = browserApi.kind;

    const desktop = await runDesktop(browserApi);
    const phone = await runNarrow(browserApi, VIEW_PHONE, 'phone-390');
    const tablet = await runNarrow(browserApi, VIEW_TABLET, 'tablet-768');

    summary.results = [...desktop, ...phone, ...tablet];
    for (const r of summary.results) {
      if (r.ok) summary.passed++;
      else summary.failed++;
    }
    summary.exit = summary.failed ? 1 : 0;
  } catch (e) {
    summary.error = e.message || String(e);
    summary.failed = 1;
    summary.exit = 1;
  }

  const outPath = path.join(ROOT, 'artifacts', 'mobile-ownership-verify.json');
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.exit);
}

main();
