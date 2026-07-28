const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'shell', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });

  async function probe(route) {
    await page.goto('http://127.0.0.1:3000' + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 5000));
    return page.evaluate(() => {
      const textOf = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), l: Math.round(r.left) };
      };

      // Mentor kids
      const mentors = ['#comp-mrufx9qb1', '#comp-mrufx9r8', '#comp-mrufx9rp'].map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        const kids = [...el.querySelectorAll(':scope > [id^="comp-"]')].map((k) => ({
          id: k.id,
          t: textOf(k),
          r: rect(k),
        }));
        const cs = getComputedStyle(el);
        return { sel, display: cs.display, flexDir: cs.flexDirection, kids };
      });

      // Academy mentors
      const aMentors = ['#comp-mpjwxij6', '#comp-mpjxmote', '#comp-mpjxxers6'].map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        const kids = [...el.querySelectorAll(':scope > [id^="comp-"]')].map((k) => ({
          id: k.id,
          t: textOf(k),
        }));
        return { sel, kids, flexDir: getComputedStyle(el).flexDirection };
      });

      // Feature icon+title
      const feat = ['#comp-mrufx9nc5', '#comp-mrufx9no6', '#comp-mrufx9nz3', '#comp-mrufx9oc6'].map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        const kids = [...el.children]
          .filter((c) => c.id)
          .map((k) => ({ id: k.id, t: textOf(k).slice(0, 50), r: rect(k) }));
        return { sel, flexDir: getComputedStyle(el).flexDirection, kids };
      });

      // Testimonial slides
      const slides = [...document.querySelectorAll('#comp-mrufx9t72 > .p9hNc1, .comp-mrufx9t72-container > .p9hNc1, #comp-mqwl0xfz > .p9hNc1, .comp-mqwl0xfz-container > .p9hNc1')].map((s) => {
        const cs = getComputedStyle(s);
        return {
          cls: s.className.slice(0, 40),
          display: cs.display,
          opacity: cs.opacity,
          vis: cs.visibility,
          h: Math.round(s.getBoundingClientRect().height),
          t: textOf(s).slice(0, 50),
        };
      });

      // Testimonial attribution DOM
      const tn = document.querySelector('[id^="comp-mrufx9tn"].HFEOE3, #comp-mqwl0xfz .HFEOE3');
      let attrib = null;
      if (tn) {
        attrib = {
          id: tn.id,
          kids: [...tn.children]
            .filter((c) => c.id)
            .map((k) => ({ id: k.id, t: textOf(k).slice(0, 40), r: rect(k) })),
        };
      }

      // Roadmap tiles
      const tiles = ['#comp-mrufx9we', '#comp-mrufx9w15', '#comp-mrufx9vr', '#comp-mrufx9vw3', '#comp-mqz65olf', '#comp-mqz6s6cn', '#comp-mqz6saz5', '#comp-mqz6sh3u'].map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        return { sel, w: Math.round(el.getBoundingClientRect().width), t: textOf(el).slice(0, 40) };
      });

      // COURSES title
      const title = document.querySelector('#comp-mrufx9pg1, #comp-mpjyp5wu');
      const firstCard = document.querySelector('#comp-mrufx9pp4, #comp-mrufx9pm, #comp-mpjvo1xd');
      let gap = null;
      if (title && firstCard) {
        gap = Math.round(firstCard.getBoundingClientRect().top - title.getBoundingClientRect().bottom);
      }
      const titleText = title?.querySelector('.wixui-rich-text__text, [data-testid="TextEffectsLetterPress-text"], p, h1, h2') || title;
      const titleFs = titleText ? getComputedStyle(titleText).fontSize : null;

      // UNFOLD
      const unfold = [...document.querySelectorAll('[data-text="UNFOLD"], [data-testid="TextEffectsLetterPress-text"]')]
        .slice(0, 6)
        .map((el) => ({
          t: (el.getAttribute('data-text') || textOf(el)).slice(0, 20),
          fs: getComputedStyle(el).fontSize,
          id: el.closest('[id^="comp-"]')?.id,
        }));

      // academy partner cards?
      const aFeat = ['#comp-mqwg28rw'].map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, missing: true };
        return { sel, t: textOf(el).slice(0, 80), kids: [...el.querySelectorAll('[id^="comp-"]')].slice(0, 12).map((k) => k.id) };
      });

      return {
        page: document.body.getAttribute('data-page'),
        mentors,
        aMentors,
        feat,
        slides,
        attrib,
        tiles: tiles.filter((t) => !t.missing),
        gap,
        titleFs,
        titleW: title ? Math.round(title.getBoundingClientRect().width) : null,
        cardW: firstCard ? Math.round(firstCard.getBoundingClientRect().width) : null,
        titleText: textOf(title),
        unfold,
        aFeat,
      };
    });
  }

  console.log('=== LEARN ===');
  console.log(JSON.stringify(await probe('/learn-with-tsc'), null, 2));
  console.log('=== ACADEMY ===');
  console.log(JSON.stringify(await probe('/academy'), null, 2));
  console.log('=== HOME ===');
  console.log(JSON.stringify(await probe('/'), null, 2));
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
