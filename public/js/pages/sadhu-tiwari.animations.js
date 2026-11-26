// Page animation bootstrap extracted for yugm.
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
    });// Sadhu Tiwari media on the YUGM layout: Wix keeps re-applying the template's
// photos, so set Sadhu's images (and labels) on every pass and guard against reverts.
(function () {
  var Y = 'https://i.ytimg.com/vi/';
  var IMAGES = {
    'img-comp-mqhqa6y01': [Y + 'Mri6_BCaUpk/maxresdefault.jpg', '22% 30%'],
    'comp-mqji4hyt_img': [Y + 'fOQ_4x9Gmok/maxresdefault.jpg', '50% 40%'],
    'img-comp-mqhqa7052': [Y + 'xpUh21LdPuI/maxresdefault.jpg', '50% 50%'],
    'img-comp-mqhqa707': [Y + 'fOQ_4x9Gmok/maxresdefault.jpg', '50% 40%'],
    'img-comp-mqhqa70z5': [Y + 'Q4SQb0iSVas/maxresdefault.jpg', '70% 40%'],
    'img-comp-mqjlrudj': [Y + 'Mri6_BCaUpk/maxresdefault.jpg', '25% 35%'],
    'img-comp-mqjjks9s': [Y + 'Mri6_BCaUpk/maxresdefault.jpg', '20% 35%'],
    'img-comp-mqjimmpk': [Y + 'Q4SQb0iSVas/maxresdefault.jpg', '70% 40%'],
    'img-comp-mqhqa73t2__item1': [Y + 'rjfxLq3OQ0w/maxresdefault.jpg', '50% 50%'],
    'img-comp-mqhqa73t2__item-j9ples3e': [Y + 'xpUh21LdPuI/maxresdefault.jpg', '50% 50%'],
    'img-comp-mqhqa73t2__item-j9plerjk': [Y + 'Mri6_BCaUpk/maxresdefault.jpg', '22% 50%'],
    'img-comp-mqi6gg5o2__item1': [Y + 'irbvn45c7wU/maxresdefault.jpg', '50% 50%'],
    'img-comp-mqi6gg5o2__item-j9ples3e': [Y + 'hzZemQVdTJw/maxresdefault.jpg', '50% 50%'],
    'img-comp-mqi6gg5o2__item-j9plerjk': ['https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/a2/02/eb/a202eb0e-9f54-ae1f-ff42-52e2221e25bd/840214416545.png/600x600bb.jpg', '50% 50%']
  };
  var VIDEO_BOX = 'comp-mqji4hyt';
  var EMBED = 'https://www.youtube-nocookie.com/embed/fOQ_4x9Gmok?rel=0&playsinline=1';

  function applyImages() {
    Object.keys(IMAGES).forEach(function (id) {
      var host = document.getElementById(id);
      var img = host && (host.tagName === 'IMG' ? host : host.querySelector('img'));
      if (!img) return;
      var want = IMAGES[id];
      if (img.getAttribute('src') !== want[0]) img.setAttribute('src', want[0]);
      if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
      img.style.objectPosition = want[1];
      img.alt = 'Sadhu Tiwari';
      if (!img.__tscSadhuGuard && window.MutationObserver) {
        img.__tscSadhuGuard = true;
        new MutationObserver(function () {
          if (img.getAttribute('src') !== want[0]) img.setAttribute('src', want[0]);
          if (img.hasAttribute('srcset')) img.removeAttribute('srcset');
        }).observe(img, { attributes: true, attributeFilter: ['src', 'srcset'] });
      }
    });
  }

  function applyVideo() {
    var box = document.getElementById(VIDEO_BOX);
    if (!box || box.querySelector('iframe[data-tsc-sadhu]')) return;
    var frame = document.createElement('iframe');
    frame.setAttribute('data-tsc-sadhu', '1');
    frame.src = EMBED;
    frame.title = 'Sadhu Tiwari receives Best Music Director at the Jagran Film Festival Awards 2026';
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
    frame.allowFullscreen = true;
    frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:5;background:#000;border-radius:inherit;';
    box.style.position = 'relative';
    box.appendChild(frame);
    var video = box.querySelector('video');
    if (video) { try { video.pause(); } catch (e) {} video.removeAttribute('autoplay'); video.removeAttribute('src'); }
    box.querySelectorAll('[aria-label*="Play video"]').forEach(function (n) { n.setAttribute('aria-label', 'Sadhu Tiwari award video'); });
  }

  // The Apple Music button reuses YUGM's Facebook slot; show a music icon instead.
  var NOTE_PATH = 'M19 3v12.5a3 3 0 1 1-2-2.8V8.2l-8 1.8v7.5a3 3 0 1 1-2-2.8V6l12-3Z';
  function applyIcons() {
    ['comp-mqhqa75r'].forEach(function (id) {
      var host = document.getElementById(id);
      var svg = host && host.querySelector('svg');
      if (!svg || svg.getAttribute('data-tsc-note') === '1') return;
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('data-tsc-note', '1');
      // Match the colour of the template's other button icons.
      var ref = document.querySelector('#comp-mqhqa75j svg path, #comp-mqhqa75v svg path');
      var fill = ref ? window.getComputedStyle(ref).fill : '#FFECD1';
      svg.innerHTML = '<path fill="' + fill + '" d="' + NOTE_PATH + '"></path>';
    });
  }

  function apply() { applyImages(); applyVideo(); applyIcons(); }
  function boot() {
    apply();
    [100, 400, 1000, 2500, 5000, 8000].forEach(function (d) { setTimeout(apply, d); });
    document.addEventListener('scroll', function () { apply(); }, { passive: true, capture: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
