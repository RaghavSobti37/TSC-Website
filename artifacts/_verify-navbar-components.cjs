const puppeteer = require('puppeteer');

const port = process.env.PORT || 3000;
const base = `http://127.0.0.1:${port}`;

const routes = [
  { path: '/', brand: 'main', active: '' },
  { path: '/about', brand: 'main', active: 'about' },
  { path: '/work', brand: 'main', active: 'work' },
  { path: '/artists', brand: 'main', active: 'artists' },
  { path: '/artist-path', brand: 'main', active: 'artists' },
  { path: '/harshad-duhita', brand: 'main', active: 'artists' },
  { path: '/yugm', brand: 'main', active: 'artists' },
  { path: '/films', brand: 'main', active: 'films' },
  { path: '/mahavatar-narsimha-impact', brand: 'main', active: 'films' },
  { path: '/hanuman-ansh-impact', brand: 'main', active: 'films' },
  { path: '/mba', brand: 'main', active: 'work' },
  { path: '/havells-myousic', brand: 'main', active: 'work' },
  { path: '/academy', brand: 'academy', active: 'courses' },
  { path: '/music-production', brand: 'academy', active: 'courses' },
  { path: '/book-a-call', brand: 'academy', active: 'know-more' },
  { path: '/resources', brand: 'academy', active: 'resources' }
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

function expectedLogo(brand) {
  return brand === 'academy' ? 'tsc-academy-logo-trim-nav.png' : 'tsc-logo-trim-nav.png';
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const failures = [];

  for (const viewport of viewports) {
    await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
    for (const route of routes) {
      await page.goto(`${base}${route.path}?navverify=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await new Promise((resolve) => setTimeout(resolve, viewport.name === 'desktop' ? 2200 : 2600));
      if (viewport.name !== 'desktop') {
        await page.evaluate(() => {
          const menu = document.querySelector('.tsc-mobile-menu');
          if (menu) menu.setAttribute('open', '');
        });
      }

      const result = await page.evaluate(() => {
        const visible = (node) => {
          if (!node) return false;
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };
        const headers = [...document.querySelectorAll('header, .tsc-mobile-site-header')]
          .filter(visible)
          .map((node) => ({
            tag: node.tagName.toLowerCase(),
            className: node.className || '',
            locked: node.getAttribute('data-tsc-locked-desktop-header') === 'true',
            variant: node.dataset.tscVariant || node.querySelector('[data-tsc-brand-logo="academy"]') ? 'academy' : node.dataset.tscVariant || 'main',
            width: Math.round(node.getBoundingClientRect().width),
            height: Math.round(node.getBoundingClientRect().height)
          }));
        const logo = document.querySelector(
          '.tsc-mobile-site-header img.tsc-mobile-brand-logo-unified,' +
          '[data-tsc-locked-desktop-header="true"] img.tsc-desktop-brand-logo-unified,' +
          '.tsc-desktop-site-header img.tsc-desktop-brand-logo-unified'
        );
        const activeNodes = [...document.querySelectorAll(
          '.tsc-mobile-site-header .is-active, .tsc-mobile-site-header [aria-current="page"],' +
          '[data-tsc-locked-desktop-header="true"] .is-active, [data-tsc-locked-desktop-header="true"] [aria-current="page"],' +
          '.tsc-desktop-site-header .is-active, .tsc-desktop-site-header [aria-current="page"]'
        )];
        const activeText = [...new Set(activeNodes.map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean))];
        const navHrefSet = new Set(
          [...document.querySelectorAll(
            '.tsc-mobile-site-header nav a[href],' +
            '[data-tsc-locked-desktop-header="true"] a[href],' +
            '.tsc-desktop-site-header nav a[href]'
          )].map((node) => {
            try {
              return new URL(node.getAttribute('href'), location.origin).pathname;
            } catch (_) {
              return node.getAttribute('href') || '';
            }
          }).filter(Boolean)
        );
        return {
          bodyPage: document.body.dataset.page || '',
          headers,
          logoSrc: logo ? logo.getAttribute('src') || '' : '',
          activeText,
          navHrefs: [...navHrefSet].sort(),
          overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth)
        };
      });

      const expected = expectedLogo(route.brand);
      const routeFailures = [];
      if (result.headers.length !== 1) routeFailures.push(`visible headers=${result.headers.length}`);
      if (!result.logoSrc.includes(expected)) routeFailures.push(`logo=${result.logoSrc || 'missing'} expected=${expected}`);
      if (result.overflow > 2) routeFailures.push(`overflow=${result.overflow}`);
      if (route.active && result.activeText.length === 0) routeFailures.push('missing active nav');
      const expectedHrefs = route.brand === 'academy'
        ? ['/resources', '/music-production', '/the-heart-of-composition', '/roots-of-hindustani-classical', '/academy', '/']
        : ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'];
      for (const href of expectedHrefs) {
        if (!result.navHrefs.includes(href)) routeFailures.push(`missing nav href ${href}`);
      }
      if (routeFailures.length) failures.push({ viewport: viewport.name, route: route.path, routeFailures, result });
      console.log(`${viewport.name} ${route.path}`, JSON.stringify(result));
    }
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }
  console.log(`navbar verify: ${routes.length * viewports.length}/${routes.length * viewports.length} pass`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
