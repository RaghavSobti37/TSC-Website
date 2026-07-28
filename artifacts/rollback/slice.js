// Slice a tall screenshot into segments. Usage: node slice.js <file> [segH]
const path = require('path');
const sharp = require(path.resolve(__dirname, '..', '..', 'node_modules', 'sharp'));

(async () => {
  const file = process.argv[2];
  const segH = Number(process.argv[3] || 1600);
  const meta = await sharp(file).metadata();
  const base = file.replace(/\.png$/, '');
  let n = 0;
  for (let y = 0; y < meta.height; y += segH) {
    const h = Math.min(segH, meta.height - y);
    await sharp(file).extract({ left: 0, top: y, width: meta.width, height: h }).png().toFile(`${base}-s${n}.png`);
    n++;
  }
  console.log(`${path.basename(file)}: ${n} slices of ${segH}px`);
})();
