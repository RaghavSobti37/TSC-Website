const fs = require('fs');
const a = fs.readFileSync('public/pages/academy.html', 'utf8');

// Find heart Know More as anchor
function findButton(idHint) {
  const idx = a.indexOf(idHint);
  if (idx < 0) return null;
  return a.slice(idx, idx + 600).replace(/\s+/g, ' ');
}

// Heart Know More button id from earlier patterns - search near heart section
const heartKm = [...a.matchAll(/id="(comp-[^"]+)"[^>]{0,120}aria-label="Know More/g)];
console.log('Know More buttons:', heartKm.map((m) => m[1]));
heartKm.forEach((m) => {
  const id = m[1];
  const i = a.indexOf(`id="${id}"`);
  console.log('\n', id, a.slice(i, i + 450).replace(/\s+/g, ' '));
});

// Image links for courses
const courseImgs = [...a.matchAll(/href="(\/(?:the-heart|roots|music)[^"]*)"[^>]{0,80}class="YX2qkL"/g)];
console.log('\ncourse image hrefs', courseImgs.map((m) => m[1]));

// Coming Soon near luca
const cs = a.indexOf('Coming Soon');
console.log('\nComing Soon context', a.slice(cs - 200, cs + 100).replace(/\s+/g, ' '));
