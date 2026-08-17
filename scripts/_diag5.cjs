'use strict';

// Diagnose artist-query (multi-step native form) and collab-query (local form)
// submission flows on desktop + mobile.

const puppeteer = require('puppeteer');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseUrl = 'http://127.0.0.1:3100';

function setVal(el, value) {
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}

async function fillNativeStep(form, stepIndex) {
  // fill visible inputs in current step
  const filled = await form.evaluate((step) => {
    const formEl = document.querySelector('form[id^="form-"]');
    if (!formEl) return { ok: false };
    const steps = formEl.querySelectorAll('[data-hook="form-wizard-step"]');
    let count = 0;
    const doSet = (el, value) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const scope = steps.length > step ? steps[step] : formEl;
    scope.querySelectorAll('input[type="text"], input:not([type]), input[type="email"], input[type="tel"], textarea, input[type="url"]').forEach((el) => {
      if (!el.value && el.offsetParent !== null) {
        const isMobile = /mobile|phone/i.test(el.getAttribute('aria-label') || '') || /mobile|phone/i.test(el.getAttribute('placeholder') || '');
        const v = el.type === 'email' ? 'test+form@example.com' : isMobile || el.type === 'tel' ? '9876543210' : el.type === 'url' ? 'https://example.com' : 'Test User';
        doSet(el, v);
        count += 1;
      }
    });
    return { ok: true, filled: count, totalSteps: steps.length };
  });
  return filled;
}

async function clickNativeButton(form, hook) {
  return form.evaluate((h) => {
    const formEl = document.querySelector('form[id^="form-"]');
    if (!formEl) return false;
    const btn = formEl.querySelector('button[data-hook="' + h + '"]');
    if (!btn) return false;
    btn.click();
    return true;
  }, hook);
}

async function goto(page, url) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  } catch (e) {
    console.log('nav timeout (continuing):', e.message.slice(0, 80));
  }
}

async function testArtistQuery(page, viewportName, apiRequests) {
  await goto(page, `${baseUrl}/artist-query`);
  await new Promise((r) => setTimeout(r, 12000));
  const state = await page.evaluate(() => {
    const f = document.querySelector('form[id^="form-"]');
    if (!f) return { nativeForm: false };
    const steps = f.querySelectorAll('[data-hook="form-wizard-step"]');
    const btns = [...f.querySelectorAll('button')].map((b) => b.getAttribute('data-hook') || b.textContent.trim().slice(0, 30));
    return { nativeForm: true, steps: steps.length, btns: btns.slice(0, 10) };
  });
  console.log(`artist-query [${viewportName}] state:`, JSON.stringify(state));

  if (!state.nativeForm) return { state };
  // fill step by step; look for next/submit buttons
  let result = { stepsTried: 0 };
  for (let i = 0; i < 6; i++) {
    const filled = await fillNativeStep(page, i);
    const next = await clickNativeButton(page, 'next-button');
    const submit = await clickNativeButton(page, 'submit-button');
    result.stepsTried = i + 1;
    if (submit) { result.submitted = true; break; }
    if (!next && !submit) break;
    await new Promise((r) => setTimeout(r, 800));
  }
  await new Promise((r) => setTimeout(r, 5000));
  const feedback = await page.evaluate(() => {
    const fb = document.querySelector('.native-form-feedback');
    return fb ? { text: fb.textContent.trim().slice(0, 120), state: fb.classList.contains('is-success') ? 'success' : fb.classList.contains('is-error') ? 'error' : 'other' } : null;
  });
  result.feedback = feedback;
  result.apiRequests = apiRequests.slice(0, 3);
  return { state, result };
}

async function testCollabLocal(page, viewportName, apiRequests) {
  await goto(page, `${baseUrl}/collab-query`);
  await new Promise((r) => setTimeout(r, 12000));
  const state = await page.evaluate(() => {
    const local = document.querySelector('.tsc-local-form[data-tsc-form]');
    const native = document.querySelector('form[id^="form-"]');
    if (!local) return { localForm: false, nativeForm: !!native };
    return {
      localForm: true,
      name: local.getAttribute('data-tsc-form'),
      visible: local.offsetParent !== null,
      fields: [...local.querySelectorAll('input, select, textarea')].map((el) => ({ type: el.type || el.tagName.toLowerCase(), name: el.name || el.getAttribute('data-label') || '', req: el.required })),
    };
  });
  console.log(`collab-query [${viewportName}] state:`, JSON.stringify(state));
  if (!state.localForm) return { state };

  await page.evaluate(() => {
    const form = document.querySelector('.tsc-local-form[data-tsc-form]');
    const doSet = (el, value) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    form.querySelectorAll('input[type="text"], input:not([type]), input[type="email"], input[type="tel"], textarea').forEach((el) => {
      if (!el.value) doSet(el, el.type === 'email' ? 'test+form@example.com' : el.type === 'tel' ? '9876543210' : 'Test User');
    });
    // Mobile/phone fields: Wix sanitizer only accepts digits
    form.querySelectorAll('input[aria-label*="Mobile"], input[aria-label*="Phone"], input[data-hook*="phone"]').forEach((el) => {
      if (el.value && /\D/.test(el.value)) { doSet(el, '9876543210'); }
    });
    const sel = form.querySelector('select');
    if (sel && !sel.value) { sel.value = sel.options[1].value; sel.dispatchEvent(new Event('change', { bubbles: true })); }
    const radio = form.querySelector('input[type="radio"]');
    if (radio && !radio.checked) { radio.checked = true; radio.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  await new Promise((r) => setTimeout(r, 500));

  const btnInfo = await page.evaluate(() => {
    const form = document.querySelector('.tsc-local-form[data-tsc-form]');
    const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    return { found: !!btn, text: btn ? btn.textContent.trim().slice(0, 40) : '' };
  });
  if (btnInfo.found) {
    await page.evaluate(() => {
      const form = document.querySelector('.tsc-local-form[data-tsc-form]');
      (form.querySelector('button[type="submit"]') || form.querySelector('button')).click();
    });
  }
  await new Promise((r) => setTimeout(r, 5000));
  const feedback = await page.evaluate(() => {
    const fb = document.querySelector('.tsc-form-feedback, .native-form-feedback, .form-feedback');
    return fb ? { text: fb.textContent.trim().slice(0, 120), cls: fb.className } : null;
  });
  return { state, btnInfo, feedback, apiRequests: apiRequests.slice(0, 3) };
}

async function main() {
  const browser = await puppeteer.launch({ headless: true, executablePath: chromePath });
  try {
    for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });
      const apiRequests = [];
      const consoleErrors = [];
      page.on('request', (req) => { if (/\/api\/(book-call|query|artist-path|leads)/.test(req.url())) apiRequests.push(`${req.method()} ${req.url()}`); });
      page.on('pageerror', (err) => consoleErrors.push(String(err.message || err).slice(0, 150)));
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 150)); });

      const r1 = await testArtistQuery(page, vp.name, apiRequests);
      console.log(`artist-query [${vp.name}] result:`, JSON.stringify(r1.result));
      const r2 = await testCollabLocal(page, vp.name, apiRequests);
      console.log(`collab-query [${vp.name}] result:`, JSON.stringify({ btnInfo: r2.btnInfo, feedback: r2.feedback, apiRequests: r2.apiRequests }));
      console.log(`consoleErrors [${vp.name}]:`, JSON.stringify(consoleErrors.slice(0, 6)));
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
