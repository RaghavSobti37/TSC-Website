/*
 * inject-seo.js — canonical domain, meta descriptions, Open Graph / Twitter
 * cards, JSON-LD structured data, and preconnect hints for every page.
 *
 * Runs in the build chain AFTER link canonicalization. It only touches the
 * <head> of pages/*.html (never body markup, CSS, or visuals), so the locked
 * desktop/mobile design is untouched. Idempotent: re-running replaces the
 * tags it owns instead of duplicating them.
 */
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const pagesDir = path.join(publicDir, 'pages');
const manifestPath = path.join(pagesDir, 'routes.manifest.json');
const origin = 'https://theshakticollective.in';
const siteName = 'The Shakti Collective';

const OLD_DOMAIN = 'wix-site-clone-psi.vercel.app';

// Routes that 301 to another page — never canonicalized, never in sitemaps.
const REDIRECT_ROUTES = new Set(['/learn-with-tsc']);

// Pages served directly but not listed in the manifest (added by hand here).
const EXTRA_PAGES = [
  { route: '/affiliate', file: 'affiliate.html', title: 'Affiliate Program | TSC Academy' },
];

const DESCRIPTIONS = {
  '/': 'The Shakti Collective is an artist development company and music academy building culture-first IP — mentorship, music production, films, live experiences, and resources for independent artists.',
  '/about': 'The Shakti Collective is a culture-first artist ecosystem developing musicians, storytellers, and original IP across music, films, live experiences, and education.',
  '/work': 'Explore work by The Shakti Collective — artist development, brand collaborations, campaigns, and culture-first projects across music and media.',
  '/artists': 'Meet TSC Artists — independent singers, musicians, storytellers, and performers developed and represented by The Shakti Collective.',
  '/artist-path': 'Artist Path is TSC\u2019s mentorship program for emerging artists — sustainable growth, expert guidance, and a clear path to a music career.',
  '/films': 'TSC Films produces and supports original stories, music ecosystems, and culture-first film experiences from India.',
  '/resources': 'Artist resources from The Shakti Collective — practical guides on music, creativity, and building a sustainable independent career.',
  '/academy': 'TSC Academy offers mentorship-led music learning — online courses in Hindustani classical, composition, and music production for artists and creators.',
  '/mba': 'Main Bhi Artist — The Shakti Collective impact report on community music programs and artist enablement.',
  '/havells-myousic': 'Havells mYOUsic impact report — how The Shakti Collective brought live music and mentorship to communities across India.',
  '/insta-music-league': 'Insta Music League impact report — TSC\u2019s Instagram-first music competition that discovered and launched new artists.',
  '/young-gunns': 'The Young Gunns impact report — the journey of the band developed and produced by The Shakti Collective.',
  '/harshad-duhita': 'Harshad Duhita — the singer-songwriter duo from The Shakti Collective. Explore their music, journey, and live performances.',
  '/mohit-shankar': 'Mohit Shankar — artist with The Shakti Collective. Explore his music, journey, and performances.',
  '/roots-of-hindustani-classical': 'Roots of Hindustani Classical — a TSC Academy online course exploring the foundations, ragas, and tradition of Hindustani classical music.',
  '/the-heart-of-composition': 'The HeART of Composition — a TSC Academy course on the art and craft of writing music, from melody to arrangement.',
  '/music-production': 'A-Z of Music Production — a comprehensive TSC Academy course covering the complete music production process from idea to release.',
  '/course-bundle': 'Get all three TSC Academy courses — Roots of Hindustani Classical, The HeART of Composition, and A-Z of Music Production — in one bundle.',
  '/start-making-music': 'How do I start making music if I have no experience? A beginner\u2019s guide from TSC Academy to starting your music journey.',
  '/yugm': 'YUGM — the band developed by The Shakti Collective. Explore their music and journey.',
  '/mahaprbhu': 'Mahaprbhu — a TSC Films original. Experience the story, music, and culture of the film.',
  '/mahavatar-narsimha': 'Mahavatar Narsimha — a TSC Films original. Explore the film\u2019s story, music, and cultural roots.',
  '/hanuman-ansh': 'Hanuman Ansh — a TSC Films original. Explore the film and its music ecosystem.',
  '/kalki': 'Kalki and past film IP — explore TSC Films\u2019 original stories, licensing, and commercial growth.',
  '/mahavatar-narsimha-impact': 'TSC Films supported Mahavatar Narsimha across film mounting, marketing, promotion, and community — see the full impact report.',
  '/hanuman-ansh-impact': 'TSC Films supported Hanuman Ansh across strategic positioning, posters, trailers, and release — see the full impact report.',
  '/mahaprabhu-jagannath-impact': 'TSC Films supported Mahaprabhu Jagannath across strategy, community activation, and release — see the full impact report.',
  '/kalki-impact': 'Kalki and past film IP impact report — TSC Films\u2019 support across strategy, community, and commercial growth.',
  '/artist-release-playbook': 'The Artist Release Playbook — a step-by-step guide from TSC Academy on releasing music independently.',
  '/online-music-course-worth-it': 'Is an online music course worth it for beginners? Honest, practical advice from TSC Academy.',
  '/from-bhajan-to-clubbing': 'From Bhajan to Clubbing, From Mythology to Cinema — an essay by The Shakti Collective on Indian culture in mainstream forms.',
  '/you-released-a-song-now-what': 'You released a song. Now what? A practical guide from The Shakti Collective on what to do after releasing music.',
  '/how-i-curate-music-with-independent-artists': 'How I curate music with independent artists — insights into The Shakti Collective\u2019s curation process.',
  '/collab-query': 'Collab Q — apply to collaborate with The Shakti Collective on music, films, and culture-first projects.',
  '/book-an-artist': 'Book an artist with The Shakti Collective — bring Indian music and culture to your event, venue, or campaign.',
  '/artist-query': 'Artist Path — apply to join The Shakti Collective\u2019s artist development and mentorship program.',
  '/book-a-call': 'Book a call with The Shakti Collective to discuss courses, collaborations, artist development, or brand partnerships.',
  '/masterclass-review01': 'Share your feedback on the TSC Academy masterclass — your review helps us build better music education.',
  '/masterclass-review02': 'Share your feedback on the TSC Academy masterclass — your review helps us build better music education.',
  '/classicalreview': 'Share your feedback on the TSC Academy classical music masterclass — your review helps us build better music education.',
  '/affiliate': 'Join the TSC Academy affiliate program — earn while sharing mentorship-led music education with your audience.',
};

