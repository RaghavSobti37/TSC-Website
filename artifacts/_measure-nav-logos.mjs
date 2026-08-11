import puppeteer from 'puppeteer';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

for (const route of ['/', '/work', '/academy', '/artist-path']) {
  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 2000));
  const logo = await page.evaluate(() => {
    const img = document.querySelector(
      '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-header .tsc-desktop-brand-logo-unified, header .tsc-desktop-brand-logo-unified'
    );
    const headers = Array.from(
      document.querySelectorAll('header, .tsc-desktop-site-header, .tsc-mobile-site-header')
    ).filter((h) => {
      const s = getComputedStyle(h);
      const r = h.getBoundingClientRect();
      return s.display !== 'none' && r.height > 0 && r.width > 0;
    });
    const navs = Array.from(document.querySelectorAll('[data-hook="menu-root"]')).filter((n) => {
      const s = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      return s.display !== 'none' && r.height > 0 && r.width > 0;
    });
    return {
      route: location.pathname,
      vw: innerWidth,
      headers: headers.length,
      navs: navs.length,
      headerMeta: headers.map((h) => ({
        id: h.id,
        cls: String(h.className || '').slice(0, 80),
        h: Math.round(h.getBoundingClientRect().height),
        locked: h.getAttribute('data-tsc-locked-desktop-header'),
        custom: h.classList.contains('tsc-desktop-site-header') || h.classList.contains('tsc-mobile-site-header'),
        text: (h.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70),
      })),
      logo: img
        ? {
            src: (img.getAttribute('src') || '').split('/').pop(),
            w: Math.round(img.getBoundingClientRect().width),
            h: Math.round(img.getBoundingClientRect().height),
            mix: getComputedStyle(img).mixBlendMode,
          }
        : null,
    };
  });
  console.log(JSON.stringify(logo, null, 2));
}

await browser.close();
