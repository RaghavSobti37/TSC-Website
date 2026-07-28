const fs = require('fs');

function sniffKnowMore(file, sectionId) {
  const a = fs.readFileSync(file, 'utf8');
  const start = a.indexOf(sectionId);
  const chunk = a.slice(start, start + 15000);
  const buttons = [...chunk.matchAll(/<(?:a|div)[^>]{0,300}(?:Know More|aria-label="Know More)[^>]{0,200}/gi)];
  console.log('\n==', file, sectionId);
  buttons.forEach((m) => console.log(m[0].slice(0, 280)));
  // also find image links
  const imgs = [...chunk.matchAll(/<a[^>]*href="([^"]*)"[^>]*>[\s\S]{0,120}?wow-image/gi)];
  console.log('image anchors', imgs.map((m) => m[1]));
}

sniffKnowMore('public/pages/academy.html', 'comp-mqwdfgsa'); // heart image area-ish
sniffKnowMore('public/pages/academy.html', 'comp-mpjo65q'); // heart section
sniffKnowMore('public/pages/academy.html', 'comp-mpk4wrdy'); // roots?
sniffKnowMore('public/pages/academy.html', 'comp-mpjxxeqt'); // luca

// Find heart Know More with href
const a = fs.readFileSync('public/pages/academy.html', 'utf8');
for (const label of ['the-heart-of-composition', 'roots-of-hindustani', 'Coming Soon']) {
  const re = new RegExp(`.{0,200}${label}.{0,200}`, 'gi');
  const hits = [...a.matchAll(re)].slice(0, 3);
  console.log('\nCONTEXT', label, hits.length);
  hits.forEach((h) => console.log(h[0].replace(/\s+/g, ' ').slice(0, 300)));
}

// Courses dropdown items
const menuMatch = a.match(/More Courses pages[\s\S]{0,4000}/);
const submenu = menuMatch ? menuMatch[0] : '';
const subLinks = [...submenu.matchAll(/href="([^"]+)"[^>]*>[\s\S]{0,80}?<div[^>]*label[^>]*>([^<]+)/gi)];
console.log('\nsubmenu links', subLinks.map((m) => [m[1], m[2]]));
const allSub = [...submenu.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
console.log('all submenu hrefs', [...new Set(allSub)]);
const labels = [...submenu.matchAll(/item-label[^>]*>([^<]+)/g)].map((m) => m[1]);
console.log('submenu labels', labels);
