const fs = require('fs');
const h = fs.readFileSync('public/pages/work.html', 'utf8');
// Find rich text near OUR WORK / Building platforms
const snippets = [
  'OUR WORK',
  'Building platforms',
  'Whether through brand',
  'Selected Work',
  'Main Bhi Artist',
  'Havells',
  'The Young Gunns',
  'Insta Music'
];
for (const s of snippets) {
  const i = h.indexOf(s);
  if (i < 0) { console.log(s, 'NOT FOUND'); continue; }
  const chunk = h.slice(Math.max(0, i - 400), i + 80);
  const id = (chunk.match(/id="(comp-[^"]+)"/g) || []).slice(-3);
  console.log('\n---', s, '---');
  console.log(id.join(' | '));
}
