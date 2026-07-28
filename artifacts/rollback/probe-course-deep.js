const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/the-heart-of-composition';
  const rootSel = process.argv[3] || '#comp-mptpk7ag';
  const width = Number(process.argv[4] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));

  const info = await page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return ['ROOT NOT FOUND: ' + sel];
    const out = [];
    const walk = (el, depth) => {
      if (depth > 6) return;
      [...el.children].forEach(child => {
        const cs = getComputedStyle(child);
        const r = child.getBoundingClientRect();
        const id = child.id ? `#${child.id}` : '';
        const cls = (child.className?.baseVal !== undefined ? child.className.baseVal : child.className || '')
          .toString().split(' ').filter(Boolean).slice(0, 3).join('.');
        const txt = (child.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 55);
        const grid = cs.gridArea || '';
        const ga = child.style?.gridArea || '';
        out.push(
          `${'  '.repeat(depth)}${child.tagName}${id} .${cls} | ${cs.display}/${cs.position} ` +
          `w=${Math.round(r.width)} h=${Math.round(r.height)} x=${Math.round(r.left)} y=${Math.round(r.top)} ` +
          `wm=${cs.writingMode} tf=${cs.transform !== 'none' ? 'Y' : 'n'} ga=${grid||ga||'-'} | ${txt}`
        );
        walk(child, depth + 1);
      });
    };
    const rr = root.getBoundingClientRect();
    out.push(`ROOT ${sel} w=${Math.round(rr.width)} h=${Math.round(rr.height)} y=${Math.round(rr.top + scrollY)}`);
    walk(root, 0);
    return out.slice(0, 150);
  }, rootSel);
  info.forEach(l => console.log(l));
  await browser.close();
})();
