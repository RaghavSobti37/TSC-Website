/**
 * Single source of truth: route slug → mobile CSS path (1:1 ownership).
 * Boot scripts and tsc-components.js both consume this.
 * DESKTOP LOCK: these sheets must always load with media=(max-width: 1024px).
 */
(function (root) {
  var VERSION = 'mobile-own-6';
  var BASE = '/css/mobile/';

  /** Every mirrored page slug → dedicated file under public/css/mobile/ */
  var SLUG_TO_CSS = {
    home: 'home.css',
    about: 'about.css',
    work: 'work.css',
    artists: 'artists.css',
    'artist-path': 'artist-path.css',
    'learn-with-tsc': 'learn-with-tsc.css',
    films: 'films.css',
    resources: 'resources.css',
    academy: 'academy.css',
    affiliate: 'affiliate.css',
    'affiliate-apply': 'affiliate.css',
    'harshad-duhita': 'harshad-duhita.css',
    'mohit-shankar': 'mohit-shankar.css',
    yugm: 'yugm.css',
    'book-an-artist': 'book-an-artist.css',
    'artist-query': 'artist-query.css',
    'collab-query': 'collab-query.css',
    'the-heart-of-composition': 'the-heart-of-composition.css',
    'roots-of-hindustani-classical': 'roots-of-hindustani-classical.css',
    'music-production': 'music-production.css',
    'course-bundle': 'course-bundle.css',
    'book-a-call': 'book-a-call.css',
    'mahavatar-narsimha': 'mahavatar-narsimha.css',
    'hanuman-ansh': 'hanuman-ansh.css',
    mahaprbhu: 'mahaprbhu.css',
    kalki: 'kalki.css',
    'mahavatar-narsimha-impact': 'mahavatar-narsimha-impact.css',
    'hanuman-ansh-impact': 'hanuman-ansh-impact.css',
    'mahaprabhu-jagannath-impact': 'mahaprabhu-jagannath-impact.css',
    'kalki-impact': 'kalki-impact.css',
    mba: 'mba.css',
    'mba-impact': 'mba-impact.css',
    'havells-myousic': 'havells-myousic.css',
    'insta-music-league': 'insta-music-league.css',
    'young-gunns': 'young-gunns.css',
    'blog-1': 'blog-1.css',
    'blog-2': 'blog-2.css',
    'blog-3': 'blog-3.css',
    'start-making-music': 'start-making-music.css',
    'online-music-course-worth-it': 'online-music-course-worth-it.css',
    'artist-release-playbook': 'artist-release-playbook.css',
    'from-bhajan-to-clubbing': 'from-bhajan-to-clubbing.css',
    'you-released-a-song-now-what': 'you-released-a-song-now-what.css',
    'how-i-curate-music-with-independent-artists': 'how-i-curate-music-with-independent-artists.css',
    classicalreview: 'classicalreview.css',
    'masterclass-review01': 'masterclass-review01.css',
    'masterclass-review02': 'masterclass-review02.css'
  };

  function canonicalPath() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    if (path.indexOf('/pages/') === 0) {
      path = '/' + path.split('/').pop().replace(/\.html$/i, '');
      if (path === '/home') path = '/';
    }
    var parts = path.split('/').filter(Boolean);
    if (parts.length >= 2) path = '/' + parts[parts.length - 1];
    return path;
  }

  function slugFromPath(path) {
    path = path || canonicalPath();
    if (path === '/' || path === '/home') return 'home';
    return path.replace(/^\//, '').split('/')[0] || 'home';
  }

  function hrefForSlug(slug) {
    var file = SLUG_TO_CSS[slug] || 'home.css';
    return BASE + file + '?v=' + VERSION;
  }

  function hrefForPath(path) {
    return hrefForSlug(slugFromPath(path));
  }

  root.TSCMobileRouteMap = {
    VERSION: VERSION,
    SLUG_TO_CSS: SLUG_TO_CSS,
    canonicalPath: canonicalPath,
    slugFromPath: slugFromPath,
    hrefForSlug: hrefForSlug,
    hrefForPath: hrefForPath,
    MEDIA: '(max-width: 1024px)'
  };
})(typeof window !== 'undefined' ? window : globalThis);
