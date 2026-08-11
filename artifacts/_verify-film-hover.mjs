/**
 * Verify film card hover: soft-light → normal blendMode on hover.
 */
import puppeteer from 'puppeteer';

const url = process.env.FILMS_URL || 'http://127.0.0.1:3017/films';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--window-size=1440,900'],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await page.waitForSelector('.tsc-film-report-card', { timeout: 20000 });
await page.evaluate(() => {
  const card = document.querySelector('.tsc-film-report-card');
  if (card) card.scrollIntoView({ block: 'center' });
});
await new Promise((r) => setTimeout(r, 500));

const cards = [
  { root: '#comp-mqmi3w3o', img: '#comp-mqmi3w4b3' },
  { root: '#comp-mqmi6ynt2', img: '#comp-mqmi6yoc4' },
  { root: '#comp-mqmi8cxm2', img: '#comp-mqmi8cy66' },
  { root: '#comp-mqmi8sui', img: '#comp-mqmi8sv12' },
];

const results = [];
for (const c of cards) {
  const before = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const blend = getComputedStyle(el).getPropertyValue('--blendMode').trim();
    const mix = getComputedStyle(el).mixBlendMode;
    const img = el.querySelector('img');
    const child = el.querySelector('.i4P7Vt') || el;
    return {
      blend,
      mix,
      childMix: getComputedStyle(child).mixBlendMode,
      childBlend: getComputedStyle(child).getPropertyValue('--blendMode').trim(),
      imgSrc: img ? (img.currentSrc || img.src || '').slice(-80) : null,
      classes: el.className,
      hasCard: !!el.closest('.tsc-film-report-card'),
    };
  }, c.img);

  await page.hover(c.root);
  await new Promise((r) => setTimeout(r, 400));

  const after = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const child = el.querySelector('.i4P7Vt') || el;
    return {
      blend: getComputedStyle(el).getPropertyValue('--blendMode').trim(),
      mix: getComputedStyle(el).mixBlendMode,
      childMix: getComputedStyle(child).mixBlendMode,
      childBlend: getComputedStyle(child).getPropertyValue('--blendMode').trim(),
      cardHovered: !!el.closest('.tsc-film-report-card:hover'),
    };
  }, c.img);

  results.push({
    ...c,
    before,
    after,
    ok:
      before &&
      after &&
      before.blend === 'soft-light' &&
      after.blend === 'normal' &&
      (after.mix === 'normal' || after.childMix === 'normal'),
  });
}

console.log(JSON.stringify(results, null, 2));
const pass = results.every((r) => r.ok);
console.log(pass ? 'PASS' : 'FAIL');
await browser.close();
process.exit(pass ? 0 : 1);
