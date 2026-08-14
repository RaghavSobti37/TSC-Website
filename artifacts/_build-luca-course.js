const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function read(p) { return fs.readFileSync(path.join(ROOT, p), 'utf8'); }
function write(p, c) { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), c); }
function copy(src, dest) { write(dest, read(src)); }

// --- 1. Clone heart page/css/js ---
copy('public/pages/the-heart-of-composition.html', 'public/pages/music-production.html');
copy('public/css/pages/the-heart-of-composition.css', 'public/css/pages/music-production.css');
copy('public/js/pages/the-heart-of-composition.animations.js', 'public/js/pages/music-production.animations.js');

let html = read('public/pages/music-production.html');
html = html
  .replace(/the-heart-of-composition\.css/g, 'music-production.css')
  .replace(/the-heart-of-composition\.animations\.js/g, 'music-production.animations.js')
  .replace(/\/the-heart-of-composition/g, '/music-production')
  .replace(/The HeART of Composition \| TSC/g, 'A-Z of Music Production | TSC')
  .replace(/The heART of Music Composition/g, 'A-Z of Music Production')
  .replace(/The HeART of Composition/g, 'A-Z of Music Production')
  .replace(/COURSE 001/g, 'COURSE 003')
  .replace(/Mentor: Sandesh Shandilya/g, 'Mentor: Luca Petracca')
  .replace(/Sandesh Shandilya/g, 'Luca Petracca')
  .replace(/Iconic Bollywood Soundtracks/g, 'International Practical Masterclass')
  .replace(/Award-Winning Composer/g, '17+ Years Teaching')
  .replace(/Decades of Industry Experience/g, 'Laptop-Based Production');

// Overview / description paragraphs (common heart strings)
html = html.replace(
  /Dive deeper into advanced composition techniques with this comprehensive 6-month course designed for those who have mastered the fundamentals\.&nbsp;/g,
  'Practical end-to-end music production for artists using only a laptop — from idea to finished track.'
);
html = html.replace(
  /Dive deeper into advanced composition techniques with this comprehensive 6-month course\. Learn the art of imagination, emotion to expression, and mainstream mastery directly from a legend\./g,
  'Practical end-to-end music production for artists using only a laptop — from idea to finished track. Melody, harmony, recording, production, mixing &amp; mastering, and hands-on projects.'
);

// Mentor bio-ish paragraph
html = html.replace(
  /In this comprehensive course, Sandesh shares advanced techniques and industry secrets that he has refined over years of professional work\. Through 3 live interactive sessions, you&#39;ll receive direct mentorship and personalized feedback through a unique training approach where knowledge meets experience, elevating your compositional abilities to professional standards\./g,
  'International practical masterclass with Luca Petracca — 17+ years teaching laptop-based production. Learn melody and chords, harmonic functions, virtual instruments, recording, production, mixing &amp; mastering through hands-on projects.'
);
html = html.replace(
  /In this comprehensive course, Luca Petracca shares advanced techniques and industry secrets that he has refined over years of professional work\. Through 3 live interactive sessions, you&#39;ll receive direct mentorship and personalized feedback through a unique training approach where knowledge meets experience, elevating your compositional abilities to professional standards\./g,
  'International practical masterclass with Luca Petracca — 17+ years teaching laptop-based production. Learn melody and chords, harmonic functions, virtual instruments, recording, production, mixing &amp; mastering through hands-on projects.'
);

// What you'll learn style topic cards — map common composition learn items if present
const learnMap = [
  [/Imagination &amp; Emotion|Imagination & Emotion/g, 'Production Foundations'],
  [/Emotion to Expression/g, 'Harmony &amp; Song Forms'],
  [/Mainstream Mastery/g, 'Recording &amp; Sound Design'],
  [/Final Original Creation|Original Creation/g, 'Final Polish']
];
// Be careful - only replace in learn section context; do broad replaces for known heart learn titles
const learnTitles = [
  ['Bhaav &amp; Technique', 'Production Foundations'],
  ['Bhaav & Technique', 'Production Foundations'],
];
learnTitles.forEach(([a, b]) => { html = html.split(a).join(b); });

