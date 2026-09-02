const puppeteer = require('puppeteer');

const baseUrl = process.argv[2] || 'http://127.0.0.1:3100';

async function testBookArtist(page) {
  await page.goto(`${baseUrl}/book-an-artist`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForFunction(() => {
    const form = document.querySelector('form[id^="form-"]');
    return form && form.dataset.tscNativeBound === 'true';
  }, { timeout: 30000 });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const monthTest = await page.evaluate(async () => {
    const monthRoot = document.querySelector('[data-hook="MONTH"]');
    const trigger = monthRoot && monthRoot.querySelector('[data-hook="dropdown-base"]');
    if (!trigger) return { ok: false, reason: 'no-month-trigger' };
    trigger.click();
    await new Promise((r) => setTimeout(r, 300));
    const menu = document.querySelector('.native-dropdown-menu');
    if (!menu) return { ok: false, reason: 'no-month-menu' };
    const sept = [...menu.querySelectorAll('.native-dropdown-item')].find((i) => i.textContent === 'September');
    if (!sept) {
      return {
        ok: false,
        reason: 'no-september-option',
        options: [...menu.querySelectorAll('.native-dropdown-item')].map((i) => i.textContent),
      };
    }
    sept.click();
    await new Promise((r) => setTimeout(r, 200));
    const text = (monthRoot.querySelector('[data-hook="dropdown-base-text"]') || {}).textContent || '';
    const val = monthRoot.dataset.selectedValue || '';
    return { ok: text.trim() === 'September' && val === 'September', text: text.trim(), val };
  });

  const logisticsTest = await page.evaluate(async () => {
    const group = document.querySelector('[data-hook="form-field-logistics_provided"]');
    const opts = [...group.querySelectorAll('[data-hook^="checkbox-"]')];
    const partial = opts.find((w) => (w.getAttribute('data-hook') || '').includes('Partially'));
    if (!partial) return { ok: false, reason: 'no-partial-option' };
    partial.click();
    await new Promise((r) => setTimeout(r, 200));
    const checked = opts.filter((w) => w.classList.contains('is-selected') || w.getAttribute('data-checked') === 'true');
    const selected = group.dataset.selectedValue || '';
    return {
      ok: (checked.length === 1 || selected) && /Partially Provided/.test(selected),
      checked: checked.length,
      selected,
      hasSelectedClass: partial.classList.contains('is-selected'),
    };
  });

  return { monthTest, logisticsTest };
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  try {
    const page = await browser.newPage();
    const result = await testBookArtist(page);
    console.log(JSON.stringify(result, null, 2));
    const pass = result.monthTest.ok && result.logisticsTest.ok;
    if (!pass) process.exit(1);
  } finally {
    await browser.close();
  }
})();
