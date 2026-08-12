const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const publicDir = path.join(__dirname, '..', 'public');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 1. Process Harshad Duhita
console.log('Processing Harshad Duhita EPK...');
const hdDir = path.join(publicDir, 'assets/pages/harshad-duhita');
ensureDir(hdDir);

const hdMp4 = path.join(hdDir, 'epk.mp4');
const hdGif = path.join(hdDir, 'epk.gif');

// HD GIF generation (if not already generated)
if (!fs.existsSync(hdGif)) {
  console.log('Generating Harshad Duhita EPK GIF...');
  try {
    execSync(`ffmpeg -y -i "${hdMp4}" -vf "fps=10,scale=360:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${hdGif}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('Error generating HD GIF:', err);
  }
} else {
  console.log('Harshad Duhita EPK GIF already exists.');
}

// 2. Process Yugm
console.log('\nProcessing Yugm EPK...');
const yugmDir = path.join(publicDir, 'assets/pages/yugm');
ensureDir(yugmDir);

const yugmSourceMp4 = path.join(publicDir, 'assets/mirror/video.wixstatic.com/video/19f989_d9574859659847f4b6bd7157f1246c89/1080p/mp4/file.mp4');
const yugmSourcePoster = path.join(publicDir, 'assets/mirror/static.wixstatic.com/media/19f989_d9574859659847f4b6bd7157f1246c89f000.jpg');

const yugmMp4 = path.join(yugmDir, 'epk.mp4');
const yugmGif = path.join(yugmDir, 'epk.gif');
const yugmPoster = path.join(yugmDir, 'epk-poster.jpg');

// Copy Yugm poster
if (fs.existsSync(yugmSourcePoster) && !fs.existsSync(yugmPoster)) {
  console.log('Copying Yugm poster...');
  fs.copyFileSync(yugmSourcePoster, yugmPoster);
}

// Compress Yugm video
if (!fs.existsSync(yugmMp4)) {
  if (fs.existsSync(yugmSourceMp4)) {
    console.log('Compressing Yugm video (no audio, crf 28)...');
    try {
      execSync(`ffmpeg -y -i "${yugmSourceMp4}" -c:v libx264 -crf 28 -preset medium -an -movflags +faststart "${yugmMp4}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error('Error compressing Yugm video:', err);
    }
  } else {
    console.error(`Source Yugm video not found at: ${yugmSourceMp4}`);
  }
} else {
  console.log('Yugm EPK video already exists.');
}

// Yugm GIF generation
if (!fs.existsSync(yugmGif)) {
  if (fs.existsSync(yugmSourceMp4)) {
    console.log('Generating Yugm EPK GIF...');
    try {
      execSync(`ffmpeg -y -i "${yugmSourceMp4}" -vf "fps=10,scale=360:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${yugmGif}"`, { stdio: 'inherit' });
    } catch (err) {
      console.error('Error generating Yugm GIF:', err);
    }
  }
} else {
  console.log('Yugm EPK GIF already exists.');
}

// 3. Patch HTML files
console.log('\nPatching HTML pages...');

// Patch Harshad Duhita HTML
const hdHtmlPath = path.join(publicDir, 'pages/harshad-duhita.html');
if (fs.existsSync(hdHtmlPath)) {
  let html = fs.readFileSync(hdHtmlPath, 'utf8');
  
  // Replace video tag
  const originalVideoTag = '<video id="comp-mqhv0mup_video" class="X9nqm0" crossorigin="anonymous" playsinline="" preload="auto" muted="" loop=""></video>';
  const newVideoTag = '<video id="comp-mqhv0mup_video" class="X9nqm0" playsinline="" preload="metadata" muted="" loop="" controls="" poster="/assets/pages/harshad-duhita/epk-poster.jpg" src="/assets/pages/harshad-duhita/epk.mp4" data-tsc-epk="1"></video>';
  if (html.includes(originalVideoTag)) {
    html = html.replace(originalVideoTag, newVideoTag);
    console.log('  Patched Harshad Duhita HTML video element.');
  }

  // Replace poster image in wow-image
  const originalPosterImage = '<img loading="lazy" src="/assets/mirror/static.wixstatic.com/media/11062b_a63bd958bdfb41d5ab823737eb7d9e0af000.jpg/v1/fill/w_160,h_90,al_c,q_80,usm_0.66_1.00_0.01,blur_3,enc_avif,quality_auto/11062b_a63bd958bdfb41d5ab823737eb7d9e0af000.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%" width="160" height="90"/>';
  const newPosterImage = '<img loading="lazy" src="/assets/pages/harshad-duhita/epk-poster.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%" width="160" height="90"/>';
  if (html.includes(originalPosterImage)) {
    html = html.replace(originalPosterImage, newPosterImage);
    console.log('  Patched Harshad Duhita HTML poster image.');
  }

  fs.writeFileSync(hdHtmlPath, html, 'utf8');
}

