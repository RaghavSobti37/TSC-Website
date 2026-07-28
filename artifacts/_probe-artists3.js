const fs = require('fs');

function extractRule(css, id) {
  const needle = '#' + id + '{';
  const i = css.indexOf(needle);
  if (i < 0) {
    const alt = '.' + id + '{';
    const j = css.indexOf(alt);
    if (j < 0) return null;
    return css.slice(j, j + 350);
  }
  return css.slice(i, i + 350);
}

const artists = fs.readFileSync('public/css/pages/artists.css', 'utf8');
const path = fs.readFileSync('public/css/pages/artist-path.css', 'utf8');
const harshad = fs.readFileSync('public/css/pages/harshad-duhita.css', 'utf8');
const yugm = fs.readFileSync('public/css/pages/yugm.css', 'utf8');

const artistIds = [
  'comp-mq6d6age', 'comp-mqtluqyy', 'comp-mqtngf8m', 'comp-mqtnpars',
  'comp-mqtlv8da', 'comp-mqtlxa1z', 'comp-mqtlkwo0', 'comp-mqtljrd2',
  'comp-mquw4grq', 'comp-mquvv9nj', 'comp-mquvy98g',
  'comp-mqtm2h1x', 'comp-mqtly32w', 'comp-mqtm6aka', 'comp-mrsyisbw',
  // find more what-we-do cards
  'comp-mqtops1z', 'comp-mqtoxvyf', 'comp-mqtoxvyb',
  'comp-mqtpn27i', 'comp-mqtq8rsp', 'comp-mqutenq5',
  'comp-mqtluqyy-container', 'comp-mqtngf8m-container', 'comp-mqtnpars-container'
];

console.log('=== ARTISTS ===');
for (const id of artistIds) {
  const r = extractRule(artists, id);
  if (r) console.log('\n', r.replace(/\s+/g, ' ').slice(0, 280));
}

// Find all comps with width ~25-35% in what we do section vicinity
const ww = [...artists.matchAll(/#(comp-mqt[a-z0-9]+)\{[^}]{0,200}width:3[0-9]\.[0-9]+%/g)];
console.log('\n~30% width comps', ww.map((m) => m[1] + ' ' + m[0].slice(0, 80)));

const ww2 = [...artists.matchAll(/#(comp-mqt[a-z0-9]+)\{[^}]{0,200}width:2[0-9]\.[0-9]+%/g)];
console.log('\n~20% width comps', ww2.map((m) => m[1]).slice(0, 30));

console.log('\n=== ARTIST PATH glance cards ===');
const glance = [...path.matchAll(/#(comp-mqpa[a-z0-9]+)\{[^}]{0,250}/g)].slice(0, 15);
glance.forEach((m) => console.log(m[0].replace(/\s+/g, ' ').slice(0, 200)));

const pathIds = ['comp-mqp44656', 'comp-mqp9ymcj', 'comp-mqrzoh2l', 'comp-mqph76vq', 'comp-mqpigrr6', 'comp-mqpa1hg0'];
for (const id of pathIds) {
  const r = extractRule(path, id);
  if (r) console.log('\n', r.replace(/\s+/g, ' ').slice(0, 250));
}

console.log('\n=== HARSHAD ===');
for (const id of ['comp-mq6h99jp', 'comp-mqffd5wc', 'comp-mq7lr7m2', 'comp-mq6ig1tw', 'comp-mq7r4iw7', 'comp-mq7z6hk6', 'comp-mq84m6ve']) {
  const r = extractRule(harshad, id);
  if (r) console.log('\n', r.replace(/\s+/g, ' ').slice(0, 220));
}

console.log('\n=== YUGM ===');
for (const id of ['comp-mqhqa6vo', 'comp-mqhqa6yo', 'comp-mqhqa6zr', 'comp-mqjigv1b', 'comp-mqhqa72r', 'comp-mqhqa74u', 'comp-mqhqa75y']) {
  const r = extractRule(yugm, id);
  if (r) console.log('\n', r.replace(/\s+/g, ' ').slice(0, 220));
}
