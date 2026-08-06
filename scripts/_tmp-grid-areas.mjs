import fs from 'fs';
const html = fs.readFileSync('public/pages/resources.html', 'utf8');
const ids = ['comp-mpgmnan2','comp-mp2vpkoa','comp-mrd4xija','comp-mrdp2u69','comp-mrdpew4h'];
for (const id of ids) {
  const re = new RegExp('#' + id + '\\{[^}]*grid-area:[^;]+;');
  const m = html.match(re);
  console.log(id, 'native', m && m[0].match(/grid-area:[^;]+/)[0]);
}
console.log('--- override ---');
const style = html.match(/data-tsc-resources-blog-top[\s\S]*?<\/style>/)[0];
console.log(style.replace(/<[^>]+>/g,'').trim());

// How many sections have grid-area on page container
const areas = [...html.matchAll(/#(comp-[a-z0-9]+)\{[^}]*grid-area:(\d+)\/1\/(\d+)\/2/g)];
const unique = {};
for (const m of areas) {
  if (!unique[m[1]]) unique[m[1]] = m[2];
}
console.log('section rows (first seen):');
Object.entries(unique)
  .filter(([id,row]) => ['comp-mpgmnan2','comp-mp2vpkoa','comp-mrd4xija','comp-mrdp2u69'].includes(id))
  .sort((a,b)=>Number(a[1])-Number(b[1]))
  .forEach(([id,row]) => console.log(row, id));
