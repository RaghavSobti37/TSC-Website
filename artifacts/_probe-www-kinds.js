const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const ids = [
  'comp-mr3t6zyd',
  'comp-mr3t52gt',
  'comp-mr3td6tn',
  'comp-mr3td6tp2',
  'comp-mr3td6tr4',
  'comp-mr3tf400',
  'comp-mr3tf4022',
  'comp-mr3tf4046',
  'comp-mr3tmp8f',
  'comp-mr3tmp8h2',
  'comp-mr3tmp8j5',
  'comp-mr3tmucz',
  'comp-mr3tmud13',
  'comp-mr3tmud34',
  'comp-mr3smd70',
];
for (const id of ids) {
  const i = html.indexOf(`id="${id}"`);
  if (i < 0) {
    console.log(id, 'MISSING');
    continue;
  }
  const tag = html.slice(i, i + 220);
  const cls = (tag.match(/class="([^"]+)"/) || [])[1] || '';
  const kind = cls.includes('rich-text')
    ? 'text'
    : cls.includes('wixui-box')
      ? 'box'
      : 'other';
  const textM = html
    .slice(i, i + 800)
    .match(/<(?:h[1-6]|p)[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/i);
  const t = textM
    ? textM[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 70)
    : '';
  console.log(id, kind, t);
}
