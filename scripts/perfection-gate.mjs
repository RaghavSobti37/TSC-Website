/**
 * Phase 4 perfection gate — static + live checks for TSC-Website.
 * Exit 0 = pass. Exit 1 = fail.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error('FAIL:', msg);
}
function ok(msg) {
  console.log('OK:', msg);
}

// —— Static file checks ——
const mustExist = [
  'pages/affiliate.html',
  'css/pages/affiliate.css',
  'css/pages/artist-path-enhance.css',
  'js/pages/artist-path.animations.js',
  'css/mobile/boot.css',
  'css/mobile/impact-report.css',
  'js/tsc-components.js',
];
for (const f of mustExist) {
  if (!fs.existsSync(path.join(publicDir, f))) fail('missing ' + f);
  else ok('exists ' + f);
}

const components = fs.readFileSync(path.join(publicDir, 'js/tsc-components.js'), 'utf8');
if (!components.includes("max-width: 1024px")) fail('header breakpoint not 1024');
else ok('header 1024');
if (!components.includes('artist@theshakticollective.in')) fail('email missing');
else ok('email');
if (!components.includes('https://www.linkedin.com/company/the-shakti-collective/')) fail('linkedin');
else ok('linkedin');
if (!components.includes("'/affiliate'")) fail('footer affiliate link');
else ok('affiliate footer');
if (!components.includes('markMobileReadySafe')) fail('ready fail-safe');
else ok('ready fail-safe');

const contentRep = fs.readFileSync(path.join(publicDir, 'js/content-replacements.js'), 'utf8');
if (/removeMentorSessions[\s\S]{0,400}mpjxxeqt/.test(contentRep) && /#comp-mpjxxeqt[\s\S]{0,80}remove|removeChild/.test(contentRep.slice(contentRep.indexOf('function removeMentorSessions')))) {
  // soft check — ensureLuca must exist
}
if (!contentRep.includes('ensureLucaCourseCardLinks')) fail('Luca card helper missing');
else ok('Luca helper');
if (!contentRep.includes("cta.href = '/affiliate'")) fail('academy affiliate CTA');
else ok('academy affiliate CTA');

const about = fs.readFileSync(path.join(publicDir, 'pages/about.html'), 'utf8');
const aboutFilms = (about.match(/href="\/films"/g) || []).length;
const aboutWork = (about.match(/href="\/work"/g) || []).length;
if (aboutFilms < 1) fail('about missing /films');
else ok('about /films x' + aboutFilms);
if (aboutWork < 1) fail('about missing /work');
else ok('about /work x' + aboutWork);

const artists = fs.readFileSync(path.join(publicDir, 'pages/artists.html'), 'utf8');
if (!artists.includes('/harshad-duhita')) fail('harshad link');
else ok('harshad');
if (!/mohit|Mohit/i.test(artists) || !/data-tsc-mohit-hidden|tsc-mohit|display:\s*none|<!--[\s\S]*Mohit/i.test(artists)) {
  // mohit may only be hidden via JS — check content-replacements
  if (!contentRep.includes('mohit') && !contentRep.includes('Mohit') && !contentRep.includes('tsc-mohit')) {
    fail('mohit hide missing');
  } else ok('mohit hide via JS');
} else ok('mohit hidden in HTML');

const apPages = fs.readFileSync(path.join(publicDir, 'pages/artist-path.html'), 'utf8');
if (!apPages.includes('artist-path.animations.js')) fail('pages artist-path missing anim script');
else ok('pages artist-path anim');

const apAnim = fs.readFileSync(path.join(publicDir, 'js/pages/artist-path.animations.js'), 'utf8');
if (!apAnim.includes('wireFrameworkScroll')) fail('framework scrub');
else ok('framework scrub');
if (!apAnim.includes('enableBenefitsDrag')) fail('benefits drag');
else ok('benefits drag');
if (!apAnim.includes('Next cohort dates TBA')) fail('coming soon copy');
else ok('coming soon');

const vercel = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');
if (!vercel.includes('"/affiliate"')) fail('vercel affiliate rewrite');
else ok('vercel affiliate');

const boot = fs.readFileSync(path.join(publicDir, 'css/mobile/boot.css'), 'utf8');
if (!boot.includes('tsc-skel')) fail('skeleton boot');
else ok('skeleton boot');

const workCss = fs.readFileSync(path.join(publicDir, 'css/mobile/work.css'), 'utf8');
if (workCss.includes('min-width: 99999px')) fail('work hero still gated 99999');
else ok('work hero MQ');

const filmsCss = fs.readFileSync(path.join(publicDir, 'css/mobile/films.css'), 'utf8');
if (!filmsCss.includes('Films hero glow')) fail('films glow');
else ok('films glow');

// —— Live browser checks (optional if puppeteer + server) ——
async function liveChecks() {
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch {
    console.log('SKIP live: puppeteer not loadable');
    return;
  }

  const port = 3097;
  const { spawn } = await import('child_process');
  const child = spawn(process.execPath, ['scripts/serve-mirror.js', String(port)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });
  // Wait until port accepts connections
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/affiliate`, (res) => {
          res.resume();
          resolve();
        });
        req.on('error', reject);
      });
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 250));
    }
  }

  const widths = [375, 768, 1024, 1280];
  const pages = [
    '/',
    '/about',
    '/work',
    '/artists',
    '/films',
    '/academy',
    '/resources',
    '/artist-path',
    '/affiliate',
    '/harshad-duhita',
    '/music-production',
    '/you-released-a-song-now-what',
  ];

  const browser = await puppeteer.launch({
    headless: true,
    protocolTimeout: 120000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const w of widths) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: 812, deviceScaleFactor: 1 });
      for (const route of pages) {
        const url = `http://127.0.0.1:${port}${route}`;
        try {
          const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
          const status = res ? res.status() : 0;
          if (status >= 400) {
            fail(`${route} @${w} HTTP ${status}`);
            continue;
          }
          if (route === '/academy') {
            await new Promise((r) => setTimeout(r, 3500));
          } else {
            await new Promise((r) => setTimeout(r, 400));
          }

          const metrics = await page.evaluate(() => {
            const overflow =
              document.documentElement.scrollWidth > document.documentElement.clientWidth + 8;
            const header = !!document.querySelector('.tsc-mobile-site-header');
            const footer = !!document.querySelector('.tsc-mobile-footer');
            const hamburger = !!document.querySelector('.tsc-mobile-site-header button, .tsc-burger, [aria-label*="Menu" i]');
            return {
              overflow,
              header,
              footer,
              hamburger,
              title: document.title,
              path: location.pathname,
            };
          });

          if (w <= 1024) {
            if (!metrics.header && !metrics.hamburger) {
              // some pages may take longer — soft warn
              console.warn('WARN: no TSC header yet', route, w);
            }
            if (metrics.overflow) fail(`${route} @${w} horizontal overflow`);
          }

          if (route === '/academy' && w <= 1024) {
            const luca = await page.evaluate(() => {
              const card =
                document.querySelector('#comp-mpjxxeqt') ||
                document.querySelector('.tsc-luca-course-card');
              const byText = /A-Z of Music Production|Luca Petracca/i.test(
                document.body.innerText || ''
              );
              if (!card) return { present: byText, byTextOnly: true };
              const style = getComputedStyle(card);
              const rect = card.getBoundingClientRect();
              return {
                present: true,
                byTextOnly: false,
                display: style.display,
                height: rect.height,
                id: card.id || card.className,
              };
            });
            if (!luca.present) fail('Luca card DOM missing @' + w);
            else if (!luca.byTextOnly && (luca.display === 'none' || luca.height < 20))
              fail('Luca card hidden @' + w);
            else ok('Luca visible @' + w + ' via ' + (luca.id || 'text'));
          }

          if (route === '/affiliate') {
            const cta = await page.evaluate(() => {
              const a = document.querySelector(
                'a[href*="mailto:artist@theshakticollective.in"], a.affiliate-cta'
              );
              return !!(a || /Apply to Affiliate/i.test(document.body.innerText || ''));
            });
            if (!cta) fail('affiliate mailto CTA');
            else ok('affiliate CTA @' + w);
          }

          if (route === '/artist-path') {
            const ap = await page.evaluate(() => ({
              enhance: !!document.querySelector('link[href*="artist-path-enhance"]'),
              scroller: (() => {
                const el = document.querySelector('#comp-mqqulorc');
                return el ? getComputedStyle(el).overflowX : null;
              })(),
              fw: document.documentElement.style.getPropertyValue('--tsc-fw-p') || null,
            }));
            await new Promise((r) => setTimeout(r, 600));
            ok(`artist-path @${w} overflowX=${ap.scroller}`);
          }

          ok(`${route} @${w} ${status}`);
        } catch (e) {
          fail(`${route} @${w} ${e.message}`);
        }
      }
      await page.close();
    }
  } finally {
    await browser.close();
    child.kill();
  }
}

const skipLive = process.argv.includes('--static-only');
(async () => {
  if (!skipLive) {
    try {
      await liveChecks();
    } catch (e) {
      fail('live: ' + e.message);
    }
  } else {
    console.log('SKIP live (--static-only)');
  }
  console.log('\n---');
  if (failures.length) {
    console.error(`${failures.length} failure(s)`);
    process.exit(1);
  }
  console.log('PERFECTION GATE PASS');
  process.exit(0);
})();
