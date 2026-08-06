const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'public', 'js', 'pages', 'academy.animations.js');
let s = fs.readFileSync(p, 'utf8');
const start = s.indexOf('// academy-mobile-redesign-start');
const end = s.indexOf('// academy-mobile-redesign-end');
if (start < 0 || end < 0) throw new Error('markers missing');
const repl = `// academy-mobile-redesign-start
(function() {
  // ponytail: one Academy design = Wix DOM + /css/mobile/academy.css
  function removeLegacyAcademyMobileRedesign() {
    document.querySelectorAll('.tsc-academy-mobile-redesign').forEach(function(node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }
  function cleanAcademyTicker() {
    document.querySelectorAll('body *').forEach(function(el) {
      if (!el.children.length && /(?:\\u20B9|Rs\\.?)\\s*3,?999/i.test(el.textContent || '')) {
        el.textContent = el.textContent.replace(/(?:\\u20B9|Rs\\.?)\\s*3,?999\\s*/ig, '');
      }
    });
  }
  function boot() {
    removeLegacyAcademyMobileRedesign();
    cleanAcademyTicker();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  [250, 1000, 2500].forEach(function(delay) {
    window.setTimeout(cleanAcademyTicker, delay);
  });
})();
// academy-mobile-redesign-end`;
fs.writeFileSync(p, s.slice(0, start) + repl + s.slice(end + '// academy-mobile-redesign-end'.length));
console.log('patched', p);
