/**
 * Asset Optimization Script
 *
 * Performs:
 * 1. Compresses JPEG/PNG in media/ + original-media/
 * 2. Resizes original-media to 2x display size (parsed from HTML URLs)
 * 3. Generates WebP copies alongside all JPEG/PNG originals
 * 4. Compresses videos via ffmpeg
 * 5. Adds lazy loading, fetchpriority, preconnect, defer JS to HTML
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const assetsDir = path.join(publicDir, 'assets', 'mirror');
const originalMediaDir = path.join(assetsDir, 'static.wixstatic.com', 'original-media');
const mediaDir = path.join(assetsDir, 'static.wixstatic.com', 'media');

const PRECONNECT_ORIGINS = [
  { href: 'https://video.wixstatic.com' },
];

let savedBytes = 0;
let optimizedCount = 0;

function walkDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walkDir(fullPath));
    else results.push(fullPath);
  }
  return results;
}

/**
 * Get resize dimensions that cap at maxDim, preserving aspect ratio.
 */
function getResizeDims(meta, maxDim) {
  if (!meta || !meta.width || !meta.height) return null;
  const longest = Math.max(meta.width, meta.height);
  if (longest <= maxDim) return null;
  const scale = maxDim / longest;
  return {
    width: Math.round(meta.width * scale),
    height: Math.round(meta.height * scale),
  };
}

/**
 * Compress JPEG (and optionally resize). Also generates .webp version alongside.
 */
async function optimizeJPEG(filePath, quality = 75, maxDim = null) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size < 5 * 1024) return 0;
    const originalSize = stat.size;
    const meta = await sharp(filePath).metadata();
    const resize = maxDim ? getResizeDims(meta, maxDim) : null;

    const tempPath = filePath + '.opt';
    let pipeline = sharp(filePath);
    if (resize) pipeline = pipeline.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
    await pipeline.jpeg({ quality, mozjpeg: true, progressive: true }).toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;
    if (newSize < originalSize * 0.85) {
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      savedBytes += originalSize - newSize;
      optimizedCount++;

      // Generate WebP version alongside
      try {
        const webpPath = filePath.replace(/\.(jpg|jpeg)$/i, '.webp');
        if (!fs.existsSync(webpPath)) {
          let wp = sharp(filePath);
          if (resize) wp = wp.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
          await wp.webp({ quality }).toFile(webpPath);
        }
      } catch (_) {}

      return originalSize - newSize;
    }
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  } catch (_) {}
  return 0;
}

/**
 * Compress PNG (and optionally resize). Also generates .webp version alongside.
 */
async function optimizePNG(filePath, maxDim = null) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size < 5 * 1024) return 0;
    const originalSize = stat.size;
    const meta = await sharp(filePath).metadata();
    const resize = maxDim ? getResizeDims(meta, maxDim) : null;

    const tempPath = filePath + '.opt';
    let pipeline = sharp(filePath);
    if (resize) pipeline = pipeline.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;
    if (newSize < originalSize * 0.85) {
      fs.unlinkSync(filePath);
      fs.renameSync(tempPath, filePath);
      savedBytes += originalSize - newSize;
      optimizedCount++;

      // Generate WebP version alongside
      try {
        const webpPath = filePath.replace(/\.png$/i, '.webp');
        if (!fs.existsSync(webpPath)) {
          let wp = sharp(filePath);
          if (resize) wp = wp.resize(resize.width, resize.height, { fit: 'inside', withoutEnlargement: true });
          await wp.webp({ quality: Math.min(80, quality || 80) }).toFile(webpPath);
        }
      } catch (_) {}

      return originalSize - newSize;
    }
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  } catch (_) {}
  return 0;
}

/**
 * Compress video via ffmpeg.
 */
function optimizeVideo(filePath) {
  if (!filePath.endsWith('.mp4') || filePath.includes('.optimized.mp4')) return 0;
  const stat = fs.statSync(filePath);
  if (stat.size < 100 * 1024) return 0;
  const originalSize = stat.size;
  const tempPath = filePath + '.optimized.mp4';
  try {
    execSync(`ffmpeg -y -i "${filePath}" -c:v libx264 -crf 28 -preset medium -movflags +faststart -c:a aac -b:a 64k "${tempPath}" 2>&1`, { stdio: 'pipe', timeout: 120000 });
    if (fs.existsSync(tempPath)) {
      const newSize = fs.statSync(tempPath).size;
      if (newSize < originalSize * 0.9) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        const saved = originalSize - newSize;
        console.log(`  Video: ${path.basename(path.dirname(path.dirname(path.dirname(filePath))))}/${path.basename(path.dirname(filePath))} (${(originalSize/1024/1024).toFixed(1)}MB -> ${(newSize/1024/1024).toFixed(1)}MB, -${(saved/1024/1024).toFixed(1)}MB)`);
        return saved;
      }
      fs.unlinkSync(tempPath);
    }
  } catch (_) {
    if (fs.existsSync(tempPath)) try { fs.unlinkSync(tempPath); } catch (_) {}
  }
  return 0;
}

