'use strict';

// Dump the artist-query native form field structure (inputs + data-hooks + visibility)
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

    const dump = await page.evaluate(() => {
      const f = document.querySelector('form[id^="form-"]');
      if (!f) return { ok: false };
      const out = [];
      f.querySelectorAll('input, select, textarea, [data-hook*="step"], [data-hook*="phone"], [data-hook*="mobile"]').forEach((el) => {
        const hook = el.getAttribute('data-hook') || '';
        const r = el.getBoundingClientRect();
        out.push({
          tag: el.tagName.toLowerCase(),
          type: el.type || '',
          name: el.name || '',
          hook: hook.slice(0, 50),
          placeholder: (el.getAttribute('placeholder') || '').slice(0, 40),
          ariaLabel: (el.getAttribute('aria-label') || '').slice(0, 40),
          visible: el.offsetParent !== null,
          w: Math.round(r.width),
          h: Math.round(r.height),
          value: el.value ? el.value.slice(0, 20) : ''
        });
      });
      // also list wrapper divs with form-field data-hook
      const wrappers = [];
      f.querySelectorAll('[data-hook^="form-field-"]').forEach((w) => {
        const inner = w.querySelector('input, textarea, select');
        wrappers.push({
          hook: w.getAttribute('data-hook'),
          innerTag: inner ? inner.tagName.toLowerCase() : 'none',
          innerType: inner ? inner.type : '',
          innerVisible: inner ? inner.offsetParent !== null : false
        });
      });
      return { ok: true, inputs: out, wrappers: wrappers.slice(0, 40) };
    });
    console.log(JSON.stringify(dump, null, 1));
  } finally {
    await browser.close();
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
