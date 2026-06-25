/**
 * Generate sitemap.xml from Next.js pages/ routes.
 * Run: node scripts/generate-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const pagesDir = path.join(root, 'pages');
const SITE = 'https://theshakticollective.in';

const SKIP = new Set(['_app.tsx', '_document.tsx', '_error.tsx', '404.tsx', '500.tsx', 'api']);

const PRIORITY = {
  '/': 1.0,
  '/tscacademy': 0.9,
  '/resources': 0.8,
  '/about': 0.8,
  '/artists': 0.8,
  '/collab': 0.8,
  '/ip': 0.8,
  '/stories': 0.8,
  '/book-a-call': 0.7,
  '/artist-path': 0.7,
};

function fileToRoute(relPath) {
  let route = '/' + relPath
    .replace(/\\/g, '/')
    .replace(/\.tsx$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '');
  if (route === '') route = '/';
  if (relPath.includes('[')) return null;
  return route;
}

function walk(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name === 'api') continue;
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      routes.push(...walk(full, rel));
    } else if (entry.name.endsWith('.tsx') && !SKIP.has(entry.name)) {
      const route = fileToRoute(rel);
      if (route) routes.push(route);
    }
  }
  return routes;
}

const routes = [...new Set(walk(pagesDir))].sort();
const urls = routes.map((route) => ({
  loc: route === '/' ? `${SITE}/` : `${SITE}${route}`,
  priority: PRIORITY[route] ?? 0.6,
}));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`Wrote public/sitemap.xml (${urls.length} URLs)`);
