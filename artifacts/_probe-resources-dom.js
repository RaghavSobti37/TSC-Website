const fs = require('fs');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

function around(str, needle, before = 400, after = 600) {
  const i = str.indexOf(needle);
  if (i < 0) return null;
  return str.slice(Math.max(0, i - before), i + after);
}

// Find repeater parent for tool cards
const wave = around(h, 'Waveform Free', 1200, 200);
const ids = [...wave.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
console.log('IDs near Waveform:', ids);

// Find grid layout for repeater items
const cardCss = around(css, 'comp-mpbii8ur__', 50, 800);
console.log('\nCard CSS snippet:', cardCss && cardCss.replace(/\s+/g, ' ').slice(0, 700));

// Look for parent repeater / mesh grid
for (const k of ['comp-mpbii8t', 'comp-mpbi', 'Repeater', 'comp-mparh5e63', 'comp-mparh5cz']) {
  const i = css.indexOf(k);
  console.log('\nCSS hit', k, i);
  if (i >= 0) console.log(css.slice(i, i + 350).replace(/\s+/g, ' '));
}

// HTML structure of tabs panel
const tabPanel = around(h, 'id="comp-mparh5e63"', 100, 900);
console.log('\nTab panel:', tabPanel && tabPanel.replace(/\s+/g, ' ').slice(0, 800));

// Blog cards section
const blog = around(h, 'id="comp-mrdp2u69"', 50, 500);
console.log('\nBlog section:', blog && blog.replace(/\s+/g, ' ').slice(0, 500));

// Title/desc free tools section parent
const free = around(h, 'id="comp-mrd4o8h8"', 800, 200);
const freeIds = [...(free || '').matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
console.log('\nNear Free Tools title:', freeIds);

// Section containing free tools header
const sec = around(h, 'Free Tools &amp; Assets', 1500, 100);
const secIds = [...(sec || '').matchAll(/id="(comp-[^"]+|PAGE_[^"]+)"/g)].map((m) => m[1]);
console.log('\nSection IDs near Free Tools:', [...new Set(secIds)].slice(-20));
