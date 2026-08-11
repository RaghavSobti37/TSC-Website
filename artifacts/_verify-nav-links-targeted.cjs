const puppeteer = require('puppeteer');

const base = process.env.TSC_BASE || `http://127.0.0.1:${process.env.PORT || 3100}`;
const routes = [
  { path: '/about', active: 'About', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/films', active: 'Films', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/harshad-duhita', active: 'Artists', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/yugm', active: 'Artists', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/mahavatar-narsimha-impact', active: 'Films', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/hanuman-ansh-impact', active: 'Films', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/mba', active: 'Work', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/havells-myousic', active: 'Work', hrefs: ['/about', '/work', '/artists', '/artist-path', '/academy', '/films', '/resources'] },
  { path: '/academy', active: 'Courses', hrefs: ['/', '/resources', '/music-production', '/the-heart-of-composition', '/roots-of-hindustani-classical', '/academy'] },
  { path: '/music-production', active: 'Courses', hrefs: ['/', '/resources', '/music-production', '/the-heart-of-composition', '/roots-of-hindustani-classical', '/academy'] },
];

function uniq(values) {
  return [...new Set(values)];
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  const failures = [];
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1440, height: 900 });

  for (const route of routes) {
    await page.goto(`${base}${route.path}?navtarget=${Date.now()}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await new Promise((resolve) => setTimeout(resolve, 3200));
    const result = await page.evaluate(() => {
      const visible = (node) => {
        if (!node) return false;
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      };
      const navRoot = [...document.querySelectorAll(
        '.tsc-desktop-site-header, [data-tsc-locked-desktop-header="true"], .tsc-mobile-site-header'
      )].find(visible);
      const hrefs = navRoot ? [...new Set([...navRoot.querySelectorAll('a[href]')].map((link) => {
        try {
          return new URL(link.getAttribute('href'), location.origin).pathname;
        } catch (_) {
          return link.getAttribute('href') || '';
        }
      }))] : [];
      const activeText = navRoot ? [...new Set([...navRoot.querySelectorAll('.is-active, [aria-current="page"]')]
        .map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean))] : [];
      return {
        hasSharedApi: Boolean(window.TSCComponents),
        navClass: navRoot ? navRoot.className || navRoot.id || navRoot.tagName : '',
        navHrefs: hrefs,
        activeText,
        duplicateFilmScript: Boolean(document.querySelector('script[src^="/js/tsc-films-page.js"]')),
        overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      };
    });
    const routeFailures = [];
    if (!result.hasSharedApi) routeFailures.push('missing TSCComponents');
    if (!result.navClass) routeFailures.push('missing shared/locked nav root');
    if (result.duplicateFilmScript) routeFailures.push('duplicate films script present');
    if (result.overflow > 2) routeFailures.push(`overflow ${result.overflow}`);
    if (!result.activeText.some((text) => text.includes(route.active))) routeFailures.push(`missing active ${route.active}`);
    for (const href of route.hrefs) {
      if (!result.navHrefs.includes(href)) routeFailures.push(`missing href ${href}`);
    }
    console.log(route.path, JSON.stringify(result));
    if (routeFailures.length) failures.push({ route: route.path, routeFailures, result });
  }

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }
  console.log(`targeted nav verify: ${routes.length}/${routes.length} pass`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
