'use strict';

const fs = require('fs');
const { execSync } = require('child_process');

function countBs(text) {
  let n = 0;
  for (const ch of text) if (ch === '\\') n += 1;
  return n;
}

function tail(text) {
  const idx = text.indexOf('api)');
  if (idx === -1) return '(not found)';
  const chars = [];
  for (let i = idx; i < Math.min(idx + 14, text.length); i += 1) {
    const c = text[i];
    chars.push(c === '\\' ? 'BS' : c);
  }
  return chars.join('');
}

const home = fs.readFileSync('public/pages/home.html', 'utf8').split('\n').find((l) => l.includes('meghanabhawalkarwo') && l.includes('test(text)'));
console.log('home.html guard line bs:', countBs(home));
console.log('home.html tail:', tail(home));

const orig = execSync('git show HEAD:scripts/mirror-subpages.js', { encoding: 'utf8' }).split('\n').find((l) => l.includes('meghanabhawalkarwo') && l.includes('test(text)'));
console.log('git HEAD subpages line bs:', countBs(orig));
console.log('git HEAD tail:', tail(orig));

const sharedFile = fs.readFileSync('scripts/mirror-shared.cjs', 'utf8').split('\n').find((l) => l.includes('meghanabhawalkarwo') && l.includes('test(text)'));
console.log('shared file line bs:', countBs(sharedFile));
console.log('shared file tail:', tail(sharedFile));
