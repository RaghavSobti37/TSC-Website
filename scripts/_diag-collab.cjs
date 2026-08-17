'use strict';

// Focused: why doesn't collab-query local form submit fire?
const puppeteer = require('puppeteer');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseUrl = 'http://127.0.0.1:3100';

async function main() {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    const logs = [];
    page.on('console', (m) => { if (m.type() === 'error' || /form/i.test(m.text())) logs.push(`[${m.type()}] ${m.text().slice(0, 200)}`); });
    page.on('pageerror', (e) => logs.push(`[pageerror] ${String(e.message || e).slice(0, 200)}`));
    try {
      await page.goto(`${baseUrl}/collab-query`, { waitUntil: 'load', timeout: 90000 });
    } catch (e) { console.log('nav timeout:', e.message.slice(0, 80)); }
    await new Promise((r) => setTimeout(r, 12000));

    const info = await page.evaluate(() => {
      const form = document.querySelector('.tsc-local-form[data-tsc-form]');
      if (!form) return { ok: false };
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      const invalid = [];
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        if (!el.checkValidity()) invalid.push({ name: el.name || el.getAttribute('data-label') || '', type: el.type || el.tagName, msg: el.validationMessage.slice(0, 40) });
      });
      // simulate fill again then re-check
      const doSet = (el, value) => {
        const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      form.querySelectorAll('input[type="text"], input:not([type]), input[type="email"], input[type="tel"], textarea').forEach((el) => {
        if (!el.value) doSet(el, el.type === 'email' ? 'test+form@example.com' : el.type === 'tel' ? '9876543210' : 'Test User');
      });
      const sel = form.querySelector('select');
      if (sel) { sel.value = sel.options[1].value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
      const radio = form.querySelector('input[type="radio"]');
      if (radio) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
      const invalidAfter = [];
      form.querySelectorAll('input, select, textarea').forEach((el) => {
        if (!el.checkValidity()) invalidAfter.push({ name: el.name || el.getAttribute('data-label') || '', type: el.type || el.tagName, msg: el.validationMessage.slice(0, 40) });
      });
      return {
        ok: true,
        formBound: form.dataset.bound,
        tscForm: form.getAttribute('data-tsc-form'),
        btnType: btn ? btn.getAttribute('type') : null,
        btnText: btn ? btn.textContent.trim().slice(0, 20) : null,
        invalidBefore: invalid,
        invalidAfter,
        validity: form.checkValidity(),
      };
    });
    console.log(JSON.stringify(info, null, 1));

    // Now actually submit by dispatching a submit event
    const sub = await page.evaluate(() => {
      const form = document.querySelector('.tsc-local-form[data-tsc-form]');
      if (!form) return { ok: false };
      const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      // try both click and requestSubmit
      let clicked = false;
      if (btn) { btn.click(); clicked = true; }
      return { ok: true, clicked };
    });
    console.log('submit dispatch:', JSON.stringify(sub));
    await new Promise((r) => setTimeout(r, 5000));
    const after = await page.evaluate(() => {
      const form = document.querySelector('.tsc-local-form[data-tsc-form]');
      const status = form ? form.querySelector('.tsc-form-feedback, [data-tsc-status], .form-status') : null;
      return {
        statusText: status ? status.textContent.trim().slice(0, 120) : null,
        statusCls: status ? status.className : null,
        btnText: form ? (form.querySelector('button') || {}).textContent : null
      };
    });
    console.log('after:', JSON.stringify(after));
    console.log('logs:', JSON.stringify(logs.slice(0, 10), null, 1));
  } finally {
    await browser.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
