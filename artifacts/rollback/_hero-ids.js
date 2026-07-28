const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const i = html.indexOf('id="comp-mp2vlkbh2"');
const chunk = html.slice(i, i + 12000);
const ids = [...chunk.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log(ids.join('\n'));
const j = chunk.indexOf('comp-mr1tvuqc');
console.log('--- mr1tvuqc snippet ---');
console.log(chunk.slice(Math.max(0, j - 80), j + 400));
