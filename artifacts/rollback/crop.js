const path = require('path');
const sharp = require(path.resolve('node_modules', 'sharp'));
(async () => {
  for (const [f, out] of [['ref-home.png','crop-ref-hero.png'],['cur-home.png','crop-cur-hero.png']]) {
    await sharp(`artifacts/rollback/${f}`).extract({ left: 0, top: 0, width: 1280, height: 900 }).png().toFile(`artifacts/rollback/${out}`);
  }
  console.log('done');
})();
