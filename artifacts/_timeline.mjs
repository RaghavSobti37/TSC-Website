import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1440, height: 1000 },
});

try {
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  let t0 = Date.now();
  const log = [];
  page.on('request', (r) => {
    const t = ((Date.now() - t0) / 1000).toFixed(1);
    log.push({ t, kind: 'REQ', type: r.resourceType(), url: r.url().slice(0, 110) });
  });
  page.on('response', (r) => {
    const t = ((Date.now() - t0) / 1000).toFixed(1);
    log.push({ t, kind: 'RES', type: r.request().resourceType(), url: r.url().slice(0, 110) });
  });

  // warm up like before (this reproduces the hang)
  await page.goto('http://127.0.0.1:3000/about', { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {});
  log.length = 0;
  t0 = Date.now();

  let timedOut = false;
  try {
    await page.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle2', timeout: 20000 });
    console.log('networkidle2 OK in', ((Date.now() - t0) / 1000).toFixed(1) + 's');
  } catch (e) {
    timedOut = true;
    console.log('networkidle2 TIMED OUT');
  }

  // keep listening for 8 more seconds to see if requests keep flowing
  await new Promise((r) => setTimeout(r, 8000));
  const extra = [...log];
  log.length = 0;
  await new Promise((r) => setTimeout(r, 4000));
  const after = [...log];

  console.log('=== requests during 20s wait (first 40) ===');
  for (const l of extra.slice(0, 40)) console.log(' ', l.t + 's', l.kind, l.type, l.url);
  console.log('... total during wait:', extra.length);
  console.log('=== requests in next 4s (after timeout fired) ===');
  for (const l of after.slice(0, 20)) console.log(' ', l.t + 's', l.kind, l.type, l.url);
  console.log('... total after:', after.length);
} finally {
  await browser.close();
}
