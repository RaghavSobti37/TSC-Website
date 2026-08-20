#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const root = path.resolve(__dirname, '..');
const sitemap = fs.readFileSync(path.join(root, 'public', 'sitemap-pages.xml'), 'utf8');
const routes = Array.from(sitemap.matchAll(/<loc>https:\/\/theshakticollective\.in([^<]*)<\/loc>/g))
  .map((m) => m[1] || '/');
const base = process.env.BASE_URL || 'http://127.0.0.1:3000';
const widths = (process.env.WIDTHS || '390').split(',').map(Number);
const desktopWidth = Number(process.env.DESKTOP_WIDTH || 1280);

function localUrl(route) {
  return base.replace(/\/$/, '') + route;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const issues = [];
  const seenInternalHrefs = new Set();

  async function checkPage(route, width, kind) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: kind === 'desktop' ? 900 : 844, deviceScaleFactor: 1, isMobile: kind !== 'desktop' });
    try {
      await page.goto(localUrl(route), { waitUntil: 'domcontentloaded', timeout: 120000 });
      await new Promise((r) => setTimeout(r, 1800));
      const result = await page.evaluate((kind) => {
        const vw = innerWidth;
        const bodyText = document.body.innerText || '';
        const pageName = document.body.getAttribute('data-page') || '';
        const overflow = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - vw;
        const brokenImages = Array.from(document.images)
          .filter((img) => {
            const r = img.getBoundingClientRect();
            const cs = getComputedStyle(img);
            return r.width > 2 && r.height > 2 && cs.display !== 'none' && cs.visibility !== 'hidden' && img.complete && img.naturalWidth === 0;
          })
          .slice(0, 8)
          .map((img) => img.src.slice(0, 140));

        const visible = (el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < document.documentElement.scrollHeight &&
            cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity || 1) !== 0;
        };

        const badText = [];
        document.querySelectorAll('[data-testid="richTextElement"], .wixui-rich-text, p, h1, h2, h3, a, button').forEach((el) => {
          if (!visible(el)) return;
          const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
          if (!text || text.length < 8) return;
          if (/^\d{1,2}\s/.test(text) || /^[+\-]$/.test(text)) return;
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const words = text.split(/\s+/);
          const longest = words.reduce((a, w) => Math.max(a, w.length), 0);
          const skinny = r.width < 74 && r.height > 120 && longest > 4;
          const clipped = (el.scrollWidth - el.clientWidth > 3 || el.scrollHeight - el.clientHeight > 3) && cs.overflow !== 'visible';
          if (skinny || clipped) {
            badText.push({
              id: el.id,
              tag: el.tagName,
              text: text.slice(0, 70),
              x: Math.round(r.x),
              y: Math.round(r.y),
              w: Math.round(r.width),
              h: Math.round(r.height),
              skinny,
              clipped,
            });
          }
        });

        const badControls = [];
        const hrefs = [];
        document.querySelectorAll('a[href], button, [role="button"], [data-testid="buttonElement"]').forEach((el) => {
          if (!visible(el)) return;
          const r = el.getBoundingClientRect();
          const label = (el.innerText || el.getAttribute('aria-label') || el.title || '').replace(/\s+/g, ' ').trim();
          const href = el.href || el.getAttribute('href') || el.querySelector('a[href]')?.href || '';
          const isButtonLike = el.matches('button, [role="button"], [data-testid="buttonElement"], .wixui-button') ||
            /book|apply|submit|know|explore|learn|call|artist|music|course|collab|join|download/i.test(label);
          if (href) hrefs.push(href);
          if (!isButtonLike) return;
          const nativePickerIcon = kind === 'mobile' && label === 'Select a Date' && r.width <= 20 && r.height <= 20;
          if (nativePickerIcon) return;
          const offscreen = kind === 'mobile' && (r.left < -2 || r.right > vw + 2);
          const tiny = kind === 'mobile' && (r.width < 44 || r.height < 32);
          const empty = !label && !href;
          if (offscreen || tiny || empty) {
            badControls.push({
              id: el.id,
              tag: el.tagName,
              label: label.slice(0, 60),
              href,
              x: Math.round(r.x),
              y: Math.round(r.y),
              w: Math.round(r.width),
              h: Math.round(r.height),
              offscreen,
              tiny,
              empty,
            });
          }
        });

        const mobileActive = matchMedia('(max-width: 1024px)').matches;
        const activeMobileLinks = Array.from(document.querySelectorAll('link[href*="/css/mobile/"]'))
          .filter((link) => !link.media || matchMedia(link.media).matches)
          .map((link) => link.getAttribute('href'));

        return { pageName, bodyTextLength: bodyText.length, overflow, brokenImages, badText: badText.slice(0, 12), badControls: badControls.slice(0, 12), hrefs, mobileActive, activeMobileLinks };
      }, kind);

      if (result.overflow > 2) issues.push({ route, width, kind, type: 'overflow', px: result.overflow });
      if (result.brokenImages.length) issues.push({ route, width, kind, type: 'broken-images', items: result.brokenImages });
      if (result.badText.length) issues.push({ route, width, kind, type: 'bad-text', items: result.badText });
      if (result.badControls.length) issues.push({ route, width, kind, type: 'bad-controls', items: result.badControls });
      if (kind === 'desktop' && result.mobileActive) issues.push({ route, width, kind, type: 'desktop-mobile-media-active' });
      if (kind === 'desktop' && result.activeMobileLinks.length) issues.push({ route, width, kind, type: 'desktop-active-mobile-links', items: result.activeMobileLinks });
      for (const href of result.hrefs) {
        try {
          const url = new URL(href, base);
          if (url.origin === new URL(base).origin && !url.hash) seenInternalHrefs.add(url.pathname);
        } catch {}
      }
      console.log(`OK\t${kind}\t${width}\t${route}\toverflow=${result.overflow}\ttext=${result.badText.length}\tcontrols=${result.badControls.length}\tbroken=${result.brokenImages.length}`);
    } catch (error) {
      issues.push({ route, width, kind, type: 'page-error', error: error.message });
      console.log(`ERR\t${kind}\t${width}\t${route}\t${error.message}`);
    } finally {
      await page.close();
    }
  }

  for (const width of widths) {
    for (const route of routes) await checkPage(route, width, 'mobile');
  }
  for (const route of routes) await checkPage(route, desktopWidth, 'desktop');

  const hrefIssues = [];
  const page = await browser.newPage();
  for (const href of Array.from(seenInternalHrefs).sort()) {
    try {
      if (/\.pdf$/i.test(href)) {
        const pdfPath = path.join(root, 'public', decodeURIComponent(href).replace(/^\/+/, ''));
        if (!fs.existsSync(pdfPath)) hrefIssues.push({ href, status: 404 });
        continue;
      }
      const res = await page.goto(localUrl(href), { waitUntil: 'domcontentloaded', timeout: 60000 });
      const status = res ? res.status() : 0;
      if (status >= 400) hrefIssues.push({ href, status });
    } catch (error) {
      hrefIssues.push({ href, error: error.message });
    }
  }
  await page.close();
  await browser.close();

  hrefIssues.forEach((issue) => issues.push({ type: 'href-status', ...issue }));
  const out = { checkedAt: new Date().toISOString(), base, widths, desktopWidth, routes, issues };
  const outPath = path.join(root, 'artifacts', 'mobile-second-pass-audit.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`ISSUES ${issues.length}`);
  if (issues.length) {
    console.log(JSON.stringify(issues.slice(0, 30), null, 2));
    process.exit(2);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
