/*
 * Author-authored Wix motion mapper.
 *
 * Static Thunderbolt mirrors can miss scrub/view-progress effects even though
 * the original motion payload is present. This maps the existing Wix
 * namedEffect data to WAAPI effects without inventing new timings or targets.
 */
(function () {
  if (window.__tscWixAuthoredMotion) return;
  window.__tscWixAuthoredMotion = true;

  var routePayloads = {
    '/': 'thunderbolt-features--19f989_ee80f317bf89e6216cc9c510c9e545d7_1360.json--desktop--f145183b.bundle.min.json',
    '/about': 'thunderbolt-features--19f989_ed01b585eb5b79e5069c93f6d6ccf82c_1342.json--desktop--f145183b.bundle.min.json',
    '/work': 'thunderbolt-features--19f989_a89e6d8c684584a5a5841afdb9e1d6eb_1316.json--desktop--f145183b.bundle.min.json',
    '/artists': 'thunderbolt-features--19f989_363e917e98e6d1f48f732c46aef87fd1_1362.json--desktop--f145183b.bundle.min.json',
    '/artist-path': 'thunderbolt-features--19f989_0acee9e71a994e6d376e0bba81dfa461_1365.json--desktop--f145183b.bundle.min.json',
    '/learn-with-tsc': 'thunderbolt-features--19f989_ecfdda4745d283863acf8267776ef2fd_1305.json--desktop--f145183b.bundle.min.json',
    '/films': 'thunderbolt-features--19f989_6e16e7b8d427e689039e2c59c89523fa_1301.json--desktop--f145183b.bundle.min.json',
    '/resources': 'thunderbolt-features--19f989_a2ea6c0a2625ceae9b9c795b2052630f_1336.json--desktop--f145183b.bundle.min.json',
    '/academy': 'thunderbolt-features--19f989_2989b66cd25e783b84617171c4c13822_1362.json--desktop--f145183b.bundle.min.json'
  };

  function canonicalPath() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    if (path.indexOf('/pages/') === 0 && /\.html$/i.test(path)) {
      path = '/' + path.split('/').pop().replace(/\.html$/i, '');
      if (path === '/home') path = '/';
    }
    return path;
  }

  function payloadUrl() {
    var file = routePayloads[canonicalPath()];
    return file ? '/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt/' + file : '';
  }

  function offsetPercent(offset, fallback) {
    return offset && offset.offset && typeof offset.offset.value === 'number' ? offset.offset.value / 100 : fallback;
  }

  function progressFor(element, start, end) {
    var rect = element.getBoundingClientRect();
    var viewport = window.innerHeight || document.documentElement.clientHeight || 1;
    var raw = (viewport - rect.top) / Math.max(1, viewport + rect.height);
    var range = Math.max(0.001, end - start);
    return Math.max(0, Math.min(1, (raw - start) / range));
  }

  function mediaTarget(element, effectType) {
    if (!element) return null;
    if (effectType === 'BgParallax') {
      return element.querySelector('img, video, wow-image, wix-image') || element;
    }
    return element;
  }

  function keyframesFor(effect) {
    var named = effect.namedEffect || {};
    var type = named.type;
    if (type === 'BgParallax' || type === 'ParallaxScroll') {
      var travel = 50 * (typeof named.speed === 'number' ? named.speed : 0.5);
      return [
        { transform: 'translateY(' + (-travel) + 'vh)' },
        { transform: 'translateY(' + travel + 'vh)' }
      ];
    }
    if (type === 'SlideScroll') {
      var distance = named.range === 'out' ? 0 : 48;
      var axis = named.direction === 'left' || named.direction === 'right' ? 'X' : 'Y';
      var sign = named.direction === 'top' || named.direction === 'left' ? -1 : 1;
      return [
        { transform: 'translate' + axis + '(' + (distance * sign) + 'px)' },
        { transform: 'translate' + axis + '(0px)' }
      ];
    }
    if (type === 'SkewPanScroll') {
      var skew = typeof named.skew === 'number' ? named.skew : 17;
      var skewSign = named.direction === 'left' ? -1 : 1;
      return [
        { transform: 'skewX(' + (skew * skewSign) + 'deg)' },
        { transform: 'skewX(0deg)' }
      ];
    }
    if (type === 'FlipScroll') {
      var rotate = typeof named.rotate === 'number' ? named.rotate : 90;
      var rotateAxis = named.direction === 'vertical' ? 'X' : 'Y';
      return [
        { transform: 'perspective(800px) rotate' + rotateAxis + '(0deg)' },
        { transform: 'perspective(800px) rotate' + rotateAxis + '(' + rotate + 'deg)' }
      ];
    }
    return null;
  }

  function makeScrollEffect(element, effect) {
    var frames = keyframesFor(effect);
    if (!frames || !element || !element.animate) return null;
    var target = mediaTarget(element, (effect.namedEffect || {}).type);
    var animation = target.animate(frames, {
      duration: 1000,
      fill: effect.fill || 'both',
      easing: 'linear',
      iterations: 1
    });
    animation.pause();
    return {
      source: element,
      animation: animation,
      start: offsetPercent(effect.startOffset, 0),
      end: offsetPercent(effect.endOffset, 1)
    };
  }

  function bindPointerEffect(element, effect) {
    var named = effect.namedEffect || {};
    if (named.type !== 'Tilt3DMouse' || !element) return;
    var angle = typeof named.angle === 'number' ? named.angle : 15;
    var perspective = typeof named.perspective === 'number' ? named.perspective : 1000;
    element.addEventListener('pointermove', function (event) {
      var rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty('transform', 'perspective(' + perspective + 'px) rotateX(' + (-y * angle) + 'deg) rotateY(' + (x * angle) + 'deg)');
    }, { passive: true });
    element.addEventListener('pointerleave', function () {
      element.style.removeProperty('transform');
    }, { passive: true });
  }

  function init(payload) {
    var motion = payload && payload.props && payload.props.motion && payload.props.motion.animationDataByCompId;
    if (!motion) return;
    var scrollEffects = [];
    var pointerBound = {};
    function bindAvailable() {
      Object.keys(motion).forEach(function (compId) {
        var element = document.getElementById(compId);
        if (!element || element.dataset.tscWixAuthoredMotionBound === '1') return;
        element.dataset.tscWixAuthoredMotionBound = '1';
        Object.keys(motion[compId] || {}).forEach(function (effectId) {
          (motion[compId][effectId] || []).forEach(function (effect) {
            if (effect.type !== 'ScrubAnimationOptions') return;
            if ((effect.namedEffect || {}).type === 'Tilt3DMouse') {
              if (!pointerBound[compId]) {
                pointerBound[compId] = true;
                bindPointerEffect(element, effect);
              }
              return;
            }
            var mapped = makeScrollEffect(element, effect);
            if (mapped) scrollEffects.push(mapped);
          });
        });
      });
    }
    bindAvailable();
    [80, 250, 600, 1200, 2200, 4000].forEach(function (delay) {
      window.setTimeout(function () {
        bindAvailable();
        tick();
      }, delay);
    });
    function tick() {
      bindAvailable();
      scrollEffects.forEach(function (entry) {
        var progress = progressFor(entry.source, entry.start, entry.end);
        entry.animation.currentTime = progress * 1000;
      });
    }
    window.addEventListener('scroll', tick, { passive: true });
    document.addEventListener('scroll', tick, true);
    window.addEventListener('resize', tick);
    [0, 120, 500, 1200].forEach(function (delay) {
      window.setTimeout(tick, delay);
    });
    tick();
  }

  function boot() {
    var url = payloadUrl();
    if (!url || !window.fetch) return;
    fetch(url).then(function (response) {
      return response.ok ? response.json() : null;
    }).then(init).catch(function () {});
  }

  if (document.body) {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  }
})();
