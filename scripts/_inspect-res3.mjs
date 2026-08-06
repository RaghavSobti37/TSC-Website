import fs from 'fs';
const h = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/pages/resources.html',
  'utf8'
);
const i = h.indexOf('id="comp-mrdq85ob"');
const chunk = h.slice(i, i + 4500);
const ids = [...chunk.matchAll(/id="(comp-mrdq85[^"]+)"/g)].map((m) => m[1]);
console.log(ids.join('\n'));
const titles = [...chunk.matchAll(/<(h\d|p)[^>]*>([^<]{5,80})/g)].map((m) => m[2]);
console.log(titles.slice(0, 15));

const f = fs.readFileSync(
  'c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website/public/pages/films.html',
  'utf8'
);
const m = f.match(/They[\s\S]{0,30}need[\s\S]{0,40}communit/i);
console.log('films phrase', m && JSON.stringify(m[0]));
