/**
 * Phase 2 content/link patches for TSC-Website pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pages = path.join(__dirname, '..', 'public', 'pages');
const publicRoot = path.join(__dirname, '..', 'public');

function write(file, html) {
  fs.writeFileSync(file, html);
  console.log('wrote', path.relative(publicRoot, file));
}

// —— About: TSC Originals → /work, TSC Films → /films ——
{
  const file = path.join(pages, 'about.html');
  let html = fs.readFileSync(file, 'utf8');
  // Image + Know More for Originals block (comp-mr3hvonz*)
  html = html.replace(
    /(id="comp-mr3hvonz6"[\s\S]{0,400}?href=")\/the-heart-of-composition(")/,
    '$1/work$2'
  );
  html = html.replace(
    /(id="comp-mr3hvon[^"]*"[\s\S]{0,800}?href=")\/the-heart-of-composition("[\s\S]{0,200}?Know More)/,
    '$1/work$2'
  );
  // Films block
  html = html.replace(
    /(id="comp-mr3hknzg"[\s\S]{0,400}?href=")\/the-heart-of-composition(")/,
    '$1/films$2'
  );
  html = html.replace(
    /(id="comp-mr3hkn[^"]*"[\s\S]{0,800}?href=")\/the-heart-of-composition("[\s\S]{0,200}?Know More)/,
    '$1/films$2'
  );
  // Broader: any Know More still pointing wrong near TSC Films heading section
  // Fix Originals Know More button if still heart-of-composition
  const origIdx = html.indexOf('TSC Originals develops');
  if (origIdx > 0) {
    const slice = html.slice(origIdx, origIdx + 3500);
    const fixed = slice.replace(/href="\/the-heart-of-composition"/g, 'href="/work"');
    html = html.slice(0, origIdx) + fixed + html.slice(origIdx + slice.length);
  }
  const filmsIdx = html.indexOf('TSC Films partners');
  if (filmsIdx > 0) {
    const slice = html.slice(filmsIdx, filmsIdx + 3500);
    const fixed = slice.replace(/href="\/the-heart-of-composition"/g, 'href="/films"');
    html = html.slice(0, filmsIdx) + fixed + html.slice(filmsIdx + slice.length);
  }
  write(file, html);
  // Mirror about/index.html if present
  const mirror = path.join(publicRoot, 'about', 'index.html');
  if (fs.existsSync(mirror)) {
    fs.writeFileSync(mirror, html);
    console.log('wrote about/index.html');
  }
}

// —— Artists: Harshaduhita → /harshad-duhita; comment out Mohit ——
{
  const file = path.join(pages, 'artists.html');
  let html = fs.readFileSync(file, 'utf8');
  // Harshad card image + Learn More (comp-mqtpn27o / comp-mqtpn27z)
  html = html.replace(
    /(id="comp-mqtpn27o"[\s\S]{0,300}?href=")\/young-gunns(")/,
    '$1/harshad-duhita$2'
  );
  html = html.replace(
    /(id="comp-mqtpn27z"[\s\S]{0,200}?href=")\/young-gunns(")/,
    '$1/harshad-duhita$2'
  );
  // Also any remaining young-gunns near Harshaduhita Collective text
  const harshIdx = html.indexOf('Harshaduhita Collective');
  if (harshIdx > 0) {
    const start = Math.max(0, harshIdx - 2500);
    const end = harshIdx + 2500;
    const slice = html.slice(start, end).replace(/href="\/young-gunns"/g, 'href="/harshad-duhita"');
    html = html.slice(0, start) + slice + html.slice(end);
  }

  // Hide Mohit Shankar card — wrap nearest parent box containing the name
  const mohit = html.indexOf('>Mohit Shankar<');
  if (mohit > 0 && !html.includes('data-tsc-mohit-hidden')) {
    // Find enclosing card starting at comp-mqutenq*
    const cardStart = html.lastIndexOf('<div id="comp-mqutenq', mohit);
    // Find a reasonable end: next major card after Mohit Learn More
    const learnMore = html.indexOf('id="comp-mqutenqm"', mohit);
    let cardEnd = learnMore > 0 ? html.indexOf('</div><!--/$--></div><!--/$--></div><!--/$-->', learnMore) : -1;
    if (cardStart > 0 && cardEnd > cardStart) {
      cardEnd = html.indexOf('>', cardEnd) + 1;
      const block = html.slice(cardStart, cardEnd);
      html =
        html.slice(0, cardStart) +
        '<!-- data-tsc-mohit-hidden: Mohit Shankar card commented out per request -->\n<!--' +
        block.replace(/--/g, '&#45;&#45;') +
        '-->\n' +
        html.slice(cardEnd);
    } else {
      // Fallback CSS hide via injected style
      html = html.replace(
        '</head>',
        '<style id="tsc-hide-mohit">#comp-mqutenqa,#comp-mqutenqm,#comp-mqutenqk,[id^="comp-mqutenq"]{display:none!important}</style></head>'
      );
    }
  }
  write(file, html);
  const mirror = path.join(publicRoot, 'artists', 'index.html');
  if (fs.existsSync(mirror)) fs.writeFileSync(mirror, html);
}

// —— Films: Resources / Email Us + spacing ——
{
  const file = path.join(pages, 'films.html');
  let html = fs.readFileSync(file, 'utf8');
  // Resources button
  html = html.replace(
    /(<div class="comp-mqmkrjnm[^"]*" id="comp-mqmkrjnm"[^>]*>)([\s\S]*?<div data-testid="linkElement")([^>]*>)/,
    '$1$2 href="/resources" role="link"$3'
  );
  // If Resources still no href — inject on the linkElement inside Resources button
  if (!/comp-mqmkrjnm[\s\S]{0,400}?href="\/resources"/.test(html)) {
    html = html.replace(
      /id="comp-mqmkrjnm"[\s\S]{0,350}?data-testid="linkElement"/,
      (m) => m.includes('href=') ? m : m.replace('data-testid="linkElement"', 'data-testid="linkElement" href="/resources"')
    );
  }
  // Email Us
  if (!/comp-mqmkth8f[\s\S]{0,400}?mailto:/.test(html)) {
    html = html.replace(
      /id="comp-mqmkth8f"[\s\S]{0,350}?data-testid="linkElement"/,
      (m) =>
        m.includes('href=')
          ? m
          : m.replace(
              'data-testid="linkElement"',
              'data-testid="linkElement" href="mailto:artist@theshakticollective.in"'
            )
    );
  }
  // Fix "They need    communities" spacing / justify
  html = html.replace(/They need[\s\u00a0]+communities/g, 'They need communities');
  html = html.replace(/They need<\/span>\s*<span[^>]*>\s*communities/gi, 'They need communities');
  write(file, html);
  const mirror = path.join(publicRoot, 'films', 'index.html');
  if (fs.existsSync(mirror)) fs.writeFileSync(mirror, html);
}

// —— Resources: fix blog links + add cards via content-replacements hook note ——
{
  const file = path.join(pages, 'resources.html');
  let html = fs.readFileSync(file, 'utf8');
  // Card 1 wrongly → insta-music-league
  html = html.replace(/href="\/insta-music-league"/g, 'href="/start-making-music"');
  write(file, html);
  const mirror = path.join(publicRoot, 'resources', 'index.html');
  if (fs.existsSync(mirror)) fs.writeFileSync(mirror, html);
}

console.log('phase2 page patches done');
