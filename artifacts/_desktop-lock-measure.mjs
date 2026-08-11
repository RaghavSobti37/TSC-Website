/**
 * Desktop lock verify — measures primary pages at 1440 without full-page screenshots.
 * node artifacts/_desktop-lock-measure.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

const out = 'artifacts/desktop-lock-audit';
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 180000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const routes = ['/', '/about', '/films', '/work', '/artists', '/academy', '/resources', '/artist-path', '/learn-with-tsc'];
const report = [];

for (const route of routes) {
  process.stdout.write(`measure ${route} ... `);
  await page.goto('http://127.0.0.1:3000' + route, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 2000));

  const info = await page.evaluate(() => {
    const locked = document.querySelector('[data-tsc-locked-desktop-header="true"]');
    const custom = document.querySelector('.tsc-desktop-site-header');
    const mobile = document.querySelector('.tsc-mobile-site-header');
    const logo = document.querySelector(
      '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img, [data-tsc-locked-desktop-header] a.tsc-desktop-brand-link img, [data-tsc-locked-desktop-header] img.tsc-desktop-brand-logo, [data-tsc-locked-desktop-header] img[src*="tsc-logo"]'
    );
    const hero = document.querySelector('#comp-mp2vlkbh2');
    const mobileVisible = mobile
      ? (() => {
          const s = getComputedStyle(mobile);
          const r = mobile.getBoundingClientRect();
          return s.display !== 'none' && r.height > 10;
        })()
      : false;

    const navVisible = [...document.querySelectorAll('[data-tsc-locked-desktop-header] a, .tsc-desktop-site-nav a')]
      .filter((a) => {
        const t = (a.textContent || '').trim();
        const r = a.getBoundingClientRect();
        return r.width > 20 && r.height > 10 && /About|Work|Films|Artists|Resources|Academy/i.test(t);
      })
      .map((a) => (a.textContent || '').trim().slice(0, 24));

    return {
      dataPage: document.body.dataset.page,
      w: innerWidth,
      desktopMq: matchMedia('(min-width: 1025px)').matches,
      overflowX: document.body.scrollWidth > document.documentElement.clientWidth + 2,
      hasLockedHeader: !!locked,
      hasCustomHeader: !!custom,
      mobileHeaderVisible: mobileVisible,
      navVisible,
      logo: logo
        ? {
            w: Math.round(logo.getBoundingClientRect().width),
            h: Math.round(logo.getBoundingClientRect().height),
            mix: getComputedStyle(logo).mixBlendMode,
            filter: getComputedStyle(logo).filter.slice(0, 80),
          }
        : null,
      hero: hero
        ? {
            h: Math.round(hero.getBoundingClientRect().height),
            flex: getComputedStyle(hero.querySelector('.comp-mp2vlkbh2-container') || hero).display,
            shell: (() => {
              const s = document.getElementById('comp-mr1ttkgk');
              if (!s) return null;
              const r = s.getBoundingClientRect();
              const img = s.querySelector('img.tsc-about-shankha');
              const svg = s.querySelector('svg');
              const paths = svg ? [...svg.querySelectorAll('g > path')] : [];
              const p0 = paths[0] ? getComputedStyle(paths[0]).fill : null;
              const p2 = paths[2] ? getComputedStyle(paths[2]).display : null;
              return {
                w: Math.round(r.width),
                h: Math.round(r.height),
                y: Math.round(r.y),
                fixed: s.dataset.tscShellFixed || null,
                img: img
                  ? { nw: img.naturalWidth, nh: img.naturalHeight, complete: img.complete }
                  : null,
                cropped: svg ? svg.dataset.tscShellCropped : null,
                viewBox: svg ? svg.getAttribute('viewBox') : null,
                path0Fill: p0,
                path3Display: p2,
                pathCount: paths.length,
              };
            })(),
          }
        : null,
      dupPartnershipsHidden: ['comp-mqmhowf1', 'comp-mqmhp1sq', 'comp-mqmhpx0p'].every((id) => {
        const el = document.getElementById(id);
        return !el || getComputedStyle(el).display === 'none';
      }),
    };
  });

  // Lightweight JPEG crop of top only
  const name = route === '/' ? 'home' : route.slice(1);
  try {
    await page.screenshot({
      path: `${out}/${name}-top.jpg`,
      type: 'jpeg',
      quality: 55,
      clip: { x: 0, y: 0, width: 1440, height: 720 },
      captureBeyondViewport: false,
    });
    info.shot = 'ok';
  } catch (e) {
    info.shot = e.message.slice(0, 80);
  }

  report.push({ route, ...info });
  console.log(JSON.stringify(info));
}

fs.writeFileSync(`${out}/measure.json`, JSON.stringify(report, null, 2));
await browser.close();

const creamPages = new Set(['/about', '/films', '/work', '/artists', '/artist-path']);
const fails = report.filter((r) => {
  if (!r.desktopMq || r.mobileHeaderVisible || r.overflowX) return true;
  if (r.logo && r.logo.w < 180) return true;
  if (['/', '/about', '/films', '/work', '/artists', '/artist-path'].includes(r.route) && r.navVisible.length < 4) return true;
  if (creamPages.has(r.route) && r.logo && (r.logo.mix !== 'normal' || !/invert\(36%\)|sepia/.test(r.logo.filter || ''))) return true;
  if (r.route === '/about' && (!r.hero || !r.hero.shell || r.hero.shell.h < 80)) return true;
  if (r.route === '/' && r.logo && r.logo.mix !== 'screen') return true;
  return false;
});
console.log('FAILS', fails.length ? fails.map((f) => ({ route: f.route, logo: f.logo, hero: f.hero })) : 'none');
process.exit(fails.length ? 1 : 0);
