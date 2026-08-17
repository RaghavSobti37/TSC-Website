const puppeteer = require('puppeteer');
const https = require('https');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  const targets = [];
  page.on('request', (r) => {
    const u = r.url();
    if (u.includes('pages/thunderbolt?') && !targets.includes(u)) targets.push(u);
  });
  const base = process.argv[2] || 'http://127.0.0.1:3100';
  const route = process.argv[3] || '/artist-query';
  await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 12000));
  // Replay the first captured query URL against the live site-assets host
  const out = { captured: targets.map((t) => t.slice(0, 120)) };
  for (const t of targets) {
    const live = t.replace('http://127.0.0.1:3100/assets/mirror/siteassets.parastorage.com', 'https://siteassets.parastorage.com');
    try {
      const body = await new Promise((resolve, reject) => {
        https.get(live, { headers: { 'User-Agent': 'Mozilla/5.0 TSC-mirror' } }, (res) => {
          let d = '';
          res.on('data', (c) => (d += c));
          res.on('end', () => resolve({ status: res.statusCode, body: d.slice(0, 300) }));
        }).on('error', reject);
      });
      out[live.slice(0, 80)] = body;
    } catch (e) {
      out[live.slice(0, 80)] = { error: e.message };
    }
  }
  console.log(JSON.stringify(out, null, 1));
  await browser.close();
})();
