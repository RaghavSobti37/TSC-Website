// Probe about page mobile layout issues
const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

const width = Number(process.argv[2] || 390);
const url = (process.argv[3] || 'http://127.0.0.1:3000') + '/about';

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'], protocolTimeout: 120000 });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise(r => setTimeout(r, 10000));
  // warm scroll
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 1500));

  const report = await page.evaluate((vw) => {
    const issues = [];
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      const s = window.getComputedStyle(el);
      return {
        id: el.id || el.className?.toString?.().slice(0, 40),
        top: Math.round(r.top + window.scrollY),
        left: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
        overflowX: s.overflowX,
        display: s.display,
        position: s.position,
        fontSize: s.fontSize,
      };
    };

    // overflow past viewport
    document.querySelectorAll('main [id^="comp-"], main section, footer, header, [data-testid="responsive-container-content"]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > vw + 2 && r.height > 20) {
        issues.push({ type: 'overflow-x', ...rect(el), right: Math.round(r.right) });
      }
    });

    // Vision twin boxes
    ['comp-mr1xvn1d', 'comp-mr1y8j13'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const r = rect(el);
        issues.push({ type: 'vision-box', ...r, cramped: r.w < 160 });
      }
    });

    // Belief cards
    ['comp-mr1wvwvr', 'comp-mr1wvwym', 'comp-mr1wvwst', 'comp-mr1wvwpv'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) issues.push({ type: 'belief', ...rect(el) });
    });

    // Who/Why
    ['comp-mr1w88dl', 'comp-mr1wb3oc', 'comp-mr1wdo6d', 'comp-mr1wdahh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) issues.push({ type: 'who-why', ...rect(el) });
    });

    // Audience cards
    ['comp-mr3si7ip2', 'comp-mr3si7jh', 'comp-mr3si7jv1', 'comp-mr3sl540', 'comp-mr3t0ceh'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const r = rect(el);
        const text = el.innerText?.slice(0, 40);
        issues.push({ type: 'audience', ...r, text, padOk: r.w > 300 });
      }
    });

    // Brand cards
    document.querySelectorAll('.tsc-brand-card').forEach((el) => {
      const r = rect(el);
      const tags = el.querySelector('.tsc-brand-card__tags');
      let tagInfo = null;
      if (tags) {
        const kids = [...tags.querySelectorAll('[id^="comp-"]')].filter(k => k.offsetParent);
        tagInfo = kids.map(k => ({ id: k.id, w: Math.round(k.getBoundingClientRect().width), t: k.innerText?.slice(0, 24) }));
      }
      issues.push({ type: 'brand-card', ...r, tagInfo });
    });

    // Hero
    const hero = document.getElementById('comp-mp2vlkbh2');
    if (hero) issues.push({ type: 'hero', ...rect(hero) });

    // Check overlap: consecutive section tops
    const sections = ['comp-mp2vlkbh2', 'comp-mr1u2p4j', 'comp-mr1whees', 'comp-mr1ychhq', 'comp-mr38xqqo', 'comp-mr3iatty', 'comp-mr3si7hw'];
    const secRects = sections.map((id) => {
      const el = document.getElementById(id);
      return el ? { id, ...rect(el), bottom: Math.round(el.getBoundingClientRect().bottom + window.scrollY) } : null;
    }).filter(Boolean);
    for (let i = 1; i < secRects.length; i++) {
      const prev = secRects[i - 1];
      const cur = secRects[i];
      if (cur.top < prev.bottom - 8) {
        issues.push({ type: 'section-overlap', prev: prev.id, cur: cur.id, prevBottom: prev.bottom, curTop: cur.top, overlap: prev.bottom - cur.top });
      }
    }

    // Document width vs viewport
    issues.push({
      type: 'doc',
      scrollW: document.documentElement.scrollWidth,
      bodyW: document.body.scrollWidth,
      scrollH: document.body.scrollHeight,
      vw,
    });

    // Fixed height clipping in who/why titles
    document.querySelectorAll('#comp-mr1w88dl, #comp-mr1wdo6d, #comp-mr3s7ehs').forEach((el) => {
      const r = el.getBoundingClientRect();
      const text = el.querySelector('.wixui-rich-text__text, h1, h2, p');
      if (text) {
        const tr = text.getBoundingClientRect();
        if (tr.height > r.height + 2) {
          issues.push({ type: 'clip-text', id: el.id, boxH: Math.round(r.height), textH: Math.round(tr.height) });
        }
      }
    });

    return { issues, secRects };
  }, width);

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})();
