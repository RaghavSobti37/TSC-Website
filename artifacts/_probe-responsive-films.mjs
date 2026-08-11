import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(join(root, 'public/css/tsc-responsive.css'), 'utf8');

// dump films num/dup block
const start = css.indexOf('#comp-mqmhowf1');
console.log('=== FILMS DUP/NUM BLOCK ===');
console.log(css.slice(start, start + 2500));

// about hero MQ context with better window
const needle = 'body[data-page="about"] #comp-mp2vlkbh2';
let i = 0, n = 0;
console.log('\n=== ABOUT HERO MQ (800 char pre) ===');
while ((i = css.indexOf(needle, i)) !== -1 && n < 6) {
  const pre = css.slice(Math.max(0, i - 800), i);
  const opens = [...pre.matchAll(/@media[^{]+\{/g)];
  const closes = [...pre.matchAll(/^\}\s*$/gm)];
  console.log(n, 'offset', i);
  console.log('  last @media open:', (opens[opens.length - 1] || ['(none)'])[0].trim().slice(0, 100));
  // brace depth from file start is expensive — instead find nearest min-width before
  const nearby = pre.match(/@media[^{]+\{[\s\S]*$/);
  if (nearby) {
    const frag = nearby[0];
    let depth = 0;
    for (const ch of frag) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
    console.log('  depth from last @media:', depth);
  }
  i += needle.length;
  n++;
}

// film focus / Faith Communities CSS
console.log('\nFaith Communities CSS:', css.includes('Faith Communities'));
console.log('mqmk8hzp:', css.includes('mqmk8hzp'));
console.log('film-hover-blend still present:', css.includes('--blendMode: normal'));
console.log('cache comment film-hover:', css.includes('film-hover'));
