const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');

const media = '/assets/mirror/static.wixstatic.com/original-media/';

const reports = [
  {
    slug: 'mahavatar-narsimha-impact',
    title: 'Mahavatar Narsimha',
    kicker: 'Mythology-led animation',
    headline: 'Mounting a film. Building a cultural movement.',
    subtitle: 'TSC Films supported Mahavatar Narsimha across film mounting, marketing, promotions, influencer strategy, execution and non-theatrical rights monetisation.',
    image: '/assets/films/mahavatar-narsimha.jpg',
    imageCaption: 'A mythology-led animated feature mounted as a culture-first cinematic IP.',
    stats: [
      ['All', 'non-theatrical rights monetised'],
      ['Music / OTT / TV', 'rights across languages'],
      ['7', 'strategic mounting workstreams'],
      ['1', 'culture-led cinematic IP']
    ],
    proof: [
      ['Film positioning', 'Positioned the project beyond animation as a culture-led cinematic experience rooted in Indian mythology.'],
      ['Audience strategy', 'Mapped mythology, devotion, family viewing, animation and cultural-pride communities.'],
      ['Rights value', 'Unlocked commercial value through music, OTT and TV rights across languages.']
    ],
    sections: [
      ['01 / Opportunity', 'A timeless story needed modern cinematic appeal.', [
        'Mahavatar Narsimha carried one of India\'s most powerful mythological narratives, with potential across families, children, devotees, animation audiences and culture-conscious viewers.',
        'Success required more than visibility. It needed <mark>clear positioning</mark>, <mark>audience trust</mark>, strong campaign assets, cultural sensitivity and monetisation thinking from the beginning.'
      ]],
      ['02 / TSC Films Role', 'One central direction for every moving part.', [
        'TSC Films acted as the film mounting partner, aligning creative vision with release, marketing and monetisation roadmap.',
        'The work brought together positioning, audience, assets, marketing, influencers, partnerships and rights monetisation under one clear direction.'
      ]],
      ['03 / What We Built', 'Strategy, assets, marketing and monetisation.', [
        'We shaped audience-facing assets including trailer, music, visuals, character moments, mythological hooks and cultural narrative.',
        'We supported campaign communication, promotional narratives, influencer-led amplification and partnership conversations to build reach and credibility.'
      ]],
      ['04 / Impact', 'Prepared to connect, perform and create long-term value.', [
        'The film was approached as an IP with long-term potential, not only as a release.',
        'The work reinforced one belief: culture-led films need <mark>sharper strategy</mark>, <mark>stronger hero assets</mark> and <mark>monetisation thinking</mark> from the beginning.'
      ]]
    ],
    quote: 'A film should not only reach the market. It should be prepared to connect, perform and create long-term value.',
    process: ['Position', 'Map', 'Activate', 'Monetise', 'Extend']
  },
  {
    slug: 'hanuman-ansh-impact',
    title: 'Hanuman Ansh',
    kicker: 'Spiritual entertainment IP',
    headline: 'Building the RAM RAM Universe.',
    subtitle: 'TSC Films supported Hanuman Ansh across strategic positioning, poster concept, teaser and trailer idea, music rights, music marketing and long-term IP strategy.',
    image: `${media}19f989_ca20c3bfe20b447fb264a2d00c44069e~mv2.png`,
    imageCaption: 'A faith-led cultural IP built around devotion, music and long-term universe thinking.',
    stats: [
      ['Times Music', 'music rights deal'],
      ['RAM RAM', 'long-term universe strategy'],
      ['7', 'IP development pillars'],
      ['1', 'faith-led cultural property']
    ],
    proof: [
      ['Spiritual positioning', 'Defined the emotional promise around faith, devotion, inner strength and Neem Karoli Baba\'s living legacy.'],
      ['Music strategy', 'Structured the music rights deal and marketing plan as an emotional bridge to audiences.'],
      ['Universe thinking', 'Built the RAM RAM Universe roadmap across films, music, digital content and community experiences.']
    ],
    sections: [
      ['01 / Opportunity', 'More than release: a long-term cultural IP.', [
        'Hanuman Ansh is inspired by the teachings and legacy of Neem Karoli Baba, with natural resonance across devotees, seekers, families, youth and culture-conscious audiences.',
        'The opportunity was to shape a long-term cultural IP rooted in faith, devotion, healing, inner strength and spiritual connection.'
      ]],
      ['02 / Positioning', 'Authenticity with accessibility.', [
        'The positioning needed to speak to devotees who already felt connected while making the story emotionally accessible for younger audiences and new viewers.',
        'The project was shaped as a <mark>faith-led cinematic IP</mark> with the ability to grow beyond one release window.'
      ]],
      ['03 / Music & Assets', 'Music as first audience connection.', [
        'TSC Films contributed to poster idea, teaser-trailer thinking, music rights and music marketing.',
        'For faith-led films, music often becomes the first point of audience connection. It allows the audience to feel the film before they watch it.'
      ]],
      ['04 / Impact', 'A release creates awareness. A mounted film creates value.', [
        'Hanuman Ansh was positioned as an entry point into the RAM RAM Universe across films, music, content, community experiences and spiritual storytelling.',
        'The work built sustainable audience relationships and a foundation for future opportunities across multiple formats and platforms.'
      ]]
    ],
    quote: 'Stories rooted in faith do not end when the credits roll. Their relationship with audiences continues long after.',
    process: ['Promise', 'Poster', 'Trailer', 'Music', 'Universe']
  },
  {
    slug: 'mahaprabhu-jagannath-impact',
    title: 'Mahaprabhu Jagannath',
    kicker: 'Devotional culture',
    headline: 'Mounting a film. Building a community.',
    subtitle: 'TSC Films supported Mahaprabhu Jagannath across strategy, community activation, school and college outreach, influencer activation, PR and a landmark trailer launch.',
    image: '/assets/films/mahaprabhu-jagannath.png',
    imageCaption: 'A devotional film mounted through faith, community, institutions and trusted cultural voices.',
    stats: [
      ['10,000', 'devotees at trailer launch'],
      ['School + college', 'youth activations'],
      ['8', 'community strategy pillars'],
      ['1', 'devotional cultural property']
    ],
    proof: [
      ['Landmark launch', 'Trailer launched with Indresh Ji Maharaj in the presence of 10,000 devotees.'],
      ['Community mapping', 'Mapped devotees, families, children, institutions, regional communities and spiritual audiences.'],
      ['Trust-led PR', 'Activated devotional, cultural, family, youth and regional voices to build credibility.']
    ],
    sections: [
      ['01 / Opportunity', 'The audience already existed.', [
        'Millions of devotees, families, spiritual seekers and cultural communities already carried Lord Jagannath through faith, festivals, rituals, music, food, travel and shared memory.',
        'The opportunity was not to introduce people to Lord Jagannath. It was to prepare the film for communities that already loved and lived the story.'
      ]],
      ['02 / Trailer Launch', 'A devotional gathering, not a conventional launch.', [
        'The trailer launch with Indresh Ji Maharaj and <mark>10,000 devotees</mark> became a powerful community signal.',
        'For a story rooted in Lord Jagannath, the launch had to carry trust, emotion and collective participation.'
      ]],
      ['03 / Community Activation', 'Relationship building before marketing.', [
        'TSC Films supported school and college activations to engage younger audiences and create cultural curiosity beyond conventional film promotion.',
        'Influencer and PR activation strengthened reach, credibility and cultural narrative through trusted voices.'
      ]],
      ['04 / Impact', 'Faith-led films need credibility before visibility.', [
        'The film was positioned not only as a release, but as a cultural property rooted in faith, storytelling and family audiences.',
        'The work reinforced that the strongest audience strategy begins with understanding why people care.'
      ]]
    ],
    quote: 'Faith is not built through advertising. It is built through trust.',
    process: ['Respect', 'Map', 'Gather', 'Amplify', 'Carry']
  },
  {
    slug: 'kalki-impact',
    title: 'Kalki & Past Film IP',
    kicker: 'IP, licensing and monetisation',
    headline: 'The value of a film beyond the screen.',
    subtitle: 'Past film IP, licensing, merchandising and monetisation work across major Indian film properties informs the current TSC Films approach.',
    image: `${media}19f989_f84950fe51a84d3baf15f59a5c864731~mv2.jpg`,
    imageCaption: 'Film IP thinking across licensing, merchandise, animation, music and long-term audience experiences.',
    stats: [
      ['2009-2015', 'Yash Raj Films IP experience'],
      ['Dhoom 3', 'major licensing and merchandising program'],
      ['10', 'impact areas across film IP'],
      ['1', 'IP-first film philosophy']
    ],
    proof: [
      ['YRF foundation', 'Music monetisation, licensing, merchandising, fashion, gaming and consumer products shaped an IP-first approach.'],
      ['Kalki extension', 'Licensing, merchandise strategy and TV animation adaptation opportunity with Green Gold.'],
      ['Long-tail value', 'Film worlds can extend into animation, gaming, music, commerce, consumer products and franchise thinking.']
    ],
    sections: [
      ['01 / Overview', 'A film is not only a release.', [
        'The TSC Films approach is shaped by years of work across major Indian film properties, studios and entertainment ecosystems.',
        'A film can travel across music, merchandise, fashion, gaming, consumer products, animation, television and long-term audience experiences.'
      ]],
      ['02 / YRF Years', 'Music, licensing, merchandising and commerce.', [
        'Between <mark>2009 and 2015</mark>, Rohith Sobti worked extensively on music monetisation, licensing, merchandising and consumer product strategy for Yash Raj Films.',
        'Work across Dhoom 3, DDLJ and other YRF titles helped establish how Indian film properties can become multi-format IPs.'
      ]],
      ['03 / Kalki', 'A world that can travel beyond cinema.', [
        'For Kalki, the work contributed to licensing and merchandise strategy, along with a TV animation adaptation opportunity with Green Gold.',
        'When a film has a strong world or character base, it should not remain limited to theatres. It can extend into a larger IP journey.'
      ]],
      ['04 / TSC Films Today', 'Every project evaluated through a larger IP lens.', [
        'Current work asks: What is the audience promise? Can music travel? Can characters become merchandise? Can the world extend into animation, gaming or content?',
        'TSC does not look at films only as releases. TSC looks at films as <mark>living IPs</mark>.'
      ]]
    ],
    quote: 'The real value of a film is not limited to the screen.',
    process: ['Rights', 'Music', 'Merch', 'Animation', 'Franchise']
  }
];

