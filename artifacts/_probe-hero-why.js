const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', 'node_modules', 'puppeteer'));

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  for (const route of ['/harshad-duhita', '/yugm']) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));
    const data = await page.evaluate(() => {
      const heroIds = ['comp-mq6h99jp', 'comp-mqhqa6vo'];
      const why = heroIds.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, missing: true };
        // walk up for display none
        const chain = [];
        let n = el;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.height === '0px') {
            chain.push({ id: n.id || n.className?.toString?.().slice(0, 30), display: cs.display, vis: cs.visibility, h: cs.height });
          }
          n = n.parentElement;
        }
        return {
          id,
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200),
          chain,
          inlineDisplay: el.style.display,
          className: el.className,
        };
      });
      const book = Array.from(document.querySelectorAll('a,button,[role="button"]')).filter((el) => /book for events|explore music/i.test(el.textContent || el.getAttribute('aria-label') || '')).map((el) => ({
        text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
        href: el.getAttribute('href'),
        visible: !!(el.offsetWidth || el.offsetHeight),
        section: el.closest('section')?.id,
      }));
      const h1s = Array.from(document.querySelectorAll('main h1, main h2')).slice(0, 8).map((el) => ({
        t: el.textContent.trim().slice(0, 60),
        top: Math.round(el.getBoundingClientRect().top + window.scrollY),
        visible: !!(el.offsetWidth || el.offsetHeight),
      }));
      // members nested overlaps detail
      const member = document.getElementById('comp-mqjigv1b');
      let memberKids = [];
      if (member) {
        memberKids = Array.from(member.querySelectorAll('[id^="comp-"]')).filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 40 && r.width > 40;
        }).slice(0, 30).map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return { id: el.id, pos: cs.position, left: Math.round(r.left), top: Math.round(r.top + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) };
        });
      }
      return { path: location.pathname, why, book, h1s, memberKids };
    });
    console.log(JSON.stringify(data, null, 2));
  }
  await browser.close();
})();