// Pages whose content is a structured article (blog posts / essays).
const ARTICLE_ROUTES = new Set([
  '/start-making-music',
  '/online-music-course-worth-it',
  '/artist-release-playbook',
  '/from-bhajan-to-clubbing',
  '/you-released-a-song-now-what',
  '/how-i-curate-music-with-independent-artists',
]);

// Academy course pages get Course schema.
const COURSE_ROUTES = new Set([
  '/roots-of-hindustani-classical',
  '/the-heart-of-composition',
  '/music-production',
  '/course-bundle',
]);

// Film pages get Movie schema.
const MOVIE_ROUTES = new Set([
  '/mahaprbhu',
  '/mahavatar-narsimha',
  '/hanuman-ansh',
  '/kalki',
]);

const IMPACT_ROUTES = new Set([
  '/mba',
  '/havells-myousic',
  '/insta-music-league',
  '/young-gunns',
  '/mahavatar-narsimha-impact',
  '/hanuman-ansh-impact',
  '/mahaprabhu-jagannath-impact',
  '/kalki-impact',
]);

// Form / contact pages get ContactPage schema (helps search + AI answer engines
// understand these are submission surfaces).
const CONTACT_ROUTES = new Set([
  '/collab-query',
  '/book-an-artist',
  '/artist-query',
  '/book-a-call',
  '/masterclass-review01',
  '/masterclass-review02',
  '/classicalreview',
]);

// Image used for social cards. Blog posts keep their own editorial image.
const DEFAULT_OG_IMAGE = `${origin}/assets/brand/tsc-shankha-cream.png`;
const BLOG_OG_IMAGES = {
  '/from-bhajan-to-clubbing': `${origin}/assets/blogs/indian-culture-mainstream.jpeg`,
  '/how-i-curate-music-with-independent-artists': `${origin}/assets/blogs/curate-music-independent-artists.jpeg`,
  '/you-released-a-song-now-what': `${origin}/assets/blogs/song-release-now-what.jpeg`,
};

const JSONLD_MARKER = 'tsc-seo-jsonld';

const ENTITY_SAME_AS = [
  'https://www.instagram.com/the_shakti_collective/',
  'https://youtube.com/@theshakticollective',
  'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/',
  'https://www.linkedin.com/company/the-shakti-collective',
];

