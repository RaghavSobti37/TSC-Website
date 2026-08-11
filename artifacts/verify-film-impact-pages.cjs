const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1440, height: 900 });

  const routes = [
    '/mahavatar-narsimha-impact',
    '/hanuman-ansh-impact',
    '/mahaprabhu-jagannath-impact',
    '/kalki-impact',
  ];

  const reportChecks = [];
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3100${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    reportChecks.push(await page.evaluate(() => ({
      path: location.pathname,
      title: document.title,
      h1: document.querySelector('h1')?.textContent.trim() || '',
      hasFilmClass: Boolean(document.querySelector('.report-page--film')),
      marks: document.querySelectorAll('mark').length,
      stats: document.querySelectorAll('.stat strong').length
    })));
  }

  await page.goto('http://127.0.0.1:3100/pages/films.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 10500));
  const filmCards = await page.evaluate(() => ({
    duplicateScript: Boolean(document.querySelector('script[src^="/js/tsc-films-page.js"]')),
    sharedComponentScript: Boolean(document.querySelector('script[src^="/js/tsc-components.js"]')),
    cards: Array.from(document.querySelectorAll('[data-tsc-film-report-link]')).map(el => ({
      label: el.getAttribute('aria-label'),
      href: el.getAttribute('data-tsc-film-report-link'),
      anchors: Array.from(el.querySelectorAll('a')).map(a => a.getAttribute('href')).filter(Boolean).slice(0, 3)
    }))
  }));

  console.log(JSON.stringify({ reportChecks, filmCards }, null, 2));
  const expected = [
    '/mahavatar-narsimha-impact',
    '/hanuman-ansh-impact',
    '/mahaprabhu-jagannath-impact',
    '/kalki-impact'
  ];
  const failures = [];
  for (const check of reportChecks) {
    if (!check.hasFilmClass || check.marks < 1 || check.stats !== 4) failures.push(`bad report ${check.path}`);
  }
  for (const href of expected) {
    const card = filmCards.cards.find(item => item.href === href);
    if (!card) failures.push(`missing card ${href}`);
    if (card && card.anchors.some(anchor => anchor !== href)) failures.push(`stale nested anchor ${href}`);
  }
  if (filmCards.duplicateScript) failures.push('duplicate tsc-films-page script still present');
  if (!filmCards.sharedComponentScript) failures.push('missing shared tsc-components script');
  if (failures.length) {
    throw new Error(failures.join('; '));
  }
  await browser.close();
})();
