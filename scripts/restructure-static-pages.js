const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const pages = [
  { slug: 'home', route: '/', source: 'index.html', pageFile: 'home.html' },
  { slug: 'about', route: '/about', source: 'about/index.html', pageFile: 'about.html' },
  { slug: 'work', route: '/work', source: 'work/index.html', pageFile: 'work.html' },
  { slug: 'artists', route: '/artists', source: 'artists/index.html', pageFile: 'artists.html' },
  { slug: 'artist-path', route: '/artist-path', source: 'artist-path/index.html', pageFile: 'artist-path.html' },
  { slug: 'learn-with-tsc', route: '/learn-with-tsc', source: 'learn-with-tsc/index.html', pageFile: 'learn-with-tsc.html' },
  { slug: 'films', route: '/films', source: 'films/index.html', pageFile: 'films.html' },
  { slug: 'resources', route: '/resources', source: 'resources/index.html', pageFile: 'resources.html' },
  { slug: 'academy', route: '/academy', source: 'academy/index.html', pageFile: 'academy.html' },
];

const pagesDir = path.join(publicDir, 'pages');
const cssDir = path.join(publicDir, 'css', 'pages');
const jsDir = path.join(publicDir, 'js', 'pages');

for (const dir of [pagesDir, cssDir, jsDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, '\n');
}

function extractStyles(html, page) {
  const styles = [];
  let firstStyle = true;
  const output = html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (match, attrs, css) => {
    styles.push({ attrs: attrs.trim(), css });
    if (!firstStyle) return '';
    firstStyle = false;
    return `<link rel="stylesheet" href="/css/pages/${page.slug}.css" data-tsc-page-style="${page.slug}" data-tsc-standalone-runtime>
  <link rel="stylesheet" href="/css/tsc-nav-overrides.css" data-tsc-nav-overrides data-tsc-standalone-runtime>`;
  });

  const css = styles.map((entry, index) => {
    const source = entry.attrs ? `style ${index + 1}: ${entry.attrs}` : `style ${index + 1}`;
    return `/* ${source.replace(/\*\//g, '* /')} */\n${entry.css.trim()}\n`;
  }).join('\n');

  fs.writeFileSync(path.join(cssDir, `${page.slug}.css`), normalizeNewlines(css), 'utf8');
  return output;
}

function extractAnimationScript(html, page) {
  let extracted = '';
  const output = html.replace(/<script\b([^>]*)\bid=["']wix-skip-played-animations["']([^>]*)>([\s\S]*?)<\/script>/i, (match, before, after, body) => {
    extracted = body.trim();
    return `<script id="wix-skip-played-animations" src="/js/pages/${page.slug}.animations.js"></script>`;
  });

  const js = [
    `// Page animation bootstrap extracted from ${page.source}.`,
    `// Kept separate so page-level animation behavior can be edited without touching the static HTML.`,
    extracted || '// No page animation bootstrap was present in the source HTML.',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(jsDir, `${page.slug}.animations.js`), normalizeNewlines(js), 'utf8');
  return output;
}

function shimHtml(page) {
  const destination = `/pages/${page.pageFile}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=${htmlEscape(destination)}">
  <link rel="canonical" href="${htmlEscape(page.route)}">
  <title>The Shakti Collective</title>
  <script>location.replace(${JSON.stringify(destination)} + location.search + location.hash);</script>
</head>
<body>
  <a href="${htmlEscape(destination)}">Open ${htmlEscape(page.route)}</a>
</body>
</html>
`;
}

for (const page of pages) {
  const sourcePath = path.join(publicDir, ...page.source.split('/'));
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source page: ${page.source}`);
  }

  let html = fs.readFileSync(sourcePath, 'utf8');
  html = extractStyles(html, page);
  html = extractAnimationScript(html, page);
  fs.writeFileSync(path.join(pagesDir, page.pageFile), normalizeNewlines(html), 'utf8');
}

for (const page of pages) {
  const sourcePath = path.join(publicDir, ...page.source.split('/'));
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, shimHtml(page), 'utf8');
}

console.log(`Restructured ${pages.length} pages into public/pages, public/css/pages, and public/js/pages.`);
