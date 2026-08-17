const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'assets', 'mirror', 'siteassets.parastorage.com', 'pages', 'pages', 'thunderbolt', 'thunderbolt-platform--19f989_c8466e696b35fc1b5a4e28bc1ad3d620_1365.json--desktop--af81b442.bundle.min.json');

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
  for (const t of targets) {
    const live = t.replace('http://127.0.0.1:3100/assets/mirror/siteassets.parastorage.com', 'https://siteassets.parastorage.com');
    const body = await new Promise((resolve, reject) => {
      https.get(live, { headers: { 'User-Agent': 'Mozilla/5.0 TSC-mirror' } }, (res) => {
        let d = '';
        res.on('data', (c) => (d += c));
        res.on('end', () => resolve(d));
      }).on('error', reject);
    });
    fs.writeFileSync(OUT, body);
    console.log('saved', body.length, 'bytes to', OUT);
  }
  await browser.close();
})();
