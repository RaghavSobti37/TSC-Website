const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr38xqqo"');
const end = html.indexOf('id="comp-mr3axlwa"');
const slice = html.slice(start, end);

// Rough nest by tracking open/close of divs with ids
function dumpTree(str) {
  const tokens = [];
  const re = /<\/?div\b[^>]*>/gi;
  let m;
  while ((m = re.exec(str))) {
    tokens.push({ i: m.index, tag: m[0] });
  }
  let depth = 0;
  const lines = [];
  for (const t of tokens) {
    const isClose = /^<\//.test(t.tag);
    if (isClose) depth--;
    const id = (t.tag.match(/id="([^"]+)"/) || [])[1];
    const cls = (t.tag.match(/class="([^"]+)"/) || [])[1] || '';
    if (id || /wixui-box|wixui-rich-text|wixui-button|wixui-image|wixui-vector|section/.test(cls)) {
      const pad = '  '.repeat(Math.max(0, depth));
      lines.push(pad + (isClose ? '/' : '') + (id || cls.split(' ').slice(0, 3).join('.')));
    }
    if (!isClose && !/\/>/.test(t.tag)) depth++;
  }
  return lines.slice(0, 120).join('\n');
}
console.log(dumpTree(slice));

// Know More button details
const km = slice.match(/id="comp-mr35f98m"[\s\S]{0,600}/);
console.log('\n--- Know More ---\n', km && km[0].replace(/</g, '\n<'));
