const fs = require('fs');
const path = require('path');
const pages = ['book-a-call','book-an-artist','artist-query','collab-query'];
for (const p of pages) {
  const html = fs.readFileSync(path.join('public/pages', p + '.html'), 'utf8');
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/g)].map(x => x[1]);
  const rich = [...html.matchAll(/id="(comp-[^"]+)" class="[^"]*wixui-rich-text[^"]*"[^>]*>[\s\S]{0,180}/g)]
    .filter(m => /font_0|Book |Artist Path|Collab|Partner|Apply/i.test(m[0]))
    .map(m => m[1] + ' :: ' + m[0].replace(/\s+/g,' ').slice(0,120));
  console.log('===', p, '===');
  console.log('h1:', h1s);
  console.log('rich:', rich.slice(0,5));
  console.log('has forms.js', /forms\.js/.test(html));
}
