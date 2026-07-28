const fs = require('fs');
const path = fs.readFileSync('public/css/pages/artist-path.css', 'utf8');
const h = fs.readFileSync('public/pages/artist-path.html', 'utf8');

// Find listitems for glance
const items = [...h.matchAll(/role="listitem"[^>]*class="[^"]*(comp-[a-z0-9]+)/g)].map((m) => m[1]);
console.log('listitem classes', [...new Set(items)]);

const listRoot = [...h.matchAll(/id="(comp-mqpa[^"]+)"/g)].map((m) => m[1]);
console.log('mqpa ids', [...new Set(listRoot)].slice(0, 40));

// Find narrow width comps in artist-path
const narrow = [...path.matchAll(/#(comp-[a-z0-9]+)\{[^}]{0,180}width:(?:2[0-9]|3[0-9]|1[0-9])\.[0-9]+%/g)];
console.log('narrow %', narrow.map((m) => m[1] + ' ' + (m[0].match(/width:[^;]+/) || [''])[0]).slice(0, 40));

const fixed = [...path.matchAll(/#(comp-[a-z0-9]+)\{[^}]{0,180}width:\d{2,3}px/g)];
console.log('fixed px', fixed.map((m) => m[1] + ' ' + (m[0].match(/width:[^;]+/) || [''])[0]).slice(0, 30));

// Market context box
const i = h.indexOf('MARKET CONTEXT');
console.log('market near', [...h.slice(i - 800, i + 400).matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]).slice(-10));

// Harshad/yugm narrow
for (const page of ['harshad-duhita', 'yugm']) {
  const css = fs.readFileSync('public/css/pages/' + page + '.css', 'utf8');
  const n = [...css.matchAll(/#(comp-[a-z0-9]+)\{[^}]{0,180}width:(?:2[0-9]|3[0-9]|4[0-9])\.[0-9]+%/g)];
  console.log('\n', page, 'narrow', n.map((m) => m[1]).slice(0, 25));
}

// Form pages - local form presence
for (const page of ['book-an-artist', 'artist-query', 'collab-query']) {
  const html = fs.readFileSync('public/pages/' + page + '.html', 'utf8');
  console.log(page, 'tsc-local-form', html.includes('tsc-local-form'), 'form class', /class="[^"]*tsc-local-form/.test(html));
  const root = html.match(/PAGE_SECTIONS([a-z0-9]+)/);
  console.log('  root', root && root[1]);
}
