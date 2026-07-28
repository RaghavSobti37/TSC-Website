const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');
const css = fs.readFileSync('public/css/pages/artists.css', 'utf8');
const s = h.indexOf('id="comp-mqutig8q"');
const slice = h.slice(s, s + 30000);
const texts = [...slice.matchAll(/>([A-Za-z&][^<]{2,100})</g)]
  .map((m) => m[1].replace(/&amp;/g, '&').replace(/&rsquo;/g, "'").trim())
  .filter((t, i, a) => a.indexOf(t) === i && t.length < 100);
console.log(texts.join('\n'));

for (const id of [
  'comp-mqtpn27q5',
  'comp-mqtq8rsw7',
  'comp-mqutenqc3',
  'comp-mqtpn27o',
  'comp-mqtq8rsr5',
  'comp-mqutenqa',
  'comp-mqtpn27x',
  'comp-mqtq8rt05',
  'comp-mqutenqg1',
]) {
  const needle = '#' + id + '{';
  let idx = css.indexOf(needle);
  console.log('\n', id, idx);
  if (idx >= 0) console.log(css.slice(idx, idx + 320).replace(/\s+/g, ' '));
}

// third card image id
for (const id of ['comp-mqtpn27i', 'comp-mqtq8rsp', 'comp-mqutenq5']) {
  const i = slice.indexOf(`id="${id}"`);
  const ids = [...slice.slice(i, i + 2500).matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
  console.log('\n', id, 'children', ids.slice(0, 12).join(', '));
}
