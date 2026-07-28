const path = require('path');
const puppeteer = require(path.resolve(__dirname, '..', '..', 'node_modules', 'puppeteer'));

(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/work', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));
  const info = await p.evaluate(() => {
    const links = [...document.querySelectorAll('link[rel=stylesheet]')].map((l, i) => ({ i, href: l.href.slice(-50) }));
    const el = document.querySelector('.comp-mr69hwsy-overflow-wrapper') || document.querySelector('#comp-mr69hwsy');
    const vm = document.querySelector('#comp-mr69hwvm1');
    const img = document.querySelector('#comp-mr69hwvu1');
    function matched(node) {
      const out = [];
      for (const sheet of document.styleSheets) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch (e) {
          continue;
        }
        for (const rule of rules) {
          if (rule.media && ![...rule.media].some((m) => window.matchMedia(m).matches) && rule.cssRules) {
            for (const r of rule.cssRules) {
              try {
                if (r.selectorText && node.matches(r.selectorText) && (r.style.height || r.style.minHeight)) {
                  out.push({
                    sel: r.selectorText.slice(0, 140),
                    h: r.style.getPropertyValue('height'),
                    mh: r.style.getPropertyValue('min-height'),
                    href: (sheet.href || 'inline').slice(-40),
                  });
                }
              } catch (e) {}
            }
            continue;
          }
          try {
            if (rule.selectorText && node.matches(rule.selectorText) && (rule.style.height || rule.style.minHeight)) {
              out.push({
                sel: rule.selectorText.slice(0, 140),
                h: rule.style.getPropertyValue('height'),
                mh: rule.style.getPropertyValue('min-height'),
                href: (sheet.href || 'inline').slice(-40),
              });
            }
          } catch (e) {}
        }
      }
      return out;
    }
    return {
      links,
      wrap: el && {
        cls: el.className.slice(0, 60),
        h: getComputedStyle(el).height,
        mh: getComputedStyle(el).minHeight,
        matched: matched(el).slice(-15),
      },
      vm: vm && { h: getComputedStyle(vm).height, mh: getComputedStyle(vm).minHeight, matched: matched(vm).slice(-10) },
      img: img && { h: getComputedStyle(img).height, display: getComputedStyle(img).display, box: img.getBoundingClientRect().height },
      host: {
        h: getComputedStyle(document.querySelector('#comp-mr69hwoy')).height,
        mh: getComputedStyle(document.querySelector('#comp-mr69hwoy')).minHeight,
      },
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
