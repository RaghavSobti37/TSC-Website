/**
 * Verify Films numbered cards + film focus copy via real page boot (tsc-films-page.js).
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
  if (url === '/about' || url === '/about/') url = '/about/index.html';
  const file = join(root, url.replace(/^\//, '') || 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404);
    res.end('missing');
    return;
  }
  res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

async function probe(width) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1200, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${port}/films`, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.waitForSelector('#comp-mqktx0nc', { timeout: 20000 });
  await page.waitForFunction(
    () => !!document.querySelector('link[href*="tsc-responsive"]') || !!document.body.getAttribute('data-page'),
    { timeout: 15000 }
  ).catch(() => {});
  await new Promise((r) => setTimeout(r, 2000));

  const result = await page.evaluate(() => {
    const dup = document.getElementById('comp-mqmhowf1');
    const nums = ['comp-mqktx0o11', 'comp-mql591nr', 'comp-mql5hyxr', 'comp-mql5q7n31', 'comp-mql5uiwc'];
    const numReports = nums.map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const parent = el.closest('.wixui-box') || el.parentElement;
      const pr = parent ? parent.getBoundingClientRect() : null;
      const cs = getComputedStyle(el);
      return {
        id,
        text: (el.textContent || '').trim().slice(0, 4),
        marginLeft: cs.marginLeft,
        clippedLeft: pr ? r.left < pr.left - 0.5 : false,
        visible: r.width > 0 && r.height > 0,
      };
    });

    const focusTexts = ['#comp-mqmi3w4l3', '#comp-mqmi6yom7', '#comp-mqmi8cyg2', '#comp-mqmi8sv66'].map((s) =>
      ((document.querySelector(s)?.textContent) || '').trim()
    );

    return {
      dataPage: document.body.getAttribute('data-page'),
      responsiveHref: [...document.querySelectorAll('link[rel="stylesheet"]')]
        .map((l) => l.href)
        .find((h) => h.includes('tsc-responsive')) || null,
      filmsPageScript: !!document.querySelector('script[src*="tsc-films-page"]'),
      dupDisplay: dup ? getComputedStyle(dup).display : 'missing',
      visiblePartnershipCards: (() => {
        let n = 0;
        for (const id of ['comp-mql5hyxn', 'comp-mqmhowf1']) {
          const el = document.getElementById(id);
          if (!el) continue;
          const cs = getComputedStyle(el);
          const r = el.getBoundingClientRect();
          if (cs.display !== 'none' && cs.visibility !== 'hidden' && r.height > 8) n++;
        }
        return n;
      })(),
      mobilePartnershipShell: Array.from(document.querySelectorAll('.tsc-mobile-films-feat-card')).filter((el) =>
        /Partnership/i.test(el.textContent || '') && getComputedStyle(el).display !== 'none'
      ).length,
      numReports,
      focusTexts,
      hasFaith: (document.body.innerText || '').includes('Faith Communities'),
      genericImpact: focusTexts.filter((t) => /Impact Report/i.test(t)).length,
      sandeshLeft: focusTexts.filter((t) => /SANDESH/i.test(t)).length,
    };
  });

  await page.close();
  return result;
}

const desktop = await probe(1440);
const mobile = await probe(390);
console.log(JSON.stringify({ desktop, mobile }, null, 2));

const fail = [];
for (const [label, data] of [['desktop', desktop], ['mobile', mobile]]) {
  if (!data.filmsPageScript) fail.push(`${label}: tsc-films-page not injected`);
  if (!data.responsiveHref || !/film-hover-blend-1/.test(data.responsiveHref)) {
    fail.push(`${label}: missing tsc-responsive?v=film-hover-blend-1 (got ${data.responsiveHref})`);
  }
  if (data.dupDisplay !== 'none' && data.dupDisplay !== 'missing') fail.push(`${label}: dup display ${data.dupDisplay}`);
  if (label === 'desktop' && data.visiblePartnershipCards !== 1) {
    fail.push(`${label}: visible partnership cards=${data.visiblePartnershipCards}`);
  }
  if (label === 'mobile' && data.visiblePartnershipCards > 1) {
    fail.push(`${label}: partnership cards >1 (${data.visiblePartnershipCards})`);
  }
  for (const n of data.numReports) {
    if (n.missing || !n.visible) continue;
    if (n.clippedLeft) fail.push(`${label}: ${n.id} clippedLeft margin=${n.marginLeft}`);
  }
  if (label === 'desktop') {
    const expected = ['Mythology-Led Animation', 'Spiritual Entertainment', 'Devotional Culture', 'Future Mythology'];
    expected.forEach((t, i) => {
      if (data.focusTexts[i] !== t) fail.push(`desktop: focus[${i}]="${data.focusTexts[i]}" want "${t}"`);
    });
    if (!data.hasFaith) fail.push('desktop: Faith Communities missing');
    if (data.sandeshLeft) fail.push('desktop: SANDESH still in focus fields');
    if (data.genericImpact) fail.push('desktop: Impact Report still in focus fields');
  }
}

await browser.close();
server.close();
if (fail.length) {
  console.error('FAIL', fail);
  process.exit(1);
}
console.log('PASS');
