const fs = require('fs');

const EARLY_CSS = `<style data-tsc-mohit-off>
/* Owner: Mohit Shankar roster card commented out — Harshad + Yugm only */
#comp-mqutenq5,
[id^="comp-mqutenq"] {
  display: none !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
  pointer-events: none !important;
  visibility: hidden !important;
}
</style>`;

function patchHtml(file) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!html.includes('data-tsc-mohit-off')) {
    // Inject after standalone runtime style block
    const anchor = '<style data-tsc-standalone-runtime>';
    const idx = html.indexOf(anchor);
    if (idx < 0) throw new Error('anchor missing in ' + file);
    // find end of that style
    const end = html.indexOf('</style>', idx);
    if (end < 0) throw new Error('style end missing');
    html = html.slice(0, end + 8) + '\n' + EARLY_CSS + html.slice(end + 8);
    changed = true;
  }

  // Detach from any warmup/structure children lists in the HTML itself
  const triples = [
    ['"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"', '"comp-mqtpn27i","comp-mqtq8rsp"'],
    ['"comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5",', '"comp-mqtpn27i","comp-mqtq8rsp",'],
    ['"compIdsWithAccessibleTrigger":["comp-mqtpn27i","comp-mqtq8rsp","comp-mqutenq5"]', '"compIdsWithAccessibleTrigger":["comp-mqtpn27i","comp-mqtq8rsp"]'],
    ['"box26":"comp-mqutenq5",', ''],
    ['"box26":[{"compId":"comp-mqutenq5","role":"box26"}],', '']
  ];
  for (const [from, to] of triples) {
    if (html.includes(from)) {
      html = html.split(from).join(to);
      changed = true;
      console.log(file, 'scrubbed', from.slice(0, 50));
    }
  }

  // Blank Mohit name in any leftover JSON/HTML text
  if (/Mohit Shankar/.test(html)) {
    html = html.replace(/Mohit Shankar/g, '');
    changed = true;
    console.log(file, 'blanked Mohit Shankar text');
  }

  if (changed) {
    fs.writeFileSync(file, html);
    console.log('updated', file);
  } else {
    console.log('no change', file);
  }
}

patchHtml('public/pages/artists.html');
patchHtml('public/artists/index.html');
