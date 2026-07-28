const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const pairs = [
  ['comp-mr3si7jh', 'comp-mr3si7jv1'],
  ['comp-mr3si7jv1', 'comp-mr3sl540'],
  ['comp-mr3sl540', 'comp-mr3t0ceh'],
  ['comp-mr3t0ceh', 'SCROLL_TO_BOTTOM'],
];
for (const [a, b] of pairs) {
  const s = html.indexOf(`id="${a}"`);
  let e = html.indexOf(`id="${b}"`);
  if (e < 0 || e <= s) e = s + 2500;
  const chunk = html.slice(s, e);
  const ids = [...chunk.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
  const texts = [];
  const re = /<(?:h[1-6]|p)[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/gi;
  let m;
  while ((m = re.exec(chunk))) {
    const t = m[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    if (t) texts.push(t);
  }
  console.log(a, '->', ids.slice(0, 10).join(', '));
  console.log('  texts:', texts.join(' | '));
}
