'use strict';

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  const failed = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 220));
  });
  page.on('requestfailed', (req) => failed.push(`${req.failure() && req.failure().errorText}: ${req.url().slice(0, 140)}`));
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()}: ${res.url().slice(0, 140)}`);
  });
  await page.goto('http://127.0.0.1:3100/collab-query', { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 18000));

  const info = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll('[id^="comp-"]')).map((el) => el.id);
    const section = document.querySelector('[id^="comp-"]');
    return {
      compCount: ids.length,
      comps: ids.slice(0, 40),
      mainText: (document.querySelector('main') || {}).textContent
        ? document.querySelector('main').textContent.trim().slice(0, 150)
        : 'no main',
      forms: document.querySelectorAll('form').length,
      formIds: Array.from(document.querySelectorAll('form')).map((f) => f.id || f.className).slice(0, 5),
      bodyLen: document.body.innerHTML.length,
    };
  });

  console.log(JSON.stringify(info, null, 2));
  console.log('--- errors ---');
  const uniq = {};
  errors.forEach((e) => { uniq[e.slice(0, 110)] = (uniq[e.slice(0, 110)] || 0) + 1; });
  Object.entries(uniq).forEach(([k, v]) => console.log(`x${v}:`, k));
  console.log('--- failed requests ---');
  const fu = {};
  failed.forEach((f) => { fu[f.slice(0, 130)] = (fu[f.slice(0, 130)] || 0) + 1; });
  Object.entries(fu).slice(0, 20).forEach(([k, v]) => console.log(`x${v}:`, k));
  await browser.close();
})();
