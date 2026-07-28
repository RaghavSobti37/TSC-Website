const fs = require('fs');
const files = [
  'public/pages/the-heart-of-composition.html',
  'public/pages/roots-of-hindustani-classical.html',
  'public/pages/academy.html',
  'public/pages/learn-with-tsc.html',
  'public/pages/artist-path.html',
  'public/js/content-replacements.js',
  'public/js/content-data.js',
  'artifacts/TSC_Updated_Website_Content_Replacement_Copy.txt'
];
const patterns = [/₹\s*[\d,]+/g, /Rs\.?\s*[\d,]+/gi, /INR\s*[\d,]+/gi, /[\d,]{3,}\s*\/-?/g, /price[^<]{0,40}/gi, /fee[^<]{0,40}/gi, /enrol[^<]{0,60}/gi];
for (const f of files) {
  if (!fs.existsSync(f)) { console.log('missing', f); continue; }
  const t = fs.readFileSync(f, 'utf8');
  console.log('\n####', f);
  for (const p of patterns) {
    const m = t.match(p);
    if (m) console.log(p, [...new Set(m)].slice(0, 15));
  }
}

// Find Know More / Explore links for Luca cards specifically by searching A-Z of Music Production neighborhood
for (const f of ['public/pages/academy.html', 'public/pages/learn-with-tsc.html']) {
  const t = fs.readFileSync(f, 'utf8');
  const i = t.indexOf('A-Z of Music Production');
  console.log('\n', f, 'A-Z idx', i);
  if (i >= 0) {
    const chunk = t.slice(i - 3000, i + 1500);
    console.log('hrefs', [...new Set([...chunk.matchAll(/href="([^"]+)"/g)].map((x) => x[1]))]);
    console.log('buttons', [...chunk.matchAll(/aria-label="([^"]+)"/g)].map((x) => x[1]).slice(0, 20));
    // strip tags roughly for text
    const text = chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 800);
    console.log('text', text);
  }
}

// nav courses submenu - search for blank-9 or the-heart in menu
const home = fs.readFileSync('public/pages/home.html', 'utf8');
const idxs = [];
let start = 0;
while (true) {
  const i = home.indexOf('the-heart-of-composition', start);
  if (i < 0) break;
  idxs.push(i);
  start = i + 1;
  if (idxs.length > 10) break;
}
console.log('\nhome the-heart occurrences', idxs.length, idxs.slice(0,5));
if (idxs[0] != null) {
  const c = home.slice(idxs[0]-800, idxs[0]+1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(c.slice(0, 600));
}
