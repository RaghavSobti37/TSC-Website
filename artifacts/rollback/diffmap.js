const path = require('path');
const sharp = require(path.resolve('node_modules', 'sharp'));
(async () => {
  const a = 'artifacts/rollback/ref-home.png', b = 'artifacts/rollback/cur-home.png';
  const meta = await sharp(a).metadata();
  const [da, db] = await Promise.all([a, b].map(p => sharp(p).raw().ensureAlpha().toBuffer()));
  const out = Buffer.from(da);
  const rows = new Map();
  for (let i = 0; i < da.length; i += 4) {
    const d = Math.abs(da[i]-db[i])>12 || Math.abs(da[i+1]-db[i+1])>12 || Math.abs(da[i+2]-db[i+2])>12;
    if (d) {
      out[i]=255; out[i+1]=0; out[i+2]=0;
      const y = Math.floor((i/4) / meta.width);
      const band = Math.floor(y/100)*100;
      rows.set(band, (rows.get(band)||0)+1);
    }
  }
  await sharp(out, { raw: { width: meta.width, height: meta.height, channels: 4 } }).png().toFile('artifacts/rollback/diff-home.png');
  const sorted = [...rows.entries()].sort((x,y)=>y[1]-x[1]).slice(0,10);
  console.log('top diff bands (y-range: px count):');
  for (const [band, count] of sorted) console.log(`  y ${band}-${band+99}: ${count}`);
})();
