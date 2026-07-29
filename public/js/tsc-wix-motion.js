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
    css.href = '/css/tsc-wix-motion.css?v=testi-center-1';
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
    if (el.dataset.motionEnter === 'done') return;
    el.dataset.motionEnter = 'done';
    // Clear pause only — do not touch animation-name (avoids mid-flight restarts).
    if (el.style.getPropertyValue('animation-play-state')) {
      el.style.removeProperty('animation-play-state');
    }
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

  function removeMentorSessions() {
    var ids = ['comp-mpl387ie', 'comp-mrufx9ud', 'comp-mpjxxeqt', 'comp-mrufx9rd2'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }
    var sections = document.querySelectorAll('section[data-testid="section-container"], main section');
    for (var s = 0; s < sections.length; s++) {
      var section = sections[s];
      var text = (section.textContent || '').replace(/\s+/g, ' ');
      if (
        (/Mentor Sessions/i.test(text) && /Upcoming courses with industry experts/i.test(text)) ||
        (/Luca Petracca/i.test(text) && /Geet Sagar/i.test(text) && /COMING SOON/i.test(text))
      ) {
        if (section.parentNode) section.parentNode.removeChild(section);
      }
    }
  }

  function boot() {
    removeMentorSessions();
    releaseEnterAndLoops();
    runSlideshows();
    [100, 500, 1500, 3000].forEach(function (ms) {
      window.setTimeout(function () {
        removeMentorSessions();
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
    removeMentorSessions();
    releaseEnterAndLoops();
    runSlideshows();
  });
})();
