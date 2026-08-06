import fs from 'fs';
const html = fs.readFileSync('public/pages/resources.html', 'utf8');
const ids = ['comp-mrdp2u69', 'comp-mrdpew4h', 'comp-mp2vpkoa', 'comp-mrd4xija', 'comp-mpgmnan2'];
console.log('DOM index order:');
ids
  .map((id) => ({ id, i: html.indexOf(`id="${id}"`) }))
  .sort((a, b) => a.i - b.i)
  .forEach(({ id, i }) => console.log(i, id));

['From the Blog', 'Everything you need', 'Free Tools'].forEach((t) => {
  console.log('text', JSON.stringify(t), 'at', html.indexOf(t));
});

// Extract CSS snippets for section order
const cssMatch = html.match(/#comp-mrdp2u69\{[^}]+\}/g);
console.log('css mrdp2u69', cssMatch && cssMatch.slice(0, 3));
const css2 = html.match(/#comp-mp2vpkoa\{[^}]+\}/g);
console.log('css mp2vpkoa', css2 && css2.slice(0, 3));
const css3 = html.match(/#comp-mrdpew4h\{[^}]+\}/g);
console.log('css mrdpew4h', css3 && css3.slice(0, 3));

// Main section children order in markup
const mainStart = html.indexOf('<main ');
const mainChunk = html.slice(mainStart, mainStart + 50000);
const sectionIds = [...mainChunk.matchAll(/<section[^>]*id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('first sections in main:', sectionIds.slice(0, 12));
