const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PAGES = path.join(PUBLIC, 'pages');
const ORIGIN = 'https://theshakticollective.in';

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function tag(html, re) {
  const match = html.match(re);
  return match ? match[1] : '';
}

function hasJsonLd(html) {
  return /<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i.test(html);
}

function main() {
  const manifest = JSON.parse(read(path.join(PAGES, 'routes.manifest.json')));
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  const sitemap = read(path.join(PUBLIC, 'sitemap.xml'));
  const robots = read(path.join(PUBLIC, 'robots.txt'));
  const requiredFiles = ['llms.txt', 'llms-full.txt', 'agent-design.md', 'agent-content.md', 'about.md', 'site/README.md'];

  for (const bot of ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended']) {
    if (!robots.includes(`User-agent: ${bot}`) || !robots.includes('Allow: /')) {
      fail(`robots.txt missing AI bot allow: ${bot}`);
    }
  }

  for (const file of requiredFiles) {
    const full = path.join(PUBLIC, file);
    if (!fs.existsSync(full) || fs.statSync(full).size < 200) fail(`Missing or tiny agent/SEO file: ${file}`);
  }

  for (const page of pages) {
    const file = path.join(PAGES, page.file);
    if (!fs.existsSync(file)) {
      fail(`Missing page file: ${page.file}`);
      continue;
    }
    const html = read(file);
    const canonical = tag(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const expected = page.route === '/' ? `${ORIGIN}/` : `${ORIGIN}${page.route}`;
    const desc = tag(html, /<meta\s+name="description"\s+content="([^"]+)"/i);
    const title = tag(html, /<title>([^<]+)<\/title>/i);
    if (canonical !== expected) fail(`${page.file}: canonical ${canonical || '(missing)'} != ${expected}`);
    if (!title || title.length < 8) fail(`${page.file}: missing useful title`);
    if (!desc || desc.length < 50 || desc.length > 220) fail(`${page.file}: bad meta description length`);
    if (!hasJsonLd(html)) fail(`${page.file}: missing JSON-LD`);
    if (!sitemap.includes(`<loc>${expected}</loc>`)) fail(`sitemap missing ${expected}`);
  }

  if (process.exitCode) return;
  console.log(`SEO verified: ${pages.length} pages, sitemap, robots, and agent files.`);
}

main();
