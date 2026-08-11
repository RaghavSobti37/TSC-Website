import puppeteer from 'puppeteer';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const expect = {
  '/': { token: 'tsc-logo-trim-nav.png', nav: 'TSC ACADEMY' },
  '/work': { token: 'tsc-logo-trim-nav.png', nav: 'TSC ACADEMY' },
  '/artist-path': { token: 'tsc-logo-trim-nav.png', nav: 'TSC ACADEMY' },
  '/academy': { token: 'tsc-academy-logo-trim-nav.png', nav: 'MAIN WEBSITE' },
};

let failed = 0;
for (const [route, want] of Object.entries(expect)) {
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 2500));
  const got = await page.evaluate(() => {
    const headers = Array.from(
      document.querySelectorAll('header, .tsc-desktop-site-header, .tsc-mobile-site-header')
    ).filter((h) => {
      const s = getComputedStyle(h);
      const r = h.getBoundingClientRect();
      return s.display !== 'none' && r.height > 0 && r.width > 0;
    });
    const img = document.querySelector(
      '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-header .tsc-desktop-brand-logo-unified, header .tsc-desktop-brand-logo-unified'
    );
    const custom = document.querySelector('.tsc-desktop-site-header');
    const customVisible =
      !!custom &&
      getComputedStyle(custom).display !== 'none' &&
      custom.getBoundingClientRect().height > 0;
    return {
      headers: headers.length,
      customVisible,
      text: headers.map((h) => (h.innerText || '').replace(/\s+/g, ' ').trim()).join(' | '),
      logo: img
        ? {
            src: (img.getAttribute('src') || '').split('/').pop(),
            w: Math.round(img.getBoundingClientRect().width),
            h: Math.round(img.getBoundingClientRect().height),
          }
        : null,
    };
  });
  const okHeaders = got.headers === 1 && !got.customVisible;
  const okLogo =
    got.logo &&
    got.logo.src.includes(want.token) &&
    got.logo.w >= 220 &&
    got.logo.w <= 340 &&
    got.logo.h >= 60 &&
    got.logo.h <= 76;
  const okNav = (got.text || '').includes(want.nav);
  const pass = okHeaders && okLogo && okNav;
  if (!pass) failed += 1;
  console.log(
    (pass ? 'PASS' : 'FAIL'),
    route,
    'headers=' + got.headers,
    'custom=' + got.customVisible,
    'logo=' + JSON.stringify(got.logo),
    'navHas=' + want.nav,
    okNav
  );
}

await browser.close();
process.exit(failed ? 1 : 0);
