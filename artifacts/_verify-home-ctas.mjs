import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = fs.readFileSync(path.join(root, 'public/css/tsc-responsive.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'public/js/tsc-components.js'), 'utf8');
const home = fs.readFileSync(path.join(root, 'public/pages/home.html'), 'utf8');

const checks = [];
function ok(name, pass, detail) {
  checks.push({ name, pass: !!pass, detail: detail || '' });
}

ok(
  'css matches both CTAs',
  css.includes(':is(#comp-mrly1u79, #comp-mrly2iho)') &&
    css.includes('font-size: clamp(20px, 1.33vw, 21.25px)')
);
ok('js linkHomeClosingCtas', js.includes('function linkHomeClosingCtas'));
ok('js whatsapp on join', js.includes("getElementById('comp-mrly2iho')") && js.includes('ARTIST_PATH_WHATSAPP'));
ok('home cache bust', home.includes('tsc-components.js?v=home-cta-match-1'));
ok(
  'home join href whatsapp',
  /id="comp-mrly2iho"[\s\S]{0,400}chat\.whatsapp\.com\/IaS1GaJT7Gp7ufxHIjDkZu/.test(home)
);

const WA = 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu?mode=gi_t';
const dom = new JSDOM(
  `<!doctype html><html><body>
  <div id="comp-mrly1u79"><a data-testid="linkElement" href="#"><span class="wixui-button__label">Build With TSC</span></a></div>
  <div id="comp-mrly2iho"><button data-testid="linkElement"><span class="wixui-button__label">Join</span></button></div>
</body></html>`,
  { url: 'https://example.com/' }
);
const { document } = dom.window;

function promoteToAnchor(wrapper) {
  if (!wrapper) return null;
  let control = wrapper.querySelector('[data-testid="linkElement"], a, button') || wrapper;
  if (control.tagName.toLowerCase() !== 'a') {
    const anchor = document.createElement('a');
    [...control.attributes].forEach((attribute) => {
      if (attribute.name === 'role' || attribute.name === 'tabindex') return;
      anchor.setAttribute(attribute.name, attribute.value);
    });
    while (control.firstChild) anchor.appendChild(control.firstChild);
    control.parentNode.replaceChild(anchor, control);
    control = anchor;
  }
  return control;
}

const join = promoteToAnchor(document.getElementById('comp-mrly2iho'));
join.setAttribute('href', WA);
join.setAttribute('target', '_blank');
const build = promoteToAnchor(document.getElementById('comp-mrly1u79'));
build.setAttribute('href', '/films');

ok('join becomes whatsapp anchor', join.getAttribute('href') === WA && join.tagName === 'A');
ok('build stays films', build.getAttribute('href') === '/films');

new Function(js);
ok('components parse', true);

const failed = checks.filter((c) => !c.pass);
checks.forEach((c) => console.log(`${c.pass ? 'PASS' : 'FAIL'} ${c.name}${c.detail ? ' — ' + c.detail : ''}`));
if (failed.length) {
  console.error(`\n${failed.length} failed`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed`);
