const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

for (const k of [
  '#comp-mpbfrynb',
  '.comp-mpbfrynb-container',
  'comp-mpbfryng',
  'comp-mpbgduqx',
  'comp-mparh5e63-container',
  'comp-mparh5cz-container',
]) {
  let idx = 0, n = 0;
  while ((idx = css.indexOf(k, idx)) !== -1 && n < 4) {
    console.log('\n===', k, '@', idx);
    console.log(css.slice(idx, idx + 450).replace(/\s+/g, ' '));
    idx += k.length;
    n++;
  }
}

// Find media queries that already touch tabs/repeater
const re = /@media[^{]+\{[^}]*comp-mpbfrynb[^}]*\}/g;
const m = css.match(re);
console.log('\nMedia hits mpbfrynb:', m && m.length);
if (m) m.slice(0, 3).forEach((x) => console.log(x.slice(0, 300)));

const re2 = /@media[^{]+\{[^}]*comp-mparh5c7[^}]{0,200}/g;
const m2 = css.match(re2);
console.log('\nMedia hits mparh5c7:', m2 && m2.length);
if (m2) m2.forEach((x) => console.log(x.slice(0, 400)));
