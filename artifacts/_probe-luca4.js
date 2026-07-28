const fs = require('fs');

function dumpLuca(file, sectionId, imageId) {
  const a = fs.readFileSync(file, 'utf8');
  const start = a.indexOf(`id="${sectionId}"`);
  console.log('\n====', file, sectionId, 'start', start);
  // Find Know More button block
  const km = a.indexOf('comp-mpjxxery4', start);
  const km2 = a.indexOf('Coming Soon', start);
  console.log('km button idx', km, 'coming soon', km2);
  if (km > 0) console.log('BUTTON', a.slice(km - 20, km + 500));
  // Find image in luca section
  const sectionEnd = a.indexOf('</section>', start + 100);
  const section = a.slice(start, Math.min(start + 20000, sectionEnd + 20));
  const imgs = [...section.matchAll(/id="(img-comp-[^"]+|comp-[^"]+)"[^>]{0,80}(?:imageX|wow-image)/g)];
  console.log('images', imgs.map((m) => m[1]));
  const wow = [...section.matchAll(/<div id="(comp-[^"]+)" data-testid="imageX"[\s\S]{0,400}/g)];
  wow.forEach((m) => console.log('IMG BLOCK', m[0].slice(0, 350).replace(/\s+/g, ' ')));
}

dumpLuca('public/pages/academy.html', 'comp-mpjxxeqt');
dumpLuca('public/pages/learn-with-tsc.html', 'comp-mrufx9rd2');

// Heart Know More pattern for comparison
const a = fs.readFileSync('public/pages/academy.html', 'utf8');
const hi = a.indexOf('href="/the-heart-of-composition" target="_self" class="PoVCDy');
console.log('\nHEART KM', a.slice(hi - 80, hi + 280));

// Courses dropdown full item HTML
const di = a.indexOf('style="--items-number:2"');
console.log('\nDROPDOWN', a.slice(di, di + 1200));
