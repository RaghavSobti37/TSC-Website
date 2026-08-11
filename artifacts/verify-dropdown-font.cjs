const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--window-size=1440,900'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/about', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await page.waitForSelector('header [data-part="menu-item"]', {
    timeout: 30000,
  });

  const result = await page.evaluate(async () => {
    const items = Array.from(
      document.querySelectorAll('header [data-part="menu-item"]')
    );
    const artistsLi = items.find((li) => {
      const r = li.getBoundingClientRect();
      return (
        r.width > 2 &&
        !!(
          li.querySelector('button[aria-label*="Artists"]') ||
          /Artists/.test(li.textContent || '')
        )
      );
    });
    if (!artistsLi) return { error: 'no artists' };

    const trigger =
      artistsLi.querySelector('button[aria-label*="Artists"]') ||
      artistsLi.querySelector('button, a');
    if (trigger) {
      trigger.dispatchEvent(new MouseEvent('pointerover', { bubbles: true }));
      trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      trigger.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      trigger.click();
    }
    await new Promise((r) => setTimeout(r, 500));

    const nodes = Array.from(
      document.querySelectorAll(
        '.wixui-dropdown-menu__item-label, .wixui-dropdown-menu a, [id$="-dropdown"] a, .wixui-dropdown-container a'
      )
    ).filter((el) =>
      /TSC Artists|Artist Path|Learn With TSC/.test(
        (el.textContent || '').trim()
      )
    );

    const labels = nodes.map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.slice(0, 90),
        fontWeight: cs.fontWeight,
        color: cs.color,
        visible: r.width > 0 && r.height > 0,
      };
    });

    return {
      locked: !!document.querySelector(
        '[data-tsc-locked-desktop-header="true"]'
      ),
      labels,
    };
  });

  console.log(JSON.stringify(result, null, 2));

  const visible = (result.labels || []).filter((l) => l.visible);
  const ok =
    visible.length >= 3 &&
    visible.every((l) => l.fontSize === '15px');
  if (!ok) {
    console.error('FAIL: expected visible dropdown labels at 15px');
    process.exitCode = 1;
  } else {
    console.log('PASS: dropdown labels 15px (clone size)');
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
