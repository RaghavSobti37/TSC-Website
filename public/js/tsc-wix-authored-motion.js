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

  function cssUnit(type) {
    return type === 'percentage' ? '%' : type || 'px';
  }

  function rotateZ() {
    return ' rotate(var(--comp-rotate-z, 0deg))';
  }

  function inverseDirection(direction) {
    return { top: 'bottom', right: 'left', bottom: 'top', left: 'right' }[direction] || direction;
  }

  function clipFor(direction, range, end) {
    if (range === 'continuous' && end === 'middle') return 'inset(0%)';
    if ((range === 'in' && end) || (range === 'out' && !end)) return 'inset(0%)';
    var side = range === 'out' ? inverseDirection(direction) : direction;
    if (side === 'top') return 'inset(0% 0% 100% 0%)';
    if (side === 'right') return 'inset(0% 0% 0% 100%)';
    if (side === 'bottom') return 'inset(100% 0% 0% 0%)';
    if (side === 'left') return 'inset(0% 100% 0% 0%)';
    return 'inset(0%)';
  }

  function measureLeft(element) {
    return element && element.getBoundingClientRect ? element.getBoundingClientRect().left : 0;
  }

  function offscreenPair(element, direction, distance) {
    if (distance) {
      var value = distance.value || 400;
      var unit = cssUnit(distance.type || 'px');
      var signed = value * (direction === 'left' ? 1 : -1);
      return [(-signed) + unit, signed + unit];
    }
    var left = measureLeft(element);
    var start = 'calc(' + left + 'px * -1 - 100%)';
    var end = 'calc(100vw - ' + left + 'px)';
    return direction === 'left' ? [start, end] : [end, start];
  }

  function motionPart(element, part) {
    if (!element || !part) return element;
    return element.matches && element.matches('[data-motion-part~="' + part + '"]')
      ? element
      : element.querySelector('[data-motion-part~="' + part + '"]') || element;
  }

  function mediaTarget(element, effectType) {
    if (!element) return null;
    if (effectType === 'BgParallax') {
      return motionPart(element, 'BG_MEDIA').querySelector('img, video, wow-image, wix-image') ||
        motionPart(element, 'BG_MEDIA') ||
        element.querySelector('img, video, wow-image, wix-image') ||
        element;
    }
    if (effectType === 'BgFade') {
      return motionPart(element, 'BG_LAYER');
    }
    return element;
  }

  function keyframesFor(effect, element) {
    var named = effect.namedEffect || {};
    var type = named.type;
    if (type === 'BgParallax' || type === 'ParallaxScroll') {
      var travel = 50 * (typeof named.speed === 'number' ? named.speed : 0.5);
      return [
        { transform: 'translateY(calc(-1 * ' + travel + 'vh))' + rotateZ() },
        { transform: 'translateY(' + travel + 'vh)' + rotateZ() }
      ];
    }
    if (type === 'BgFade') {
      var bgOut = named.range === 'out';
      return [
        { opacity: bgOut ? 1 : 0 },
        { opacity: bgOut ? 0 : 1 }
      ];
    }
    if (type === 'ArcScroll') {
      var arcRange = named.range || 'in';
      var arcAxis = named.direction === 'vertical' ? 'X' : 'Y';
      return [
        { transform: 'perspective(500px) translateZ(-300px) rotate' + arcAxis + '(' + (arcRange === 'out' ? 0 : -68) + 'deg) translateZ(300px)' + rotateZ() },
        { transform: 'perspective(500px) translateZ(-300px) rotate' + arcAxis + '(' + (arcRange === 'in' ? 0 : 68) + 'deg) translateZ(300px)' + rotateZ() }
      ];
    }
    if (type === 'MoveScroll') {
      var moveRange = named.range || 'in';
      var distance = named.power === 'soft' ? { value: 150, type: 'px' } :
        named.power === 'medium' ? { value: 400, type: 'px' } :
        named.power === 'hard' ? { value: 800, type: 'px' } :
        named.distance || { value: 400, type: 'px' };
      var angle = (typeof named.angle === 'number' ? named.angle : 210) - 90;
      var radians = angle * Math.PI / 180;
      var x = Math.round(Math.cos(radians) * (distance.value || 0));
      var y = Math.round(Math.sin(radians) * (distance.value || 0));
      var unit = cssUnit(distance.type || 'px');
      var fromX = moveRange === 'out' ? 0 : x;
      var fromY = moveRange === 'out' ? 0 : y;
      var toX = moveRange === 'in' ? 0 : moveRange === 'out' ? x : -x;
      var toY = moveRange === 'in' ? 0 : moveRange === 'out' ? y : -y;
      return [
        { transform: 'translate(' + fromX + unit + ', ' + fromY + unit + ')' + rotateZ() },
        { transform: 'translate(' + toX + unit + ', ' + toY + unit + ')' + rotateZ() }
      ];
    }
    if (type === 'SlideScroll') {
      var slideDirection = named.direction || 'bottom';
      var slideRange = named.range || 'in';
      var slideVectors = {
        bottom: { x: '0', y: '100%' },
        left: { x: '-100%', y: '0' },
        top: { x: '0', y: '-100%' },
        right: { x: '100%', y: '0' }
      };
      var opposite = inverseDirection(slideDirection);
      var from = slideRange === 'out' ? { x: '0', y: '0' } : slideVectors[slideDirection];
      var to = slideRange === 'in' ? { x: '0', y: '0' } : slideVectors[slideRange === 'out' ? slideDirection : opposite];
      return [
        { clipPath: clipFor(slideDirection, slideRange, false), transform: rotateZ().trim() + ' translate(' + from.x + ', ' + from.y + ')' },
        { clipPath: clipFor(slideDirection, slideRange, true), transform: rotateZ().trim() + ' translate(' + to.x + ', ' + to.y + ')' }
      ];
    }
    if (type === 'SkewPanScroll') {
      var skewRange = named.range || 'in';
      var skewPower = { soft: 10, medium: 17, hard: 24 };
      var skew = (named.power && skewPower[named.power] ? skewPower[named.power] : (typeof named.skew === 'number' ? named.skew : 10)) *
        (named.direction === 'left' ? 1 : -1);
      var pan = offscreenPair(element, named.direction || 'right');
      var startX = skewRange === 'out' ? 0 : pan[0];
      var endX = skewRange === 'in' ? 0 : skewRange === 'out' ? pan[0] : pan[1];
      var fromSkew = skewRange === 'out' ? 0 : skew;
      var toSkew = skewRange === 'in' ? 0 : -skew;
      return [
        { transform: 'translateX(' + startX + ') skewX(' + fromSkew + 'deg)' + rotateZ() },
        { transform: 'translateX(' + endX + ') skewX(' + toSkew + 'deg)' + rotateZ() }
      ];
    }
    if (type === 'FlipScroll') {
      var flipPower = { soft: 60, medium: 120, hard: 420 };
      var rotate = named.power && flipPower[named.power] ? flipPower[named.power] : (typeof named.rotate === 'number' ? named.rotate : 240);
      var rotateAxis = named.direction === 'vertical' ? 'X' : 'Y';
      var flipRange = named.range || 'continuous';
      return [
        { transform: 'perspective(800px) rotate' + rotateAxis + '(' + (flipRange === 'out' ? 0 : -rotate) + 'deg)' + rotateZ() },
        { transform: 'perspective(800px) rotate' + rotateAxis + '(' + (flipRange === 'in' ? 0 : rotate) + 'deg)' + rotateZ() }
      ];
    }
    return null;
  }

  function makeScrollEffect(element, effect) {
    var frames = keyframesFor(effect, element);
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
