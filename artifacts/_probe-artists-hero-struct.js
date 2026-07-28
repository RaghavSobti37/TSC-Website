const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');

// Extract hero section HTML more carefully - find section start to next section
const start = h.indexOf('id="comp-mq6d6age"');
const next = h.indexOf('id="comp-mqtluqyy"');
const hero = h.slice(start, next);
console.log('hero len', hero.length);

// Get all comp ids with nearby text
const parts = hero.split(/id="(comp-[a-z0-9]+)"/);
for (let i = 1; i < parts.length; i += 2) {
  const id = parts[i];
  const chunk = parts[i + 1].slice(0, 600);
  const text = chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
  const label = (chunk.match(/data-testid="stylablebutton-label"[^>]*>([^<]*)</) || [])[1];
  const aria = (chunk.match(/aria-label="([^"]+)"/) || [])[1];
  const testid = (chunk.match(/data-testid="([^"]+)"/) || [])[1];
  console.log(id, '|', testid || '', '|', (label || aria || text || '').slice(0, 100));
}

// torn paper / vector / image near bottom of hero
const imgs = [...hero.matchAll(/src="([^"]+)"/g)].map(m => m[1]).slice(0, 20);
console.log('\nimgs', imgs);
const vectors = [...hero.matchAll(/vector|torn|edge|svg|mask/gi)].slice(0, 10);
console.log('vector hits', vectors.length);

// Check CSS for hero layout
const css = fs.readFileSync('public/css/pages/artists.css', 'utf8');
for (const id of ['comp-mq6d6age','comp-mquw2yp8','comp-mqtlidtz','comp-mqtljrd2','comp-mqtlkwo0','comp-mquw4grq','comp-mquvv9nj','comp-mquvy98g']) {
  const re = new RegExp('#' + id + '\\{[^}]{0,400}\\}', 'g');
  const m = css.match(re);
  console.log('\nCSS', id, m ? m[0].slice(0, 350) : 'NONE');
}
