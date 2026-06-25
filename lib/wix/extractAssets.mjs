import fs from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const WIX_MEDIA_RE = /https?:\/\/static\.wixstatic\.com\/media\/([a-zA-Z0-9_~.-]+)/g;
const URI_RE = /19f989_[a-f0-9]+~mv2\.(jpg|jpeg|png|webp|gif|avif)/gi;

/**
 * @param {string} html
 */
export function collectAssetUris(html) {
  const fromCdn = [...html.matchAll(WIX_MEDIA_RE)].map((m) => m[1]);
  const fromJson = [...html.matchAll(URI_RE)].map((m) => m[0]);
  return [...new Set([...fromCdn, ...fromJson])];
}

/**
 * @param {string} uri e.g. 19f989_xxx~mv2.jpg
 */
export function wixCdnUrl(uri) {
  const clean = uri.split('/').pop();
  return `https://static.wixstatic.com/media/${clean}`;
}

/**
 * @param {string} exportDir folder containing saved Wix _files
 * @param {string[]} uris
 */
export function findLocalAsset(exportDir, uri) {
  const base = uri.split('/').pop();
  if (!base) return null;
  const exact = path.join(exportDir, base);
  if (fs.existsSync(exact)) return exact;

  const files = fs.readdirSync(exportDir);
  const hit = files.find((f) => f.includes(base.replace(/~mv2\.\w+$/, '')) || f === base);
  return hit ? path.join(exportDir, hit) : null;
}

async function download(url, dest) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(res.body, createWriteStream(dest));
}

/**
 * @param {object} opts
 * @param {string} opts.html
 * @param {string} opts.exportDir
 * @param {string} opts.publicDir e.g. public/images/wix/harshadduhita
 * @param {Record<string, string>} [opts.aliases] friendly name -> uri fragment
 */
export async function materializeAssets({ html, exportDir, publicDir, aliases = {} }) {
  fs.mkdirSync(publicDir, { recursive: true });

  const uris = collectAssetUris(html);
  /** @type {import('./types.mjs').WixImportResult['assets']} */
  const assets = [];

  for (const uri of uris) {
    const filename = uri.split('/').pop() || uri;
    const dest = path.join(publicDir, filename);
    const local = findLocalAsset(exportDir, uri);

    if (local && !fs.existsSync(dest)) {
      fs.copyFileSync(local, dest);
      assets.push({ uri, localPath: dest.replace(/\\/g, '/'), source: 'local' });
    } else if (!fs.existsSync(dest)) {
      try {
        await download(wixCdnUrl(uri), dest);
        assets.push({ uri, localPath: dest.replace(/\\/g, '/'), source: 'cdn' });
      } catch (e) {
        console.warn('asset skip', filename, String(e.message || e));
      }
    } else {
      assets.push({ uri, localPath: dest.replace(/\\/g, '/'), source: 'local' });
    }
  }

  // Copy friendly-named local files from export (browser save uses human names)
  const friendly = fs.readdirSync(exportDir).filter((f) => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(f));
  for (const f of friendly) {
    const dest = path.join(publicDir, f.replace(/\s+/g, '-'));
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(path.join(exportDir, f), dest);
    }
  }

  for (const [alias, fragment] of Object.entries(aliases)) {
    const match = assets.find((a) => a.uri.includes(fragment)) || assets.find((a) => a.uri === fragment);
    const src = match
      ? match.localPath
      : findLocalAsset(exportDir, fragment);
    if (!src) continue;
    const ext = path.extname(typeof src === 'string' && src.includes('/') ? src : fragment) || path.extname(String(src));
    const aliasPath = path.join(publicDir, `${alias}${ext.includes('.') ? ext : '.jpg'}`);
    if (!fs.existsSync(aliasPath)) {
      fs.copyFileSync(typeof src === 'string' && fs.existsSync(src) ? src : path.join(exportDir, path.basename(src)), aliasPath);
      assets.push({ uri: fragment, localPath: aliasPath.replace(/\\/g, '/'), source: 'alias' });
    }
  }

  return assets;
}
