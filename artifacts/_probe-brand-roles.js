const fs = require('fs');
const html = fs.readFileSync('public/pages/about.html', 'utf8');

const maps = [
  {
    name: 'Artists',
    section: 'comp-mr38xqqo',
    next: 'comp-mr3axlwa'
  },
  {
    name: 'Academy',
    section: 'comp-mr3axlwa',
    next: 'comp-mr3hvomh'
  },
  {
    name: 'Originals',
    section: 'comp-mr3hvomh',
    next: 'comp-mr3fzsjq'
  },
  {
    name: 'ArtistPath',
    section: 'comp-mr3fzsjq',
    next: 'comp-mr3hkny1'
  },
  {
    name: 'Films',
    section: 'comp-mr3hkny1',
    next: 'comp-mr3iatty'
  }
];

function analyze(name, startId, endId) {
  const start = html.indexOf('id="' + startId + '"');
  const end = html.indexOf('id="' + endId + '"');
  const slice = html.slice(start, end);
  console.log('\n######## ' + name + ' ########');

  // Find each wixui-box and classify by children text / button / image
  const boxRe = /<(?:div|section)\b([^>]*\bid="(comp-[^"]+)"[^>]*)>/g;
  let m;
  const nodes = [];
  while ((m = boxRe.exec(slice))) {
    const id = m[2];
    const open = m[1];
    if (!/wixui-box|wixui-button|lIkFMb|wixui-vector|wixui-image|wixui-rich-text/.test(open + ' ' + (slice.slice(m.index, m.index + 80)))) {
      // still capture if class has those
    }
    const cls = ((open.match(/class="([^"]*)"/) || [])[1] || '');
    const kind = /wixui-box/.test(cls)
      ? 'box'
      : /lIkFMb|wixui-button/.test(cls)
        ? 'btn'
        : /wixui-vector/.test(cls)
          ? 'svg'
          : /wixui-image/.test(cls)
            ? 'img'
            : /wixui-rich-text/.test(cls)
              ? 'text'
              : null;
    if (!kind) continue;
    // get text content until next few hundred chars of rich text
    const window = slice.slice(m.index, m.index + 1200);
    const texts = [...window.matchAll(/wixui-rich-text__text[^>]*>([^<]{1,80})</g)]
      .map((x) => x[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 4);
    const hasBtn = /Know More|wixui-button/i.test(window.slice(0, 600));
    const hasSvg = /wixui-vector|svgRoot/i.test(window.slice(0, 600));
    const hasImg = /wixui-image|wow-image/i.test(window.slice(0, 400));
    nodes.push({ id, kind, texts, hasBtn, hasSvg, hasImg, depthHint: (open.match(/comp-/g) || []).length });
  }

  // Print only top-level-ish boxes under card: those with kind box that have meaningful role
  nodes
    .filter((n) => n.kind === 'box' || n.kind === 'btn')
    .slice(0, 25)
    .forEach((n) => {
      console.log(
        n.kind.padEnd(4),
        n.id,
        n.hasSvg ? '[SVG]' : '',
        n.hasImg ? '[IMG]' : '',
        n.hasBtn ? '[BTN]' : '',
        n.texts.join(' / ')
      );
    });
}

maps.forEach((c) => analyze(c.name, c.section, c.next));
