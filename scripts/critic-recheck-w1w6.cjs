const puppeteer = require('puppeteer');

async function check(page, route, width) {
  await page.setViewport({ width, height: 812, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: 'networkidle0', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 1500));
  return page.evaluate(() => {
    const overflow = Math.max(
      document.documentElement.scrollWidth - document.documentElement.clientWidth,
      document.body.scrollWidth - document.body.clientWidth
    );
    const wixMenus = [...document.querySelectorAll('button[aria-label="Menu"], .wixui-hamburger-open-button')].filter(
      (el) => {
        const s = getComputedStyle(el);
        return s.display !== 'none' && s.visibility !== 'hidden' && el.getBoundingClientRect().width > 0;
      }
    );
    const tscHeader = !!document.querySelector('.tsc-mobile-site-header');
    const labels = [...document.querySelectorAll('.tsc-field label, .tsc-local-form label')]
      .map((el) => parseFloat(getComputedStyle(el).fontSize))
      .filter((n) => n > 0);
    const minLabel = labels.length ? Math.min(...labels) : null;
    const radios = [...document.querySelectorAll('.tsc-choice')].map((el) => {
      const b = el.getBoundingClientRect();
      return { h: Math.round(b.height), w: Math.round(b.width) };
    });
    const smallRadios = radios.filter((r) => r.h < 44 || r.w < 44).length;
    const artistsSub = document.querySelector('#comp-mqtlkwo0 .wixui-rich-text__text');
    let artistsWrap = null;
    if (artistsSub) {
      const s = getComputedStyle(artistsSub);
      artistsWrap = {
        whiteSpace: s.whiteSpace,
        scrollW: artistsSub.scrollWidth,
        clientW: artistsSub.clientWidth,
      };
    }
    return {
      overflow,
      wixMenusVisible: wixMenus.length,
      tscHeader,
      minLabel,
      smallRadios,
      radioSample: radios.slice(0, 3),
      artistsWrap,
    };
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const cases = [
    ['/artists', 768],
    ['/work', 768],
    ['/films', 768],
    ['/book-a-call', 375],
    ['/masterclass-review01', 768],
    ['/masterclass-review01', 1024],
  ];
  let fail = 0;
  for (const [route, width] of cases) {
    const m = await check(page, route, width);
    const issues = [];
    if (m.overflow > 1) issues.push('overflow');
    if (m.wixMenusVisible > 0 && m.tscHeader) issues.push('wixMenus+' + m.wixMenusVisible);
    if (m.tscHeader === false && width <= 1024) issues.push('noTscHeader');
    if (m.minLabel != null && m.minLabel < 12) issues.push('label' + m.minLabel);
    if (route.includes('review') && m.smallRadios > 0) issues.push('smallRadios' + m.smallRadios);
    if (route === '/artists' && m.artistsWrap && m.artistsWrap.scrollW > m.artistsWrap.clientW + 2) {
      issues.push('artistsNowrap');
    }
    console.log(issues.length ? 'FAIL' : 'OK', width, route, JSON.stringify(m), issues.join(',') || '');
    if (issues.length) fail++;
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
