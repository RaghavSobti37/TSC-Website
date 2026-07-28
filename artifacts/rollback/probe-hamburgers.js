const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/about';
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: width >= 1025 ? 800 : 844 });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 9000));
  const info = await page.evaluate(() => {
    const mq = window.matchMedia('(max-width: 1024px)').matches;
    const tscHeader = !!document.querySelector('.tsc-mobile-site-header');
    const scripts = [...document.querySelectorAll('script[src]')]
      .map((s) => s.getAttribute('src'))
      .filter((s) => /tsc-components|animations|content-replacements|tsc-mobile|tsc-responsive/.test(s || ''));
    const links = [...document.querySelectorAll('link[href]')]
      .map((l) => l.getAttribute('href'))
      .filter((h) => /tsc-responsive|tsc-mobile|mobile\//.test(h || ''));

    const sel = [
      '.tsc-mobile-menu summary',
      '[data-hook="hamburger-overlay-root"]',
      '[data-hook="menu-root"]',
      '[data-hook="hamburger"]',
      '[aria-label*="menu" i]',
      '[aria-label*="Menu"]',
      '[aria-label*="Open navigation"]',
      'button[aria-label*="menu" i]',
      '[class*="hamburger" i]',
      '#SITE_HEADER button',
      'header button',
      '[data-testid="hamburger"]',
      '[data-testid*="menu"]'
    ].join(',');

    const burgers = [];
    document.querySelectorAll(sel).forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) !== 0) {
        burgers.push({
          tag: el.tagName,
          id: el.id,
          cls: String(el.className || '').slice(0, 100),
          hook: el.getAttribute('data-hook'),
          aria: el.getAttribute('aria-label'),
          testid: el.getAttribute('data-testid'),
          w: Math.round(r.width),
          h: Math.round(r.height),
          x: Math.round(r.left),
          y: Math.round(r.top),
          inTsc: !!el.closest('.tsc-mobile-site-header'),
          inHeader: !!el.closest('header, #SITE_HEADER')
        });
      }
    });

    // Any top-right clickable that looks like a burger icon (3 bars)
    const topRight = [];
    document.querySelectorAll('button, [role="button"], summary, a').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top > 120 || r.left < 200 || r.width < 20 || r.height < 20 || r.width > 80) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      topRight.push({
        tag: el.tagName,
        id: el.id,
        cls: String(el.className || '').slice(0, 80),
        aria: el.getAttribute('aria-label'),
        hook: el.getAttribute('data-hook'),
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
        inTsc: !!el.closest('.tsc-mobile-site-header')
      });
    });

    const pinned = [...document.querySelectorAll('[id$="-pinned-layer"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        display: cs.display,
        visibility: cs.visibility,
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.left),
        y: Math.round(r.top),
        hooks: [...el.querySelectorAll('[data-hook]')].map((n) => n.getAttribute('data-hook')).slice(0, 8)
      };
    });

    const headerEl = document.querySelector('#SITE_HEADER') || document.querySelector('header');
    let headerInfo = null;
    if (headerEl) {
      const r = headerEl.getBoundingClientRect();
      const cs = getComputedStyle(headerEl);
      headerInfo = {
        tag: headerEl.tagName,
        id: headerEl.id,
        display: cs.display,
        visibility: cs.visibility,
        w: Math.round(r.width),
        h: Math.round(r.height)
      };
    }

    return {
      mq,
      tscHeader,
      scripts,
      links,
      burgers,
      topRight,
      pinned,
      headerInfo,
      bodyPage: document.body && document.body.dataset.page,
      hasResponsiveCss: !!document.querySelector('link[href="/css/tsc-responsive.css"]'),
      hasMobileSystemCss: !!document.querySelector('link[href="/css/tsc-mobile-system.css"]')
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
