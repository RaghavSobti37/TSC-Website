const fs = require('fs');
const pages = ['films', 'mahavatar-narsimha', 'hanuman-ansh', 'mahaprbhu', 'kalki'];
for (const p of pages) {
  const h = fs.readFileSync('public/pages/' + p + '.html', 'utf8');
  const root = (h.match(/id="([a-z0-9]{5})" class="ETqrjz/) || [])[1];
  const secs = [...h.matchAll(/id="(comp-[a-z0-9]+)"[^>]*data-testid="section-container"/g)].map((m) => m[1]);
  const imgs = (h.match(/data-testid="imageX"/g) || []).length;
  const vids = (h.match(/<video/gi) || []).length;
  const bgMedia = (h.match(/data-motion-part="BG_MEDIA/g) || []).length;
  const headlines = [...h.matchAll(/<(h[1-6]|p)[^>]*class="[^"]*font_[0-9]+[^"]*"[^>]*>[\s\S]{0,80}/g)]
    .slice(0, 8)
    .map((m) => m[0].replace(/\s+/g, ' ').slice(0, 100));
  console.log('\n===', p, 'root', root, '===');
  console.log('sections', secs.length, secs.slice(0, 8).join(','));
  console.log('imgs', imgs, 'vids', vids, 'bgMedia', bgMedia);
  // Extract visible text snippets from first few rich texts
  const texts = [...h.matchAll(/class="font_[0-9]+ wixui-rich-text__text"[^>]*>([^<]{3,120})</g)]
    .map((m) => m[1].replace(/&nbsp;/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 12);
  console.log('copy:', texts.join(' | '));
}
