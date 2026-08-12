import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL } from 'url';

const pagesDir = 'public/pages';
const outDir = 'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt';

function safe(value, fallback) {
  return String(value || fallback).replace(/[^a-zA-Z0-9._-]+/g, '_');
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 TSC-mirror', Accept: 'application/json' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(get(new URL(res.headers.location, url).href));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: Buffer.concat(chunks) });
      });
    });
    req.on('error', reject);
  });
}

const jobs = new Map();

for (const file of fs.readdirSync(pagesDir)) {
  if (!file.endsWith('.html')) continue;
  const html = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  // Query-style local mirror links
  for (const m of html.matchAll(/\/assets\/mirror\/siteassets\.parastorage\.com\/pages\/pages\/thunderbolt\?([^"'<\s]+)/g)) {
    const qs = m[1];
    const params = new URLSearchParams(qs);
    const moduleName = params.get('module') || 'thunderbolt-features';
    const pageId = params.get('pageId') || 'page';
    const formFactor = params.get('formFactor') || params.get('deviceType') || 'desktop';
    const fileId = params.get('fileId') || 'file';
    const localName = [safe(moduleName, 'module'), safe(pageId, 'page'), safe(formFactor, 'desktop'), safe(fileId, 'file')].join('--') + '.json';
    const localPath = path.join(outDir, localName);
    const size = fs.existsSync(localPath) ? fs.statSync(localPath).size : 0;
    if (size > 100) continue;
    // Rebuild CDN URL — strip local mirror prefix from nested URLs in qs
    const remoteQs = qs
      .replace(/%2Fassets%2Fmirror%2Fsiteassets\.parastorage\.com/g, '%2F%2Fsiteassets.parastorage.com')
      .replace(/\/assets\/mirror\/static\.parastorage\.com/g, '//static.parastorage.com')
      .replace(/%2Fassets%2Fmirror%2Fstatic\.parastorage\.com/g, '%2F%2Fstatic.parastorage.com');
    const remote = 'https://siteassets.parastorage.com/pages/pages/thunderbolt?' + remoteQs;
    jobs.set(localName, remote);
  }
  // Named filename links already mirrored — skip if healthy
}

console.log('jobs', jobs.size);
let ok = 0;
let fail = 0;
for (const [localName, remote] of jobs) {
  try {
    const res = await get(remote);
    if (res.status !== 200 || res.body.length < 100) {
      console.log('FAIL', localName, res.status, res.body.length);
      fail++;
      continue;
    }
    fs.writeFileSync(path.join(outDir, localName), res.body);
    console.log('OK', localName, res.body.length);
    ok++;
  } catch (e) {
    console.log('ERR', localName, e.message);
    fail++;
  }
}
console.log({ ok, fail });

// verify yugm
const yugm = path.join(outDir, 'thunderbolt-features--19f989_dc1d76e58ecbad2de8aa4285466030bb_1362.json--desktop--f145183b.bundle.min.json');
const yj = JSON.parse(fs.readFileSync(yugm, 'utf8'));
const comps = yj.props?.motion?.animationDataByCompId;
console.log('yugm comps', comps ? Object.keys(comps).length : 0, 'size', fs.statSync(yugm).size);
