// Page animation bootstrap extracted from films/index.html.
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
  "/blog-1": "/start-making-music",
  "/blank-13": "/start-making-music",
  "/resources/blog-1": "/start-making-music",
  "/resources/start-making-music": "/start-making-music",
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
  "/blog-3": "/artist-release-playbook",
  "/blank-13-1-1": "/artist-release-playbook",
  "/work3-1-1": "/artist-release-playbook",
  "/resources/blog-3": "/artist-release-playbook",
  "/resources/artist-release-playbook": "/artist-release-playbook",
  "/blog-2": "/online-music-course-worth-it",
  "/blank-13-1": "/online-music-course-worth-it",
  "/work3-1": "/online-music-course-worth-it",
  "/resources/blog-2": "/online-music-course-worth-it",
  "/resources/online-music-course-worth-it": "/online-music-course-worth-it",
  "/resources/from-bhajan-to-clubbing": "/from-bhajan-to-clubbing",
  "/resources/you-released-a-song-now-what": "/you-released-a-song-now-what",
  "/resources/how-i-curate-music-with-independent-artists": "/how-i-curate-music-with-independent-artists",
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
