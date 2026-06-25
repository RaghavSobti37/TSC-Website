import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const html = fs.readFileSync(process.env.WIX_HTML || path.join(process.env.TEMP, 'wix-hdc-full.html'), 'utf8');
const ids = [
  'comp-mq6h99jp',
  'comp-mqffd5wc',
  'comp-mq7lr7m2',
  'comp-mq6ig1tw',
  'comp-mq7r4iw7',
  'comp-mq7z6hk6',
  'comp-mq84m6ve',
  'comp-mqgaclmh',
];

for (const id of ids) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?(?=<section id="comp-|<footer|<\\/main>)`, 'i');
  const m = html.match(re);
  if (!m) {
    console.log('\n===', id, 'NOT FOUND');
    continue;
  }
  const chunk = m[0].slice(0, 4000);
  const headings = [...chunk.matchAll(/<h[1-6][^>]*>([^<]{2,120})<\/h[1-6]>/gi)].map((x) => x[1].replace(/&nbsp;/g, ' ').trim());
  const imgs = [...chunk.matchAll(/uri&quot;:&quot;(19f989[^&]+)/g)].map((x) => x[1]);
  const bg = chunk.match(/background-image:url\(([^)]+)\)/);
  console.log('\n===', id);
  console.log('headings:', headings.slice(0, 8).join(' | '));
  console.log('imgs:', [...new Set(imgs)].join(', '));
  if (bg) console.log('bg:', bg[1].slice(0, 120));
  const blobs = [...chunk.matchAll(/>([^<]{4,100})</g)]
    .map((x) => x[1].replace(/&nbsp;/g, ' ').trim())
    .filter((x) => x && !x.startsWith('http') && !x.includes('xml'));
  console.log('text:', [...new Set(blobs)].slice(0, 15).join(' | '));
}