function organizationEntity() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EntertainmentBusiness'],
    '@id': `${origin}/#organization`,
    name: siteName,
    alternateName: ['TSC', 'Shakti Collective', 'The Shakti Collective India'],
    url: `${origin}/`,
    logo: `${origin}/assets/brand/tsc-logo.png`,
    image: DEFAULT_OG_IMAGE,
    description: 'The Shakti Collective is a culture-first artist development ecosystem for singers, musicians, producers, storytellers, and conscious creative communities.',
    email: 'Artist@theshakticollective.in',
    sameAs: ENTITY_SAME_AS,
    brand: {
      '@type': 'Brand',
      name: 'TSC Academy',
      alternateName: ['TSC', 'The Shakti Collective Academy'],
      url: `${origin}/academy`,
    },
    department: {
      '@type': 'EducationalOrganization',
      '@id': `${origin}/academy#academy`,
      name: 'TSC Academy',
      alternateName: ['The Shakti Collective Academy', 'TSC music academy'],
      url: `${origin}/academy`,
      description: 'TSC Academy is the music learning and mentorship vertical of The Shakti Collective for emerging singers, composers, producers, and independent artists.',
    },
  };
}

function websiteEntity() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    name: siteName,
    alternateName: ['TSC', 'TSC Academy', 'Shakti Collective'],
    url: `${origin}/`,
    publisher: { '@id': `${origin}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/resources?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

function decodeEntities(value) {
  return String(value).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function canonicalUrl(route) {
  return route === '/' ? `${origin}/` : `${origin}${route}`;
}

function existingTitle(html) {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match && match[1] && match[1].trim() ? match[1].trim() : null;
}

function buildMeta(html, route) {
  const title = existingTitle(html) || (route === '/' ? `${siteName} | Artist Development, Music Academy & Culture-First IP` : `${route.replace(/^\//, '').replace(/-/g, ' ')} | ${siteName}`);
  const description = DESCRIPTIONS[route] || `${title} — learn more at ${siteName}.`;
  const url = canonicalUrl(route);
  const image = BLOG_OG_IMAGES[route] || DEFAULT_OG_IMAGE;
  const ogType = MOVIE_ROUTES.has(route) ? 'video.movie' : ARTICLE_ROUTES.has(route) ? 'article' : 'website';
  return { title, description, url, image, ogType };
}

function jsonLdBlocks(route, meta) {
  const blocks = [];
  if (route === '/') {
    blocks.push(organizationEntity(), websiteEntity());
  } else if (route === '/academy') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      '@id': `${origin}/academy#academy`,
      name: 'TSC Academy',
      alternateName: ['The Shakti Collective Academy', 'TSC music academy'],
      url: `${origin}/academy`,
      description: meta.description,
      parentOrganization: { '@id': `${origin}/#organization` },
      sameAs: ENTITY_SAME_AS,
    });
  }
  const crumbs = route.split('/').filter(Boolean);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` }],
  };
  if (crumbs.length) {
    breadcrumb.itemListElement.push({ '@type': 'ListItem', position: 2, name: meta.title.split(' | ')[0], item: meta.url });
  }
  blocks.push(breadcrumb);
  if (CONTACT_ROUTES.has(route)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: meta.title.split(' | ')[0],
      description: meta.description,
      url: meta.url,
      isPartOf: { '@type': 'WebSite', name: siteName, url: `${origin}/` },
    });
  } else if (COURSE_ROUTES.has(route)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: meta.title.split(' | ')[0],
      description: meta.description,
      provider: { '@id': `${origin}/academy#academy` },
    });
  } else if (MOVIE_ROUTES.has(route)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Movie',
      name: meta.title.split(' | ')[0],
      description: meta.description,
      url: meta.url,
      image: meta.image,
      productionCompany: { '@type': 'Organization', name: siteName },
    });
  } else if (IMPACT_ROUTES.has(route)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Report',
      name: meta.title.split(' | ')[0],
      description: meta.description,
      url: meta.url,
      publisher: { '@type': 'Organization', name: siteName },
    });
  } else if (ARTICLE_ROUTES.has(route)) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: meta.title.split(' | ')[0],
      description: meta.description,
      url: meta.url,
      image: meta.image,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        logo: { '@type': 'ImageObject', url: `${origin}/assets/brand/tsc-logo.png` },
      },
      inLanguage: 'en',
    });
  }
  return blocks;
}

