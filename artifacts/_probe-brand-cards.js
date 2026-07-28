const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const sections = [
  'comp-mr38xqqo',
  'comp-mr3axlwa',
  'comp-mr3hvomh',
  'comp-mr3fzsjq',
  'comp-mr3hkny1'
];

function sectionSlice(sid) {
  const start = html.indexOf('id="' + sid + '"');
  if (start < 0) return null;
  let end = html.length;
  for (const s2 of sections) {
    const i = html.indexOf('id="' + s2 + '"', start + 10);
    if (i > start && i < end) end = i;
  }
  const who = html.indexOf('id="comp-mr3iatty"', start);
  if (who > start && who < end) end = who;
  return html.slice(start, Math.min(end, start + 40000));
}

for (const sid of sections) {
  const slice = sectionSlice(sid);
  if (!slice) {
    console.log(sid, 'MISSING');
    continue;
  }
  const boxes = [];
  const re = /id="(comp-[^"]+)"([^>]*)/g;
  let m;
  while ((m = re.exec(slice))) {
    const id = m[1];
    const attrs = m[2];
    const isBox = /wixui-box/.test(attrs);
    const isBtn = /wixui-button|lIkFMb|role="button"/.test(attrs) || /Know More/i.test(slice.slice(m.index, m.index + 400));
    if (isBox || /wixui-vector|wixui-image/.test(attrs)) {
      const nearby = slice.slice(m.index, m.index + 500).replace(/\s+/g, ' ');
      const text = (nearby.match(/>([A-Za-z][^<]{2,60})</) || [])[1] || '';
      boxes.push({ id, kind: isBox ? 'box' : 'media', text: text.trim().slice(0, 50) });
    }
  }
  const texts = [];
  const tre = /wixui-rich-text__text[^>]*>([^<]{1,90})</g;
  while ((m = tre.exec(slice))) {
    const t = m[1].replace(/\s+/g, ' ').trim();
    if (t && texts.length < 14) texts.push(t);
  }
  console.log('\n===' + sid + '===');
  console.log('texts:', texts.join(' | '));
  console.log('boxes:', boxes.slice(0, 18).map((b) => b.id + (b.text ? '(' + b.text + ')' : '')).join(', '));
}
