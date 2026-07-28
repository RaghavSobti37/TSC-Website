const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });

  // RESOURCES: blog card structure
  await p.goto('http://127.0.0.1:3000/resources', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  const res = await p.evaluate(() => {
    const ids = ['comp-mrdq8d4s', 'comp-mrdq81q0', 'comp-mrdq85ob', 'comp-mrdpew4h', 'comp-mrdpqawy', 'comp-mrdpc84n', 'comp-mrdpc824', 'comp-mrdojbvs', 'comp-mrdle4pn'];
    const dump = (id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const parent = el.parentElement;
      const pcs = parent ? getComputedStyle(parent) : null;
      return {
        id,
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 80),
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top + scrollY),
        l: Math.round(r.left),
        pos: cs.position,
        display: cs.display,
        flexDir: cs.flexDirection,
        grid: cs.gridTemplateColumns,
        parentId: parent?.id || '',
        parentDisplay: pcs?.display,
        parentFlex: pcs?.flexDirection,
        parentGrid: pcs?.gridTemplateColumns,
        parentH: parent ? Math.round(parent.getBoundingClientRect().height) : null,
        kids: [...el.children].slice(0, 8).map((c) => {
          const cr = c.getBoundingClientRect();
          return { id: c.id, w: Math.round(cr.width), h: Math.round(cr.height), l: Math.round(cr.left), t: Math.round(cr.top + scrollY) };
        }),
      };
    };
    // find blog cards inside mrdq8d4s
    const wrap = document.getElementById('comp-mrdq8d4s');
    const deep = wrap
      ? [...wrap.querySelectorAll('[id^="comp-"]')].slice(0, 30).map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return { id: el.id, w: Math.round(r.width), h: Math.round(r.height), l: Math.round(r.left), t: Math.round(r.top + scrollY), pos: cs.position, display: cs.display };
        })
      : [];
    return { dumps: ids.map(dump), deep };
  });
  console.log('=== RESOURCES ===');
  console.log(JSON.stringify(res, null, 2));

  // BLOG-1 body
  await p.goto('http://127.0.0.1:3000/blog-1', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));
  const blog = await p.evaluate(() => {
    const ids = ['comp-mreu9zoc', 'comp-mrfz1ln9', 'comp-mrfyyjk0', 'comp-mrfzl2q9', 'comp-mrfzgctc', 'comp-mrfzthke', 'comp-mrfzu5lp', 'comp-mrfzvao0', 'comp-mrfy5yaq', 'comp-mrfy8j45'];
    const dump = (id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const parent = el.parentElement;
      const pcs = parent ? getComputedStyle(parent) : null;
      // find nearest section
      const sec = el.closest('section, [data-testid="responsive-container-content"]');
      return {
        id,
        w: Math.round(r.width),
        h: Math.round(r.height),
        t: Math.round(r.top + scrollY),
        l: Math.round(r.left),
        pos: cs.position,
        display: cs.display,
        top: cs.top,
        left: cs.left,
        parentId: parent?.id || parent?.className?.toString?.().slice(0, 40),
        parentDisplay: pcs?.display,
        parentPos: pcs?.position,
        parentH: parent ? Math.round(parent.getBoundingClientRect().height) : null,
        secId: sec?.id || '',
        secCls: (sec?.className || '').toString().slice(0, 60),
        text: (el.innerText || '').slice(0, 80).replace(/\s+/g, ' '),
      };
    };
    // find article body container - look for beige bg section
    const sections = [...document.querySelectorAll('main section, main [id^="comp-mrf"]')].slice(0, 40).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        id: el.id,
        tag: el.tagName,
        h: Math.round(r.height),
        t: Math.round(r.top + scrollY),
        pos: cs.position,
        display: cs.display,
        bg: cs.backgroundColor,
        overflow: cs.overflow,
        kids: el.children.length,
      };
    });
    // parent of overlapping trio
    const a = document.getElementById('comp-mrfyyjk0');
    const meshParent = a?.parentElement;
    let meshKids = [];
    if (meshParent) {
      meshKids = [...meshParent.children].map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          id: el.id || el.className?.toString?.().slice(0, 30),
          w: Math.round(r.width),
          h: Math.round(r.height),
          t: Math.round(r.top + scrollY),
          l: Math.round(r.left),
          pos: cs.position,
          display: cs.display,
          text: (el.innerText || '').slice(0, 50).replace(/\s+/g, ' '),
        };
      });
    }
    return {
      dumps: ids.map(dump),
      meshParent: meshParent
        ? {
            id: meshParent.id,
            cls: (meshParent.className || '').toString().slice(0, 80),
            display: getComputedStyle(meshParent).display,
            h: Math.round(meshParent.getBoundingClientRect().height),
            grid: getComputedStyle(meshParent).gridTemplateRows,
          }
        : null,
      meshKids,
      sections: sections.filter((s) => s.h > 50),
    };
  });
  console.log('=== BLOG-1 ===');
  console.log(JSON.stringify(blog, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
