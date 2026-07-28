const fs = require('fs');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');
for (const id of [
  'comp-mpbfryng',
  'comp-mrd98n4i',
  'comp-mrdp2u69',
  'comp-mrdq81q0',
  'comp-mpbii8ur',
  'comp-mparh5cz',
  'width:calc((((20%',
  'width:calc((((50%',
  'width:calc((((33%',
]) {
  const i = css.indexOf(id);
  console.log('\n===', id, i);
  if (i >= 0) console.log(css.slice(i, i + 420).replace(/\s+/g, ' '));
}

const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const blogSec = h.indexOf('id="comp-mrdp2u69"');
console.log('\nBLOG', h.slice(blogSec, blogSec + 1800).replace(/\s+/g, ' ').slice(0, 1000));

const feat = h.indexOf('id="comp-mrdq81q0"');
console.log('\nFEAT', h.slice(feat, feat + 1200).replace(/\s+/g, ' ').slice(0, 800));

// Editorial blog body defaults
const ed = fs.readFileSync('public/css/pages/editorial-blog.css', 'utf8');
const bodyMatch = ed.match(/\.article-body[\s\S]{0,400}/);
console.log('\nARTICLE BODY', bodyMatch && bodyMatch[0].replace(/\s+/g, ' '));

// Blog-1 prose sample
const b1 = fs.readFileSync('public/pages/blog-1.html', 'utf8');
console.log('\nblog-1 has richText', (b1.match(/richTextElement/g) || []).length);
console.log('blog-1 sections', [...b1.matchAll(/section id="([^"]+)"/g)].map((m) => m[1]).slice(0, 8));
