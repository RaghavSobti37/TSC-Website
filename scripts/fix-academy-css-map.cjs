const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'public');

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'assets'].includes(e.name)) continue;
      walk(p, acc);
    } else if (/\.html$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const from = "academy: '/css/mobile/learn.css";
const to = "academy: '/css/mobile/academy.css";
let n = 0;
for (const f of walk(root)) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes(from)) continue;
  fs.writeFileSync(f, s.split(from).join(to));
  n++;
}
console.log('rewrote academy map in', n, 'html files');
