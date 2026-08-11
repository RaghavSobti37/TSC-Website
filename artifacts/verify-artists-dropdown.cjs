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

  const result = await page.evaluate(() => {
    const items = Array.from(
      document.querySelectorAll('header [data-part="menu-item"]')
    );
    const artistsLi = items.find((li) => {
      const r = li.getBoundingClientRect();
      return r.width > 2 && !!li.querySelector('button[aria-label*="Artists"]');
    });
    const trigger = Array.from(artistsLi.querySelectorAll('a')).find(
      (a) => (a.textContent || '').trim().replace(/\s+/g, ' ') === 'Artists'
    );
    const dropdown = artistsLi.querySelector(
      '[id$="-dropdown"][data-part="dropdown-container"]'
    );

    artistsLi.setAttribute('data-open', 'true');
    dropdown.setAttribute('data-open', 'true');
    dropdown.setAttribute('data-anchor', 'menuStretched');
    // Force the Wix menuStretched bug: left flush to menu start
    dropdown.style.setProperty('left', '0px', 'important');
    dropdown.style.setProperty('--dropdown-left', '0px');

    const broken = {
      left: getComputedStyle(dropdown).left,
      rectL: Math.round(dropdown.getBoundingClientRect().left),
      triggerL: Math.round(trigger.getBoundingClientRect().left),
      w: Math.round(dropdown.getBoundingClientRect().width),
    };
    broken.delta = Math.abs(broken.rectL - broken.triggerL);

    // Production align
    const triggerRect = trigger.getBoundingClientRect();
    const parent = dropdown.offsetParent;
    const parentLeft =
      parent && parent.getBoundingClientRect
        ? parent.getBoundingClientRect().left
        : 0;
    const leftPx = Math.round(triggerRect.left - parentLeft) + 'px';
    dropdown.style.setProperty('--dropdown-left', leftPx);
    dropdown.style.setProperty('left', leftPx, 'important');
    dropdown.style.setProperty('right', 'auto', 'important');
    dropdown.style.setProperty('transform', 'none', 'important');

    const fixed = {
      left: getComputedStyle(dropdown).left,
      rectL: Math.round(dropdown.getBoundingClientRect().left),
      triggerL: Math.round(trigger.getBoundingClientRect().left),
      w: Math.round(dropdown.getBoundingClientRect().width),
    };
    fixed.delta = Math.abs(fixed.rectL - fixed.triggerL);

    return { broken, fixed };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (result.broken.delta < 50) {
    console.error('broken state not reproduced');
    process.exit(1);
  }
  if (result.fixed.delta > 8) process.exit(1);
  console.log('PASS: misaligned', result.broken.delta, 'px → aligned', result.fixed.delta, 'px');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
