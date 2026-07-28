const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr3si7hw"');
const end = html.indexOf('id="comp-mr3', start + 50);
// find next section after cards
const nextSec = html.indexOf('<section id="', start + 20);
const chunk = html.slice(start, nextSec > 0 ? nextSec + 200 : start + 25000);

const ids = [...chunk.matchAll(/id="(comp-mr3[^"]+)"/g)].map((m) => m[1]);
console.log('ids', [...new Set(ids)]);

const texts = [];
const re =
  /id="(comp-mr3[^"]+)"[\s\S]{0,400}?<(?:h[1-6]|p)[^>]*class="[^"]*wixui-rich-text__text"[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/gi;
let m;
while ((m = re.exec(chunk))) {
  const t = m[2]
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  if (t) texts.push(m[1] + ': ' + t);
}
console.log(texts.join('\n'));

// title section
const tStart = html.indexOf('id="comp-mr3iatty"');
console.log(
  '\nTITLE CHUNK\n',
  html
    .slice(tStart, tStart + 900)
    .replace(/</g, '\n<')
    .slice(0, 800)
);
