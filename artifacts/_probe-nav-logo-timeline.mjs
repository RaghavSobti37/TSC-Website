/**
 * Timeline probe: nav logo src/size at 0/100/500/1000/3000ms.
 * Monkeypatch Image src setter to log who changes brand logos.
 * TSC_BASE=http://127.0.0.1:3033 node artifacts/_probe-nav-logo-timeline.mjs
 */
import puppeteer from 'puppeteer';
import fs from 'fs';

const BASE = process.env.TSC_BASE || 'http://127.0.0.1:3033';
const outDir = 'artifacts/nav-logo-timeline';
fs.mkdirSync(outDir, { recursive: true });

const routes = ['/', '/about', '/academy'];

function installProbe() {
  window.__tscLogoProbe = { changes: [], samples: [] };
  const mark = (kind, detail) => {
    window.__tscLogoProbe.changes.push({
      t: Math.round(performance.now()),
      kind,
      ...detail,
    });
  };
  const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (desc && desc.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get,
      set(v) {
        const cls = this.className || '';
        if (/brand-logo|footer-logo/i.test(cls) || /tsc-logo|academy-logo/i.test(String(v))) {
          let stack = '';
          try {
            throw new Error('src');
          } catch (e) {
            stack = String(e.stack || '')
              .split('\n')
              .slice(2, 8)
              .map((s) => s.trim())
              .join(' | ');
          }
          mark('img.src', {
            cls,
            from: this.getAttribute('src'),
            to: String(v),
            stack,
          });
        }
        return desc.set.call(this, v);
      },
    });
  }
  const setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    if (
      this.tagName === 'IMG' &&
      String(name).toLowerCase() === 'src' &&
      (/brand-logo|footer-logo/i.test(this.className || '') ||
        /tsc-logo|academy-logo/i.test(String(value)))
    ) {
      let stack = '';
      try {
        throw new Error('setAttribute');
      } catch (e) {
        stack = String(e.stack || '')
          .split('\n')
          .slice(2, 8)
          .map((s) => s.trim())
          .join(' | ');
      }
      mark('setAttribute.src', {
        cls: this.className || '',
        from: this.getAttribute('src'),
        to: String(value),
        stack,
      });
    }
    return setAttr.call(this, name, value);
  };
  const proto = Element.prototype;
  const ih = Object.getOwnPropertyDescriptor(proto, 'innerHTML');
  if (ih && ih.set) {
    Object.defineProperty(proto, 'innerHTML', {
      configurable: true,
      enumerable: ih.enumerable,
      get: ih.get,
      set(v) {
        if (/tsc-desktop-brand-logo|tsc-mobile-brand-logo|tsc-logo|academy-logo/i.test(String(v))) {
          let stack = '';
          try {
            throw new Error('innerHTML');
          } catch (e) {
            stack = String(e.stack || '')
              .split('\n')
              .slice(2, 8)
              .map((s) => s.trim())
              .join(' | ');
          }
          mark('innerHTML', {
            tag: this.tagName,
            cls: this.className || '',
            snippet: String(v).slice(0, 180),
            stack,
          });
        }
        return ih.set.call(this, v);
      },
    });
  }
}

function sampleLogo() {
  const logo = document.querySelector(
    '[data-tsc-locked-desktop-header] .tsc-desktop-brand-logo-unified, .tsc-desktop-site-brand img.tsc-desktop-brand-logo-unified, header a.tsc-desktop-brand-link img.tsc-desktop-brand-logo-unified, header img.tsc-desktop-brand-logo-unified'
  );
  if (!logo) {
    return {
      missing: true,
      t: Math.round(performance.now()),
      anyHeaderImg: !!document.querySelector('header img'),
    };
  }
  const r = logo.getBoundingClientRect();
  const cs = getComputedStyle(logo);
  const link = logo.closest('a');
  return {
    missing: false,
    t: Math.round(performance.now()),
    src: (logo.getAttribute('src') || '').replace(/\?.*$/, ''),
    srcFull: logo.getAttribute('src') || '',
    attrW: logo.getAttribute('width'),
    attrH: logo.getAttribute('height'),
    w: Math.round(r.width),
    h: Math.round(r.height),
    mixBlend: cs.mixBlendMode,
    filter: (cs.filter || '').slice(0, 80),
    brandAttr: link ? link.getAttribute('data-tsc-brand-logo') : null,
    locked: logo.closest('header')?.getAttribute('data-tsc-brand-locked') || null,
  };
}

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 120000,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const report = {};

for (const route of routes) {
  process.stdout.write(`probe ${route} ... `);
  await page.evaluateOnNewDocument(installProbe);
  await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const samples = [];
  for (const delay of [0, 100, 500, 1000, 3000]) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay === 0 ? 0 : delay - (samples.at(-1)?.delay || 0)));
    // absolute waits from navigation start approximations
  }
  // redo with absolute delays from now (post DCL)
  const abs = [0, 100, 500, 1000, 3000];
  const start = Date.now();
  const absSamples = [];
  for (const target of abs) {
    const wait = target - (Date.now() - start);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    const s = await page.evaluate(sampleLogo);
    absSamples.push({ delayMs: target, ...s });
  }
  const changes = await page.evaluate(() => window.__tscLogoProbe?.changes || []);
  report[route] = { samples: absSamples, changes };
  const first = absSamples.find((s) => !s.missing);
  const last = [...absSamples].reverse().find((s) => !s.missing);
  console.log(
    first && last
      ? `${first.src?.split('/').pop()} ${first.w}x${first.h} → ${last.src?.split('/').pop()} ${last.w}x${last.h} (changes=${changes.length})`
      : 'NO LOGO'
  );
}

const stamp = process.env.TSC_PROBE_STAMP || 'after';
fs.writeFileSync(`${outDir}/${stamp}.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(`wrote ${outDir}/${stamp}.json`);
