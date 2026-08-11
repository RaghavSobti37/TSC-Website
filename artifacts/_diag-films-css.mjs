/**
 * Diagnose why films num/dup CSS may not apply at runtime.
 */
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const root = join(fileURLToPath(import.meta.url), '..', '..', 'public');
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const server = createServer((req, res) => {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/films' || url === '/films/') url = '/films/index.html';
  const file = join(root, url.replace(/^\//, '') || 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('missing ' + url);
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
page.on('console', (m) => console.log('PAGE', m.type(), m.text()));
page.on('requestfailed', (r) => console.log('FAIL', r.url(), r.failure()?.errorText));

await page.setViewport({ width: 1440, height: 1200 });
await page.goto(`http://127.0.0.1:${port}/films`, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise((r) => setTimeout(r, 1500));

const diag = await page.evaluate(() => {
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href);
  const el = document.getElementById('comp-mqktx0o11');
  const dup = document.getElementById('comp-mqmhowf1');
  const sheets = [];
  for (const sheet of document.styleSheets) {
    try {
      const href = sheet.href || '(inline)';
      if (href.includes('tsc-responsive') || href.includes('films')) {
        sheets.push({ href, rules: sheet.cssRules?.length });
      }
    } catch (e) {
      sheets.push({ href: sheet.href, err: String(e) });
    }
  }
  let matched = [];
  if (el) {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules || []) {
          if (rule.selectorText && rule.selectorText.includes('mqktx0o11') && rule.style?.marginLeft) {
            matched.push({
              sel: rule.selectorText.slice(0, 120),
              marginLeft: rule.style.marginLeft,
              href: sheet.href || '(inline)',
            });
          }
          if (rule.cssText && rule.cssText.includes('mqmhowf1') && rule.cssText.includes('display')) {
            matched.push({
              sel: (rule.selectorText || '').slice(0, 80),
              display: rule.style?.display,
              href: (sheet.href || '(inline)').slice(-60),
            });
          }
        }
      } catch (_) {}
    }
  }
  return {
    dataPage: document.body.getAttribute('data-page'),
    tscComponents: !!document.querySelector('script[src*="tsc-components"]'),
    responsiveLinks: links.filter((h) => /tsc-responsive|pages\/films|mobile\/films/.test(h)),
    allTscLinks: links.filter((h) => /tsc|films\.css/.test(h)),
    sheets,
    matched: matched.slice(0, 20),
    numMargin: el ? getComputedStyle(el).marginLeft : null,
    numOverflow: el ? getComputedStyle(el).overflow : null,
    dupDisplay: dup ? getComputedStyle(dup).display : 'missing',
    focusTexts: ['#comp-mqmi3w4l3', '#comp-mqmi6yom7', '#comp-mqmi8cyg2', '#comp-mqmi8sv66'].map((s) => {
      const n = document.querySelector(s);
      return { s, t: (n?.textContent || '').trim().slice(0, 40) };
    }),
    faith: (document.body.innerText || '').includes('Faith Communities'),
    impactAll: [...document.querySelectorAll('[data-testid="richTextElement"]')]
      .map((n) => (n.textContent || '').trim())
      .filter((t) => /Impact Report/i.test(t)),
  };
});

console.log(JSON.stringify(diag, null, 2));
await browser.close();
server.close();
