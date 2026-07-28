const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['assets', 'mirror', 'site', 'node_modules'].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.html$/i.test(ent.name)) out.push(p);
  }
  return out;
}

for (const f of walk('public/pages')) {
  const h = fs.readFileSync(f, 'utf8');
  const re = /<(a|button)\b[^>]{0,900}?>/gi;
  let m;
  while ((m = re.exec(h))) {
    const tag = m[0];
    if (/href="\/book-an-artist"/i.test(tag) || /aria-label="Book an Artist"/i.test(tag)) {
      // skip if inside JSON script blocks roughly by checking nearby for viewer-model
      const before = h.slice(Math.max(0, m.index - 40), m.index);
      if (before.includes('application/json')) continue;
      console.log(path.basename(f), tag.replace(/\s+/g, ' ').slice(0, 240));
    }
  }
}

// Check if tsc-responsive is linked from home
const home = fs.readFileSync('public/pages/home.html', 'utf8');
for (const s of ['tsc-responsive', 'tsc-mobile-system', 'tsc-components', 'mobile/home']) {
  console.log('home has', s, home.includes(s));
}

// artists CTA
const art = fs.readFileSync('public/pages/artists.html', 'utf8');
const labelRe = /data-testid="stylablebutton-label"[^>]*>([^<]+)</gi;
let lm;
while ((lm = labelRe.exec(art))) {
  const t = lm[1].replace(/\s+/g, ' ').trim();
  if (/book|partner|artist|collab/i.test(t)) console.log('artists btn label:', t);
}
