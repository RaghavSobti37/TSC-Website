/**
 * Verify: desktop @1280 = original (no brand-card roles / no cream CTA polish),
 * mobile @390 = compact redesigned cards.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join('artifacts', 'brand-card-verify');
fs.mkdirSync(OUT, { recursive: true });

async function inspect(browser, url, viewport, label) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await new Promise((r) => setTimeout(r, 2000));

  const report = await page.evaluate(() => {
    const issues = [];
    const mobile = window.innerWidth <= 900;
    const roleCards = document.querySelectorAll('.tsc-brand-card');
    const roleCtas = document.querySelectorAll('.tsc-brand-card__cta, .tsc-mentor-card__cta');
    const artists = document.getElementById('comp-mr38xqqs');
    const ctaHost = document.getElementById('comp-mr35f98m');
    const eyebrow = document.getElementById('comp-mr39ngdp');
    const body = document.getElementById('comp-mr38xqr6');
    const tagCell = document.getElementById('comp-mr38xqqv2');

    function btnBg(host) {
      if (!host) return null;
      const a = host.querySelector('a.wixui-button, a.PoVCDy, .wixui-button') || host;
      return getComputedStyle(a).backgroundColor;
    }

    function innerBorderW(host) {
      if (!host) return null;
      const box = host.querySelector(':scope > .inner-box, :scope > .jdJeEr');
      if (!box) return { missing: true };
      return parseFloat(getComputedStyle(box).borderTopWidth) || 0;
    }

    const ctaBg = btnBg(ctaHost);
    const eyebrowBorder = innerBorderW(eyebrow);
    const bodyBorder = innerBorderW(body);
    const tagBorder = innerBorderW(tagCell);
    const tagRadius = tagCell ? getComputedStyle(tagCell).borderRadius : null;

    if (!mobile) {
      // Desktop must NOT have role classes or cream CTA polish
      if (roleCards.length) issues.push('desktop still has .tsc-brand-card (' + roleCards.length + ')');
      if (roleCtas.length) issues.push('desktop still has role CTAs (' + roleCtas.length + ')');
      // Cream filled button would be ~rgb(245,238,219)
      if (ctaBg && /rgb\(\s*245,\s*238,\s*219/.test(ctaBg)) {
        issues.push('desktop CTA still cream fill: ' + ctaBg);
      }
      // Secondary boxes should keep Wix borders (typically > 0)
      if (typeof eyebrowBorder === 'number' && eyebrowBorder < 0.5) {
        issues.push('desktop eyebrow border stripped');
      }
      if (typeof bodyBorder === 'number' && bodyBorder < 0.5) {
        issues.push('desktop body border stripped');
      }
    } else {
      // About has brand cards; learn/films may only have mentor CTAs
      const pathName = location.pathname || '';
      if (/about/i.test(pathName) && roleCards.length < 1) {
        issues.push('mobile missing brand cards');
      }
      if (ctaBg && !/rgb\(\s*245,\s*238,\s*219/.test(ctaBg)) {
        issues.push('mobile CTA not cream: ' + ctaBg);
      }
      if (typeof bodyBorder === 'number' && bodyBorder > 0.5) {
        issues.push('mobile body still bordered: ' + bodyBorder);
      }
      if (artists) {
        const media = artists.querySelector('.tsc-brand-card__media');
        const cta = artists.querySelector('.tsc-brand-card__cta');
        if (media && cta) {
          const mt = media.getBoundingClientRect().top;
          const ct = cta.getBoundingClientRect().top;
          if (ct < mt) issues.push('mobile CTA above media');
        }
      }
    }

    if (artists) artists.scrollIntoView({ block: 'center' });

    return {
      mobile,
      roleCards: roleCards.length,
      roleCtas: roleCtas.length,
      ctaBg,
      eyebrowBorder,
      bodyBorder,
      tagBorder,
      tagRadius,
      issues,
      viewport: window.innerWidth
    };
  });

  await new Promise((r) => setTimeout(r, 300));
  const shot = path.join(OUT, label + '.png');
  await page.screenshot({ path: shot, fullPage: false });
  await page.close();
  return { label, report, shot };
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];
  for (const job of [
    ['http://127.0.0.1:3000/about', { width: 1280, height: 900 }, 'about-desktop'],
    ['http://127.0.0.1:3000/about', { width: 390, height: 844, deviceScaleFactor: 2 }, 'about-390'],
    ['http://127.0.0.1:3000/learn-with-tsc', { width: 390, height: 844, deviceScaleFactor: 2 }, 'learn-390'],
    ['http://127.0.0.1:3000/films', { width: 1280, height: 900 }, 'films-desktop']
  ]) {
    try {
      results.push(await inspect(browser, job[0], job[1], job[2]));
    } catch (e) {
      results.push({ label: job[2], error: String(e) });
    }
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  const bad = results.some((r) => r.error || (r.report && r.report.issues.length));
  process.exit(bad ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
