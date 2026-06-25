import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = process.env.WIX_HTML || path.join(process.env.TEMP || '/tmp', 'wix-hdc-full.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const colors = html.match(/:root[^}]*--color_11:(\d+,\d+,\d+)[^}]*--color_12:(\d+,\d+,\d+)[^}]*--color_13:(\d+,\d+,\d+)[^}]*--color_14:(\d+,\d+,\d+)[^}]*--color_15:(\d+,\d+,\d+)/);
const sectionIds = [...html.matchAll(/<section id="(comp-[^"]+)"/g)].map((m) => m[1]);
const navItems = [...html.matchAll(/data-part="menu-item-link" href="([^"]+)"[^>]*>[\s\S]*?data-part="label">([^<]+)</g)].map((m) => ({
  href: m[1],
  label: m[2].trim(),
}));

const texts = [...html.matchAll(/<p[^>]*class="[^"]*"[^>]*>([^<]{10,300})<\/p>/g)].map((m) =>
  m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
);

const imageUris = [...new Set([...html.matchAll(/19f989_[a-f0-9~]+\.(jpg|png|jpeg)/gi)].map((m) => m[0]))];

const out = {
  colors: colors
    ? {
        cream: colors[1],
        orangeDark: colors[2],
        tealDark: colors[3],
        teal: colors[4],
        orange: colors[5],
      }
    : null,
  sectionIds,
  navItems: navItems.slice(0, 8),
  sampleTexts: [...new Set(texts)].slice(0, 25),
  imageUris,
};

const outDir = path.join(__dirname, '..', 'public', 'wix-clone', 'harshadduhita');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'extract.json'), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
