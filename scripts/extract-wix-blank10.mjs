/**
 * Extract Wix blank-10 structure for clean-slate replica build.
 * Usage: WIX_HTML=%TEMP%\wix-hdc-full.html node scripts/extract-wix-blank10.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = process.env.WIX_HTML || path.join(process.env.TEMP || '/tmp', 'wix-hdc-full.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const outDir = path.join(__dirname, '..', 'public', 'wix-clone', 'harshadduhita');
fs.mkdirSync(outDir, { recursive: true });

// Theme tokens from Wix :root block
const themeMatch = html.match(
  /--color_11:(\d+,\d+,\d+);--color_12:(\d+,\d+,\d+);--color_13:(\d+,\d+,\d+);--color_14:(\d+,\d+,\d+);--color_15:(\d+,\d+,\d+)/
);
const rgb = (s) => `rgb(${s.replace(/,/g, ', ')})`;
const hex = (s) => {
  const [r, g, b] = s.split(',').map(Number);
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
};

const theme = themeMatch
  ? {
      cream: hex(themeMatch[1]),
      orangeDark: hex(themeMatch[2]),
      tealDark: hex(themeMatch[3]),
      teal: hex(themeMatch[4]),
      orange: hex(themeMatch[5]),
    }
  : {};

// Section order inside main
const mainMatch = html.match(/<main id="PAGE_SECTIONS[^"]*"[\s\S]*?<\/main>/);
const mainHtml = mainMatch ? mainMatch[0] : '';
const sectionIds = [...mainHtml.matchAll(/<section id="(comp-mq[^"]+)"/g)].map((m) => m[1]);

// Per-section text (rich text blocks)
function sectionChunk(id) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?(?=<section id="comp-|<\\/main>)`, 'i');
  return html.match(re)?.[0] || '';
}

const sections = sectionIds.map((id) => {
  const chunk = sectionChunk(id);
  const headings = [...chunk.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
  );
  const paragraphs = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim()
  ).filter((t) => t.length > 2);
  const images = [...new Set([...chunk.matchAll(/&quot;uri&quot;:&quot;(19f989_[^&]+)&quot;/g)].map((m) => m[1]))];
  const buttons = [...chunk.matchAll(/aria-label="([^"]+)"[^>]*data-testid="buttonContent"/g)].map((m) => m[1]);
  const links = [...chunk.matchAll(/href="([^"]+)"[^>]*>[\s\S]*?(Book for Events|Explore Music|Harshad|Duhita|Spotify)/g)].map((m) => ({
    href: m[1],
    context: m[2],
  }));
  return { id, headings, paragraphs: paragraphs.slice(0, 20), images, buttons, links: links.slice(0, 10) };
});

// Nav
const nav = [...html.matchAll(/data-part="menu-item-link" href="([^"]+)"[^>]*>[\s\S]*?data-part="label">([^<]+)</g)]
  .map((m) => ({ href: m[1], label: m[2].trim() }))
  .filter((v, i, a) => a.findIndex((x) => x.label === v.label) === i);

// Animation CSS snippets from Wix
const animSnippets = [...html.matchAll(/transition:[^;]{10,80}/g)]
  .map((m) => m[0])
  .filter((s) => s.includes('opacity') || s.includes('transform'))
  .slice(0, 8);

const spec = {
  source: 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10',
  theme,
  nav,
  sectionIds,
  sections,
  animSnippets,
  extractedAt: new Date().toISOString(),
};

const specPath = path.join(outDir, 'page-spec.json');
fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
console.log('Wrote', specPath);
console.log('Sections:', sectionIds.join(' → '));
