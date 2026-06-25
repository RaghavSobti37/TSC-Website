#!/usr/bin/env node
/**
 * Wix browser-export → TSC React import pipeline
 * Usage: npm run import-wix -- --html "path/to/Harshad Duhita _ TSC.html" --export-dir "path/to/_files" --slug harshadduhita-blank-10
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSections } from '../lib/wix/extractSections.mjs';
import { extractMenus } from '../lib/wix/extractMenus.mjs';
import { extractTheme } from '../lib/wix/extractTheme.mjs';
import { extractFonts } from '../lib/wix/extractFonts.mjs';
import { buildAnimationMap } from '../lib/wix/extractAnimations.mjs';
import { materializeAssets } from '../lib/wix/extractAssets.mjs';
import { materializeFonts } from '../lib/wix/materializeFonts.mjs';
import { BLANK10_ASSET_ALIASES } from '../lib/wix/blank10-asset-aliases.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const htmlPath = path.resolve(
  arg(
    '--html',
    path.join(
      root,
      '../../Harshaduhita_TSC_HTML (1)/Harshad Duhita _ TSC_files/Harshad Duhita _ TSC.html'
    )
  )
);
const exportDir = path.resolve(
  arg('--export-dir', path.dirname(htmlPath))
);
const slug = arg('--slug', 'harshadduhita-blank-10');
const skipAssets = process.argv.includes('--skip-assets');

if (!fs.existsSync(htmlPath)) {
  console.warn('Wix HTML not found at', htmlPath);
  console.warn('Skipping import — using committed public/wix-imports and public/images/wix assets.');
  process.exit(0);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const sections = extractSections(html);
const sectionIds = sections.map((s) => s.id);
const theme = extractTheme(html);
const menu = extractMenus(html);
const fonts = extractFonts(html);
const animationMap = buildAnimationMap(sections, html);

const outBase = path.join(root, 'public', 'wix-imports', slug);
const sectionsDir = path.join(outBase, 'sections');
fs.mkdirSync(sectionsDir, { recursive: true });

for (const section of sections) {
  const file = path.join(sectionsDir, `${section.id}.json`);
  fs.writeFileSync(file, JSON.stringify(section, null, 2));
}

const site = {
  slug,
  sourceHtml: htmlPath,
  extractedAt: new Date().toISOString(),
  theme,
  nav: menu.items,
  menu,
  fonts,
  sectionIds,
  pageRoute: '/blank-10',
  reactPage: 'components/harshadduhita/Blank10Page.tsx',
};

let assets = [];
const publicAssets = path.join(root, 'public', 'images', 'wix', 'harshadduhita');
const publicFonts = path.join(root, 'public', 'fonts', 'wix');

if (!skipAssets) {
  const aliases = slug.includes('blank-10') ? BLANK10_ASSET_ALIASES : {};
  assets = await materializeAssets({ html, exportDir, publicDir: publicAssets, aliases });
  site.assets = assets.map((a) => ({ uri: a.uri, publicUrl: `/images/wix/harshadduhita/${path.basename(a.localPath)}` }));

  const fontResult = await materializeFonts(fonts, publicFonts);
  site.fontsCss = fontResult.cssPath;
  site.fontsManifest = fontResult.manifest;
}

fs.writeFileSync(path.join(outBase, 'site.json'), JSON.stringify(site, null, 2));
fs.writeFileSync(path.join(outBase, 'animation-map.json'), JSON.stringify(animationMap, null, 2));
fs.writeFileSync(path.join(outBase, 'menu.json'), JSON.stringify(menu, null, 2));

console.log('Wix import complete');
console.log('  slug:', slug);
console.log('  sections:', sectionIds.length, '→', sectionsDir);
console.log('  animations:', animationMap.elements.length);
console.log('  assets:', assets.length, '→', publicAssets);
console.log('  site.json →', path.join(outBase, 'site.json'));
