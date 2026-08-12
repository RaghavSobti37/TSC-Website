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
    });
// tsc-epk-video-patched-start
(function() {
  var EPK_SRC = '/assets/pages/yugm/epk.mp4';
  var EPK_GIF = '/assets/pages/yugm/epk.gif';
  var EPK_POSTER = '/assets/pages/yugm/epk-poster.jpg';
  var VIDEO_ID = 'comp-mqji4hyt_video';

  function isEpkSrc(value) {
    return typeof value === 'string' && (value.indexOf(EPK_SRC) !== -1 || value.indexOf(EPK_GIF) !== -1);
  }

  function applyEpkVideo() {
    var video = document.getElementById(VIDEO_ID);
    if (!video) return false;

    // Check if we should use GIF directly (via query param or autoplay block fallback)
    var useGif = window.location.search.indexOf('gif=true') !== -1;

    if (useGif) {
      if (video.tagName.toLowerCase() === 'video') {
        var img = document.createElement('img');
        img.id = video.id;
        img.className = video.className;
        img.src = EPK_GIF;
        img.alt = "Artist EPK";
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        video.parentNode.replaceChild(img, video);
        
        var playBtn = document.querySelector('#comp-mqji4hzn');
        if (playBtn) playBtn.style.display = 'none';
      }
      return true;
    }

    video.removeAttribute('crossorigin');
    video.setAttribute('data-tsc-epk', '1');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('poster', EPK_POSTER);
    video.playsInline = true;
    video.loop = true;
    video.muted = true;
    video.defaultMuted = true;
    video.controls = true;

    if (!isEpkSrc(video.getAttribute('src')) && !isEpkSrc(video.currentSrc)) {
      video.src = EPK_SRC;
      try { video.load(); } catch (e) {}
    }

    // Try autoplay and fallback to GIF if blocked (e.g. low power mode)
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(function(err) {
        console.warn("Video play failed, falling back to GIF:", err);
        if (video.tagName.toLowerCase() === 'video') {
          var img = document.createElement('img');
          img.id = video.id;
          img.className = video.className;
          img.src = EPK_GIF;
          img.alt = "Artist EPK";
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          img.style.position = 'absolute';
          img.style.top = '0';
          img.style.left = '0';
          video.parentNode.replaceChild(img, video);
          
          var playBtn = document.querySelector('#comp-mqji4hzn');
          if (playBtn) playBtn.style.display = 'none';
        }
      });
    }

    var posterImg = document.querySelector('#comp-mqji4hyt_img img');
    if (posterImg && posterImg.getAttribute('src') !== EPK_POSTER) {
      posterImg.setAttribute('src', EPK_POSTER);
      posterImg.removeAttribute('srcset');
    }

    var playBtnLabel = document.querySelector('#comp-mqji4hyt [aria-label]');
    if (playBtnLabel) {
      playBtnLabel.setAttribute('aria-label', 'Artist EPK Play video');
    }

    if (!video.__tscEpkGuard) {
      video.__tscEpkGuard = true;
      if (window.MutationObserver) {
        new MutationObserver(function() {
          if (!isEpkSrc(video.getAttribute('src'))) {
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
    [100, 400, 1000, 2500, 5000, 10000].forEach(function(delay) {
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