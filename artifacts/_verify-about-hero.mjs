import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const root = join(fileURLToPath(import.meta.url), '..', '..', 'public');
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/about' || url === '/about/') url = '/about/index.html';
  const file = join(root, url.replace(/^\//, '') || 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) { res.writeHead(404); res.end('x'); return; }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

async function probe(width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.goto(`http://127.0.0.1:${port}/about`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('#comp-mp2vlkbh2', { timeout: 20000 });
  await page.addStyleTag({ url: `http://127.0.0.1:${port}/css/tsc-responsive.css` });
  if (width <= 1024) await page.addStyleTag({ url: `http://127.0.0.1:${port}/css/mobile/about.css` });
  await page.evaluate(() => document.body.setAttribute('data-page', 'about'));
  await new Promise((r) => setTimeout(r, 300));
  const out = await page.evaluate(() => {
    const hero = document.getElementById('comp-mp2vlkbh2');
    const title = document.getElementById('comp-mr1tvuqc');
    const tag = document.getElementById('comp-mr1tv44l');
    const shell = document.getElementById('comp-mr1ttkgk');
    const hs = getComputedStyle(hero);
    const hr = hero.getBoundingClientRect();
    return {
      heroH: Math.round(hr.height),
      overflow: hs.overflow,
      titleW: title ? Math.round(title.getBoundingClientRect().width) : 0,
      tagW: tag ? Math.round(tag.getBoundingClientRect().width) : 0,
      shellW: shell ? Math.round(shell.getBoundingClientRect().width) : 0,
      titleDisplay: title ? getComputedStyle(title).display : null,
    };
  });
  await page.close();
  return out;
}

const desktop = await probe(1440);
const mobile = await probe(390);
console.log(JSON.stringify({ desktop, mobile }, null, 2));
const fail = [];
if (desktop.heroH < 400) fail.push('desktop hero too short ' + desktop.heroH);
if (desktop.shellW < 100) fail.push('desktop shell small ' + desktop.shellW);
if (mobile.shellW > 140) fail.push('mobile shell too big (desktop bleed?) ' + mobile.shellW);
if (fail.length) { console.error('FAIL', fail); process.exitCode = 1; }
else console.log('PASS about hero smoke');
await browser.close();
server.close();
