/**
 * Wix Thunderbolt leaves enter/loop animations paused until its runtime sets
 * data-motion-enter="done". Static clone never gets that — hero stays blurry /
 * slideshow words never cycle. Finish enter motions + rotate slideshows here.
 */
(function () {
  var STORAGE_KEY = 'wix-motion-played-animations';
  var ENTER_RE = /motion-(fadeIn|blurIn|flipIn|glideIn)/;
  var LOOP_RE = /motion-(breathe|pulse|wiggle)/;
  if (!document.querySelector('link[data-tsc-wix-motion-css]')) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/css/tsc-wix-motion.css?v=academy-one-2';
    css.setAttribute('data-tsc-wix-motion-css', '1');
    (document.head || document.documentElement).appendChild(css);
  }
  if (!document.querySelector('link[data-tsc-nav-overrides]')) {
    var navCss = document.createElement('link');
    navCss.rel = 'stylesheet';
    navCss.href = '/css/tsc-nav-overrides.css?v=desktop-nav-type-1';
    navCss.setAttribute('data-tsc-nav-overrides', '1');
    (document.head || document.documentElement).appendChild(navCss);
  }
  if (!document.querySelector('style[data-tsc-course-fab-css]')) {
    var fabCss = document.createElement('style');
    fabCss.setAttribute('data-tsc-course-fab-css', '1');
    fabCss.textContent = '.tsc-phone-fab{position:fixed!important;right:clamp(16px,2vw,28px)!important;bottom:calc(clamp(18px,2vw,28px) + env(safe-area-inset-bottom,0px))!important;left:auto!important;top:auto!important;z-index:9500!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;width:58px!important;height:58px!important;min-width:58px!important;min-height:58px!important;max-width:58px!important;max-height:58px!important;margin:0!important;padding:0!important;border:1px solid rgba(255,236,209,.5)!important;border-radius:50%!important;background:#005a5a!important;color:#ffecd1!important;box-shadow:0 12px 30px rgba(0,46,46,.34)!important;text-decoration:none!important;transform:none!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}.tsc-phone-fab svg{display:block!important;width:26px!important;height:26px!important;max-width:26px!important;max-height:26px!important;fill:currentColor!important;flex:0 0 26px!important}';
    (document.head || document.documentElement).appendChild(fabCss);
  }
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function readPlayed() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function writePlayed(played) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(played));
    } catch (e) {}
  }

  function finalizeEnter(el, played) {
    if (!el) return;
    if (el.dataset.motionEnter === 'done') return;
    el.dataset.motionEnter = 'done';
    // Clear pause only — do not touch animation-name (avoids mid-flight restarts).
    el.style.setProperty('animation-play-state', 'running', 'important');
    if (el.id && played) {
      played[el.id] = true;
      writePlayed(played);
    }
  }

  function isSlideshowItem(el) {
    return !!(el && el.id && el.id.indexOf('__item-') !== -1);
  }

  /** Hero letterpress — force crisp end state on every viewport. */
  function settleHeroUnfold() {
    var el = document.getElementById('comp-mrxkm2y2');
    if (!el) return;
    el.dataset.motionEnter = 'done';
    el.style.setProperty('filter', 'none', 'important');
    el.style.setProperty('--motion-blur', '0px', 'important');
    el.style.setProperty('opacity', '0.9', 'important');
  }

  function releaseEnterAndLoops() {
    settleHeroUnfold();
    var played = readPlayed();
    var nodes = document.querySelectorAll('[id^="comp-"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || !el.id) continue;
      if (isSlideshowItem(el)) continue;
      if (el.id === 'comp-mrxkm2y2') continue;

      if (played[el.id] || reduceMotion) {
        finalizeEnter(el, played);
        continue;
      }

      var cs = window.getComputedStyle(el);
      var names = String(cs.animationName || '');
      var playState = String(cs.animationPlayState || '');
      if (!names || names === 'none') continue;
      // Only Wix motion-* names — skip custom CSS animations.
      if (names.indexOf('motion-') === -1) continue;

      var isEnter = ENTER_RE.test(names);
      var isLoop = LOOP_RE.test(names);

      if (isEnter && el.dataset.motionEnter !== 'done') {
        // Play briefly when paused, then always finish enter (Thunderbolt absent).
        if (playState.indexOf('paused') !== -1 && !reduceMotion) {
          el.style.setProperty('animation-play-state', 'running', 'important');
          if (el.dataset.tscMotionBoot !== '1') {
            el.dataset.tscMotionBoot = '1';
            (function (target, bag) {
              window.setTimeout(function () {
                finalizeEnter(target, bag);
              }, 1400);
            })(el, played);
          }
        } else {
          finalizeEnter(el, played);
        }
      } else if (isLoop && playState.indexOf('paused') !== -1) {
        el.style.setProperty('animation-play-state', 'running', 'important');
      }
    }
  }

  function activateSlide(slide, played) {
    slide.classList.add('xjQkF3', 'fABPvj');
    slide.setAttribute('aria-hidden', 'false');
    var items = slide.querySelectorAll('[id*="__item-"]');
    for (var i = 0; i < items.length; i++) {
      finalizeEnter(items[i], played);
      if (!reduceMotion) {
        items[i].style.setProperty('animation-play-state', 'running');
      }
    }
  }

  function deactivateSlide(slide) {
    slide.classList.remove('xjQkF3', 'fABPvj');
    slide.setAttribute('aria-hidden', 'true');
  }

  function runSlideshows() {
    var roots = document.querySelectorAll('[data-testid="slideshow"]');
    var played = readPlayed();
    for (var r = 0; r < roots.length; r++) {
      var root = roots[r];
      if (root.dataset.tscSlideBoot === '1') continue;
      var slides = root.querySelectorAll('.p9hNc1');
      if (slides.length < 2) {
        if (slides.length === 1) activateSlide(slides[0], played);
        continue;
      }
      root.dataset.tscSlideBoot = '1';

      var idx = 0;
      for (var n = 0; n < slides.length; n++) {
        if (slides[n].classList.contains('xjQkF3') || slides[n].classList.contains('fABPvj')) {
          idx = n;
          break;
        }
      }

      function show(i) {
        for (var s = 0; s < slides.length; s++) {
          if (s === i) activateSlide(slides[s], played);
          else deactivateSlide(slides[s]);
        }
      }

      show(idx);
      if (reduceMotion) continue;

      (function (slidesRef, startIdx, showFn) {
        var i = startIdx;
        window.setInterval(function () {
          i = (i + 1) % slidesRef.length;
          showFn(i);
        }, 3000);
      })(slides, idx, show);
    }
  }

  function removeMentorSessions() {
    // Never touch course cards (#comp-mpjxxeqt = Luca / A-Z Music Production).
    var ids = ['comp-mpl387ie', 'comp-mrufx9ud', 'comp-mrufx9rd2'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) {
        el.style.setProperty('display', 'none', 'important');
        el.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /** Center letterpress UNFOLD on the cream phrase below it. */
  function centerUnfoldOverPhrase() {
    var path = (location.pathname || '').replace(/\/$/, '') || '/';
    if (path !== '/' && path !== '/pages/home' && !/\/home\.html$/i.test(location.pathname)) return;
    var unfold = document.getElementById('comp-mrxkm2y2');
    var phraseHost = document.getElementById('comp-mrxl8fxe') || document.getElementById('comp-mrg8g76o');
    if (!unfold || !phraseHost) return;
    var phraseEl =
      phraseHost.querySelector('.xjQkF3.fABPvj .wixui-rich-text__text') ||
      phraseHost.querySelector('.wixui-rich-text__text') ||
      phraseHost;
    var u = unfold.getBoundingClientRect();
    var p = phraseEl.getBoundingClientRect();
    if (u.width < 8 || p.width < 8) return;
    var dx = p.left + p.width / 2 - (u.left + u.width / 2);
    if (Math.abs(dx) < 0.5) return;
    var prev = parseFloat(unfold.dataset.tscUnfoldDx || '0') || 0;
    var next = prev + dx;
    unfold.dataset.tscUnfoldDx = String(next);
    unfold.style.setProperty('transform', 'translateX(' + next + 'px)', 'important');
  }

  function injectBookCallFab() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    var shouldShow = path === '/' ||
      path === '/academy' ||
      path === '/book-a-call' ||
      path === '/artist-path' ||
      path.indexOf('/the-heart') === 0 ||
      path.indexOf('/roots-of') === 0 ||
      path.indexOf('/music-production') === 0 ||
      path.indexOf('/academy/the-heart') === 0 ||
      path.indexOf('/academy/roots-of') === 0 ||
      path.indexOf('/academy/music-production') === 0;
    if (!shouldShow || !document.body) return;
    if (document.querySelector('[data-tsc-sticky-cta="phone-fab"], .tsc-phone-fab')) return;
    var a = document.createElement('a');
    a.className = 'tsc-sticky-cta tsc-phone-fab is-visible';
    a.href = '/book-a-call';
    a.setAttribute('data-tsc-sticky-cta', 'phone-fab');
    a.setAttribute('aria-label', 'Book a Call');
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>';
    document.body.appendChild(a);
  }

  function boot() {
    injectBookCallFab();
    removeMentorSessions();
    releaseEnterAndLoops();
    runSlideshows();
    centerUnfoldOverPhrase();
    [100, 500, 1500, 3000].forEach(function (ms) {
      window.setTimeout(function () {
        injectBookCallFab();
        removeMentorSessions();
        releaseEnterAndLoops();
        runSlideshows();
        centerUnfoldOverPhrase();
      }, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.addEventListener('load', function () {
    injectBookCallFab();
    removeMentorSessions();
    releaseEnterAndLoops();
    runSlideshows();
    centerUnfoldOverPhrase();
  });
  window.addEventListener('resize', function () {
    var unfold = document.getElementById('comp-mrxkm2y2');
    if (unfold) {
      unfold.dataset.tscUnfoldDx = '0';
      unfold.style.removeProperty('transform');
    }
    window.requestAnimationFrame(centerUnfoldOverPhrase);
  });
})();
