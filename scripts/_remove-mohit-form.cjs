const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'pages', 'book-an-artist.html');
let html = fs.readFileSync(file, 'utf8');
const needle = 'aria-label="Mohit Shankar"';
const at = html.indexOf(needle);
if (at < 0) {
  console.log('already gone');
  process.exit(0);
}
// Walk back to the outer siroRCe option wrapper
const open = html.lastIndexOf('<div class="siroRCe', at);
if (open < 0) {
  console.error('open not found');
  process.exit(1);
}
let i = open;
let depth = 0;
let end = -1;
while (i < html.length) {
  const nextOpen = html.indexOf('<div', i);
  const nextClose = html.indexOf('</div>', i);
  if (nextClose < 0) break;
  if (nextOpen >= 0 && nextOpen < nextClose) {
    depth += 1;
    i = nextOpen + 4;
  } else {
    depth -= 1;
    i = nextClose + 6;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}
if (end < 0) {
  console.error('end not found');
  process.exit(1);
}
const removed = html.slice(open, end);
console.log('removing', removed.length, 'chars:', removed.replace(/\s+/g, ' ').slice(0, 120));
html = html.slice(0, open) + html.slice(end);
fs.writeFileSync(file, html);
console.log('remaining Mohit', /Mohit Shankar/i.test(html));
