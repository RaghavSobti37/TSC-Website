const fs = require('fs');
const path = require('path');

function contextAround(html, needle, limit = 8) {
  let i = 0, c = 0;
  while ((i = html.indexOf(needle, i)) >= 0 && c < limit) {
    console.log('---', needle, '@', i);
    console.log(html.slice(Math.max(0, i - 200), i + needle.length + 160).replace(/\s+/g, ' ').slice(0, 360));
    i += needle.length;
    c++;
  }
}

const home = fs.readFileSync('public/pages/home.html', 'utf8');
contextAround(home, 'dropdown-item" href="/book-an-artist"');
contextAround(home, 'wixui-dropdown-menu__item');

// find dropdown item text near book-an-artist
const re = /href="\/book-an-artist"[^>]*>[\s\S]{0,200}?</g;
let m;
while ((m = re.exec(home))) {
  console.log('DROPDOWN CTX', m[0].replace(/\s+/g, ' ').slice(0, 280));
}

// all pages: dropdown or menu items to book-an-artist with nearby text
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.html$/i.test(ent.name)) out.push(p);
  }
  return out;
}

console.log('\n=== ALL MENU/BUTTON HITS ===');
for (const f of walk('public/pages')) {
  const h = fs.readFileSync(f, 'utf8');
  // Find anchors to book-an-artist outside script/json
  let idx = 0;
  while ((idx = h.indexOf('href="/book-an-artist"', idx)) >= 0) {
    const start = h.lastIndexOf('<a', idx);
    const end = h.indexOf('</a>', idx);
    if (start < 0 || end < 0) { idx += 1; continue; }
    const tag = h.slice(start, end + 4);
    // skip if inside script
    const lastScript = h.lastIndexOf('<script', start);
    const lastScriptEnd = h.lastIndexOf('</script>', start);
    if (lastScript > lastScriptEnd) { idx += 1; continue; }
    const text = tag.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const classes = (tag.match(/class="([^"]*)"/) || [])[1] || '';
    const id = (tag.match(/id="([^"]*)"/) || [])[1] || '';
    console.log(path.basename(f), '|', text.slice(0, 60), '|', classes.slice(0, 80), '|', id);
    idx = end + 4;
  }
}
