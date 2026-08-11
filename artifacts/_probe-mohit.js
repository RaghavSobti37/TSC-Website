const fs = require('fs');
const paths = [
  'public/pages/artists.html',
  'public/artists/index.html'
];
for (const p of paths) {
  const h = fs.readFileSync(p, 'utf8');
  console.log('\n===', p, '===');
  console.log('Mohit text:', (h.match(/Mohit[^<\n]{0,50}/gi) || []).slice(0, 10));
  const re = /id="(comp-mqutenq[^"]*)"/g;
  let m;
  const found = [];
  while ((m = re.exec(h))) found.push(m[1]);
  console.log('DOM ids mqutenq:', found);
  console.log('mqutenq mentions:', (h.match(/mqutenq/g) || []).length);
  // third card siblings near Yugm
  const y = h.indexOf('comp-mqtq8rsp');
  console.log('yugm root idx', y);
  if (y >= 0) console.log(h.slice(y, y + 500).replace(/\s+/g, ' ').slice(0, 400));
}
