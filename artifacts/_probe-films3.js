const fs = require('fs');

function extractSection(html, sectionId) {
  const start = html.indexOf(`id="${sectionId}"`);
  if (start < 0) return '';
  // Find matching section end — naive: next section or </main>
  const after = html.slice(start);
  const nextSec = after.search(/<\/section>\s*(?:<!--\/\$-->)?\s*(?:<!--\$-->)?\s*<section /);
  const endMain = after.indexOf('</main>');
  let end = nextSec > 0 ? nextSec + 10 : endMain;
  return after.slice(0, Math.min(end, 8000));
}

function analyze(page, sectionIds) {
  const h = fs.readFileSync('public/pages/' + page + '.html', 'utf8');
  console.log('\n########', page, '########');
  for (const sid of sectionIds) {
    const sec = extractSection(h, sid);
    const texts = [...sec.matchAll(/id="(comp-[a-z0-9]+)"[^>]*data-testid="richTextElement"[\s\S]{0,400}?>([^<]{0,150})</g)]
      .map(m => ({ id: m[1], text: m[2].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim().slice(0, 80) }));
    const imgs = [...sec.matchAll(/id="(img_[^"]+|comp-[a-z0-9]+)"[^>]*(?:data-testid="imageX"|wow-image)/g)].map(m => m[1]);
    const boxes = [...sec.matchAll(/id="(comp-[a-z0-9]+)"[^>]*wixui-box/g)].map(m => m[1]);
    const videos = [...sec.matchAll(/<(?:video|wix-video|wix-bg-media)[^>]{0,120}/gi)].map(m => m[0].slice(0, 100));
    console.log('\n--', sid, '--');
    texts.forEach(t => console.log('  text', t.id, ':', t.text));
    if (imgs.length) console.log('  imgs', imgs.slice(0, 8).join(','));
    if (boxes.length) console.log('  boxes', boxes.slice(0, 8).join(','));
    if (videos.length) console.log('  media', videos.join(' | '));
  }
}

analyze('films', [
  'comp-mql25lfk', // hero
  'comp-mqksjwhn',
  'comp-mqmh352i',
  'comp-mqktsjdh',
  'comp-mqktx0nc',
  'comp-mqmk8ekq',
  'comp-mqmhuw20',
  'comp-mqmi6yn5',
  'comp-mqmi8cwy',
  'comp-mqmi8stx',
]);

analyze('mahavatar-narsimha', [
  'comp-mrag5r35',
  'comp-mragklcd',
  'comp-mrahdtka',
  'comp-mraja95h',
  'comp-mraj8oib',
]);

analyze('kalki', [
  'comp-mrbzlzx5',
  'comp-mrbzlzx9',
  'comp-mrbzlzxu',
]);
