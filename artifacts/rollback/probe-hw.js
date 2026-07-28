const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  const logs = [];
  p.on('console', (m) => logs.push(m.type() + ': ' + m.text()));
  p.on('pageerror', (e) => logs.push('ERR: ' + e.message));
  p.on('requestfailed', (r) => logs.push('FAIL: ' + r.url() + ' ' + (r.failure() && r.failure().errorText)));
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 12000));
  const info = await p.evaluate(() => ({
    scripts: [...document.querySelectorAll('script[src]')].map((s) => s.src),
    hasCR: !!document.querySelector('script[src*="content-replacements"]'),
    hasAnim: !!document.querySelector('script[src*="work.animations"]'),
    redesign: document.getElementById('comp-mp3okkrk')?.classList.contains('tsc-work-hero-redesign'),
    cases: !!document.querySelector('.tsc-mobile-work-cases'),
    path: location.pathname,
  }));
  console.log(JSON.stringify(info, null, 2));
  console.log('---LOGS---');
  console.log(logs.filter((l) => /content|work|Error|FAIL|tsc/i.test(l)).slice(0, 50).join('\n'));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
