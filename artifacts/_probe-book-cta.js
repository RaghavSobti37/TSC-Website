const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'assets' || ent.name === 'mirror' || ent.name === 'site') continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.html$/i.test(ent.name)) out.push(p);
  }
  return out;
}

const root = path.join(__dirname, '..', 'public');
const files = walk(root);
const hits = [];

for (const file of files) {
  const h = fs.readFileSync(file, 'utf8');
  if (!/Book an Artist/i.test(h) && !/href="\/book-an-artist"/i.test(h)) continue;

  // Button-like CTAs with that label
  const btnRe = /<(a|button)\b[^>]{0,800}?(?:aria-label="([^"]*)"|id="([^"]+)")[^>]{0,800}?>[\s\S]{0,400}?Book an Artist/gi;
  let m;
  while ((m = btnRe.exec(h))) {
    hits.push({
      file: path.relative(root, file),
      tag: m[1],
      aria: m[2] || '',
      id: m[3] || '',
      snippet: m[0].replace(/\s+/g, ' ').slice(0, 220),
    });
  }

  // Also find labels in stylablebutton
  const labelRe = /data-testid="stylablebutton-label"[^>]*>\s*Book an Artist\s*</gi;
  let lm;
  while ((lm = labelRe.exec(h))) {
    const start = Math.max(0, lm.index - 300);
    const ctx = h.slice(start, lm.index + lm[0].length);
    const idMatch = ctx.match(/id="([^"]+)"/);
    hits.push({
      file: path.relative(root, file),
      kind: 'stylable-label',
      id: idMatch ? idMatch[1] : '',
      snippet: ctx.replace(/\s+/g, ' ').slice(0, 220),
    });
  }

  // href=/book-an-artist that look like buttons (wixui-button)
  const hrefRe = /<a\b[^>]*href="\/book-an-artist"[^>]*>/gi;
  let hm;
  while ((hm = hrefRe.exec(h))) {
    const tag = hm[0];
    if (/wixui-button|StylableButton|data-testid="buttonContent"|aria-label=/i.test(tag)) {
      const idMatch = tag.match(/id="([^"]+)"/);
      const aria = (tag.match(/aria-label="([^"]*)"/) || [])[1] || '';
      hits.push({
        file: path.relative(root, file),
        kind: 'href-button',
        id: idMatch ? idMatch[1] : '',
        aria,
        snippet: tag.replace(/\s+/g, ' ').slice(0, 220),
      });
    }
  }
}

console.log(JSON.stringify(hits, null, 2));
console.log('total', hits.length);

// home Who This Is For buttons
const home = fs.readFileSync(path.join(root, 'pages', 'home.html'), 'utf8');
for (const id of ['comp-mrly0a39', 'comp-mrly1hv0', 'comp-mrly1u79', 'comp-mrly2iho', 'comp-mrgdw3uq', 'comp-mrgdw3wu', 'comp-mrgdrumi', 'comp-mrgdvny2']) {
  const i = home.indexOf('id="' + id + '"');
  if (i < 0) {
    console.log(id, 'MISSING');
    continue;
  }
  // find surrounding anchor
  const slice = home.slice(Math.max(0, i - 200), i + 500);
  const aria = (slice.match(/aria-label="([^"]*)"/) || [])[1];
  const label = (slice.match(/stylablebutton-label"[^>]*>([^<]*)</) || [])[1];
  const href = (slice.match(/href="([^"]*)"/) || [])[1];
  console.log(id, { href, aria: (aria || '').replace(/\s+/g, ' ').trim(), label: (label || '').replace(/\s+/g, ' ').trim() });
}
