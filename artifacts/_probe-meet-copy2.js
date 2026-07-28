const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');

function extract(id, len) {
  const i = h.indexOf('id="' + id + '"');
  const s = h.slice(i, i + (len || 5000));
  const img = s.match(/<img[^>]+src="([^"]+)"/);
  const alt = s.match(/alt="([^"]*)"/);
  const href = [...s.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
  const rich = [...s.matchAll(/data-testid="richTextElement"[^>]*>[\s\S]*?<\/div><!--\/\$-->/g)]
    .map((m) => m[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .slice(0, 5);
  console.log('\n', id);
  console.log('img', img && img[1]);
  console.log('alt', alt && alt[1]);
  console.log('href', [...new Set(href)]);
  rich.forEach((t, n) => console.log('t' + n, t.slice(0, 160)));
}

extract('comp-mqtpn27i', 4500);
extract('comp-mqtq8rsp', 4500);
extract('comp-mqutenq5', 4500);

// Mohit learn more button
const mi = h.indexOf('id="comp-mqutenqm"');
console.log('\nmqutenqm', h.slice(mi, mi + 500));
