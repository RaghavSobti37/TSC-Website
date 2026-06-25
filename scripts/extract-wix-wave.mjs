import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const html = fs.readFileSync(process.env.WIX_HTML || path.join(process.env.TEMP, 'wix-hdc-full.html'), 'utf8');
const start = html.indexOf('data:image/svg+xml,%3Csvg id=\'comp-mq6h99jp-bottom\'');
if (start < 0) {
  console.error('wave not found');
  process.exit(1);
}
const end = html.indexOf(')', start);
const encoded = html.slice(start + 'data:image/svg+xml,'.length, end);
const svg = decodeURIComponent(encoded);
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'wix', 'harshadduhita', 'wave-divider.svg');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log('Wrote', out, svg.length);
