/**
 * Blog article chrome: hero layout classes + prev/next for every post (Wix + editorial).
 * Depends on window.TSCBlogPosts (tsc-blog-posts.js).
 */
(function () {
  var HERO_LAYOUT = {
    'blog-1': {
      frame: '#comp-mrfz1ln9',
      title: '#comp-mrfy5yaq',
      author: '#comp-mrfyt2mz',
      read: '#comp-mrfyv9z0',
      date: '#comp-mrfyw2p9',
      art: '#comp-mrfy8j45',
      ghosts: [],
      arrows: ['#comp-mrg028qi', '#comp-mrg00add']
    },
    'blog-2': {
      frame: '#comp-mrg0d18m',
      title: '#comp-mrg0d18n4',
      author: '#comp-mrg0d18q2',
      read: '#comp-mrg0d18t2',
      date: '#comp-mrg0d18w1',
      art: '#comp-mrg0d18z',
      ghosts: ['#comp-mrsuvxvh'],
      arrows: ['#comp-mrg3nj2b', '#comp-mrg3nizu']
    },
    'blog-3': {
      frame: '#comp-mrg0d7qy4',
      title: '#comp-mrg0d7r0',
      author: '#comp-mrg0d7r14',
      read: '#comp-mrg0d7r4',
      date: '#comp-mrg0d7r69',
      art: '#comp-mrg0d7r94',
      ghosts: ['#comp-mrsuz52p'],
      arrows: ['#comp-mrg3ol4r', '#comp-mrg3ol2j']
    }
  };

  function $(sel) {
    return sel ? document.querySelector(sel) : null;
  }

  function mark(el, cls) {
    if (el) el.classList.add(cls);
  }

  function applyWixHeroLayout(pageKey) {
    var layout = HERO_LAYOUT[pageKey];
    if (!layout) return;
    var frame = $(layout.frame);
    if (!frame) return;
    frame.classList.add('tsc-blog-hero-frame');
    mark($(layout.title), 'tsc-blog-hero-title');
    mark($(layout.author), 'tsc-blog-hero-author');
    mark($(layout.read), 'tsc-blog-hero-read');
    mark($(layout.date), 'tsc-blog-hero-date');
    mark($(layout.art), 'tsc-blog-hero-art');
    (layout.ghosts || []).forEach(function (sel) {
      mark($(sel), 'tsc-blog-hero-ghost');
    });

    // Wrap read + date in one meta row (keeps pill styling, smaller type via CSS)
    var read = $(layout.read);
    var date = $(layout.date);
    if (read && date && !frame.querySelector('.tsc-blog-hero-meta')) {
      var meta = document.createElement('div');
      meta.className = 'tsc-blog-hero-meta';
      read.parentNode.insertBefore(meta, read);
      meta.appendChild(read);
      meta.appendChild(date);
    }
  }

  function wireWixArrows(pageKey, prev, next) {
    var layout = HERO_LAYOUT[pageKey];
    if (!layout || !layout.arrows) return;
    var left = $(layout.arrows[0]);
    var right = $(layout.arrows[1]);
    // Confirm left/right by viewport x
    var a = left;
    var b = right;
    if (a && b) {
      var al = a.getBoundingClientRect().left;
      var bl = b.getBoundingClientRect().left;
      if (al > bl) {
        left = b;
        right = a;
      }
    }
    if (left) {
      left.setAttribute('href', prev.href);
      left.setAttribute('aria-label', 'Previous article: ' + prev.title);
      left.setAttribute('target', '_self');
    }
    if (right) {
      right.setAttribute('href', next.href);
      right.setAttribute('aria-label', 'Next article: ' + next.title);
      right.setAttribute('target', '_self');
    }
  }

  function wireGoArrowsFallback(prev, next) {
    var arrows = Array.prototype.slice.call(document.querySelectorAll('a[aria-label="Go"], a[aria-label^="Previous article"], a[aria-label^="Next article"]'));
    if (arrows.length < 2) return;
    arrows.sort(function (x, y) {
      return x.getBoundingClientRect().left - y.getBoundingClientRect().left;
    });
    var left = arrows[0];
    var right = arrows[arrows.length - 1];
    left.setAttribute('href', prev.href);
    left.setAttribute('aria-label', 'Previous article: ' + prev.title);
    left.setAttribute('target', '_self');
    right.setAttribute('href', next.href);
    right.setAttribute('aria-label', 'Next article: ' + next.title);
    right.setAttribute('target', '_self');
  }

  function mountEditorialSideNav(prev, next) {
    if (document.querySelector('.tsc-blog-side-nav')) {
      var existing = document.querySelector('.tsc-blog-side-nav');
      var prevA = existing.querySelector('[data-tsc-blog-dir="prev"]');
      var nextA = existing.querySelector('[data-tsc-blog-dir="next"]');
      if (prevA) prevA.setAttribute('href', prev.href);
      if (nextA) nextA.setAttribute('href', next.href);
      return;
    }
    var nav = document.createElement('nav');
    nav.className = 'tsc-blog-side-nav';
    nav.setAttribute('aria-label', 'Blog article navigation');
    nav.innerHTML =
      '<a class="tsc-blog-side-nav__btn" data-tsc-blog-dir="prev" href="' +
      prev.href +
      '" aria-label="Previous article: ' +
      escapeAttr(prev.title) +
      '"><span aria-hidden="true">‹</span></a>' +
      '<a class="tsc-blog-side-nav__btn" data-tsc-blog-dir="next" href="' +
      next.href +
      '" aria-label="Next article: ' +
      escapeAttr(next.title) +
      '"><span aria-hidden="true">›</span></a>';
    document.body.appendChild(nav);

    // Related "Next article" CTA
    document.querySelectorAll('.related a.button, a.button').forEach(function (a) {
      if (/^next article$/i.test((a.textContent || '').trim())) {
        a.setAttribute('href', next.href);
      }
    });
  }

  function escapeAttr(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function tightenEditorialHero() {
    var hero = document.querySelector('main .hero, main section.hero');
    if (hero) hero.classList.add('tsc-blog-editorial-hero');
  }

  function mount(pathname) {
    var api = window.TSCBlogPosts;
    if (!api) return;
    var nav = api.neighbors(pathname || location.pathname);
    if (!nav) return;

    document.body.classList.add('tsc-blog-article');
    document.body.setAttribute('data-tsc-blog-href', nav.current.href);

    var pageKey = document.body.getAttribute('data-page') || '';
    if (HERO_LAYOUT[pageKey]) {
      applyWixHeroLayout(pageKey);
      wireWixArrows(pageKey, nav.prev, nav.next);
      wireGoArrowsFallback(nav.prev, nav.next);
    } else {
      tightenEditorialHero();
      mountEditorialSideNav(nav.prev, nav.next);
    }

    // Back links
    document.querySelectorAll('a').forEach(function (anchor) {
      var text = (anchor.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^(back to resources|all blogs)$/i.test(text)) {
        anchor.setAttribute('href', '/resources');
        anchor.setAttribute('target', '_self');
      }
    });
  }

  window.TSCBlogChrome = { mount: mount, heroLayout: HERO_LAYOUT };
})();
