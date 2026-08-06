import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/pages/resources.html',
  'utf8'
);
const ids = [...h.matchAll(/id="(comp-mrdq[^"]+)"/g)].map((m) => m[1]);
console.log([...new Set(ids)].slice(0, 40).join('\n'));
console.log('---');
console.log('mrdq85ob', h.includes('comp-mrdq85ob'));
console.log('Artist Release', h.includes('Artist Release'));
console.log('insta-music', (h.match(/insta-music-league/g) || []).length);
console.log('start-making', (h.match(/start-making-music/g) || []).length);
