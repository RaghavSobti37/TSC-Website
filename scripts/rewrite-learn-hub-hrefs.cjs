/**
 * Point every learn-with-tsc / blank-3-1 hub link at canonical /academy.
 */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'public');

const REPLACEMENTS = [
  [/href="\/learn-with-tsc"/g, 'href="/academy"'],
  [/href='\/learn-with-tsc'/g, "href='/academy'"],
  [/href="\/\/blank-3-1"/g, 'href="/academy"'],
  [/href='\/\/blank-3-1'/g, "href='/academy'"],
  [/href="\/academy\/learn-with-tsc"/g, 'href="/academy"'],
  [/href='\/academy\/learn-with-tsc'/g, "href='/academy'"],
  [/\/learn-with-tsc(?=["'#?\s])/g, null] // handled above for hrefs only
];

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', 'assets', 'mirror'].includes(ent.name)) continue;
      walk(p, acc);
    } else if (/\.(html|js)$/.test(ent.name)) {
      acc.push(p);
    }
  }
  return acc;
}

let files = 0;
let hits = 0;
for (const file of walk(root)) {
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  s = s
    .replace(/href="\/learn-with-tsc"/g, 'href="/academy"')
    .replace(/href='\/learn-with-tsc'/g, "href='/academy'")
    .replace(/href="\/\/blank-3-1"/g, 'href="/academy"')
    .replace(/href='\/\/blank-3-1'/g, "href='/academy'")
    .replace(/href="\/academy\/learn-with-tsc"/g, 'href="/academy"')
    .replace(/href='\/academy\/learn-with-tsc'/g, "href='/academy'")
    .replace(/href="\/pages\/learn-with-tsc(?:\.html)?"/g, 'href="/academy"');
  // Soft-nav siteRoutes: keep learn-with-tsc key so old bookmarks soft-nav then 308,
  // but rewrite label targets in footer templates already handled in JS.
  if (s !== before) {
    fs.writeFileSync(file, s);
    files++;
    hits += (before.match(/learn-with-tsc|blank-3-1/g) || []).length;
  }
}
console.log('rewrote', files, 'files; approx hub refs touched:', hits);
