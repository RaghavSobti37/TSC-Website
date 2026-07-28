const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));
const sharp = require(path.resolve(__dirname, '..', '..', 'node_modules', 'sharp'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 60000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  const m = await page.evaluate(() => {
    const ids = ['comp-mp2vlkbh2', 'comp-mr1ttkgk', 'comp-mr1vbgc2', 'comp-mr1tvuqc', 'comp-mr1tv44l'];
    const out = { page: document.body.getAttribute('data-page') };
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) { out[id] = null; continue; }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[id] = {
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        top: +r.top.toFixed(1),
        order: cs.order,
        sheets: [...document.styleSheets].map(s => (s.href || '').split('/').pop()).filter(Boolean),
      };
    }
    // which rule wins for shell width
    out.shellWidth = getComputedStyle(document.getElementById('comp-mr1ttkgk')).width;
    out.shellHeight = getComputedStyle(document.getElementById('comp-mr1ttkgk')).height;
    out.mobileCss = !!document.querySelector('link[href*="mobile/about.css"]');
    out.respCss = !!document.querySelector('link[href*="tsc-responsive"]');
    return out;
  });
  console.log(JSON.stringify(m, null, 2));
  await page.screenshot({ path: path.join(__dirname, 'about-hero-after.png') });
  // also run full stitch like shot3 for /about
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));
  const vh = 844;
  const total = Math.min(await page.evaluate(() => document.body.scrollHeight), 20000);
  const shots = [];
  for (let y = 0; y < total; y += vh) {
    const target = Math.min(y, Math.max(0, total - vh));
    await page.evaluate((t) => window.scrollTo(0, t), target);
    await new Promise((r) => setTimeout(r, 250));
    shots.push({ buf: await page.screenshot(), y: target });
    if (target < y) break;
  }
  await sharp({ create: { width: 390, height: Math.max(total, vh), channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite(shots.map((s) => ({ input: s.buf, left: 0, top: s.y })))
    .png()
    .toFile(path.join(__dirname, 'shot3-abouthero-about.png'));
  console.log('shot3 saved', total);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
