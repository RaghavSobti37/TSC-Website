// Page animation bootstrap extracted from artist-path/index.html.
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
    });// Artist Path UX: Coming Soon copy + Framework scroll scrub + benefits hint
(function() {
  function isArtistPath() {
    var p = (location.pathname || '').replace(/\/$/, '') || '/';
    return p === '/artist-path' || p === '/pages/artist-path' || /artist-path/.test(p);
  }
  if (!isArtistPath()) return;

  function ensureEnhanceCss() {
    if (document.querySelector('link[href*="artist-path-enhance.css"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/pages/artist-path-enhance.css?v=1';
    document.head.appendChild(link);
  }

  function upgradeComingSoon() {
    var copy = 'Next cohort dates TBA · Registrations reopen soon';
    document.querySelectorAll('#comp-mqp9hnbx, #comp-mqpa7920__7a338a2f-7982-45be-ab9f-baadee5c8dba, #comp-mqpa7920__4f195a9b-3aaf-4a71-a55c-60d380c9657c, #comp-mqrxadf6').forEach(function(node) {
      var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (!/coming soon|registrations opening|program starts|7th july|7th august|registrations open till/i.test(text)) return;
      var p = node.querySelector('.wixui-rich-text__text, p, h2') || node;
      p.textContent = copy;
      p.classList.add('tsc-coming-soon-badge');
    });
  }

  function isMobileViewport() {
    return window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
  }

  function showFrameworkStatically() {
    document.body.classList.remove('tsc-framework-scrubbing');
    document.body.classList.add('tsc-framework-done');
    document.documentElement.style.setProperty('--tsc-fw-p', '1');
  }

  function wireFrameworkScroll() {
    if (isMobileViewport()) {
      showFrameworkStatically();
      return;
    }

    var stage =
      document.querySelector('#comp-mqqf5d56') &&
      document.querySelector('#comp-mqqf5d56').closest('section');
    if (!stage) stage = document.querySelector('#comp-mqqjhqqf') && document.querySelector('#comp-mqqjhqqf').closest('section');
    if (!stage) return;
    stage.classList.add('tsc-framework-stage');
    document.body.classList.add('tsc-framework-scrubbing');

    var ticking = false;
    function scrub() {
      ticking = false;
      var rect = stage.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      // Progress 0 → 1 as section travels from below fold to centered screenshot pose
      var start = vh * 0.85;
      var end = vh * 0.28;
      var p = (start - rect.top) / (start - end);
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      // Fast ease-out
      var eased = 1 - Math.pow(1 - p, 2.4);
      document.documentElement.style.setProperty('--tsc-fw-p', String(eased));
      if (eased >= 0.98) {
        document.body.classList.add('tsc-framework-done');
      } else {
        document.body.classList.remove('tsc-framework-done');
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(scrub);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    scrub();
  }

  function enableBenefitsDrag() {
    var scroller = document.querySelector('#comp-mqqulorc');
    if (!scroller || scroller.dataset.tscDragBound) return;
    scroller.dataset.tscDragBound = '1';
    var startX = 0;
    var left = 0;
    var down = false;
    scroller.addEventListener('pointerdown', function(e) {
      down = true;
      startX = e.clientX;
      left = scroller.scrollLeft;
      scroller.setPointerCapture(e.pointerId);
    });
    scroller.addEventListener('pointermove', function(e) {
      if (!down) return;
      scroller.scrollLeft = left - (e.clientX - startX);
    });
    scroller.addEventListener('pointerup', function() { down = false; });
    scroller.addEventListener('pointercancel', function() { down = false; });
  }

  function boot() {
    ensureEnhanceCss();
    upgradeComingSoon();
    wireFrameworkScroll();
    enableBenefitsDrag();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
  [400, 1200, 2500].forEach(function(d) { setTimeout(boot, d); });
})();