import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3033';
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
page.setDefaultTimeout(45000);
page.setDefaultNavigationTimeout(60000);

async function probeDesktop(route) {
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${route}?cb=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tsc-desktop-footer-copy', { timeout: 25000 });
  await page.evaluate(() => document.querySelector('.tsc-desktop-footer')?.scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 400));
  return page.evaluate(() => {
    const brand = document.querySelector('.tsc-desktop-footer-brandblock');
    const copy = document.querySelector('.tsc-desktop-footer-copy');
    const meta = document.querySelector('.tsc-desktop-footer-meta');
    const social = document.querySelector('.tsc-desktop-footer-social');
    const news = document.querySelector('.tsc-desktop-footer-news');
    const logo = document.querySelector('.tsc-desktop-footer-logo');
    const btn = document.querySelector('.tsc-desktop-footer-newsrow button');
    const input = document.querySelector('.tsc-desktop-footer-newsrow input');
    const groups = [...document.querySelectorAll('.tsc-desktop-footer-group h3')].map((h) => h.textContent.trim());
    const metaText = (meta && meta.textContent) || '';
    return {
      route: location.pathname,
      navGroups: groups,
      startHereInNav: groups.some((g) => /start here/i.test(g)),
      startHereUnderSocials: /start here/i.test(metaText),
      copyInBrand: !!(brand && copy && brand.contains(copy)),
      copyInMeta: !!(meta && copy && meta.contains(copy)),
      copyText: copy?.textContent.trim() || '',
      brandKids: brand ? [...brand.children].map((c) => c.className) : [],
      newsKids: news ? [...news.children].map((c) => c.className || c.tagName) : [],
      copyBelowSocial: !!(social && copy && copy.getBoundingClientRect().y >= social.getBoundingClientRect().bottom - 2),
      logoW: logo ? Math.round(logo.getBoundingClientRect().width) : 0,
      logoH: logo ? Math.round(logo.getBoundingClientRect().height) : 0,
      btnW: btn ? Math.round(btn.getBoundingClientRect().width) : 0,
      inputW: input ? Math.round(input.getBoundingClientRect().width) : 0,
      btnFont: btn ? getComputedStyle(btn).fontSize : null
    };
  });
}

async function probeMobile(route) {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${route}?cb=${Date.now()}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tsc-mobile-footer-bottom', { timeout: 25000 });
  await page.evaluate(() => document.querySelector('.tsc-mobile-footer')?.scrollIntoView({ block: 'end' }));
  await new Promise((r) => setTimeout(r, 400));
  return page.evaluate(() => {
    const brand = document.querySelector('.tsc-mobile-footer-brand');
    const social = document.querySelector('.tsc-mobile-footer-social');
    const bottom = document.querySelector('.tsc-mobile-footer-bottom');
    const span = bottom?.querySelector(':scope > span');
    const logo = document.querySelector('.tsc-mobile-footer-logo');
    const btn = document.querySelector('.tsc-mobile-footer-newsrow button');
    const input = document.querySelector('.tsc-mobile-footer-newsrow input');
    const accTitles = [...document.querySelectorAll('.tsc-mobile-footer-acc summary')].map((s) => s.textContent.trim());
    const bottomText = (bottom && bottom.textContent) || '';
    return {
      route: location.pathname,
      accordion: accTitles,
      startHereInAccordion: accTitles.some((t) => /start here/i.test(t)),
      startHereUnderSocials: /start here/i.test(bottomText),
      copyInBrand: !!(brand && span && brand.contains(span)),
      copyAfterSocial: !!(social && bottom && (social.compareDocumentPosition(bottom) & Node.DOCUMENT_POSITION_FOLLOWING)),
      copyText: span?.textContent.trim() || '',
      shellOrder: [...(document.querySelector('.tsc-mobile-footer')?.children || [])].map((c) => c.className),
      logoW: logo ? Math.round(logo.getBoundingClientRect().width) : 0,
      logoH: logo ? Math.round(logo.getBoundingClientRect().height) : 0,
      btnW: btn ? Math.round(btn.getBoundingClientRect().width) : 0,
      inputW: input ? Math.round(input.getBoundingClientRect().width) : 0,
      btnFont: btn ? getComputedStyle(btn).fontSize : null
    };
  });
}

const results = {
  desktopHome: await probeDesktop('/'),
  desktopAcademy: await probeDesktop('/academy'),
  mobileHome: await probeMobile('/'),
  mobileAcademy: await probeMobile('/academy')
};

fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(results, null, 2));

const checks = [];
for (const key of ['desktopHome', 'desktopAcademy']) {
  const d = results[key];
  checks.push([`${key}: © not in brand`, !d.copyInBrand]);
  checks.push([`${key}: © in meta`, d.copyInMeta]);
  checks.push([`${key}: © below socials`, d.copyBelowSocial]);
  checks.push([`${key}: Start Here in nav`, d.startHereInNav]);
  checks.push([`${key}: Start Here NOT under socials`, !d.startHereUnderSocials]);
  checks.push([`${key}: logo bigger (>=240)`, d.logoW >= 240]);
  checks.push([`${key}: email wider than subscribe`, d.inputW > d.btnW]);
  checks.push([`${key}: subscribe font small (<=13px)`, parseFloat(d.btnFont) <= 13]);
}
for (const key of ['mobileHome', 'mobileAcademy']) {
  const m = results[key];
  checks.push([`${key}: © not in brand`, !m.copyInBrand]);
  checks.push([`${key}: © after socials`, m.copyAfterSocial]);
  checks.push([`${key}: Start Here in accordion`, m.startHereInAccordion]);
  checks.push([`${key}: Start Here NOT under socials`, !m.startHereUnderSocials]);
  checks.push([`${key}: logo bigger (>=170)`, m.logoW >= 170]);
  checks.push([`${key}: email wider than subscribe`, m.inputW > m.btnW]);
}

let ok = true;
for (const [label, pass] of checks) {
  console.log(pass ? 'PASS' : 'FAIL', label);
  if (!pass) ok = false;
}
console.log(JSON.stringify(results, null, 2));
console.log(ok ? 'ALL PASS' : 'SOME FAIL');
await browser.close();
process.exit(ok ? 0 : 1);
