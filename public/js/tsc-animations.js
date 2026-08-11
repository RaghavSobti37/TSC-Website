/*
 * DESKTOP DESIGN LOCK — PERMANENT. Desktop (>=1025px) of the 9 primary pages is locked to commit faf9dea.
 * This script must NOT alter desktop rendering of those pages. Mobile-only behavior must be guarded by
 * matchMedia('(max-width: 1024px)'). Never change desktop unless the site owner explicitly asks.
 */
(function() {
  var ui = window.TSCComponents;
  if (!ui || window.__tscRevealAnimations) return;
  // Desktop (>=1025px): leave Wix / faf9dea motions alone. Scroll-reveal is mobile-only.
  if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
  window.__tscRevealAnimations = true;

  var styleId = 'tsc-reveal-animation-styles';
  var revealSelector = [
    'main section',
    'main [data-testid="richTextElement"]',
    'main [data-testid="imageX"]',
    'main .wixui-button',
    'main .wixui-box',
    'main .tsc-local-form',
    'main .hero-copy',
    'main .hero-media',
    'main .article-body > *',
    'main .related-inner'
  ].join(',');
  var compactRevealSelector = [
    'main section',
    'main .tsc-local-form',
    'main .hero-copy',
    'main .hero-media',
    'main .article-body > *',
    'main .related-inner'
  ].join(',');

  function installStyles() {
    if (document.getElementById(styleId)) return;
    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '.tsc-reveal-pending{opacity:0;transform:var(--tsc-reveal-from-transform,translate3d(0,28px,0));}',
      '.tsc-reveal-ready{opacity:1;transform:var(--tsc-reveal-to-transform,none);transition:opacity 700ms cubic-bezier(.2,.7,.2,1),transform 700ms cubic-bezier(.2,.7,.2,1);transition-delay:var(--tsc-reveal-delay,0ms);}',
      '@media (max-width: 600px){.tsc-reveal-pending{transform:translate3d(0,12px,0);}.tsc-reveal-ready{transition-duration:220ms;transition-delay:0ms;}}',
      '@media (prefers-reduced-motion: reduce){.tsc-reveal-pending,.tsc-reveal-ready{opacity:1;transform:none;transition:none;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function shouldSkip(element) {
    if (!element || element.dataset.tscRevealBound) return true;
    if (element.closest('header, footer, nav, script, style')) return true;
    if (element.id === 'SITE_PAGES' || element.id === 'SITE_PAGES_TRANSITION_GROUP') return true;
    if (element.classList.contains('tsc-reveal-ready')) return true;
    // Decorative Wix chrome — binding it double-hides parent .wixui-box reveals.
    if (element.classList.contains('inner-box') || element.classList.contains('NYfD3h')) return true;
    var rect = element.getBoundingClientRect();
    return rect.width === 0 || rect.height === 0;
  }

  function reveal(element) {
    element.classList.remove('tsc-reveal-pending');
    element.classList.add('tsc-reveal-ready');
  }

  function isInRevealRange(element) {
    var rect = element.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    return rect.top < viewportHeight * 0.92 && rect.bottom > -20;
  }

  function revealVisiblePending() {
    document.querySelectorAll('.tsc-reveal-pending').forEach(function(element) {
      if (isInRevealRange(element)) {
        reveal(element);
      }
    });
  }

  function bindViewportRevealEvents() {
    if (window.__tscRevealViewportEvents) return;
    window.__tscRevealViewportEvents = true;
    var ticking = false;
    function requestReveal() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function() {
        ticking = false;
        revealVisiblePending();
      });
      window.setTimeout(revealVisiblePending, 90);
      window.setTimeout(revealVisiblePending, 240);
      startTemporaryRevealSweeper();
    }
    window.addEventListener('scroll', requestReveal, { passive: true });
    document.addEventListener('scroll', requestReveal, true);
    document.addEventListener('wheel', requestReveal, { passive: true });
    document.addEventListener('touchmove', requestReveal, { passive: true });
    if (document.body) {
      document.body.addEventListener('scroll', requestReveal, { passive: true });
    }
    if (document.documentElement) {
      document.documentElement.addEventListener('scroll', requestReveal, { passive: true });
    }
    // Mirror pages often scroll on body while scrollingElement.scrollTop stays 0.
    var se = document.scrollingElement;
    if (se && se !== document.body && se !== document.documentElement) {
      se.addEventListener('scroll', requestReveal, { passive: true });
    }
    window.addEventListener('resize', requestReveal);
  }

  function scheduleRevealSweep() {
    window.requestAnimationFrame(revealVisiblePending);
    [80, 180, 360, 700, 1200].forEach(function(delay) {
      window.setTimeout(revealVisiblePending, delay);
    });
  }

  function startTemporaryRevealSweeper() {
    if (window.__tscRevealTemporarySweeper) return;
    window.__tscRevealTemporarySweeper = window.setInterval(function() {
      revealVisiblePending();
      if (!document.querySelector('.tsc-reveal-pending')) {
        window.clearInterval(window.__tscRevealTemporarySweeper);
        window.__tscRevealTemporarySweeper = null;
      }
    }, 250);
    window.setTimeout(function() {
      if (!window.__tscRevealTemporarySweeper) return;
      window.clearInterval(window.__tscRevealTemporarySweeper);
      window.__tscRevealTemporarySweeper = null;
    }, 7000);
  }

  function bindReveals() {
    installStyles();
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var compactMotion = window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
    var selector = compactMotion ? compactRevealSelector : revealSelector;
    var elements = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function(element) {
      return !shouldSkip(element);
    });

    elements.forEach(function(element, index) {
      element.dataset.tscRevealBound = 'true';
      var originalTransform = getComputedStyle(element).transform;
      var toTransform = originalTransform === 'none' ? 'none' : originalTransform;
      var offset = compactMotion ? 'translate3d(0,12px,0)' : 'translate3d(0,28px,0)';
      var fromTransform = originalTransform === 'none' ? offset : originalTransform + ' ' + offset;
      element.style.setProperty('--tsc-reveal-from-transform', fromTransform);
      element.style.setProperty('--tsc-reveal-to-transform', toTransform);
      element.style.setProperty('--tsc-reveal-delay', compactMotion ? '0ms' : Math.min(index % 6, 5) * 55 + 'ms');
      if (reduceMotion) {
        reveal(element);
      } else {
        element.classList.add('tsc-reveal-pending');
      }
    });

    if (reduceMotion) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      elements.forEach(function(element) {
        if (isInRevealRange(element)) {
          reveal(element);
        } else {
          observer.observe(element);
        }
      });
    } else {
      elements.forEach(reveal);
    }
    bindViewportRevealEvents();
    scheduleRevealSweep();
    startTemporaryRevealSweeper();
  }

  ui.applyOnSchedule(function() {
    ui.patchMutedPlay();
    ui.muteVideos();
    bindReveals();
  });
})();
