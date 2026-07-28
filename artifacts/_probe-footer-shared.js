const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const paths = [
    '/', '/about', '/work', '/academy', '/artists', '/films', '/resources',
    '/artist-path', '/learn-with-tsc', '/music-production', '/artist-query',
    '/collab-query', '/mba', '/from-bhajan-to-clubbing', '/masterclass-review01',
    '/you-released-a-song-now-what', '/classicalreview'
  ];

  for (const width of [390, 1280]) {
    console.log('\n=== viewport', width, '===');
    for (const path of paths) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: width === 390 ? 844 : 900 });
      try {
        await page.goto('http://127.0.0.1:3000' + path, {
          waitUntil: 'networkidle2',
          timeout: 45000
        });
        await new Promise((r) => setTimeout(r, 1200));
        const info = await page.evaluate(() => {
          const mobile = document.querySelector('.tsc-mobile-footer');
          const footer = document.querySelector('footer#SITE_FOOTER, footer[data-testid="siteFooter"], footer, #SITE_FOOTER');
          return {
            hasMobileFooter: !!mobile,
            bodyHasClass: document.body.classList.contains('tsc-has-mobile-footer'),
            footerId: footer ? (footer.id || footer.tagName) : null,
            scripts: {
              components: !!document.querySelector('script[src*="tsc-components"]'),
              content: !!document.querySelector('script[src*="content-replacements"]'),
              TSC: !!window.TSCComponents
            },
            mobileSnippet: mobile
              ? mobile.innerText.replace(/\s+/g, ' ').slice(0, 160)
              : null,
            wixQuickVisible: !!(footer && !mobile && /Quick Links/i.test(footer.innerText || '')),
            footerChildCount: footer ? footer.children.length : 0
          };
        });
        console.log(JSON.stringify({ path, ...info }));
      } catch (e) {
        console.log(JSON.stringify({ path, error: String(e.message || e) }));
      }
      await page.close();
    }
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
