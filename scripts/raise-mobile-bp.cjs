#!/usr/bin/env node
/** Raise mobile media queries from 900px to 1024px (desktop lock starts at 1025). */
const fs = require('fs');
const path = require('path');

const roots = [path.join(__dirname, '..', 'public', 'css'), path.join(__dirname, '..', 'public', 'js')];
const files = [];

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(css|js)$/.test(e.name)) files.push(p);
  }
}

roots.forEach(walk);

let changed = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const orig = s;
  s = s.replace(/@media\s*\(([^)]*)max-width:\s*900px([^)]*)\)/g, '@media ($1max-width: 1024px$2)');
  s = s.replace(/@media\s*\(([^)]*)min-width:\s*901px([^)]*)\)/g, '@media ($1min-width: 1025px$2)');
  s = s.replace(/matchMedia\(\s*['"]\(max-width:\s*900px\)['"]\s*\)/g, "matchMedia('(max-width: 1024px)')");
  s = s.replace(/matchMedia\(\s*['"]\(min-width:\s*901px\)['"]\s*\)/g, "matchMedia('(min-width: 1025px)')");
  s = s.replace(/var MQ = ['"]\(max-width: 900px\)['"]/g, "var MQ = '(max-width: 1024px)'");
  s = s.replace(/media="\(max-width: 900px\)"/g, 'media="(max-width: 1024px)"');
  if (s !== orig) {
    fs.writeFileSync(f, s);
    changed += 1;
    console.log('updated', path.relative(path.join(__dirname, '..'), f));
  }
}
console.log('files_changed', changed);
