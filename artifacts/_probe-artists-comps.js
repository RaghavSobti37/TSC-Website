const fs = require('fs');

function extract(page) {
  const h = fs.readFileSync('public/pages/' + page + '.html', 'utf8');
  console.log('\n==', page);
  const needles = [
    'What We Do',
    'Why TSC',
    'Our Philosophy',
    'Meet Our',
    'Explore Artists',
    'Partner',
    'Artist Development',
    'APPLY NOW',
    'DURATION',
    'MARKET CONTEXT',
    'Building India',
    'HARSHAD',
    'YUGM',
    'Brand',
    'Artist',
    'Book an Artist',
    'Submit',
    'CONNECT'
  ];
  for (const needle of needles) {
    const i = h.indexOf(needle);
    if (i < 0) continue;
    const slice = h.slice(Math.max(0, i - 500), i + 120);
    const comps = [...slice.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
    console.log(needle, '->', comps.slice(-8).join(', '));
  }
  // mesh items / list items
  const lists = [...h.matchAll(/role="list"[^>]*id="(comp-[^"]+)"/g)].map((m) => m[1]);
  const items = [...h.matchAll(/role="listitem"[^>]*class="[^"]*(comp-[a-z0-9]+)/g)].map((m) => m[1]);
  if (lists.length) console.log('lists', lists.slice(0, 8));
  if (items.length) console.log('listitems sample', [...new Set(items)].slice(0, 12));
}

[
  'artists',
  'harshad-duhita',
  'yugm',
  'artist-path',
  'book-an-artist',
  'artist-query',
  'collab-query'
].forEach(extract);
