const { chromium } = require('c:/Users/ragha/OneDrive/Desktop/TSC Platform/.cursor/healing-loop/node_modules/playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle', timeout: 60000 });
  await p.evaluate(() => {
    try {
      sessionStorage.clear();
    } catch (e) {}
  });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);

  const anchors = await p.evaluate(() => ({
    testimonials: !!document.getElementById('testimonials'),
    courses: !!document.getElementById('courses'),
    nav: Array.from(document.querySelectorAll('a'))
      .filter((a) => /^(Testimonials|Know More)$/i.test((a.textContent || '').trim()))
      .slice(0, 4)
      .map((a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
  }));
  console.log('ANCHORS', JSON.stringify(anchors, null, 2));

  // Click Testimonials
  const beforeY = await p.evaluate(() => window.scrollY);
  await p.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a')).find(
      (el) => (el.textContent || '').trim() === 'Testimonials' && (el.getAttribute('href') || '').indexOf('testimonials') !== -1
    );
    if (a) a.click();
  });
  await p.waitForTimeout(1200);
  const afterTestimonial = await p.evaluate(() => {
    const sec = document.getElementById('comp-mpl384rr');
    const r = sec ? sec.getBoundingClientRect() : null;
    return {
      y: Math.round(window.scrollY),
      hash: location.hash,
      secTop: r ? Math.round(r.top) : null,
      inView: r ? r.top < window.innerHeight && r.bottom > 80 : false
    };
  });
  console.log('AFTER_TESTIMONIAL_CLICK', { beforeY, ...afterTestimonial });

  // Know More -> book-a-call
  await p.evaluate(() => {
    const a = Array.from(document.querySelectorAll('a')).find(
      (el) => (el.textContent || '').trim() === 'Know More' && (el.getAttribute('href') || '').indexOf('book-a-call') !== -1
    );
    if (a) a.click();
  });
  await p.waitForTimeout(2500);
  console.log('AFTER_KNOW_MORE', await p.evaluate(() => location.pathname));

  // Back to academy for slide anim
  await p.goto('http://127.0.0.1:3000/academy', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => {
    const sec = document.getElementById('comp-mpl384rr');
    if (sec) sec.scrollIntoView({ block: 'center' });
  });

  const samples = [];
  for (let i = 0; i < 4; i++) {
    await p.waitForTimeout(2800);
    samples.push(
      await p.evaluate(() => {
        const root = document.getElementById('comp-mqwl0xfw');
        const slides = Array.from(root.querySelectorAll('.p9hNc1')).map((el, idx) => {
          const nameEl = el.querySelector('h2');
          return {
            idx,
            name: nameEl ? nameEl.textContent.trim() : '',
            xj: el.classList.contains('xjQkF3'),
            fab: el.classList.contains('fABPvj'),
            vis: getComputedStyle(el).visibility,
            op: Number(getComputedStyle(el).opacity).toFixed(2),
            transform: getComputedStyle(el).transform.slice(0, 40),
            anim: getComputedStyle(el).animationName
          };
        });
        return {
          rootCls: String(root.className),
          animDur: getComputedStyle(root).getPropertyValue('--animation-duration').trim(),
          slides
        };
      })
    );
  }
  console.log('SLIDES', JSON.stringify(samples, null, 2));

  const namesSeen = new Set();
  samples.forEach((s) => s.slides.filter((x) => x.xj && x.vis === 'visible').forEach((x) => namesSeen.add(x.name)));
  console.log('NAMES_SEEN', [...namesSeen]);
  console.log(
    'HAS_SLIDE_ANIM',
    samples.some((s) => s.slides.some((x) => String(x.anim).indexOf('SlideshowRepeater') !== -1))
  );

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
