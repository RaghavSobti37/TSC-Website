'use strict';

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'public', 'pages');
const targets = ['artist-query', 'book-a-call', 'book-an-artist', 'collab-query'];

for (const slug of targets) {
  const file = path.join(pagesDir, `${slug}.html`);
  const html = fs.readFileSync(file, 'utf8');
  const marker = '<script data-tsc-fetch-guard>';
  const start = html.indexOf(marker);
  if (start === -1) {
    console.log(`${slug}: no guard found`);
    continue;
  }
  const end = html.indexOf('</script>', start);
  if (end === -1) {
    console.log(`${slug}: guard end not found`);
    continue;
  }
  const after = html.slice(end + '</script>'.length);
  const out = html.slice(0, start) + after.replace(/^\r?\n/, '');
  fs.writeFileSync(file, out);
  console.log(`${slug}: stripped broken guard`);
}
