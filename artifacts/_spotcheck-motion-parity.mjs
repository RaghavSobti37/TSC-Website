import puppeteer from 'puppeteer';

const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const routes = [
  ['/', 'http://127.0.0.1:3001/?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site'],
  ['/about', 'http://127.0.0.1:3001/about?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/about'],
  ['/yugm', 'http://127.0.0.1:3001/yugm?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10-1'],
  ['/harshad-duhita', 'http://127.0.0.1:3001/harshad-duhita?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-10'],
  ['/films', 'http://127.0.0.1:3001/films?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-11'],
  ['/artist-path', 'http://127.0.0.1:3001/artist-path?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/blank-4'],
  ['/music-production', 'http://127.0.0.1:3001/music-production?v=m3', 'https://meghanabhawalkarwo.wixstudio.com/my-site/music-production'],
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sample(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3200);
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[id^="comp-"]'));
    let motion = 0;
    let paused = 0;
    let running = 0;
    const samples = [];
    nodes.forEach((el) => {
      if (el.id.indexOf('__item-') !== -1) return;
      const cs = getComputedStyle(el);
      const names = String(cs.animationName || '');
      if (!names || names === 'none' || names.indexOf('motion-') === -1) return;
      motion++;
      const play = String(cs.animationPlayState || '');
      if (play.indexOf('paused') !== -1) {
        paused++;
        if (samples.length < 4) samples.push({ id: el.id, names: names.split(',')[0].trim(), play, op: cs.opacity });
      } else {
        running++;
        if (samples.length < 4) samples.push({ id: el.id, names: names.split(',')[0].trim(), play, op: cs.opacity });
      }
    });
    return {
      motion,
      paused,
      running,
      authored: document.querySelectorAll('[data-tsc-wix-authored-motion-bound="1"]').length,
      samples,
    };
  });
}

const browser = await puppeteer.launch({ headless: true, executablePath: chrome });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
const out = [];
for (const [route, local, ref] of routes) {
  let localData = null;
  let refData = null;
  let error = null;
  try {
    localData = await sample(page, local);
  } catch (e) {
    error = 'local:' + e.message;
  }
  try {
    refData = await sample(page, ref);
  } catch (e) {
    error = (error ? error + '; ' : '') + 'ref:' + e.message;
  }
  // Parity: local must not leave paused motion (excluding slideshow items already filtered).
  // Wix often stays paused until interaction — local should be running.
  const ok = !!(localData && localData.paused === 0);
  out.push({ route, ok, error, local: localData, ref: refData });
  console.log(JSON.stringify({ route, ok, localPaused: localData && localData.paused, localRunning: localData && localData.running, localAuthored: localData && localData.authored, refMotion: refData && refData.motion, refPaused: refData && refData.paused }));
}
await browser.close();
import('fs').then((fs) => {
  fs.writeFileSync('artifacts/motion-parity-spotcheck.json', JSON.stringify(out, null, 2));
});
const failed = out.filter((r) => !r.ok).length;
process.exit(failed ? 1 : 0);
