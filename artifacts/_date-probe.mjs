import puppeteer from 'puppeteer';

const url = process.argv[2] || 'http://localhost:3000/book-a-call';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,2000'],
  defaultViewport: { width: 1400, height: 2000 },
});

try {
  const page = await browser.newPage();
  const badResponses = [];
  page.on('response', (r) => {
    if (r.status() >= 400) badResponses.push(r.status() + ' ' + r.url().slice(0, 110));
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));

  // Find the date field
  const dateField = await page.evaluate(() => {
    const df = document.querySelector('[data-field-type="DATE_PICKER"]');
    if (!df) return null;
    const info = {
      exists: true,
      inputs: [],
    };
    df.querySelectorAll('input').forEach((inp) => {
      const cs = getComputedStyle(inp);
      const r = inp.getBoundingClientRect();
      info.inputs.push({
        type: inp.type,
        cls: inp.className,
        placeholder: inp.placeholder,
        readOnly: inp.readOnly,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        pos: cs.position,
        opacity: cs.opacity,
        vis: cs.visibility,
        display: cs.display,
      });
    });
    // Any element in the whole page showing a visible date-ish input?
    const allDates = [];
    document.querySelectorAll('input[type="date"]').forEach((inp) => {
      const cs = getComputedStyle(inp);
      const r = inp.getBoundingClientRect();
      allDates.push({
        cls: inp.className,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        opacity: cs.opacity,
        vis: cs.visibility,
      });
    });
    // forms.css rule match check
    const ruleMatched = (() => {
      const rules = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule.selectorText && rule.selectorText.includes('native-hidden-date-picker')) {
              rules.push({ file: sheet.href || 'inline', css: rule.cssText.slice(0, 200) });
            }
          }
        } catch (e) {}
      }
      return rules;
    })();
    return { ...info, allDates, ruleMatched };
  });

  console.log('=== BEFORE CLICK ===');
  console.log(JSON.stringify(dateField, null, 1));

  // Click the Wix date input (or its calendar icon) to trigger focus/showPicker
  const clicked = await page.evaluate(() => {
    const df = document.querySelector('[data-field-type="DATE_PICKER"]');
    if (!df) return 'no-date-field';
    const input = df.querySelector('[data-hook="date-picker-input"]');
    const cal = df.querySelector('[data-hook="date-picker-calendar-icon"]');
    if (cal) {
      cal.click();
      return 'clicked-cal-icon';
    }
    if (input) {
      input.click();
      return 'clicked-input';
    }
    return 'nothing-to-click';
  });
  console.log('clicked:', clicked);

  await new Promise((r) => setTimeout(r, 1200));

  const after = await page.evaluate(() => {
    const df = document.querySelector('[data-field-type="DATE_PICKER"]');
    if (!df) return null;
    const inputs = [];
    df.querySelectorAll('input').forEach((inp) => {
      const cs = getComputedStyle(inp);
      const r = inp.getBoundingClientRect();
      inputs.push({
        type: inp.type,
        cls: inp.className,
        placeholder: inp.placeholder,
        active: document.activeElement === inp,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        pos: cs.position,
        opacity: cs.opacity,
        vis: cs.visibility,
      });
    });
    return { inputs };
  });
  console.log('=== AFTER CLICK ===');
  console.log(JSON.stringify(after, null, 1));
  console.log('badResponses:', JSON.stringify(badResponses));
  console.log('pageErrors:', JSON.stringify(errors));

  await page.screenshot({ path: 'artifacts/_date-probe.png', fullPage: false });
  console.log('screenshot: artifacts/_date-probe.png');
} finally {
  await browser.close();
}
