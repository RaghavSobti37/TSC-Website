import fs from 'fs';

const css = fs.readFileSync('public/css/tsc-responsive.css', 'utf8');
const needle = 'body[data-page="about"] #comp-mp2vlkbh2';
let i = 0;
let n = 0;
while ((i = css.indexOf(needle, i)) !== -1 && n < 8) {
  const pre = css.slice(Math.max(0, i - 400), i);
  const mqs = [...pre.matchAll(/@media[^{]+/g)].map((m) => m[0].trim());
  console.log(n, 'offset', i, 'last MQ:', mqs[mqs.length - 1] || '(none/top)');
  i += needle.length;
  n++;
}

const films = fs.readFileSync('public/css/pages/films.css', 'utf8');
console.log('films has overflow visible on nums:', films.includes('overflow: visible !important') && films.includes('#comp-mqktx0o11'));
console.log('films global dup hide outside MQ:', /^#comp-mqmhowf1,/m.test(films) || films.includes('TSC Films: hide Wix duplicate'));

const js = fs.readFileSync('public/js/content-replacements.js', 'utf8');
const tear = js.slice(js.indexOf('function teardownMobileFilmsShells'), js.indexOf('function suppressDuplicateFilmsPartnerships') || js.indexOf('function buildMobileFilmsShells'));
console.log('teardown still removes hide from whatHost children:', tear.includes("child.classList.remove('tsc-mobile-films-hide')"));
console.log('teardown re-hides dups:', tear.includes("comp-mqmhowf1"));
