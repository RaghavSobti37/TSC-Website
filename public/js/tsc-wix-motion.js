/**
 * Wix Thunderbolt leaves enter/loop animations paused until its runtime sets
 * data-motion-enter="done". Static clone never gets that — hero stays blurry /
 * slideshow words never cycle. Finish enter motions + rotate slideshows here.
 */
(function () {
  var STORAGE_KEY = 'wix-motion-played-animations';
  var ENTER_RE = /motion-(fadeIn|blurIn|flipIn)/;
  var LOOP_RE = /motion-(breathe|pulse|wiggle)/;
  if (!document.querySelector('link[data-tsc-wix-motion-css]')) {
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = '/css/tsc-wix-motion.css';
    css.setAttribute('data-tsc-wix-motion-css', '1');
    (document.head || document.documentElement).appendChild(css);
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
    el.dataset.motionEnter = 'done';
    el.style.removeProperty('animation-play-state');
    if (el.id && played) {
      played[el.id] = true;
      writePlayed(played);
    }
  }

  function isSlideshowItem(el) {
    return !!(el && el.id && el.id.indexOf('__item-') !== -1);
  }

  function releaseEnterAndLoops() {
    var played = readPlayed();
    var nodes = document.querySelectorAll('[id^="comp-"]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el || !el.id) continue;
      if (isSlideshowItem(el)) continue;

      if (played[el.id] || reduceMotion) {
        finalizeEnter(el, played);
        continue;
      }

      var cs = window.getComputedStyle(el);
      var names = String(cs.animationName || '');
      var playState = String(cs.animationPlayState || '');
      if (!names || names === 'none') continue;

      var isEnter = ENTER_RE.test(names);
      var isLoop = LOOP_RE.test(names);

      if (isEnter && el.dataset.motionEnter !== 'done') {
        // Play briefly when paused, then always finish enter (Thunderbolt absent).
        if (playState.indexOf('paused') !== -1 && !reduceMotion) {
          el.style.setProperty('animation-play-state', 'running');
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
        el.style.setProperty('animation-play-state', 'running');
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

  function boot() {
    releaseEnterAndLoops();
    runSlideshows();
    [100, 500, 1500, 3000].forEach(function (ms) {
      window.setTimeout(function () {
        releaseEnterAndLoops();
        runSlideshows();
      }, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.addEventListener('load', function () {
    releaseEnterAndLoops();
    runSlideshows();
  });
})();
