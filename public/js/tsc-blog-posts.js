/**
 * Canonical blog post order for TSC site.
 * New post checklist:
 *  1. Append entry here (keep chronological; left arrow = older, right = newer)
 *  2. Add path to RESOURCES_PATHS in tsc-components.js
 *  3. Add card on /resources (resources.html blogs array)
 *  4. Wix-frame pages: add HERO_LAYOUT map in tsc-blog-chrome.js (title/read/date/art/arrows)
 *     Editorial pages: side‹› arrows auto-mount — no HERO_LAYOUT needed
 */
(function (root) {
  var ALIASES = {
    '/blog-1': '/start-making-music',
    '/blog-2': '/online-music-course-worth-it',
    '/blog-3': '/artist-release-playbook',
    '/blank-13': '/start-making-music',
    '/blank-13-1': '/online-music-course-worth-it',
    '/blank-13-1-1': '/artist-release-playbook'
  };

  /** @type {{ href: string, title: string, date: string, read: string }[]} */
  var POSTS = [
    {
      href: '/artist-release-playbook',
      title: 'The Artist Release Playbook',
      date: '02 MAY 2026',
      read: 'READ: 6 MINS'
    },
    {
      href: '/online-music-course-worth-it',
      title: 'Is an Online Music Course Worth It for Beginners?',
      date: '27 JUN 2026',
      read: 'READ: 7 MINS'
    },
    {
      href: '/start-making-music',
      title: 'How Do I Start Making Music If I Have No Experience?',
      date: '05 JUL 2026',
      read: 'READ: 3 MINS'
    },
    {
      href: '/how-i-curate-music-with-independent-artists',
      title: 'How I Curate Music With Independent Artists',
      date: '23 JUL 2026',
      read: 'READ: 6 MINS'
    },
    {
      href: '/you-released-a-song-now-what',
      title: 'You Released a Song. Now What?',
      date: '24 JUL 2026',
      read: 'READ: 4 MINS'
    },
    {
      href: '/from-bhajan-to-clubbing',
      title: 'From Bhajan to Clubbing: Why Indian Culture Is Going Mainstream',
      date: '25 JUL 2026',
      read: 'READ: 5 MINS'
    }
  ];

  function normalizePath(pathname) {
    var path = String(pathname || '').replace(/\/$/, '') || '/';
    if (path.indexOf('/pages/') === 0) {
      path = path.replace('/pages', '').replace(/\.html$/, '') || '/';
    }
    return ALIASES[path] || path;
  }

  function indexForPath(pathname) {
    var path = normalizePath(pathname);
    for (var i = 0; i < POSTS.length; i += 1) {
      if (POSTS[i].href === path) return i;
    }
    return -1;
  }

  function neighbors(pathname) {
    var i = indexForPath(pathname);
    if (i < 0) return null;
    var prev = POSTS[(i - 1 + POSTS.length) % POSTS.length];
    var next = POSTS[(i + 1) % POSTS.length];
    return { current: POSTS[i], prev: prev, next: next, index: i };
  }

  root.TSCBlogPosts = {
    posts: POSTS,
    aliases: ALIASES,
    normalizePath: normalizePath,
    indexForPath: indexForPath,
    neighbors: neighbors
  };
})(typeof window !== 'undefined' ? window : globalThis);
