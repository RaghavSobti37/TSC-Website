const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'pages', 'the-heart-of-composition.html');
const h = fs.readFileSync(file, 'utf8');
const re = /href="([^"]+)"/g;
const set = new Set();
let m;
while ((m = re.exec(h))) {
  const u = m[1];
  if (/academy|learn|course|heart|roots|music-prod|blank/i.test(u)) set.add(u);
}
console.log([...set].sort().join('\n'));
