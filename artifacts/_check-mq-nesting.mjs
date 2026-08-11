import fs from 'fs';

const css = fs.readFileSync('public/css/tsc-responsive.css', 'utf8');
const needle = 'body[data-page="academy"] :is(#comp-mqwhzev1';
const idx = css.indexOf(needle);
console.log('idx', idx);

let depth = 0;
let lastMedia = null;
for (let i = 0; i < idx; i++) {
  if (css.startsWith('@media', i)) {
    const end = css.indexOf('{', i);
    lastMedia = {
      header: css.slice(i, end).replace(/\s+/g, ' ').trim(),
      depthBefore: depth,
    };
  }
  if (css[i] === '{') depth++;
  if (css[i] === '}') depth--;
}
console.log('depth at rule', depth);
console.log('last media', lastMedia);

// Find all rules mentioning mqwhzev1
let pos = 0;
while (true) {
  const i = css.indexOf('mqwhzev1', pos);
  if (i < 0) break;
  const start = Math.max(0, i - 80);
  const end = Math.min(css.length, i + 120);
  console.log('---', i, JSON.stringify(css.slice(start, end).replace(/\s+/g, ' ')));
  pos = i + 1;
}
