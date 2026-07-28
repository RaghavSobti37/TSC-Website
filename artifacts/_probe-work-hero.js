const fs = require('fs');
const h = fs.readFileSync('public/pages/work.html', 'utf8');

const pageSecs = [...h.matchAll(/id="(PAGE_SECTION[^"]+)"/g)].map((m) => m[1]);
console.log('PAGE_SECTION order:', pageSecs);

// Find section containing OUR WORK
const ow = h.indexOf('OUR WORK');
console.log('\nOUR WORK at', ow);
const before = h.slice(Math.max(0, ow - 3000), ow);
const secMatch = [...before.matchAll(/id="(PAGE_SECTION[^"]+|comp-mr[^"]+)"/g)].slice(-8);
console.log('nearby ids before OUR WORK:', secMatch.map((m) => m[1]));

// Extract hero area: from first PAGE_SECTION through quote/caption comps
const heroIds = [
  'comp-mr67bhxu', // OUR WORK
  'comp-mr4ozdiu', // headline
  'comp-mr68qf6k', // spiral svg
  'comp-mr68ntw5', // container?
];

// Find all comps in first section
const firstSec = pageSecs[0];
const secStart = h.indexOf(`id="${firstSec}"`);
const secEnd = pageSecs[1] ? h.indexOf(`id="${pageSecs[1]}"`) : secStart + 50000;
const secHtml = h.slice(secStart, secEnd);
const comps = [...secHtml.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('\nFirst section', firstSec, 'comps count', comps.length);
console.log(comps.slice(0, 40).join('\n'));

// Text snippets with their wrapping comps
const texts = [
  'OUR WORK',
  'Building platforms',
  'every initiative begins',
  'To create meaningful',
  'platforms or original',
  'Selected Work',
  'Whether through brand',
];
for (const t of texts) {
  const i = h.indexOf(t);
  if (i < 0) {
    console.log(t, 'NOT FOUND');
    continue;
  }
  const chunk = h.slice(Math.max(0, i - 500), i + 40);
  const ids = (chunk.match(/id="(comp-[^"]+)"/g) || []).map((x) => x.slice(4, -1));
  console.log('\n', t, '→', ids.slice(-4).join(', '));
}

// Check CSS links
const css = [...h.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
console.log('\nCSS:', css);
