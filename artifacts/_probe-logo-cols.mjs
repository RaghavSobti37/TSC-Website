import sharp from 'sharp';

const src = 'public/assets/brand/tsc-logo-trim-nav.png';
const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const colHasInk = [];
for (let x = 0; x < info.width; x += 1) {
  let ink = 0;
  for (let y = 0; y < info.height; y += 1) {
    const i = (y * info.width + x) * 4;
    const a = data[i + 3];
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    // white-ish logo ink on transparent/dark
    if (a > 40 && lum > 180) ink += 1;
  }
  colHasInk[x] = ink;
}

let first = colHasInk.findIndex((n) => n > 2);
let last = colHasInk.length - 1 - [...colHasInk].reverse().findIndex((n) => n > 2);
// Find first large gap after shell (wordmark starts)
let gapStart = -1;
for (let x = first; x < last; x += 1) {
  if (colHasInk[x] <= 1) {
    let empty = 0;
    let j = x;
    while (j < last && colHasInk[j] <= 1) {
      empty += 1;
      j += 1;
    }
    if (empty >= 8) {
      gapStart = x;
      break;
    }
  }
}

console.log({
  size: `${info.width}x${info.height}`,
  first,
  last,
  gapStart,
  shellEnd: gapStart > 0 ? gapStart - 1 : Math.round(info.width * 0.28),
  sample: colHasInk
    .map((n, x) => (n > 2 ? 'X' : '.'))
    .join('')
    .slice(0, 200),
});
