const http = require('http');
const fs = require('fs');

http.get('http://127.0.0.1:3000/pages/films.html', (res) => {
  let d = '';
  res.on('data', (c) => (d += c));
  res.on('end', () => {
    const sectionRe = /<section[^>]*id="(comp-[a-z0-9]+)"[^>]*>/gi;
    const sections = [];
    let m;
    while ((m = sectionRe.exec(d))) sections.push(m[1]);
    console.log('sections', sections);

    const needles = [
      'Films deserve',
      'Build Your Film',
      'Mounting Films',
      'About Us',
      'What We Do',
      'Selected Work',
      'Our Approach',
      'Why TSC',
      'Film Mounting',
      'Audience Building',
      'Discover',
      'Design',
      'Activate',
      'Amplify',
      'Sustain',
      'Email Us',
      'Resources',
      'Audience Research'
    ];
    needles.forEach((t) => console.log(t + ':', d.includes(t)));

    // Pull nearby text for key comps
    function snippet(id, n = 400) {
      const i = d.indexOf('id="' + id + '"');
      if (i < 0) return null;
      const chunk = d.slice(i, i + n).replace(/\s+/g, ' ');
      return chunk.slice(0, 280);
    }
    [
      'comp-mql25lfk',
      'comp-mql25lg72',
      'comp-mql25lg57',
      'comp-mqksjwhn',
      'comp-mqmh352i',
      'comp-mqktsjdh',
      'comp-mqktx0nc',
      'comp-mqmhuw20',
      'comp-mqku1yx4',
      'comp-mqktywoc'
    ].forEach((id) => console.log('\n' + id + ':', snippet(id)));

    // Film mounting bullets near what we do
    const idx = d.indexOf('Audience Research');
    if (idx > 0) console.log('\nnear Audience Research:', d.slice(idx - 200, idx + 500).replace(/\s+/g, ' '));

    fs.writeFileSync('artifacts/_films-section-ids.txt', sections.join('\n'));
  });
}).on('error', (e) => {
  console.error(e);
  process.exit(1);
});
