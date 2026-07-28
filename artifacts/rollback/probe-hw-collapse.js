const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));
  const info = await p.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const cs = (el) => el && getComputedStyle(el);
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: +r.top.toFixed(1), l: +r.left.toFixed(1) };
    };
    const ids = [
      'comp-mr69hwoy',
      'comp-mr69hwsy',
      'comp-mr69hwvm1',
      'comp-mr69hwt41',
      'comp-mr69hwvq',
      'comp-mr69hwub',
      'comp-mr69hwvs2',
      'comp-mr69hwvu1',
      'comp-mr69hwud',
      'comp-mr69hww9',
      'comp-mr69hwwa4',
      'comp-mr69hwvf5',
      'comp-mr69hwvh',
    ];
    return {
      hostH: box(q('#comp-mr69hwoy')),
      items: ids.map((id) => {
        const el = q('#' + id);
        if (!el) return { id, missing: true };
        return {
          id,
          box: box(el),
          display: cs(el).display,
          height: cs(el).height,
          minH: cs(el).minHeight,
          overflow: cs(el).overflow,
          position: cs(el).position,
          flex: cs(el).flexDirection,
          kids: el.children.length,
        };
      }),
      imgs: [...document.querySelectorAll('#comp-mr69hwoy img')].slice(0, 6).map((i) => ({
        box: box(i),
        parent: i.closest('[id^=comp-]')?.id,
      })),
      texts: [...document.querySelectorAll('#comp-mr69hwoy [data-testid=richTextElement]')]
        .filter((t) => t.innerText.trim())
        .slice(0, 8)
        .map((t) => ({ id: t.id, text: t.innerText.trim().slice(0, 40), box: box(t) })),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
