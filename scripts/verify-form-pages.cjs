'use strict';

// Browser verification for the four form subpages (artist-query, book-a-call,
// book-an-artist, collab-query) on desktop + mobile.
//
// Checks, per page per viewport:
//   1. The Wix native form renders and is visible (original design) OR the
//      tsc-local-form fallback is present.
//   2. No react_render_error / console errors / pageerrors from the runtime
//      patches (the viewer-model + site-config + fetch-guard injections).
//   3. Fill + submit drives a request to the local /api/* endpoint and shows
//      the native feedback box (success or graceful error).
//
// Usage: node scripts/verify-form-pages.cjs [baseUrl]  (default http://127.0.0.1:3100)

const puppeteer = require('puppeteer');

const baseUrl = process.argv[2] || 'http://127.0.0.1:3100';
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const pages = [
  { route: '/artist-query', endpoint: '/api/artist-path' },
  { route: '/book-a-call', endpoint: '/api/book-call' },
  { route: '/book-an-artist', endpoint: '/api/query' },
  { route: '/collab-query', endpoint: '/api/leads' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

function fillScript() {
  return function fill() {
    var setVal = function (el, value) {
      var proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      var setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    var form = document.querySelector('form[id^="form-"]');
    if (!form) return { ok: false, reason: 'no native form' };

    var filled = 0;
    form.querySelectorAll('input[type="text"], input:not([type])').forEach(function (el) {
      if (!el.value && el.offsetParent !== null) {
        setVal(el, 'Test User');
        filled += 1;
      }
    });
    form.querySelectorAll('input[type="email"]').forEach(function (el) {
      if (!el.value && el.offsetParent !== null) {
        setVal(el, 'test+form@example.com');
        filled += 1;
      }
    });
    form.querySelectorAll('input[type="tel"], input[inputmode="tel"]').forEach(function (el) {
      if (!el.value && el.offsetParent !== null) {
        setVal(el, '9876543210');
        filled += 1;
      }
    });
    form.querySelectorAll('input[type="date"]').forEach(function (el) {
      if (!el.value) {
        setVal(el, '2026-09-15');
        filled += 1;
      }
    });
    // Time inputs (book-a-call)
    var hours = form.querySelector('[data-hook="hours"]');
    var minutes = form.querySelector('[data-hook="minutes"]');
    if (hours && !hours.value) {
      setVal(hours, '10');
      filled += 1;
    }
    if (minutes && !minutes.value) {
      setVal(minutes, '30');
      filled += 1;
    }
    // Radios: pick the first in each group
    var seen = {};
    form.querySelectorAll('input[type="radio"]').forEach(function (radio) {
      if (radio.offsetParent === null) return;
      if (!seen[radio.name]) {
        seen[radio.name] = true;
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
        var wrapper = radio.closest('.siroRCe') || radio.closest('[data-hook="core-radio-button"]');
        if (wrapper) wrapper.setAttribute('data-checked', 'true');
        filled += 1;
      }
    });
    // Checkboxes: pick the first visible in each group
    var cseen = {};
    form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      if (cb.offsetParent === null) return;
      var name = cb.name || cb.closest('[data-hook="box-selection-option-wrapper"]') ? 'box' : 'box';
      if (!cseen[name]) {
        cseen[name] = true;
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        var wrapper = cb.closest('[data-hook="box-selection-option-wrapper"]');
        if (wrapper) wrapper.setAttribute('data-checked', 'true');
        filled += 1;
      }
    });
    return { ok: true, filled: filled, inputCount: form.querySelectorAll('input, select, textarea').length };
  };
}

function submitScript() {
  return function submit() {
    var form = document.querySelector('form[id^="form-"]');
    if (!form) return { ok: false, reason: 'no native form' };
    var btn = form.querySelector('button[data-hook="submit-button"], button[type="submit"]');
    if (!btn) return { ok: false, reason: 'no submit button' };
    btn.click();
    return { ok: true };
  };
}

async function main() {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
  try {
    for (const pageDef of pages) {
      for (const viewport of viewports) {
        const page = await browser.newPage();
        await page.setViewport({ width: viewport.width, height: viewport.height });

        const consoleErrors = [];
        let pageErrors = 0;
        const apiRequests = [];
        page.on('console', (msg) => {
          const text = msg.text();
          if (msg.type() === 'error') consoleErrors.push(text.slice(0, 200));
          if (/react_render_error/i.test(text)) consoleErrors.push(`REACT_RENDER_ERROR: ${text.slice(0, 120)}`);
        });
        page.on('pageerror', (err) => {
          pageErrors += 1;
          consoleErrors.push(`pageerror: ${String(err.message || err).slice(0, 200)}`);
        });
        page.on('request', (req) => {
          const url = req.url();
          if (/\/api\/(book-call|query|artist-path|leads)/.test(url)) apiRequests.push(`${req.method()} ${url}`);
        });

        const label = `${pageDef.route} [${viewport.name}]`;
        try {
          await page.goto(`${baseUrl}${pageDef.route}`, { waitUntil: 'load', timeout: 60000 });
        } catch (err) {
          console.log(`${label}: NAV FAIL ${err.message.slice(0, 100)}`);
          await page.close();
          continue;
        }
        // Let Wix hydrate + platform worker boot + schedule retries run.
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const state = await page.evaluate(() => {
          const nativeForm = document.querySelector('form[id^="form-"]');
          const localForm = document.querySelector('.tsc-local-form[data-tsc-form]');
          const visible = (el) => !!el && el.offsetParent !== null;
          const rect = nativeForm ? nativeForm.getBoundingClientRect() : null;
          return {
            nativeForm: !!nativeForm,
            nativeVisible: visible(nativeForm),
            nativeBound: !!(nativeForm && nativeForm.dataset.tscNativeBound),
            nativeRect: rect ? { w: Math.round(rect.width), h: Math.round(rect.height) } : null,
            localForm: !!localForm,
            localVisible: visible(localForm),
            inputs: nativeForm ? nativeForm.querySelectorAll('input, select, textarea').length : 0,
          };
        });

        let submit = null;
        if (state.nativeForm && state.nativeVisible) {
          await page.evaluate(fillScript());
          await page.evaluate(submitScript());
          await new Promise((resolve) => setTimeout(resolve, 5000));
          submit = await page.evaluate(() => {
            const feedback = document.querySelector('.native-form-feedback');
            return {
              shown: !!feedback,
              text: feedback ? feedback.textContent.trim().slice(0, 120) : '',
              state: feedback ? (feedback.classList.contains('is-success') ? 'success' : feedback.classList.contains('is-error') ? 'error' : 'other') : 'none',
            };
          });
        }

        const renderErrors = consoleErrors.filter((e) => /react_render_error/i.test(e)).length;
        const fatalErrors = consoleErrors.filter((e) => !/react_render_error/i.test(e)).length;
        console.log(JSON.stringify({
          page: pageDef.route,
          viewport: viewport.name,
          nativeForm: state.nativeForm,
          nativeVisible: state.nativeVisible,
          nativeBound: state.nativeBound,
          nativeRect: state.nativeRect,
          localForm: state.localForm,
          localVisible: state.localVisible,
          inputs: state.inputs,
          submit: submit,
          apiRequests: apiRequests.slice(0, 3),
          renderErrors,
          fatalErrors,
        }));
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
