import fs from 'fs';
import path from 'path';

const pagesDir = 'public/pages';
const outDir = 'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt';
const map = {};

for (const file of fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const route = file === 'home.html' ? '/' : '/' + file.replace(/\.html$/, '');
  const links = [...html.matchAll(/<link[^>]+id="(features_[^"]+)"[^>]*>/gi)];
  let payload = '';
  for (const m of links) {
    const tag = m[0];
    const id = m[1];
    if (id === 'features_masterPage') continue;
    const hm = tag.match(/href="([^"]+)"/i);
    if (!hm) continue;
    const href = hm[1];
    const named = href.match(/thunderbolt-features--19f989_[a-f0-9]+_\d+\.json--(?:desktop|mobile)--[a-f0-9]+\.bundle\.min\.json/);
    if (named) {
      payload = named[0].replace(/--mobile--/, '--desktop--');
      break;
    }
    const pageId = href.match(/[?&]pageId=(19f989_[a-f0-9]+_\d+\.json)/);
    if (pageId) {
      payload = `thunderbolt-features--${pageId[1]}--desktop--f145183b.bundle.min.json`;
      break;
    }
  }
  if (!payload) continue;
  const p = path.join(outDir, payload);
  if (!fs.existsSync(p) || fs.statSync(p).size < 100) continue;
  map[route] = payload;
}

fs.writeFileSync('artifacts/route-payloads.generated.json', JSON.stringify(map, null, 2));
console.log('routes', Object.keys(map).length);
console.log(JSON.stringify(map, null, 2));
