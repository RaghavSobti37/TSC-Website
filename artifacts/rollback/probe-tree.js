const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2];
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 6000));
  const report = await page.evaluate(() => {
    const root = document.querySelector('#PAGE_SECTIONS') || document.querySelector('#SITE_PAGES') || document.body;
    const out = [];
    const walk = (el, depth) => {
      if (depth > 2) return;
      Array.from(el.children).forEach(child => {
        const cs = getComputedStyle(child);
        const r = child.getBoundingClientRect();
        out.push(`${'  '.repeat(depth)}${child.tagName}#${child.id || '-'} .${(child.className.baseVal || child.className || '').toString().split(' ')[0]} | ${cs.display}/${cs.visibility} h=${Math.round(child.scrollHeight)} rect=${Math.round(r.height)} | ${(child.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60)}`);
        if (child.children.length && child.scrollHeight > 50) walk(child, depth + 1);
      });
    };
    walk(root, 0);
    return { rootId: root.id, bodyH: document.body.scrollHeight, out: out.slice(0, 80) };
  });
  console.log(`root=#${report.rootId} bodyH=${report.bodyH}`);
  report.out.forEach(l => console.log(l));
  await browser.close();
})();
