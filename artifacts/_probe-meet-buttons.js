const fs = require('fs');
const h = fs.readFileSync('public/pages/artists.html', 'utf8');
for (const id of ['comp-mqtpn27x', 'comp-mqtq8rt05', 'comp-mqutenqg1']) {
  const i = h.indexOf(`id="${id}"`);
  const ids = [...h.slice(i, i + 4000).matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
  console.log(id, '->', ids.slice(0, 15).join(', '));
}
// Learn More button ids near each name
for (const name of ['Harshad', 'Yugm', 'Mohit']) {
  const i = h.indexOf(name);
  const around = h.slice(Math.max(0, i - 200), i + 800);
  const btns = [...around.matchAll(/id="(comp-[^"]+)"[^>]*aria-label="Learn More"|aria-label="Learn More"[\s\S]{0,80}id="(comp-[^"]+)"/g)];
  const ids = [...around.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
  console.log(name, ids.slice(0, 10).join(', '));
}
