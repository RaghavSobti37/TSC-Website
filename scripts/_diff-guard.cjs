'use strict';

const { execSync } = require('child_process');
const shared = require('./mirror-shared.cjs');

const orig = execSync('git show HEAD:scripts/mirror-subpages.js', { encoding: 'utf8' });
const start = orig.indexOf('const mirrorFetchPatchScript = `');
const end = orig.indexOf('`;', start);
const origTemplate = orig.slice(start + 'const mirrorFetchPatchScript = `'.length, end);
const origValue = eval('`' + origTemplate + '`'); // eslint-disable-line no-eval
const guardValue = shared.fetchGuardScript;

const a = origValue.split('\n');
const b = guardValue.split('\n');
console.log(`orig lines: ${a.length}, shared lines: ${b.length}`);
let max = Math.max(a.length, b.length);
for (let i = 0; i < max; i += 1) {
  if (a[i] !== b[i]) {
    console.log(`line ${i + 1}:`);
    console.log(`  ORIG: ${JSON.stringify(a[i])}`);
    console.log(`  SHAR: ${JSON.stringify(b[i])}`);
  }
}
