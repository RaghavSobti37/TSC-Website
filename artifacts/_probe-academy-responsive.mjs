/**
 * Fast Academy page-content probe (no nav-logo asserts).
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

const out = 'artifacts/academy-responsive';
fs.mkdirSync(out, { recursive: true });

const viewports = [
  { name: 'desktop', w: 1440, h: 900 },
  { name: 'tablet', w: 768, h: 1024 },
  { name: 'mobile', w: 390, h: 844 },
];

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
});

const report = [];

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/academy', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await new Promise((r) => setTimeout(r, 4000));

  const m = await page.evaluate(() => {
    const iw = window.innerWidth;
    const sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const hero = document.querySelector('.comp-mqwcognj-container');
    const cs = hero ? getComputedStyle(hero) : null;
    const ready = document.querySelector('.comp-mqwe6h8s-container');
    const features = document.querySelector('.comp-mqwg28rw-container');
    const offenders = [];
    document.querySelectorAll('main [id^="comp-"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > iw + 12 && r.height > 40 && r.top < 2500) {
        offenders.push(el.id + ':' + Math.round(r.width));
      }
    });
    return {
      iw,
      sw,
      overflowX: sw > iw + 2,
      desktopMq: matchMedia('(min-width: 1025px)').matches,
      cssAcademy: Array.from(document.querySelectorAll('link[href*="academy.css"]')).map((l) => ({
        href: l.getAttribute('href'),
        media: l.media || '',
      })),
      heroFlex: cs && cs.flexDirection,
      heroDisplay: cs && cs.display,
      heroH: hero ? Math.round(hero.getBoundingClientRect().height) : null,
      readyFlex: ready ? getComputedStyle(ready).flexDirection : null,
      featuresFlex: features ? getComputedStyle(features).flexDirection : null,
      mobileHeader: !!document.querySelector('.tsc-mobile-site-header'),
      lockedHeader: !!document.querySelector('[data-tsc-locked-desktop-header]'),
      offenders,
      title: (document.querySelector('#comp-mqwcozxs')?.innerText || '').slice(0, 40),
    };
  });

  await page.screenshot({
    path: `${out}/${vp.name}-top.jpg`,
    type: 'jpeg',
    quality: 55,
  });
  await page.evaluate(() => window.scrollTo(0, 1800));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: `${out}/${vp.name}-mid.jpg`,
    type: 'jpeg',
    quality: 55,
  });

  report.push({ vp: vp.name, ...m });
  console.log(
    JSON.stringify({
      vp: vp.name,
      overflowX: m.overflowX,
      heroFlex: m.heroFlex,
      heroH: m.heroH,
      readyFlex: m.readyFlex,
      featuresFlex: m.featuresFlex,
      mobileHeader: m.mobileHeader,
      lockedHeader: m.lockedHeader,
      offenders: m.offenders.slice(0, 8),
      desktopMq: m.desktopMq,
      css: m.cssAcademy,
    })
  );
  await page.close();
}

fs.writeFileSync(`${out}/probe.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log('DONE');
