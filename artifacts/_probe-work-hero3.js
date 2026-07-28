const fs = require('fs');
const h = fs.readFileSync('public/pages/work.html', 'utf8');

// All section containers in order
const secs = [...h.matchAll(/<(?:section|div)[^>]*id="(comp-[^"]+|PAGE_SECTION[^"]+)"[^>]*data-(?:block-level-container|testid)="(?:Section|section-container)"[^>]*>/g)];
console.log('section containers:');
for (const m of secs) console.log(' ', m[1]);

// Also simpler
const simple = [...h.matchAll(/id="(comp-[^"]+)"[^>]*wixui-section/g)].map((m) => m[1]);
console.log('\nwixui-section ids:', simple);

// Find comp-mr69hwoy context
const a = h.indexOf('id="comp-mr69hwoy"');
console.log('\nmr69hwoy at', a);
console.log(h.slice(a, a + 300).replace(/\s+/g, ' '));

// First 8 top-level comps under PAGE_SECTION / main content
const pageIdx = h.indexOf('id="PAGE_SECTIONSmg2rv"');
const chunk = h.slice(pageIdx, pageIdx + 8000);
const topComps = [...chunk.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]).slice(0, 20);
console.log('\nTop comps after PAGE_SECTION:', topComps);

// Mesh / grid area for hero section
const css = fs.readFileSync('public/css/pages/work.css', 'utf8');
for (const id of ['comp-mp3okkrk', 'comp-mr4pxqsd', 'comp-mr69hwoy', 'comp-mr5073f2', 'PAGE_SECTIONSmg2rv']) {
  const re = new RegExp(`#${id}\\{[^}]{0,500}`, 'g');
  const matches = css.match(re) || [];
  console.log('\nCSS', id, 'count', matches.length);
  matches.slice(0, 2).forEach((x) => console.log(x.slice(0, 280)));
}

// Look for media queries affecting hero
const mq = css.match(/@media[^{]+\{[^}]*#comp-mp3okkrk[^}]*\}/g);
console.log('\nmq mp3okkrk', mq && mq.slice(0, 2));

// Extract responsive rules mentioning hero comps
const heroRe = /@media[^{]+\{(?:[^{}]|\{[^}]*\}){0,50}#comp-mp3okkrk/g;
console.log('media near mp3', (css.match(/comp-mp3okkrk/g) || []).length);
