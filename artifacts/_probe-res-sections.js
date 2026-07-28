const fs = require('fs');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

function findSection(id) {
  const i = h.indexOf(`id="${id}"`);
  if (i < 0) return null;
  const before = h.slice(Math.max(0, i - 3000), i);
  const secs = [...before.matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  return secs.slice(-3);
}

for (const id of [
  'comp-mrd4o8h8',
  'comp-mrd4uy36',
  'comp-mparh5cz',
  'comp-mpbfrynb',
  'comp-mrd98n472',
  'comp-mrdp2u69',
  'comp-mrdq81q0',
  'comp-mrdq85ob',
]) {
  console.log(id, '→', findSection(id));
}

// Parent container of Free Tools title
const i = h.indexOf('id="comp-mrd4o8h8"');
const before = h.slice(Math.max(0, i - 1500), i);
const containers = [...before.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('\nNear Free Tools titles comps:', containers.slice(-15));

// CSS for Free Tools section shell
for (const id of ['comp-mp2vpkoa', 'comp-mrd44ghl', 'comp-mparh5c7']) {
  const j = css.indexOf(`#${id}{`);
  console.log('\n#' + id, j);
  if (j >= 0) console.log(css.slice(j, j + 300).replace(/\s+/g, ' '));
}

// Find section that contains both Free Tools and tabs
const pageSecs = [...h.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
console.log('\nAll sections', pageSecs);

// Which section contains mrd4o8h8
const secHtml = (sid) => {
  const start = h.indexOf(`id="${sid}"`);
  const end = h.indexOf('</section>', start);
  return h.slice(start, end);
};
for (const sid of pageSecs) {
  const chunk = secHtml(sid);
  if (chunk.includes('comp-mrd4o8h8') || chunk.includes('comp-mpbfrynb') || chunk.includes('comp-mparh5')) {
    console.log('section', sid, 'has free/tabs/cards', {
      free: chunk.includes('comp-mrd4o8h8'),
      tabs: chunk.includes('comp-mparh5'),
      cards: chunk.includes('comp-mpbfrynb'),
      len: chunk.length,
    });
  }
}
