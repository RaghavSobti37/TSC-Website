'use strict';

const puppeteer = require('puppeteer');

const route = process.argv[2] || '/artist-query';

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 260));
  });
  page.on('pageerror', (err) => errors.push(`PAGEERROR: ${String(err.message || err).slice(0, 260)}`));
  await page.goto(`http://127.0.0.1:3100${route}`, { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 10000));

  const info = await page.evaluate(() => {
    const form = document.querySelector('form[id^="form-"]');
    const local = document.querySelector('.tsc-local-form[data-tsc-form]');
    const out = { hasForm: !!form, hasLocal: !!local };
    if (form) {
      out.id = form.id;
      out.bound = form.dataset.tscNativeBound || '';
      out.buttons = Array.from(form.querySelectorAll('button')).map((b) => ({
        hook: b.getAttribute('data-hook') || '',
        type: b.type,
        text: (b.textContent || '').trim().slice(0, 30),
        visible: b.offsetParent !== null,
      }));
      out.inputs = Array.from(form.querySelectorAll('input, select, textarea')).map((el) => ({
        tag: el.tagName,
        type: el.type || '',
        hook: el.closest('[data-hook]') ? el.closest('[data-hook]').getAttribute('data-hook') : '',
        visible: el.offsetParent !== null,
      })).slice(0, 20);
    }
    if (local) {
      out.localFields = local.querySelectorAll('input, select, textarea').length;
      out.localVisible = local.offsetParent !== null;
    }
    out.mountComp = !!document.querySelector('#comp-mp2w3ngp2');
    const comp = document.querySelector('#comp-mp2w3ngp2');
    if (comp) {
      out.compChildren = comp.children.length;
      out.compHidden = comp.hidden;
      out.compDisplay = comp.style.display;
      out.compText = (comp.textContent || '').trim().slice(0, 80);
    }
    return out;
  });

  console.log(JSON.stringify(info, null, 2));
  console.log('--- console errors (' + errors.length + ') ---');
  const uniq = {};
  errors.forEach((e) => { uniq[e.slice(0, 120)] = (uniq[e.slice(0, 120)] || 0) + 1; });
  Object.entries(uniq).forEach(([k, v]) => console.log(`x${v}:`, k));
  await browser.close();
})();
