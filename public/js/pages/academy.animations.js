// Page animation bootstrap extracted from academy/index.html.
// Kept separate so page-level animation behavior can be edited without touching the static HTML.
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

// academy-mobile-redesign-start
(function() {
  function injectAcademyMobile() {
    if (document.querySelector('.tsc-academy-mobile-redesign')) return;
    var header = document.getElementById('comp-mrsu5g8j');
    if (!header) return;
    header.insertAdjacentHTML('afterend', [
      '<main class="tsc-academy-mobile-redesign" aria-label="TSC Academy mobile layout">',
      '  <section class="tsc-am-hero">',
      '    <div class="tsc-am-hero__copy">',
      '      <p>WELCOME TO TSC</p>',
      '      <h1>Unfolding<br>Artist Force</h1>',
      '      <span>Learning, guidance and incubation for artists ready to grow.</span>',
      '      <div class="tsc-am-actions"><a href="#tsc-mobile-courses">Explore Courses</a><a class="tsc-am-call" href="/book-a-call" aria-label="Book a call">Call</a></div>',
      '    </div>',
      '  </section>',
      '  <section class="tsc-am-intro">',
      '    <p class="tsc-am-kicker">ARE YOU READY?</p>',
      '    <h2>Every artist has a story waiting to unfold.</h2>',
      '    <p>TSC Academy is a learning ecosystem led by industry professionals. We help artists grow with the right learning, guidance, and opportunities.</p>',
      '    <div class="tsc-am-feature-grid">',
      '      <article><span>01</span><h3>Courses for Your Journey</h3><p>Learn through carefully curated learning paths.</p></article>',
      '      <article><span>02</span><h3>Learn from Industry Mentors</h3><p>Learn from leading professionals with real industry experience.</p></article>',
      '      <article><span>03</span><h3>Audition & Practice Area</h3><p>Build your skills and confidence.</p></article>',
      '      <article><span>04</span><h3>Scholarships for Artists</h3><p>We reward potential and passion.</p></article>',
      '      <article><span>05</span><h3>Unconditional Support</h3><p>We understand your journey and support you at every step.</p></article>',
      '      <article><span>06</span><h3>Serving the Community</h3><p>Built for artists, by artists.</p></article>',
      '    </div>',
      '  </section>',
      '  <section class="tsc-am-courses" id="tsc-mobile-courses">',
      '    <h2>Courses</h2>',
      '    <a class="tsc-am-course" href="/music-production"><img src="/assets/mirror/static.wixstatic.com/media/19f989_9c70d1615227488dbbf761995637df24~mv2.jpg/v1/fill/w_420,h_220,al_c,q_80,enc_avif,quality_auto/2.jpg" alt=""><span><small>MUSIC PRODUCTION</small><strong>Foundations of Music Production</strong><em>Build your sound. From idea to your first track.</em></span><b aria-hidden="true">→</b></a>',
      '    <a class="tsc-am-course" href="/roots-of-hindustani-classical"><img src="/assets/mirror/static.wixstatic.com/media/19f989_de650661cdd649e8b08d1c365e9ab667~mv2.jpg/v1/crop/x_0,y_231,w_3936,h_1981/fill/w_420,h_220,al_c,q_80,enc_avif,quality_auto/BLU01769.jpg" alt=""><span><small>VOCALS</small><strong>Voice Culture</strong><em>Strengthen your voice with technique and expression.</em></span><b aria-hidden="true">→</b></a>',
      '  </section>',
      '  <section class="tsc-am-stories">',
      '    <h2>Artist Stories</h2>',
      '    <article><p>Attending a session with Sandesh ji was a turning point. This program helped me craft my imagination and translate it into music.</p><strong>Vamsi Vaidah!</strong><span>TSC Student</span><b aria-hidden="true">→</b></article>',
      '  </section>',
      '  <section class="tsc-am-guidance">',
      '    <h2>Still unsure where to start? Let’s talk.</h2>',
      '    <p>Personalised guidance to help you begin with clarity and confidence.</p>',
      '    <img src="/assets/mirror/static.wixstatic.com/media/19f989_de650661cdd649e8b08d1c365e9ab667~mv2.jpg/v1/crop/x_0,y_231,w_3936,h_1981/fill/w_660,h_210,al_c,q_80,enc_avif,quality_auto/BLU01769.jpg" alt="TSC Academy mentors and artists">',
      '    <div class="tsc-am-mini-grid"><span>Personalised Roadmap</span><span>Curriculum Support</span><span>Mentorship Access</span><span>Scholarship Guidance</span></div>',
      '    <div class="tsc-am-cta-row"><a href="/book-a-call">Book a Call</a><a href="#tsc-mobile-courses">Find Your Course</a></div>',
      '  </section>',
      '</main>'
    ].join(''));
  }

  function cleanAcademyTicker() {
    document.querySelectorAll('body *').forEach(function(el) {
      if (!el.children.length && /(?:₹|Rs\.?)\s*3,?999/i.test(el.textContent || '')) {
        el.textContent = el.textContent.replace(/(?:₹|Rs\.?)\s*3,?999\s*/ig, '');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      injectAcademyMobile();
      cleanAcademyTicker();
    });
  } else {
    injectAcademyMobile();
    cleanAcademyTicker();
  }
  window.addEventListener('load', function() {
    injectAcademyMobile();
    cleanAcademyTicker();
  });
  [250, 1000, 2500].forEach(function(delay) {
    window.setTimeout(cleanAcademyTicker, delay);
  });
  new MutationObserver(cleanAcademyTicker).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
// academy-mobile-redesign-end

// tsc-link-normalizer-start
(function() {
  var routeMap = {
  "/blank-7": "/mba",
  "/work/mba": "/mba",
  "/work2": "/havells-myousic",
  "/work/havells-myousic": "/havells-myousic",
  "/work3": "/insta-music-league",
  "/work/insta-music-league": "/insta-music-league",
  "/work0": "/young-gunns",
  "/work/young-gunns": "/young-gunns",
  "/blank-10": "/harshad-duhita",
  "/artists/harshad-duhita": "/harshad-duhita",
  "/blank-9-1": "/roots-of-hindustani-classical",
  "/about-9-1": "/roots-of-hindustani-classical",
  "/academy/roots-of-hindustani-classical": "/roots-of-hindustani-classical",
  "/blank-9": "/the-heart-of-composition",
  "/about-9": "/the-heart-of-composition",
  "/academy/the-heart-of-composition": "/the-heart-of-composition",
  "/blank-13": "/blog-1",
  "/resources/blog-1": "/blog-1",
  "/blank-10-1": "/yugm",
  "/work0-1": "/yugm",
  "/artists/yugm": "/yugm",
  "/blank-12-1-1": "/mahaprbhu",
  "/work2-1-1": "/mahaprbhu",
  "/films/mahaprbhu": "/mahaprbhu",
  "/blank-12": "/mahavatar-narsimha",
  "/films/mahavatar-narsimha": "/mahavatar-narsimha",
  "/blank-12-1": "/hanuman-ansh",
  "/work2-1": "/hanuman-ansh",
  "/films/hanuman-ansh": "/hanuman-ansh",
  "/blank-13-1-1": "/blog-3",
  "/work3-1-1": "/blog-3",
  "/resources/blog-3": "/blog-3",
  "/blank-13-1": "/blog-2",
  "/work3-1": "/blog-2",
  "/resources/blog-2": "/blog-2",
  "/resources/from-bhajan-to-clubbing": "/from-bhajan-to-clubbing",
  "/resources/you-released-a-song-now-what": "/you-released-a-song-now-what",
  "/blank-6": "/collab-query",
  "/forms/collab-query": "/collab-query",
  "/blank-12-1-1-1": "/kalki",
  "/work2-1-1-1": "/kalki",
  "/films/kalki": "/kalki",
  "/blank-8-1": "/book-an-artist",
  "/about-8-1": "/book-an-artist",
  "/forms/book-an-artist": "/book-an-artist",
  "/blank-8-1-1": "/artist-query",
  "/about-8-1-1": "/artist-query",
  "/forms/artist-query": "/artist-query",
  "/blank-8": "/book-a-call",
  "/about-8": "/book-a-call",
  "/forms/book-a-call": "/book-a-call",
  "/forms/masterclass-review01": "/masterclass-review01",
  "/forms/classicalreview": "/classicalreview",
  "/forms/masterclass-review02": "/masterclass-review02"
};
  var academyPaths = {
    '/academy': true,
    '/learn-with-tsc': true,
    '/the-heart-of-composition': true,
    '/roots-of-hindustani-classical': true,
    '/book-a-call': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };
  function normalizeAnchor(anchor) {
    try {
      var url = new URL(anchor.getAttribute('href'), location.origin);
      var target = routeMap[url.pathname];
      if (!target && url.pathname === '/artists' && /book\s+an\s+artist/i.test(anchor.textContent || '')) {
        target = '/query';
      }
      if (!target) return;
      var nextHref = target + url.search + url.hash;
      if (anchor.getAttribute('href') !== nextHref) anchor.setAttribute('href', nextHref);
    } catch (e) {}
  }
  function normalizeAcademyLogoLinks() {
    if (!academyPaths[location.pathname]) return;
    document.querySelectorAll('header a[href], [class*="wixui-header"] a[href]').forEach(function(anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var isHomeLink = url.pathname === '/' || url.pathname === '/blank-3';
        var isLogo = !!anchor.closest('.wixui-vector-image, [class*="wixui-vector-image"]');
        if (isHomeLink && isLogo && anchor.getAttribute('href') !== '/academy') {
          anchor.setAttribute('href', '/academy');
          anchor.setAttribute('target', '_self');
        }
      } catch (e) {}
    });
  }
  function normalizeLinks() {
    document.querySelectorAll('a[href]').forEach(normalizeAnchor);
    document.querySelectorAll('a[href="/book-an-artist"]').forEach(function(anchor) {
      if (/book\s+an\s+artist|partner\s+with\s+us/i.test(anchor.textContent || '') || location.pathname === '/artists') {
        if (anchor.getAttribute('href') !== '/query') anchor.setAttribute('href', '/query');
      }
    });
    normalizeAcademyLogoLinks();
  }
  normalizeLinks();
  var componentsScript = document.querySelector('script[src="/js/tsc-components.js"]');
  if (!componentsScript) {
    componentsScript = document.createElement('script');
    componentsScript.src = '/js/tsc-components.js';
    componentsScript.defer = true;
    document.head.appendChild(componentsScript);
  }
  function loadAfterComponents(src) {
    if (document.querySelector('script[src="' + src + '"]')) return;
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (window.TSCComponents) {
      document.head.appendChild(script);
    } else {
      componentsScript.addEventListener('load', function() {
        document.head.appendChild(script);
      });
    }
  }
  if (!document.querySelector('script[src="/js/forms.js"]')) {
    loadAfterComponents('/js/forms.js');
  }
  if (!document.querySelector('script[src="/js/tsc-animations.js"]')) {
    loadAfterComponents('/js/tsc-animations.js');
  }
  if (!document.querySelector('script[src="/js/content-replacements.js"]')) {
    loadAfterComponents('/js/content-replacements.js');
  }
  window.addEventListener('load', normalizeLinks);
  [250, 1000, 2500, 5000].forEach(function(delay) {
    window.setTimeout(normalizeLinks, delay);
  });
})();
// tsc-link-normalizer-end
