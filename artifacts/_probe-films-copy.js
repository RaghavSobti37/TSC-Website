const fs = require('fs');
const html = fs.readFileSync('public/pages/films.html', 'utf8');

function extractTextNear(id, after = 2500) {
  const i = html.indexOf('id="' + id + '"');
  if (i < 0) return null;
  const chunk = html.slice(i, i + after);
  const texts = [...chunk.matchAll(/>([^<]{3,200})</g)]
    .map((m) => m[1].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim())
    .filter((t) => t && !t.startsWith('{') && t !== '​');
  return texts.slice(0, 40);
}

[
  'comp-mql25lfk',
  'comp-mqksjwhn',
  'comp-mqmh352i',
  'comp-mqktsjdh',
  'comp-mqktx0nc',
  'comp-mqmhuw20',
  'comp-mqmi3w473',
  'comp-mqmi3w4a',
  'comp-mqku1yx4',
  'comp-mqktywoc',
  'comp-mqmkrjnm',
  'comp-mqmkth8f'
].forEach((id) => {
  console.log('\n==== ' + id + ' ====');
  console.log(extractTextNear(id));
});

// Find CTA labels
const labels = [...html.matchAll(/wixui-button__label">([^<]+)</g)].map((m) => m[1]);
console.log('\nBUTTONS', labels);

// What we do item titles
const whatIdx = html.indexOf('id="comp-mqktx0nc"');
const whatChunk = html.slice(whatIdx, whatIdx + 30000);
const titles = [...whatChunk.matchAll(/<(?:h[1-6]|p)[^>]*class="[^"]*font_[^"]*"[^>]*>(?:<span[^>]*>)?([^<]{2,80})/g)].map((m) => m[1].replace(/\s+/g, ' ').trim());
console.log('\nWHAT WE DO titles sample', titles.slice(0, 40));
