/**
 * Wix Thunderbolt leaves enter/loop animations paused until its runtime sets
 * data-motion-enter="done". Static clone never gets that — hero stays blurry /
 * slideshow words never cycle. Finish enter motions + rotate slideshows here.
 */
(function () {
  var STORAGE_KEY = 'wix-motion-played-animations';
  var ENTER_RE = /motion-(fadeIn|blurIn|flipIn|glideIn)/;
  var LOOP_RE = /motion-(breathe|pulse|wiggle)/;

  function isCoursePagePath() {
    var path = (location.pathname || '').replace(/\/+$/, '') || '/';
    return (
      path.indexOf('/music-production') === 0 ||
      path.indexOf('/the-heart') === 0 ||
      path.indexOf('/roots-of') === 0 ||
      path.indexOf('/academy/music-production') === 0 ||
      path.indexOf('/academy/the-heart') === 0 ||
      path.indexOf('/academy/roots-of') === 0
    );
  }

  /* Course pages: always replay enters this load (session flag freezes motion). */
  if (isCoursePagePath()) {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }
  if (!document.querySelector('link[data-tsc-wix-motion-css]')) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/css/tsc-wix-motion.css?v=course-marquee-1';
    css.setAttribute('data-tsc-wix-motion-css', '1');
    (document.head || document.documentElement).appendChild(css);
  }
  if (!document.querySelector('link[data-tsc-nav-overrides]')) {
    var navCss = document.createElement('link');
    navCss.rel = 'stylesheet';
    navCss.href = '/css/tsc-nav-overrides.css?v=kill-ads-strip-2';
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
    el.style.setProperty('opacity', '0.5', 'important');
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
        if (reduceMotion) {
          finalizeEnter(el, played);
        } else if (isCoursePagePath()) {
          /* Course pages: force a visible enter even when Wix left play-state running/idle. */
          if (el.dataset.tscMotionBoot !== '1') {
            el.dataset.tscMotionBoot = '1';
            el.style.setProperty('animation-play-state', 'running', 'important');
            (function (target, bag) {
              window.setTimeout(function () {
                finalizeEnter(target, bag);
              }, 1800);
            })(el, played);
          }
        } else if (playState.indexOf('paused') !== -1) {
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

  function clearSlideInline(slide) {
    if (!slide || !slide.style) return;
    slide.style.removeProperty('transition');
    slide.style.removeProperty('visibility');
    slide.style.removeProperty('opacity');
    slide.style.removeProperty('animation');
  }

  function usesWixSlideMotion(root) {
    if (!root) return false;
    var nextIn = '';
    try {
      nextIn = String(window.getComputedStyle(root).getPropertyValue('--animation-nextIn') || '');
    } catch (e) {}
    return nextIn.indexOf('SlideshowRepeater_slide') !== -1;
  }

  function slideDurationMs(root) {
    var sec = 1.5;
    try {
      var raw = window.getComputedStyle(root).getPropertyValue('--transitionDuration');
      var parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed > 0) sec = parsed;
    } catch (e) {}
    return Math.round(sec * 1000);
  }

  /** Opacity path — home word-swap / fade slideshows (no Wix slide keyframes). */
  function activateSlideFade(slide, played) {
    slide.classList.remove('fABPvj');
    slide.classList.add('xjQkF3');
    slide.style.setProperty('transition', 'opacity 700ms ease-in-out', 'important');
    slide.style.setProperty('visibility', 'visible', 'important');
    slide.style.setProperty('opacity', '1', 'important');
    slide.style.setProperty('animation', 'none', 'important');
    slide.setAttribute('aria-hidden', 'false');
    var items = slide.querySelectorAll('[id*="__item-"]');
    for (var i = 0; i < items.length; i++) {
      finalizeEnter(items[i], played);
      if (!reduceMotion) {
        items[i].style.setProperty('animation-play-state', 'running');
      }
    }
  }

  function deactivateSlideFade(slide) {
    slide.classList.remove('xjQkF3', 'fABPvj');
    slide.style.setProperty('transition', 'opacity 700ms ease-in-out', 'important');
    slide.style.setProperty('visibility', 'hidden', 'important');
    slide.style.setProperty('opacity', '0', 'important');
    slide.style.setProperty('animation', 'none', 'important');
    slide.setAttribute('aria-hidden', 'true');
  }

  /** Native Wix slide — let SlideshowRepeater_* CSS run (testimonials desktop). */
  function activateSlideNative(slide, played) {
    clearSlideInline(slide);
    slide.classList.remove('fABPvj');
    slide.classList.add('xjQkF3');
    slide.setAttribute('aria-hidden', 'false');
    var items = slide.querySelectorAll('[id*="__item-"]');
    for (var i = 0; i < items.length; i++) {
      finalizeEnter(items[i], played);
      if (!reduceMotion) {
        items[i].style.setProperty('animation-play-state', 'running');
      }
    }
  }

  function deactivateSlideNative(slide) {
    clearSlideInline(slide);
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
        if (slides.length === 1) {
          if (usesWixSlideMotion(root)) activateSlideNative(slides[0], played);
          else activateSlideFade(slides[0], played);
        }
        continue;
      }
      root.dataset.tscSlideBoot = '1';

      (function (rootRef, slidesRef) {
        var idx = 0;
        var nativeSlide = usesWixSlideMotion(rootRef);
        var duration = nativeSlide ? slideDurationMs(rootRef) : 1500;
        var interval = nativeSlide ? Math.max(duration + 2200, 5000) : 3800;
        var busy = false;
        var desktop = window.matchMedia('(min-width: 1025px)').matches;

        if (nativeSlide) {
          rootRef.style.setProperty('--animation-duration', duration / 1000 + 's');
          rootRef.style.setProperty('--transitionDuration', String(duration / 1000));
        }

        for (var n = 0; n < slidesRef.length; n++) {
          if (slidesRef[n].classList.contains('xjQkF3') || slidesRef[n].classList.contains('fABPvj')) {
            idx = n;
            break;
          }
        }

        function showImmediately(i) {
          rootRef.classList.remove('nDlJtT', 'KuwcDC');
          for (var s = 0; s < slidesRef.length; s++) {
            if (s === i) {
              if (nativeSlide) activateSlideNative(slidesRef[s], played);
              else activateSlideFade(slidesRef[s], played);
            } else if (nativeSlide) {
              deactivateSlideNative(slidesRef[s]);
            } else {
              deactivateSlideFade(slidesRef[s]);
            }
          }
        }

        function transitionTo(next, previous) {
          if (!desktop || reduceMotion) {
            idx = next;
            showImmediately(idx);
            return;
          }
          if (busy || next === idx) return;
          busy = true;

          var outgoing = slidesRef[idx];
          var incoming = slidesRef[next];

          if (nativeSlide) {
            // ponytail: Wix CSS owns slide — only toggle classes
            clearSlideInline(outgoing);
            clearSlideInline(incoming);
            rootRef.classList.toggle('KuwcDC', previous);
            rootRef.classList.toggle('nDlJtT', !previous);
            outgoing.classList.remove('xjQkF3');
            outgoing.classList.add('fABPvj');
            incoming.classList.remove('fABPvj');
            incoming.classList.add('xjQkF3');
            outgoing.setAttribute('aria-hidden', 'true');
            incoming.setAttribute('aria-hidden', 'false');
            var items = incoming.querySelectorAll('[id*="__item-"]');
            for (var i = 0; i < items.length; i++) finalizeEnter(items[i], played);
            idx = next;
            window.setTimeout(function () {
              outgoing.classList.remove('fABPvj');
              rootRef.classList.remove('nDlJtT', 'KuwcDC');
              for (var s = 0; s < slidesRef.length; s++) {
                if (s !== idx) deactivateSlideNative(slidesRef[s]);
              }
              busy = false;
            }, duration);
            return;
          }

          rootRef.style.setProperty('--transitionDuration', String(duration / 1000));
          rootRef.classList.toggle('KuwcDC', previous);
          rootRef.classList.toggle('nDlJtT', !previous);

          outgoing.style.setProperty('transition', 'opacity 700ms ease-in-out', 'important');
          outgoing.style.setProperty('opacity', '0', 'important');

          window.setTimeout(function () {
            for (var s = 0; s < slidesRef.length; s++) {
              if (s !== next) deactivateSlideFade(slidesRef[s]);
            }
            activateSlideFade(incoming, played);
            incoming.style.setProperty('opacity', '0', 'important');
            window.requestAnimationFrame(function () {
              incoming.style.setProperty('opacity', '1', 'important');
            });
          }, 700);

          var fadeItems = incoming.querySelectorAll('[id*="__item-"]');
          for (var fi = 0; fi < fadeItems.length; fi++) finalizeEnter(fadeItems[fi], played);

          idx = next;
          window.setTimeout(function () {
            rootRef.classList.remove('nDlJtT', 'KuwcDC');
            busy = false;
          }, duration);
        }

        showImmediately(idx);

        var nextButton = rootRef.querySelector('button[aria-label="Next"]');
        var previousButton = rootRef.querySelector('button[aria-label="Previous"]');
        if (nextButton) {
          nextButton.addEventListener('click', function () {
            transitionTo((idx + 1) % slidesRef.length, false);
          });
        }
        if (previousButton) {
          previousButton.addEventListener('click', function () {
            transitionTo((idx - 1 + slidesRef.length) % slidesRef.length, true);
          });
        }

        if (!reduceMotion) {
          window.setInterval(function () {
            transitionTo((idx + 1) % slidesRef.length, false);
          }, interval);
        }
      })(root, slides);
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
      phraseHost.querySelector('.xjQkF3 .wixui-rich-text__text') ||
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

  /** Text marquees stay paused until Thunderbolt sets direction — start them. */
  function startMarquees() {
    var tracks = document.querySelectorAll('.wixui-text-marquee .Qbdehy, .wixui-text-marquee [data-marquee-animation]');
    for (var i = 0; i < tracks.length; i++) {
      var el = tracks[i];
      var dir = el.getAttribute('data-marquee-animation');
      if (!dir || dir === 'none') {
        el.setAttribute('data-marquee-animation', 'left');
      }
    }
    var roots = document.querySelectorAll('.wixui-text-marquee');
    for (var r = 0; r < roots.length; r++) {
      var root = roots[r];
      root.style.setProperty('--marquee-animation-state', 'running', 'important');
      root.classList.remove('stopMarquee');
      // Strip price chips that should not ride the enroll ticker.
      var prices = root.querySelectorAll('.tsc-course-price');
      for (var p = 0; p < prices.length; p++) {
        if (prices[p].parentNode) prices[p].parentNode.removeChild(prices[p]);
      }
    }
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
    startMarquees();
    centerUnfoldOverPhrase();
    [100, 500, 1500, 3000].forEach(function (ms) {
      window.setTimeout(function () {
        injectBookCallFab();
        removeMentorSessions();
        releaseEnterAndLoops();
        runSlideshows();
        startMarquees();
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
    startMarquees();
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
  window.addEventListener('tsc-course-motion-ready', function () {
    startMarquees();
    releaseEnterAndLoops();
    runSlideshows();
  });
})();
