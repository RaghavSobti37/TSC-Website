const fs = require('fs');
const art = fs.readFileSync('public/pages/artists.html', 'utf8');
const re = /data-testid="stylablebutton-label"[^>]*>([^<]*)</gi;
let m;
while ((m = re.exec(art))) console.log('LABEL', JSON.stringify(m[1].replace(/\s+/g, ' ').trim()));
const re2 = /aria-label="([^"]+)"/gi;
while ((m = re2.exec(art))) {
  if (/book|partner|artist|collab/i.test(m[1])) console.log('ARIA', m[1]);
}
