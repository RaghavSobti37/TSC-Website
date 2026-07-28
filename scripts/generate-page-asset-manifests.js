const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');
const outputDir = path.join(publicDir, 'assets', 'pages');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function assetType(assetPath) {
  const lower = assetPath.toLowerCase();
  if (/\.(png|jpe?g|webp|avif|gif|svg)(?:$|[?#])/.test(lower)) return 'images';
  if (/\.(mp4|webm|mov)(?:$|[?#])/.test(lower)) return 'videos';
  if (/\.(woff2?|ttf|eot|otf)(?:$|[?#])/.test(lower)) return 'fonts';
  if (/\.css(?:$|[?#])/.test(lower)) return 'styles';
  if (/\.js(?:$|[?#])/.test(lower)) return 'scripts';
  if (/\.json(?:$|[?#])/.test(lower)) return 'runtime';
  return 'other';
}

function localStatus(assetPath) {
  if (assetPath === '/assets/mirror/disabled-telemetry') {
    return { exists: true, virtual: true, path: assetPath };
  }
  const cleanPath = decodeURIComponent(assetPath.split(/[?#]/)[0]);
  const staticMedia = cleanPath.match(/^\/assets\/mirror\/static\.wixstatic\.com\/media\/([^/]+)\/v1\//);
  const localPath = staticMedia
    ? path.join(publicDir, 'assets', 'mirror', 'static.wixstatic.com', 'original-media', staticMedia[1])
    : path.join(publicDir, ...cleanPath.replace(/^\/+/, '').split('/'));

  if (fs.existsSync(localPath)) {
    return {
      exists: true,
      path: `/${path.relative(publicDir, localPath).replace(/\\/g, '/')}`,
      bytes: fs.statSync(localPath).size,
    };
  }
  return { exists: false, path: `/${path.relative(publicDir, localPath).replace(/\\/g, '/')}` };
}

function collectAssets(pageSlug, html) {
  const assets = new Set();
  const pageCssPath = path.join(publicDir, 'css', 'pages', `${pageSlug}.css`);
  const pageJsPath = path.join(publicDir, 'js', 'pages', `${pageSlug}.animations.js`);
  if (fs.existsSync(pageCssPath)) assets.add(`/css/pages/${pageSlug}.css`);
  if (fs.existsSync(pageJsPath)) assets.add(`/js/pages/${pageSlug}.animations.js`);

  const blobs = [html];
  if (fs.existsSync(pageCssPath)) blobs.push(fs.readFileSync(pageCssPath, 'utf8'));

  for (const blob of blobs) {
    for (const match of blob.matchAll(/\/assets\/mirror\/[^"'<>)\s\\]+/g)) {
      const asset = match[0].replace(/&amp;/g, '&').replace(/\*\/$/, '');
      if (/\.map$/i.test(asset)) continue;
      assets.add(asset);
    }
  }

  return [...assets].sort().map(assetPath => ({
    type: assetType(assetPath),
    url: assetPath,
    local: localStatus(assetPath),
  }));
}

function groupedManifest(pageSlug, htmlFile) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const assets = collectAssets(pageSlug, html);
  const grouped = {
    page: pageSlug,
    html: `/pages/${path.basename(htmlFile)}`,
    css: `/css/pages/${pageSlug}.css`,
    animations: `/js/pages/${pageSlug}.animations.js`,
    generatedAt: new Date().toISOString(),
    totals: {
      assets: assets.length,
      missing: assets.filter(asset => !asset.local.exists).length,
    },
    assetsByType: {},
  };
  for (const asset of assets) {
    if (!grouped.assetsByType[asset.type]) grouped.assetsByType[asset.type] = [];
    grouped.assetsByType[asset.type].push(asset);
  }
  return grouped;
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const manifests = [];
  for (const htmlFile of walk(pagesDir).filter(file => file.endsWith('.html'))) {
    const pageSlug = path.basename(htmlFile, '.html') === 'home' ? 'home' : path.basename(htmlFile, '.html');
    const pageDir = path.join(outputDir, pageSlug);
    fs.mkdirSync(pageDir, { recursive: true });
    const manifest = groupedManifest(pageSlug, htmlFile);
    fs.writeFileSync(path.join(pageDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    manifests.push({
      page: pageSlug,
      manifest: `/assets/pages/${pageSlug}/manifest.json`,
      assets: manifest.totals.assets,
      missing: manifest.totals.missing,
    });
  }
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), `${JSON.stringify({ pages: manifests }, null, 2)}\n`, 'utf8');
  console.log(`Generated ${manifests.length} page asset manifests.`);
}

main();
