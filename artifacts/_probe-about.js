const fs = require('fs');
const h = fs.readFileSync('public/pages/about.html', 'utf8');
const main = h.slice(h.indexOf('id="PAGE_SECTIONSzem60"'));
const re = /id="(comp-[^"]+)"[\s\S]{0,400}?Know More/gi;
let m;
while ((m = re.exec(main))) {
  console.log(m[1]);
}
// belief card parent boxes
['comp-mr1wvww0','comp-mr1wvww','comp-mr1xvn1d','comp-mr1wnsbb','comp-mr1ychhq'].forEach((id) => {
  console.log(id, main.includes('id="' + id + '"'));
});
// container classes for beliefs
const belief = main.match(/id="comp-mr1whees"[\s\S]*?id="comp-mr1ychhq"/)[0];
const boxIds = [...belief.matchAll(/id="(comp-mr1w[^"]+)"/g)].map((x) => x[1]);
console.log('belief boxes', [...new Set(boxIds)].slice(0, 40));
