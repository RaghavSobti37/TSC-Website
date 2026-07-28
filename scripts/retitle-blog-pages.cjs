#!/usr/bin/env node
const fs = require('fs');

const pairs = [
  {
    file: 'public/pages/start-making-music.html',
    oldNum: '1',
    newTitle: 'How Do I Start Making Music If I Have No Experience?',
    slug: 'start-making-music',
  },
  {
    file: 'public/pages/online-music-course-worth-it.html',
    oldNum: '2',
    newTitle: 'Is an Online Music Course Worth It for Beginners?',
    slug: 'online-music-course-worth-it',
  },
  {
    file: 'public/pages/artist-release-playbook.html',
    oldNum: '3',
    newTitle: 'The Artist Release Playbook',
    slug: 'artist-release-playbook',
  },
];

for (const p of pairs) {
  let s = fs.readFileSync(p.file, 'utf8');
  const oldTitle = `Blog ${p.oldNum}`;
  s = s.split(`${oldTitle} | TSC`).join(`${p.newTitle} | TSC`);
  s = s.split(`>${oldTitle}<`).join(`>${p.newTitle}<`);
  s = s.split(`/blog-${p.oldNum}`).join(`/${p.slug}`);
  s = s.split(`blog-${p.oldNum}.css`).join(`${p.slug}.css`);
  s = s.split(`data-tsc-page-style="blog-${p.oldNum}"`).join(`data-tsc-page-style="${p.slug}"`);
  fs.writeFileSync(p.file, s);
  console.log('retitled', p.slug);
}
