const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));
  const d = await p.evaluate(() => {
    const nest = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const content =
        el.querySelector('[data-testid="responsive-container-content"]') ||
        el.querySelector('[class*="-container"]') ||
        el;
      return {
        id,
        w: Math.round(el.getBoundingClientRect().width),
        display: getComputedStyle(el).display,
        contentCls: (content.className || '').toString().slice(0, 60),
        contentDisplay: getComputedStyle(content).display,
        contentGrid: getComputedStyle(content).gridTemplateColumns,
        kids: [...content.children].slice(0, 20).map((c) => {
          const r = c.getBoundingClientRect();
          return {
            id: c.id,
            cls: (c.className || '').toString().slice(0, 40),
            w: Math.round(r.width),
            h: Math.round(r.height),
            left: Math.round(r.left),
            txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
          };
        }),
      };
    };

    const sticky = [...document.querySelectorAll('#comp-mqqgqawi [id^="comp-"]')]
      .filter((el) => {
        const pos = getComputedStyle(el).position;
        return pos === 'sticky' || pos === 'fixed';
      })
      .map((el) => ({
        id: el.id,
        pos: getComputedStyle(el).position,
        h: Math.round(el.getBoundingClientRect().height),
        w: Math.round(el.getBoundingClientRect().width),
      }));

    const allDeep = [...document.querySelectorAll('#comp-mqqulorc [id^="comp-"]')].slice(0, 50).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        id: el.id,
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        pos: getComputedStyle(el).position,
        txt: (el.innerText || '').trim().slice(0, 45).replace(/\s+/g, ' '),
      };
    });

    // How many tile-like boxes in receive
    const tiles = [...document.querySelectorAll('#comp-mqqulorc .wixui-box, #comp-mqqulorc [class*="wixui-box"]')]
      .map((el) => ({
        id: el.id,
        w: Math.round(el.getBoundingClientRect().width),
        txt: (el.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
      }))
      .filter((t) => t.txt.length > 3);

    return {
      axw: nest('comp-mqs19axw'),
      s5j: nest('comp-mqs19s5j'),
      j5661: nest('comp-mqpj5661'),
      j7idq: nest('comp-mqpj7idq'),
      ulorc: nest('comp-mqqulorc'),
      quif9s: nest('comp-mqquif9s'),
      sticky,
      allDeep,
      tiles,
    };
  });
  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
