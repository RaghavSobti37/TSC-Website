/**
 * Generate AI-parseable corpus: sitemap urlset + site README/content.md files.
 * Sources: routes.manifest.json + content-data.js routes + llms-full.txt sections.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const BASE = 'https://theshakticollective.in';
const LASTMOD = new Date().toISOString().slice(0, 10);

const PRIORITY = {
  '/': '1.0',
  primary: '0.9',
  detail: '0.7',
  editorial: '0.6',
  form: '0.5',
  review: '0.3',
};

const PRIMARY = new Set([
  '/about', '/work', '/artists', '/artist-path', '/films', '/resources',
  '/learn-with-tsc', '/academy',
]);
const DETAIL = new Set([
  '/mba', '/harshad-duhita', '/yugm', '/mahaprbhu', '/mahavatar-narsimha',
  '/hanuman-ansh', '/kalki', '/roots-of-hindustani-classical',
  '/the-heart-of-composition',
]);
const EDITORIAL = new Set([
  '/blog-1', '/blog-2', '/blog-3', '/from-bhajan-to-clubbing',
  '/you-released-a-song-now-what',
  '/how-i-curate-music-with-independent-artists',
]);
const FORM = new Set([
  '/collab-query', '/book-an-artist', '/artist-query', '/book-a-call',
]);
const REVIEW = new Set([
  '/masterclass-review01', '/classicalreview', '/masterclass-review02',
]);

function changeFreq(route) {
  if (route === '/' || PRIMARY.has(route)) return 'weekly';
  if (REVIEW.has(route)) return 'yearly';
  return 'monthly';
}

function priority(route) {
  if (route === '/') return PRIORITY['/'];
  if (PRIMARY.has(route)) return PRIORITY.primary;
  if (DETAIL.has(route)) return PRIORITY.detail;
  if (EDITORIAL.has(route)) return PRIORITY.editorial;
  if (FORM.has(route)) return PRIORITY.form;
  if (REVIEW.has(route)) return PRIORITY.review;
  return '0.5';
}

function loadContentRoutes() {
  const src = fs.readFileSync(path.join(PUBLIC, 'js', 'content-data.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  const data = sandbox.window.__TSC_CONTENT_REPLACEMENTS__;
  if (!data || !data.routes) throw new Error('content-data.js missing routes');
  return data.routes;
}

function loadLlmsSections() {
  const full = fs.readFileSync(path.join(PUBLIC, 'llms-full.txt'), 'utf8').replace(/\r\n/g, '\n');
  const sections = {};
  const re = /\n## (https:\/\/[^\n]+)\n([\s\S]*?)(?=\n## https:\/\/|\n## Contact|\n## How to cite|$)/g;
  let match;
  while ((match = re.exec(full)) !== null) {
    const route = match[1].replace(BASE, '') || '/';
    const body = match[2].replace(/\n---\s*$/, '').trim();
    if (body) sections[route] = body;
  }
  return sections;
}

function slugFromRoute(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '');
}

function siteSection(route) {
  if (route === '/') return 'home';
  if (['/about'].includes(route)) return 'about';
  if (['/work', '/mba', '/havells-myousic', '/insta-music-league', '/young-gunns'].includes(route)) return 'work';
  if (['/artists', '/artist-path', '/harshad-duhita', '/mohit-shankar', '/yugm'].includes(route)) return 'artists';
  if (route === '/academy' || ['/roots-of-hindustani-classical', '/the-heart-of-composition', '/music-production', '/course-bundle'].includes(route)) return 'academy';
  if (route === '/resources' || ['/start-making-music', '/online-music-course-worth-it', '/artist-release-playbook', '/from-bhajan-to-clubbing', '/you-released-a-song-now-what', '/how-i-curate-music-with-independent-artists'].includes(route)) return 'resources';
  if (route === '/films' || ['/mahaprbhu', '/mahavatar-narsimha', '/hanuman-ansh', '/kalki', '/mahavatar-narsimha-impact', '/hanuman-ansh-impact', '/mahaprabhu-jagannath-impact', '/kalki-impact'].includes(route)) return 'films';
  if (['/collab-query', '/book-an-artist', '/artist-query', '/book-a-call', '/masterclass-review01', '/masterclass-review02', '/classicalreview', '/affiliate'].includes(route)) return 'forms';
  return 'resources';
}

function sitePathForRoute(route) {
  const slug = slugFromRoute(route);
  if (route === '/') return 'home';
  if (route === '/about') return 'about';
  if (route === '/work') return 'work';
  if (route === '/artists') return 'artists';
  if (route === '/artist-path') return 'artists/artist-path';
  if (['/harshad-duhita', '/mohit-shankar', '/yugm'].includes(route)) return `artists/roster/${slug}`;
  if (route === '/academy') return 'academy';
  if (['/roots-of-hindustani-classical', '/the-heart-of-composition', '/music-production', '/course-bundle'].includes(route)) return `academy/courses/${slug}`;
  if (route === '/resources') return 'resources';
  if (['/start-making-music', '/online-music-course-worth-it', '/artist-release-playbook', '/from-bhajan-to-clubbing', '/you-released-a-song-now-what', '/how-i-curate-music-with-independent-artists'].includes(route)) return `resources/articles/${slug}`;
  if (route === '/films') return 'films';
  if (['/mahaprbhu', '/mahavatar-narsimha', '/hanuman-ansh', '/kalki'].includes(route)) return `films/cases/${slug}`;
  if (['/mahavatar-narsimha-impact', '/hanuman-ansh-impact', '/mahaprabhu-jagannath-impact', '/kalki-impact'].includes(route)) return `films/impact/${slug}`;
  if (['/mba', '/havells-myousic', '/insta-music-league', '/young-gunns'].includes(route)) return `work/cases/${slug}`;
  return `${siteSection(route)}/${slug}`;
}

function walkMeta(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMeta(full, out);
    else if (entry.name === 'meta.json') out.push(full);
  }
  return out;
}

function aliasesForRoute(manifest, route) {
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  const page = pages.find(item => item.route === route);
  return page && Array.isArray(page.aliases) ? page.aliases : [];
}

function ensureSiteMeta(manifest) {
  fs.mkdirSync(path.join(PUBLIC, 'site'), { recursive: true });
  for (const page of [...(manifest.primaryPages || []), ...(manifest.subpages || [])]) {
    if (!page.route || !page.file) continue;
    const dir = path.join(PUBLIC, 'site', sitePathForRoute(page.route));
    const metaPath = path.join(dir, 'meta.json');
    if (fs.existsSync(metaPath)) continue;
    const slug = slugFromRoute(page.route);
    fs.mkdirSync(dir, { recursive: true });
    const cssRel = `css/pages/${slug}.css`;
    const jsRel = `js/pages/${slug}.animations.js`;
    const meta = {
      title: page.title || slug,
      canonicalRoute: page.route,
      pageFile: `pages/${page.file}`,
      css: fs.existsSync(path.join(PUBLIC, cssRel)) ? cssRel : null,
      js: fs.existsSync(path.join(PUBLIC, jsRel)) ? jsRel : null,
      section: siteSection(page.route),
      aliases: aliasesForRoute(manifest, page.route),
    };
    fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  }
}

function writeSitemaps(allRoutes) {
  const urls = allRoutes.map((route) => {
    const loc = route === '/' ? `${BASE}/` : `${BASE}${route}`;
    return `  <url><loc>${loc}</loc><lastmod>${LASTMOD}</lastmod><changefreq>${changeFreq(route)}</changefreq><priority>${priority(route)}</priority></url>`;
  }).join('\n');

  const urlset = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  // Primary sitemap MUST be a urlset — AI/agents often fail on sitemapindex-only files
  fs.writeFileSync(path.join(PUBLIC, 'sitemap.xml'), urlset);
  fs.writeFileSync(path.join(PUBLIC, 'sitemap-pages.xml'), urlset);
  fs.writeFileSync(
    path.join(PUBLIC, 'sitemap-index.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>${BASE}/sitemap.xml</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>${BASE}/sitemap-pages.xml</loc>\n    <lastmod>${LASTMOD}</lastmod>\n  </sitemap>\n</sitemapindex>\n`
  );
}

function buildReadme(meta, contentLines, llmsBody) {
  const title = meta.title || 'Page';
  const route = meta.canonicalRoute || '/';
  const loc = route === '/' ? `${BASE}/` : `${BASE}${route}`;
  const lines = [
    `# ${title}`,
    '',
    `> Machine-readable page summary for AI agents. Live HTML: ${loc}`,
    '',
    `- **Canonical URL:** \`${route}\``,
    `- **Absolute URL:** ${loc}`,
    `- **HTML:** \`${meta.pageFile || ''}\``,
    meta.css ? `- **CSS:** \`${meta.css}\`` : null,
    meta.js ? `- **JS:** \`${meta.js}\`` : null,
    `- **Section:** \`${meta.section || ''}\``,
    Array.isArray(meta.aliases) && meta.aliases.length
      ? `- **Aliases:** ${meta.aliases.map((a) => `\`${a}\``).join(', ')}`
      : null,
    '',
    '## Page content',
    '',
  ].filter((x) => x !== null);

  if (llmsBody) {
    lines.push(llmsBody, '');
  }

  if (contentLines && contentLines.length) {
    if (llmsBody) lines.push('## Source copy (verbatim)', '');
    for (const line of contentLines) {
      const t = String(line).trim();
      if (!t) continue;
      lines.push(`- ${t}`);
    }
    lines.push('');
  }

  if (!llmsBody && (!contentLines || !contentLines.length)) {
    lines.push('_No structured copy mapped for this route yet._', '');
  }

  lines.push(
    '## Discovery',
    '',
    `- [llms.txt](${BASE}/llms.txt)`,
    `- [llms-full.txt](${BASE}/llms-full.txt)`,
    `- [sitemap.xml](${BASE}/sitemap.xml)`,
    ''
  );

  return lines.join('\n');
}

function writeSiteReadmes(contentRoutes, llmsSections) {
  const metas = walkMeta(path.join(PUBLIC, 'site'));
  let n = 0;
  for (const metaPath of metas) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const route = meta.canonicalRoute;
    const contentLines = contentRoutes[route] || contentRoutes[route === '/' ? '/' : route] || [];
    // blog stubs / roster without route copy: still get metadata + discovery
    const llmsBody = llmsSections[route] || '';
    const readmePath = path.join(path.dirname(metaPath), 'README.md');
    fs.writeFileSync(readmePath, buildReadme(meta, contentLines, llmsBody));

    // Flat content.md twin — plain UTF-8 markdown, no metadata noise
    const contentMd = path.join(path.dirname(metaPath), 'content.md');
    const bodyParts = [];
    bodyParts.push(`# ${meta.title}`, '', `URL: ${route === '/' ? `${BASE}/` : `${BASE}${route}`}`, '');
    if (llmsBody) bodyParts.push(llmsBody, '');
    if (contentLines.length) {
      bodyParts.push('## Copy', '');
      for (const line of contentLines) {
        const t = String(line).trim();
        if (t) bodyParts.push(t, '');
      }
    }
    fs.writeFileSync(contentMd, bodyParts.join('\n'));
    n += 1;
  }
  return n;
}

function writeSiteRootReadme(manifest) {
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  const bySection = new Map();
  for (const page of pages) {
    const section = siteSection(page.route);
    if (!bySection.has(section)) bySection.set(section, []);
    bySection.get(section).push(page);
  }
  const lines = [
    '# TSC site map (human + AI)',
    '',
    'Readable index of every canonical public page. Real HTML lives in `public/pages/*.html`; this tree stores metadata and plain content for agents.',
    '',
    '## Agent files',
    '',
    '- [`/agent-design.md`](../agent-design.md) - design rules and page map',
    '- [`/agent-content.md`](../agent-content.md) - compressed site copy and route index',
    '- [`/llms.txt`](../llms.txt) - curated AI discovery index',
    '- [`/llms-full.txt`](../llms-full.txt) - full AI-readable corpus',
    '- [`/sitemap.xml`](../sitemap.xml) - canonical URL set',
    '',
    '## Serving',
    '',
    '1. `vercel.json` rewrites canonical route to `/pages/<file>.html`.',
    '2. Legacy Wix aliases redirect or rewrite to canonical routes.',
    '3. Each page folder has `meta.json`, `README.md`, and `content.md`.',
    '',
    '## Pages',
    '',
  ];
  for (const [section, list] of bySection) {
    lines.push(`### ${section}`, '');
    for (const page of list) {
      lines.push(`- [${page.title}](./${sitePathForRoute(page.route)}/) - \`${page.route}\` -> \`pages/${page.file}\``);
    }
    lines.push('');
  }
  fs.writeFileSync(path.join(PUBLIC, 'site', 'README.md'), lines.join('\n'), 'utf8');
}

function writeAgentFiles(manifest, contentRoutes) {
  const designParts = [];
  for (const rel of ['DESIGN.md', path.join('docs', 'PAGE_DESIGN.md')]) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) continue;
    designParts.push(fs.readFileSync(full, 'utf8').trim());
  }
  fs.writeFileSync(path.join(PUBLIC, 'agent-design.md'), `${designParts.join('\n\n---\n\n')}\n`, 'utf8');

  const lines = [
    '# The Shakti Collective Agent Content',
    '',
    `Generated: ${LASTMOD}`,
    `Canonical site: ${BASE}`,
    '',
    '## Routes',
    '',
  ];
  for (const page of [...(manifest.primaryPages || []), ...(manifest.subpages || [])]) {
    const url = page.route === '/' ? `${BASE}/` : `${BASE}${page.route}`;
    lines.push(`- ${page.title}: ${url}`);
  }
  lines.push('', '## Extracted Copy', '');
  for (const [route, copy] of Object.entries(contentRoutes)) {
    if (!Array.isArray(copy) || copy.length === 0) continue;
    lines.push(`### ${route}`, '');
    for (const item of copy) {
      const text = String(item).trim();
      if (text) lines.push(`- ${text}`);
    }
    lines.push('');
  }
  fs.writeFileSync(path.join(PUBLIC, 'agent-content.md'), lines.join('\n'), 'utf8');
}

function main() {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(PUBLIC, 'pages', 'routes.manifest.json'), 'utf8')
  );
  const allRoutes = manifest.allRoutes;
  if (!Array.isArray(allRoutes) || allRoutes.length < 1) {
    throw new Error('routes.manifest.json missing allRoutes');
  }

  const contentRoutes = loadContentRoutes();
  const llmsSections = loadLlmsSections();

  ensureSiteMeta(manifest);
  writeSitemaps(allRoutes);
  const count = writeSiteReadmes(contentRoutes, llmsSections);
  writeSiteRootReadme(manifest);
  writeAgentFiles(manifest, contentRoutes);

  // About mirror at /about.md for agents that resolve page → .md
  const aboutReadme = fs.readFileSync(path.join(PUBLIC, 'site', 'about', 'content.md'), 'utf8');
  fs.writeFileSync(path.join(PUBLIC, 'about.md'), aboutReadme);

  console.log(`AI corpus OK: sitemap ${allRoutes.length} urls; ${count} site pages; agent files; about.md`);
}

main();
