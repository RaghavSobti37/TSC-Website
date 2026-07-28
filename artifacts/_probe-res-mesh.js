const fs = require('fs');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');
const css = fs.readFileSync('public/css/pages/resources.css', 'utf8');

const start = h.indexOf('id="comp-mp2vpkoa"');
const end = h.indexOf('</section>', start);
const sec = h.slice(start, Math.min(start + 8000, end));

// Direct children of section container
const containerMatch = sec.match(/comp-mp2vpkoa-container[^>]*>([\s\S]*)/);
console.log('container open ok', !!containerMatch);

// Top-level ids inside first 8k of section
const ids = [...sec.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
console.log('first ids', [...new Set(ids)].slice(0, 40));

// CSS positions for Free Tools title + desc + tabs
for (const id of [
  'comp-mrd4o8h8',
  'comp-mrd4uy36',
  'comp-mparh5c7',
  'comp-mparh5cz',
  'comp-mpbfrynb',
  'comp-mrd98n472',
  'comp-mrd44ghl',
]) {
  const re = new RegExp(`#${id}\\{[^}]+\\}`);
  const m = css.match(re);
  console.log('\n' + id, m ? m[0].replace(/\s+/g, ' ').slice(0, 280) : 'NO');
}

// Blog section children
const bstart = h.indexOf('id="comp-mrdp2u69"');
const bend = h.indexOf('</section>', bstart);
const blog = h.slice(bstart, Math.min(bstart + 5000, bend));
const blogIds = [...blog.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
console.log('\nBlog section ids', [...new Set(blogIds)].slice(0, 30));
