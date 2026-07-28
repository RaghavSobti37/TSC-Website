#!/usr/bin/env node
/**
 * Mobile layout audit — overflow-x + basic misalignment signals at given widths.
 * Desktop (>=1025) not audited for changes (lock).
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public/pages/routes.manifest.json'), 'utf8'));
const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const widths = (process.env.WIDTHS || '375,768,1024').split(',').map(Number);
const routesIdx = process.argv.indexOf('--routes');
const routes =
  routesIdx >= 0 && process.argv[routesIdx + 1]
    ? process.argv[routesIdx + 1].split(',').map((s) => s.trim()).filter(Boolean)
    : manifest.allRoutes;

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const issues = [];
  for (const width of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    for (const route of routes) {
      const url = base.replace(/\/$/, '') + route;
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 800));
        const result = await page.evaluate(() => {
          const doc = document.documentElement;
          const body = document.body;
          const overflowX = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth;
          const fixedOff = [];
          document.querySelectorAll('*').forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.position === 'fixed' || style.position === 'sticky') {
              const r = el.getBoundingClientRect();
              if (r.right > window.innerWidth + 2 || r.left < -2) {
                fixedOff.push({
                  tag: el.tagName,
                  className: String(el.className || '').slice(0, 80),
                  left: Math.round(r.left),
                  right: Math.round(r.right),
                });
              }
            }
          });
          const imagesBroken = Array.from(document.images)
            .filter((img) => img.complete && img.naturalWidth === 0 && img.src)
            .slice(0, 5)
            .map((img) => img.src.slice(0, 120));
          return { overflowX, fixedOff: fixedOff.slice(0, 5), imagesBroken };
        });
        if (result.overflowX > 2) {
          issues.push({ route, width, type: 'overflow-x', px: result.overflowX });
        }
        if (result.fixedOff.length) {
          issues.push({ route, width, type: 'fixed-overflow', items: result.fixedOff });
        }
        console.log(`OK\t${width}\t${route}\toverflow=${result.overflowX}`);
      } catch (err) {
        issues.push({ route, width, type: 'nav-error', error: err.message });
        console.log(`ERR\t${width}\t${route}\t${err.message}`);
      }
    }
    await page.close();
  }
  await browser.close();
  const outPath = path.join(root, 'artifacts', 'mobile-audit.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ issues, checkedAt: new Date().toISOString() }, null, 2));
  console.log(`ISSUES ${issues.length}`);
  process.exit(issues.length ? 2 : 0);
})();
