const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));

  const d = await p.evaluate(() => {
    const tile = document.querySelector('[id^="comp-mqpa1hg0"]');
    const container = document.querySelector('.comp-mqpa1hfr-container');
    const texts = [...document.querySelectorAll('#comp-mqpa1hfr [data-testid="richTextElement"]')].slice(0, 6).map((el) => {
      const r = el.getBoundingClientRect();
      const t = (el.innerText || '').trim();
      const lines = Math.round(r.height / (parseFloat(getComputedStyle(el.querySelector('.wixui-rich-text__text') || el).lineHeight) || 18));
      return { t, w: Math.round(r.width), h: Math.round(r.height), midBreak: /START\s*S|Augus\s*t|DURAT|SCHOL/i.test(t) ? 'check-visually' : 'ok' };
    });

    const overlapsIn = (sid) => {
      const el = document.getElementById(sid);
      if (!el) return [];
      const content = el.querySelector('[data-testid="responsive-container-content"]') || el;
      const kids = [...content.querySelectorAll(':scope > [id^="comp-"]')].filter((k) => {
        const r = k.getBoundingClientRect();
        return r.width > 2 && r.height > 2 && getComputedStyle(k).display !== 'none';
      });
      const overs = [];
      for (let i = 0; i < kids.length; i++) {
        for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect();
          const b = kids[j].getBoundingClientRect();
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 12 && oy > 12) overs.push({ a: kids[i].id, b: kids[j].id, ox: Math.round(ox), oy: Math.round(oy) });
        }
      }
      return overs;
    };

    const cardW = [...document.querySelectorAll('#comp-mqs19axw > [id^="comp-"], #comp-mqs19s5j > [id^="comp-"]')].map((c) => ({
      id: c.id,
      w: Math.round(c.getBoundingClientRect().width),
      left: Math.round(c.getBoundingClientRect().left),
      txt: (c.innerText || '').trim().slice(0, 30),
    }));

    const whyCards = ['comp-mqpj5661', 'comp-mqpj7idq'].map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      return { id, w: Math.round(r.width), left: Math.round(r.left), h: Math.round(r.height), display: getComputedStyle(el).display };
    });

    const recv = document.getElementById('comp-mqqgqawi');
    const ulorc = document.getElementById('comp-mqqulorc');
    const leafTiles = [
      'comp-mqqsoamd', 'comp-mqqsp2xj', 'comp-mqqsp89k', 'comp-mqqspnrk', 'comp-mqqspntc',
      'comp-mqqui7kc', 'comp-mqqui7mc', 'comp-mqqulh8m', 'comp-mqqulh6q', 'comp-mqqulye5',
    ].map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      return { id, w: Math.round(r.width), left: Math.round(r.left), h: Math.round(r.height), txt: (el.innerText || '').trim().slice(0, 35) };
    });

    return {
      tileW: tile ? Math.round(tile.getBoundingClientRect().width) : null,
      containerW: container ? Math.round(container.getBoundingClientRect().width) : null,
      containerGrid: container ? getComputedStyle(container).gridTemplateColumns : null,
      repeaterGrid: getComputedStyle(document.getElementById('comp-mqpa1hfr')).gridTemplateColumns,
      texts,
      pathOverlaps: overlapsIn('comp-mqph76vq'),
      whyOverlaps: overlapsIn('comp-mqpigrr6'),
      cardW,
      whyCards,
      recvH: recv ? Math.round(recv.getBoundingClientRect().height) : null,
      recvHeightCss: recv ? getComputedStyle(recv).height : null,
      ulorcW: ulorc ? Math.round(ulorc.getBoundingClientRect().width) : null,
      ulorcPos: ulorc ? getComputedStyle(ulorc).position : null,
      leafTiles,
      scrollW: document.documentElement.scrollWidth,
      scrollH: document.documentElement.scrollHeight,
    };
  });

  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
