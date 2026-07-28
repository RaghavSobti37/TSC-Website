const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/blog-1', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  const info = await p.evaluate(() => {
    const el = document.getElementById('comp-mrfyyjk0');
    const kids = [...(el?.children || [])].map((c) => {
      const r = c.getBoundingClientRect();
      const cs = getComputedStyle(c);
      return {
        id: c.id,
        tag: c.tagName,
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top + scrollY),
        pos: cs.position,
        text: (c.innerText || '').slice(0, 60).replace(/\s+/g, ' '),
      };
    });
    // all rich texts in article section
    const sec = document.getElementById('comp-mrfydh6w');
    const rich = [...(sec?.querySelectorAll('[data-testid="richTextElement"], .wixui-rich-text') || [])].map((c) => {
      const r = c.getBoundingClientRect();
      return {
        id: c.id,
        h: Math.round(r.height),
        t: Math.round(r.top + scrollY),
        text: (c.innerText || '').slice(0, 70).replace(/\s+/g, ' '),
      };
    });
    // grid areas on kids
    const container = document.querySelector('.comp-mrfydh6w-container');
    const areas = container
      ? [...container.children].map((c) => {
          const cs = getComputedStyle(c);
          return { id: c.id, gridArea: cs.gridArea, gridRow: cs.gridRow, gridColumn: cs.gridColumn, alignSelf: cs.alignSelf, justifySelf: cs.justifySelf };
        })
      : [];
    // CTA
    const cta = document.querySelector('.comp-mrfznxkz-container');
    const ctaKids = cta
      ? [...cta.children].map((c) => {
          const r = c.getBoundingClientRect();
          const cs = getComputedStyle(c);
          return { id: c.id, h: Math.round(r.height), t: Math.round(r.top + scrollY), gridArea: cs.gridArea, text: (c.innerText || '').slice(0, 40) };
        })
      : [];
    // tool card spacing on resources - skip
    return { kids, rich, areas, ctaKids, containerDisplay: container && getComputedStyle(container).display, containerGrid: container && getComputedStyle(container).gridTemplateAreas };
  });
  console.log(JSON.stringify(info, null, 2));

  await p.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  const tools = await p.evaluate(() => {
    // first visible tool card
    const card = document.querySelector('[id^="comp-mpbfryng__"]') || document.querySelector('[id^="comp-mrd98n4i__"]');
    if (!card) return { missing: true };
    const r = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const kids = [...card.querySelectorAll(':scope > [id^="comp-"], [data-testid="responsive-container-content"] > [id^="comp-"]')].slice(0, 10).map((c) => {
      const cr = c.getBoundingClientRect();
      return { id: c.id, h: Math.round(cr.height), t: Math.round(cr.top + scrollY), text: (c.innerText || '').slice(0, 40) };
    });
    // list of cards tops
    const list = [...document.querySelectorAll('[id^="comp-mpbfryng__"], [id^="comp-mrd98n4i__"]')].slice(0, 6).map((c) => {
      const cr = c.getBoundingClientRect();
      return { id: c.id.slice(0, 40), h: Math.round(cr.height), t: Math.round(cr.top + scrollY), topGap: 0 };
    });
    for (let i = 1; i < list.length; i++) list[i].topGap = list[i].t - (list[i - 1].t + list[i - 1].h);
    return { cardId: card.id, h: Math.round(r.height), display: cs.display, kids, list };
  });
  console.log('TOOLS', JSON.stringify(tools, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
