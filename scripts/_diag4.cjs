'use strict';

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const requests = [];
  page.on('request', (req) => {
    const url = req.url();
    if (/form|_api|cloud-data|ooi|widget/i.test(url) && !/\.(png|jpg|jpeg|webp|gif|svg|woff|woff2|css)/i.test(url)) {
      requests.push(`${req.resourceType()} ${url.slice(0, 150)}`);
    }
  });
  await page.goto('http://127.0.0.1:3100/collab-query', { waitUntil: 'load', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 18000));
  const uniq = {};
  requests.forEach((r) => { uniq[r] = (uniq[r] || 0) + 1; });
  console.log('--- form/widget/api requests ---');
  Object.entries(uniq).slice(0, 40).forEach(([k, v]) => console.log(`x${v}:`, k));
  const state = await page.evaluate(() => ({
    forms: document.querySelectorAll('form').length,
    formIds: Array.from(document.querySelectorAll('form')).map((f) => f.id || f.className).slice(0, 4),
    localFormVisible: (() => { const lf = document.querySelector('.tsc-local-form[data-tsc-form="collabQuery"]'); return !!lf && lf.offsetParent !== null; })(),
    sectionHasChildren: (() => { const s = document.querySelector('#comp-mp2w3ngp2'); return s ? s.children.length : -1; })(),
    sectionText: (() => { const s = document.querySelector('#comp-mp2w3ngp2'); return s ? (s.textContent || '').trim().slice(0, 60) : 'none'; })(),
  }));
  console.log('--- state ---');
  console.log(JSON.stringify(state, null, 2));
  await browser.close();
})();
