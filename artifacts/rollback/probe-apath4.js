const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));
  const d = await p.evaluate(() => {
    const kids = (id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return [...el.children]
        .filter((c) => c.id || (c.className || '').toString().includes('comp-'))
        .map((c) => ({
          id: c.id,
          cls: (c.className || '').toString().slice(0, 55),
          w: Math.round(c.getBoundingClientRect().width),
          h: Math.round(c.getBoundingClientRect().height),
          left: Math.round(c.getBoundingClientRect().left),
          display: getComputedStyle(c).display,
          txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
        }));
    };
    // find card comps inside axw/s5j by class pattern
    const cardsIn = (id) => {
      const el = document.getElementById(id);
      if (!el) return [];
      return [...el.querySelectorAll(':scope > [id^="comp-"], :scope [class*="-container"][id^="comp-"]')]
        .filter((c) => c.parentElement === el || c.parentElement?.parentElement === el)
        .slice(0, 12)
        .map((c) => ({
          id: c.id,
          parent: c.parentElement?.id,
          w: Math.round(c.getBoundingClientRect().width),
          txt: (c.innerText || '').trim().slice(0, 35).replace(/\s+/g, ' '),
        }));
    };
    // all HFEOE3 boxes that are cards under path section
    const pathCards = [...document.querySelectorAll('#comp-mqph76vq .wixui-box')]
      .map((c) => ({
        id: c.id,
        w: Math.round(c.getBoundingClientRect().width),
        left: Math.round(c.getBoundingClientRect().left),
        txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
      }))
      .filter((c) => c.txt.length > 5 && c.w < 200);

    return {
      axwKids: kids('comp-mqs19axw'),
      s5jKids: kids('comp-mqs19s5j'),
      pathCards,
      cardsAxw: cardsIn('comp-mqs19axw'),
      cardsS5j: cardsIn('comp-mqs19s5j'),
      // why section kids
      whyKids: kids('comp-mqpigrr6'),
      whyContentKids: (() => {
        const el = document.querySelector('#comp-mqpigrr6 [data-testid="responsive-container-content"]');
        if (!el) return null;
        return [...el.children].filter((c) => c.id).map((c) => ({
          id: c.id,
          w: Math.round(c.getBoundingClientRect().width),
          left: Math.round(c.getBoundingClientRect().left),
          txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
        }));
      })(),
    };
  });
  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
