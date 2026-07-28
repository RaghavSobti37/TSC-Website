/*
 * DESKTOP LOCK (>=1025px): Restores the 9 primary pages to the exact desktop design
 * of commit faf9dea. The desktop design is LOCKED forever — do not modify it unless
 * the owner explicitly asks. Mobile work must live only behind max-width media queries.
 *
 * Usage: node scripts/restore-faf9dea-desktop.js <path-to-faf9dea-worktree>
 * The worktree is created with: git worktree add <path> faf9dea
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const refRoot = process.argv[2];
if (!refRoot || !fs.existsSync(path.join(refRoot, 'public', 'index.html'))) {
  console.error('Pass the path to a faf9dea worktree (git worktree add <path> faf9dea).');
  process.exit(1);
}

const primaryPages = [
  { route: '/', src: 'index.html', out: 'home.html' },
  { route: '/about', src: 'about/index.html', out: 'about.html' },
  { route: '/work', src: 'work/index.html', out: 'work.html' },
  { route: '/artists', src: 'artists/index.html', out: 'artists.html' },
  { route: '/artist-path', src: 'artist-path/index.html', out: 'artist-path.html' },
  { route: '/learn-with-tsc', src: 'learn-with-tsc/index.html', out: 'learn-with-tsc.html' },
  { route: '/films', src: 'films/index.html', out: 'films.html' },
  { route: '/resources', src: 'resources/index.html', out: 'resources.html' },
  { route: '/academy', src: 'academy/index.html', out: 'academy.html' },
];

for (const page of primaryPages) {
  const srcPath = path.join(refRoot, 'public', page.src);
  const outPath = path.join(publicDir, 'pages', page.out);
  const html = fs.readFileSync(srcPath, 'utf8');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`${page.route} <- faf9dea (${(html.length / 1024).toFixed(0)} KB) -> pages/${page.out}`);
}
console.log('Done. Run "node scripts/generate-subpage-shells.js" to re-normalize links.');
