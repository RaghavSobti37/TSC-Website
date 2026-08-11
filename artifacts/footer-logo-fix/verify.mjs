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
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.setDefaultTimeout(25000);

await page.goto(`http://127.0.0.1:3000/?cb=${Date.now()}`, {
  waitUntil: 'domcontentloaded',
  timeout: 30000
});

await page.waitForSelector('.tsc-desktop-footer-logo', { timeout: 20000 });
await page.evaluate(() => {
  document.querySelector('.tsc-desktop-footer')?.scrollIntoView({ block: 'start' });
});
await new Promise((r) => setTimeout(r, 800));

const metrics = await page.evaluate(() => {
  const logo = document.querySelector('.tsc-desktop-footer-logo');
  const tag = document.querySelector('.tsc-desktop-footer-tagline');
  const block = document.querySelector('.tsc-desktop-footer-brandblock');
  const copy = document.querySelector('.tsc-desktop-footer-copy');
  const footer = document.querySelector('.tsc-desktop-footer');
  const br = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };
  const cs = (el) => (el ? getComputedStyle(el) : null);
  return {
    logoSrc: logo && logo.getAttribute('src'),
    logoNatural: logo && { w: logo.naturalWidth, h: logo.naturalHeight },
    logoBox: br(logo),
    tagBox: br(tag),
    blockBox: br(block),
    footerBox: br(footer),
    tagText: tag && tag.textContent.trim(),
    tagAlign: cs(tag) && cs(tag).textAlign,
    tagAlignLast: cs(tag) && cs(tag).textAlignLast,
    copyText: copy && copy.textContent.trim(),
    copyWhiteSpace: cs(copy) && cs(copy).whiteSpace,
    blockWidth: block && block.offsetWidth,
    footerWidth: footer && footer.offsetWidth,
    tagWidth: tag && tag.offsetWidth,
    logoWidth: logo && logo.offsetWidth,
    ratioTagToLogo: logo && tag ? tag.offsetWidth / Math.max(logo.offsetWidth, 1) : null,
    ratioTagToFooter: footer && tag ? tag.offsetWidth / Math.max(footer.offsetWidth, 1) : null
  };
});

const blockEl = await page.$('.tsc-desktop-footer-brandblock');
if (blockEl) await blockEl.screenshot({ path: path.join(outDir, 'footer-brandblock.png') });
const footEl = await page.$('.tsc-desktop-footer');
if (footEl) await footEl.screenshot({ path: path.join(outDir, 'footer-full.png') });
fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(metrics, null, 2));
console.log(JSON.stringify(metrics, null, 2));
await browser.close();
