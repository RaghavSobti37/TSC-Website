const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const productionOrigin = 'https://wix-site-clone-psi.vercel.app';
const filmsCssOverrideMarker = '/* TSC films page copy/layout overrides */';
const filmsCssOverrides = `
${filmsCssOverrideMarker}
#comp-mqktsjdh {
  display: none !important;
  height: 0 !important;
  min-height: 0 !important;
  overflow: hidden !important;
  visibility: hidden !important;
}

#comp-mqmk8hzp {
  width: max-content !important;
  max-width: none !important;
  min-width: max-content !important;
  overflow: visible !important;
}

#comp-mqmk8hzp .wixui-rich-text__text {
  display: block !important;
  white-space: nowrap !important;
  word-break: keep-all !important;
  overflow-wrap: normal !important;
  overflow: visible !important;
}
`;
const requiredFiles = [
  'pages/home.html',
  'pages/about.html',
  'pages/work.html',
  'pages/artists.html',
  'pages/artist-path.html',
  'pages/learn-with-tsc.html',
  'pages/films.html',
  'pages/resources.html',
  'pages/academy.html',
  'css/pages/home.css',
  'css/pages/about.css',
  'css/pages/work.css',
  'css/pages/artists.css',
  'css/pages/artist-path.css',
  'css/pages/learn-with-tsc.css',
  'css/pages/films.css',
  'css/pages/resources.css',
  'css/pages/academy.css',
  'js/pages/home.animations.js',
  'js/pages/about.animations.js',
  'js/pages/work.animations.js',
  'js/pages/artists.animations.js',
  'js/pages/artist-path.animations.js',
  'js/pages/learn-with-tsc.animations.js',
  'js/pages/films.animations.js',
  'js/pages/resources.animations.js',
  'js/pages/academy.animations.js',
  'robots.txt',
  'sitemap.xml',
  'sitemap-pages.xml',
  'llms.txt',
  'llms-full.txt',
  'about.md',
  'site/README.md',
  'site/about/content.md',
  'site.webmanifest',
  'favicon.ico',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/module-executor.81334661.chunk.min.js',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/clientWorker.196162d7.bundle.min.js',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/webpack-runtime.e9817151.bundle.min.js',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/thunderbolt-css.80a7df57.bundle.min.js',
  'assets/pages/manifest.json',
];

const routeFiles = new Map([
  ['pages/home.html', '/'],
  ['pages/about.html', '/about'],
  ['pages/work.html', '/work'],
  ['pages/artists.html', '/artists'],
  ['pages/artist-path.html', '/artist-path'],
  ['pages/learn-with-tsc.html', '/learn-with-tsc'],
  ['pages/films.html', '/films'],
  ['pages/resources.html', '/resources'],
  ['pages/academy.html', '/academy'],
]);

