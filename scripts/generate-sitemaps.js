/*
 * generate-sitemaps.js — sitemap.xml + sitemap-pages.xml + sitemap-index.xml
 * generated from routes.manifest.json so they never drift from the live
 * routes. Redirect-only routes and duplicate pages are excluded.
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const manifestPath = path.join(publicDir, 'pages', 'routes.manifest.json');
const origin = 'https://theshakticollective.in';
const today = new Date().toISOString().slice(0, 10);

const EXTRA_ROUTES = [
  { route: '/affiliate', priority: 0.5, changefreq: 'monthly', type: 'form' },
];

// Priority tiers: (home) > (primary) > (courses) > (impact/work/films/artists) > (resources/blog) > (forms)
function tierFor(route) {
  if (route === '/') return 1.0;
  const primary = ['/about', '/work', '/artists', '/artist-path', '/films', '/resources', '/academy'];
  if (primary.includes(route)) return 0.9;
  const courses = ['/course-bundle', '/roots-of-hindustani-classical', '/the-heart-of-composition', '/music-production'];
  if (courses.includes(route)) return 0.8;
  const forms = ['/collab-query', '/book-an-artist', '/artist-query', '/book-a-call', '/masterclass-review01', '/masterclass-review02', '/classicalreview', '/affiliate'];
  if (forms.includes(route)) return 0.5;
  return 0.7;
}

function changefreqFor(route, tier) {
  if (route === '/' || tier === 0.9) return 'weekly';
  if (tier === 0.8) return 'monthly';
  if (tier === 0.5) return 'monthly';
  return 'monthly';
}

function xmlEscape(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildRoutes() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  const routes = pages.map(page => page.route).filter(Boolean);
  for (const extra of EXTRA_ROUTES) routes.push(extra.route);
  return routes;
}

function buildUrlset(routes) {
  const urls = routes.map(route => {
    const tier = tierFor(route);
    const loc = route === '/' ? `${origin}/` : `${origin}${route}`;
    return `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${today}</lastmod><changefreq>${changefreqFor(route, tier)}</changefreq><priority>${tier}</priority></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function buildIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${origin}/sitemap.xml</loc><lastmod>${today}</lastmod></sitemap>\n  <sitemap><loc>${origin}/sitemap-pages.xml</loc><lastmod>${today}</lastmod></sitemap>\n</sitemapindex>\n`;
}

function main() {
  const routes = buildRoutes();
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), buildUrlset(routes), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), buildUrlset(routes), 'utf8');
  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), buildIndex(), 'utf8');
  console.log(`Sitemaps: wrote ${routes.length} canonical URLs to sitemap.xml / sitemap-pages.xml / sitemap-index.xml.`);
}

main();
