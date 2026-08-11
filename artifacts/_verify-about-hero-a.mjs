/**
 * Verify About hero A: desktop MQ scoping + mobile CSS presence + key IDs in HTML.
 */
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(join(root, 'public/css/tsc-responsive.css'), 'utf8');
const mobile = fs.readFileSync(join(root, 'public/css/mobile/about.css'), 'utf8');
const about = fs.readFileSync(join(root, 'public/about/index.html'), 'utf8');
const hover = css.includes('--blendMode: normal') && /film-hover|tsc-film-report-card:hover/.test(css);

function mqAt(offset) {
  let depth = 0;
  let lastMedia = null;
  let i = 0;
  while (i < offset) {
    if (css.startsWith('@media', i)) {
      const end = css.indexOf('{', i);
      lastMedia = { text: css.slice(i, end).trim(), depthBefore: depth };
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

const fail = [];
const needle = 'body[data-page="about"] #comp-mp2vlkbh2';
let idx = 0;
let desktopN = 0;
let mobileN = 0;
let topN = 0;
while ((idx = css.indexOf(needle, idx)) !== -1) {
  const m = mqAt(idx);
  const t = m ? m.text : '(TOP)';
  if (/min-width:\s*1025px/.test(t)) desktopN++;
  else if (/max-width:\s*1024px/.test(t)) mobileN++;
  else topN++;
  idx += needle.length;
}

if (desktopN < 1) fail.push('no about hero rules under min-width:1025px');
if (mobileN < 1) fail.push('no about hero rules under max-width:1024px');
if (topN > 0) fail.push(`about hero rules at top-level (bleed risk): ${topN}`);

for (const id of ['comp-mp2vlkbh2', 'comp-mr1ttkgk', 'comp-mr1tvuqc', 'comp-mr1tv44l', 'comp-mr1vbgc2']) {
  if (!about.includes(id)) fail.push(`about html missing ${id}`);
}
if (!/SHAKTI|Shakti/.test(about)) fail.push('about html missing SHAKTI brand');
if (!mobile.includes('THE SHAKTI') && !mobile.includes('About hero mobile')) {
  fail.push('mobile about.css missing hero section');
}
if (!/max-width:\s*1024px/.test(mobile) && !mobile.includes('@media')) {
  fail.push('mobile about.css not media-scoped');
}
if (!hover) fail.push('D hover blend rules missing from tsc-responsive');

console.log(JSON.stringify({ desktopN, mobileN, topN, hover }, null, 2));
if (fail.length) {
  console.error('FAIL', fail);
  process.exit(1);
}
console.log('PASS A + D preserved');
