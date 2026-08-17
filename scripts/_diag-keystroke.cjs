'use strict';

// Test artist-query multi-step form with REAL keystrokes (page.type) which
// drives Wix's React state the way a real user would.
const puppeteer = require('puppeteer');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseUrl = 'http://127.0.0.1:3100';

async function main() {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const api = [];
    page.on('request', (req) => { if (/\/api\/artist-path/.test(req.url())) api.push(`${req.method()} ${req.url()}`); });
    page.on('pageerror', (e) => console.log('pageerror:', String(e.message || e).slice(0, 120)));
    try {
      await page.goto(`${baseUrl}/artist-query`, { waitUntil: 'load', timeout: 90000 });
    } catch (e) { console.log('nav timeout:', e.message.slice(0, 80)); }
    await new Promise((r) => setTimeout(r, 12000));

    const snap = () => page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      if (!f) return null;
      return {
        inputs: [...f.querySelectorAll('input, textarea')].map((el) => ({ label: (el.getAttribute('aria-label') || '').slice(0, 25), value: el.value })),
        btn: [...f.querySelectorAll('button')].map((b) => b.getAttribute('data-hook') || b.textContent.trim().slice(0, 20)),
      };
    });

    // Type into fields by aria-label
    async function type(label, value) {
      const handle = await page.evaluateHandle((l) => {
        const f = document.querySelector('form[id^="form-"]');
        const el = [...f.querySelectorAll('input, textarea')].find((i) => (i.getAttribute('aria-label') || '').toLowerCase().includes(l));
        if (el) { el.focus(); el.click(); }
        return el || null;
      }, label);
      const el = handle.asElement();
      if (el) {
        await el.type(value, { delay: 30 });
      }
      await handle.dispose();
    }

    await type('first name', 'Test');
    await type('last name', 'User');
    await type('where are you based', 'Mumbai');
    await type('mobile', '9876543210');
    await type('email', 'test+form@example.com');
    await type('stage name', 'Stage');
    await new Promise((r) => setTimeout(r, 800));
    console.log('AFTER TYPING:', JSON.stringify(await snap(), null, 1));

    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const next = f.querySelector('button[data-hook="next-button"]');
      if (next) next.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('AFTER NEXT:', JSON.stringify(await snap(), null, 1));

    // Fill step 2 textareas via typing
    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const t = f.querySelectorAll('textarea');
      t.forEach((el) => { el.focus(); });
    });
    const tareas = await page.$$('form[id^="form-"] textarea');
    for (const ta of tareas.slice(0, 3)) {
      await ta.type('A good answer for the field.', { delay: 10 });
    }
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const next = f.querySelector('button[data-hook="next-button"]');
      if (next) next.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('AFTER NEXT2:', JSON.stringify(await snap(), null, 1));

    const tareas2 = await page.$$('form[id^="form-"] textarea');
    for (const ta of tareas2.slice(0, 4)) {
      await ta.type('More detail for this field.', { delay: 10 });
    }
    await new Promise((r) => setTimeout(r, 500));

    // click submit if present
    const submitInfo = await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const btn = f.querySelector('button[data-hook="submit-button"], button[type="submit"]');
      if (btn) btn.click();
      return { clicked: !!btn, hooks: [...f.querySelectorAll('button')].map((b) => b.getAttribute('data-hook')).filter(Boolean) };
    });
    console.log('SUBMIT:', JSON.stringify(submitInfo));
    await new Promise((r) => setTimeout(r, 5000));
    const feedback = await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const note = f && f.querySelector('.native-form-feedback, .tsc-form-note');
      return note ? { text: note.textContent.trim().slice(0, 120), cls: note.className } : null;
    });
    console.log('FEEDBACK:', JSON.stringify(feedback));
    console.log('API:', JSON.stringify(api));
  } finally {
    await browser.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
