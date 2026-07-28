const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');

function card(id) {
  const i = h.indexOf('id="' + id + '"');
  const s = h.slice(i, i + 9000);
  const texts = [...s.matchAll(/>([^<]{3,220})</g)]
    .map((m) =>
      m[1]
        .replace(/&amp;/g, '&')
        .replace(/&rsquo;/g, "'")
        .replace(/&ldquo;|&rdquo;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((t) => t && !t.includes('{') && t.length < 200 && !/^Learn More$/.test(t));
  const imgs = [...s.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  const hrefs = [...s.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  console.log('\n==', id);
  console.log(JSON.stringify({ texts: texts.slice(0, 6), img: imgs[0], hrefs: [...new Set(hrefs)].slice(0, 5) }, null, 2));
}

['comp-mqtpn27i', 'comp-mqtq8rsp', 'comp-mqutenq5'].forEach(card);
