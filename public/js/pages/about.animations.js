// Page animation bootstrap extracted from about/index.html.
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
  var SECTION_ID = 'comp-mr1ychhq';
  var STYLE_ID = 'tsc-about-philosophy-parallax-style';
  var OLD_STYLE_ID = 'tsc-about-philosophy-motion-style';
  var LAYERS = [
    { id: 'bgImg_comp-mr1ychhq', speed: 0.18, scale: 1.06 },
    { id: 'comp-mr22tzwu', speed: -0.34, scale: 1 },
    { id: 'comp-mr234332', speed: 0.28, scale: 1 }
  ];
  var ticking = false;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function isDesktop() {
    try {
      return window.matchMedia('(min-width: 768px)').matches;
    } catch (e) {
      return true;
    }
  }

  function injectStyle() {
    var oldStyle = document.getElementById(OLD_STYLE_ID);
    if (oldStyle) oldStyle.remove();
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + SECTION_ID + ' .tsc-philosophy-parallax-layer {',
      '  will-change: transform !important;',
      '  backface-visibility: hidden !important;',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #' + SECTION_ID + ' .tsc-philosophy-parallax-layer {',
      '    transform: none !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function cleanupOldMotion(section) {
    section.classList.remove('tsc-philosophy-motion-ready', 'tsc-philosophy-motion-complete');
    delete section.dataset.tscPhilosophyMotion;

    var progress = section.querySelector('.tsc-philosophy-progress');
    if (progress) progress.remove();

    section.querySelectorAll('.tsc-philosophy-step, .tsc-philosophy-dot, .is-visible').forEach(function (el) {
      el.classList.remove('tsc-philosophy-step', 'tsc-philosophy-dot', 'is-visible');
      el.style.removeProperty('opacity');
      el.style.removeProperty('box-shadow');
    });
  }

  function resetLayer(layer) {
    var el = document.getElementById(layer.id);
    if (!el) return;
    el.classList.remove('tsc-philosophy-parallax-layer');
    el.style.removeProperty('transform');
  }

  function applyParallax() {
    ticking = false;
    var section = document.getElementById(SECTION_ID);
    if (!section) return;

    cleanupOldMotion(section);

    if (prefersReducedMotion() || !isDesktop()) {
      LAYERS.forEach(resetLayer);
      return;
    }

    var rect = section.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    var centerDelta = viewportHeight / 2 - (rect.top + rect.height / 2);
    var progress = Math.max(-1, Math.min(1, centerDelta / Math.max(viewportHeight, rect.height)));
    var travel = progress * 140;

    LAYERS.forEach(function (layer) {
      var el = document.getElementById(layer.id);
      if (!el) return;
      if (typeof el.dataset.tscParallaxBase === 'undefined') {
        el.dataset.tscParallaxBase = el.style.transform || '';
      }

      var y = Math.round(travel * layer.speed);
      var base = el.dataset.tscParallaxBase;
      var scale = layer.scale && layer.scale !== 1 ? ' scale(' + layer.scale + ')' : '';
      el.classList.add('tsc-philosophy-parallax-layer');
      el.style.setProperty('transform', (base ? base + ' ' : '') + 'translate3d(0, ' + y + 'px, 0)' + scale, 'important');
    });
  }

  function requestApply() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(applyParallax);
  }

  function boot() {
    injectStyle();
    requestApply();
  }

  function scheduleBoots() {
    boot();
    [400, 1000, 1800, 3000].forEach(function (delay) {
      window.setTimeout(boot, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoots, { once: true });
  } else {
    scheduleBoots();
  }
  window.addEventListener('load', scheduleBoots, { once: true });
  window.addEventListener('scroll', requestApply, { passive: true });
  window.addEventListener('resize', requestApply);
})();

