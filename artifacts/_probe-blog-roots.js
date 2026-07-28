const fs = require('fs');
for (const f of ['blog-1','blog-2','blog-3']) {
  const h = fs.readFileSync(`public/pages/${f}.html`, 'utf8');
  const m = h.match(/id="([a-z0-9]{5})" class="ETqrjz/);
  const main = h.match(/id="PAGE_SECTIONS([^"]+)"/);
  console.log(f, 'root', m && m[1], 'main', main && main[1]);
}
// editorial blog already has max-width 860 — we reinforce via resources.css
console.log('editorial classes present');
