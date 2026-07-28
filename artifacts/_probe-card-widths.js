const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

const items = [
  'comp-mpckq3oa',
  'comp-mpck0aaa',
  'comp-mpcbr1io',
  'comp-mpbfryng',
  'comp-mrd98n4i',
];

for (const id of items) {
  const re = new RegExp(`\\[id\\^="${id}__"\\]\\{[^}]+\\}`);
  const m = css.match(re);
  if (!m) {
    console.log(id, 'NO MATCH');
    continue;
  }
  const width = m[0].match(/width:[^;]+/);
  console.log(id, width && width[0]);
}

// Also check container for other repeaters
for (const id of ['comp-mpckq3o3', 'comp-mpck0a7u', 'comp-mpcbr1ij', 'comp-mrd98n472']) {
  const i = css.indexOf(`#${id} .${id}-container`);
  console.log('\n', id, 'container @', i);
  if (i >= 0) console.log(css.slice(i, i + 350).replace(/\s+/g, ' '));
}

// Free tools header parent - look for mesh with mrd4o8h8 and mrd4uy36
const i = css.indexOf('#comp-mrd4o8h8{');
console.log('\nmrd4o8h8 full:', css.slice(i, i + 400).replace(/\s+/g, ' '));

// Find section containing Free Tools - search backwards for section in HTML more carefully
const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const idx = h.indexOf('id="comp-mrd4o8h8"');
let depth = 0;
for (let p = idx; p > 0; p--) {
  if (h.slice(p, p + 8) === '</section') depth++;
  if (h.slice(p, p + 8) === '<section') {
    if (depth === 0) {
      console.log('\nFound section open:', h.slice(p, p + 120));
      break;
    }
    depth--;
  }
}
