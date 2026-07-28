/**
 * Verify About What We Build / TSC Artists bento mobile layout.
 * Checks no overlap, readable fonts, CTA + categories wrap.
 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle2', timeout: 60000 });

  // Wait for mobile CSS + content
  await page.waitForSelector('#comp-mr38xqqo', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1200));

  const report = await page.evaluate(() => {
    const section = document.getElementById('comp-mr38xqqo');
    if (!section) return { ok: false, error: 'section missing' };

    section.scrollIntoView({ block: 'start' });

    const ids = [
      'comp-mr355d93', // title
      'comp-mr35c58m', // logo
      'comp-mr39ngdp', // tagline
      'comp-mr38xqr6', // desc
      'comp-mr3a7k38', // list
      'comp-mr35f98m', // CTA
      'comp-mr38xqqu' // categories
    ];

    function rect(el) {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height };
    }

    function overlaps(a, b) {
      return !(a.bottom <= b.top + 1 || b.bottom <= a.top + 1 || a.right <= b.left + 1 || b.right <= a.left + 1);
    }

    const boxes = {};
    const issues = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) {
        issues.push(id + ' missing');
        continue;
      }
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') {
        issues.push(id + ' hidden');
        continue;
      }
      boxes[id] = rect(el);
      if (boxes[id].height < 8) issues.push(id + ' tiny height ' + boxes[id].height);
      if (boxes[id].width > window.innerWidth + 2) issues.push(id + ' overflows viewport');
    }

    // Vertical order check
    const order = ids.filter((id) => boxes[id]);
    for (let i = 1; i < order.length; i++) {
      const prev = boxes[order[i - 1]];
      const cur = boxes[order[i]];
      if (cur.top < prev.top - 2) {
        issues.push('order: ' + order[i] + ' above ' + order[i - 1]);
      }
      if (overlaps(prev, cur) && Math.abs(prev.top - cur.top) > 4) {
        // allow same-row only for categories internals — these are siblings in stack
        issues.push('overlap: ' + order[i - 1] + ' / ' + order[i]);
      }
    }

    // Font sizes
    const desc = document.querySelector('#comp-mr38xqr84 .wixui-rich-text__text');
    const cta = document.querySelector('#comp-mr35f98m a, #comp-mr35f98m .wixui-button');
    const cat = document.querySelector('#comp-mr38xqqv2 .wixui-rich-text__text');
    const title = document.querySelector('#comp-mr355d93 .wixui-rich-text__text');

    const fonts = {
      title: title ? parseFloat(getComputedStyle(title).fontSize) : null,
      desc: desc ? parseFloat(getComputedStyle(desc).fontSize) : null,
      cta: cta ? parseFloat(getComputedStyle(cta).fontSize) : null,
      cat: cat ? parseFloat(getComputedStyle(cat).fontSize) : null,
      ctaMinH: cta ? parseFloat(getComputedStyle(cta).minHeight || '0') : null,
      ctaH: cta ? cta.getBoundingClientRect().height : null
    };

    if (fonts.desc != null && fonts.desc < 13) issues.push('desc font too small: ' + fonts.desc);
    if (fonts.ctaH != null && fonts.ctaH < 40) issues.push('CTA height too small: ' + fonts.ctaH);
    if (fonts.title != null && fonts.title < 20) issues.push('title font too small: ' + fonts.title);

    // Categories wrap: each category should not be crushed into one row of tiny width
    const catIds = ['comp-mr38xqqv2', 'comp-mr39t2vt', 'comp-mr39t915', 'comp-mr39t938'];
    const catRects = catIds.map((id) => {
      const el = document.getElementById(id);
      return el ? rect(el) : null;
    }).filter(Boolean);
    const uniqueTops = new Set(catRects.map((r) => Math.round(r.top / 4)));
    const minCatW = Math.min(...catRects.map((r) => r.width));
    if (minCatW < 80) issues.push('category too narrow: ' + minCatW);
    if (uniqueTops.size < 2 && catRects.length === 4 && window.innerWidth < 420) {
      // On 390px, 50% wrap should make 2 rows — warn if all same top
      issues.push('categories still single row');
    }

    // Image hidden?
    const img = document.getElementById('comp-mr38xqr96');
    const imgHidden = !img || getComputedStyle(img).display === 'none';

    // Section not 100vh locked
    const secH = section.getBoundingClientRect().height;
    const secOverflow = getComputedStyle(section).overflow;

    // Sticky killed?
    const mesh = document.getElementById('comp-mr38xqqs');
    const meshPos = mesh ? getComputedStyle(mesh).position : null;

    return {
      ok: issues.length === 0,
      issues,
      fonts,
      boxes,
      imgHidden,
      secH,
      secOverflow,
      meshPos,
      catRows: uniqueTops.size,
      minCatW,
      viewport: window.innerWidth
    };
  });

  await page.screenshot({
    path: 'artifacts/about-wwb-artists-mobile.png',
    fullPage: false
  });

  // Scroll section into view and screenshot again focused
  await page.evaluate(() => {
    document.getElementById('comp-mr38xqqo')?.scrollIntoView({ block: 'start' });
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({
    path: 'artifacts/about-wwb-artists-mobile-section.png',
    fullPage: false
  });

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  process.exit(report.ok ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(2);
});
