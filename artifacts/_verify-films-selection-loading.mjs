import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { existsSync, readFileSync, statSync } from 'fs';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';

const publicRoot = join(fileURLToPath(import.meta.url), '..', '..', 'public');
const routes = {
  '/films': '/pages/films.html',
  '/films/': '/pages/films.html',
  '/mahavatar-narsimha-impact': '/pages/mahavatar-narsimha-impact.html',
  '/hanuman-ansh-impact': '/pages/hanuman-ansh-impact.html',
  '/mahaprabhu-jagannath-impact': '/pages/mahaprabhu-jagannath-impact.html',
  '/kalki-impact': '/pages/kalki-impact.html',
};
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
};

const cards = [
  { selector: '#comp-mqmi3w3o', path: '/mahavatar-narsimha-impact', title: 'Mahavatar Narsimha' },
  { selector: '#comp-mqmi6ynt2', path: '/hanuman-ansh-impact', title: 'Hanuman Ansh' },
  { selector: '#comp-mqmi8cxm2', path: '/mahaprabhu-jagannath-impact', title: 'Mahaprabhu Jagannath' },
  { selector: '#comp-mqmi8sui', path: '/kalki-impact', title: 'Kalki' },
];

const server = createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const routed = routes[requestPath] || requestPath;
  const file = join(publicRoot, routed.replace(/^\//, '') || 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('missing');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

try {
  for (const card of cards) {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(45000);
    await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.origin === baseUrl || request.resourceType() === 'document') request.continue();
      else request.abort();
    });

    await page.goto(`${baseUrl}/films`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForSelector(card.selector);
    await page.waitForFunction(
      (selector) => {
        const root = document.querySelector(selector);
        return root && (root.getAttribute('data-tsc-card-wired') === 'true' || root.getAttribute('data-tsc-film-report-wired') === 'true');
      },
      {},
      card.selector
    );

    await Promise.all([
      page.waitForFunction((path) => location.pathname === path, { timeout: 12000 }, card.path),
      page.click(card.selector),
    ]);

    const reportLoaded = await page.evaluate(
      (title) => document.title.includes(title) && /Film Impact Report|Film IP|Universe|Devotional|Monetisation/i.test(document.body.innerText || ''),
      card.title
    );
    if (!reportLoaded) throw new Error(`${card.title} selection reached ${page.url()} but report content did not load`);
    await page.close();
  }
  console.log(`PASS films selections navigate to ${cards.length} impact reports without a stuck loading state`);
} finally {
  await browser.close();
  server.close();
}
