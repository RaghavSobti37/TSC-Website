import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1440, height: 1000 },
});

try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  const sent = new Map();
  page.on('request', (r) => sent.set(r.url(), { t: r.resourceType(), at: Date.now() }));
  page.on('response', (r) => { if (sent.has(r.url())) sent.get(r.url()).res = r.status(); });
  page.on('requestfailed', (r) => { if (sent.has(r.url())) sent.get(r.url()).fail = 1; });

  // warm up with a light page first, like the audit does
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});

  const t0 = Date.now();
  let timedOut = false;
  try {
    await page.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('academy networkidle2 OK in', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  } catch (e) {
    timedOut = true;
    console.log('academy networkidle2 TIMED OUT after', ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  if (timedOut) {
    const res = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      // longest durations
      const sorted = [...entries].sort((a, b) => b.duration - a.duration).slice(0, 15);
      return sorted.map((e) => ({ name: e.name.slice(0, 130), duration: Math.round(e.duration), transferSize: e.transferSize, initiatorType: e.initiatorType }));
    });
    console.log('=== longest resource durations at timeout ===');
    for (const r of res) console.log(' ', r.duration + 'ms', r.initiatorType, r.transferSize, r.name);
  }
} finally {
  await browser.close();
}
