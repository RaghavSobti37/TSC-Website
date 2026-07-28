#!/usr/bin/env node
/**
 * Wire semantic blog/course routes: CSS copies, vercel rewrites/redirects, stubs, sitemap host.
 * Desktop lock untouched. Old /blog-* bookmarks redirect → new slugs (no 404).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');

const BLOG_MAP = [
  { old: 'blog-1', slug: 'start-making-music', title: 'How Do I Start Making Music If I Have No Experience?' },
  { old: 'blog-2', slug: 'online-music-course-worth-it', title: 'Is an Online Music Course Worth It for Beginners?' },
  { old: 'blog-3', slug: 'artist-release-playbook', title: 'The Artist Release Playbook' },
];

function copyIfMissing(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) {
    console.warn('missing source', fromRel);
    return false;
  }
  if (fs.existsSync(to)) {
    console.log('exists', toRel);
    return false;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log('copied', fromRel, '→', toRel);
  return true;
}

function stubHtml(slug) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=/pages/${slug}.html">
  <script>location.replace("/pages/${slug}.html" + location.search + location.hash);</script>
  <link rel="icon" href="/assets/brand/tsc-favicon-32.png" type="image/png" sizes="32x32">
</head>
<body><a href="/pages/${slug}.html">Open /${slug}</a></body>
</html>
`;
}

function writeStub(relDir, slug) {
  const dir = path.join(publicDir, relDir);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), stubHtml(slug));
  console.log('stub', path.join(relDir, 'index.html'));
}

// 1) CSS for semantic blogs
for (const { old, slug } of BLOG_MAP) {
  copyIfMissing(`public/css/pages/${old}.css`, `public/css/pages/${slug}.css`);
}

// 2) Directory stubs
for (const { slug } of BLOG_MAP) {
  writeStub(slug, slug);
  writeStub(path.join('resources', slug), slug);
}
writeStub('mba-impact', 'mba-impact');
writeStub('impact-report', 'mba-impact');
writeStub(path.join('academy', 'music-production'), 'music-production');
writeStub(path.join('courses', 'music-production'), 'music-production');
if (!fs.existsSync(path.join(publicDir, 'music-production', 'index.html'))) {
  writeStub('music-production', 'music-production');
}

// 3) Patch vercel.json
const vercelPath = path.join(root, 'vercel.json');
const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

function upsertRewrite(source, destination) {
  const i = vercel.rewrites.findIndex((r) => r.source === source);
  const entry = { source, destination };
  if (i >= 0) vercel.rewrites[i] = entry;
  else {
    // insert before mirror/asset catch-alls (sources with :)
    const cut = vercel.rewrites.findIndex((r) => r.source.includes(':'));
    if (cut >= 0) vercel.rewrites.splice(cut, 0, entry);
    else vercel.rewrites.push(entry);
  }
}

function upsertRedirect(source, destination, permanent = true) {
  const i = vercel.redirects.findIndex((r) => r.source === source);
  const entry = { source, destination, permanent };
  if (i >= 0) vercel.redirects[i] = entry;
  else vercel.redirects.push(entry);
}

const rewritePairs = [
  ['/start-making-music', '/pages/start-making-music.html'],
  ['/resources/start-making-music', '/pages/start-making-music.html'],
  ['/online-music-course-worth-it', '/pages/online-music-course-worth-it.html'],
  ['/resources/online-music-course-worth-it', '/pages/online-music-course-worth-it.html'],
  ['/artist-release-playbook', '/pages/artist-release-playbook.html'],
  ['/resources/artist-release-playbook', '/pages/artist-release-playbook.html'],
  ['/music-production', '/pages/music-production.html'],
  ['/academy/music-production', '/pages/music-production.html'],
  ['/courses/music-production', '/pages/music-production.html'],
  ['/mba-impact', '/pages/mba-impact.html'],
  ['/impact-report', '/pages/mba-impact.html'],
  ['/work/mba-impact', '/pages/mba-impact.html'],
];

for (const [s, d] of rewritePairs) upsertRewrite(s, d);

// Old blog bookmarks → semantic (no 404). Also keep serving via rewrite fallback:
// Prefer redirect so one canonical URL.
for (const { old, slug } of BLOG_MAP) {
  upsertRedirect(`/${old}`, `/${slug}`);
  upsertRedirect(`/resources/${old}`, `/${slug}`);
  // Change rewrite destinations if still pointing at old html — redirects take precedence for exact
}

// Cryptic aliases should land on semantic pages
upsertRedirect('/blank-13', '/start-making-music');
upsertRedirect('/blank-13-1', '/online-music-course-worth-it');
upsertRedirect('/blank-13-1-1', '/artist-release-playbook');
upsertRedirect('/work3-1', '/online-music-course-worth-it');
upsertRedirect('/work3-1-1', '/artist-release-playbook');
// work3 stays /insta-music-league (Wix work case study)

fs.writeFileSync(vercelPath, JSON.stringify(vercel, null, 2) + '\n');
console.log('updated vercel.json');

// 4) Sitemap host + add new URLs
for (const name of ['sitemap.xml', 'sitemap-pages.xml']) {
  const p = path.join(publicDir, name);
  if (!fs.existsSync(p)) continue;
  let xml = fs.readFileSync(p, 'utf8');
  xml = xml.replace(/https:\/\/wix-site-clone-psi\.vercel\.app/g, 'https://theshakticollective.in');
  for (const { old, slug } of BLOG_MAP) {
    xml = xml.replaceAll(`/${old}</loc>`, `/${slug}</loc>`);
    if (!xml.includes(`/${slug}</loc>`)) {
      xml = xml.replace(
        '</urlset>',
        `  <url><loc>https://theshakticollective.in/${slug}</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>`
      );
    }
  }
  if (!xml.includes('/music-production</loc>')) {
    xml = xml.replace(
      '</urlset>',
      `  <url><loc>https://theshakticollective.in/music-production</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`
    );
  }
  if (!xml.includes('/mba-impact</loc>')) {
    xml = xml.replace(
      '</urlset>',
      `  <url><loc>https://theshakticollective.in/mba-impact</loc><lastmod>2026-07-28</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>\n</urlset>`
    );
  }
  fs.writeFileSync(p, xml);
  console.log('updated', name);
}

// 5) Fix article meta aliases (work3 is NOT a blog alias)
for (const { old, slug } of BLOG_MAP) {
  const metaPath = path.join(publicDir, 'site', 'resources', 'articles', slug, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  meta.canonicalRoute = `/${slug}`;
  meta.pageFile = `pages/${slug}.html`;
  meta.aliases = [`/${old}`, `/resources/${old}`, `/resources/${slug}`, `/blank-13${old === 'blog-1' ? '' : old === 'blog-2' ? '-1' : '-1-1'}`];
  if (old === 'blog-2') meta.aliases.push('/work3-1');
  if (old === 'blog-3') meta.aliases.push('/work3-1-1');
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
  console.log('meta', slug);
}

console.log('done');
