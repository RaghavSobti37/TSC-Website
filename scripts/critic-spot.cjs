const puppeteer = require('puppeteer');

const routes = [
  '/',
  '/about',
  '/work',
  '/artists',
  '/films',
  '/academy',
  '/book-a-call',
  '/harshad-duhita',
  '/mba',
  '/start-making-music',
];

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const issues = [];

  for (const width of [375, 1024]) {
    await page.setViewport({ width, height: 812, deviceScaleFactor: 1 });
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:3000${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 400));
      const metrics = await page.evaluate(() => {
        const overflow = Math.max(
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
          document.body.scrollWidth - document.body.clientWidth
        );
        const menu = document.querySelector(
          'button[aria-label*="enu"],button[aria-label*="avigation"],#MENU_AS_CONTAINER_TOGGLE'
        );
        const inputs = [...document.querySelectorAll('input,select,textarea,button')].slice(0, 40);
        const small = inputs.filter((el) => {
          const box = el.getBoundingClientRect();
          return box.width > 0 && box.height > 0 && (box.height < 36 || box.width < 36);
        }).length;
        return { overflow, hasMenu: !!menu, small };
      });
      const ok = metrics.overflow <= 1;
      console.log(ok ? 'OK' : 'FAIL', width, route, JSON.stringify(metrics));
      if (!ok) issues.push({ route, width, ...metrics });
    }
  }

  console.log('CRITIC_ISSUES', issues.length);
  await browser.close();
  process.exit(issues.length ? 1 : 0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
