const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const url = process.argv[2];
  const width = Number(process.argv[3] || 390);
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 4000));
  const report = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('section').forEach(sec => {
      const cs = getComputedStyle(sec);
      const r = sec.getBoundingClientRect();
      const txt = (sec.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70);
      out.push(`SECTION#${sec.id || '-'} | ${cs.display}/${cs.visibility} scrollH=${Math.round(sec.scrollHeight)} rectH=${Math.round(r.height)} top=${Math.round(r.top + scrollY)} | ${txt}`);
    });
    return { bodyH: document.body.scrollHeight, out };
  });
  console.log(`bodyH=${report.bodyH}`);
  report.out.forEach(l => console.log(l));
  await browser.close();
})();
