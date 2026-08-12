import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const payloadDir = 'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt';
const existing = new Set(fs.readdirSync(payloadDir).filter((f) => f.includes('f145183b')));

// Build full route→payload from pageId in HTML
const routePayloads = {};
for (const file of fs.readdirSync('public/pages')) {
  if (!file.endsWith('.html')) continue;
  const route = file === 'home.html' ? '/' : '/' + file.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join('public/pages', file), 'utf8');
  const ids = [...html.matchAll(/[?&]pageId=(19f989_[a-f0-9]+_\d+\.json)/g)].map((m) => m[1]);
  const named = [...html.matchAll(/thunderbolt-features--(19f989_[a-f0-9]+_\d+\.json)--desktop--f145183b/g)].map((m) => m[1]);
  const pageIds = [...new Set([...ids, ...named])].filter((id) => !id.includes('c8466e696b35fc1b5a4e28bc1ad3d620'));
  const pick = pageIds[0];
  if (!pick) {
    routePayloads[route] = { payload: null, exists: false };
    continue;
  }
  const filename = `thunderbolt-features--${pick}--desktop--f145183b.bundle.min.json`;
  routePayloads[route] = { payload: filename, exists: existing.has(filename), pageId: pick };
}
fs.writeFileSync('artifacts/motion-route-payloads-full.json', JSON.stringify(routePayloads, null, 2));

const pairs = [
  ['/', 'https://meghanabhawalkarwo.wixstudio.com/my-site', 'http://127.0.0.1:3001/'],
  ['/about', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank', 'http://127.0.0.1:3001/about'],
  ['/work', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-1', 'http://127.0.0.1:3001/work'],
  ['/artists', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-2', 'http://127.0.0.1:3001/artists'],
  ['/films', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-11', 'http://127.0.0.1:3001/films'],
  ['/yugm', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10-1', 'http://127.0.0.1:3001/yugm'],
  ['/harshad-duhita', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10', 'http://127.0.0.1:3001/harshad-duhita'],
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function probe(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(2500);
  await page.evaluate(() => {
    const ads = document.getElementById('WIX_ADS');
    if (ads) ads.style.display = 'none';
    document.documentElement.style.setProperty('--wix-ads-height', '0px');
  });
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[id^="comp-"]')).slice(0, 400);
    let motionNamed = 0;
    let paused = 0;
    let running = 0;
    let enterPending = 0;
    let enterDone = 0;
    const samples = [];
    nodes.forEach((el) => {
      const cs = getComputedStyle(el);
      const names = String(cs.animationName || '');
      if (!names || names === 'none' || names.indexOf('motion-') === -1) return;
      motionNamed++;
      const play = String(cs.animationPlayState || '');
      if (play.indexOf('paused') !== -1) paused++;
      if (play.indexOf('running') !== -1) running++;
      if (el.dataset.motionEnter === 'done') enterDone++;
      else if (el.dataset.motionEnter) enterPending++;
      if (samples.length < 8) {
        samples.push({
          id: el.id,
          names: names.split(',')[0].trim(),
          play,
          enter: el.dataset.motionEnter || '',
          op: cs.opacity,
        });
      }
    });
    return {
      motionNamed,
      paused,
      running,
      enterDone,
      enterPending,
      authoredBound: document.querySelectorAll('[data-tsc-wix-authored-motion-bound="1"]').length,
      motionScript: !!document.querySelector('script[src*="tsc-wix-motion"]'),
      authoredScript: !!document.querySelector('script[src*="tsc-wix-authored-motion"]'),
      samples,
    };
  });
}

const browser = await puppeteer.launch({ headless: true, executablePath: chrome, args: ['--window-size=1280,900'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
const report = [];
for (const [route, refUrl, localUrl] of pairs) {
  let ref = null;
  let local = null;
  try {
    ref = await probe(page, refUrl);
  } catch (e) {
    ref = { error: String(e.message || e) };
  }
  try {
    local = await probe(page, localUrl);
  } catch (e) {
    local = { error: String(e.message || e) };
  }
  report.push({
    route,
    payload: routePayloads[route],
    ref,
    local,
    ok: !!(local && !local.error && local.paused === 0 && (local.motionNamed > 0 ? local.enterDone + local.running > 0 : true)),
  });
  console.log(route, 'ref paused', ref && ref.paused, 'local paused', local && local.paused, 'local enterDone', local && local.enterDone, 'authored', local && local.authoredBound);
}
await browser.close();
fs.writeFileSync('artifacts/motion-parity-audit.json', JSON.stringify(report, null, 2));
const missingPayloads = Object.entries(routePayloads).filter(([, v]) => v.payload && !v.exists);
console.log('\nMISSING PAYLOAD FILES', missingPayloads.length);
missingPayloads.slice(0, 20).forEach(([k, v]) => console.log(k, v.payload));
const failed = report.filter((r) => !r.ok);
console.log('AUDIT FAIL', failed.map((f) => f.route));
