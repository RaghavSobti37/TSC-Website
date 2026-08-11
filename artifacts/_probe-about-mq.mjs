import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const css = fs.readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'public/css/tsc-responsive.css'), 'utf8');

function mqAt(offset) {
  let depth = 0;
  let lastMedia = null;
  let i = 0;
  while (i < offset) {
    if (css.startsWith('@media', i)) {
      const end = css.indexOf('{', i);
      lastMedia = { at: i, text: css.slice(i, end).trim(), depthBefore: depth };
      i = end;
      continue;
    }
    const ch = css[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (lastMedia && depth === lastMedia.depthBefore) lastMedia = null;
    }
    i++;
  }
  return lastMedia;
}

const needle = 'body[data-page="about"] #comp-mp2vlkbh2';
let idx = 0;
let n = 0;
while ((idx = css.indexOf(needle, idx)) !== -1 && n < 10) {
  const m = mqAt(idx);
  console.log(n, 'offset', idx, '→', m ? m.text : '(TOP LEVEL)');
  idx += needle.length;
  n++;
}

// also check first films fix is top-level (good)
const f = css.indexOf('#comp-mqmhowf1');
console.log('films dup hide MQ:', mqAt(f) ? mqAt(f).text : '(TOP LEVEL)');
