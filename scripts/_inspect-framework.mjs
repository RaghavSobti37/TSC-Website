import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/artist-path/index.html',
  'utf8'
);
const i = h.indexOf('The Framework');
console.log(h.slice(i - 800, i + 2500).replace(/\s+/g, ' ').slice(0, 1500));
console.log('---');
// look for blank-4 / model section numbers
for (const id of ['comp-mqqf5d25', 'comp-mqqjhqqf', 'comp-mqqn539p', 'comp-mqqt0h6q', 'comp-mqs0']) {
  console.log(id, h.includes(id));
}
const m = h.match(/journey is at the heart/i);
console.log('journey phrase', !!m);
if (m) console.log(h.slice(m.index - 200, m.index + 300).replace(/\s+/g, ' '));
