/**
 * Remove Mohit Shankar roster card (comp-mqutenq5) from artists.html.
 * Leaves Harshad + Yugm cards intact.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '..', 'public', 'pages', 'artists.html');
let html = fs.readFileSync(file, 'utf8');

const id = 'comp-mqutenq5';
const needle = `id="${id}"`;
const idAt = html.indexOf(needle);
if (idAt < 0) {
  console.log('Mohit card already gone');
  process.exit(0);
}

// Walk back to the opening <!--$--> or <div of this card
let start = html.lastIndexOf('<!--$-->', idAt);
if (start < 0 || idAt - start > 80) {
  start = html.lastIndexOf('<div', idAt);
}
if (start < 0) {
  console.error('Could not find card start');
  process.exit(1);
}

// Find matching close of outer div by depth counting from the <div that contains the id
const divStart = html.lastIndexOf('<div', idAt);
let i = divStart;
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
  console.error('Could not find card end');
  process.exit(1);
}

// Include trailing <!--/$--> if present
let sliceEnd = end;
const trail = html.slice(end, end + 12);
if (trail.startsWith('<!--/$-->')) sliceEnd = end + 9;

const removed = html.slice(start, sliceEnd);
console.log('Removing', removed.length, 'chars starting:', removed.slice(0, 120).replace(/\s+/g, ' '));
html = html.slice(0, start) + html.slice(sliceEnd);

// Also strip any leftover Mohit comment fragments / CSS ids still referencing empty shell in inline styles is ok
fs.writeFileSync(file, html);
console.log('Wrote', file);
console.log('Remaining mqutenq5:', html.includes('comp-mqutenq5'));
console.log('Remaining Mohit Shankar text:', /Mohit Shankar/i.test(html));