// Accordion chapter titles (heart pattern "NN : TITLE")
const chapters = [
  ['01 : INTRODUCTION (AAMAD)', '01 : Intro'],
  ['02 : BHAAV &amp; EMOTIONS', '02 : Melody and Chords'],
  ['02 : BHAAV & EMOTIONS', '02 : Melody and Chords'],
  ['03 : LEARING FROM NATURE', '03 : Harmonic Progressions'],
  ['03 : LEARNING FROM NATURE', '03 : Harmonic Progressions'],
  ['04 : SAMARPAN', '04 : Music Genres'],
  ['05 : SUBCONSCIOUS MIND', '05 : Song Forms'],
  ['06 : COMPOSING WITH ARTISTS', '06 : Instruments and Sounds'],
  ['07 : EXTENSION OF MELODY', '07 : Recording'],
  ['08 : CHARACTERISTICS OF A GOOD COMPOSITION', '08 : Production Techniques'],
  ['09 : BREATH OF MUSIC', '09 : FXs'],
  ['10 : WRITING MELODIES WITH LYRICS', '10 : Mixing and Mastering'],
  ['11 : COLLABORATIONS', '10 : Mixing and Mastering'],
  ['12 : COMPOSING A SONG TOGETHER', '10 : Mixing and Mastering'],
  ['13 : Unfolding Artist Force : FINAL CAPSTONE', '10 : Mixing and Mastering'],
  ['13 : Unfolding Artist Force ', '10 : Mixing and Mastering']
];

// Discover actual accordion titles first
const accordionTitles = [...html.matchAll(/wixui-accordion__title[^>]*>([^<]+)/g)].map((m) => m[1]);
console.log('accordion titles found:', accordionTitles);

chapters.forEach(([from, to]) => {
  if (html.includes(from)) html = html.split(from).join(to);
});

// Owner: enroll marquee must NOT show price — strip if present.
html = html.replace(/<span class="tsc-course-price"[^>]*>[\s\S]*?<\/span>/gi, '');

write('public/pages/music-production.html', html);

// animations.js tweaks
let anim = read('public/js/pages/music-production.animations.js');
anim = anim
  .replace(/the-heart-of-composition/g, 'music-production')
  .replace(
    "    '/music-production': true,\n    '/roots-of-hindustani-classical': true,",
    "    '/music-production': true,\n    '/the-heart-of-composition': true,\n    '/roots-of-hindustani-classical': true,"
  );
// Fix comment
anim = anim.replace(
  '// Page animation bootstrap extracted for music-production.',
  '// Page animation bootstrap extracted for music-production.'
);
// Ensure academyPaths includes music-production AND keep heart
if (!anim.includes("'/music-production': true")) {
  anim = anim.replace(
    "'/the-heart-of-composition': true,",
    "'/the-heart-of-composition': true,\n    '/music-production': true,"
  );
}
// After global replace, heart became music-production - restore heart in academyPaths and routeMap blanks
anim = anim.replace(
  '"/blank-9": "/music-production"',
  '"/blank-9": "/the-heart-of-composition"'
);
anim = anim.replace(
  '"/about-9": "/music-production"',
  '"/about-9": "/the-heart-of-composition"'
);
write('public/js/pages/music-production.animations.js', anim);

// shell index
write('public/music-production/index.html', `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=/pages/music-production.html">
  <script>location.replace("/pages/music-production.html" + location.search + location.hash);</script>
  <link rel="icon" href="/assets/brand/academy-favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/brand/academy-apple-touch-icon.png" sizes="180x180">
</head>
<body><a href="/pages/music-production.html">Open /music-production</a></body>
</html>
`);

write('public/site/academy/courses/music-production/meta.json', JSON.stringify({
  title: 'A-Z of Music Production',
  canonicalRoute: '/music-production',
  pageFile: 'pages/music-production.html',
  css: 'css/pages/music-production.css',
  js: 'js/pages/music-production.animations.js',
  section: 'academy',
  aliases: [
    '/academy/music-production',
    '/courses/music-production'
  ]
}, null, 2) + '\n');

write('public/site/academy/courses/music-production/README.md', `# A-Z of Music Production

- **Canonical URL:** \`/music-production\`
- **HTML:** \`pages/music-production.html\`
- **CSS:** \`css/pages/music-production.css\`
- **JS:** \`js/pages/music-production.animations.js\`
- **Section:** \`academy\`
- **Site index path:** \`public/site/academy/courses/music-production/\`
- **Mentor:** Luca Petracca
- **Price:** ₹3,999

## Aliases

- \`/academy/music-production\`
- \`/courses/music-production\`

Canonical serving stays flat (\`vercel.json\` rewrite + \`scripts/serve-mirror.js\`).
This folder is metadata for humans/AI — not a URL move.
`);

console.log('clone done');
console.log('price in html?', /3,?999|8377;3,999/.test(read('public/pages/music-production.html')));
console.log('title check', (read('public/pages/music-production.html').match(/<title>[^<]+/) || [])[0]);
console.log('accordions after', [...read('public/pages/music-production.html').matchAll(/wixui-accordion__title[^>]*>([^<]+)/g)].map((m) => m[1]));
