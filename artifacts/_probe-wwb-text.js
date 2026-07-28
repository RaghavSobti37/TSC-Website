const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
for (const id of [
  'comp-mr38xqri6',
  'comp-mr38xqr7',
  'comp-mr39ngds',
  'comp-mr38xqqv2',
  'comp-mr39t2vt',
  'comp-mr39t915',
  'comp-mr39t938',
  'comp-mr355d93',
  'comp-mr38xqr84'
]) {
  const start = html.indexOf(`id="${id}"`);
  if (start < 0) {
    console.log(id, 'NO');
    continue;
  }
  const chunk = html.slice(start, start + 1200);
  const textMatch = chunk.match(
    /<(?:h[1-6]|p)[^>]*class="[^"]*wixui-rich-text__text"[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/i
  );
  const raw = textMatch ? textMatch[1] : chunk.slice(0, 300);
  const t = raw
    .replace(/<br\s*\/?>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 220);
  console.log(id + ':', t);
}
