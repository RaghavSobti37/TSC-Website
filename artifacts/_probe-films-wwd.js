const fs = require('fs');
const html = fs.readFileSync('public/pages/films.html', 'utf8');
const hostStart = html.indexOf('id="comp-mqktx0nc"');
const chunk = html.slice(hostStart, hostStart + 90000);

const boxIds = [...chunk.matchAll(/id="(comp-[a-z0-9]+)"[^>]*class="[^"]*wixui-box/g)].map((m) => m[1]);
console.log('wixui-box count', boxIds.length);

function snippet(id, n = 350) {
  const i = html.indexOf('id="' + id + '"');
  if (i < 0) return null;
  return html
    .slice(i, i + n)
    .replace(/\s+/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
}

// Find title cards (FILM MOUNTING etc) and number comps
const titleHits = [...chunk.matchAll(/>(FILM MOUNTING|AUDIENCE BUILDING|PARTNERSHIPS[^<]*|MONETISATION[^<]*|FRANCHISE[^<]*)</gi)];
console.log('\nTitles:');
titleHits.forEach((m) => {
  const before = chunk.slice(Math.max(0, m.index - 400), m.index);
  const idMatch = before.match(/id="(comp-[a-z0-9]+)"[^>]*data-testid="richTextElement"/g);
  const last = idMatch && idMatch[idMatch.length - 1];
  console.log(m[1], last);
});

const numHits = [...chunk.matchAll(/<p class="font_5[^"]*"[^>]*>(0[1-5])<\/p>/g)];
console.log('\nNumbers:');
numHits.forEach((m) => {
  const before = chunk.slice(Math.max(0, m.index - 250), m.index);
  const idMatch = before.match(/id="(comp-[a-z0-9]+)"/g);
  const last = idMatch && idMatch[idMatch.length - 1];
  console.log(m[1], last);
});

// Duplicate partnerships outer boxes
['comp-mql5gtct', 'comp-mqmhowf1', 'comp-mql5hyxn', 'comp-mqmhp9kh'].forEach((id) => {
  console.log('\n' + id + ':', snippet(id));
});
