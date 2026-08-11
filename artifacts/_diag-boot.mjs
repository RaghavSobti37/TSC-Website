import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const root = join(fileURLToPath(import.meta.url), '..', '..', 'public');
const mime = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff2': 'font/woff2',
};
const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/films' || url === '/films/') url = '/films/index.html';
  const file = join(root, url.replace(/^\//, '') || 'index.html');
  if (!existsSync(file) || (statSync(file).isDirectory())) {
    console.log('404', url);
    res.writeHead(404); res.end('missing'); return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const reqs = [];
page.on('request', (r) => {
  const u = r.url();
  if (/tsc-components|tsc-responsive|content-replacements|404/.test(u)) reqs.push(u);
});
page.on('requestfailed', (r) => console.log('FAIL', r.url(), r.failure()?.errorText));
page.on('response', async (r) => {
  if (/tsc-components|tsc-responsive/.test(r.url())) console.log('RESP', r.status(), r.url());
});
await page.goto(`http://127.0.0.1:${port}/films`, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise((r) => setTimeout(r, 2000));
const boot = await page.evaluate(() => {
  const scripts = [...document.scripts].map((s) => ({
    src: s.src,
    boot: s.getAttribute('data-tsc-components-boot'),
    text: (s.textContent || '').slice(0, 80),
  }));
  return {
    scripts: scripts.filter((s) => /tsc|boot/i.test(s.src + s.boot + s.text)),
    hasBootAttr: !!document.querySelector('[data-tsc-components-boot]'),
  };
});
console.log('boot', JSON.stringify(boot, null, 2));
console.log('reqs', reqs);
await browser.close();
server.close();
