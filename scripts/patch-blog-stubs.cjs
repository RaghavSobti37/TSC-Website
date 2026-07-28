#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

const map = [
  ['blog-1', 'start-making-music'],
  ['blog-2', 'online-music-course-worth-it'],
  ['blog-3', 'artist-release-playbook'],
];

function stub(to) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=/${to}">
  <script>location.replace("/${to}" + location.search + location.hash);</script>
</head>
<body><a href="/${to}">Open /${to}</a></body>
</html>
`;
}

for (const [from, to] of map) {
  for (const base of [from, path.join('resources', from)]) {
    const dir = path.join(publicDir, base);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), stub(to));
    console.log('legacy stub', base, '->', to);
  }
}

// Patch boot maps in index.html files
function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (e.name === 'mirror' || e.name === 'node_modules') continue;
      if (d.endsWith('assets') && e.name === 'mirror') continue;
      walk(p, acc);
    } else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}

const needle = "'blog-3': '/css/mobile/resources.css'";
const replacement = `'blog-3': '/css/mobile/resources.css',
    'start-making-music': '/css/mobile/resources.css',
    'online-music-course-worth-it': '/css/mobile/resources.css',
    'artist-release-playbook': '/css/mobile/resources.css'`;

let n = 0;
for (const f of walk(publicDir)) {
  if (f.includes(`${path.sep}assets${path.sep}mirror`)) continue;
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes("'blog-1': '/css/mobile/resources.css'")) continue;
  if (s.includes('start-making-music')) continue;
  if (!s.includes(needle)) continue;
  fs.writeFileSync(f, s.replace(needle, replacement));
  n += 1;
}
console.log('boot maps patched', n);

// add-mobile-loader.js
const loader = path.join(root, 'scripts', 'add-mobile-loader.js');
let ls = fs.readFileSync(loader, 'utf8');
if (!ls.includes('start-making-music')) {
  ls = ls.replace(needle, replacement);
  fs.writeFileSync(loader, ls);
  console.log('patched add-mobile-loader.js');
}
