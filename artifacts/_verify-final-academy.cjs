const { chromium } = require('c:/Users/ragha/OneDrive/Desktop/TSC Platform/.cursor/healing-loop/node_modules/playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(4000);

  await p.evaluate(() => {
    const a = Array.from(document.querySelectorAll('[data-tsc-locked-desktop-header="true"] a')).find(
      (el) => (el.textContent || '').trim() === 'Testimonials'
    );
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
  });

  await p.waitForTimeout(1100);
  const after = await p.evaluate(() => {
    const s = document.getElementById('comp-mpl384rr');
    const m = document.getElementById('testimonials');
    const r = s.getBoundingClientRect();
    return {
      hash: location.hash,
      href: Array.from(document.querySelectorAll('[data-tsc-locked-desktop-header="true"] a'))
        .filter((a) => /Testimonials|Know More/.test((a.textContent || '').trim()))
        .map((a) => ({ t: a.textContent.trim(), h: a.getAttribute('href') })),
      markerInside: !!(m && s.contains(m)),
      secTop: Math.round(r.top),
      inView: r.top < 200 && r.bottom > 200
    };
  });
  console.log('TESTIMONIAL', after);

  await p.evaluate(() => {
    const a = Array.from(document.querySelectorAll('[data-tsc-locked-desktop-header="true"] a')).find(
      (el) => (el.textContent || '').trim() === 'Know More'
    );
    a.click();
  });
  await p.waitForTimeout(2000);
  console.log('KNOW_MORE', await p.evaluate(() => location.pathname));

  await p.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.getElementById('comp-mpl384rr').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(3000);
  const mid = await p.evaluate(() => {
    const root = document.getElementById('comp-mqwl0xfw');
    const active = root.querySelector('.p9hNc1.xjQkF3');
    return {
      anim: active ? getComputedStyle(active).animationName : null,
      name: active ? ((active.querySelector('h2') || {}).textContent || '').trim() : null,
      hasNative: !!root && getComputedStyle(root).getPropertyValue('--animation-nextIn').includes('SlideshowRepeater_slide')
    };
  });
  await p.waitForTimeout(3000);
  const mid2 = await p.evaluate(() => {
    const root = document.getElementById('comp-mqwl0xfw');
    const active = root.querySelector('.p9hNc1.xjQkF3');
    return {
      anim: active ? getComputedStyle(active).animationName : null,
      name: active ? ((active.querySelector('h2') || {}).textContent || '').trim() : null,
      transform: active ? getComputedStyle(active).transform.slice(0, 50) : null
    };
  });
  console.log('SLIDE1', mid);
  console.log('SLIDE2', mid2);
  console.log('PASS', after.inView && after.href[1].h === '/book-a-call' && mid.name !== mid2.name);

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
