const fs = require('fs');

function context(file, needle, pad = 80) {
  const t = fs.readFileSync(file, 'utf8');
  let idx = 0;
  let n = 0;
  while ((idx = t.indexOf(needle, idx)) !== -1 && n < 8) {
    console.log('\n===', file, 'at', idx, '===');
    console.log(t.slice(Math.max(0, idx - pad), idx + needle.length + pad).replace(/\s+/g, ' '));
    idx += needle.length;
    n++;
  }
}

for (const f of [
  'public/pages/academy.html',
  'public/pages/learn-with-tsc.html',
  'public/pages/the-heart-of-composition.html',
  'public/pages/roots-of-hindustani-classical.html'
]) {
  context(f, '4999');
}

// Find Luca card links on academy
const acad = fs.readFileSync('public/pages/academy.html', 'utf8');
const around = acad.indexOf('Luca Petracca');
console.log('\nLuca academy block links:');
const chunk = acad.slice(around - 2000, around + 2500);
const hrefs = [...chunk.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log([...new Set(hrefs)]);

// learn-with-tsc Luca links
const learn = fs.readFileSync('public/pages/learn-with-tsc.html', 'utf8');
const around2 = learn.indexOf('Luca Petracca');
const chunk2 = learn.slice(around2 - 2000, around2 + 2500);
console.log('\nLuca learn links:');
console.log([...new Set([...chunk2.matchAll(/href="([^"]+)"/g)].map((m) => m[1]))]);

// Nav submenu courses on home
const home = fs.readFileSync('public/pages/home.html', 'utf8');
const coursesIdx = home.search(/HeART of Composition|the-heart-of-composition|Roots of Hindustani/i);
console.log('\nhome courses area idx', coursesIdx);
if (coursesIdx >= 0) {
  const c = home.slice(coursesIdx - 500, coursesIdx + 2000);
  console.log([...new Set([...c.matchAll(/href="([^"]+)"/g)].map((m) => m[1]))]);
  const labels = [...c.matchAll(/menu-item-label[^>]*>[\s\S]*?>([^<]+)</g)].map((m) => m[1].trim());
  console.log('labels', labels.slice(0, 20));
}

// Check content-replacements for course pages structure
const cr = fs.readFileSync('public/js/content-replacements.js', 'utf8');
console.log('\ncontent-replacements course keys:');
for (const k of ['/the-heart-of-composition', '/roots-of-hindustani-classical', 'music-production', 'Luca', 'price', '4999']) {
  console.log(k, cr.includes(k));
}
