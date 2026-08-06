const puppeteer = require('puppeteer');

const routes = [
  '/academy',
  '/learn-with-tsc',
  '/the-heart-of-composition',
  '/roots-of-hindustani-classical',
  '/music-production',
  '/affiliate',
  '/book-a-call',
  '/artist-query',
  '/masterclass-review01',
  '/masterclass-review02',
  '/classicalreview'
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];
const expectedNavLinks = [
  'Resources|/resources',
  'Courses|/academy#courses',
  'Testimonials|/academy',
  'Know More|/academy',
  'Main Website|/'
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const results = [];

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:${process.env.PORT || 3001}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const chrome = await page.evaluate(() => {
        const visible = (selector) => {
          const node = document.querySelector(selector);
          if (!node) return null;
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return {
            display: style.display,
            visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0,
            variant: node.dataset.tscVariant || '',
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            background: style.backgroundColor
          };
        };
        const header = visible('.tsc-desktop-site-header') || visible('.tsc-mobile-site-header');
        const footer = visible('.tsc-desktop-footer') || visible('.tsc-mobile-footer');
        const nav = document.querySelector('.tsc-desktop-site-nav, .tsc-mobile-menu nav');
        const footerNav = document.querySelector('.tsc-desktop-footer-nav, .tsc-mobile-footer');
        const visibleHeaderCount = [...document.querySelectorAll('header, .tsc-mobile-site-header')]
          .filter((node) => {
            const style = getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
          }).length;
        return {
          page: document.body.dataset.page,
          header,
          footer,
          visibleHeaderCount,
          navLinks: nav ? [...nav.querySelectorAll('a')].map((a) => `${a.textContent.trim()}|${a.getAttribute('href')}`) : [],
          footerLabels: footerNav ? [...footerNav.querySelectorAll('h3, summary')].map((n) => n.textContent.trim()) : [],
          overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth)
        };
      });
      results.push({ viewport: viewport.name, route, ...chrome });
      console.log(viewport.name, route, JSON.stringify(chrome));
    }
  }

  await browser.close();
  const failed = results.filter((item) =>
    !item.header?.visible ||
    !item.footer?.visible ||
    item.header.variant !== 'academy' ||
    item.footer.variant !== 'academy' ||
    item.header.width !== viewports.find((viewport) => viewport.name === item.viewport).width ||
    item.footer.width !== viewports.find((viewport) => viewport.name === item.viewport).width ||
    item.visibleHeaderCount !== 1 ||
    JSON.stringify(item.navLinks) !== JSON.stringify(expectedNavLinks) ||
    item.overflow > 2
  );
  console.log(`academy chrome audit: ${results.length - failed.length}/${results.length} pass`);
  if (failed.length) {
    console.error(JSON.stringify(failed, null, 2));
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
