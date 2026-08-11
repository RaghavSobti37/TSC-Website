/**
 * One-shot: build public/site/** index tree, remove cryptic Wix stub folders,
 * add nested route aliases + vercel 301s. Safe to re-run (idempotent).
 *
 * Does NOT delete public/pages/*.html. Does NOT touch mobile CSS/JS.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const siteDir = path.join(publicDir, 'site');
const manifestPath = path.join(publicDir, 'pages', 'routes.manifest.json');
const vercelPath = path.join(root, 'vercel.json');

const CRYPTIC_DIR_RE = /^(blank-|about-[89]|work[023]|query$)/;

/** Nested alias path → canonical flat route (serving stays via page file). */
const NESTED_ALIASES = [
  { alias: '/work/mba', route: '/mba' },
  { alias: '/artists/harshad-duhita', route: '/harshad-duhita' },
  { alias: '/artists/mohit-shankar', route: '/mohit-shankar' },
  { alias: '/artists/yugm', route: '/yugm' },
  { alias: '/artists/artist-path', route: '/artist-path' },
  { alias: '/films/mahavatar-narsimha', route: '/mahavatar-narsimha' },
  { alias: '/films/hanuman-ansh', route: '/hanuman-ansh' },
  { alias: '/films/mahaprbhu', route: '/mahaprbhu' },
  { alias: '/films/kalki', route: '/kalki' },
  { alias: '/academy/roots-of-hindustani-classical', route: '/roots-of-hindustani-classical' },
  { alias: '/academy/the-heart-of-composition', route: '/the-heart-of-composition' },
  { alias: '/academy/learn-with-tsc', route: '/learn-with-tsc' },
  { alias: '/resources/from-bhajan-to-clubbing', route: '/from-bhajan-to-clubbing' },
  { alias: '/resources/you-released-a-song-now-what', route: '/you-released-a-song-now-what' },
  { alias: '/resources/how-i-curate-music-with-independent-artists', route: '/how-i-curate-music-with-independent-artists' },
  { alias: '/resources/blog-1', route: '/blog-1' },
  { alias: '/resources/blog-2', route: '/blog-2' },
  { alias: '/resources/blog-3', route: '/blog-3' },
  { alias: '/forms/book-a-call', route: '/book-a-call' },
  { alias: '/forms/book-an-artist', route: '/book-an-artist' },
  { alias: '/forms/artist-query', route: '/artist-query' },
  { alias: '/forms/collab-query', route: '/collab-query' },
  { alias: '/forms/masterclass-review01', route: '/masterclass-review01' },
  { alias: '/forms/masterclass-review02', route: '/masterclass-review02' },
  { alias: '/forms/classicalreview', route: '/classicalreview' },
];

/**
 * Human/AI site index nodes. sitePath relative to public/site/.
 * pageFile is pages/*.html basename; css/js optional overrides.
 */
