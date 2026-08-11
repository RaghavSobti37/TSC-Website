import fs from 'fs';
const h = fs.readFileSync('public/pages/about.html', 'utf8');

// Extract each brand section text labels
const sections = ['comp-mr38xqqo','comp-mr3axlwa','comp-mr3fzsjq','comp-mr3iatty','comp-mr3si7hw','comp-mr3smd70'];
for (const id of sections) {
  const start = h.indexOf(`id="${id}"`);
  if (start < 0) { console.log(id, 'MISSING'); continue; }
  // take until next section or 15k
  const next = h.indexOf('<section id="', start + 10);
  const chunk = h.slice(start, next > 0 ? Math.min(next, start + 20000) : start + 20000);
  const texts = [...chunk.matchAll(/>([^<]{3,120})</g)].map(m => m[1].replace(/\s+/g,' ').trim()).filter(t => /[A-Za-z]/.test(t) && !t.includes('{') && !t.includes('--'));
  console.log('\n##', id);
  console.log([...new Set(texts)].slice(0, 40).join(' | '));
  // vector images / logos
  const vectors = [...chunk.matchAll(/id="(comp-[^"]+)"[^>]*vector|wixui-vector-image[^>]*>[\s\S]{0,80}/gi)].slice(0,5);
  const vecIds = [...chunk.matchAll(/id="(comp-[^"]+)"[^ class]* class="[^"]*wixui-vector/g)].map(m=>m[1]);
  const allVec = [...chunk.matchAll(/<[^>]*id="(comp-[^"]+)"[^>]*wixui-vector-image/g)].map(m=>m[1]);
  console.log('vector ids', allVec);
  // bg colors in chunk style attrs / inner-box
  const bgs = [...chunk.matchAll(/--bg[^:;]*:\s*([^;]+)/g)].slice(0,8).map(m=>m[1]);
  console.log('bgs sample', bgs);
}

// Search CSS for bg colors of cards
const css = fs.readFileSync('public/css/pages/about.css','utf8');
for (const id of ['comp-mr3hvomh','comp-mr3hvon9','comp-mr3hkny1','comp-mr3hknyp','comp-mr38xqqs','comp-mr3axlxx','comp-mr3fzskh1','comp-mr3ifogb','comp-mr3iatty']) {
  const re = new RegExp(`#${id}[^{]*\\{[^}]{0,800}`, 'g');
  const hits = css.match(re) || [];
  const colorish = hits.filter(s => /rgb|--bg|#|color|burgundy|purple|maroon|6b|5a|4a|8b|7a|9a/i.test(s));
  console.log('\nCSS color hits', id, colorish.length);
  colorish.slice(0,2).forEach(s => console.log(s.slice(0,400)));
}

// Search content-replacements about path handlers
const cr = fs.readFileSync('public/js/content-replacements.js','utf8');
const aboutFns = [];
let i = 0;
while ((i = cr.indexOf('/about', i)) >= 0) {
  aboutFns.push(cr.slice(Math.max(0,i-80), i+120).replace(/\s+/g,' '));
  i++;
  if (aboutFns.length > 30) break;
}
console.log('\ncontent-replacements /about refs:', aboutFns.length);
aboutFns.slice(0,15).forEach(s => console.log(' ', s));

// Find applyAbout or similar
for (const name of ['About','whatWeBuild','brandCard','Originals','Films','comp-mr3h']) {
  const c = (cr.match(new RegExp(name, 'g'))||[]).length;
  console.log('CR count', name, c);
}
