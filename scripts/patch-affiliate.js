const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/pages/affiliate.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('Patching public/pages/affiliate.html...');

// Helper to trace tag matching for DIVs
function removeDivById(content, divId) {
  const marker = `id="${divId}"`;
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) {
    console.warn(`Could not find DIV with id: ${divId}`);
    return content;
  }
  
  // Backtrack to find the start tag '<div' of this element
  let openTagIdx = content.lastIndexOf('<div', startIdx);
  if (openTagIdx === -1) {
    console.warn(`Could not find opening div tag for id: ${divId}`);
    return content;
  }

  let depth = 0;
  let endIdx = openTagIdx;
  
  while (endIdx < content.length) {
    if (content.slice(endIdx, endIdx + 4) === '<div') {
      depth++;
      endIdx += 4;
    } else if (content.slice(endIdx, endIdx + 6) === '</div>') {
      depth--;
      endIdx += 6;
      if (depth === 0) {
        break;
      }
    } else {
      endIdx++;
    }
  }

  // Also remove surrounding comment tags if present
  let finalStartIdx = openTagIdx;
  let finalEndIdx = endIdx;

  if (content.slice(openTagIdx - 14, openTagIdx) === '<!--$--><!--$-->') {
    finalStartIdx = openTagIdx - 14;
  } else if (content.slice(openTagIdx - 7, openTagIdx) === '<!--$-->') {
    finalStartIdx = openTagIdx - 7;
  }

  if (content.slice(endIdx, endIdx + 16) === '<!--/$--><!--/$-->') {
    finalEndIdx = endIdx + 16;
  } else if (content.slice(endIdx, endIdx + 8) === '<!--/$-->') {
    finalEndIdx = endIdx + 8;
  }

  console.log(`Successfully removed DIV with id: ${divId}`);
  return content.slice(0, finalStartIdx) + content.slice(finalEndIdx);
}

// Helper for exact string replacement with validation
function replaceExact(target, replacement) {
  const idx = html.indexOf(target);
  if (idx === -1) {
    console.warn(`Could not find target string to replace: ${target.slice(0, 100)}...`);
    return;
  }
  html = html.slice(0, idx) + replacement + html.slice(idx + target.length);
}

// Helper to replace inner content of a Wix rich text div safely
function replaceInnerRichText(id, innerHtml) {
  const marker = `id="${id}"`;
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) {
    console.warn(`Could not find element with id: ${id}`);
    return;
  }
  const tagEndIdx = html.indexOf('>', startIdx);
  if (tagEndIdx === -1) {
    console.warn(`Could not find end of opening tag for id: ${id}`);
    return;
  }
  const closeIdx = html.indexOf('</div>', tagEndIdx);
  if (closeIdx === -1) {
    console.warn(`Could not find closing div for id: ${id}`);
    return;
  }
  
  html = html.slice(0, tagEndIdx + 1) + innerHtml + html.slice(closeIdx);
}

// 1. Metadata Replacements
replaceExact(
  '<title>TSC Academy | Music Mentorship for Artists and Creators</title>',
  '<title>Affiliate Program | TSC Academy</title>'
);

replaceExact(
  '<link rel="canonical" href="https://wix-site-clone-psi.vercel.app/academy">',
  '<link rel="canonical" href="https://theshakticollective.in/affiliate">'
);

// Replace description tags
html = html.replace(
  /<meta name="description" content="[^"]*"/,
  '<meta name="description" content="Partner with TSC Academy. Share mentorship-led music courses with artists and grow with every enrollment."'
);
html = html.replace(
  /<meta property="og:description" content="[^"]*"/,
  '<meta property="og:description" content="Partner with TSC Academy. Share mentorship-led music courses with artists and grow with every enrollment."'
);
html = html.replace(
  /<meta name="twitter:description" content="[^"]*"/,
  '<meta name="twitter:description" content="Partner with TSC Academy. Share mentorship-led music courses with artists and grow with every enrollment."'
);

// Append affiliate stylesheet link right before </head>
replaceExact('</head>', '  <link rel="stylesheet" href="/css/pages/affiliate.css?v=academy-chrome-2">\n</head>');

// 2. Body configuration
replaceExact("<body class='responsive' >", "<body class='responsive affiliate-page' data-page=\"affiliate\">");

// 3. Hero Section edits
// - Eyebrow
replaceInnerRichText('comp-mqwe8zdd', '<p class="font_7 wixui-rich-text__text"><span class="wixui-rich-text__text">TSC ACADEMY AFFILIATE PROGRAM</span></p>');

// - Title
replaceInnerRichText('comp-mqwcozxs', '<h1 class="font_0 wixui-rich-text__text">Grow With<br class="wixui-rich-text__text">TSC Academy</h1>');

// - Dek (Description)
replaceInnerRichText('comp-mqwdnovu', '<p class="font_7 wixui-rich-text__text"><span class="wixui-rich-text__text">Invite musicians, creators, and cultural communities into mentorship-led Academy courses. When your audience enrolls, you grow with TSC Academy.</span></p>');

// - CTA Button Link, Label, Target
replaceExact(
  '<div class="comp-mqwe17k6 lIkFMb" id="comp-mqwe17k6" aria-disabled="false"><a data-testid="linkElement" data-anchor="anchors-mpjyp1g0" href="/academy" target="_self" class="PoVCDy wixui-button ZhVEJq" aria-disabled="false" aria-label="Explore Courses"><span class="Gf1CuA wixui-button__label">Explore Courses</span></a></div>',
  '<div class="comp-mqwe17k6 lIkFMb" id="comp-mqwe17k6" aria-disabled="false"><a data-testid="linkElement" href="https://tscacademy.exlyapp.com/affiliate/onboarding" target="_blank" rel="noopener" class="PoVCDy wixui-button ZhVEJq" aria-disabled="false" aria-label="Apply to Affiliate"><span class="Gf1CuA wixui-button__label">Apply to Affiliate</span></a></div>'
);

