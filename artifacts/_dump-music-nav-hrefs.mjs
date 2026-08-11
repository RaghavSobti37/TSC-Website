import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(root, 'public/pages/music-production.html'), 'utf8');

// Find top-level menu labels + nearby hrefs in header chunk
const idx = html.indexOf('wixui-horizontal-menu');
const chunk = html.slice(idx, idx + 25000);
const items = [...chunk.matchAll(/href="([^"]+)"[^>]*>[\s\S]{0,120}?data-part="label"[^>]*>([^<]+)/gi)];
console.log('top-ish pairs', items.length);
items.slice(0, 30).forEach((m, i) => console.log(i + 1, m[1], '|', m[2]));

const labels = ['Resources', 'Courses', 'Testimonials', 'Know More', 'MAIN WEBSITE'];
for (const label of labels) {
  const re = new RegExp(`href="([^"]+)"[\\s\\S]{0,200}>${label}<`, 'i');
  const m = chunk.match(re) || html.match(re);
  console.log(label, '→', m ? m[1] : 'NOT FOUND');
}
