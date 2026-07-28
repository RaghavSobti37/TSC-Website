const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));
  const d = await p.evaluate(() => {
    const tiles = [...document.querySelectorAll('[id^="comp-mqpa1hg0"]')].map((el) => {
      const r = el.getBoundingClientRect();
      const kids = [...el.children].filter((c) => c.id).map((c) => {
        const cr = c.getBoundingClientRect();
        return {
          id: c.id.split('__')[0],
          h: Math.round(cr.height),
          w: Math.round(cr.width),
          height: getComputedStyle(c).height,
          minH: getComputedStyle(c).minHeight,
        };
      });
      return {
        h: Math.round(r.height),
        height: getComputedStyle(el).height,
        minH: getComputedStyle(el).minHeight,
        kids,
        txt: (el.innerText || '').trim().replace(/\s+/g, ' '),
      };
    });

    // curriculum slide structure
    const ghn = document.getElementById('comp-mqqghn86');
    const ghnInfo = ghn
      ? {
          h: Math.round(ghn.getBoundingClientRect().height),
          height: getComputedStyle(ghn).height,
          display: getComputedStyle(ghn).display,
          pos: getComputedStyle(ghn).position,
          overflow: getComputedStyle(ghn).overflow,
          childCount: ghn.children.length,
          kids: [...ghn.querySelectorAll(':scope > [id^="comp-"]')].slice(0, 10).map((c) => ({
            id: c.id,
            h: Math.round(c.getBoundingClientRect().height),
            w: Math.round(c.getBoundingClientRect().width),
            left: Math.round(c.getBoundingClientRect().left),
            pos: getComputedStyle(c).position,
            txt: (c.innerText || '').trim().slice(0, 30).replace(/\s+/g, ' '),
          })),
        }
      : null;

    // section content height vs kids sum for curriculum
    const sec = document.getElementById('comp-mqqg5lnm');
    const content = sec?.querySelector('[data-testid="responsive-container-content"]');
    let kidsBottom = 0;
    if (content) {
      [...content.children].forEach((c) => {
        const r = c.getBoundingClientRect();
        kidsBottom = Math.max(kidsBottom, r.bottom);
      });
    }
    const secTop = sec.getBoundingClientRect().top;
    return {
      tiles,
      ghnInfo,
      currContentH: content ? Math.round(content.getBoundingClientRect().height) : null,
      currKidsSpan: Math.round(kidsBottom - secTop),
      currSecH: Math.round(sec.getBoundingClientRect().height),
    };
  });
  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
