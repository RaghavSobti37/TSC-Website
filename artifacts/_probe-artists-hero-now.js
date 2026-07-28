const fs = require('fs');
const paths = ['public/artists/index.html', 'public/pages/artists.html'];
for (const p of paths) {
  if (!fs.existsSync(p)) {
    console.log('MISSING', p);
    continue;
  }
  const h = fs.readFileSync(p, 'utf8');
  console.log('\n====', p, 'len', h.length);
  const needles = [
    'Building India',
    'TSC Artists',
    'Explore Artists',
    'Partner With Us',
    'What We Do',
    'Culture-Forward',
    '360'
  ];
  for (const n of needles) {
    const i = h.indexOf(n);
    console.log(n, i);
    if (i >= 0) {
      const slice = h.slice(Math.max(0, i - 800), i + 200);
      const comps = [...slice.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
      console.log('  comps near:', [...new Set(comps)].slice(-12).join(', '));
    }
  }
  // section ids near top
  const sections = [...h.matchAll(/id="(comp-mq[a-z0-9]+)"[^>]*data-testid="[^"]*section/gi)].map((m) => m[1]);
  console.log('sections', sections.slice(0, 8));
  const heroId = 'comp-mq6d6age';
  const i = h.indexOf('id="' + heroId + '"');
  console.log('hero idx', i);
  if (i >= 0) {
    const chunk = h.slice(i, i + 12000);
    const childIds = [...chunk.matchAll(/id="(comp-[a-z0-9]+)"/g)].map((m) => m[1]);
    console.log('hero children sample', [...new Set(childIds)].slice(0, 40));
  }
}
