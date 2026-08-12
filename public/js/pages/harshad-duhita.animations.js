// Page animation bootstrap extracted for harshad-duhita.
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
// tsc-epk-video-patched-start
(function() {
  var EPK_SRC = '/assets/pages/harshad-duhita/epk.mp4';
  var EPK_POSTER = '/assets/pages/harshad-duhita/epk-poster.jpg';
  var VIDEO_ID = 'comp-mqhv0mup_video';

  function applyEpkVideo() {
    var video = document.getElementById(VIDEO_ID);
    if (!video || video.tagName.toLowerCase() !== 'video') return false;

    video.removeAttribute('crossorigin');
    video.setAttribute('data-tsc-epk', '1');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('poster', EPK_POSTER);
    video.setAttribute('muted', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.playsInline = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.controls = true;

    if (video.getAttribute('src') !== EPK_SRC) {
      video.src = EPK_SRC;
      try { video.load(); } catch (e) {}
    }

    try { video.play(); } catch (e) {}

    var posterImg = document.querySelector('#comp-mqhv0mup_img img');
    if (posterImg && posterImg.getAttribute('src') !== EPK_POSTER) {
      posterImg.setAttribute('src', EPK_POSTER);
      posterImg.removeAttribute('srcset');
    }

    var playBtnLabel = document.querySelector('#comp-mqhv0mup [aria-label]');
    if (playBtnLabel) {
      playBtnLabel.setAttribute('aria-label', 'Artist EPK Play video');
    }

    if (!video.__tscEpkGuard) {
      video.__tscEpkGuard = true;
      if (window.MutationObserver) {
        new MutationObserver(function() {
          if (video.getAttribute('src') !== EPK_SRC) {
            video.src = EPK_SRC;
            try { video.load(); } catch (e) {}
          }
        }).observe(video, { attributes: true, attributeFilter: ['src'] });
      }
    }

    return true;
  }

  function boot() {
    applyEpkVideo();
    [100, 400, 1000, 2500, 5000].forEach(function(delay) {
      window.setTimeout(applyEpkVideo, delay);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  window.addEventListener('load', applyEpkVideo);
})();
// tsc-epk-video-patched-end