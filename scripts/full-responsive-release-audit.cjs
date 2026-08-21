const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const BASE = process.env.TSC_AUDIT_BASE || 'http://127.0.0.1:3000';
const OUT = path.join(ROOT, 'artifacts', 'final-responsive-audit');
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'pages', 'routes.manifest.json'), 'utf8'));
const routes = manifest.allRoutes;
const internalRoutes = new Set([
  ...manifest.allRoutes,
  ...manifest.aliases.map((entry) => entry.alias),
]);
const viewports = [
  { key: 'mobile', width: 390, height: 844 },
  { key: 'desktop', width: 1440, height: 900 },
];

function cleanPath(value) {
  return (value || '/').replace(/\/+$/, '') || '/';
}

function actionablePageErrors(errors) {
  const legacyWixNoise = /wix-thunderbolt|clientWorker|ChunkLoadError|did not find the pageId|platformWorkerPromise|runPlatformOnPage|play\(\) request was interrupted|Expected ',' or '}' after property value|Invalid or unexpected token/i;
  return errors.filter((message) => !legacyWixNoise.test(message));
}

async function auditPage(page, route, viewport) {
  const pageErrors = [];
  const consoleErrors = [];
  const onPageError = (error) => pageErrors.push(error.message);
  const onConsole = (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  };
  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  let status = 0;
  let navigationError = '';
  try {
    const response = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    status = response ? response.status() : 0;
    await new Promise((resolve) => setTimeout(resolve, route === '/academy' ? 1800 : 700));
  } catch (error) {
    navigationError = error.message;
  }

  const metrics = await page.evaluate((currentRoute, isMobile) => {
    const isVisible = (element) => {
      if (!element) return false;
      if (element.closest('[aria-hidden="true"]')) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    };
    const labelFor = (element) => (element.getAttribute('aria-label') || element.getAttribute('title') || element.textContent || '').trim().replace(/\s+/g, ' ');
    const controls = [...document.querySelectorAll('button, [role="button"], summary, a[href]')].filter(isVisible);
    const buttonLike = controls.filter((element) => {
      if (element.matches('button, [role="button"], summary')) return true;
      return /button|cta/i.test(String(element.className)) || element.matches('.wixui-button, .tsc-academy-mobile-course-card__cta');
    });
    const clippedControls = buttonLike.filter((element) => {
      const style = getComputedStyle(element);
      if (style.overflow === 'visible') return false;
      return element.scrollWidth > element.clientWidth + 3 || element.scrollHeight > element.clientHeight + 3;
    }).map((element) => ({ label: labelFor(element).slice(0, 80), id: element.id || '', className: String(element.className).slice(0, 100) }));
    const smallTapTargets = isMobile ? buttonLike.filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40);
    }).map((element) => {
      const rect = element.getBoundingClientRect();
      return { label: labelFor(element).slice(0, 80), width: Math.round(rect.width), height: Math.round(rect.height) };
    }) : [];
    const unnamedControls = controls.filter((element) => !labelFor(element)).map((element) => ({ tag: element.tagName, id: element.id || '', className: String(element.className).slice(0, 100) }));
    const anchors = [...document.querySelectorAll('a[href]')].filter(isVisible).map((anchor) => ({
      label: labelFor(anchor).slice(0, 100),
      href: anchor.getAttribute('href') || '',
    }));
    const invalidAnchors = anchors.filter((anchor) => !anchor.href || anchor.href === '#' || /^javascript:/i.test(anchor.href));
    const samePageMissingHashes = anchors.filter((anchor) => {
      if (!anchor.href.includes('#')) return false;
      const parsed = new URL(anchor.href, location.href);
      if (parsed.origin !== location.origin || parsed.pathname !== location.pathname || !parsed.hash || parsed.hash === '#') return false;
      return !document.getElementById(decodeURIComponent(parsed.hash.slice(1)));
    });
    const brokenImages = [...document.querySelectorAll('img')].filter((image) => {
      if (!isVisible(image)) return false;
      return image.complete && image.naturalWidth === 0;
    }).map((image) => image.getAttribute('src') || '').slice(0, 20);
    const visibleMain = [...document.querySelectorAll('main, [data-main-content-parent="true"], #SITE_PAGES')].find(isVisible);
    const mobileStylesheet = [...document.styleSheets].some((sheet) => /\/css\/mobile\//.test(sheet.href || ''));
    const header = [...document.querySelectorAll('.tsc-mobile-site-header, .tsc-desktop-site-header, header, #SITE_HEADER')].find(isVisible);
    const footer = [...document.querySelectorAll('.tsc-mobile-footer, .tsc-desktop-footer, footer, #SITE_FOOTER')].find(isVisible);
    const newsletter = [...document.querySelectorAll('form, [data-tsc-newsletter-form], .tsc-footer-newsletter')].find((element) => isVisible(element) && /newsletter|subscribe/i.test(element.textContent || element.getAttribute('aria-label') || ''));
    const formPage = /query|book-|review|affiliate-apply/.test(currentRoute);
    const visibleForm = [...document.querySelectorAll('form')].find(isVisible);

    let menuTogglePass = true;
    const mobileMenu = document.querySelector('.tsc-mobile-site-header details.tsc-mobile-menu');
    if (isMobile && mobileMenu) {
      const summary = mobileMenu.querySelector(':scope > summary');
      if (summary) {
        summary.click();
        menuTogglePass = mobileMenu.open === true;
        summary.click();
        menuTogglePass = menuTogglePass && mobileMenu.open === false;
      }
    }

    const result = {
      title: document.title,
      path: location.pathname,
      overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      bodyHeight: document.documentElement.scrollHeight,
      mainHeight: visibleMain ? Math.round(visibleMain.getBoundingClientRect().height) : 0,
      header: Boolean(header),
      footer: Boolean(footer),
      mobileStylesheet,
      menuTogglePass,
      brokenImages,
      invalidAnchors,
      samePageMissingHashes,
      unnamedControls,
      clippedControls,
      smallTapTargets,
      links: anchors,
      formPage,
      visibleForm: Boolean(visibleForm),
      newsletter: Boolean(newsletter),
    };

    if (currentRoute === '/academy') {
      const cards = [...document.querySelectorAll('.tsc-academy-mobile-course-card')].filter(isVisible);
      result.academy = {
        shell: Boolean(document.querySelector('.tsc-academy-mobile-experience')),
        cardCount: cards.length,
        cardHeights: cards.map((card) => Math.round(card.getBoundingClientRect().height)),
        featureCount: [...document.querySelectorAll('.tsc-academy-mobile-feature')].filter(isVisible).length,
        guidanceCtas: [...document.querySelectorAll('.tsc-academy-mobile-guidance a[href]')].filter(isVisible).length,
      };
    }
    if (currentRoute === '/' && isMobile) {
      const closing = document.querySelector('.tsc-home-mobile-closing-cta');
      result.homeClosingCta = {
        visible: Boolean(closing && isVisible(closing)),
        linkCount: closing ? [...closing.querySelectorAll('a[href]')].filter(isVisible).length : 0,
        beforeFooter: Boolean(closing && closing.nextElementSibling && closing.nextElementSibling.matches('.tsc-shared-footer-host')),
      };
    }
    if (currentRoute === '/affiliate-apply') {
      result.affiliateApply = {
        academyHeader: Boolean(document.querySelector('.tsc-mobile-site-header-academy, .tsc-desktop-site-header-academy')),
        form: Boolean(visibleForm),
      };
    }
    return result;
  }, route, viewport.key === 'mobile');

  const screenshotPath = path.join(OUT, viewport.key, (route === '/' ? 'home' : route.slice(1)) + '.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  page.off('pageerror', onPageError);
  page.off('console', onConsole);
  const ownedPageErrors = actionablePageErrors(pageErrors);

  const failures = [];
  if (navigationError) failures.push('navigation: ' + navigationError);
  if (status !== 200) failures.push('HTTP ' + status);
  if (!metrics.title) failures.push('missing title');
  if (metrics.path !== route) failures.push('unexpected path ' + metrics.path);
  if (metrics.overflow > 2) failures.push('horizontal overflow ' + metrics.overflow + 'px');
  if (metrics.bodyHeight < 200 || metrics.mainHeight < 120) failures.push('empty or collapsed main content');
  if (!metrics.header) failures.push('missing visible header');
  if (!metrics.footer) failures.push('missing visible footer');
  if (viewport.key === 'mobile' && !metrics.mobileStylesheet) failures.push('missing mobile stylesheet');
  if (!metrics.menuTogglePass) failures.push('mobile menu does not open and close');
  if (metrics.brokenImages.length) failures.push('broken visible images: ' + metrics.brokenImages.length);
  if (metrics.invalidAnchors.length) failures.push('invalid visible anchors: ' + metrics.invalidAnchors.length);
  if (metrics.samePageMissingHashes.length) failures.push('missing same-page anchors: ' + metrics.samePageMissingHashes.length);
  if (metrics.unnamedControls.length) failures.push('unnamed controls: ' + metrics.unnamedControls.length);
  if (metrics.clippedControls.length) failures.push('clipped controls: ' + metrics.clippedControls.length);
  if (metrics.smallTapTargets.length) failures.push('small tap targets: ' + metrics.smallTapTargets.length);
  if (metrics.formPage && !metrics.visibleForm) failures.push('form route missing visible form');
  if (route === '/' && viewport.key === 'mobile' && (!metrics.homeClosingCta.visible || metrics.homeClosingCta.linkCount !== 4 || !metrics.homeClosingCta.beforeFooter)) {
    failures.push('Home closing CTA section missing or incomplete');
  }
  if (route === '/academy' && viewport.key === 'mobile') {
    if (!metrics.academy.shell) failures.push('Academy mobile shell missing');
    if (metrics.academy.cardCount !== 4) failures.push('Academy course card count ' + metrics.academy.cardCount);
    if (new Set(metrics.academy.cardHeights).size !== 1) failures.push('Academy course cards have unequal heights');
    if (metrics.academy.featureCount !== 6) failures.push('Academy feature count ' + metrics.academy.featureCount);
    if (metrics.academy.guidanceCtas !== 2) failures.push('Academy guidance CTA count ' + metrics.academy.guidanceCtas);
  }
  if (route === '/academy' && viewport.key === 'desktop' && metrics.academy.shell) failures.push('Academy mobile shell leaked into desktop');
  if (route === '/affiliate-apply' && (!metrics.affiliateApply.academyHeader || !metrics.affiliateApply.form)) failures.push('Affiliate Apply Academy header or form missing');

  return {
    route,
    viewport: viewport.key,
    width: viewport.width,
    status,
    failures,
    pageErrors,
    actionablePageErrors: ownedPageErrors,
    consoleErrors: consoleErrors.filter((message) => !/favicon|ERR_BLOCKED_BY_CLIENT/i.test(message)),
    metrics,
    screenshot: path.relative(ROOT, screenshotPath).replace(/\\/g, '/'),
  };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const viewport of viewports) fs.mkdirSync(path.join(OUT, viewport.key), { recursive: true });
  const browser = await puppeteer.launch({ headless: true, protocolTimeout: 120000, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const results = [];
  const internalTargets = new Set();
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
      for (const route of routes) {
        const result = await auditPage(page, route, viewport);
        results.push(result);
        for (const link of result.metrics.links) {
          if (/^(mailto:|tel:|https?:\/\/|#)/i.test(link.href)) continue;
          const target = cleanPath(link.href.split(/[?#]/)[0]);
          if (target.startsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(target)) internalTargets.add(target);
        }
        const state = result.failures.length || result.actionablePageErrors.length ? 'FAIL' : 'PASS';
        console.log(state, viewport.key, route, result.failures.join('; '));
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  const linkFailures = [];
  for (const target of internalTargets) {
    if (!internalRoutes.has(target)) {
      try {
        const response = await fetch(BASE + target, { redirect: 'manual' });
        if (response.status >= 400) linkFailures.push({ target, status: response.status });
      } catch (error) {
        linkFailures.push({ target, status: 0, error: error.message });
      }
    }
  }

  const failed = results.filter((result) => result.failures.length || result.actionablePageErrors.length);
  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    routes: routes.length,
    viewportChecks: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    linkFailures,
    results,
  };
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Responsive audit: ${report.passed}/${report.viewportChecks} checks passed; internal link failures=${linkFailures.length}`);
  process.exit(failed.length || linkFailures.length ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
