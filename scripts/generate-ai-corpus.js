/**
 * Generate AI-parseable corpus: sitemap urlset + site README/content.md files.
 * Sources: routes.manifest.json + content-data.js routes + llms-full.txt sections.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const BASE = 'https://wix-site-clone-psi.vercel.app';
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

function walkMeta(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMeta(full, out);
    else if (entry.name === 'meta.json') out.push(full);
  }
  return out;
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

  writeSitemaps(allRoutes);
  const count = writeSiteReadmes(contentRoutes, llmsSections);

  // About mirror at /about.md for agents that resolve page → .md
  const aboutReadme = fs.readFileSync(path.join(PUBLIC, 'site', 'about', 'content.md'), 'utf8');
  fs.writeFileSync(path.join(PUBLIC, 'about.md'), aboutReadme);

  console.log(`AI corpus OK: sitemap ${allRoutes.length} urls; ${count} site pages; about.md`);
}

main();