function headTags(meta) {
  const title = `<title>${meta.title}</title>`;
  const canonical = `<link rel="canonical" href="${meta.url}">`;
  const description = `<meta name="description" content="${escapeXml(meta.description)}">`;
  const robots = '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';
  const og = [
    `<meta property="og:type" content="${meta.ogType}">`,
    `<meta property="og:site_name" content="${siteName}">`,
    `<meta property="og:title" content="${escapeXml(decodeEntities(meta.title))}">`,
    `<meta property="og:description" content="${escapeXml(meta.description)}">`,
    `<meta property="og:url" content="${meta.url}">`,
    `<meta property="og:image" content="${meta.image}">`,
    `<meta property="og:image:alt" content="${escapeXml(decodeEntities(meta.title))}">`,
    '<meta property="og:locale" content="en_IN">',
  ].join('\n  ');
  const twitter = [
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeXml(decodeEntities(meta.title))}">`,
    `<meta name="twitter:description" content="${escapeXml(meta.description)}">`,
    `<meta name="twitter:image" content="${meta.image}">`,
  ].join('\n  ');
  const preconnects = [
    '<link rel="preconnect" href="https://static.wixstatic.com" crossorigin>',
    '<link rel="preconnect" href="https://video.wixstatic.com" crossorigin>',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="dns-prefetch" href="https://static.parastorage.com">',
  ].join('\n  ');
  return { title, canonical, description, robots, og, twitter, preconnects };
}

function replaceOrInsert(html, regex, tag, insertBefore) {
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return html.replace(insertBefore, `${tag}\n  ${insertBefore}`);
}

function rewriteJsonLdDomain(html) {
  return html.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, match => {
    if (!match.includes(OLD_DOMAIN)) return match;
    return match.split(OLD_DOMAIN).join('theshakticollective.in');
  });
}

function inject(html, route) {
  const meta = buildMeta(html, route);
  const tags = headTags(meta);
  const headEnd = '</head>';
  if (!html.includes('<head') || !html.includes(headEnd)) return html;

  // 1. Rewrite the Wix mirror JSON-LD (Organization/WebPage/FAQ) to the real domain.
  html = rewriteJsonLdDomain(html);

  // 2. Title / canonical / description / robots.
  html = replaceOrInsert(html, /<title>[^<]*<\/title>/i, tags.title, headEnd);
  html = replaceOrInsert(html, /<link\s+rel="canonical"[^>]*>/i, tags.canonical, headEnd);
  html = replaceOrInsert(html, /<meta\s+name="description"[^>]*>/i, tags.description, headEnd);
  html = replaceOrInsert(html, /<meta\s+name="robots"[^>]*>/i, tags.robots, headEnd);

  // 3. Open Graph — replace any existing og:* meta wholesale.
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '');
  html = html.replace(headEnd, `${tags.og}\n  ${headEnd}`);

  // 4. Twitter tags.
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '');
  html = html.replace(headEnd, `${tags.twitter}\n  ${headEnd}`);

  // 5. Preconnect / dns-prefetch (dedupe any existing).
  html = html.replace(/<link\s+rel="preconnect"[^>]*>\s*/gi, '');
  html = html.replace(/<link\s+rel="dns-prefetch"[^>]*>\s*/gi, '');
  html = html.replace(headEnd, `${tags.preconnects}\n  ${headEnd}`);

  // 6. Own JSON-LD blocks — remove previously-injected ones (marked), then insert fresh.
  html = html.replace(new RegExp(`<!--${JSONLD_MARKER}:start-->[\\s\\S]*?<!--${JSONLD_MARKER}:end-->\\s*`, 'g'), '');
  const extraBlocks = jsonLdBlocks(route, meta)
    .map(block => `<!--${JSONLD_MARKER}:start--><script type="application/ld+json">${JSON.stringify(block)}</script><!--${JSONLD_MARKER}:end-->`)
    .join('\n  ');
  if (extraBlocks) html = html.replace(headEnd, `${extraBlocks}\n  ${headEnd}`);

  return html;
}

function main() {
  const manifest = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    : { primaryPages: [], subpages: [] };
  const pages = [...(manifest.primaryPages || []), ...(manifest.subpages || [])];
  const byFile = new Map();
  for (const page of pages) {
    if (!page.file || REDIRECT_ROUTES.has(page.route)) continue;
    if (!byFile.has(page.file)) byFile.set(page.file, page);
  }
  for (const page of EXTRA_PAGES) {
    if (!byFile.has(page.file)) byFile.set(page.file, page);
  }

  let updated = 0;
  for (const [file, page] of byFile) {
    const filePath = path.join(pagesDir, file);
    if (!fs.existsSync(filePath)) continue;
    const html = fs.readFileSync(filePath, 'utf8');
    const next = inject(html, page.route);
    if (next !== html) {
      fs.writeFileSync(filePath, next, 'utf8');
      updated++;
    }
  }
  console.log(`SEO tags: updated ${updated} pages (canonical, meta, OG, Twitter, JSON-LD, preconnect).`);
}

main();