/**
 * Find the maximum display dimensions for each image asset across all HTML pages.
 * Returns Map<assetHash, { width, height }>
 */
function findDisplayDimensions(htmlFiles) {
  const dims = new Map();
  // Match: w_147,h_98 anywhere in URL paths before the image filename
  const re = /([a-f0-9]+_[a-f0-9]+(?:_[a-f0-9]+)*)(?:~mv2\.[a-z]+)?\/[^/]*\/w_(\d+),h_(\d+)/gi;
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = re.exec(content)) !== null) {
      const hash = m[1].toLowerCase();
      const w = parseInt(m[2], 10);
      const h = parseInt(m[3], 10);
      if (!dims.has(hash) || (w * h) > (dims.get(hash).width * dims.get(hash).height)) {
        dims.set(hash, { width: w, height: h });
      }
    }
  }
  return dims;
}

/**
 * Optimize HTML: preconnect, lazy loading, fetchpriority, defer JS
 */
function optimizeHTML(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Preconnect (only video.wixstatic.com — other origins are proxied through mirror)
  if (!html.includes('rel="preconnect"')) {
    let tags = '';
    for (const origin of PRECONNECT_ORIGINS) {
      const tag = `<link rel="preconnect" href="${origin.href}" crossorigin>`;
      if (!html.includes(tag)) { tags += `  ${tag}\n  `; modified = true; }
    }
    if (tags) html = html.replace('<meta name="generator"', `${tags}<meta name="generator"`);
  }

  // 2. Collect all img tags
  const imgTags = [];
  const imgRe = /<img\s[^>]*src=["'][^"']+["'][^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html)) !== null) imgTags.push({ tag: m[0], index: m.index });

  // 3. Find hero
  let heroIdx = -1;
  for (let i = 0; i < imgTags.length; i++) {
    const tag = imgTags[i].tag;
    const src = (tag.match(/src=["']([^"']+)["']/) || [])[1] || '';
    if (/(pixel|track|icon|favicon|spacer)/i.test(src)) continue;
    if (/^data:/i.test(src) || src.endsWith('.svg')) continue;
    heroIdx = i; break;
  }

  // 4. Add loading + fetchpriority
  for (let i = 0; i < imgTags.length; i++) {
    const { tag, index } = imgTags[i];
    let newTag = tag;
    if (i === heroIdx) {
      if (!/loading\s*=\s*["']/.test(newTag)) {
        newTag = newTag.replace('<img', '<img loading="eager" fetchpriority="high"');
        modified = true;
      }
    } else {
      if (!/loading\s*=\s*["']/.test(newTag)) {
        const src = (tag.match(/src=["']([^"']+)["']/) || [])[1] || '';
        if (src && !/^data:/i.test(src) && !src.endsWith('.svg')) {
          newTag = newTag.replace('<img', '<img loading="lazy"');
          modified = true;
        }
      }
    }
    if (newTag !== tag) {
      html = html.slice(0, index) + newTag + html.slice(index + tag.length);
      const diff = newTag.length - tag.length;
      for (let j = i + 1; j < imgTags.length; j++) imgTags[j].index += diff;
    }
  }

  // 5. Defer non-critical scripts
  const critical = ['handleAccessTokens','overrideGlobals','thunderbolt','polyfill','module-executor','clientWorker','wix-viewer-model','wix-essential-viewer-model','tsc-standalone-runtime'];
  const scriptRe = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  while ((m = scriptRe.exec(html)) !== null) {
    const ft = m[0], src = m[1];
    if (/\s(defer|async)\b/.test(ft)) continue;
    if (/data-url/.test(ft)) continue;
    if (/nomodule/.test(ft)) continue;
    if (critical.some(p => src.includes(p))) continue;
    html = html.replace(ft, ft.replace('<script', '<script defer'));
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  HTML: ${path.relative(publicDir, filePath)}`);
  }
}

async function optimizeAll() {
  const startTime = Date.now();
  console.log('\n=== ASSET OPTIMIZATION ===\n');

  // Pre-scan HTML for display dimensions
  const htmlFiles = walkDir(publicDir).filter(f => f.endsWith('.html'));
  console.log('Scanning HTML for display dimensions...');
  const displayDims = findDisplayDimensions(htmlFiles);
  console.log(`  Found display sizes for ${displayDims.size} image assets`);

  // STEP 1: Compress media/ (already small, just compress)
  let s1 = 0, c1 = 0;
  if (fs.existsSync(mediaDir)) {
    console.log('\nStep 1: Compressing media/ images...');
    const files = walkDir(mediaDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
    for (const f of files) {
      if (/\.(jpg|jpeg)$/i.test(f)) await optimizeJPEG(f, 80);
      else await optimizePNG(f);
    }
    s1 = savedBytes; c1 = optimizedCount;
    savedBytes = 0; optimizedCount = 0;
    console.log(`  Done: ${c1} images, ${(s1/1024/1024).toFixed(2)}MB saved`);
  }

  // STEP 2: Compress + resize original-media using actual display dimensions from HTML
  let s2 = 0, c2 = 0;
  if (fs.existsSync(originalMediaDir)) {
    console.log('\nStep 2: Compressing + resizing original-media/ to display size...');
    const files = walkDir(originalMediaDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    // Report big ones
    const bySize = files.map(f => ({ path: f, size: fs.statSync(f).size }));
    bySize.sort((a, b) => b.size - a.size);
    const bigOnes = bySize.filter(f => f.size > 1024 * 1024);
    if (bigOnes.length > 0) {
      console.log(`  ${bigOnes.length} files over 1MB — resizing to 2x display size (or 2000px max):`);
      for (const f of bigOnes.slice(0, 10)) {
        const hash = path.basename(f.path).split('~mv2')[0].split('.')[0].toLowerCase();
        const dd = displayDims.get(hash);
        const target = dd ? `display ${dd.width}x${dd.height}` : '2000px cap';
        console.log(`    ${(f.size/1024/1024).toFixed(2)}MB - ${path.basename(f.path).substring(0, 60)} (${target})`);
      }
      if (bigOnes.length > 10) console.log(`    ... and ${bigOnes.length - 10} more`);
    }

    for (const f of bySize.map(f => f.path)) {
      const hash = path.basename(f).split('~mv2')[0].split('.')[0].toLowerCase();
      const dd = displayDims.get(hash);
      const maxDim = dd ? Math.max(dd.width, dd.height) * 2 : 2000; // 2x display for HiDPI
      if (/\.(jpg|jpeg)$/i.test(f)) await optimizeJPEG(f, 70, maxDim);
      else await optimizePNG(f, maxDim);
    }

    s2 = savedBytes; c2 = optimizedCount;
    savedBytes = 0; optimizedCount = 0;
    console.log(`  Done: ${c2} images resized+compressed, ${(s2/1024/1024).toFixed(2)}MB saved`);

    // Show remaining big ones
    const remaining = files.map(f => ({ path: f, size: fs.statSync(f).size })).filter(f => f.size > 1024*1024).sort((a,b) => b.size - a.size);
    if (remaining.length > 0) {
      console.log(`  Still >1MB (${remaining.length} files):`);
      for (const f of remaining.slice(0, 5)) {
        console.log(`    ${(f.size/1024/1024).toFixed(2)}MB - ${path.basename(f.path).substring(0,60)}`);
      }
    }
  }

  // STEP 3: Compress videos
  console.log('\nStep 3: Compressing videos...');
  const videoDir = path.join(assetsDir, 'video.wixstatic.com');
  let vs = 0, vc = 0;
  if (fs.existsSync(videoDir)) {
    const files = walkDir(videoDir).filter(f => f.endsWith('.mp4') && !f.includes('.optimized.mp4'));
    for (const f of files) { const s = optimizeVideo(f); if (s > 0) { vc++; vs += s; } }
    console.log(`  Done: ${vc} videos, ${(vs/1024/1024).toFixed(1)}MB saved`);
  } else { console.log('  (no videos found)'); }

  // STEP 4: Optimize HTML
  console.log('\nStep 4: Optimizing HTML files...');
  for (const file of htmlFiles) optimizeHTML(file);
  console.log(`  Processed ${htmlFiles.length} HTML files`);

  // SUMMARY
  const totalMB = (s1 + s2 + vs) / 1024 / 1024;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n=== Done in ${elapsed}s ===`);
  console.log(`  Total freed: ${totalMB.toFixed(1)}MB`);
  console.log(`    media/:          ${c1} images, ${(s1/1024/1024).toFixed(2)}MB`);
  console.log(`    original-media/: ${c2} images resize+compress, ${(s2/1024/1024).toFixed(2)}MB`);
  console.log(`    videos:          ${vc} files, ${(vs/1024/1024).toFixed(1)}MB`);
  console.log(`    WebP copies:     generated alongside all compressed images`);
  console.log('');
}

optimizeAll().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
