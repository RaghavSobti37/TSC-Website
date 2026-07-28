const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));

  const d = await p.evaluate(() => {
    const tile = document.querySelector('[id^="comp-mqpa1hg0"]');
    const tileChain = [];
    let n = tile;
    for (let i = 0; i < 12 && n; i++) {
      const cs = getComputedStyle(n);
      const r = n.getBoundingClientRect();
      tileChain.push({
        id: n.id || n.tagName,
        cls: (n.className || '').toString().slice(0, 70),
        w: Math.round(r.width),
        h: Math.round(r.height),
        display: cs.display,
        grid: cs.gridTemplateColumns,
        width: cs.width,
        maxW: cs.maxWidth,
        minW: cs.minWidth,
        inlineW: n.style?.width || '',
        gridArea: cs.gridArea,
      });
      n = n.parentElement;
    }

    // text element inside tile
    const texts = [...document.querySelectorAll('#comp-mqpa1hfr [data-testid="richTextElement"]')].slice(0, 4).map(el => {
      const cs = getComputedStyle(el);
      const inner = el.querySelector('.wixui-rich-text__text') || el;
      const ics = getComputedStyle(inner);
      return {
        id: el.id,
        t: (el.innerText || '').trim(),
        elW: Math.round(el.getBoundingClientRect().width),
        width: cs.width,
        maxW: cs.maxWidth,
        wordBreak: ics.wordBreak,
        overflowWrap: ics.overflowWrap,
        whiteSpace: ics.whiteSpace,
        fontSize: ics.fontSize,
      };
    });

    // receive section
    const recv = document.getElementById('comp-mqqulorc');
    const recvCs = recv ? getComputedStyle(recv) : null;
    const recvContent = recv?.querySelector('[data-testid="responsive-container-content"]') || recv;
    const recvKids = recvContent
      ? [...recvContent.children].filter(c => c.id).slice(0, 20).map(c => {
          const r = c.getBoundingClientRect();
          return {
            id: c.id,
            w: Math.round(r.width),
            h: Math.round(r.height),
            left: Math.round(r.left),
            top: Math.round(r.top + window.scrollY),
            pos: getComputedStyle(c).position,
            txt: (c.innerText || '').trim().slice(0, 50).replace(/\s+/g, ' '),
          };
        })
      : [];

    // why section cards
    const whyKids = ['comp-mqpj5661', 'comp-mqpj7idq', 'comp-mqpj3rac', 'comp-mqqqx5lg', 'comp-mqpigrr6'].map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        id,
        w: Math.round(r.width),
        h: Math.round(r.height),
        left: Math.round(r.left),
        top: Math.round(r.top + window.scrollY),
        pos: cs.position,
        display: cs.display,
        height: cs.height,
        minH: cs.minHeight,
      };
    });

    // path overview kids
    const pathContent = document.querySelector('#comp-mqph76vq [data-testid="responsive-container-content"]')
      || document.querySelector('#comp-mqph76vq .comp-mqph76vq-container');
    const pathKids = pathContent
      ? [...pathContent.children].filter(c => c.id).map(c => {
          const r = c.getBoundingClientRect();
          const cs = getComputedStyle(c);
          return {
            id: c.id,
            w: Math.round(r.width),
            h: Math.round(r.height),
            left: Math.round(r.left),
            top: Math.round(r.top + window.scrollY),
            pos: cs.position,
            topCss: cs.top,
            leftCss: cs.left,
            gridArea: cs.gridArea,
            txt: (c.innerText || '').trim().slice(0, 40).replace(/\s+/g, ' '),
          };
        })
      : [];

    // section heights with fixed
    const secs = ['comp-mqqgqawi', 'comp-mqph76vq', 'comp-mqpigrr6', 'comp-mqphxnu3', 'comp-mqp44656'].map(id => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const content = el.querySelector('[data-testid="responsive-container-content"]');
      const ccs = content ? getComputedStyle(content) : null;
      return {
        id,
        h: Math.round(r.height),
        height: cs.height,
        minH: cs.minHeight,
        contentH: content ? Math.round(content.getBoundingClientRect().height) : null,
        contentMinH: ccs?.minHeight,
        contentHeight: ccs?.height,
        contentDisplay: ccs?.display,
        contentGrid: ccs?.gridTemplateRows,
      };
    });

    // check if body has data-page
    return {
      dataPage: document.body.getAttribute('data-page'),
      tileChain,
      texts,
      recv: recv
        ? {
            w: Math.round(recv.getBoundingClientRect().width),
            h: Math.round(recv.getBoundingClientRect().height),
            display: recvCs.display,
            pos: recvCs.position,
            height: recvCs.height,
            minH: recvCs.minHeight,
          }
        : null,
      recvKids,
      whyKids,
      pathKids,
      pathContent: pathContent
        ? {
            cls: pathContent.className.toString().slice(0, 80),
            display: getComputedStyle(pathContent).display,
            grid: getComputedStyle(pathContent).gridTemplateColumns,
            rows: getComputedStyle(pathContent).gridTemplateRows,
            h: Math.round(pathContent.getBoundingClientRect().height),
          }
        : null,
      secs,
      scrollW: document.documentElement.scrollWidth,
    };
  });

  console.log(JSON.stringify(d, null, 2));
  await b.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
