const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
(async () => {
  const b = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844 });
  await p.goto('http://127.0.0.1:3000/artist-path', { waitUntil: 'load', timeout: 90000 });
  await new Promise(r => setTimeout(r, 2500));

  const d = await p.evaluate(() => {
    const icon = document.querySelector('#comp-mqpa1hfr [id^="comp-mqpakzhh"]');
    const tile = document.querySelector('[id^="comp-mqpa1hg0"]');
    const starts = [...document.querySelectorAll('#comp-mqpa1hfr [data-testid="richTextElement"]')]
      .find((el) => /STARTS/.test(el.innerText || ''));
    const august = [...document.querySelectorAll('#comp-mqpa1hfr [data-testid="richTextElement"]')]
      .find((el) => /August/.test(el.innerText || ''));

    const lineCount = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el.querySelector('.wixui-rich-text__text') || el);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      return Math.round(el.getBoundingClientRect().height / lh);
    };

    const secs = ['comp-mqph76vq', 'comp-mqpigrr6', 'comp-mqqgqawi', 'comp-mqqg5lnm', 'comp-mqpa1hfr', 'comp-mqphxnu3'].map((id) => {
      const el = document.getElementById(id);
      if (!el) return { id, missing: true };
      const r = el.getBoundingClientRect();
      return { id, h: Math.round(r.height), y: Math.round(r.top + window.scrollY) };
    });

    const leaf = ['comp-mqqsoamd', 'comp-mqqsp2xj', 'comp-mqqulh8m'].map((id) => {
      const el = document.getElementById(id);
      const r = el.getBoundingClientRect();
      return { id, w: Math.round(r.width), left: Math.round(r.left) };
    });

    return {
      iconW: icon ? Math.round(icon.getBoundingClientRect().width) : null,
      tileH: tile ? Math.round(tile.getBoundingClientRect().height) : null,
      startsLines: lineCount(starts),
      augustLines: lineCount(august),
      startsW: starts ? Math.round(starts.getBoundingClientRect().width) : null,
      secs,
      leaf,
      pathOverlaps: (() => {
        const el = document.getElementById('comp-mqph76vq');
        const content = el.querySelector('[data-testid="responsive-container-content"]');
        const kids = [...content.children].filter((k) => k.id && getComputedStyle(k).display !== 'none');
        let n = 0;
        for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 12 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 12) n++;
        }
        return n;
      })(),
      whyOverlaps: (() => {
        const el = document.getElementById('comp-mqpigrr6');
        const content = el.querySelector('[data-testid="responsive-container-content"]');
        const kids = [...content.children].filter((k) => k.id && getComputedStyle(k).display !== 'none');
        let n = 0;
        for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
          const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 12 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 12) n++;
        }
        return n;
      })(),
      scrollH: document.documentElement.scrollHeight,
      scrollW: document.documentElement.scrollWidth,
    };
  });

  console.log(JSON.stringify(d, null, 2));

  // crop key sections from latest shot if exists, else skip
  const shot = path.join(__dirname, 'ma3-artist-path.png');
  try {
    const meta = await sharp(shot).metadata();
    for (const s of d.secs) {
      if (!s.y && s.y !== 0) continue;
      const top = Math.max(0, s.y);
      const h = Math.min(Math.max(s.h, 80), 800, meta.height - top);
      await sharp(shot).extract({ left: 0, top, width: 390, height: h }).toFile(path.join(__dirname, `ma3-${s.id}.png`));
    }
    console.log('crops ok');
  } catch (e) {
    console.log('crop skip', e.message);
  }

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
