'use strict';

const puppeteer = require('puppeteer');

const baseUrl = process.argv[2] || 'http://127.0.0.1:3100';
const route = process.argv[3] || '/book-a-call';

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 300));
  });
  page.on('pageerror', (err) => errors.push(`PAGEERROR: ${String(err.message || err).slice(0, 300)}`));
  await page.goto(`${baseUrl}${route}`, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 10000));

  const info = await page.evaluate(() => {
    const form = document.querySelector('form[id^="form-"]');
    const out = { hasForm: !!form, localForm: !!document.querySelector('.tsc-local-form') };
    if (form) {
      out.formId = form.id;
      out.buttons = Array.from(form.querySelectorAll('button')).map((b) => ({
        hook: b.getAttribute('data-hook') || '',
        type: b.type,
        text: (b.textContent || '').trim().slice(0, 40),
        visible: b.offsetParent !== null,
      })).slice(0, 12);
      out.fieldTypes = Array.from(new Set(Array.from(form.querySelectorAll('[data-field-type]')).map((el) => el.getAttribute('data-field-type'))));
      out.radios = form.querySelectorAll('input[type="radio"]').length;
      out.checkboxes = form.querySelectorAll('input[type="checkbox"]').length;
      out.textInputs = form.querySelectorAll('input[type="text"], input:not([type])').length;
      out.dateInputs = form.querySelectorAll('input[type="date"]').length;
      out.telInputs = form.querySelectorAll('input[type="tel"], input[inputmode="tel"]').length;
      out.emailInputs = form.querySelectorAll('input[type="email"]').length;
      out.selects = form.querySelectorAll('select').length;
      out.dropdowns = form.querySelectorAll('[data-field-type="DROPDOWN"]').length;
      out.hidden = Array.from(form.querySelectorAll('input, button, select, textarea')).filter((el) => el.offsetParent === null).map((el) => el.tagName + '.' + (el.getAttribute('data-hook') || el.type || '')).slice(0, 15);
    } else {
      out.mountComp = !!document.querySelector('#comp-mp2w3ngp2');
      out.sections = document.querySelectorAll('main section').length;
      out.formContainer = !!document.querySelector('[data-testid="responsive-container"]');
    }
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  console.log('--- console errors ---');
  errors.forEach((e) => console.log('*', e));
  await browser.close();
})();
