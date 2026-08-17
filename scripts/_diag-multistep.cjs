'use strict';

// Trace what happens to the mobile phone field across the multi-step transitions
const puppeteer = require('puppeteer');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseUrl = 'http://127.0.0.1:3100';

async function main() {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      await page.goto(`${baseUrl}/artist-query`, { waitUntil: 'load', timeout: 90000 });
    } catch (e) { console.log('nav timeout:', e.message.slice(0, 80)); }
    await new Promise((r) => setTimeout(r, 12000));

    const doSet = (el, value) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const snap = () => page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      if (!f) return null;
      const inputs = [...f.querySelectorAll('input, textarea')].map((el) => ({
        label: (el.getAttribute('aria-label') || '').slice(0, 25) || el.type,
        value: el.value,
        visible: el.offsetParent !== null,
      }));
      const btns = [...f.querySelectorAll('button')].map((b) => b.getAttribute('data-hook') || b.textContent.trim().slice(0, 20));
      return { inputs, btns };
    });

    console.log('STEP 0 (initial):', JSON.stringify(await snap(), null, 1));

    // fill visible inputs
    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const doSet = (el, value) => {
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      f.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])').forEach((el) => {
        if (!el.value) doSet(el, /mobile|phone/i.test(el.getAttribute('aria-label') || '') ? '9876543210' : el.type === 'email' ? 'test+form@example.com' : el.type === 'url' ? 'https://example.com' : 'Test User');
      });
    });
    await new Promise((r) => setTimeout(r, 600));
    console.log('AFTER FILL:', JSON.stringify(await snap(), null, 1));

    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const next = f.querySelector('button[data-hook="next-button"]');
      if (next) next.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('AFTER NEXT (step 2):', JSON.stringify(await snap(), null, 1));

    await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      const next = f.querySelector('button[data-hook="next-button"]');
      if (next) next.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    console.log('AFTER NEXT (step 3):', JSON.stringify(await snap(), null, 1));
  } finally {
    await browser.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