for (const file of requiredFiles) {
  const fullPath = path.join(publicDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing required static output: ${file}`);
    process.exit(1);
  }
}

const filmsCssPath = path.join(publicDir, 'css', 'pages', 'films.css');
let filmsCss = fs.readFileSync(filmsCssPath, 'utf8');
if (!filmsCss.includes(filmsCssOverrideMarker)) {
  fs.writeFileSync(filmsCssPath, `${filmsCss.trimEnd()}\n\n${filmsCssOverrides}`, 'utf8');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

const htmlFiles = walk(publicDir).filter(file => file.endsWith('.html'));
const videoReferences = new Set();
const academyFaviconRoutes = new Set([
  '/academy',
  '/learn-with-tsc',
  '/the-heart-of-composition',
  '/blank-9',
  '/about-9',
  '/roots-of-hindustani-classical',
  '/blank-9-1',
  '/about-9-1',
  '/book-a-call',
  '/blank-8',
  '/about-8',
  '/masterclass-review01',
  '/masterclass-review02',
  '/classicalreview'
]);

function routeFromRelativeFile(relativeFile) {
  if (relativeFile === 'index.html' || relativeFile === 'pages/home.html') return '/';
  if (relativeFile.startsWith('pages/') && relativeFile.endsWith('.html')) {
    return `/${path.basename(relativeFile, '.html')}`;
  }
  if (relativeFile.endsWith('/index.html')) {
    return `/${relativeFile.slice(0, -'/index.html'.length)}`;
  }
  return null;
}

function faviconBlockForRoute(route) {
  const academy = academyFaviconRoutes.has(route);
  const key = academy ? 'academy' : 'tsc';
  return [
    `<link rel="icon" href="/assets/brand/${key}-favicon-32.png" type="image/png" sizes="32x32">`,
    `<link rel="apple-touch-icon" href="/assets/brand/${key}-apple-touch-icon.png" sizes="180x180">`
  ].join('\n  ');
}

function normalizeFavicons(html, relativeFile) {
  const route = routeFromRelativeFile(relativeFile) || '/';
  const withoutIcons = html
    .replace(/\s*<!--\s*<link\s+rel=["']mask-icon["'][\s\S]*?-->/gi, '')
    .replace(/\s*<!--\s*Safari Pinned Tab Icon\s*-->/gi, '')
    .replace(/\s*<link\s+rel=["'](?:shortcut icon|icon|apple-touch-icon|mask-icon)["'][^>]*>/gi, '');
  return withoutIcons.replace('</head>', `  ${faviconBlockForRoute(route)}\n</head>`);
}

for (const file of htmlFiles) {
  let html = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(publicDir, file).replace(/\\/g, '/');
  const normalizedHtml = normalizeFavicons(html, relativeFile);
  if (normalizedHtml !== html) {
    fs.writeFileSync(file, normalizedHtml, 'utf8');
    html = normalizedHtml;
  }
  const routePath = routeFiles.get(relativeFile);
  if (routePath && (html.length < 100000 || !html.includes('id="site-root"'))) {
    console.error(`Incomplete rendered page found in ${relativeFile}`);
    process.exit(1);
  }
  if (routePath) {
    const requestUrl = `"requestUrl":"${productionOrigin.replace(/\//g, '\\/')}${(routePath === '/' ? '/' : routePath).replace(/\//g, '\\/')}"`;
    if (!html.includes(requestUrl)) {
      console.error(`Invalid canonical runtime URL found in ${relativeFile}`);
      process.exit(1);
    }
    if (!html.includes('model.site.externalBaseUrl = origin') || !html.includes('model.requestUrl = new URL(location.pathname + location.search, origin).href') || !html.includes('data-tsc-runtime-config') || !html.includes('data-tsc-standalone-runtime')) {
      console.error(`Dynamic Thunderbolt origin bootstrap is missing in ${relativeFile}`);
      process.exit(1);
    }
    if (html.includes('access-tokens.json.json')) {
      console.error(`Duplicated access-token extension found in ${relativeFile}`);
      process.exit(1);
    }
    const viewerModelStart = html.indexOf('id="wix-viewer-model"');
    const viewerModelContentStart = html.indexOf('>', viewerModelStart) + 1;
    const viewerModelEnd = html.indexOf('</script>', viewerModelContentStart);
    if (viewerModelStart < 0 || viewerModelContentStart === 0 || viewerModelEnd < 0) {
      console.error(`Wix runtime model is missing in ${relativeFile}`);
      process.exit(1);
    }
    const viewerModel = JSON.parse(html.slice(viewerModelContentStart, viewerModelEnd));
    const routeKey = routePath === '/' ? './' : `.${routePath}`;
    if (!viewerModel.siteFeaturesConfigs?.router?.routes?.[routeKey]) {
      console.error(`Clean Thunderbolt route ${routeKey} is missing in ${relativeFile}`);
      process.exit(1);
    }
    const externalScripts = (html.match(/<script\b[^>]*\bsrc=/gi) || []).length;
    const hasReactCallback = /onload="resolveExternalsRegistryModule\('react'\)"[^>]*react@18\.3\.1/i.test(html);
    const hasReactDomCallback = /onload="resolveExternalsRegistryModule\('reactDOM'\)"[^>]*react-dom@18\.3\.1/i.test(html);
    if (externalScripts > 15 || !hasReactCallback || !hasReactDomCallback || /crossorigin=""(?:react|reactDOM)/i.test(html)) {
      console.error(`Invalid Thunderbolt bootstrap scripts found in ${relativeFile}`);
      process.exit(1);
    }
  }
  for (const match of html.matchAll(/video\/[a-zA-Z0-9_]+\/(?:360p|480p|720p|1080p)\/mp4\/file\.mp4/g)) {
    videoReferences.add(match[0]);
  }
  if (html.includes('SENTRY_SDK_SOURCE')) {
    console.error(`Wix Sentry loader found in ${relativeFile}`);
    process.exit(1);
  }
  if (/href=["']https:\/\/meghanabhawalkarwo\.wixstudio\.com/i.test(html)) {
    console.error(`Hardcoded Wix page link found in ${path.relative(publicDir, file)}`);
    process.exit(1);
  }
  if (/href=["'](?:https?:)?\/\/wix\.com\/studio/i.test(html)) {
    console.error(`Wix badge link found in ${path.relative(publicDir, file)}`);
    process.exit(1);
  }
}

for (const reference of videoReferences) {
  const file = path.join(publicDir, 'assets', 'mirror', 'video.wixstatic.com', ...reference.split('/'));
  if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
    console.error(`Missing mirrored video rendition: ${reference}`);
    process.exit(1);
  }
}

const workerPath = path.join(publicDir, 'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/clientWorker.196162d7.bundle.min.js');
const worker = fs.readFileSync(workerPath, 'utf8');
if ((worker.match(/\/\* tsc-independent-worker \*\//g) || []).length < 2) {
  console.error('Independent worker guards are missing');
  process.exit(1);
}

const thunderboltDir = path.join(publicDir, 'assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt');
const thunderboltVariants = fs.existsSync(thunderboltDir)
  ? fs.readdirSync(thunderboltDir).filter(file => file.endsWith('.json'))
  : [];
if (thunderboltVariants.length < 20) {
  console.error('Per-page Thunderbolt runtime payloads are incomplete');
  process.exit(1);
}

const originalMediaDir = path.join(publicDir, 'assets/mirror/static.wixstatic.com/original-media');
const originalMedia = fs.existsSync(originalMediaDir) ? fs.readdirSync(originalMediaDir) : [];
if (originalMedia.length < 60) {
  console.error('Local responsive-media fallbacks are incomplete');
  process.exit(1);
}

console.log(`Static build verified: ${htmlFiles.length} HTML pages ready for Vercel.`);
