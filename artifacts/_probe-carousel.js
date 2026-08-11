const fs = require('fs');
const html = fs.readFileSync('public/pages/artists.html', 'utf8');
const start = html.indexOf('id="comp-mqutig8q"');
const chunk = html.slice(start, start + 25000);
// list all id=comp- in this chunk until section end-ish
const ids = [...chunk.matchAll(/id="(comp-[^"]+)"/g)].map(m => m[1]);
console.log('ids in carousel region (first 40):');
ids.slice(0, 40).forEach((id, i) => console.log(i, id));
console.log('--- names ---');
const names = [...chunk.matchAll(/>(Harshad[^<]*|Yugm[^<]*|Mohit[^<]*)</gi)].map(m => m[1]);
console.log(names);
console.log('mqutenq in chunk?', /mqutenq/.test(chunk));
