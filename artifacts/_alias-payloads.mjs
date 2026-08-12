import fs from 'fs';
import path from 'path';

const dir = 'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt';
const files = fs.readdirSync(dir).filter((f) => f.startsWith('thunderbolt-features--') && f.endsWith('.json'));

const byPage = new Map();
for (const f of files) {
  const m = f.match(/^thunderbolt-features--(19f989_[a-f0-9]+_\d+\.json)--(desktop|mobile)--([a-f0-9]+)\.bundle\.min\.json$/);
  if (!m) continue;
  const size = fs.statSync(path.join(dir, f)).size;
  if (size < 100) continue;
  const key = m[1];
  const cur = byPage.get(key);
  if (!cur || size > cur.size) byPage.set(key, { file: f, size, hash: m[3] });
}

let copied = 0;
for (const [pageId, best] of byPage) {
  const alias = `thunderbolt-features--${pageId}--desktop--f145183b.bundle.min.json`;
  const aliasPath = path.join(dir, alias);
  const aliasSize = fs.existsSync(aliasPath) ? fs.statSync(aliasPath).size : 0;
  if (aliasSize >= 100) continue;
  fs.copyFileSync(path.join(dir, best.file), aliasPath);
  console.log('alias', alias, '<-', best.file, best.size);
  copied++;
}
console.log({ pages: byPage.size, copied });

const yugm = JSON.parse(fs.readFileSync(path.join(dir, 'thunderbolt-features--19f989_dc1d76e58ecbad2de8aa4285466030bb_1362.json--desktop--f145183b.bundle.min.json'), 'utf8'));
console.log('yugm comps', Object.keys(yugm.props?.motion?.animationDataByCompId || {}).length);

const harshad = JSON.parse(fs.readFileSync(path.join(dir, 'thunderbolt-features--19f989_159d929017716035d5a9369ee49213df_1362.json--desktop--f145183b.bundle.min.json'), 'utf8'));
console.log('harshad comps', Object.keys(harshad.props?.motion?.animationDataByCompId || {}).length);
