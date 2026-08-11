// Page animation bootstrap extracted from academy/index.html.
// Kept separate so page-level animation behavior can be edited without touching the static HTML.
window.__pageRevealPromise && window.__pageRevealPromise.then(function() {
        requestAnimationFrame(function() {
            try {
                var stored = sessionStorage.getItem('wix-motion-played-animations');
                if (stored) {
                    var played = JSON.parse(stored);
                    for (var compId in played) {
                        if (played[compId]) {
                            var el = document.getElementById(compId);
                            if (el) {
                                el.dataset.motionEnter = 'done';
                            }
                        }
                    }
                }
            } catch (e) {}
        });
    });

// academy-mobile-redesign-start
(function() {
  // ponytail: one Academy design = Wix DOM + /css/mobile/academy.css
  function removeLegacyAcademyMobileRedesign() {
    document.querySelectorAll('.tsc-academy-mobile-redesign').forEach(function(node) {
      if (node.parentNode) node.parentNode.removeChild(node);
    });
  }
  function cleanAcademyTicker() {
    document.querySelectorAll('body *').forEach(function(el) {
      if (!el.children.length && /(?:\u20B9|Rs\.?)\s*3,?999/i.test(el.textContent || '')) {
        el.textContent = el.textContent.replace(/(?:\u20B9|Rs\.?)\s*3,?999\s*/ig, '');
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
// academy-mobile-redesign-end