import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'about-hero-fix');
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

for (const [name, w, h] of [
  ['d1280', 1280, 800],
  ['m390', 390, 844],
]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));

  const data = await page.evaluate(() => {
    const rect = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top),
        l: Math.round(r.left),
        display: s.display,
        position: s.position,
        maxW: s.maxWidth,
        maxH: s.maxHeight,
        fontSize: s.fontSize,
        objectFit: s.objectFit,
        opacity: s.opacity,
        transform: s.transform,
        bgColor: s.backgroundColor,
      };
    };
    const links = [...document.querySelectorAll('link[rel=stylesheet]')]
      .map((l) => l.href)
      .filter((href) => /about|responsive|mobile/i.test(href));
    const img =
      document.querySelector('#img_comp-mp2vlkbh2 img') ||
      document.querySelector('#comp-mp2vlkbh2 img');
    return {
      vw: window.innerWidth,
      bodyClass: document.body.className,
      dataPage: document.body.getAttribute('data-page'),
      links,
      hero: rect('#comp-mp2vlkbh2'),
      bgMedia: rect('#bgMedia_comp-mp2vlkbh2'),
      img: img
        ? {
            ...rect('#img_comp-mp2vlkbh2 img'),
            src: (img.currentSrc || img.src || '').slice(0, 160),
          }
        : null,
      canvas: rect('#comp-mp2vlkbh2 canvas.webglcanvas'),
      underlay: rect('#bgLayers_comp-mp2vlkbh2 [data-testid="colorUnderlay"]'),
      shell: rect('#comp-mr1ttkgk'),
      mark: rect('#comp-mr1vbgc2'),
      word: rect('#comp-mr1tvuqc'),
      tag: rect('#comp-mr1tv44l'),
      tagText: rect('#comp-mr1tv44l .wixui-rich-text__text, #comp-mr1tv44l h1'),
    };
  });

  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: false });
  const heroHandle = await page.$('#comp-mp2vlkbh2');
  if (heroHandle) {
    await heroHandle.screenshot({ path: path.join(outDir, `${name}-hero.png`) });
  }
  console.log('====', name, '====');
  console.log(JSON.stringify(data, null, 2));
  await page.close();
}

await browser.close();