function htmlEscape(value) {
  return String(value).replace(/[&<>"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  }[char]));
}

function paragraph(text) {
  const escaped = htmlEscape(text)
    .replace(/&lt;mark&gt;/g, '<mark>')
    .replace(/&lt;\/mark&gt;/g, '</mark>');
  return `<p>${escaped}</p>`;
}

function nav(current) {
  return reports.map(report => {
    const currentAttr = report.slug === current ? ' aria-current="page"' : '';
    return `<a href="/${report.slug}"${currentAttr}>${htmlEscape(report.title.replace(' & Past Film IP', ''))}</a>`;
  }).join('\n        ');
}

function caseNav(current) {
  return reports
    .filter(report => report.slug !== current)
    .map(report => `<a href="/${report.slug}"><small>Impact Report</small><strong>${htmlEscape(report.title)}</strong></a>`)
    .join('\n      ') + '\n      <a href="/films"><small>Index</small><strong>Back to Films</strong></a>';
}

function render(report) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${htmlEscape(report.title)} | Film Impact Report | The Shakti Collective</title>
  <meta name="description" content="${htmlEscape(report.subtitle)}">
  <link rel="canonical" href="/${report.slug}">
  <link rel="stylesheet" href="/css/pages/impact-report.css?v=readability-nav-2">
  <link rel="stylesheet" href="/css/tsc-responsive.css">
  <link rel="stylesheet" href="/css/tsc-mobile-system.css">
  <link rel="stylesheet" href="/css/mobile/_safe-base.css">
  <link rel="icon" href="/assets/brand/tsc-favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/brand/tsc-apple-touch-icon.png" sizes="180x180">
</head>
<body>
  <main class="report-page report-page--film">
    <header class="report-header">
      <a class="report-home" href="/films"><img loading="eager" fetchpriority="high" src="/assets/brand/tsc-logo.png" alt="">Films</a>
      <nav class="report-nav" aria-label="Film impact reports">
        ${nav(report.slug)}
      </nav>
    </header>

    <section class="report-hero">
      <div>
        <p class="report-kicker">${htmlEscape(report.kicker)}</p>
        <div class="report-logo-lockup">
          <div class="case-wordmark film">${htmlEscape(report.title.replace(' & Past Film IP', ''))}<small>TSC Films</small></div>
          <img loading="lazy" class="publisher-mark" src="/assets/brand/tsc-logo.png" alt="The Shakti Collective">
        </div>
        <h1>${htmlEscape(report.headline)}</h1>
        <p class="report-subtitle">${htmlEscape(report.subtitle)}</p>
      </div>
      <aside class="report-panel">
        <h2>Impact Snapshot</h2>
        <div class="stat-grid">
          ${report.stats.map(([number, label]) => `<div class="stat"><strong>${htmlEscape(number)}</strong><span>${htmlEscape(label)}</span></div>`).join('\n          ')}
        </div>
      </aside>
    </section>

    <section class="report-support" aria-label="${htmlEscape(report.title)} supporting elements">
      <figure class="report-media">
        <img loading="lazy" src="${htmlEscape(report.image)}" alt="">
        <figcaption>${htmlEscape(report.imageCaption)}</figcaption>
      </figure>
      <div class="report-proof">
        ${report.proof.map(([heading, copy], index) => `<article class="proof-item"><span>${index + 1}</span><div><strong>${htmlEscape(heading)}</strong><p>${htmlEscape(copy)}</p></div></article>`).join('\n        ')}
      </div>
    </section>

    ${report.sections.map(([label, heading, paras]) => `<section class="report-band"><div class="report-section">
      <div class="section-label">${htmlEscape(label)}</div>
      <div class="report-copy">
        <h2>${htmlEscape(heading)}</h2>
        ${paras.map(paragraph).join('\n        ')}
      </div>
    </div></section>`).join('\n\n    ')}

    <section class="report-band"><div class="report-section">
      <div class="section-label">05 / Contribution</div>
      <div class="report-copy">
        <h2>TSC Films contribution.</h2>
        <ul class="report-list">
          ${report.proof.map(([heading, copy]) => `<li><strong>${htmlEscape(heading)}:</strong> ${htmlEscape(copy)}</li>`).join('\n          ')}
        </ul>
        <div class="report-process" aria-label="${htmlEscape(report.title)} process">
          ${report.process.map((step, index) => `<div class="process-step"><small>${String(index + 1).padStart(2, '0')}</small><strong>${htmlEscape(step)}</strong></div>`).join('\n          ')}
        </div>
        <div class="quote-card"><p>${htmlEscape(report.quote)}</p></div>
      </div>
    </div></section>

    <section class="report-cta-band"><div class="report-cta-inner">
      <h2>Mount films for cultural and commercial value.</h2>
      <a href="/collab-query">Collaborate With TSC</a>
    </div></section>

    <nav class="report-case-nav" aria-label="More film impact reports">
      ${caseNav(report.slug)}
    </nav>
  </main>
  <script src="/js/tsc-components.js?v=nav-component-1" defer></script>
  <script src="/js/pages/impact-report-components.js?v=readability-nav-2" defer></script>
</body>
</html>
`;
}

fs.mkdirSync(pagesDir, { recursive: true });
for (const report of reports) {
  fs.writeFileSync(path.join(pagesDir, `${report.slug}.html`), render(report), 'utf8');
}
console.log(`Generated ${reports.length} film impact report pages.`);
