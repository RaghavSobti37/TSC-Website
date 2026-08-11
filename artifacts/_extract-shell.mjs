import fs from 'fs';

const html = fs.readFileSync('public/about/index.html', 'utf8');
const marker = 'id="comp-mr1ttkgk"';
const i = html.indexOf(marker);
if (i < 0) {
  console.error('not found');
  process.exit(1);
}
const chunk = html.slice(i, i + 12000);
const svgStart = chunk.indexOf('<svg');
const svgEnd = chunk.indexOf('</svg>') + 6;
const svg = chunk.slice(svgStart, svgEnd);
fs.mkdirSync('artifacts/desktop-lock-audit', { recursive: true });
fs.writeFileSync('artifacts/desktop-lock-audit/about-shell-raw.svg', svg);
console.log('wrote', svg.length);
const pathStarts = [...svg.matchAll(/<path /g)].map((m) => m.index);
console.log('paths', pathStarts.length);
for (const start of pathStarts) {
  const dMatch = svg.slice(start, start + 4000).match(/d="([^"]+)"/);
  console.log('dLen', dMatch ? dMatch[1].length : 0, 'preview', dMatch ? dMatch[1].slice(0, 100) : '');
}
