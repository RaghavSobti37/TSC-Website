import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1440, height: 1000 },
});

const routes = ['/', '/about', '/work', '/artists', '/artist-path', '/learn-with-tsc', '/films', '/resources', '/academy'];

try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const sent = new Map();
  page.on('request', (r) => sent.set(r.url(), { t: r.resourceType(), at: Date.now(), r }));
  page.on('response', (r) => {
    if (sent.has(r.url())) sent.get(r.url()).res = r.status();
  });
  page.on('requestfailed', (r) => {
    if (sent.has(r.url())) sent.get(r.url()).fail = r.failure()?.errorText || 'failed';
  });

  for (const route of routes) {
    const t0 = Date.now();
    let ok = false;
    try {
      await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'networkidle2', timeout: 60000 });
      ok = true;
    } catch (e) {
      ok = false;
      console.log(`>>> ${route} TIMED OUT after ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      // capture what is in flight NOW
      const hung = [...sent.entries()].filter(([, v]) => !v.res && !v.fail);
      console.log('   in-flight/unresolved:', hung.length);
      for (const [u, v] of hung.slice(0, 25)) console.log('    ', v.t, u.slice(0, 140), 'age', ((Date.now() - v.at) / 1000).toFixed(0) + 's');
    }
    if (ok) console.log(`    ${route} ok in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
} finally {
  await browser.close();
}
