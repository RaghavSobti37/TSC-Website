/**
 * Desktop /academy first-paint vs after-JS stability probe.
 * Usage: node artifacts/_academy-desktop-lock-probe.mjs
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(fileURLToPath(import.meta.url));
const playwrightRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../.cursor/healing-loop/node_modules/playwright'
);
const { chromium } = require(playwrightRoot);

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3000';

function snapshot() {
  const main = document.querySelector('main');
  const logo =
    document.querySelector('.tsc-desktop-site-header-academy .tsc-desktop-brand-logo-unified') ||
    document.querySelector('.tsc-desktop-site-header-academy img');
  const img =
    document.querySelector('#img-comp-mpjxxere2 img') ||
    document.querySelector('#img-comp-mpjo65q32 img');
  const mentor = document.querySelector('#comp-mpl387ie');
  return {
    bg: getComputedStyle(document.body).backgroundColor,
    mainH: main ? Math.round(main.getBoundingClientRect().height) : 0,
    affiliate: !!document.querySelector('.tsc-affiliate-cta'),
    lucaInject: !!document.querySelector('.tsc-luca-course-card'),
    fab: !!document.querySelector('.tsc-phone-fab, [data-tsc-sticky-cta]'),
    badges1: (document.querySelector('#comp-mpjwvo70')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    course1Title: (document.querySelector('#comp-mpjo65qb')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    course3Title: (document.querySelector('#comp-mpjxxerm')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    imgSrc: img ? (img.currentSrc || img.src || '').split('/').pop() : null,
    mentorDisplay: mentor ? getComputedStyle(mentor).display : 'missing',
    mobileCss: !!document.querySelector('link[href*="/css/mobile/academy"]'),
    headerH: document.querySelector('.tsc-desktop-site-header')?.getBoundingClientRect().height ?? null,
    logoW: logo ? Math.round(logo.getBoundingClientRect().width) : null,
    logoH: logo ? Math.round(logo.getBoundingClientRect().height) : null,
    repairedBadgeHtml: !!(document.querySelector('#comp-mpjwvo70 ul.font_2')),
  };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/academy`, { waitUntil: 'domcontentloaded', timeout: 60000 });
const early = await page.evaluate(snapshot);
await page.waitForTimeout(4000);
const late = await page.evaluate(snapshot);
const chrome = await page.evaluate(() => {
  const header = document.querySelector('.tsc-desktop-site-header, [data-tsc-locked-desktop-header]');
  const logo = document.querySelector('.tsc-desktop-brand-logo-unified, .tsc-desktop-site-header img');
  const footer = document.querySelector('.tsc-desktop-footer');
  return {
    headerClass: header?.className || null,
    headerDisplay: header ? getComputedStyle(header).display : null,
    logoBox: logo
      ? {
          w: Math.round(logo.getBoundingClientRect().width),
          h: Math.round(logo.getBoundingClientRect().height),
          src: (logo.getAttribute('src') || '').split('/').pop(),
        }
      : null,
    footerOk: !!footer,
    mobileCssLinks: [...document.querySelectorAll('link[href*="/css/mobile/"]')].map((l) => l.href),
  };
});
await browser.close();

const keys = Object.keys(late);
const chromeOk = new Set(['fab', 'headerH', 'logoW', 'logoH']);
const diffs = keys.filter((k) => JSON.stringify(early[k]) !== JSON.stringify(late[k]));
const contentDiffs = diffs.filter((k) => !chromeOk.has(k));
console.log(JSON.stringify({ early, late, diffs, contentDiffs, chrome }, null, 2));
process.exit(contentDiffs.length || !chrome.footerOk ? 2 : 0);
