(function () {
  var IMPACT_PATHS = {
    '/mba': true,
    '/mba-impact': true,
    '/havells-myousic': true,
    '/insta-music-league': true,
    '/young-gunns': true
  };

  var FILM_REPORT_PATHS = {
    '/mahavatar-narsimha-impact': true,
    '/hanuman-ansh-impact': true,
    '/mahaprabhu-jagannath-impact': true,
    '/mahaprbhu-impact': true,
    '/kalki-impact': true
  };

  function canonicalPathname() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    var pagesMatch = path.match(/^\/pages\/([^/]+?)(?:\.html)?$/);
    if (pagesMatch) return '/' + pagesMatch[1];
    var parts = path.split('/').filter(Boolean);
    if (parts.length > 1) return '/' + parts[parts.length - 1];
    return path;
  }

  function mountImpactComponents() {
    if (!window.TSCComponents) return;
    var path = canonicalPathname();
    var isWorkReport = !!IMPACT_PATHS[path];
    var isFilmReport = !!FILM_REPORT_PATHS[path];
    var chromePath = isFilmReport ? '/films' : (isWorkReport ? '/work' : '/work');
    var opts = {
      path: chromePath,
      academyPaths: {},
      brandAssets: {
        main: {
          logo: '/assets/brand/tsc-logo.png',
          icon: '/assets/brand/tsc-favicon-32.png',
          touchIcon: '/assets/brand/tsc-apple-touch-icon.png',
          name: 'The Shakti Collective',
          tagline: 'Unfolding Artist Force .'
        },
        academy: {
          logo: '/assets/brand/academy-logo.png',
          icon: '/assets/brand/academy-favicon-32.png',
          touchIcon: '/assets/brand/academy-apple-touch-icon.png',
          name: 'TSC Academy',
          tagline: 'Mentorship-led learning for serious artists.'
        }
      },
      whatsappCommunityUrl: 'https://wa.me/919168665455'
    };

    document.body.dataset.page = path.replace(/^\//, '') || 'home';
    document.body.setAttribute('data-page', document.body.dataset.page);

    if (window.TSCComponents.mountDesktopHeader) window.TSCComponents.mountDesktopHeader(Object.assign({}, opts, { forceCustomHeader: true, activePage: isFilmReport ? 'films' : 'work' }));
    if (window.TSCComponents.mountMobileHeader) window.TSCComponents.mountMobileHeader(opts);
    if (window.TSCComponents.mountDesktopFooter) window.TSCComponents.mountDesktopFooter(opts);
    if (window.TSCComponents.mountMobileFooter) window.TSCComponents.mountMobileFooter(opts);
  }

  if (window.TSCComponents && window.TSCComponents.applyOnSchedule) {
    window.TSCComponents.applyOnSchedule(mountImpactComponents);
  } else {
    mountImpactComponents();
    window.addEventListener('load', mountImpactComponents);
    [250, 1000, 2500].forEach(function (delay) {
      window.setTimeout(mountImpactComponents, delay);
    });
  }

  window.addEventListener('resize', mountImpactComponents);
})();