const SITE_NODES = [
  {
    sitePath: 'home',
    title: 'Home',
    canonicalRoute: '/',
    pageFile: 'home.html',
    section: 'home',
    aliases: [],
  },
  {
    sitePath: 'about',
    title: 'About',
    canonicalRoute: '/about',
    pageFile: 'about.html',
    section: 'about',
    aliases: [],
  },
  {
    sitePath: 'work',
    title: 'Work',
    canonicalRoute: '/work',
    pageFile: 'work.html',
    section: 'work',
    aliases: [],
  },
  {
    sitePath: 'work/cases/mba',
    title: 'MBA',
    canonicalRoute: '/mba',
    pageFile: 'mba.html',
    section: 'work',
    aliases: ['/blank-7', '/work/mba'],
  },
  {
    sitePath: 'work/cases/havells-myousic',
    title: 'Havells mYOUsic',
    canonicalRoute: '/havells-myousic',
    pageFile: 'havells-myousic.html',
    section: 'work',
    aliases: ['/work2', '/work/havells-myousic'],
  },
  {
    sitePath: 'work/cases/insta-music-league',
    title: 'Insta Music League',
    canonicalRoute: '/insta-music-league',
    pageFile: 'insta-music-league.html',
    section: 'work',
    aliases: ['/work3', '/work/insta-music-league'],
  },
  {
    sitePath: 'work/cases/young-gunns',
    title: 'The Young Gunns',
    canonicalRoute: '/young-gunns',
    pageFile: 'young-gunns.html',
    section: 'work',
    aliases: ['/work0', '/work/young-gunns'],
  },
  {
    sitePath: 'artists',
    title: 'TSC Artists',
    canonicalRoute: '/artists',
    pageFile: 'artists.html',
    section: 'artists',
    aliases: [],
  },
  {
    sitePath: 'artists/roster/harshad-duhita',
    title: 'Harshad Duhita',
    canonicalRoute: '/harshad-duhita',
    pageFile: 'harshad-duhita.html',
    section: 'artists',
    aliases: ['/blank-10', '/artists/harshad-duhita'],
  },
  {
    sitePath: 'artists/roster/mohit-shankar',
    title: 'Mohit Shankar',
    canonicalRoute: '/mohit-shankar',
    pageFile: 'mohit-shankar.html',
    section: 'artists',
    aliases: ['/artists/mohit-shankar'],
  },
  {
    sitePath: 'artists/roster/yugm',
    title: 'YUGM',
    canonicalRoute: '/yugm',
    pageFile: 'yugm.html',
    section: 'artists',
    aliases: ['/blank-10-1', '/work0-1', '/artists/yugm'],
  },
  {
    sitePath: 'artists/artist-path',
    title: 'Artist Path',
    canonicalRoute: '/artist-path',
    pageFile: 'artist-path.html',
    section: 'artists',
    aliases: ['/artists/artist-path'],
  },
  {
    sitePath: 'films',
    title: 'Films',
    canonicalRoute: '/films',
    pageFile: 'films.html',
    section: 'films',
    aliases: [],
  },
  {
    sitePath: 'films/cases/mahavatar-narsimha',
    title: 'Mahavatar Narsimha',
    canonicalRoute: '/mahavatar-narsimha',
    pageFile: 'mahavatar-narsimha.html',
    section: 'films',
    aliases: ['/blank-12', '/films/mahavatar-narsimha'],
  },
  {
    sitePath: 'films/cases/hanuman-ansh',
    title: 'Hanuman ansh',
    canonicalRoute: '/hanuman-ansh',
    pageFile: 'hanuman-ansh.html',
    section: 'films',
    aliases: ['/blank-12-1', '/work2-1', '/films/hanuman-ansh'],
  },
  {
    sitePath: 'films/cases/mahaprbhu',
    title: 'Mahaprbhu',
    canonicalRoute: '/mahaprbhu',
    pageFile: 'mahaprbhu.html',
    section: 'films',
    aliases: ['/blank-12-1-1', '/work2-1-1', '/films/mahaprbhu'],
  },
  {
    sitePath: 'films/cases/kalki',
    title: 'Kalki',
    canonicalRoute: '/kalki',
    pageFile: 'kalki.html',
    section: 'films',
    aliases: ['/blank-12-1-1-1', '/work2-1-1-1', '/films/kalki'],
  },
  {
    sitePath: 'academy',
    title: 'TSC Academy',
    canonicalRoute: '/academy',
    pageFile: 'academy.html',
    section: 'academy',
    aliases: [],
  },
  {
    sitePath: 'academy/courses/roots-of-hindustani-classical',
    title: 'Roots of Hindustani Classical',
    canonicalRoute: '/roots-of-hindustani-classical',
    pageFile: 'roots-of-hindustani-classical.html',
    section: 'academy',
    aliases: ['/blank-9-1', '/about-9-1', '/academy/roots-of-hindustani-classical'],
  },
  {
    sitePath: 'academy/courses/the-heart-of-composition',
    title: 'The HeART of Composition',
    canonicalRoute: '/the-heart-of-composition',
    pageFile: 'the-heart-of-composition.html',
    section: 'academy',
    aliases: ['/blank-9', '/about-9', '/academy/the-heart-of-composition'],
  },
  {
    sitePath: 'academy/learn-with-tsc',
    title: 'Learn With TSC',
    canonicalRoute: '/learn-with-tsc',
    pageFile: 'learn-with-tsc.html',
    section: 'academy',
    aliases: ['/academy/learn-with-tsc'],
  },
  {
    sitePath: 'resources',
    title: 'Resources',
    canonicalRoute: '/resources',
    pageFile: 'resources.html',
    section: 'resources',
    aliases: [],
  },
  {
    sitePath: 'resources/articles/from-bhajan-to-clubbing',
    title: 'Indian Culture Mainstream Forms',
    canonicalRoute: '/from-bhajan-to-clubbing',
    pageFile: 'from-bhajan-to-clubbing.html',
    section: 'resources',
    css: 'css/pages/editorial-blog.css',
    js: null,
    aliases: ['/resources/from-bhajan-to-clubbing'],
  },
  {
    sitePath: 'resources/articles/you-released-a-song-now-what',
    title: 'You Released a Song. Now What?',
    canonicalRoute: '/you-released-a-song-now-what',
    pageFile: 'you-released-a-song-now-what.html',
    section: 'resources',
    css: 'css/pages/editorial-blog.css',
    js: null,
    aliases: ['/resources/you-released-a-song-now-what'],
  },
  {
    sitePath: 'resources/articles/how-i-curate-music-with-independent-artists',
    title: 'How I Curate Music With Independent Artists',
    canonicalRoute: '/how-i-curate-music-with-independent-artists',
    pageFile: 'how-i-curate-music-with-independent-artists.html',
    section: 'resources',
    css: 'css/pages/editorial-blog.css',
    js: null,
    aliases: ['/resources/how-i-curate-music-with-independent-artists'],
  },
  {
    sitePath: 'resources/articles/blog-1',
    title: 'Blog 1',
    canonicalRoute: '/blog-1',
    pageFile: 'blog-1.html',
    section: 'resources',
    aliases: ['/blank-13', '/resources/blog-1'],
  },
  {
    sitePath: 'resources/articles/blog-2',
    title: 'Blog 2',
    canonicalRoute: '/blog-2',
    pageFile: 'blog-2.html',
    section: 'resources',
    aliases: ['/blank-13-1', '/work3-1', '/resources/blog-2'],
  },
  {
    sitePath: 'resources/articles/blog-3',
    title: 'Blog 3',
    canonicalRoute: '/blog-3',
    pageFile: 'blog-3.html',
    section: 'resources',
    aliases: ['/blank-13-1-1', '/work3-1-1', '/resources/blog-3'],
  },
  {
    sitePath: 'forms/book-a-call',
    title: 'Book A Call',
    canonicalRoute: '/book-a-call',
    pageFile: 'book-a-call.html',
    section: 'forms',
    aliases: ['/blank-8', '/about-8', '/forms/book-a-call'],
  },
  {
    sitePath: 'forms/book-an-artist',
    title: 'Book An Artist',
    canonicalRoute: '/book-an-artist',
    pageFile: 'book-an-artist.html',
    section: 'forms',
    aliases: ['/blank-8-1', '/about-8-1', '/query', '/forms/book-an-artist'],
  },
  {
    sitePath: 'forms/artist-query',
    title: 'Artist Path Query',
    canonicalRoute: '/artist-query',
    pageFile: 'artist-query.html',
    section: 'forms',
    aliases: ['/blank-8-1-1', '/about-8-1-1', '/forms/artist-query'],
  },
  {
    sitePath: 'forms/collab-query',
    title: 'Collab Q',
    canonicalRoute: '/collab-query',
    pageFile: 'collab-query.html',
    section: 'forms',
    aliases: ['/blank-6', '/forms/collab-query'],
  },
  {
    sitePath: 'forms/masterclass-review01',
    title: 'Masterclass Review 01',
    canonicalRoute: '/masterclass-review01',
    pageFile: 'masterclass-review01.html',
    section: 'forms',
    aliases: ['/forms/masterclass-review01'],
  },
  {
    sitePath: 'forms/masterclass-review02',
    title: 'Masterclass Review 02',
    canonicalRoute: '/masterclass-review02',
    pageFile: 'masterclass-review02.html',
    section: 'forms',
    aliases: ['/forms/masterclass-review02'],
  },
  {
    sitePath: 'forms/classicalreview',
    title: 'Classical Review',
    canonicalRoute: '/classicalreview',
    pageFile: 'classicalreview.html',
    section: 'forms',
    aliases: ['/forms/classicalreview'],
  },
];

