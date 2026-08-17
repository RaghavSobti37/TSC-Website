const fs = require('fs');
const path = require('path');

const PAGES = path.join(__dirname, '..', 'public', 'pages');

const SCHEMAS = {
  'artist-query.html': {
    name: 'Artist Path Application',
    about: 'Apply to join The Shakti Collective artist development and mentorship program.',
  },
  'book-a-call.html': {
    name: 'Book A Call',
    about: 'Book a call with The Shakti Collective to discuss courses, collaborations, artist development, or brand partnerships.',
  },
  'book-an-artist.html': {
    name: 'Book An Artist',
    about: 'Book an artist with The Shakti Collective for your event, venue, or campaign.',
  },
  'collab-query.html': {
    name: 'Collab Q Application',
    about: 'Apply to collaborate with The Shakti Collective on music, films, and culture-first projects.',
  },
};

for (const [file, spec] of Object.entries(SCHEMAS)) {
  const p = path.join(PAGES, file);
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('"@type":"ContactPage"')) {
    console.log(file, 'already has ContactPage, skipping');
    continue;
  }
  const slug = file.replace('.html', '');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: spec.name,
    about: spec.about,
    url: `https://theshakticollective.in/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'The Shakti Collective',
      url: 'https://theshakticollective.in/',
    },
  };
  const block = `<!--tsc-seo-jsonld:start--><script type="application/ld+json">${JSON.stringify(schema)}</script><!--tsc-seo-jsonld:end-->`;
  const marker = '<!--tsc-seo-jsonld:end-->';
  const idx = html.indexOf(marker);
  if (idx === -1) {
    console.log(file, 'NO MARKER FOUND');
    continue;
  }
  const insertAt = idx + marker.length;
  html = html.slice(0, insertAt) + '\n  ' + block + html.slice(insertAt);
  fs.writeFileSync(p, html, 'utf8');
  console.log(file, 'ContactPage schema added');
}
