#!/usr/bin/env node
/**
 * Phase 13–14: smoke + interaction tests for /blank-10
 * Usage: npm run test:blank10 [-- --url https://...]
 */
import { chromium } from 'playwright';

const base = process.argv.includes('--url')
  ? process.argv[process.argv.indexOf('--url') + 1]
  : 'http://localhost:3000';

const url = `${base.replace(/\/$/, '')}/blank-10`;

async function run() {
  const browser = await chromium.launch();
  const errors = [];

  // Desktop
  const desktop = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await desktop.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await desktop.waitForTimeout(1500);

  const stuckDrawer = await desktop.evaluate(() => {
    const d = document.getElementById('comp-mq6d7i8b');
    if (!d) return false;
    const cs = getComputedStyle(d);
    return cs.display !== 'none' && parseFloat(cs.opacity) > 0.5;
  });
  if (stuckDrawer) errors.push('desktop: wix mobile drawer visible');

  const hero = await desktop.locator('h1.b10-hero__title').textContent();
  if (!hero?.includes('Harshaduhita')) errors.push('desktop: hero missing');

  for (let i = 0; i < 5; i++) {
    await desktop.evaluate(() => window.scrollBy(0, window.innerHeight * 0.85));
    await desktop.waitForTimeout(400);
  }
  const sections = await desktop.locator('section[id^="comp-mq"]').count();
  if (sections < 8) errors.push(`desktop: expected 8 sections, got ${sections}`);

  const btn = desktop.locator('a.b10-btn--fill').first();
  if (!(await btn.isVisible())) errors.push('desktop: CTA not visible');

  // Mobile menu
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
  await mobile.waitForTimeout(1000);
  await mobile.locator('.b10-header__menu').click();
  await mobile.waitForTimeout(400);
  const drawerOpen = await mobile.locator('.b10-mobile-drawer--open').isVisible();
  if (!drawerOpen) errors.push('mobile: drawer did not open');
  await mobile.locator('.b10-mobile-backdrop').click({ force: true });
  await mobile.waitForTimeout(300);
  const drawerClosed = !(await mobile.locator('.b10-mobile-drawer--open').isVisible());
  if (!drawerClosed) errors.push('mobile: drawer did not close');

  await browser.close();

  if (errors.length) {
    console.error('FAIL', errors);
    process.exit(1);
  }
  console.log('PASS blank-10 interactions @', url);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
