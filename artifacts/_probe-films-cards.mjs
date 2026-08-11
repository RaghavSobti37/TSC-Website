import fs from 'fs';
const html = fs.readFileSync('public/pages/films.html', 'utf8');

function findAncestors(id) {
  const idx = html.indexOf('id="' + id + '"');
  if (idx < 0) return 'NOT FOUND';
  const before = html.slice(Math.max(0, idx - 12000), idx);
  const sections = [...before.matchAll(/<(section|div)[^>]*\bid="(comp-[^"]+)"/g)];
  return sections.slice(-12).map((m) => m[2]).join(' > ');
}

const ids = [
  'comp-mqktx0nc',
  'comp-mqmhowf1',
  'comp-mqmhp1sq',
  'comp-mqktx0o11',
  'comp-mql591nr',
  'comp-mql5hyxr',
  'comp-mqmhp9le2',
  'comp-mql5q7n31',
  'comp-mql5uiwc',
];
for (const id of ids) console.log(id + ':', findAncestors(id));

console.log('Partnerships', (html.match(/Partnerships/g) || []).length);
console.log('>03<', (html.match(/>03</g) || []).length);
console.log('mqktx0nc contains mqmhowf1?', html.includes('id="comp-mqktx0nc"') && (() => {
  const a = html.indexOf('id="comp-mqktx0nc"');
  const b = html.indexOf('id="comp-mqmhowf1"');
  // crude: is mqmhowf1 between mqktx0nc open and next top-level section after?
  const after = html.slice(a, a + 500000);
  const end = after.search(/<\/section>/);
  return after.slice(0, end).includes('id="comp-mqmhowf1"');
})());

// Find which section owns the first Partnerships 03 and the duplicate
const p1 = html.indexOf('Partnerships');
console.log('first Partnerships snippet:', html.slice(p1 - 200, p1 + 80).replace(/\s+/g, ' '));
const p2 = html.indexOf('Partnerships', p1 + 1);
console.log('second Partnerships snippet:', html.slice(p2 - 200, p2 + 80).replace(/\s+/g, ' '));
