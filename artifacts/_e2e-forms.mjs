import puppeteer from 'puppeteer';

const BASE = process.argv[2] || 'http://127.0.0.1:3000';
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  defaultViewport: { width: 1280, height: 1800 },
});

const results = [];

async function openPage(path, wait = 6000) {
  const page = await browser.newPage();
  const posts = [];
  page.on('request', (r) => {
    if (r.method() === 'POST' && /\/api\//.test(r.url())) posts.push({ url: r.url().replace(BASE, ''), body: r.postData() || '' });
  });
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, wait));
  return { page, posts };
}

async function setVal(page, selector, value) {
  return page.evaluate(({ selector, value }) => {
    const el = document.querySelector(selector);
    if (!el) return 'missing:' + selector;
    try {
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set.call(el, value);
    } catch (e) {
      el.value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return 'set';
  }, { selector, value });
}

async function clickBtnText(page, text) {
  return page.evaluate(({ text }) => {
    const btn = [...document.querySelectorAll('button')].find((b) => (b.innerText || '').trim() === text && b.offsetParent !== null);
    if (!btn) return 'no-btn:' + text;
    btn.click();
    return 'clicked:' + text;
  }, { text });
}

async function submitOf(page, formSel) {
  return page.evaluate(({ formSel }) => {
    const form = document.querySelector(formSel);
    if (!form) return 'no-form';
    const btn = [...form.querySelectorAll('button')].find((b) => /submit/i.test(b.innerText || b.getAttribute('aria-label') || ''));
    if (!btn) return 'no-submit-in-form';
    btn.click();
    return 'clicked-submit';
  }, { formSel });
}

// ---------- book-a-call ----------
{
  const { page, posts } = await openPage('/book-a-call');
  await setVal(page, '[data-hook="form-field-first_name_e937"] input', 'Test');
  await setVal(page, '[data-hook="form-field-last_name_24e1"] input', 'User');
  await setVal(page, '[data-hook="form-field-phone_9f79"] input', '9876543210');
  await setVal(page, '[data-hook="form-field-email_3810"] input', 'e2e@test.local');
  await page.evaluate(() => {
    const first = document.querySelector('[data-hook="form-field-which_course_are_you_interested_in"] label');
    if (first) first.click();
  });
  await page.evaluate(() => {
    const inp = document.querySelector('.native-hidden-date-picker');
    if (inp) {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inp, '2026-08-20');
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await setVal(page, '[data-hook="hours"]', '11');
  await setVal(page, '[data-hook="minutes"]', '30');
  const submit = await clickBtnText(page, 'Submit');
  await new Promise((r) => setTimeout(r, 4000));
  const feedback = await page.evaluate(() => document.body.innerText.match(/(Submitted ✓|thank you[^.!?\n]*|success[^.!?\n]*|please enter[^.!?\n]*|please select[^.!?\n]*)/i)?.[0]?.slice(0, 70) || '(none)');
  results.push({ label: 'book-a-call', submit, posts, feedback });
  await page.close();
}

// ---------- book-an-artist ----------
{
  const { page, posts } = await openPage('/book-an-artist');
  await setVal(page, '[data-hook="form-field-first_name_e937"] input', 'Test User');
  await setVal(page, '[data-hook="form-field-organisation_name"] input', 'Test Org');
  await setVal(page, '[data-hook="form-field-email_3810"] input', 'e2e@test.local');
  await setVal(page, '[data-hook="form-field-phone_9f79"] input', '9876543210');
  await page.evaluate(() => {
    const dd = document.querySelector('[data-hook="form-field-type_of_engagement"]');
    const trigger = dd && (dd.querySelector('[role="combobox"]') || dd.querySelector('button, [tabindex]'));
    if (trigger) trigger.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  const picked = await page.evaluate(() => {
    const menu = document.querySelector('.native-dropdown-menu');
    if (!menu) return 'no-menu';
    const opt = [...menu.querySelectorAll('div, li, button')].find((o) => o.textContent.trim() === 'Live Performance');
    (opt || menu.querySelector('div, li, button'))?.click();
    return opt ? 'picked-live-performance' : 'picked-first';
  });
  await page.evaluate(() => {
    const radio = document.querySelector('[data-hook="form-field-select_artist_talent"] label');
    if (radio) radio.click();
  });
  const submit = await clickBtnText(page, 'Submit');
  await new Promise((r) => setTimeout(r, 4000));
  const feedback = await page.evaluate(() => document.body.innerText.match(/(Submitted ✓|thank you[^.!?\n]*|please enter[^.!?\n]*)/i)?.[0]?.slice(0, 70) || '(none)');
  results.push({ label: 'book-an-artist', picked, submit, posts, feedback });
  await page.close();
}

// ---------- artist-query (multi-step) ----------
{
  const { page, posts } = await openPage('/artist-query');
  const step1 = {
    'first_name_c985': 'Test', 'last_name_2463': 'User', 'where_are_you_based': 'Mumbai',
    'mobile_no': '9876543210', 'email_6410': 'e2e@test.local', 'stage_name': 'TestStage',
    'digial_footprint': 'https://instagram.com/test',
  };
  for (const [hook, val] of Object.entries(step1)) {
    await setVal(page, `[data-hook="form-field-${hook}"] input`, val);
  }
  await clickBtnText(page, 'Next');
  await new Promise((r) => setTimeout(r, 1200));
  // fill whatever page 2 shows (textareas/inputs by aria-label fallback)
  const filled2 = await page.evaluate(() => {
    const done = [];
    document.querySelectorAll('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([type="date"]), textarea').forEach((el) => {
      if (el.offsetParent === null) return;
      if (el.value) return;
      const aria = el.getAttribute('aria-label') || '';
      let v = 'Test answer';
      if (/email/i.test(aria)) v = 'e2e@test.local';
      if (/mobile|phone/i.test(aria)) v = '9876543210';
      try { Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set.call(el, v); } catch (e) { el.value = v; }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      done.push((aria || el.tagName).slice(0, 25));
    });
    return done;
  });
  const submit = await clickBtnText(page, 'Submit');
  await new Promise((r) => setTimeout(r, 4000));
  results.push({ label: 'artist-query', filled2, submit, posts });
  await page.close();
}

// ---------- collab-query (local form) ----------
{
  const { page, posts } = await openPage('/collab-query');
  await page.evaluate(() => { const r = document.querySelector('#tsc-collabQuery-i-am-a-0'); if (r) r.click(); });
  await setVal(page, '#tsc-collabQuery-full-name', 'Test User');
  await setVal(page, '#tsc-collabQuery-organization', 'Test Org');
  await setVal(page, '#tsc-collabQuery-email-address', 'e2e@test.local');
  await setVal(page, '#tsc-collabQuery-contact-number', '9876543210');
  await page.evaluate(() => {
    const sel = document.querySelector('#tsc-collabQuery-collaboration-type');
    if (sel) {
      sel.value = sel.options[1] ? sel.options[1].value : sel.options[0].value;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await setVal(page, '#tsc-collabQuery-how-can-we-collaborate', 'Test collab idea');
  const submit = await submitOf(page, '.tsc-local-form');
  await new Promise((r) => setTimeout(r, 4000));
  const feedback = await page.evaluate(() => document.body.innerText.match(/(Submitted ✓|success|thank you)[^.!?\n]*/i)?.[0]?.slice(0, 70) || '(none)');
  results.push({ label: 'collab-query', submit, posts, feedback });
  await page.close();
}

// ---------- affiliate (local form) ----------
{
  const { page, posts } = await openPage('/affiliate');
  const filled = await page.evaluate(() => {
    const done = [];
    document.querySelectorAll('.tsc-local-form input:not([type="checkbox"]):not([type="radio"]):not([type="date"]):not([type="hidden"]), .tsc-local-form textarea, .tsc-local-form select').forEach((el) => {
      const label = (el.closest('label')?.innerText || el.name || el.placeholder || '').toLowerCase();
      let value = null;
      if (/name/.test(label)) value = 'Test User';
      else if (/email/.test(label)) value = 'e2e@test.local';
      else if (/phone|mobile|whatsapp/.test(label)) value = '9876543210';
      else if (/website|social|why|about/.test(label)) value = 'https://example.com — test answer';
      if (value !== null) {
        const P = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
        const setter = Object.getOwnPropertyDescriptor(P, 'value').set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        done.push(label.slice(0, 22));
      }
    });
    return done;
  });
  const submit = await submitOf(page, '.tsc-local-form');
  await new Promise((r) => setTimeout(r, 4000));
  const feedback = await page.evaluate(() => document.body.innerText.match(/(Submitted ✓|success|thank you|onboarding)[^.!?\n]*/i)?.[0]?.slice(0, 70) || '(none)');
  results.push({ label: 'affiliate', filled, submit, posts, feedback });
  await page.close();
}

// ---------- reviews ----------
for (const [path, label] of [['/masterclass-review01', 'masterclass-review01'], ['/masterclass-review02', 'masterclass-review02']]) {
  const { page, posts } = await openPage(path, 5000);
  const filled = await page.evaluate(() => {
    const done = [];
    const map = {
      'first-name': 'Test', 'last-name': 'User', 'registered-email': 'e2e@test.local',
      'registered-mobile-number': '9876543210',
      'describe-your-experience-of-the-masterclass': 'Great masterclass, very insightful!',
      'what-should-we-improve-in-this-recorded-masterclass': 'More practice examples please.',
    };
    for (const [name, val] of Object.entries(map)) {
      const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
      if (el) {
        const P = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(P, 'value').set.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        done.push(name);
      }
    }
    // pick first radio in each group + first checkbox in each group
    const groups = {};
    document.querySelectorAll('input[type="radio"]').forEach((r) => { (groups[r.name] = groups[r.name] || []).push(r); });
    for (const g of Object.values(groups)) g[0].click();
    document.querySelectorAll('input[type="checkbox"]').forEach((c) => { if (!c.checked) c.click(); });
    return done;
  });
  const submit = await clickBtnText(page, 'Submit');
  await new Promise((r) => setTimeout(r, 4000));
  results.push({ label, filled, submit, posts });
  await page.close();
}

// ---------- newsletter footer ----------
{
  const page = await browser.newPage();
  const posts = [];
  page.on('request', (r) => { if (r.method() === 'POST' && /\/api\//.test(r.url())) posts.push({ url: r.url().replace(BASE, ''), body: r.postData() || '' }); });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));
  const emailSet = await page.evaluate(() => {
    const el = [...document.querySelectorAll('input[type="email"]')].find((x) => x.offsetParent !== null);
    if (!el) return 'no-email';
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, 'newsletter@test.local');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return 'email-set';
  });
  await new Promise((r) => setTimeout(r, 300));
  const clicked = await page.evaluate(() => {
    const form = [...document.querySelectorAll('input[type="email"]')].find((x) => x.offsetParent !== null)?.closest('form');
    if (!form) return 'no-form';
    const btn = form.querySelector('button, [role="button"], input[type="submit"]');
    if (!btn) return 'no-btn-in-form';
    btn.click();
    return 'clicked';
  });
  await new Promise((r) => setTimeout(r, 3000));
  results.push({ label: 'newsletter (footer)', emailSet, clicked, posts });
  await page.close();
}

for (const r of results) {
  console.log('=== ' + r.label + ' ===');
  console.log(JSON.stringify(r, null, 1));
}
await browser.close();
