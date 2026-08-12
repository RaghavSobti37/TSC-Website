import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const pagesDir = 'public/pages';
const routes = fs
  .readdirSync(pagesDir)
  .filter((f) => f.endsWith('.html'))
  .map((f) => {
    const slug = f.replace(/\.html$/, '');
    return slug === 'home' ? '/' : '/' + slug;
  })
  .sort();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const browser = await puppeteer.launch({ headless: true, executablePath: chrome });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
page.setDefaultNavigationTimeout(45000);

const results = [];
let failed = 0;

for (const route of routes) {
  const url = 'http://127.0.0.1:3001' + route + '?v=motion-all-1';
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2800);
    const d = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('[id^="comp-"]'));
      let paused = 0;
      let running = 0;
      let motion = 0;
      const pausedSamples = [];
      nodes.forEach((el) => {
        if (el.id && el.id.indexOf('__item-') !== -1) return;
        const cs = getComputedStyle(el);
        const names = String(cs.animationName || '');
        if (!names || names === 'none' || names.indexOf('motion-') === -1) return;
        motion++;
        if (String(cs.animationPlayState).indexOf('paused') !== -1) {
          paused++;
          if (pausedSamples.length < 6) pausedSamples.push({ id: el.id, names: names.split(',')[0].trim() });
        } else running++;
      });
      return {
        motion,
        paused,
        running,
        authored: document.querySelectorAll('[data-tsc-wix-authored-motion-bound="1"]').length,
        scripts: {
          motion: !!document.querySelector('script[src*="tsc-wix-motion"]'),
          authored: !!document.querySelector('script[src*="tsc-wix-authored-motion"]'),
        },
        pausedSamples,
      };
    });
      /* Fail only if paused Wix motion remains, or motion exists without replay script. Standalone form pages may omit scripts. */
    const ok = d.paused === 0 && (d.motion === 0 || d.scripts.motion);
    if (!ok) failed++;
    results.push({ route, ok, ...d });
    console.log(JSON.stringify({ route, ok, motion: d.motion, paused: d.paused, authored: d.authored, samples: d.pausedSamples }));
  } catch (e) {
    failed++;
    results.push({ route, ok: false, error: e.message });
    console.log(JSON.stringify({ route, ok: false, error: e.message }));
  }
}

fs.writeFileSync('artifacts/motion-verify-all-local.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify({ total: results.length, failed, exit: failed ? 1 : 0 }));
await browser.close();
process.exit(failed ? 1 : 0);
