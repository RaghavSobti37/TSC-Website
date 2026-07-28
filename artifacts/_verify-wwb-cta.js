const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const html = fs.readFileSync(path.join(__dirname, '../public/pages/home.html'), 'utf8');
const staticCount = (html.match(/class="tsc-wwb-cta"/g) || []).length;
console.log('static HTML CTA count:', staticCount);

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  // Pass 1: no JS — prove SSR CTAs present in cards
  const p1 = await browser.newPage();
  await p1.setJavaScriptEnabled(false);
  await p1.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p1.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  const ssr = await p1.evaluate(() => {
    const ids = ['comp-mrlr0ide', 'comp-mrlrorgn', 'comp-mrlrqzuf', 'comp-mrlrv5on', 'comp-mrlrv5ly'];
    return ids.map((id) => {
      const host = document.getElementById(id);
      const cta = host && host.querySelector('.tsc-wwb-cta');
      return {
        id,
        host: !!host,
        label: cta && cta.textContent.trim(),
        href: cta && cta.getAttribute('href'),
      };
    });
  });
  console.log('SSR (no JS):', JSON.stringify(ssr, null, 2));

  // Pass 2: with JS — inject/reinject after hydrate if cards survive
  const p2 = await browser.newPage();
  await p2.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await p2.goto('http://127.0.0.1:3000/?v=cta4', { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 7000));
  const live = await p2.evaluate(() => {
    const ids = ['comp-mrlr0ide', 'comp-mrlrorgn', 'comp-mrlrqzuf', 'comp-mrlrv5on', 'comp-mrlrv5ly'];
    return {
      textLen: document.body.innerText.length,
      hasWWB: document.body.innerText.includes('What We Build'),
      cards: ids.map((id) => {
        const host = document.getElementById(id);
        const cta = host && host.querySelector('.tsc-wwb-cta');
        if (!cta) return { id, host: !!host, cta: null };
        const r = cta.getBoundingClientRect();
        return {
          id,
          host: true,
          label: cta.textContent.trim(),
          href: cta.getAttribute('href'),
          w: Math.round(r.width),
          h: Math.round(r.height),
          display: getComputedStyle(cta).display,
        };
      }),
      globalCtas: [...document.querySelectorAll('.tsc-wwb-cta')].map((a) => ({
        t: a.textContent.trim(),
        h: a.getAttribute('href'),
        pid: a.parentElement && a.parentElement.id,
      })),
    };
  });
  console.log('LIVE (JS):', JSON.stringify(live, null, 2));
  await p2.screenshot({ path: path.join(__dirname, 'wwb-cta-live.png'), fullPage: true });
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
