import fs from 'fs';
import path from 'path';

const pagesDir = 'public/pages';
const bad = [
  'mba',
  'young-gunns',
  'classicalreview',
  'havells-myousic',
  'masterclass-review01',
  'from-bhajan-to-clubbing',
  'hanuman-ansh-impact',
  'kalki-impact',
  'mba-impact',
];

for (const b of bad) {
  const html = fs.readFileSync(path.join(pagesDir, b + '.html'), 'utf8');
  const feats = [...html.matchAll(/id="(features_[^"]+)"/g)].map((m) => m[1]);
  const pageIds = [...new Set([...html.matchAll(/pageId=(19f989_[a-f0-9]+_\d+\.json)/g)].map((m) => m[1]))];
  const named = [...html.matchAll(/thunderbolt-features--19f989_[a-f0-9]+_\d+\.json--(?:desktop|mobile)--[a-f0-9]+\.bundle\.min\.json/g)];
  console.log(JSON.stringify({ page: b, feats, pageIds, namedCount: named.length, named0: named[0] || null }));
}
