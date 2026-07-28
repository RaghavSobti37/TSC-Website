const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr3si7hw"');
const nextSec = html.indexOf('<section id="', start + 20);
const chunk = html.slice(start, nextSec);

function nest(str, depth = 0) {
  // simplified: show id nesting by walking tags with ids
  const tokens = [];
  const re = /<\/?div[^>]*>/gi;
  let m;
  let d = 0;
  while ((m = re.exec(str))) {
    const tag = m[0];
    const idM = tag.match(/id="([^"]+)"/);
    if (tag.startsWith('</')) {
      d--;
      continue;
    }
    if (idM) {
      tokens.push('  '.repeat(Math.max(0, d)) + idM[1]);
    }
    d++;
  }
  return tokens.join('\n');
}
console.log(nest(chunk));
