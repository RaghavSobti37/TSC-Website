import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'about-hero-fix');
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const [name, w, h] of [
  ['m390', 390, 844],
  ['d1280', 1280, 800],
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  await page.goto(`${base}/about`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForSelector('#comp-mp2vlkbh2');
  await new Promise((r) => setTimeout(r, 1500));

  const data = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top),
        l: Math.round(r.left),
        display: s.display,
        opacity: s.opacity,
        objectFit: s.objectFit,
        maxW: s.maxWidth,
        maxH: s.maxHeight,
        transform: s.transform,
      };
    };
    return {
      hero: rect(document.querySelector('#comp-mp2vlkbh2')),
      bgLayers: rect(document.querySelector('#bgLayers_comp-mp2vlkbh2')),
      bgMedia: rect(document.querySelector('#bgMedia_comp-mp2vlkbh2')),
      img: rect(document.querySelector('#img_comp-mp2vlkbh2 img')),
      canvas: rect(document.querySelector('#comp-mp2vlkbh2 canvas.webglcanvas')),
      overlay: rect(document.querySelector('#bgImgOverlay_comp-mp2vlkbh2')),
      shell: rect(document.querySelector('#comp-mr1ttkgk')),
      mark: rect(document.querySelector('#comp-mr1vbgc2')),
      tag: rect(document.querySelector('#comp-mr1tv44l')),
      underlayBg: getComputedStyle(
        document.querySelector('#bgLayers_comp-mp2vlkbh2 [data-testid="colorUnderlay"]') ||
          document.querySelector('#bgLayers_comp-mp2vlkbh2')
      ).backgroundColor,
    };
  });

  const shotPath = path.join(outDir, `${name}.png`);
  await page.screenshot({ path: shotPath, fullPage: false });
  const heroHandle = await page.$('#comp-mp2vlkbh2');
  if (heroHandle) {
    await heroHandle.screenshot({ path: path.join(outDir, `${name}-hero.png`) });
  }
  console.log('====', name, '====');
  console.log(JSON.stringify(data, null, 2));
  await page.close();
}

await browser.close();