// - Hero Image URL & structure in wow-image/picture
html = html.replace(
  /<div id="comp-mqwhzev1" data-testid="imageX" class="i4P7Vt comp-mqwhzev1 ZYZJBv wixui-image">[\s\S]*?<\/wow-image><\/div><\/div><\/div>/,
  '<div id="comp-mqwhzev1" data-testid="imageX" class="i4P7Vt comp-mqwhzev1 ZYZJBv wixui-image"><div class="YX2qkL"><div class="qR3Oj6" style="width:100%;height:100%;"><img loading="eager" src="/assets/pages/affiliate/hero-singer.png" alt="TSC Academy singer silhouette" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%;display:block;opacity:1;visibility:visible;" /></div></div></div>'
);

// 4. Section 2 (Intro Columns)
// - Eyebrow "ARE YOU READY?"
replaceInnerRichText('comp-mqwe9noc', '<p class="font_7 wixui-rich-text__text">BUILT FOR CULTURAL CONNECTORS</p>');

// - Title "Every artist has a story waiting to unfold."
replaceInnerRichText('comp-mqwe9nmy', '<h1 class="font_0 wixui-rich-text__text">Share courses that<br class="wixui-rich-text__text">artists can trust.</h1>');

// - Dek paragraph blocks
replaceInnerRichText('comp-mqweb0ql', '<p class="font_8 wixui-rich-text__text">When your audience enrolls in our academy courses, they gain access to structured mentorship from industry legends. As a partner, you play a key role in their development.</p><p class="font_8 wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></p><p class="font_8 wixui-rich-text__text">We offer complete transparency, customized resource kits, and competitive payouts for every successful onboarding. A simple way to share learning that matters.</p>');

// 5. Section 3 (Cards) content
// - Card 1 Heading
replaceInnerRichText('comp-mqwgfbox4', '<h1 class="font_0 wixui-rich-text__text">Who it is for</h1>');
// - Card 1 Body
replaceInnerRichText('comp-mqwgfbov1', '<p class="font_7 wixui-rich-text__text">Educators, creators, community leads, artist managers, and culture builders who already guide people into music learning.</p>');

// - Card 2 Heading
replaceInnerRichText('comp-mqwh4oag', '<h1 class="font_0 wixui-rich-text__text">What you share</h1>');
// - Card 2 Body
replaceInnerRichText('comp-mqwh4o8u', '<p class="font_7 wixui-rich-text__text">TSC Academy courses across composition, Hindustani classical, and music production with focused landing pages and clear enrollment CTAs.</p>');

// - Card 3 Heading
replaceInnerRichText('comp-mqwh7m3z2', '<h1 class="font_0 wixui-rich-text__text">How to join</h1>');
// - Card 3 Body
replaceInnerRichText('comp-mqwh7m5j', '<p class="font_7 wixui-rich-text__text">Apply through the Academy partner portal, complete onboarding, and start sharing your affiliate link with the right artist audiences.</p>');

// 6. Delete Card 4, Card 5, and Card 6 from grid
html = removeDivById(html, 'comp-mqwg32q3');
html = removeDivById(html, 'comp-mqwg32qr');
html = removeDivById(html, 'comp-mqwg4pmn');

// 7. Delete all sections starting from #comp-mpjyp1e7 to the end of <main>
const mainStart = html.indexOf('<main');
const sectionStart = html.indexOf('<section id="comp-mpjyp1e7"');
const mainEnd = html.indexOf('</main>');

if (sectionStart !== -1 && mainEnd !== -1 && sectionStart > mainStart && sectionStart < mainEnd) {
  console.log('Successfully cut sections below the cards section.');
  const affiliateBandHtml = `
  <section class="affiliate-band" aria-labelledby="affiliate-band-title">
    <div>
      <p>Affiliate rhythm</p>
      <h2 id="affiliate-band-title">Simple enough to share. Serious enough for artists.</h2>
    </div>
    <div class="affiliate-band-actions">
      <a class="affiliate-primary-cta" href="https://tscacademy.exlyapp.com/affiliate/onboarding" target="_blank" rel="noopener">Start Affiliate Onboarding</a>
      <a class="affiliate-secondary-cta" href="/assets/pages/affiliate/beginners-guide-affiliate-program.pdf" download="beginners-guide-affiliate-program.pdf">Download Beginners Guide</a>
    </div>
  </section>
  `;
  html = html.slice(0, sectionStart) + affiliateBandHtml + html.slice(mainEnd);
} else {
  console.error('Error finding start of courses section or end of main tag.');
}

// 8. Remove the inline script tag at the bottom that repairs academy elements safely without regex greediness
const scriptStartToken = 'function repairDropdowns() {';
const searchIdx = html.indexOf(scriptStartToken);
if (searchIdx !== -1) {
  const openScriptIdx = html.lastIndexOf('<script', searchIdx);
  const closeScriptIdx = html.indexOf('</script>', searchIdx) + 9;
  if (openScriptIdx !== -1 && closeScriptIdx !== -1) {
    html = html.slice(0, openScriptIdx) + html.slice(closeScriptIdx);
    console.log('Successfully removed inline script block.');
  }
} else {
  console.warn('Could not find inline script repairDropdowns start token.');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully patched affiliate.html!');
