const fs = require('fs');
const h = fs.readFileSync('public/pages/artist-path.html', 'utf8');
for (const t of ['India is one', 'Build audiences', 'Program at a Glance', 'DURATION', 'FORMAT', 'APPLY NOW', 'ENROLL']) {
  const i = h.indexOf(t);
  console.log(t, i < 0 ? 'MISSING' : [...h.slice(Math.max(0,i-700), i+100).matchAll(/id="(comp-[a-z0-9]+)"/g)].map(m=>m[1]).slice(-8).join(', '));
}

// collab query structure
const c = fs.readFileSync('public/pages/collab-query.html', 'utf8');
for (const t of ['Brand', 'Artist', 'Who', 'collaborat', 'Partner']) {
  const i = c.toLowerCase().indexOf(t.toLowerCase());
  if (i>=0) console.log('collab', t, [...c.slice(Math.max(0,i-500), i+80).matchAll(/id="(comp-[a-z0-9]+)"/g)].map(m=>m[1]).slice(-6).join(', '));
}

// book-an-artist form mount target
const b = fs.readFileSync('public/pages/book-an-artist.html', 'utf8');
console.log('book has forms.js', b.includes('forms.js'));
console.log('book section', [...b.matchAll(/id="(comp-mrx[^"]+)"/g)].map(m=>m[1]).slice(0,15));
