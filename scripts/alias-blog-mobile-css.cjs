#!/usr/bin/env node
/** Alias semantic blog data-page attrs to blog-N so mobile/resources.css rules apply. */
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'public', 'css', 'mobile', 'resources.css');
let css = fs.readFileSync(file, 'utf8');
const pairs = [
  ['blog-1', 'start-making-music'],
  ['blog-2', 'online-music-course-worth-it'],
  ['blog-3', 'artist-release-playbook'],
];

// For each selector containing body[data-page="blog-N"], also emit body[data-page="semantic"]
for (const [oldP, neu] of pairs) {
  const re = new RegExp(`body\\[data-page="${oldP}"\\]`, 'g');
  // Avoid double-patching
  if (css.includes(`body[data-page="${neu}"]`)) {
    console.log('already has', neu);
    continue;
  }
  css = css.replace(re, `body[data-page="${oldP}"],\n  body[data-page="${neu}"]`);
  console.log('aliased', oldP, '→', neu);
}

fs.writeFileSync(file, css);
console.log('wrote', file);
