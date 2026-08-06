import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/artist-path/index.html',
  'utf8'
);
for (const needle of ['THE MODEL', 'The Framework', 'The Model', 'Human', 'Audience', 'Career']) {
  const i = h.indexOf(needle);
  console.log(needle, i);
  if (i > 0) console.log(h.slice(i - 120, i + 200).replace(/\s+/g, ' ').slice(0, 280));
}
const i = h.indexOf('id="comp-mqqulorc"');
console.log('benefits strip', h.slice(i, i + 400).replace(/\s+/g, ' ').slice(0, 350));