function slugFromFile(pageFile) {
  return pageFile.replace(/\.html$/, '');
}

function resolveAsset(node, kind) {
  if (Object.prototype.hasOwnProperty.call(node, kind)) {
    return node[kind];
  }
  const slug = slugFromFile(node.pageFile);
  if (kind === 'css') {
    const rel = `css/pages/${slug}.css`;
    return fs.existsSync(path.join(publicDir, rel)) ? rel : null;
  }
  if (kind === 'js') {
    const rel = `js/pages/${slug}.animations.js`;
    return fs.existsSync(path.join(publicDir, rel)) ? rel : null;
  }
  return null;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, 'utf8');
}

function rmDirRecursive(dir) {
  if (!fs.existsSync(dir)) return false;
  fs.rmSync(dir, { recursive: true, force: true });
  return true;
}

function isCrypticAlias(alias) {
  const slug = alias.replace(/^\//, '');
  return CRYPTIC_DIR_RE.test(slug) || slug === 'query';
}

function pageMeta(node) {
  return {
    title: node.title,
    canonicalRoute: node.canonicalRoute,
    pageFile: `pages/${node.pageFile}`,
    css: resolveAsset(node, 'css'),
    js: resolveAsset(node, 'js'),
    section: node.section,
    aliases: [...(node.aliases || [])],
  };
}

function pageReadme(node, meta) {
  const lines = [
    `# ${node.title}`,
    '',
    `- **Canonical URL:** \`${meta.canonicalRoute}\``,
    `- **HTML:** \`${meta.pageFile}\``,
    `- **CSS:** ${meta.css ? `\`${meta.css}\`` : '_(none)_'}`,
    `- **JS:** ${meta.js ? `\`${meta.js}\`` : '_(none)_'}`,
    `- **Section:** \`${meta.section}\``,
    `- **Site index path:** \`public/site/${node.sitePath}/\``,
    '',
  ];
  if (meta.aliases.length) {
    lines.push('## Aliases', '');
    for (const a of meta.aliases) lines.push(`- \`${a}\``);
    lines.push('');
  }
  lines.push(
    'Canonical serving stays flat (`vercel.json` rewrite + `scripts/serve-mirror.js`).',
    'This folder is metadata for humans/AI — not a URL move.',
    ''
  );
  return lines.join('\n');
}

