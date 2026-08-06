const puppeteer = require('puppeteer');

async function waitForPageValue(page, check, timeout = 20000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await page.evaluate(check)) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Page condition not met within ${timeout}ms`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://127.0.0.1:3001/academy', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await waitForPageValue(page, () => !!document.querySelector('#comp-mr0g77kb a[href="/artist-query"]'));

  const academy = await page.evaluate(() => {
    const a = document.querySelector('#comp-mr0g77kb a');
    const wrap = document.querySelector('#comp-mr0g77kb');
    return {
      href: a && a.getAttribute('href'),
      label: a && a.getAttribute('aria-label'),
      tag: a && a.tagName,
      linked: wrap && wrap.dataset.tscFindCourseLinked
    };
  });

  await page.goto('http://127.0.0.1:3001/artist-query', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await waitForPageValue(
    page,
    () =>
      !!document.querySelector('[data-tsc-form="artistPath"]') &&
      typeof (window.TSCComponents && window.TSCComponents.getRecommendedCourse) === 'function'
  );

  const form = await page.evaluate(() => {
    const f = document.querySelector('[data-tsc-form="artistPath"]');
    return {
      hasForm: !!f,
      fields: f ? f.querySelectorAll('input,textarea,select').length : 0,
      hasRecommendFn: typeof (window.TSCComponents && window.TSCComponents.getRecommendedCourse)
    };
  });

  const rec = await page.evaluate(() => {
    const g = window.TSCComponents.getRecommendedCourse;
    return {
      classical: g({
        trainingDetails: 'riyaaz raag hindustani',
        learningNeeds: 'vocal'
      }).id,
      production: g({
        coreSkills: 'ableton',
        currentSetup: 'mixing studio',
        learningNeeds: 'mastering'
      }).id,
      composition: g({ artistIdentity: 'songwriting lyrics' }).id
    };
  });

  console.log(JSON.stringify({ academy, form, rec }, null, 2));

  if (academy.href !== '/artist-query') throw new Error('Find Your Course not linked');
  if (!form.hasForm || form.hasRecommendFn !== 'function') throw new Error('artist form/recommend missing');
  if (rec.classical !== 'classical' || rec.production !== 'production' || rec.composition !== 'composition') {
    throw new Error('recommend scoring mismatch ' + JSON.stringify(rec));
  }

  await browser.close();
  console.log('browser verify OK');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
