const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const productionOrigin = 'https://wix-site-clone-psi.vercel.app';
const requiredFiles = [
  'index.html',
  'about/index.html',
  'work/index.html',
  'artists/index.html',
  'artist-path/index.html',
  'learn-with-tsc/index.html',
  'films/index.html',
  'resources/index.html',
  'academy/index.html',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'favicon.ico',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/module-executor.81334661.chunk.min.js',
  'assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/clientWorker.196162d7.bundle.min.js',
];

const routeFiles = new Map([
  ['index.html', '/'],
  ['about/index.html', '/about'],
  ['work/index.html', '/work'],
  ['artists/index.html', '/artists'],
  ['artist-path/index.html', '/artist-path'],
  ['learn-with-tsc/index.html', '/learn-with-tsc'],
  ['films/index.html', '/films'],
  ['resources/index.html', '/resources'],
  ['academy/index.html', '/academy'],
]);

for (const file of requiredFiles) {
  const fullPath = path.join(publicDir, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing required static output: ${file}`);
    process.exit(1);
  }
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
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(publicDir, file).replace(/\\/g, '/');
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
