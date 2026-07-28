const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  const out = path.join('artifacts/rollback');

  for (const [route, slug, scrollY] of [
    ['/blog-1', 'live-b1', 900],
    ['/blog-1', 'live-b1b', 1600],
    ['/blog-2', 'live-b2', 800],
    ['/blog-3', 'live-b3', 500],
    ['/resources', 'live-res', 1800],
  ]) {
    await p.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded' });
    await new Promise((r) => setTimeout(r, 6000));
    await p.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise((r) => setTimeout(r, 400));
    await p.screenshot({ path: path.join(out, `${slug}.png`) });
  }

  // real overlap check after stack
  await p.goto('http://127.0.0.1:3000/blog-1', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 6000));
  const report = await p.evaluate(() => {
    const overlaps = [];
    const comps = [...document.querySelectorAll('main [id^="comp-"]')];
    for (let i = 0; i < comps.length; i++) {
      const aEl = comps[i];
      const a = aEl.getBoundingClientRect();
      if (a.height < 30 || a.width < 30 || getComputedStyle(aEl).display === 'none') continue;
      for (let j = i + 1; j < Math.min(i + 10, comps.length); j++) {
        const bEl = comps[j];
        if (aEl.parentElement !== bEl.parentElement) continue;
        const b = bEl.getBoundingClientRect();
        if (b.height < 30 || b.width < 30 || getComputedStyle(bEl).display === 'none') continue;
        const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        if (ox > 50 && oy > 30) overlaps.push({ a: aEl.id, b: bEl.id, oy: Math.round(oy), ox: Math.round(ox) });
      }
    }
    // fixed/sticky elements
    const sticky = comps
      .filter((el) => {
        const p = getComputedStyle(el).position;
        return p === 'fixed' || p === 'sticky';
      })
      .map((el) => ({ id: el.id, pos: getComputedStyle(el).position, text: (el.innerText || '').slice(0, 40) }));
    return { overlaps, sticky, backIds: ['comp-mrg0d1923', 'comp-mrg0d7rc', 'comp-mrfzwkwe', 'comp-mrg3qw6u'].map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { id, display: cs.display, pos: cs.position, w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top + scrollY), text: (el.innerText || '').slice(0, 40), opacity: cs.opacity };
    }) };
  });
  fs.writeFileSync(path.join(out, 'live-overlap.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
