const path = require('path');
const puppeteer = require(path.resolve('node_modules', 'puppeteer'));
(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 9000));
  await page.evaluate(() => window.scrollTo(0, 900));
  await new Promise(r => setTimeout(r, 3000));
  const info = await page.evaluate(() => {
    const sec = document.querySelector('#comp-m28o2bbb');
    if (!sec) return 'section missing';
    const out = [];
    const r = sec.getBoundingClientRect();
    out.push(`section rect: top=${Math.round(r.top)} h=${Math.round(r.height)} opacity=${getComputedStyle(sec).opacity} bg=${getComputedStyle(sec).backgroundColor}`);
    sec.querySelectorAll('h1,h2,h3,p,div.wixui-rich-text').forEach((el, i) => {
      if (i > 8) return;
      const cs = getComputedStyle(el);
      const er = el.getBoundingClientRect();
      out.push(`  ${el.tagName}.${(el.className||'').toString().split(' ')[0]} top=${Math.round(er.top)} h=${Math.round(er.height)} op=${cs.opacity} vis=${cs.visibility} color=${cs.color} | ${(el.textContent||'').trim().slice(0,40)}`);
    });
    return out.join('\n');
  });
  console.log(info);
  await page.screenshot({ path: 'artifacts/rollback/home-eco-390.png' });
  await browser.close();
})();
