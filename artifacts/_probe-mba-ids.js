const fs = require('fs');
const h = fs.readFileSync('public/pages/mba.html', 'utf8');
const ids = [...h.matchAll(/id="(comp-mre[^"]+)"/g)].map((m) => m[1]);
console.log([...new Set(ids)].slice(0, 80).join('\n'));
console.log('---sections---');
const secs = [...h.matchAll(/<section[^>]*id="([^"]+)"[^>]*>/g)].map((m) => m[1]);
console.log(secs.join('\n'));
console.log('---headings---');
const heads = [...h.matchAll(/<(h1|h2|p)[^>]*class="[^"]*font_[^"]*"[^>]*>([^<]{0,80})/g)]
  .slice(0, 30)
  .map((m) => m[1] + ': ' + m[2].replace(/\s+/g, ' ').trim());
console.log(heads.join('\n'));
