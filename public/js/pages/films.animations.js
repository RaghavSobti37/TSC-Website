// Page animation bootstrap extracted from films/index.html.
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

(function () {
  var REMOVED_SECTION_ID = 'comp-mqmh352i';

  function removeOriginalsSection() {
    var section = document.getElementById(REMOVED_SECTION_ID);
    if (section && section.parentNode) {
      section.parentNode.removeChild(section);
    }
  }

  function scheduleRemoval() {
    removeOriginalsSection();
    [80, 250, 700, 1400, 2600, 5000].forEach(function (delay) {
      window.setTimeout(removeOriginalsSection, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleRemoval, { once: true });
  } else {
    scheduleRemoval();
  }
  window.addEventListener('load', scheduleRemoval, { once: true });

  if (window.MutationObserver && document.documentElement) {
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      window.setTimeout(function () {
        pending = false;
        removeOriginalsSection();
      }, 50);
    }).observe(document.documentElement, { childList: true, subtree: true });
  }
})();