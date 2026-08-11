const fs = require('fs');
const html = fs.readFileSync('public/pages/artists.html', 'utf8');

// Pull structure from viewer model / warmup that references mqutenq children
function findChunks(label, re) {
  const hits = [];
  let m;
  while ((m = re.exec(html))) {
    hits.push({ index: m.index, snippet: m[0].slice(0, 200) });
  }
  console.log(label, hits.length);
  hits.slice(0, 5).forEach((h) => console.log(' ', h.index, h.snippet));
}

findChunks('mqutenq5 as json key', /"comp-mqutenq5"[^,]{0,80}/g);
findChunks('children arrays with mqutenq', /"components"\s*:\s*\[[^\]]{0,400}mqutenq[^\]]{0,200}\]/g);
findChunks('mqutig8q children', /"comp-mqutig8q"[^}]{0,500}/g);

// Look for page structure JSON with components arrays
const structureMatch = html.match(/"structure"\s*:\s*\{/);
console.log('structure key', !!structureMatch);

// Search for parent that lists three cards
const idx = html.indexOf('"comp-mqutig8q"');
console.log('mqutig8q first', idx);
if (idx > 0) {
  console.log(html.slice(idx, idx + 800).replace(/\s+/g, ' ').slice(0, 700));
}

// Find all unique mqutenq* ids mentioned
const ids = new Set();
const re = /comp-mqutenq[a-z0-9]*/g;
let m;
while ((m = re.exec(html))) ids.add(m[0]);
console.log('unique mqutenq ids', [...ids].sort());
