const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/learn-with-tsc', { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 4000));
  const before = await p.evaluate(() => {
    const box = document.querySelector('#comp-mrufx9pg1');
    const parent = box.parentElement;
    return {
      parentClass: parent.className,
      parentW: Math.round(parent.getBoundingClientRect().width),
      parentGridCols: getComputedStyle(parent).gridTemplateColumns,
      parentMaxW: getComputedStyle(parent).maxWidth,
      boxW: Math.round(box.getBoundingClientRect().width),
    };
  });
  console.log('BEFORE', JSON.stringify(before, null, 2));
  await p.addStyleTag({
    content: [
      '#comp-mrufx9pe3 .comp-mrufx9pe3-container {',
      '  grid-template-columns: 100% !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '}',
      '#comp-mrufx9pg1 {',
      '  width: 100% !important;',
      '  max-width: none !important;',
      '  justify-self: stretch !important;',
      '  place-self: stretch !important;',
      '}',
    ].join('\n'),
  });
  await new Promise((r) => setTimeout(r, 200));
  const after = await p.evaluate(() => {
    const box = document.querySelector('#comp-mrufx9pg1');
    const parent = box.parentElement;
    const card = document.querySelector('#comp-mrufx9pp4');
    return {
      parentGridCols: getComputedStyle(parent).gridTemplateColumns,
      parentW: Math.round(parent.getBoundingClientRect().width),
      boxW: Math.round(box.getBoundingClientRect().width),
      cardW: Math.round(card.getBoundingClientRect().width),
    };
  });
  console.log('AFTER', JSON.stringify(after, null, 2));
  await b.close();
})();
