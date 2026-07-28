const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2] || 'http://127.0.0.1:3000/harshad-duhita';
  const ids = (process.argv[3] || 'comp-mq7lr7my,comp-mq7lr7n22,comp-mq9dd0kp,comp-mq7z6hk6,comp-mq84m6ve,comp-mq6ig1tw').split(',');
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 5000));

  const report = await page.evaluate((ids) => {
    const walk = (el, depth = 0, maxDepth = 4) => {
      if (!el || depth > maxDepth) return null;
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      const node = {
        id: el.id || '',
        cls: (el.className && String(el.className).slice(0, 60)) || '',
        tag: el.tagName,
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        top: Math.round(r.top + scrollY),
        pos: s.position,
        display: s.display,
        grid: s.gridTemplateColumns + ' / ' + s.gridTemplateRows,
        txt: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        kids: [],
      };
      if (depth < maxDepth) {
        node.kids = [...el.children]
          .filter((c) => c.getBoundingClientRect().height > 0 || c.children.length)
          .slice(0, 16)
          .map((c) => walk(c, depth + 1, maxDepth))
          .filter(Boolean);
      }
      return node;
    };
    const out = {};
    for (const id of ids) {
      const el = document.getElementById(id);
      out[id] = el ? walk(el, 0, 5) : null;
    }
    return out;
  }, ids);

  const print = (n, indent = '') => {
    if (!n) return;
    console.log(
      `${indent}#${n.id || '-'} <${n.tag}> ${n.w}x${n.h} @(${n.left},${n.top}) ${n.pos}/${n.display}`
    );
    if (n.txt) console.log(`${indent}  "${n.txt}"`);
    if (n.display.includes('grid')) console.log(`${indent}  grid: ${n.grid.slice(0, 80)}`);
    for (const k of n.kids || []) print(k, indent + '  ');
  };
  for (const id of ids) {
    console.log('\n========', id, '========');
    print(report[id]);
  }
  await browser.close();
})();
