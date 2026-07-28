const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2];
  const rootSel = process.argv[3];
  const width = Number(process.argv[4] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));
  const info = await page.evaluate(sel => {
    const root = document.querySelector(sel);
    if (!root) return ['ROOT NOT FOUND'];
    const out = [];
    const walk = (el, depth) => {
      if (depth > 5) return;
      Array.from(el.children).forEach(child => {
        const cs = getComputedStyle(child);
        const r = child.getBoundingClientRect();
        const id = child.id ? `#${child.id}` : '';
        const cls = (child.className.baseVal !== undefined ? child.className.baseVal : child.className || '').toString().split(' ').slice(0,2).join('.');
        const txt = (child.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 45);
        if (r.width === 0 && r.height === 0 && cs.display === 'none') {
          out.push(`${'  '.repeat(depth)}${child.tagName}${id} .${cls} [HIDDEN] | ${txt}`);
          return;
        }
        out.push(`${'  '.repeat(depth)}${child.tagName}${id} .${cls} | ${cs.display} w=${Math.round(r.width)} h=${Math.round(r.height)} x=${Math.round(r.left)} | ${txt}`);
        walk(child, depth + 1);
      });
    };
    walk(root, 0);
    return out.slice(0, 120);
  }, rootSel);
  info.forEach(l => console.log(l));
  await browser.close();
})();
