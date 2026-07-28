const fs = require('fs');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

// All repeaters
const reps = [...h.matchAll(/id="(comp-[^"]+)"[^>]*wixui-repeater/g)].map(m => m[1]);
console.log('Repeaters:', reps);

// All listitems with width 20% pattern in css
const twenty = [...css.matchAll(/\[id\^="(comp-[^"]+)__"\]\{[^}]*width:calc\(\(\(\(20%/g)].map(m => m[1]);
console.log('20% width items:', twenty);

// Tab panels
const panels = [...h.matchAll(/role="tabpanel"[^>]*aria-labelledby="([^"]+)"/g)].map(m => m[1]);
console.log('Tab panels labels:', panels);
const panelIds = [...h.matchAll(/id="(comp-mparh5e[^"]+)"/g)].map(m => m[1]);
console.log('Tab panel comps:', [...new Set(panelIds)]);

// Blog card boxes
const blogBoxes = [...h.matchAll(/id="(comp-mrdq[^"]+|comp-mrdp[^"]+)"/g)].map(m => m[1]);
console.log('Blog-ish comps sample:', [...new Set(blogBoxes)].slice(0, 40));

// Section for free tools header - find parent section of mrd4o8h8
const i = h.indexOf('id="comp-mrd4o8h8"');
const before = h.slice(Math.max(0, i - 2500), i);
const sections = [...before.matchAll(/<section id="([^"]+)"/g)].map(m => m[1]);
console.log('Parent sections of Free Tools:', sections.slice(-5));

// Find mesh/grid for free tools header area
for (const k of ['comp-mrd4', 'comp-mp2vpkoa-container']) {
  let idx = css.indexOf(k);
  console.log('\n', k, idx);
  if (idx >= 0) console.log(css.slice(idx, idx + 280).replace(/\s+/g, ' '));
}

nodeBlog();
function nodeBlog() {
  for (const f of ['blog-1','blog-2','blog-3']) {
    const html = fs.readFileSync(`public/pages/${f}.html`, 'utf8');
    const m = html.match(/id="([a-z0-9]{5})" class="ETqrjz/);
    const main = html.match(/id="PAGE_SECTIONS([^"]+)"/);
    console.log(f, 'root', m && m[1], 'main', main && main[1]);
  }
}