function sectionReadme(section, children) {
  const titles = {
    home: 'Home',
    about: 'About',
    work: 'Work',
    artists: 'Artists',
    films: 'Films',
    academy: 'Academy',
    resources: 'Resources',
    forms: 'Forms',
  };
  const fixed = [
    `# ${titles[section] || section}`,
    '',
    'Pages in this section:',
    '',
  ];
  for (const child of children) {
    const rel = child.sitePath === section ? './' : `./${child.sitePath.slice(section.length + 1)}/`;
    fixed.push(`- [${child.title}](${rel}) — \`${child.canonicalRoute}\` → \`pages/${child.pageFile}\``);
  }
  fixed.push('');
  return fixed.join('\n');
}

function siteRootReadme(nodes) {
  const bySection = new Map();
  for (const n of nodes) {
    if (!bySection.has(n.section)) bySection.set(n.section, []);
    bySection.get(n.section).push(n);
  }
  const lines = [
    '# TSC site map (human + AI)',
    '',
    'Readable index of every public page. **Real HTML lives in `public/pages/*.html`.**',
    'This tree co-locates metadata only — canonical URLs stay flat (`/mba`, `/about`, …).',
    '',
    '## How serving works',
    '',
    '1. `vercel.json` rewrites route → `/pages/<file>.html`',
    '2. Local: `scripts/serve-mirror.js` loads `public/pages/routes.manifest.json`',
    '3. Legacy cryptic paths (`/blank-*`, `/about-8*`, `/work0*`, …) → **301** to canonical',
    '4. Optional nested aliases (`/work/mba`, `/films/kalki`, …) rewrite to same HTML',
    '',
    '## Primary pages',
    '',
  ];
  const primaries = nodes.filter(n =>
    ['/', '/about', '/work', '/artists', '/artist-path', '/learn-with-tsc', '/films', '/resources', '/academy'].includes(
      n.canonicalRoute
    )
  );
  for (const n of primaries) {
    lines.push(`- **${n.title}** — [\`${n.sitePath}/\`](./${n.sitePath}/) → \`${n.canonicalRoute}\` (\`pages/${n.pageFile}\`)`);
  }
  lines.push('', '## All pages by section', '');
  for (const [section, list] of bySection) {
    lines.push(`### ${section}`, '');
    for (const n of list) {
      lines.push(`- [${n.title}](./${n.sitePath}/) — \`${n.canonicalRoute}\``);
    }
    lines.push('');
  }
  lines.push('See also: [`docs/SITE_STRUCTURE.md`](../../docs/SITE_STRUCTURE.md).', '');
  return lines.join('\n');
}

