// Pixel diff ref-*.png vs cur-*.png using sharp.
const path = require('path');
const fs = require('fs');
const sharp = require(path.resolve(__dirname, '..', '..', 'node_modules', 'sharp'));

const slugs = ['home','about','work','artists','artist-path','learn-with-tsc','films','resources','academy'];

(async () => {
  for (const slug of slugs) {
    const a = path.join(__dirname, `ref-${slug}.png`);
    const b = path.join(__dirname, `cur-${slug}.png`);
    const ia = sharp(a).raw().ensureAlpha();
    const ib = sharp(b).raw().ensureAlpha();
    const [ma, mb] = await Promise.all([ia.metadata(), ib.metadata()]);
    if (ma.width !== mb.width || ma.height !== mb.height) {
      console.log(`${slug}: SIZE MISMATCH ref=${ma.width}x${ma.height} cur=${mb.width}x${mb.height}`);
      continue;
    }
    const [da, db] = await Promise.all([ia.toBuffer(), ib.toBuffer()]);
    let diff = 0;
    const total = ma.width * ma.height;
    for (let i = 0; i < da.length; i += 4) {
      if (Math.abs(da[i] - db[i]) > 12 || Math.abs(da[i+1] - db[i+1]) > 12 || Math.abs(da[i+2] - db[i+2]) > 12) diff++;
    }
    console.log(`${slug}: ${(100 * diff / total).toFixed(3)}% pixels differ (${diff}/${total})`);
  }
})();
