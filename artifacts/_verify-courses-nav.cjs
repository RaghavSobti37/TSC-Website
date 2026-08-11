const puppeteer = require('puppeteer');
const BASE = 'http://127.0.0.1:3000';
const PATHS = ['/academy', '/music-production', '/the-heart-of-composition', '/roots-of-hindustani-classical'];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], protocolTimeout: 90000 });
  let failed = 0;
  for (const path of PATHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 4000));
    const info = await page.evaluate(() => {
      const courseMenus = Array.from(document.querySelectorAll('ul.wixui-dropdown-menu, ul[role="menu"]'))
        .filter((menu) => {
          const t = (menu.textContent || '').toLowerCase();
          return t.includes('music production') || t.includes('heart of composition') || t.includes('hindustani');
        })
        .filter((menu) => !(menu.textContent || '').toLowerCase().includes('tsc artists'))
        .map((menu) =>
          Array.from(menu.querySelectorAll('a')).map((a) => ({
            text: (a.textContent || '').trim().replace(/\s+/g, ' '),
            href: a.getAttribute('href'),
          }))
        );
      const need = [
        ['/music-production', /a[\s-]*to[\s-]*z|a-z of music/i],
        ['/the-heart-of-composition', /heart of composition/i],
        ['/roots-of-hindustani-classical', /roots of hindustani/i],
      ];
      const menusOk =
        courseMenus.length > 0 &&
        courseMenus.every((items) => {
          if (items.length !== 3) return false;
          return need.every(([href, re]) => items.some((it) => it.href === href && re.test(it.text)));
        });
      return {
        courseMenus,
        menusOk,
        motionScript: Array.from(document.scripts).some((s) => (s.src || '').includes('tsc-wix-motion')),
      };
    });
    console.log('\n===' + path + '===');
    console.log(JSON.stringify(info, null, 2));
    if (!info.menusOk) {
      console.error('FAIL menus', path);
      failed += 1;
    }
    if (path !== '/academy' && !info.motionScript) {
      console.error('FAIL motion script', path);
      failed += 1;
    }
    await page.close();
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(BASE + '/music-production', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));
  await page.evaluate(() => {
    const a = Array.from(document.querySelectorAll('ul.wixui-dropdown-menu a')).find((el) =>
      /heart of composition/i.test(el.textContent || '')
    );
    if (!a) throw new Error('HeART link missing');
    a.click();
  });
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));
  const landed = await page.evaluate(() => location.pathname.replace(/\/$/, ''));
  console.log('\nclick HeART from music-production →', landed);
  if (landed !== '/the-heart-of-composition') {
    console.error('FAIL click nav');
    failed += 1;
  }

  await browser.close();
  if (failed) {
    console.error('VERIFY FAILED', failed);
    process.exit(1);
  }
  console.log('\nVERIFY OK');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