function docsSiteStructure(nodes, crypticRemoved) {
  return `# Site structure

Human/AI-readable map of The Shakti Collective public site.

## Source of truth

| Layer | Path | Role |
|-------|------|------|
| HTML | \`public/pages/*.html\` | Real page documents |
| Route map | \`public/pages/routes.manifest.json\` | Canonical routes, aliases, \`allRoutes\` |
| Site index | \`public/site/**\` | Nested taxonomy + \`meta.json\` / README per page |
| CSS | \`public/css/pages/*.css\` | Per-page styles |
| JS | \`public/js/pages/*.animations.js\` | Per-page animations |
| Prod routes | \`vercel.json\` | Rewrites + 301 redirects |
| Local routes | \`scripts/serve-mirror.js\` | Manifest-driven rewrites |

## Canonical URL policy

Canonical paths stay **flat** (e.g. \`/mba\`, \`/harshad-duhita\`).  
\`public/site/**\` does **not** change public URLs; it indexes them.

Optional nested aliases (rewrite to same HTML, old path kept):

${NESTED_ALIASES.map(a => `- \`${a.alias}\` → \`${a.route}\``).join('\n')}

## Site tree

\`\`\`
public/site/
  README.md
  home/
  about/
  work/
    cases/mba/
  artists/
    roster/harshad-duhita/  mohit-shankar/  yugm/
    artist-path/
  films/
    cases/mahavatar-narsimha/  hanuman-ansh/  mahaprbhu/  kalki/
  academy/
    courses/roots-of-hindustani-classical/  the-heart-of-composition/
    learn-with-tsc/
  resources/
    articles/…
  forms/
    book-a-call/  book-an-artist/  artist-query/  collab-query/
    masterclass-review01/  masterclass-review02/  classicalreview/
\`\`\`

Each leaf has \`README.md\` + \`meta.json\` with: \`title\`, \`canonicalRoute\`, \`pageFile\`, \`css\`, \`js\`, \`section\`, \`aliases\`.

## Full route table

| Canonical | Page file | Site index |
|-----------|-----------|------------|
${nodes.map(n => `| \`${n.canonicalRoute}\` | \`pages/${n.pageFile}\` | \`site/${n.sitePath}/\` |`).join('\n')}

## Cryptic stubs removed

Physical folders matching \`blank-*\`, \`about-8*\`, \`about-9*\`, \`work0*\`, \`work2*\`, \`work3*\`, and \`query/\` were deleted (${crypticRemoved} dirs).  
Those paths now resolve via vercel **301** (except \`/query\`, which stays a **rewrite** to book-an-artist).

Named stubs (\`about/\`, \`work/\`, …) may remain as thin redirects; production prefers vercel rewrites.

## Regenerate

\`\`\`bash
node scripts/restructure-site-tree.js
\`\`\`

Do not reintroduce cryptic stubs via \`generate-subpage-shells.js\` (it skips them).
`;
}

function buildManifest(existing) {
  const primaryPages = (existing.primaryPages || []).map(p => ({ ...p }));
  const byRoute = new Map((existing.subpages || []).map(p => [p.route, { ...p }]));
  const primaryByRoute = new Map(primaryPages.map(p => [p.route, p]));

  // Merge nested + SITE_NODES aliases onto subpages and primaries
  for (const node of SITE_NODES) {
    const route = node.canonicalRoute;
    const primary = primaryByRoute.get(route);
    if (primary) {
      const aliases = new Set(primary.aliases || []);
      for (const a of node.aliases || []) aliases.add(a);
      primary.aliases = [...aliases];
      continue;
    }
    if (route === '/') continue;
    let page = byRoute.get(route);
    if (!page) {
      page = {
        title: node.title,
        route,
        aliases: [],
        file: node.pageFile,
      };
      byRoute.set(route, page);
    }
    const aliases = new Set(page.aliases || []);
    for (const a of node.aliases || []) aliases.add(a);
    page.aliases = [...aliases];
    page.file = page.file || node.pageFile;
    page.title = page.title || node.title;
  }

  for (const { alias, route } of NESTED_ALIASES) {
    const target = primaryByRoute.get(route) || byRoute.get(route);
    if (!target) continue;
    const aliases = new Set(target.aliases || []);
    aliases.add(alias);
    target.aliases = [...aliases];
  }

  const subpages = [...byRoute.values()];
  const aliasEntries = [];
  const seen = new Set();
  for (const page of [...primaryPages, ...subpages]) {
    for (const alias of page.aliases || []) {
      if (seen.has(alias)) continue;
      seen.add(alias);
      aliasEntries.push({ alias, route: page.route });
    }
  }

  const allRoutes = [
    ...primaryPages.map(p => p.route),
    ...subpages.map(p => p.route),
  ];
  // Nested aliases are aliases only — keep allRoutes = canonical flat set
  return {
    primaryPages,
    subpages,
    aliases: aliasEntries,
    allRoutes,
  };
}

