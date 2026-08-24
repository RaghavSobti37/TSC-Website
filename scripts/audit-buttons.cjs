const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'pages', 'routes.manifest.json'), 'utf8'));
const origin = process.argv.find((arg) => /^https?:\/\//.test(arg)) || 'http://127.0.0.1:3100';
const routes = process.argv.includes('--primary')
  ? manifest.primaryPages.map((page) => page.route)
  : manifest.allRoutes;
const knownRoutes = new Set([...(manifest.allRoutes || []), ...(manifest.aliases || []).map((item) => item.alias)]);
const reportPath = path.join(root, 'artifacts', 'button-audit-report.json');

function normalizePathname(pathname) {
  if (!pathname || pathname === '/home') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

function isVisibleHandleData(item) {
  return item.width > 2 && item.height > 2 && item.visible && item.opacity !== '0';
}

async function waitForReady(page) {
  await page.waitForFunction(() => {
    const text = document.body && document.body.innerText && document.body.innerText.trim();
    const wixReady = performance.getEntriesByType('mark').some((entry) => entry.name === 'client_render finished');
    return Boolean(text) || wixReady;
  }, { timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

async function collectInteractives(page) {
  return page.evaluate(() => {
    function labelFor(el) {
      return (
        el.getAttribute('aria-label') ||
        el.getAttribute('title') ||
        el.innerText ||
        el.textContent ||
        ''
      ).replace(/\s+/g, ' ').trim();
    }
    return Array.from(document.querySelectorAll('a[href], button, [role="button"], [role="link"], input[type="submit"], input[type="button"]'))
      .map((el) => {
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        return {
          tag: el.tagName,
          id: el.id || '',
          role: el.getAttribute('role') || '',
          label: labelFor(el).slice(0, 120),
          href: el.getAttribute('href') || '',
          type: el.getAttribute('type') || '',
          disabled: el.disabled || el.getAttribute('aria-disabled') === 'true',
          visible: style.display !== 'none' && style.visibility !== 'hidden',
          opacity: style.opacity,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          inForm: Boolean(el.closest('form')),
          workReportHref: el.getAttribute('data-tsc-work-report-link') || '',
          filmReportHref: el.getAttribute('data-tsc-film-report-link') || '',
          findCourseWired: el.getAttribute('data-tsc-find-course-wired') || '',
          partnerWired: el.getAttribute('data-tsc-partner-with-us-wired') || '',
        };
      })
      .filter((item) => item.width > 2 && item.height > 2 && item.visible && item.opacity !== '0')
      .filter((item, index, items) => {
        const key = `${item.label}|${item.href}|${item.id}|${item.tag}|${item.x}|${item.y}`;
        return items.findIndex((other) => `${other.label}|${other.href}|${other.id}|${other.tag}|${other.x}|${other.y}` === key) === index;
      });
  });
}

function classify(route, item) {
  if (item.disabled) return { status: 'ignored', reason: 'disabled' };
  if (item.tag === 'BUTTON' || item.type === 'submit' || item.inForm) return { status: 'ok', reason: 'form/control' };
  const jsHref = item.workReportHref || item.filmReportHref;
  if (jsHref && knownRoutes.has(normalizePathname(jsHref))) return { status: 'ok', reason: 'js-wired-route' };
  if (item.findCourseWired === '1') return { status: 'ok', reason: 'js-wired-artist-query' };
  if (item.partnerWired === '1') return { status: 'ok', reason: 'js-wired-mailto' };
  if (!item.href) {
    if (/menu|close|open|faq|accordion|courses|artists/i.test(item.label) || item.role === 'button') {
      return { status: 'manual', reason: 'button-without-href' };
    }
    return { status: 'fail', reason: 'interactive-without-href' };
  }
  if (/^(mailto:|tel:|sms:|whatsapp:)/i.test(item.href)) return { status: 'ok', reason: 'protocol' };
  if (/^#/.test(item.href)) return { status: 'ok', reason: 'page-anchor' };
  let url;
  try {
    url = new URL(item.href, origin + route);
  } catch (error) {
    return { status: 'fail', reason: `bad-url:${error.message}` };
  }
  if (url.origin !== origin) return { status: 'ok', reason: 'external' };
  const pathname = normalizePathname(url.pathname);
  if (knownRoutes.has(pathname)) return { status: 'ok', reason: 'known-route' };
  if (pathname.startsWith('/assets/')) {
    const assetPath = path.join(root, 'public', pathname.replace(/^\/+/, ''));
    return fs.existsSync(assetPath)
      ? { status: 'ok', reason: 'local-asset' }
      : { status: 'fail', reason: `missing-local-asset:${pathname}` };
  }
  if (url.hash && pathname === normalizePathname(route)) return { status: 'ok', reason: 'same-page-hash' };
  return { status: 'fail', reason: `unknown-internal-route:${pathname}` };
}

async function clickByText(page, label, expectedPath, occurrence = 0, href) {
  const matches = await page.$$('a, button, [role="button"], [role="link"], [data-testid="linkElement"]');
  let seen = 0;
  for (const handle of matches) {
    const data = await handle.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const label = (el.getAttribute('aria-label') || el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      return {
        label,
        href: el.getAttribute('href') || '',
        visible: rect.width > 2 && rect.height > 2 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) !== 0,
      };
    });
    if (!data.visible || !new RegExp(label, 'i').test(data.label)) continue;
    if (href && data.href !== href) continue;
    if (seen++ !== occurrence) continue;
    await handle.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
    await new Promise((resolve) => setTimeout(resolve, 180));
    await handle.click();
    await page.waitForFunction((path) => location.pathname.replace(/\/+$/, '') === path, { timeout: 15000 }, expectedPath);
    return true;
  }
  throw new Error(`Missing clickable "${label}" occurrence ${occurrence}`);
}

async function clickSelector(page, selector, expectedPath) {
  await page.waitForSelector(selector, { timeout: 15000 });
  if (selector === '#comp-mr0g77kb') {
    await page.waitForFunction(() => {
      const el = document.querySelector('#comp-mr0g77kb');
      return el && el.dataset && el.dataset.tscFindCourseWired === '1';
    }, { timeout: 15000 });
  }
  const handle = await page.$(selector);
  if (!handle) throw new Error(`Missing selector "${selector}"`);
  await handle.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center' }));
  await new Promise((resolve) => setTimeout(resolve, 180));
  await handle.click();
  await page.waitForFunction((path) => location.pathname.replace(/\/+$/, '') === path, { timeout: 15000 }, expectedPath);
}

async function runTargetedClicks(browser) {
  const checks = [
    { viewport: { width: 390, height: 900, isMobile: true }, label: '^Know More$', occurrence: 0, href: '/the-heart-of-composition', expected: '/the-heart-of-composition' },
    { viewport: { width: 390, height: 900, isMobile: true }, label: '^Know More$', occurrence: 0, href: '/roots-of-hindustani-classical', expected: '/roots-of-hindustani-classical' },
    { viewport: { width: 390, height: 900, isMobile: true }, label: 'Find Your Course', occurrence: 0, expected: '/artist-query' },
    { viewport: { width: 1440, height: 1000 }, selector: '#comp-mr0g77kb', label: 'Find Your Course', occurrence: 0, expected: '/artist-query' },
  ];
  const results = [];
  for (const check of checks) {
    const page = await browser.newPage();
    await page.setViewport({ deviceScaleFactor: 1, ...check.viewport });
    await page.goto(`${origin}/academy`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await waitForReady(page);
    try {
      if (check.selector) await clickSelector(page, check.selector, check.expected);
      else await clickByText(page, check.label, check.expected, check.occurrence, check.href);
      results.push({ ...check, passed: true });
    } catch (error) {
      results.push({ ...check, passed: false, error: error.message, at: page.url() });
    }
    await page.close();
  }
  return results;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const pages = [];
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 900, isMobile: true, deviceScaleFactor: 1 });
      await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForReady(page);
      const items = await collectInteractives(page);
      const findings = items.map((item) => ({ ...item, ...classify(route, item) }));
      pages.push({ route, count: items.length, findings });
      await page.close();
      const failed = findings.filter((item) => item.status === 'fail').length;
      const manual = findings.filter((item) => item.status === 'manual').length;
      console.log(`${route}\tbuttons=${items.length}\tfail=${failed}\tmanual=${manual}`);
    }
    const targeted = await runTargetedClicks(browser);
    targeted.forEach((item) => console.log(`target\t${item.label} -> ${item.expected}\t${item.passed ? 'PASS' : 'FAIL'}`));
    const report = { generatedAt: new Date().toISOString(), origin, targeted, pages };
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    const failures = pages.flatMap((page) => page.findings.filter((item) => item.status === 'fail').map((item) => ({ route: page.route, item })));
    const failedTargets = targeted.filter((item) => !item.passed);
    if (failures.length || failedTargets.length) process.exitCode = 1;
    console.log(`Report: ${reportPath}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
