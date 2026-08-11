import puppeteer from 'puppeteer';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const routes = [
  '/music-production',
  '/the-heart-of-composition',
  '/roots-of-hindustani-classical',
  '/academy',
  '/academy#testimonials',
  '/resources',
  '/book-a-call',
];

let failed = 0;
for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  const got = await page.evaluate(() => {
    const header =
      document.querySelector('[data-tsc-locked-desktop-header="true"]') ||
      document.querySelector('.tsc-desktop-site-header');
    if (!header) return { error: 'no header' };

    function info(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        href: el.getAttribute('href'),
        className: el.className && String(el.className).slice(0, 120),
        isActive: el.classList.contains('is-active'),
        ariaCurrent: el.getAttribute('aria-current'),
        bg: cs.backgroundColor,
      };
    }

    const actives = [...header.querySelectorAll('a.is-active, summary.is-active, [aria-current="page"], [role="menuitem"].is-active')].map(info);
    const topLabels = [...header.querySelectorAll('[data-part="label"], summary, .tsc-desktop-site-nav > a')].map((n) => ({
      text: (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40),
      aria: n.getAttribute('aria-current'),
      active: n.classList.contains('is-active'),
      parentActive: !!(n.closest && n.closest('.is-active')),
      bg: getComputedStyle(n).backgroundColor,
      parentBg: n.parentElement ? getComputedStyle(n.parentElement).backgroundColor : '',
    }));

    const submenuActive = [...header.querySelectorAll('.wixui-dropdown-menu a, .tsc-academy-courses-dropdown a')]
      .filter((a) => a.classList.contains('is-active') || a.getAttribute('aria-current') === 'page')
      .map((a) => (a.textContent || '').replace(/\s+/g, ' ').trim());

    return {
      path: location.pathname + location.hash,
      actives,
      topLabels,
      submenuActive,
    };
  });

  console.log('\n===', route, '===');
  console.log(JSON.stringify(got, null, 2));
}

await browser.close();
process.exit(0);
