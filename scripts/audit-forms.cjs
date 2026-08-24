const puppeteer = require('puppeteer');

const baseUrl = process.argv[2] || 'http://127.0.0.1:3100';

const forms = [
  { route: '/artist-query', form: 'artistPath', endpoint: '/api/artist-path' },
  { route: '/book-a-call', form: 'bookCall', endpoint: '/api/book-call' },
  { route: '/book-an-artist', form: 'bookArtist', endpoint: '/api/query' },
  { route: '/collab-query', form: 'collabQuery', endpoint: '/api/leads' },
  { route: '/affiliate-apply', form: 'affiliateApp', endpoint: '/api/leads' },
  { route: '/masterclass-review01', form: 'review01', endpoint: '/api/reviews' },
  { route: '/masterclass-review02', form: 'review02', endpoint: '/api/reviews02' },
  { route: '/classicalreview', form: 'classicalReview', endpoint: '/api/reviews' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 900, isMobile: true },
];

async function waitReady(page) {
  await page.waitForFunction(() => document.body && document.body.innerText.trim().length > 0, { timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 3500));
}

async function fillAndSubmit(page, expectedForm) {
  return page.evaluate(async (expectedFormName) => {
    const visible = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 1 && rect.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const setValue = (el, value) => {
      const proto =
        el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype :
          el.tagName === 'SELECT' ? HTMLSelectElement.prototype :
            HTMLInputElement.prototype;
      const desc = Object.getOwnPropertyDescriptor(proto, 'value');
      if (desc && desc.set) desc.set.call(el, value);
      else el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const form =
      document.querySelector(`.tsc-local-form[data-tsc-form="${expectedFormName}"]`) ||
      document.querySelector('.tsc-local-form[data-tsc-form]') ||
      document.querySelector('form[id^="form-"]');
    if (!form || !visible(form)) return { ok: false, reason: 'no-visible-form' };

    const requests = [];
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      const href = String(url && url.url ? url.url : url);
      if (/\/api\//.test(href)) {
        requests.push({ url: href, body: options && options.body ? String(options.body).slice(0, 500) : '' });
        return new Response(JSON.stringify({ success: true, message: 'Audit submitted', leadId: 'audit-1' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return originalFetch(url, options);
    };

    form.querySelectorAll('input, textarea, select').forEach((el) => {
      if (el.disabled || el.type === 'hidden') return;
      if (el.type === 'radio' || el.type === 'checkbox') {
        const group = el.name || el.value || Math.random().toString();
        if (!form.__checkedGroups) form.__checkedGroups = {};
        if (form.__checkedGroups[group]) return;
        form.__checkedGroups[group] = true;
        el.checked = true;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        const wrapper = el.closest('.tsc-choice, .siroRCe, [data-hook="box-selection-option-wrapper"]');
        if (wrapper) wrapper.setAttribute('data-checked', 'true');
        return;
      }
      if (el.tagName === 'SELECT') {
        const option = Array.from(el.options).find((item) => item.value && !item.disabled);
        if (option) setValue(el, option.value);
        return;
      }
      const aria = String(el.getAttribute('aria-label') || '');
      const mode = String(el.getAttribute('inputmode') || '');
      if (el.type === 'email' || /email/i.test(aria)) setValue(el, 'audit+forms@example.com');
      else if (el.type === 'tel' || mode === 'tel' || /phone|mobile|contact/i.test(aria)) setValue(el, '9876543210');
      else if (el.type === 'url') setValue(el, 'https://example.com');
      else if (el.type === 'date') setValue(el, '2026-09-15');
      else if (el.type === 'time') setValue(el, '15:00');
      else if (el.type === 'number') setValue(el, '3');
      else setValue(el, el.tagName === 'TEXTAREA' ? 'Audit message for form verification.' : 'Audit User');
    });

    for (let i = 0; i < 4; i += 1) {
      const next = form.querySelector('.tsc-form-step:not([hidden]) .tsc-next-btn');
      if (!next || !visible(next)) break;
      next.click();
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const submit =
      form.querySelector('.tsc-form-step:not([hidden]) [type="submit"]') ||
      form.querySelector('button[data-hook="submit-button"], button[type="submit"], [type="submit"]');
    if (!submit || !visible(submit)) return { ok: false, reason: 'no-visible-submit', form: form.dataset.tscForm || form.id || '' };
    submit.click();
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const note = form.querySelector('.tsc-form-note, .native-form-feedback');
    const successPanel = document.querySelector('.tsc-artist-path-result');
    return {
      ok: true,
      form: form.dataset.tscForm || form.id || '',
      requests,
      note: note ? note.textContent.trim().slice(0, 120) : '',
      successPanel: !!successPanel,
    };
  }, expectedForm);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  });
  const failures = [];
  try {
    for (const item of forms) {
      for (const viewport of viewports) {
        const page = await browser.newPage();
        await page.setViewport({ deviceScaleFactor: 1, ...viewport });
        await page.goto(`${baseUrl}${item.route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await waitReady(page);
        const result = await fillAndSubmit(page, item.form);
        const hit = (result.requests || []).some((req) => req.url.includes(item.endpoint));
        const successNote = /updated|submitted|success|audit submitted|booked|received|queued/i.test(result.note || '');
        const nativeNoError = /^form-/.test(result.form || '') && !/required|failed|error/i.test(result.note || '');
        const passed = result.ok && (hit || result.successPanel || successNote || nativeNoError);
        console.log(`${passed ? 'PASS' : 'FAIL'}\t${item.route}\t${viewport.name}\tform=${result.form || ''}\trequests=${(result.requests || []).map((req) => req.url).join(',')}\t${result.reason || result.note || ''}`);
        if (!passed) failures.push({ item, viewport: viewport.name, result });
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }
})();
