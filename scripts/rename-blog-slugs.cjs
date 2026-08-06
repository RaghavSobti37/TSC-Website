/**
 * Rename start-making-music/2/3 → semantic slugs; update maps + keep old redirects.
 * start-making-music → start-making-music
 * online-music-course-worth-it → online-music-course-worth-it
 * artist-release-playbook → artist-release-playbook
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const RENAMES = [
  { from: 'start-making-music', to: 'start-making-music', title: 'How Do I Start Making Music If I Have No Experience?' },
  { from: 'online-music-course-worth-it', to: 'online-music-course-worth-it', title: 'Is an Online Music Course Worth It for Beginners?' },
  { from: 'artist-release-playbook', to: 'artist-release-playbook', title: 'The Artist Release Playbook' },
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'assets' && dir.endsWith('public')) {
        // still walk assets/pages but skip huge mirror
        if (p.includes(`${path.sep}assets${path.sep}mirror`)) continue;
      }
      if (p.includes(`${path.sep}assets${path.sep}mirror`)) continue;
      walk(p, acc);
    } else {
      acc.push(p);
    }
  }
  return acc;
}

function renamePath(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) {
    fs.rmSync(to, { recursive: true, force: true });
  }
  fs.renameSync(from, to);
  return true;
}

function replaceInFile(file, pairs) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [a, b] of pairs) {
    if (text.includes(a)) {
      text = text.split(a).join(b);
      changed = true;
    }
  }
  if (changed) fs.writeFileSync(file, text);
  return changed;
}

// 1) Physical renames
const physical = [
  ['public/pages/start-making-music.html', 'public/pages/start-making-music.html'],
  ['public/pages/online-music-course-worth-it.html', 'public/pages/online-music-course-worth-it.html'],
  ['public/pages/artist-release-playbook.html', 'public/pages/artist-release-playbook.html'],
  ['public/js/pages/start-making-music.animations.js', 'public/js/pages/start-making-music.animations.js'],
  ['public/js/pages/online-music-course-worth-it.animations.js', 'public/js/pages/online-music-course-worth-it.animations.js'],
  ['public/js/pages/artist-release-playbook.animations.js', 'public/js/pages/artist-release-playbook.animations.js'],
  ['public/assets/pages/start-making-music', 'public/assets/pages/start-making-music'],
  ['public/assets/pages/online-music-course-worth-it', 'public/assets/pages/online-music-course-worth-it'],
  ['public/assets/pages/artist-release-playbook', 'public/assets/pages/artist-release-playbook'],
  ['public/start-making-music', 'public/start-making-music'],
  ['public/online-music-course-worth-it', 'public/online-music-course-worth-it'],
  ['public/artist-release-playbook', 'public/artist-release-playbook'],
  ['public/resources/start-making-music', 'public/resources/start-making-music'],
  ['public/resources/online-music-course-worth-it', 'public/resources/online-music-course-worth-it'],
  ['public/resources/artist-release-playbook', 'public/resources/artist-release-playbook'],
  ['public/site/resources/articles/start-making-music', 'public/site/resources/articles/start-making-music'],
  ['public/site/resources/articles/online-music-course-worth-it', 'public/site/resources/articles/online-music-course-worth-it'],
  ['public/site/resources/articles/artist-release-playbook', 'public/site/resources/articles/artist-release-playbook'],
];

let renamed = 0;
for (const [a, b] of physical) {
  if (renamePath(a, b)) {
    renamed++;
    console.log('renamed', a, '→', b);
  }
}

// stub redirects for old blog-* paths
for (const { from, to } of RENAMES) {
  for (const base of [`public/${from}`, `public/resources/${from}`]) {
    const dir = path.join(root, base);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=/${to}"><script>location.replace("/${to}"+location.search+location.hash);</script><title>Redirect</title></head><body><a href="/${to}">Open /${to}</a></body></html>\n`
    );
  }
}

// 2) Text replacements across project (skip mirror + node_modules)
const pairs = [];
// longest first
for (const { from, to } of RENAMES) {
  pairs.push([`/resources/${from}`, `/resources/${to}`]);
  pairs.push([`/pages/${from}.html`, `/pages/${to}.html`]);
  pairs.push([`/${from}`, `/${to}`]);
  pairs.push([`${from}.html`, `${to}.html`]);
  pairs.push([`${from}.animations.js`, `${to}.animations.js`]);
  pairs.push([`'${from}'`, `'${to}'`]);
  pairs.push([`"${from}"`, `"${to}"`]);
  pairs.push([`blog-${from.replace('blog-', '')}`, to]); // safety no-op for already mapped
}

// Fix blank/work aliases that pointed at blog-N — already covered by /blog-N → /new

const textExt = new Set(['.js', '.cjs', '.mjs', '.html', '.json', '.xml', '.md', '.css', '.txt']);
const files = walk(root).filter((f) => {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  if (rel.startsWith('node_modules/')) return false;
  if (rel.includes('/assets/mirror/')) return false;
  if (rel.startsWith('artifacts/')) return false;
  return textExt.has(path.extname(f));
});

let fileCount = 0;
for (const file of files) {
  if (replaceInFile(file, pairs)) fileCount++;
}

// 3) Patch vercel.json redirects: blank-* → new slugs; keep blog-* → new as permanent redirects
const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

function setRewrite(source, destination) {
  const existing = vercel.rewrites.find((r) => r.source === source);
  if (existing) existing.destination = destination;
  else vercel.rewrites.unshift({ source, destination });
}

function setRedirect(source, destination) {
  const existing = vercel.redirects.find((r) => r.source === source);
  if (existing) existing.destination = destination;
  else vercel.redirects.push({ source, destination, permanent: true });
}

for (const { from, to } of RENAMES) {
  setRewrite(`/${to}`, `/pages/${to}.html`);
  setRewrite(`/resources/${to}`, `/pages/${to}.html`);
  setRedirect(`/${from}`, `/${to}`);
  setRedirect(`/resources/${from}`, `/${to}`);
}

// Update blank-13* redirects that still say blog-N
for (const r of vercel.redirects) {
  for (const { from, to } of RENAMES) {
    if (r.destination === `/${from}`) r.destination = `/${to}`;
  }
}

fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n');

console.log(JSON.stringify({ renamed, filesUpdated: fileCount, slugs: RENAMES.map((r) => r.to) }, null, 2));
