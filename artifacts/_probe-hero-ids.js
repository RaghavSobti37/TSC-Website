const fs = require('fs');
const h = fs.readFileSync('public/pages/harshad-duhita.html', 'utf8');
const i = h.indexOf('id="comp-mq6h99jp"');
const slice = h.slice(i, i + 12000);
const ids = [...slice.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('harshad hero kids', [...new Set(ids)].slice(0, 50));
console.log(slice.replace(/\s+/g, ' ').slice(0, 1500));

const y = fs.readFileSync('public/pages/yugm.html', 'utf8');
const yi = y.indexOf('id="comp-mqhqa6vo"');
const ys = y.slice(yi, yi + 12000);
const yids = [...ys.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('\nyugm hero kids', [...new Set(yids)].slice(0, 50));
