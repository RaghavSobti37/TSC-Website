const fs = require('fs');
const html = fs.readFileSync('public/pages/academy.html', 'utf8');
const sections = [...html.matchAll(/<section id="(comp-[^"]+)"[^>]*>/g)].map((m) => m[1]);
console.log('sections', sections);
for (const id of sections) {
  const i = html.indexOf('id="' + id + '"');
  const chunk = html.slice(i, i + 4000);
  const titles = [...chunk.matchAll(/<(h[1-4])[^>]*class="[^"]*"[^>]*>([^<]{0,160})/gi)]
    .map((x) => x[1] + ':' + x[2].replace(/\s+/g, ' ').trim())
    .slice(0, 6);
  const plain = [...chunk.matchAll(/wixui-rich-text__text[^>]*>([^<]{3,80})/g)]
    .map((x) => x[1].replace(/\s+/g, ' ').trim())
    .slice(0, 8);
  console.log('\n==', id);
  console.log('titles', titles);
  console.log('plain', plain);
}

// motion effects mentioning testimonial comps
const motionMatch = html.match(/"effects"[\\s\\S]{0,200}"comp-mpl387ie"/);
const idx = html.indexOf('comp-mpl387ie');
console.log('\nmotion snippet around first mpl387ie', html.slice(Math.max(0, idx - 120), idx + 200).slice(0, 300));

const warm = html.match(/"comp-mpl387ie":\{[^}]{0,500}/);
console.log('warmup', warm && warm[0]);
