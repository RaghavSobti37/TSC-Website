const fs = require('fs');

function probeMentor(file, label) {
  const html = fs.readFileSync(file, 'utf8');
  const hits = [];
  const re = /Mentor/gi;
  let m;
  while ((m = re.exec(html))) {
    const ctx = html.slice(Math.max(0, m.index - 400), m.index + 200);
    const ids = [...ctx.matchAll(/id="(comp-[^"]+)"/g)].map((x) => x[1]);
    hits.push({ at: m.index, ids: ids.slice(-6), snip: ctx.replace(/\s+/g, ' ').slice(0, 180) });
    if (hits.length >= 8) break;
  }
  console.log('\n===' + label + ' Mentor hits:', hits.length);
  hits.forEach((h, i) => console.log(i, h.ids.join(','), '|', h.snip.slice(-120)));
}

probeMentor('public/pages/learn-with-tsc.html', 'learn');
probeMentor('public/pages/academy.html', 'academy');
probeMentor('public/pages/films.html', 'films');
