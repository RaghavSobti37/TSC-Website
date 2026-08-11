// Page animation bootstrap extracted from work/index.html.
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
  var STYLE_ID = 'tsc-work-cases-height-fix';
  var SECTION_ID = 'comp-mr69hwoy';
  var SECTION_HEIGHT = 1160;

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '@media (min-width: 1025px) {',
      '  body:has(#' + SECTION_ID + ') #' + SECTION_ID + ' {',
      '    height: ' + SECTION_HEIGHT + 'px !important;',
      '    min-height: ' + SECTION_HEIGHT + 'px !important;',
      '    overflow: visible !important;',
      '  }',
      '  body:has(#' + SECTION_ID + ') #' + SECTION_ID + ' .comp-mr69hwoy-container {',
      '    min-height: ' + SECTION_HEIGHT + 'px !important;',
      '    grid-template-rows: minmax(' + SECTION_HEIGHT + 'px, auto) !important;',
      '    overflow: visible !important;',
      '  }',
      '  body:has(#' + SECTION_ID + ') #bgLayers_' + SECTION_ID + ' {',
      '    height: 100% !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyle, { once: true });
  } else {
    injectStyle();
  }
})();