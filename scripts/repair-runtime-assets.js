const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');

const directAssets = [
  '/assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/webpack-runtime.e9817151.bundle.min.js',
  '/assets/mirror/static.parastorage.com/services/wix-thunderbolt/dist/thunderbolt-css.80a7df57.bundle.min.js',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function localPathFromMirrorUrl(urlPath) {
  return path.join(publicDir, ...urlPath.replace(/^\/+/, '').split('/'));
}

function safePart(value) {
  return String(value || 'unknown')
    .replace(/%2F/gi, '_')
    .replace(/[\\/:*?"<>|&=]/g, '_');
}

function urlPathFromThunderboltQuery(query) {
  const params = new URLSearchParams(query.replace(/^.*\?/, '').replace(/&amp;/g, '&'));
  const module = params.get('module');
  const pageId = params.get('pageId');
  const device = params.get('formFactor') || params.get('deviceType');
  const fileId = params.get('fileId');
  if (!module || !pageId || !device || !fileId) return null;
  const filename = [module, pageId, device, fileId].map(safePart).join('--');
  return `/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/${filename}.json`;
}

function remoteUrlFromMirrorUrl(urlPath) {
  const thunderboltPrefix = '/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/';
  if (urlPath.startsWith(thunderboltPrefix)) {
    const filename = path.basename(urlPath, '.json');
    const parts = filename.split('--');
    if (parts.length === 4) {
      const [module, pageId, formFactor, fileId] = parts;
      const params = new URLSearchParams({ module, pageId, formFactor, fileId });
      return `https://siteassets.parastorage.com/pages/pages/thunderbolt?${params.toString()}`;
    }
  }
  return `https://${urlPath.replace(/^\/assets\/mirror\//, '')}`;
}

function collectRuntimeAssets() {
  const assets = new Set(directAssets);
  const moduleHashes = new Map([
    ['thunderbolt-css', 'f96af96f.bundle.min'],
    ['thunderbolt-css-mappers', 'e0e3f412.bundle.min'],
    ['thunderbolt-features', 'f145183b.bundle.min'],
    ['thunderbolt-platform', '1645f6a3.bundle.min'],
  ]);
  const addThunderboltVariant = (module, pageJsonFileName, fileId) => {
    const normalized = String(pageJsonFileName || '').replace(/\.json$/, '');
    if (!module || !normalized || !fileId) return;
    const filename = [module, `${normalized}.json`, 'desktop', fileId].map(safePart).join('--');
    assets.add(`/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/${filename}.json`);
  };
  const addCssVariants = pageJsonFileName => {
    addThunderboltVariant('thunderbolt-css', pageJsonFileName, moduleHashes.get('thunderbolt-css'));
    addThunderboltVariant('thunderbolt-css-mappers', pageJsonFileName, moduleHashes.get('thunderbolt-css-mappers'));
  };
  for (const file of walk(pagesDir).filter(file => file.endsWith('.html'))) {
    const html = fs.readFileSync(file, 'utf8');
    for (const scriptId of ['wix-viewer-model', 'wix-essential-viewer-model']) {
      const scriptStart = html.indexOf(`id="${scriptId}"`);
      if (scriptStart < 0) continue;
      const contentStart = html.indexOf('>', scriptStart) + 1;
      const contentEnd = html.indexOf('</script>', contentStart);
      if (!contentStart || contentEnd < 0) continue;
      let model;
      try {
        model = JSON.parse(html.slice(contentStart, contentEnd));
      } catch (_) {
        continue;
      }
      const pagesMap = model.siteFeaturesConfigs?.router?.pagesMap || model.siteFeaturesConfigs?.pagesMap || {};
      for (const pageConfig of Object.values(pagesMap)) {
        addCssVariants(pageConfig?.pageJsonFileName);
      }
      const hashes =
        model.manifests?.node?.modulesToHashes ||
        model.manifests?.web?.modulesToHashes ||
        model.siteAssets?.modulesParams?.pilerSiteAssets?.modulesToHashes;
      let parsedHashes = hashes;
      if (typeof hashes === 'string') {
        try {
          parsedHashes = JSON.parse(hashes);
        } catch (_) {
          parsedHashes = null;
        }
      }
      if (parsedHashes && typeof parsedHashes === 'object') {
        for (const [module, fileId] of Object.entries(parsedHashes)) {
          if (!moduleHashes.has(module)) continue;
          moduleHashes.set(module, fileId);
          for (const pageConfig of Object.values(pagesMap)) {
            addThunderboltVariant(module, pageConfig?.pageJsonFileName, fileId);
          }
        }
      }
    }
    for (const match of html.matchAll(/"pageJsonFileName"\s*:\s*"([^"]+)"/g)) {
      addCssVariants(match[1]);
    }
    for (const match of html.matchAll(/thunderbolt-(?:features|platform)--([^"]+?\.json)--desktop--/g)) {
      addCssVariants(match[1]);
    }
    for (const match of html.matchAll(/\/assets\/mirror\/siteassets\.parastorage\.com\/pages\/pages\/thunderbolt\?[^"'<>\s]+/g)) {
      const asset = urlPathFromThunderboltQuery(match[0]);
      if (asset) assets.add(asset);
    }
    for (const match of html.matchAll(/https:\\?\/\\?\/siteassets\.parastorage\.com\\?\/pages\\?\/pages\\?\/thunderbolt\?[^"'<>\s]+/g)) {
      const asset = urlPathFromThunderboltQuery(match[0].replace(/\\\//g, '/'));
      if (asset) assets.add(asset);
    }
  }
  return [...assets].sort();
}

async function download(urlPath) {
  const outputPath = localPathFromMirrorUrl(urlPath);
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
    return { urlPath, status: 'exists' };
  }

  const remoteUrl = remoteUrlFromMirrorUrl(urlPath);
  const response = await fetch(remoteUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 static-mirror-repair',
      accept: '*/*',
    },
  });
  if (!response.ok) {
    if (urlPath.includes('/pages/pages/thunderbolt/')) {
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      const fallback = '{}\n';
      fs.writeFileSync(outputPath, fallback, 'utf8');
      return { urlPath, status: 'fallback', bytes: Buffer.byteLength(fallback) };
    }
    throw new Error(`Failed ${response.status} ${remoteUrl}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return { urlPath, status: 'downloaded', bytes: buffer.length };
}

async function main() {
  const assets = collectRuntimeAssets();
  let downloaded = 0;
  let fallback = 0;
  let existing = 0;
  for (const asset of assets) {
    const result = await download(asset);
    if (result.status === 'downloaded') {
      downloaded++;
      console.log(`Downloaded ${asset} (${result.bytes} bytes)`);
    } else if (result.status === 'fallback') {
      fallback++;
      console.log(`Created local fallback ${asset}`);
    } else {
      existing++;
    }
  }
  console.log(`Runtime asset repair complete: ${downloaded} downloaded, ${fallback} fallback JSON files, ${existing} already present.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
