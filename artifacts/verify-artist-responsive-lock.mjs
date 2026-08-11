import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';
const outDir = path.resolve('artifacts', 'artist-responsive-lock');

const pages = [
  {
    slug: 'harshad-duhita',
    titleText: 'Harshaduhita Collective',
    badgeText: 'Winner - PADMA SHRI MAHENDRA KAPOOR AWARD 2026',
    descText:
      'A live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical expression.',
    hero: '#comp-mq6h99jp',
    panel: '#comp-mq6ibhwz',
    title: '#comp-mq6i6vma',
    badge: '#comp-mq9gnhcn',
    desc: '#comp-mq6igg7l',
    book: '#comp-mq7lgwyt',
    music: '#comp-mq7limoj',
    desktop: { width: 1920, height: 1080, panelMin: 1120, panelMax: 1320, panelHeight: 560 },
    duplicate: '#comp-mqffd5wc',
  },
  {
    slug: 'yugm',
    titleText: 'YUGM',
    badgeText: 'Netflix Spotlight - Mismatched Season 2 & 3',
    descText: 'A bridge between tradition and transformation.',
    hero: '#comp-mqhqa6vo',
    panel: '#comp-mqhqa6vs2',
    title: '#comp-mqhqa6wg',
    badge: '#comp-mqhqa6x51',
    desc: '#comp-mqhqa6wl3',
    book: '#comp-mqhqa6wo',
    music: '#comp-mqhqa6ww',
    desktop: { width: 1400, height: 660, panelMin: 1120, panelMax: 1205, panelHeight: 560 },
  },
];

const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

function within(value, min, max) {
  return value >= min && value <= max;
}

async function rect(page, selector) {
  return page.$eval(selector, (el) => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
      top: r.top,
      bottom: r.bottom,
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity),
    };
  });
}

async function visibleRect(page, selector) {
  const r = await rect(page, selector);
  return r.display !== 'none' && r.visibility !== 'hidden' && r.width > 1 && r.height > 1;
}

function addFailure(failures, condition, message, details = {}) {
  if (!condition) failures.push({ message, details });
}

async function inspectPage(browser, cfg, viewport) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
  await page.goto(`${baseUrl}/${cfg.slug}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForSelector(cfg.panel, { timeout: 20000 });
  await new Promise((resolve) => setTimeout(resolve, 900));

  const screenshot = path.join(outDir, `${cfg.slug}-${viewport.name}-${viewport.width}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });

  const failures = [];
  const bodyText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim());
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    viewportWidth: window.innerWidth,
  }));

  addFailure(
    failures,
    metrics.scrollWidth <= metrics.clientWidth + 2,
    'page has horizontal overflow',
    metrics
  );
  addFailure(failures, bodyText.includes(cfg.titleText), 'expected hero title missing');
  addFailure(failures, bodyText.includes(cfg.badgeText), 'expected hero badge missing');
  addFailure(failures, bodyText.includes(cfg.descText), 'expected hero description missing');

  const hero = await rect(page, cfg.hero);
  const panel = await rect(page, cfg.panel);
  const title = await rect(page, cfg.title);
  const badge = await rect(page, cfg.badge);
  const desc = await rect(page, cfg.desc);
  const book = await rect(page, cfg.book);
  const music = await rect(page, cfg.music);

  for (const [name, item] of Object.entries({ hero, panel, title, badge, desc, book, music })) {
    addFailure(
      failures,
      item.display !== 'none' && item.visibility !== 'hidden' && item.opacity > 0.01,
      `${name} is hidden`,
      item
    );
  }

  addFailure(
    failures,
    panel.width <= viewport.width - 24 || viewport.name === 'desktop',
    'responsive hero panel exceeds viewport',
    { panelWidth: panel.width, viewportWidth: viewport.width }
  );
  addFailure(
    failures,
    [title, badge, desc, book, music].every((item) => item.x >= -2 && item.x + item.width <= viewport.width + 2),
    'hero content escapes viewport',
    { title, badge, desc, book, music }
  );

  if (viewport.name === 'desktop') {
    addFailure(
      failures,
      within(panel.width, cfg.desktop.panelMin, cfg.desktop.panelMax),
      'desktop panel width is outside locked range',
      { width: panel.width, expected: cfg.desktop }
    );
    addFailure(
      failures,
      within(panel.height, cfg.desktop.panelHeight - 3, cfg.desktop.panelHeight + 3),
      'desktop panel height is outside locked range',
      { height: panel.height, expected: cfg.desktop.panelHeight }
    );
    addFailure(
      failures,
      Math.abs((viewport.width - panel.width) / 2 - panel.x) <= 4,
      'desktop panel is not centered',
      { x: panel.x, width: panel.width, viewportWidth: viewport.width }
    );

    if (cfg.duplicate) {
      const duplicateVisible = await visibleRect(page, cfg.duplicate).catch(() => false);
      addFailure(failures, !duplicateVisible, 'duplicate desktop hero is still visible');
    }
  }

  await page.close();
  return {
    slug: cfg.slug,
    viewport: viewport.name,
    screenshot,
    failures,
    measurements: {
      hero: { width: Math.round(hero.width), height: Math.round(hero.height), y: Math.round(hero.y) },
      panel: { width: Math.round(panel.width), height: Math.round(panel.height), x: Math.round(panel.x) },
      scrollWidth: metrics.scrollWidth,
      clientWidth: metrics.clientWidth,
    },
  };
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const results = [];

  try {
    for (const cfg of pages) {
      results.push(await inspectPage(browser, cfg, { name: 'desktop', ...cfg.desktop }));
      for (const viewport of viewports.filter((item) => item.name !== 'desktop')) {
        results.push(await inspectPage(browser, cfg, viewport));
      }
    }
  } finally {
    await browser.close();
  }

  const failures = results.flatMap((result) =>
    result.failures.map((failure) => ({
      slug: result.slug,
      viewport: result.viewport,
      ...failure,
    }))
  );

  console.log(JSON.stringify({ baseUrl, results, failures }, null, 2));

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
