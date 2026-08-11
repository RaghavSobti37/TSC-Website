import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/pages/home.html',
  'utf8'
);
const scripts = [...h.matchAll(/src=["']([^"']+)["']/g)].map((m) => m[1]);
console.log(scripts.filter((s) => /tsc|content|replace|component|motion/i.test(s)).join('\n'));
const i = h.indexOf('id="comp-mrly2iho"');
console.log('\nJoin button snippet:');
console.log(h.slice(i, i + 450).replace(/\s+/g, ' '));
const j = h.indexOf('id="comp-mrly1u79"');
console.log('\nBuild button snippet:');
console.log(h.slice(j, j + 450).replace(/\s+/g, ' '));
