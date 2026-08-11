const fs = require('fs');
const s = fs.readFileSync('artifacts/_head-responsive.css', 'utf8');
const marker = 'body[data-page="about"] #comp-mp2vlkbh2';
const idxs = [];
let from = 0;
while (true) {
  const i = s.indexOf(marker, from);
  if (i < 0) break;
  idxs.push(i);
  from = i + 1;
}
console.log('occurrences', idxs.length, idxs);
// print surrounding media query context for first desktop-ish occurrence
for (const i of idxs.slice(0, 3)) {
  const before = s.lastIndexOf('@media', i);
  const mediaLine = s.slice(before, before + 60).replace(/\n/g, ' ');
  console.log('\n=== at', i, 'media:', mediaLine);
  console.log(s.slice(i, i + 1800));
  console.log('---END---');
}
