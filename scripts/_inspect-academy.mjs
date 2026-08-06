import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/pages/academy.html',
  'utf8'
);
console.log('Luca count', (h.match(/Luca Petracca/g) || []).length);
console.log('music-production href', (h.match(/href="\/music-production"/g) || []).length);
const ids = ['comp-mpjxxeqt', 'comp-mpjzvp90', 'comp-mpjxxers6', 'comp-mpl387ie', 'comp-mqwdfgsa'];
for (const id of ids) {
  const i = h.indexOf(`id="${id}"`);
  console.log(id, i > -1 ? 'found' : 'missing');
}
const i = h.indexOf('A-Z of Music');
console.log('AZ idx', i);
if (i > 0) console.log(h.slice(i - 200, i + 400).replace(/\s+/g, ' ').slice(0, 500));
const j = h.indexOf('Luca Petracca');
console.log('near luca', h.slice(j - 300, j + 500).replace(/\s+/g, ' ').slice(0, 600));
