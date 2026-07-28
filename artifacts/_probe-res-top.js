const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');

const i = css.indexOf('comp-mp2vpkoa-container{');
console.log(css.slice(i, i + 900).replace(/\s+/g, ' '));

// grid-area for key comps
for (const id of [
  'comp-mrd4o8h8',
  'comp-mrd4uy36',
  'comp-mparh5c7',
  'comp-mrd44ghl',
  'comp-mpgmnan2',
]) {
  const re = new RegExp(`#${id}\\{[^}]{0,600}`);
  const m = css.match(re);
  console.log('\n' + id, m && m[0].replace(/\s+/g, ' '));
}

// Direct children of mp2vpkoa container - extract top-level sibling ids
const start = h.indexOf('class="comp-mp2vpkoa-container');
const end = h.indexOf('</section>', start);
const body = h.slice(start, end);
// crude: find ids at shallow depth by tracking div nesting from container
let depth = 0;
const top = [];
const re = /<\/?div\b[^>]*>|id="(comp-[^"]+)"/g;
let m;
let seenOpen = false;
while ((m = re.exec(body))) {
  const tag = m[0];
  if (tag.startsWith('</')) {
    depth--;
    continue;
  }
  if (tag.startsWith('<div')) {
    if (!seenOpen) {
      seenOpen = true;
      depth = 0;
      continue;
    }
    depth++;
    const idm = tag.match(/id="(comp-[^"]+)"/);
    if (depth === 1 && idm) top.push(idm[1]);
    continue;
  }
  if (m[1] && depth === 1) top.push(m[1]);
}
console.log('\nTop children approx', [...new Set(top)].slice(0, 30));

// Simpler: after container open, find comment-delimited siblings
const simple = [...body.matchAll(/<!--\$--><(?:div|section)[^>]*id="(comp-[a-z0-9]+)"/g)].map((x) => x[1]);
console.log('\nComment siblings', simple.slice(0, 20));
