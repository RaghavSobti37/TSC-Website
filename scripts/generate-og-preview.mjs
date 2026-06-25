/**
 * Social preview banner (1200×630) for theshakticollective.in
 * Run: node scripts/generate-og-preview.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const logoPath = path.join(root, 'public/assets/only-logo.svg');
const outPath = path.join(root, 'public/og-preview.png');

const WIDTH = 1200;
const HEIGHT = 630;

const bannerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#fdf6f1"/>
  <rect width="${WIDTH}" height="10" fill="#ff8c00"/>
  <circle cx="1050" cy="520" r="200" fill="#ff8c00" opacity="0.08"/>
  <text x="80" y="300" font-family="Segoe UI, system-ui, sans-serif" font-size="82" font-weight="600" fill="#1a1a1a" letter-spacing="-1">The Shakti Collective</text>
  <text x="84" y="380" font-family="Segoe UI, system-ui, sans-serif" font-size="34" fill="#666666">Unfolding Artists' Force</text>
  <text x="84" y="440" font-family="Segoe UI, system-ui, sans-serif" font-size="22" fill="#b74b02">Learn · Create · Collaborate</text>
</svg>`;

async function main() {
  const logoPng = await sharp(fs.readFileSync(logoPath))
    .resize(120, 120)
    .png()
    .toBuffer();

  const basePng = await sharp(Buffer.from(bannerSvg)).png().toBuffer();

  const out = await sharp(basePng)
    .composite([{ input: logoPng, left: 80, top: 80 }])
    .png()
    .toBuffer();

  fs.writeFileSync(outPath, out);
  console.log(`Wrote public/og-preview.png (${out.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
