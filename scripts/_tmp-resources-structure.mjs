import fs from 'fs';
const html = fs.readFileSync('public/pages/resources.html', 'utf8');

function findContext(id) {
  const needle = `id="${id}"`;
  const i = html.indexOf(needle);
  if (i < 0) return null;
  // walk back to find nearest section / container ancestors by scanning tags before
  const before = html.slice(Math.max(0, i - 2500), i);
  const after = html.slice(i, i + 800);
  const openSections = [...before.matchAll(/<(section|div)[^>]*id="([^"]+)"[^>]*>/g)].map((m) => m[2]);
  return { i, openSections: openSections.slice(-8), snippet: after.slice(0, 200) };
}

['comp-mrdp2u69', 'comp-mrdq8d4s', 'comp-mrdpew4h', 'comp-mrdq81q0', 'comp-mrdq85ob', 'comp-mpgmnan2', 'comp-mp2vpkoa'].forEach((id) => {
  const c = findContext(id);
  console.log('\n==', id, 'at', c && c.i);
  console.log('recent ids:', c && c.openSections.join(' > '));
});

// Is mrdpew4h between mrdp2u69 and end of that section?
const blogStart = html.indexOf('id="comp-mrdp2u69"');
const blogEndApprox = html.indexOf('</section>', blogStart);
const blogChunk = html.slice(blogStart, blogEndApprox + 20);
console.log('\nInside blog section chunk length', blogChunk.length);
console.log('contains mrdq8d4s', blogChunk.includes('comp-mrdq8d4s'));
console.log('contains mrdpew4h', blogChunk.includes('comp-mrdpew4h'));
console.log('contains mrdpqawy', blogChunk.includes('comp-mrdpqawy'));

// Count section grid-area overrides specificity risk: mobile grid-area auto on section?
const mobile = fs.readFileSync('public/css/mobile/resources.css', 'utf8');
const hits = [...mobile.matchAll(/#comp-mrdp2u69[^{]*\{[^}]*grid-area:[^;]+;/g)];
console.log('\nmobile grid-area rules on blog section:', hits.length, hits.map((h) => h[0].slice(0, 120)));

// Page parent container for sections
const pageMatch = html.match(/id="PAGES_CONTAINER"[^>]*>|class="[^"]*PAGES[^"]*"/);
console.log('PAGES hint', pageMatch && pageMatch[0]);

// Check xk8qq container template rows - section order parent
const containerCss = html.match(/#xk8qq \.xk8qq-container\{[^}]+\}/);
console.log('xk8qq container', containerCss && containerCss[0].slice(0, 300));
