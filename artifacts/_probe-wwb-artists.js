const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');
const start = html.indexOf('id="comp-mr38xqqo"');
const end = html.indexOf('id="comp-mr3axlwa"');
const slice = html.slice(start, end > 0 ? end : start + 30000);
const ids = [...slice.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
console.log('IDs in section:', ids.length);
ids.forEach((id) => {
  const i = slice.indexOf(`id="${id}"`);
  const chunk = slice.slice(i, i + 800);
  const text = chunk
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  if (text.length > 5) console.log(id + ' => ' + text);
  else console.log(id + ' => (media/empty)');
});