(function () {
  var TITLE_ID = 'comp-mr355d93';
  var STYLE_ID = 'tsc-about-build-scroll-style';
  /* ponytail: Films/Originals sections removed from about.html — keep Artists/Academy/Artist Path only */
  var SECTION_IDS = [
    'comp-mr38xqqo',
    'comp-mr3axlwa',
    'comp-mr3fzsjq'
  ];
  var CARD_IDS = {
    'comp-mr38xqqo': 'comp-mr3ifogb',
    'comp-mr3axlwa': 'comp-mr3axlxx',
    'comp-mr3fzsjq': 'comp-mr3fzskh1'
  };
  var TITLE_TOP = 40;
  var CARD_TOP = 295;
  var RELEASE_GAP = 44;
  var ticking = false;
  var metrics = null;
  var titleHoldY = 0;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function isDesktop() {
    try {
      return window.matchMedia('(min-width: 1025px)').matches;
    } catch (e) {
      return true;
    }
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + TITLE_ID + '.tsc-build-scroll-title,',
      '.tsc-build-stop-card {',
      '  will-change: transform !important;',
      '  backface-visibility: hidden !important;',
      '}',
      '#' + TITLE_ID + '.tsc-build-scroll-title {',
      '  animation: none !important;',
      '  transition: none !important;',
      '  z-index: 8 !important;',
      '}',
      '.tsc-build-stop-card {',
      '  transition: none !important;',
      '  z-index: 7 !important;',
      '}',
      '@media (max-width: 1024px), (prefers-reduced-motion: reduce) {',
      '  #' + TITLE_ID + '.tsc-build-scroll-title,',
      '  .tsc-build-stop-card {',
      '    transform: none !important;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function pageTop(el) {
    var rect = el.getBoundingClientRect();
    return rect.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
  }

  function findCard(section) {
    var mapped = CARD_IDS[section.id] && document.getElementById(CARD_IDS[section.id]);
    if (mapped && section.contains(mapped)) return mapped;

    var candidates = Array.prototype.slice.call(section.querySelectorAll('[id^="comp-"]'));
    var bestMatch = candidates.reduce(function (best, el) {
      var rect = el.getBoundingClientRect();
      var text = (el.textContent || '').trim();
      if (!text || rect.width < 700 || rect.height < 250) return best;
      if (!best || rect.width * rect.height > best.area) {
        return { el: el, area: rect.width * rect.height };
      }
      return best;
    }, null);

    return bestMatch ? bestMatch.el : null;
  }

  function resetTransforms() {
    var title = document.getElementById(TITLE_ID);
    if (title) {
      title.classList.remove('tsc-build-scroll-title');
      title.style.removeProperty('position');
      title.style.removeProperty('top');
      title.style.removeProperty('left');
      title.style.removeProperty('width');
      title.style.removeProperty('transform');
      title.style.removeProperty('animation');
      title.style.removeProperty('transition');
    }

    SECTION_IDS.forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var card = findCard(section);
      if (!card) return;
      card.classList.remove('tsc-build-stop-card');
      card.style.removeProperty('position');
      card.style.removeProperty('top');
      card.style.removeProperty('left');
      card.style.removeProperty('width');
      card.style.removeProperty('transform');
      card.style.removeProperty('transition');
    });
  }

  function measure() {
    var title = document.getElementById(TITLE_ID);
    if (!title) return null;

    var cards = SECTION_IDS.map(function (id) {
      var section = document.getElementById(id);
      if (!section) return null;
      var card = findCard(section);
      if (!card) return null;
      return {
        id: id,
        section: section,
        card: card,
        cardTop: pageTop(card),
        left: card.getBoundingClientRect().left,
        width: card.getBoundingClientRect().width
      };
    }).filter(Boolean).sort(function (a, b) {
      return a.cardTop - b.cardTop;
    });

    if (!cards.length) return null;

    return {
      title: title,
      titleLeft: title.getBoundingClientRect().left,
      titleWidth: title.getBoundingClientRect().width,
      titleStart: cards[0].cardTop - CARD_TOP - 140,
      titleEnd: cards[cards.length - 1].cardTop - CARD_TOP + 260,
      cards: cards
    };
  }

  function applyBuildScroll() {
    ticking = false;

    if (prefersReducedMotion() || !isDesktop()) {
      resetTransforms();
      metrics = null;
      return;
    }

    if (!metrics) metrics = measure();
    if (!metrics) return;

    var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

    if (scrollY >= metrics.titleStart && scrollY <= metrics.titleEnd) {
      metrics.title.classList.add('tsc-build-scroll-title');
      metrics.title.style.removeProperty('position');
      metrics.title.style.removeProperty('top');
      metrics.title.style.removeProperty('left');
      metrics.title.style.removeProperty('width');
      titleHoldY += TITLE_TOP - metrics.title.getBoundingClientRect().top;
      metrics.title.style.setProperty('transform', 'translate3d(0, ' + Math.round(titleHoldY) + 'px, 0)', 'important');
      metrics.title.style.setProperty('animation', 'none', 'important');
      metrics.title.style.setProperty('transition', 'none', 'important');
    } else {
      titleHoldY = 0;
      metrics.title.classList.remove('tsc-build-scroll-title');
      metrics.title.style.removeProperty('position');
      metrics.title.style.removeProperty('top');
      metrics.title.style.removeProperty('left');
      metrics.title.style.removeProperty('width');
      metrics.title.style.removeProperty('transform');
      metrics.title.style.removeProperty('animation');
      metrics.title.style.removeProperty('transition');
    }

    metrics.cards.forEach(function (item, index) {
      var next = metrics.cards[index + 1];
      var start = item.cardTop - CARD_TOP;
      var end = next ? next.cardTop - CARD_TOP - RELEASE_GAP : item.cardTop - CARD_TOP + 520;

      if (scrollY >= start && scrollY <= end) {
        item.card.classList.add('tsc-build-stop-card');
        item.card.style.setProperty('position', 'fixed', 'important');
        item.card.style.setProperty('top', CARD_TOP + 'px', 'important');
        item.card.style.setProperty('left', item.left + 'px', 'important');
        item.card.style.setProperty('width', item.width + 'px', 'important');
        item.card.style.setProperty('transform', 'none', 'important');
        item.card.style.setProperty('transition', 'none', 'important');
      } else {
        item.card.classList.remove('tsc-build-stop-card');
        item.card.style.removeProperty('position');
        item.card.style.removeProperty('top');
        item.card.style.removeProperty('left');
        item.card.style.removeProperty('width');
        item.card.style.removeProperty('transform');
        item.card.style.removeProperty('transition');
      }
    });
  }

  function requestApply() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(applyBuildScroll);
  }

  function refresh() {
    injectStyle();
    resetTransforms();
    titleHoldY = 0;
    metrics = measure();
    requestApply();
  }

  function scheduleBoots() {
    refresh();
    [400, 1000, 1800, 3000].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoots, { once: true });
  } else {
    scheduleBoots();
  }
  window.addEventListener('load', scheduleBoots, { once: true });
  window.addEventListener('scroll', requestApply, { passive: true });
  window.addEventListener('resize', refresh);
})();