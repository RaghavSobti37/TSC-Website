const fs = require('fs');
const files = [
  'public/pages/academy.html',
  'public/pages/learn-with-tsc.html',
  'public/pages/the-heart-of-composition.html',
  'public/pages/roots-of-hindustani-classical.html',
  'public/js/forms.js',
  'public/js/content-replacements.js',
  'public/js/content-data.js'
];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const hits = [];
  for (const p of [
    'Luca',
    'Music Production',
    'Petracca',
    'Heart of Composition',
    'Roots of',
    '₹',
    '3999',
    '4999',
    '9,999',
    'music-production',
    'A to Z',
    'A–Z'
  ]) {
    if (t.includes(p)) hits.push(p);
  }
  console.log(f + ':', hits.join(', ') || '(none)');
}

function extractTitles(file) {
  const t = fs.readFileSync(file, 'utf8');
  const re = />([^<]*(?:Heart|Roots|Music Production|Luca|A.?Z|Composition|Hindustani)[^<]*)</gi;
  let m;
  const seen = new Set();
  while ((m = re.exec(t))) {
    const s = m[1].replace(/\s+/g, ' ').trim();
    if (s.length > 3 && s.length < 120 && !seen.has(s)) {
      seen.add(s);
      console.log(file, '::', s);
    }
  }
}
extractTitles('public/pages/academy.html');
extractTitles('public/pages/learn-with-tsc.html');

// nav courses dropdown?
const home = fs.readFileSync('public/pages/home.html', 'utf8');
const navHits = [...home.matchAll(/Courses|Academy|Heart of|Roots of|Music Production/gi)].slice(0, 30);
console.log('home nav sample count', navHits.length);
console.log(navHits.map((x) => x[0]).join(', '));

// pricing in course pages via content replacements
const cr = fs.readFileSync('public/js/content-replacements.js', 'utf8');
const priceIdx = cr.indexOf('price');
console.log('content-replacements has price?', cr.toLowerCase().includes('price'), cr.includes('3999'), cr.includes('₹'));

// check if music-production page exists
console.log('music-production page?', fs.existsSync('public/pages/music-production.html'));
console.log('a-z page?', fs.existsSync('public/pages/a-z-of-music-production.html'));
console.log('az page?', fs.existsSync('public/pages/az-of-music-production.html'));
