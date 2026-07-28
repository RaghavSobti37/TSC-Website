const fs = require('fs');
const path = require('path');

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['assets', 'mirror', 'site'].includes(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.html$/i.test(ent.name)) out.push(p);
  }
  return out;
}

const buttons = [];
for (const f of walk('public/pages')) {
  const h = fs.readFileSync(f, 'utf8');
  let idx = 0;
  while ((idx = h.indexOf('Book an Artist', idx)) >= 0) {
    const lastScript = h.lastIndexOf('<script', idx);
    const lastScriptEnd = h.lastIndexOf('</script>', idx);
    if (lastScript > lastScriptEnd) { idx += 1; continue; }
    // find enclosing a/button
    const aStart = h.lastIndexOf('<a', idx);
    const btnStart = h.lastIndexOf('<button', idx);
    const start = Math.max(aStart, btnStart);
    if (start < 0 || idx - start > 600) { idx += 1; continue; }
    const end = h.indexOf('>', start);
    const open = h.slice(start, end + 1);
    const isBtn = /wixui-button|buttonContent|aria-label="Book an Artist"/i.test(open);
    if (isBtn) {
      buttons.push({
        file: path.basename(f),
        id: (open.match(/\sid="([^"]+)"/) || [])[1] || '',
        open: open.replace(/\s+/g, ' ').slice(0, 200),
      });
    }
    idx += 1;
  }
}

console.log('Book an Artist CTA buttons in markup:', buttons.length);
buttons.forEach((b) => console.log('-', b.file, b.id, b.open));

const hideCss = [
  'public/css/tsc-responsive.css',
  'public/css/tsc-nav-overrides.css',
  'public/css/mobile/home.css',
];
for (const f of hideCss) {
  const c = fs.readFileSync(f, 'utf8');
  const ok = /#comp-mrgdw3wu[\s\S]{0,200}?display:\s*none\s*!important/.test(c);
  console.log(f, ok ? 'HIDES' : 'MISSING');
}

// sticky FAB still learn-only
const comps = fs.readFileSync('public/js/tsc-components.js', 'utf8');
console.log('sticky learn-only:', /if \(!isLearnStickyPage\(path\)\) return/.test(comps));
console.log('no Book an Artist sticky inject:', !/Book an Artist<\/a>/.test(comps) && comps.includes('Book a Call'));