// Patch Yugm HTML
const yugmHtmlPath = path.join(publicDir, 'pages/yugm.html');
if (fs.existsSync(yugmHtmlPath)) {
  let html = fs.readFileSync(yugmHtmlPath, 'utf8');
  
  // Replace video tag
  const originalVideoTag = '<video id="comp-mqji4hyt_video" class="X9nqm0" crossorigin="anonymous" playsinline="" preload="auto" muted="" loop=""></video>';
  const newVideoTag = '<video id="comp-mqji4hyt_video" class="X9nqm0" playsinline="" preload="metadata" muted="" loop="" controls="" poster="/assets/pages/yugm/epk-poster.jpg" src="/assets/pages/yugm/epk.mp4" data-tsc-epk="1"></video>';
  if (html.includes(originalVideoTag)) {
    html = html.replace(originalVideoTag, newVideoTag);
    console.log('  Patched Yugm HTML video element.');
  }

  // Replace poster image
  const originalPosterImage = '<img loading="lazy" src="/assets/mirror/static.wixstatic.com/media/19f989_d9574859659847f4b6bd7157f1246c89f000.jpg/v1/fill/w_51,h_90,al_c,q_80,usm_0.66_1.00_0.01,blur_3,enc_avif,quality_auto/19f989_d9574859659847f4b6bd7157f1246c89f000.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%" width="160" height="90"/>';
  const newPosterImage = '<img loading="lazy" src="/assets/pages/yugm/epk-poster.jpg" alt="" style="width:100%;height:100%;object-fit:cover;object-position:50% 50%" width="160" height="90"/>';
  if (html.includes(originalPosterImage)) {
    html = html.replace(originalPosterImage, newPosterImage);
    console.log('  Patched Yugm HTML poster image.');
  }

  fs.writeFileSync(yugmHtmlPath, html, 'utf8');
}

// 4. Patch JS files (Animations)
console.log('\nPatching JS animation helpers...');

function appendVideoLoaderJS(jsPath, epkSrc, epkGif, epkPoster, videoId, imgContainerSelector, overlaySelector, playBtnLabelSelector) {
  let js = fs.readFileSync(jsPath, 'utf8');
  if (js.includes('tsc-epk-video-patched')) {
    console.log(`  ${path.basename(jsPath)} already patched.`);
    return;
  }

  const patchCode = `
// tsc-epk-video-patched-start
(function() {
  var EPK_SRC = '${epkSrc}';
  var EPK_GIF = '${epkGif}';
  var EPK_POSTER = '${epkPoster}';
  var VIDEO_ID = '${videoId}';

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
        
        var playBtn = document.querySelector('${overlaySelector}');
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
          
          var playBtn = document.querySelector('${overlaySelector}');
          if (playBtn) playBtn.style.display = 'none';
        }
      });
    }

    var posterImg = document.querySelector('${imgContainerSelector}');
    if (posterImg && posterImg.getAttribute('src') !== EPK_POSTER) {
      posterImg.setAttribute('src', EPK_POSTER);
      posterImg.removeAttribute('srcset');
    }

    var playBtnLabel = document.querySelector('${playBtnLabelSelector}');
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
`;

  fs.appendFileSync(jsPath, patchCode, 'utf8');
  console.log(`  Patched ${path.basename(jsPath)} with video loader JS.`);
}

appendVideoLoaderJS(
  path.join(publicDir, 'js/pages/harshad-duhita.animations.js'),
  '/assets/pages/harshad-duhita/epk.mp4',
  '/assets/pages/harshad-duhita/epk.gif',
  '/assets/pages/harshad-duhita/epk-poster.jpg',
  'comp-mqhv0mup_video',
  '#comp-mqhv0mup_img img',
  '#comp-mqhv0muu',
  '#comp-mqhv0mup [aria-label]'
);

appendVideoLoaderJS(
  path.join(publicDir, 'js/pages/yugm.animations.js'),
  '/assets/pages/yugm/epk.mp4',
  '/assets/pages/yugm/epk.gif',
  '/assets/pages/yugm/epk-poster.jpg',
  'comp-mqji4hyt_video',
  '#comp-mqji4hyt_img img',
  '#comp-mqji4hzn',
  '#comp-mqji4hyt [aria-label]'
);

// 5. Patch CSS files (aspect ratio constraints)
console.log('\nPatching CSS aspect ratios...');

const hdCssPath = path.join(publicDir, 'css/pages/harshad-duhita.css');
if (fs.existsSync(hdCssPath)) {
  let css = fs.readFileSync(hdCssPath, 'utf8');
  if (!css.includes('tsc-aspect-ratio-override')) {
    const override = `
/* tsc-aspect-ratio-override-start */
#comp-mqhv0mup,
#comp-mqhv0mup_img,
#comp-mq7lr7n22 {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  aspect-ratio: 9 / 16 !important;
  overflow: hidden !important;
}
#comp-mq7lr7n22 iframe {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: 9 / 16 !important;
}
/* tsc-aspect-ratio-override-end */
`;
    fs.appendFileSync(hdCssPath, override, 'utf8');
    console.log('  Applied CSS aspect ratio override to Harshad Duhita.');
  } else {
    console.log('  Harshad Duhita CSS already overridden.');
  }
}

const yugmCssPath = path.join(publicDir, 'css/pages/yugm.css');
if (fs.existsSync(yugmCssPath)) {
  let css = fs.readFileSync(yugmCssPath, 'utf8');
  if (!css.includes('tsc-aspect-ratio-override')) {
    const override = `
/* tsc-aspect-ratio-override-start */
#comp-mqji4hyt,
#comp-mqji4hyt_img,
#comp-mqhqa6zn5 {
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  aspect-ratio: 9 / 16 !important;
  overflow: hidden !important;
}
/* tsc-aspect-ratio-override-end */
`;
    fs.appendFileSync(yugmCssPath, override, 'utf8');
    console.log('  Applied CSS aspect ratio override to Yugm.');
  } else {
    console.log('  Yugm CSS already overridden.');
  }
}

console.log('\nEPK Patching completed successfully!');
