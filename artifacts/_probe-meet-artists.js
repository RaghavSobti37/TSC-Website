const fs = require('fs');
const css = fs.readFileSync('public/css/pages/artists.css', 'utf8');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');

const needles = [
  'variants-mqtpn27r',
  'variants-mqtq8',
  'variants-mquten',
  'mqtpn27q5:hover',
  'mqtpn27i:hover',
  'mqutig8q:hover',
];
for (const v of needles) {
  const i = css.indexOf(v);
  console.log('\n==', v, i);
  if (i >= 0) console.log(css.slice(i, i + 600).replace(/\s+/g, ' ').slice(0, 500));
}

// all variant class names near meet section
const varMatches = [...css.matchAll(/variants-mqt[a-z0-9]+/g)].map((m) => m[0]);
console.log('\nall variants-mqt*', [...new Set(varMatches)]);

// overlay panels negative margin
const neg = [...css.matchAll(/#(comp-mqt[a-z0-9]+)\{[^}]*margin-bottom:-3[^}]*\}/g)].map((m) => m[1]);
console.log('\nneg-margin overlays', [...new Set(neg)]);

// card roots inside mqutig8q
const start = h.indexOf('id="comp-mqutig8q"');
const end = h.indexOf('id="comp-mqtnpars"', start + 1);
// section ends before next section - find end of mqutig8q area via third card
const slice = h.slice(start, start + 25000);
const cardRoots = ['comp-mqtpn27i', 'comp-mqtq8rsp', 'comp-mqutenq5'];
for (const id of cardRoots) {
  const i = slice.indexOf(`id="${id}"`);
  console.log('\nCARD', id, 'found', i >= 0);
}
// text per card
for (const needle of ['Harshad', 'Yugm', 'Learn More', 'Mahaprbhu', 'Kalki']) {
  const i = slice.indexOf(needle);
  console.log(needle, i >= 0 ? 'yes @' + i : 'no');
}

// Find hover-driven transform on overlay - search "variants-mqtpn27r" full rule blocks
let idx = 0;
while ((idx = css.indexOf('variants-mqtpn27r', idx)) >= 0) {
  console.log('\n--- variant block @', idx);
  console.log(css.slice(idx - 40, idx + 400).replace(/\s+/g, ' '));
  idx += 20;
}

// similar on yugm / third
for (const v of ['variants-mqtq8rt', 'variants-mqutenq']) {
  idx = 0;
  let n = 0;
  while ((idx = css.indexOf(v, idx)) >= 0 && n < 4) {
    console.log('\n---', v, '@', idx);
    console.log(css.slice(idx - 20, idx + 350).replace(/\s+/g, ' '));
    idx += v.length;
    n++;
  }
}

// Check work page for similar meet artists
for (const page of ['work', 'home', 'about']) {
  const p = fs.readFileSync(`public/pages/${page}.html`, 'utf8');
  console.log(page, 'Meet Our Artists?', p.includes('Meet Our Artists'), 'mqutig8q?', p.includes('mqutig8q'));
}
