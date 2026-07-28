const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

// Find mobile media queries that touch card widths
const mediaRe = /@media[^{]+\{/g;
let m;
const medias = [];
while ((m = mediaRe.exec(css))) {
  medias.push({ i: m.index, head: m[0].slice(0, 120) });
}
console.log('media count', medias.length);
console.log(medias.filter((x) => /max-width:\s*(750|1000|980|900|480|420)/.test(x.head)).slice(0, 20));

// Search for mpbfryng inside media blocks near max-width 750
const needle = 'comp-mpbfryng';
let idx = 0;
let n = 0;
while ((idx = css.indexOf(needle, idx)) !== -1 && n < 8) {
  const before = css.slice(Math.max(0, idx - 200), idx);
  const mediaBefore = before.lastIndexOf('@media');
  console.log('\nHIT', n, 'at', idx, 'prevMedia:', mediaBefore >= 0 ? before.slice(mediaBefore, mediaBefore + 80) : 'none');
  console.log(css.slice(idx, idx + 280).replace(/\s+/g, ' '));
  idx += needle.length;
  n++;
}

// Blog cards widths
for (const id of ['comp-mrdq81q0', 'comp-mrdq85ob', 'comp-mrdpew4h', 'comp-mrdpqawy']) {
  const i = css.indexOf('#' + id + '{');
  console.log('\n#' + id, i);
  if (i >= 0) console.log(css.slice(i, i + 350).replace(/\s+/g, ' '));
}
