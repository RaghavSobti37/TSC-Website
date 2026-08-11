import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3033';
const outDir = path.join('artifacts', 'footer-nav-align');
fs.mkdirSync(outDir, { recursive: true });

async function measure(page) {
  return page.evaluate(() => {
    const footer = document.querySelector('.tsc-desktop-footer, .tsc-mobile-footer');
    const logo = document.querySelector('.tsc-desktop-footer-logo, .tsc-mobile-footer-logo');
    const tag = document.querySelector('.tsc-desktop-footer-tagline, .tsc-mobile-footer-tagline');
    const copy = document.querySelector('.tsc-desktop-footer-brandblock .tsc-desktop-footer-copy, .tsc-mobile-footer-bottom > span');
    const form = document.querySelector('.tsc-desktop-footer-newsrow, .tsc-mobile-footer-newsrow');
    const input = form && form.querySelector('input');
    const btn = form && form.querySelector('button');
    const news = document.querySelector('.tsc-desktop-footer-news');
    const navLogo = document.querySelector('.tsc-desktop-brand-logo-unified, .tsc-mobile-brand-logo-unified');
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        x: Math.round(r.x * 10) / 10,
        y: Math.round(r.y * 10) / 10,
        w: Math.round(r.width * 10) / 10,
        h: Math.round(r.height * 10) / 10,
        mw: s.minWidth,
        flex: s.flex,
        pad: s.padding,
        src: el.currentSrc || el.getAttribute('src') || null
      };
    };
    return {
      hasFooter: !!footer,
      footerClass: footer ? footer.className : null,
      logo: box(logo),
      tag: box(tag),
      copy: box(copy),
      input: box(input),
      btn: box(btn),
      newsBorder: news ? getComputedStyle(news).borderLeft : null,
      navLogo: box(navLogo),
      logoTagDx: logo && tag ? Math.round((tag.getBoundingClientRect().x - logo.getBoundingClientRect().x) * 10) / 10 : null,
      logoCopyDx: logo && copy ? Math.round((copy.getBoundingClientRect().x - logo.getBoundingClientRect().x) * 10) / 10 : null,
      inputBtnRatio: input && btn && btn.getBoundingClientRect().width
        ? Math.round((input.getBoundingClientRect().width / btn.getBoundingClientRect().width) * 100) / 100
        : null
    };
  });
}

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const results = {};
for (const width of [1440, 390]) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: width === 390 ? 844 : 1000 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  await page.evaluate(() => {
    const f = document.querySelector('.tsc-desktop-footer, .tsc-mobile-footer, footer');
    if (f) f.scrollIntoView({ block: 'end' });
  });
  await new Promise((r) => setTimeout(r, 500));
  const info = await measure(page);
  results[width] = info;
  await page.screenshot({ path: path.join(outDir, `home-${width}.jpg`), type: 'jpeg', quality: 70, fullPage: false });
  console.log(width, JSON.stringify(info, null, 2));
  await page.close();
}
fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(results, null, 2));
await browser.close();
const desk = results[1440];
const okAlign = desk && desk.logoTagDx != null && Math.abs(desk.logoTagDx) <= 2
  && desk.logoCopyDx != null && Math.abs(desk.logoCopyDx) <= 2;
const okForm = desk && desk.inputBtnRatio != null && desk.inputBtnRatio >= 1.6;
const okBtnNarrow = desk && desk.btn && desk.btn.w <= 120;
console.log('\nCHECKS', { okAlign, okForm, okBtnNarrow, logoTagDx: desk && desk.logoTagDx, logoCopyDx: desk && desk.logoCopyDx, ratio: desk && desk.inputBtnRatio, btnW: desk && desk.btn && desk.btn.w });
if (!okAlign || !okForm || !okBtnNarrow) process.exit(2);