function updateVercel(manifest) {
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const pageByRoute = new Map();
  for (const p of [...(manifest.primaryPages || []), ...(manifest.subpages || [])]) {
    pageByRoute.set(p.route, p.file.startsWith('pages/') ? p.file : `pages/${p.file}`);
  }

  const redirects = [];
  for (const { alias, route } of manifest.aliases || []) {
    if (alias === '/query') continue; // rewrite only
    if (!isCrypticAlias(alias)) continue;
    redirects.push({
      source: alias,
      destination: route,
      permanent: true,
    });
  }
  // Stable sort
  redirects.sort((a, b) => a.source.localeCompare(b.source));
  vercel.redirects = redirects;

  // Ensure rewrites for every canonical + nested alias + /query
  const rewriteSources = new Map();
  for (const [route, file] of pageByRoute) {
    rewriteSources.set(route === '/' ? '/' : route, `/${file.replace(/^pages\//, 'pages/')}`);
  }
  for (const { alias, route } of manifest.aliases || []) {
    const file = pageByRoute.get(route);
    if (!file) continue;
    // Cryptic handled by 301; still allow rewrite for nested non-cryptic
    if (isCrypticAlias(alias) && alias !== '/query') continue;
    rewriteSources.set(alias, `/${file}`);
  }
  // Force /query rewrite
  const bookFile = pageByRoute.get('/book-an-artist') || 'pages/book-an-artist.html';
  rewriteSources.set('/query', `/${bookFile}`);

  const assetRewrites = (vercel.rewrites || []).filter(
    r =>
      r.source.startsWith('/assets/') ||
      r.source.startsWith('/_api/') ||
      r.destination === '/api/disabled-telemetry'
  );

  const pageRewrites = [...rewriteSources.entries()]
    .sort((a, b) => {
      // Longer paths first so /work/mba beats /work if ever conflicting
      if (b[0].length !== a[0].length) return b[0].length - a[0].length;
      return a[0].localeCompare(b[0]);
    })
    .map(([source, destination]) => ({ source, destination }));

  vercel.rewrites = [...pageRewrites, ...assetRewrites];
  writeFile(vercelPath, `${JSON.stringify(vercel, null, 2)}\n`);
  return { redirects: redirects.length, rewrites: pageRewrites.length };
}

function removeCrypticStubs() {
  const removed = [];
  for (const entry of fs.readdirSync(publicDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!CRYPTIC_DIR_RE.test(entry.name)) continue;
    const full = path.join(publicDir, entry.name);
    rmDirRecursive(full);
    removed.push(entry.name);
  }
  return removed;
}

function writeSiteTree() {
  ensureDir(siteDir);
  writeFile(path.join(siteDir, 'README.md'), siteRootReadme(SITE_NODES));

  const sectionRoots = new Set(SITE_NODES.map(n => n.section));
  for (const section of sectionRoots) {
    const children = SITE_NODES.filter(n => n.section === section);
    const sectionDir = path.join(siteDir, section);
    ensureDir(sectionDir);
    // Section hub README when hub node exists or always
    writeFile(path.join(sectionDir, 'README.md'), sectionReadme(section, children));
  }

  for (const node of SITE_NODES) {
    const dir = path.join(siteDir, node.sitePath);
    ensureDir(dir);
    const meta = pageMeta(node);
    writeFile(path.join(dir, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
    writeFile(path.join(dir, 'README.md'), pageReadme(node, meta));
  }
}

function main() {
  const existing = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const manifest = buildManifest(existing);
  writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  writeSiteTree();
  const crypticRemoved = removeCrypticStubs();
  writeFile(path.join(root, 'docs', 'SITE_STRUCTURE.md'), docsSiteStructure(SITE_NODES, crypticRemoved.length));

  const vercelStats = updateVercel(manifest);

  console.log(
    JSON.stringify(
      {
        ok: true,
        siteNodes: SITE_NODES.length,
        allRoutes: manifest.allRoutes.length,
        aliases: manifest.aliases.length,
        crypticRemoved: crypticRemoved.length,
        crypticDirs: crypticRemoved,
        vercelRedirects: vercelStats.redirects,
        vercelPageRewrites: vercelStats.rewrites,
      },
      null,
      2
    )
  );
}

main();
