import fs from 'fs';
const h = fs.readFileSync('public/pages/about.html', 'utf8');
const ids = [
  'comp-mr3hvomh',
  'comp-mr3hvon9',
  'comp-mr3hkny1',
  'comp-mr3hknyp',
  'comp-mr38xqqo',
  'comp-mr3axlwa',
  'comp-mr3fzsjq',
  'comp-mr355d93',
  'comp-mrlrqzuf',
];
for (const id of ids) {
  const needle = `id="${id}"`;
  const i = h.indexOf(needle);
  console.log('\n====', id, 'idx', i);
  if (i < 0) continue;
  console.log(h.slice(i, i + 2800).replace(/\s+/g, ' ').slice(0, 2000));
}
const terms = [
  'TSC Originals',
  'TSC Films',
  'Mounting films',
  'Originals',
  'living ecosystems',
  'film mounting',
  'IP Development',
  'What We Build',
];
for (const t of terms) {
  const hits = [];
  let from = 0;
  while (hits.length < 6) {
    const j = h.indexOf(t, from);
    if (j < 0) break;
    hits.push(j);
    from = j + 1;
  }
  console.log('\nTEXT', JSON.stringify(t), 'count~', hits.length);
  for (const j of hits) {
    console.log(' ', h.slice(Math.max(0, j - 100), j + 160).replace(/\s+/g, ' '));
  }
}

// Find section order around What We Build
const sectionRe = /<section id="(comp-mr[^"]+)"/g;
let m;
const secs = [];
while ((m = sectionRe.exec(h))) secs.push(m[1]);
console.log('\nSECTION ORDER (comp-mr*):', secs.join(' -> '));

// Color / bg near films card
for (const id of ['comp-mr3hvomh', 'comp-mr3hvon9', 'comp-mr3hkny1', 'comp-mr3hknyp']) {
  const re = new RegExp(`#${id}[^{]*\\{[^}]{0,400}`, 'g');
  const cssHits = h.match(re) || [];
  console.log('\nCSS snippets for', id, cssHits.length);
  cssHits.slice(0, 3).forEach((s) => console.log(s.slice(0, 350)));
}
