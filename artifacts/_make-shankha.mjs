/**
 * Crop brand shankha from tsc-logo-trim-nav.png → cream PNG for About hero.
 * node artifacts/_make-shankha.mjs
 */
import sharp from 'sharp';

const src = 'public/assets/brand/tsc-logo-trim-nav.png';
const out = 'public/assets/brand/tsc-shankha-cream.png';

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const colHasInk = [];
for (let x = 0; x < info.width; x += 1) {
  let ink = 0;
  for (let y = 0; y < info.height; y += 1) {
    const i = (y * info.width + x) * 4;
    const a = data[i + 3];
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (a > 40 && lum > 180) ink += 1;
  }
  colHasInk[x] = ink;
}

const first = colHasInk.findIndex((n) => n > 2);
let gapStart = -1;
for (let x = first; x < info.width; x += 1) {
  if (colHasInk[x] > 1) continue;
  let empty = 0;
  let j = x;
  while (j < info.width && colHasInk[j] <= 1) {
    empty += 1;
    j += 1;
  }
  if (empty >= 8) {
    gapStart = x;
    break;
  }
}
if (gapStart < 0) gapStart = Math.round(info.width * 0.35);

const pad = 6;
const left = Math.max(0, first - pad);
const width = Math.min(info.width - left, gapStart - first + pad * 2);

const cropped = await sharp(src)
  .extract({ left, top: 0, width, height: info.height })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const outData = cropped.data;
for (let i = 0; i < outData.length; i += 4) {
  const a = outData[i + 3];
  const lum = (outData[i] + outData[i + 1] + outData[i + 2]) / 3;
  if (a < 16 || lum < 40) {
    outData[i + 3] = 0;
    continue;
  }
  // white logo ink → cream
  const t = Math.min(1, (lum - 40) / 180);
  outData[i] = 255;
  outData[i + 1] = 236;
  outData[i + 2] = 209;
  outData[i + 3] = Math.round(a * t);
}

await sharp(outData, {
  raw: { width: cropped.info.width, height: cropped.info.height, channels: 4 },
})
  .trim({ threshold: 8 })
  .png()
  .toFile(out);

const meta = await sharp(out).metadata();
console.log('wrote', out, meta.width + 'x' + meta.height, { left, width, first, gapStart });
