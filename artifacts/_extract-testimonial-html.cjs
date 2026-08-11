const fs = require('fs');
const html = fs.readFileSync('public/pages/academy.html', 'utf8');
const start = html.indexOf('id="comp-mqwl0xfw"');
console.log('start', start);
console.log(html.slice(start, start + 500));
const secStart = html.indexOf('id="comp-mpl384rr"');
const chunk = html.slice(secStart, secStart + 25000);
for (const name of ['Shraddha Mishra', 'Deepank Soni', 'WINNER', 'Singer-Songwriter', 'item1', 'item-j9ples3e', 'item-j9plerjk']) {
  console.log(name, chunk.includes(name));
}
// third slide name
const i3 = chunk.indexOf('item-j9plerjk');
console.log('third slice', chunk.slice(i3, i3 + 1200).replace(/\s+/g, ' ').slice(0, 500));
