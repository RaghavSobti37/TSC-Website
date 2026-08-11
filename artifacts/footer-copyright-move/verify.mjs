import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
page.setDefaultTimeout(25000);

function box(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
}

await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:3000/?cb=${Date.now()}`, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
await page.waitForSelector('.tsc-desktop-footer-social');
await page.evaluate(() => {
  document.querySelector('.tsc-desktop-footer')?.scrollIntoView({ block: 'start' });
});
await new Promise((r) => setTimeout(r, 700));

const desktop = await page.evaluate(() => {
  const br = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const copy = document.querySelector('.tsc-desktop-footer-copy');
  const social = document.querySelector('.tsc-desktop-footer-social');
  const brand = document.querySelector('.tsc-desktop-footer-brandblock');
  const meta = document.querySelector('.tsc-desktop-footer-meta');
  return {
    copyInBrand: !!(brand && copy && brand.contains(copy)),
    copyInMeta: !!(meta && copy && meta.contains(copy)),
    brandChildren: brand ? [...brand.children].map((c) => c.className) : [],
    newsOrder: [...(document.querySelector('.tsc-desktop-footer-news')?.children || [])].map((c) => c.className || c.tagName),
    copyBox: br(copy),
    socialBox: br(social),
    brandBox: br(brand),
    copyBelowSocial: !!(social && copy && copy.getBoundingClientRect().y >= social.getBoundingClientRect().bottom - 1),
    sameColumnAsSocial: !!(social && copy && Math.abs(copy.getBoundingClientRect().x - social.getBoundingClientRect().x) < 4),
    copyText: copy && copy.textContent.trim()
  };
});

fs.writeFileSync(path.join(outDir, 'desktop-metrics.json'), JSON.stringify(desktop, null, 2));
const foot = await page.$('.tsc-desktop-footer');
if (foot) await foot.screenshot({ path: path.join(outDir, 'footer-full.png') });
const brandEl = await page.$('.tsc-desktop-footer-brandblock');
if (brandEl) await brandEl.screenshot({ path: path.join(outDir, 'footer-brandblock.png') });
const newsEl = await page.$('.tsc-desktop-footer-news');
if (newsEl) await newsEl.screenshot({ path: path.join(outDir, 'footer-news-col.png') });
console.log('DESKTOP', JSON.stringify(desktop, null, 2));

await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:3000/?cb=${Date.now()}`, {
  waitUntil: 'domcontentloaded',
  timeout: 60000
});
await page.waitForSelector('.tsc-mobile-footer-social');
await page.evaluate(() => {
  document.querySelector('.tsc-mobile-footer')?.scrollIntoView({ block: 'end' });
});
await new Promise((r) => setTimeout(r, 700));

const mobile = await page.evaluate(() => {
  const br = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const social = document.querySelector('.tsc-mobile-footer-social');
  const bottom = document.querySelector('.tsc-mobile-footer-bottom');
  const span = bottom && bottom.querySelector(':scope > span');
  const brand = document.querySelector('.tsc-mobile-footer-brand');
  return {
    copyInBrand: !!(brand && span && brand.contains(span)),
    copyAfterSocial: !!(social && bottom && (social.compareDocumentPosition(bottom) & Node.DOCUMENT_POSITION_FOLLOWING)),
    socialBox: br(social),
    copyBox: br(span),
    copyText: span && span.textContent.trim(),
    shellOrder: [...(document.querySelector('.tsc-mobile-footer')?.children || [])].map((c) => c.className)
  };
});

fs.writeFileSync(path.join(outDir, 'mobile-metrics.json'), JSON.stringify(mobile, null, 2));
const mf = await page.$('.tsc-mobile-footer');
if (mf) await mf.screenshot({ path: path.join(outDir, 'footer-mobile.png') });
console.log('MOBILE', JSON.stringify(mobile, null, 2));

const ok =
  desktop.copyInMeta &&
  !desktop.copyInBrand &&
  desktop.copyBelowSocial &&
  desktop.sameColumnAsSocial &&
  mobile.copyAfterSocial &&
  !mobile.copyInBrand;

console.log(ok ? 'PASS' : 'FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
