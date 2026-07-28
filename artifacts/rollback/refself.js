const path = require('path');
const sharp = require(path.resolve('node_modules', 'sharp'));
(async () => {
  for (const pair of [['artifacts/rollback/ref-home.png','artifacts/rollback/ref2-home.png'],['artifacts/rollback/ref-artist-path.png','artifacts/rollback/ref2-artist-path.png']]) {
    const [da, db] = await Promise.all(pair.map(p => sharp(p).raw().ensureAlpha().toBuffer()));
    let diff = 0;
    for (let i = 0; i < da.length; i += 4) {
      if (Math.abs(da[i]-db[i])>12 || Math.abs(da[i+1]-db[i+1])>12 || Math.abs(da[i+2]-db[i+2])>12) diff++;
    }
    console.log(`${pair[1]}: ${(400*diff/da.length).toFixed(3)}% differ`);
  }
})();
