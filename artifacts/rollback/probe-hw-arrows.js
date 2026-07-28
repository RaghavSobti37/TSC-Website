const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));
  const info = await p.evaluate(() => {
    const arrows = [...document.querySelectorAll('#comp-mr69hwoy [data-testid="linkElement"], #comp-mr69hwoy a, #comp-mr69hwoy button, #comp-mr69hwoy [class*="Vector"]')]
      .filter((el) => {
        const t = (el.innerText || '').trim();
        const r = el.getBoundingClientRect();
        return r.width > 20 && r.width < 80 && r.height > 20 && r.height < 80;
      })
      .slice(0, 12)
      .map((el) => ({
        id: el.id || el.closest('[id^=comp-]')?.id,
        tag: el.tagName,
        cls: String(el.className).slice(0, 50),
        text: (el.innerText || '').trim().slice(0, 20),
        w: +el.getBoundingClientRect().width.toFixed(1),
        h: +el.getBoundingClientRect().height.toFixed(1),
        t: +el.getBoundingClientRect().top.toFixed(1),
      }));
    const imgs = [...document.querySelectorAll('#comp-mr69hwvu1, #comp-mr69hwud, #comp-mr69hwwa4, #comp-mr69hwvh')].map((el) => ({
      id: el.id,
      w: +el.getBoundingClientRect().width.toFixed(1),
      parentW: +el.parentElement.getBoundingClientRect().width.toFixed(1),
    }));
    return { arrows, imgs, hostW: document.querySelector('#comp-mr69hwsy')?.getBoundingClientRect().width };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
