/**
 * Speed up the first paint of each page's hero image.
 *
 * The mirrored Wix pages ship the hero <img> as a ~150px blurred placeholder with
 * loading="lazy"; the sharp image only arrives after the Wix runtime hydrates
 * (~7s on a throttled phone). For the first image inside <main> we:
 *   - load it eagerly with high priority, and
 *   - request a sharp, sensibly sized rendition of the same image and crop.
 * Wix still swaps in its own rendition later; this only removes the blurry wait.
 * Idempotent: images already upgraded (no "blur_" in the URL) are left alone.
 *
 * Usage: node scripts/optimize-hero-images.cjs   (run from the repo root)
 */
const fs = require('fs');
const path = require('path');

const pagesDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, '..', 'public', 'pages');
// Pages whose first <wow-image> is a hidden duplicate hero: name the real one.
const HERO_IMAGE_ID = { 'yugm.html': 'img-comp-mqhqa6y01' };
// Pages that set their own hero image (sadhu-tiwari swaps in its artist photo).
const SKIP = new Set(['sadhu-tiwari.html']);

function decodeAttr(value) {
  return value.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
}

// Rebuild the Wix transform segment ("v1/fill/..." or "v1/crop/.../fill/...") at a larger size.
function upgradeUrl(src, info, targetWidth) {
  const TARGET_WIDTH = targetWidth;
  const m = src.match(/^(.*?\/v1\/)(.+?)\/([^/]+)$/);
  if (!m || !/blur_\d/.test(m[2])) return null;
  const [, prefix, transform, file] = m;
  const parts = transform.split('/');
  const out = [];
  for (let i = 0; i < parts.length; i += 2) {
    const op = parts[i];
    const params = Object.fromEntries((parts[i + 1] || '').split(',').map((kv) => {
      const at = kv.indexOf('_');
      return at === -1 ? [kv, ''] : [kv.slice(0, at), kv.slice(at + 1)];
    }));
    delete params.blur;
    if (op === 'fill') {
      const w = Number(params.w), h = Number(params.h);
      if (!w || !h) return null;
      const scale = TARGET_WIDTH / w;
      params.w = String(TARGET_WIDTH);
      params.h = String(Math.round(h * scale));
      params.q = params.q || '80';
    } else if (op === 'crop' && parts.length === 2) {
      // Pattern/tile crops: widen the crop around the same centre, within the source image.
      const W = info && info.width, H = info && info.height;
      const w = Number(params.w), h = Number(params.h), x = Number(params.x), y = Number(params.y);
      if (!W || !H || !w || !h) return null;
      const scale = Math.min(TARGET_WIDTH / w, W / w, H / h);
      const nw = Math.round(w * scale), nh = Math.round(h * scale);
      const cx = x + w / 2, cy = y + h / 2;
      params.x = String(Math.max(0, Math.min(W - nw, Math.round(cx - nw / 2))));
      params.y = String(Math.max(0, Math.min(H - nh, Math.round(cy - nh / 2))));
      params.w = String(nw);
      params.h = String(nh);
    }
    out.push(op, Object.entries(params).map(([k, v]) => (v === '' ? k : k + '_' + v)).join(','));
  }
  return prefix + out.join('/') + '/' + file;
}

let changed = 0;
for (const name of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  if (SKIP.has(name)) continue;
  const file = path.join(pagesDir, name);
  const html = fs.readFileSync(file, 'utf8');
  const mainAt = html.indexOf('<main');
  if (mainAt === -1) continue;
  const wowAt = HERO_IMAGE_ID[name]
    ? html.indexOf('<wow-image id="' + HERO_IMAGE_ID[name] + '"', mainAt)
    : html.indexOf('<wow-image', mainAt);
  if (wowAt === -1) continue;
  const wowTag = html.slice(wowAt, html.indexOf('>', wowAt) + 1);
  const infoMatch = wowTag.match(/data-image-info="([^"]+)"/);
  let info = null;
  try { info = infoMatch ? JSON.parse(decodeAttr(infoMatch[1])).imageData : null; } catch (e) { info = null; }
  const imgAt = html.indexOf('<img', wowAt);
  const imgEnd = html.indexOf('>', imgAt) + 1;
  if (imgAt === -1 || imgAt > html.indexOf('</wow-image>', wowAt)) continue;
  let img = html.slice(imgAt, imgEnd);
  const srcMatch = img.match(/\ssrc="([^"]+)"/);
  if (!srcMatch) continue;
  // Photos ("fill"): responsive renditions, so phones fetch ~480-800px and desktops up to 1600px.
  // Tiled patterns (pure "crop", shown with object-fit:none) keep one natural-scale crop,
  // because width descriptors would rescale the pattern.
  const isPatternCrop = /\/v1\/crop\/[^/]+\/[^/]+$/.test(srcMatch[1]);
  if (isPatternCrop) {
    const one = upgradeUrl(srcMatch[1], info, 1600);
    if (!one) continue;
    img = img.replace(srcMatch[0], ' src="' + one + '"')
      .replace(/\sloading="lazy"/, ' loading="eager"')
      .replace(/\swidth="\d+"/, '').replace(/\sheight="\d+"/, '');
    if (!/fetchpriority=/.test(img)) img = img.replace('<img', '<img fetchpriority="high"');
    fs.writeFileSync(file, html.slice(0, imgAt) + img + html.slice(imgEnd), 'utf8');
    changed += 1;
    continue;
  }
  const widths = [480, 800, 1200, 1600];
  const variants = widths.map((w) => [w, upgradeUrl(srcMatch[1], info, w)]).filter((v) => v[1]);
  if (!variants.length) continue;
  const next = variants.find((v) => v[0] === 800)[1];
  const srcset = variants.map(([w, url]) => url + ' ' + w + 'w').join(', ');
  img = img.replace(srcMatch[0], ' src="' + next + '" srcset="' + srcset + '" sizes="100vw"')
    .replace(/\sloading="lazy"/, ' loading="eager"')
    .replace(/\swidth="\d+"/, '').replace(/\sheight="\d+"/, '');
  if (!/fetchpriority=/.test(img)) img = img.replace('<img', '<img fetchpriority="high"');
  fs.writeFileSync(file, html.slice(0, imgAt) + img + html.slice(imgEnd), 'utf8');
  changed += 1;
}
console.log('Hero images optimised on ' + changed + ' page(s).');
