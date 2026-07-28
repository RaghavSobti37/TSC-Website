const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');

for (const needle of [
  'comp-mp2vpkoa-container{',
  '#comp-mp2vpkoa{',
  'comp-mrdp2u69-container{',
  '[id^="comp-mpbfryng__"]{',
  '[id^="comp-mrd98n4i__"]{',
  'comp-mpbfrynb-container{',
  'comp-mrd98n472-container{',
]) {
  const i = css.indexOf(needle);
  console.log('\n===', needle, i);
  if (i >= 0) console.log(css.slice(i, i + 500).replace(/\s+/g, ' '));
}

// Where is Free Tools in DOM relative to tabs?
const free = h.indexOf('id="comp-mrd4o8h8"');
const tabs = h.indexOf('id="comp-mparh5c7"');
const cards = h.indexOf('id="comp-mpbfrynb"');
console.log('\nDOM order:', { tabs, cards, free });

// Parent of mrd4o8h8 - look for responsive-container-content wrapping it
const around = h.slice(free - 2000, free + 100);
const parents = [...around.matchAll(/id="(comp-[^"]+)"[^>]*(?:responsive-container|container|section)/g)].map((m) => m[1]);
console.log('parents near free', parents.slice(-10));
console.log(around.replace(/\s+/g, ' ').slice(0, 600));
