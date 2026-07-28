// Inspect sections at a mobile width. Usage: node probe-dom.js <url> [width]
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const url = process.argv[2];
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 5000));
  const report = await page.evaluate(() => {
    const out = [];
    const sections = document.querySelectorAll('#PAGE_SECTIONS > section, main > section, section.wixui-section, [data-testid="section-container"]');
    const seen = new Set();
    sections.forEach(sec => {
      if (seen.has(sec)) return;
      seen.add(sec);
      const r = sec.getBoundingClientRect();
      const cs = getComputedStyle(sec);
      const txt = (sec.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
      out.push({
        id: sec.id || sec.className.split(' ')[0],
        h: Math.round(sec.scrollHeight),
        rectH: Math.round(r.height),
        display: cs.display,
        visibility: cs.visibility,
        opacity: cs.opacity,
        txt,
      });
    });
    return {
      bodyH: document.body.scrollHeight,
      docW: document.documentElement.scrollWidth,
      viewportW: window.innerWidth,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      sections: out,
    };
  });
  console.log(`bodyH=${report.bodyH} docW=${report.docW} vw=${report.viewportW} overflowX=${report.overflowX}`);
  for (const s of report.sections) {
    console.log(`${s.id} | h=${s.h} rectH=${s.rectH} | ${s.display}/${s.visibility}/op${s.opacity} | ${s.txt}`);
  }
  await browser.close();
})();
