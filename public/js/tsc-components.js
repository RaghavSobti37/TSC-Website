/*
 * DESKTOP DESIGN LOCK — PERMANENT.
 * - 9 primary pages: desktop (>=1025px) locked to commit faf9dea.
 * - /yugm + /harshad-duhita: desktop hero + animations locked in
 *   public/css/pages/yugm.css and harshad-duhita.css (see .cursor/rules/desktop-lock.mdc).
 * Do NOT alter those desktop renders. Mobile-only behavior must be guarded by
 * matchMedia('(max-width: 1024px)'). Never change desktop unless the site owner explicitly asks.
 */
(function () {
  var ENABLE_CUSTOM_MOBILE_CHROME = true;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function stylesheetBareHref(href) {
    return String(href || '').split('?')[0];
  }

  /**
   * Inject stylesheet once (dedupe by path, ignore ?v=).
   * opts.media — set on link (required for mobile sheets).
   * Never upgrade a media-gated sheet to all-media.
   */
  function ensureStylesheet(href, opts) {
    opts = opts || {};
    var bare = stylesheetBareHref(href);
    var existing =
      document.querySelector('link[data-tsc-href="' + bare + '"]') ||
      document.querySelector('link[rel="stylesheet"][href^="' + bare + '"]');
    if (existing) {
      if (opts.media && !existing.media) {
        existing.media = opts.media;
      }
      if (opts.media && existing.getAttribute('data-tsc-boot') === '1') {
        /* boot already media-gated — leave alone */
      }
      return existing;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    if (opts.media) link.media = opts.media;
    link.setAttribute('data-tsc-href', bare);
    document.head.appendChild(link);
    return link;
  }

  /** Clone-faithful: no logo size/colour CSS. Keep mentor-card hide only. */
  function injectDesktopNavLockInline() {
    if (document.getElementById('tsc-desktop-nav-lock-inline')) return;
    var style = document.createElement('style');
    style.id = 'tsc-desktop-nav-lock-inline';
    style.textContent = [
      'body:has([data-tsc-locked-desktop-header="true"]) .tsc-desktop-site-header:not([data-tsc-forced-header="true"]){display:none!important;}',
      '.tsc-desktop-site-header[data-tsc-forced-header="true"]{display:flex!important;}',
      '#comp-mpl387ie,#comp-mrufx9ud,#comp-mrufx9rd2{display:none!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important;visibility:hidden!important;}'
    ].join('');
    (document.head || document.documentElement).appendChild(style);
  }
  injectDesktopNavLockInline();

  function ensureScript(src, onload) {
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      if (onload) {
        if (existing.dataset.tscLoaded === 'true') onload();
        else existing.addEventListener('load', function onExistingLoad() {
          existing.dataset.tscLoaded = 'true';
          onload();
        });
      }
      return existing;
    }
    var script = document.createElement('script');
    script.src = src;
    script.defer = true;
    if (onload) {
      script.addEventListener('load', function () {
        script.dataset.tscLoaded = 'true';
        onload();
      });
    }
    (document.body || document.head).appendChild(script);
    return script;
  }

  function isBlogArticlePath(path) {
    return !!(RESOURCES_PATHS[path] && path !== '/resources');
  }

  function mountBlogChrome(path) {
    if (!isBlogArticlePath(path)) return;
    ensureStylesheet('/css/pages/tsc-blog-hero.css?v=blog-hero-3');
    ensureScript('/js/tsc-blog-posts.js?v=blog-hero-3', function () {
      ensureScript('/js/tsc-blog-chrome.js?v=blog-hero-3', function () {
        if (window.TSCBlogChrome && typeof window.TSCBlogChrome.mount === 'function') {
          window.TSCBlogChrome.mount(path);
        }
      });
    });
  }

  function normalizeInternalProtocolRelativeLinks() {
    var aliasMap = {
      '/blank': '/about',
      '/blank-1': '/work',
      '/blank-2': '/artists',
      '/blank-3': '/academy',
      '/blank-3-1': '/academy',
      '/blank-4': '/artist-path',
      '/blank-5': '/resources',
      '/blank-6': '/collab-query',
      '/blank-7': '/mba',
      '/blank-8': '/book-a-call',
      '/blank-8-1': '/book-an-artist',
      '/blank-8-1-1': '/artist-query',
      '/blank-9': '/the-heart-of-composition',
      '/blank-9-1': '/roots-of-hindustani-classical',
      '/blank-10': '/harshad-duhita',
      '/blank-10-1': '/yugm',
      '/blank-11': '/films',
      '/blank-12': '/mahavatar-narsimha',
      '/blank-12-1': '/hanuman-ansh',
      '/blank-12-1-1': '/mahaprbhu',
      '/blank-12-1-1-1': '/kalki',
      '/blank-13': '/start-making-music',
      '/blank-13-1': '/online-music-course-worth-it',
      '/blank-13-1-1': '/artist-release-playbook',
      '/blog-1': '/start-making-music',
      '/blog-2': '/online-music-course-worth-it',
      '/blog-3': '/artist-release-playbook',
      '/about-8': '/book-a-call',
      '/about-8-1': '/book-an-artist',
      '/about-8-1-1': '/artist-query',
      '/about-9': '/the-heart-of-composition',
      '/about-9-1': '/roots-of-hindustani-classical',
      '/work0': '/young-gunns',
      '/work0-1': '/yugm',
      '/work2': '/havells-myousic',
      '/work2-1': '/hanuman-ansh',
      '/work2-1-1': '/mahaprbhu',
      '/work2-1-1-1': '/kalki',
      '/work3': '/insta-music-league',
      '/work3-1': '/online-music-course-worth-it',
      '/work3-1-1': '/artist-release-playbook',
      '/forms/book-a-call': '/book-a-call',
      '/forms/book-an-artist': '/book-an-artist',
      '/forms/artist-query': '/artist-query',
      '/forms/collab-query': '/collab-query',
      '/learn-with-tsc': '/academy',
      '/academy/learn-with-tsc': '/academy',
      '/pages/learn-with-tsc': '/academy',
      '/pages/learn-with-tsc.html': '/academy'
    };
    var externalPathMap = {
      '/the_shakti_collective': 'https://www.instagram.com/the_shakti_collective/',
      '/IaS1GaJT7Gp7ufxHIjDkZu': 'https://wa.me/919168665455',
      '/@theshakticollective': 'https://youtube.com/@theshakticollective',
      '/people/The-Shakti-Collective/61575006284507': 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/',
      '/company/theshakticollective': 'https://www.linkedin.com/company/the-shakti-collective/',
      '/company/the-shakti-collective': 'https://www.linkedin.com/company/the-shakti-collective/',
      '/artist@theshakticollective.in': 'mailto:artist@theshakticollective.in',
      '/Artist@theshakticollective.in': 'mailto:artist@theshakticollective.in',
      '/harshad_golesar': 'https://www.instagram.com/harshad_golesar/',
      '/harshaduhita_collective': 'https://www.instagram.com/harshaduhita_collective/',
      '/duhita_harshad': 'https://www.instagram.com/duhita_harshad/',
      '/@theHarshaduhitacollective': 'https://youtube.com/@theHarshaduhitacollective',
      '/yugmofficial': 'https://www.instagram.com/yugmofficial/',
      '/@yugmofficial5231': 'https://youtube.com/@yugmofficial5231',
      '/share/1LmrVwquDF': 'https://www.facebook.com/share/1LmrVwquDF/',
      '/movies/bollywood/story/mahaprabhu-jagannath-trailer-debuts-before-10000-devotees-tale-of-faith-and-unity-2931835-2026-06-22': 'https://www.indiatoday.in/movies/bollywood/story/mahaprabhu-jagannath-trailer-debuts-before-10000-devotees-tale-of-faith-and-unity-2931835-2026-06-22',
      '/movies/bollywood/mahaprabhu-jagannath-trailer-unveiled-before-10000-devotees-in-biggest-animation-film-launch-ws-l-10165969.html': 'https://www.news18.com/movies/bollywood/mahaprabhu-jagannath-trailer-unveiled-before-10000-devotees-in-biggest-animation-film-launch-ws-l-10165969.html',
      '/ZeeNews/posts/1590204306477128': 'https://www.facebook.com/ZeeNews/posts/1590204306477128/',
      '/reel/DZCpHlVT9Yg': 'https://www.instagram.com/reel/DZCpHlVT9Yg/',
      '/reel/DZ4UycmTY9X': 'https://www.instagram.com/reel/DZ4UycmTY9X/',
      '/entertainment/movies/mahaprabhu-jagannath-trailer-launch-10000-devotees-indias-biggest-animation-film-event-1852094': 'https://www.timesnownews.com/entertainment/movies/mahaprabhu-jagannath-trailer-launch-10000-devotees-indias-biggest-animation-film-event-1852094',
      '/@rohitsobti1/from-bhajan-to-clubbing-from-mythology-to-cinema-how-indian-culture-is-finding-new-mainstream-161432be0966': 'https://rohitsobti1.medium.com/from-bhajan-to-clubbing-from-mythology-to-cinema-how-indian-culture-is-finding-new-mainstream-161432be0966',
      '/@rohitsobti1/you-released-a-song-now-what-1bc33923ee1c': 'https://medium.com/@rohitsobti1/you-released-a-song-now-what-1bc33923ee1c',
      '/how-i-curate-music-with-independent-artists-lessons-from-lost-found-with-faheem-abdullah-9d2c76cb8418': 'https://medium.com/@rohitsobti1/how-i-curate-music-with-independent-artists-lessons-from-lost-found-with-faheem-abdullah-9d2c76cb8418'
    };
    var internalLike = /^(?:\/\/)(blank(?:-[\w-]+)?|about(?:-[\w-]+)?|work(?:[\w-]*)?|artists(?:\/[\w-]+)?|academy(?:\/[\w-]+)?|forms(?:\/[\w-]+)?|resources(?:\/[\w-]+)?)([/?#].*)?$/i;
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var raw = anchor.getAttribute('href') || '';
      var normalized = raw;
      var match = raw.match(internalLike);
      if (match) {
        normalized = '/' + match[1] + (match[2] || '');
      }
      try {
        var url = new URL(normalized, location.origin);
        if (url.origin !== location.origin) return;
        var pathKey = url.pathname.replace(/\/$/, '') || '/';
        if (externalPathMap[pathKey]) {
          anchor.setAttribute('href', externalPathMap[pathKey] + url.search + url.hash);
          return;
        }
        if (pathKey === '/send' && url.searchParams.get('phone')) {
          anchor.setAttribute('href', 'https://api.whatsapp.com/send/' + url.search + url.hash);
          return;
        }
        if (pathKey === '/watch' && url.searchParams.get('v')) {
          anchor.setAttribute('href', 'https://www.youtube.com/watch' + url.search + url.hash);
          return;
        }
        if (pathKey.indexOf('/track/') === 0) {
          anchor.setAttribute('href', 'https://open.spotify.com' + pathKey + url.search + url.hash);
          return;
        }
        if (pathKey.indexOf('/artist/') === 0) {
          anchor.setAttribute('href', 'https://open.spotify.com' + pathKey + url.search + url.hash);
          return;
        }
        var mapped = aliasMap[url.pathname] || aliasMap[pathKey];
        if (mapped) {
          normalized = mapped + url.search + url.hash;
        } else {
          normalized = url.pathname + url.search + url.hash;
        }
      } catch (e) {
        return;
      }
      if (raw !== normalized) anchor.setAttribute('href', normalized);
    });
  }

  function mountHarshadDigitalPresenceLinks(path) {
    if (path !== '/harshad-duhita') return;
    var section = document.getElementById('comp-mq84m6ve');
    var container = section && section.querySelector('.comp-mq84m6ve-container');
    if (!section || !container || container.querySelector('.tsc-hd-social-extra-grid')) return;
    var grid = document.createElement('div');
    grid.className = 'tsc-hd-social-extra-grid';
    grid.setAttribute('aria-label', 'Harshaduhita additional social links');
    grid.innerHTML = [
      '<a class="tsc-hd-social-card" href="https://youtube.com/@theHarshaduhitacollective" target="_blank" rel="noreferrer noopener" aria-label="Harshaduhita Collective on YouTube">',
      '<span>YouTube</span>',
      SOCIAL_SVGS.youtube,
      '</a>',
      '<a class="tsc-hd-social-card" href="https://www.facebook.com/harshad.golesar/" target="_blank" rel="noreferrer noopener" aria-label="Harshaduhita Golesar on Facebook">',
      '<span>Facebook</span>',
      SOCIAL_SVGS.facebook,
      '</a>'
    ].join('');
    container.appendChild(grid);
  }

  function mountYugmBandCardToggles(path) {
    if (path !== '/yugm') return;
    if (window.__tscYugmBandTogglesBound) return;
    var cards = [
      {
        panel: 'comp-mqjigv265',
        arrow: 'comp-mqjigv2l',
        bio: 'comp-mqjigv2e3',
        panelExpanded: 'variants-mqjigv271',
        arrowExpanded: 'variants-mqjigv2q',
        bioExpanded: 'variants-mqjigv2f'
      },
      {
        panel: 'comp-mqjigv3q',
        arrow: 'comp-mqjigv45',
        bio: 'comp-mqjigv3y4',
        panelExpanded: 'variants-mqjigv3r2',
        arrowExpanded: 'variants-mqjigv451',
        bioExpanded: 'variants-mqjigv3z'
      }
    ];
    var ready = cards.every(function (cfg) {
      return document.getElementById(cfg.panel) && document.getElementById(cfg.arrow);
    });
    if (!ready) return;

    function setExpanded(cfg, expanded) {
      var panel = document.getElementById(cfg.panel);
      var arrow = document.getElementById(cfg.arrow);
      var bio = document.getElementById(cfg.bio);
      if (!panel || !arrow) return;
      panel.classList.toggle(cfg.panelExpanded, expanded);
      arrow.classList.toggle(cfg.arrowExpanded, expanded);
      if (bio && cfg.bioExpanded) bio.classList.toggle(cfg.bioExpanded, expanded);
      panel.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }

    cards.forEach(function (cfg) {
      var panel = document.getElementById(cfg.panel);
      var arrow = document.getElementById(cfg.arrow);
      if (!panel || !arrow || panel.getAttribute('data-tsc-yugm-band-bound') === 'true') return;
      panel.setAttribute('data-tsc-yugm-band-bound', 'true');
      arrow.setAttribute('data-tsc-yugm-band-bound', 'true');
      panel.setAttribute('role', 'button');
      panel.setAttribute('tabindex', '0');
      arrow.setAttribute('role', 'button');
      arrow.setAttribute('tabindex', '0');
      setExpanded(cfg, false);
      function toggle(evt) {
        if (evt) {
          evt.preventDefault();
        }
        var open = !panel.classList.contains(cfg.panelExpanded);
        setExpanded(cfg, open);
      }
      panel.addEventListener('click', toggle);
      panel.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter' || evt.key === ' ') toggle(evt);
      });
    });
    window.__tscYugmBandTogglesBound = true;
  }

  function mountYugmHeroMedia(path) {
    if (path !== '/yugm') return;
    function rewriteUrl(value) {
      return String(value || '')
        .replace(/^https?:\/\/[^/]+\/assets\/mirror\/static\.wixstatic\.com/i, 'https://static.wixstatic.com')
        .replace(/^\/assets\/mirror\/static\.wixstatic\.com/i, 'https://static.wixstatic.com');
    }
    function rewriteNode(node) {
      if (!node) return;
      ['src', 'srcset', 'data-src'].forEach(function (attr) {
        var current = node.getAttribute && node.getAttribute(attr);
        if (!current || current.indexOf('static.wixstatic.com') === -1) return;
        var next = rewriteUrl(current);
        if (next !== current) node.setAttribute(attr, next);
      });
      if (node.src && node.src.indexOf('/assets/mirror/static.wixstatic.com') !== -1) {
        node.src = rewriteUrl(node.src);
      }
    }
    document.querySelectorAll('#comp-mqhqa6xg img, #comp-mqhqa6xg source, #comp-mqhqa6y01 img').forEach(rewriteNode);
    var overlay = document.getElementById('bgImgOverlay_comp-mqhqa6xg');
    if (overlay) overlay.style.marginBottom = '0px';
  }

  function mountYugmIplYearFix(path) {
    if (path !== '/yugm') return;
    var timelineYears = [
      ['#comp-mqhqa70a .wixui-rich-text__text', '2025'],
      ['#comp-mqhqa70h3 .wixui-rich-text__text', '2023']
    ];
    timelineYears.forEach(function (item) {
      var year = document.querySelector(item[0]);
      if (year && year.textContent !== item[1]) {
        year.textContent = item[1];
      }
    });
    document.querySelectorAll('#comp-mqhqa7081 .wixui-rich-text__text, #comp-mqhqa70f5 .wixui-rich-text__text').forEach(function (node) {
      if (/^\s*(?:2024|2026)\s*$/.test(node.textContent || '')) {
        var title = node.parentElement && node.parentElement.parentElement && node.parentElement.parentElement.textContent || '';
        if (/IPL 2025/i.test(title)) node.textContent = '2025';
        if (/Filmfare Recognition/i.test(title)) node.textContent = '2023';
      }
    });
    if (window.matchMedia && !window.matchMedia('(min-width: 1025px)').matches) return;
    var timelineItems = [
      { key: 'filmfare', group: '#comp-mqhqa70f5', image: '#comp-mqhqa70z5' },
      { key: 'netflix', group: '#comp-mqhqa70m2', image: '#comp-mqhqa7052' },
      { key: 'best-band', group: '#comp-mqjlruby', image: '#comp-mqjlrudj' },
      { key: 'ipl', group: '#comp-mqhqa7081', image: '#comp-mqhqa707' }
    ].map(function (item) {
      return {
        key: item.key,
        group: document.querySelector(item.group),
        image: document.querySelector(item.image)
      };
    });
    if (timelineItems.some(function (item) { return !item.group || !item.image; })) return;
    timelineItems.forEach(function (item) {
      item.group.style.removeProperty('translate');
      item.image.style.removeProperty('translate');
    });
    var textSlots = timelineItems.map(function (item) {
      return item.group.getBoundingClientRect().top;
    }).sort(function (a, b) { return a - b; });
    var imageSlots = timelineItems.map(function (item) {
      return item.image.getBoundingClientRect().top;
    }).sort(function (a, b) { return a - b; });
    var textXs = timelineItems.map(function (item) {
      return item.group.getBoundingClientRect().left;
    }).sort(function (a, b) { return a - b; });
    var imageXs = timelineItems.map(function (item) {
      return item.image.getBoundingClientRect().left;
    }).sort(function (a, b) { return a - b; });
    var textLeftX = (textXs[0] + textXs[1]) / 2;
    var textRightX = (textXs[textXs.length - 2] + textXs[textXs.length - 1]) / 2;
    var imageLeftX = (imageXs[0] + imageXs[1]) / 2;
    var imageRightX = (imageXs[imageXs.length - 2] + imageXs[imageXs.length - 1]) / 2;
    timelineItems.forEach(function (item, index) {
      var groupRect = item.group.getBoundingClientRect();
      var imageRect = item.image.getBoundingClientRect();
      var textTargetX = index % 2 === 0 ? textLeftX : textRightX;
      var imageTargetX = index % 2 === 0 ? imageRightX : imageLeftX;
      var textXDelta = Math.round(textTargetX - groupRect.left);
      var imageXDelta = Math.round(imageTargetX - imageRect.left);
      var textYDelta = Math.round(textSlots[index] - groupRect.top);
      var imageYDelta = Math.round(imageSlots[index] - imageRect.top);
      item.group.style.setProperty('translate', textXDelta + 'px ' + textYDelta + 'px', 'important');
      item.image.style.setProperty('translate', imageXDelta + 'px ' + imageYDelta + 'px', 'important');
      item.group.setAttribute('data-tsc-yugm-timeline-order', String(index + 1));
      item.image.setAttribute('data-tsc-yugm-timeline-order', String(index + 1));
    });
  }

  function mountWorkImpactLinks(path) {
    if (path !== '/work') return;
    var reports = [
      { label: 'Main Bhi Artist', href: '/mba', root: '#comp-mr69hwvs2' },
      { label: 'Havells mYOUsic', href: '/havells-myousic', root: '#comp-mr69hwub' },
      { label: 'Insta Music League', href: '/insta-music-league', root: '#comp-mr69hww9' },
      { label: 'The Young Gunns', href: '/young-gunns', root: '#comp-mr69hwvf5' }
    ];
    var textNodes = Array.prototype.slice.call(document.querySelectorAll('.wixui-rich-text, [data-testid="richTextElement"], h1, h2, h3, p'));

    function visibleRect(node) {
      var rect = node && node.getBoundingClientRect && node.getBoundingClientRect();
      return rect && rect.width > 1 && rect.height > 1 ? rect : null;
    }

    function findTitle(label) {
      return textNodes.filter(function (node) {
        return (node.textContent || '').indexOf(label) !== -1 && visibleRect(node);
      }).sort(function (a, b) {
        var ar = visibleRect(a);
        var br = visibleRect(b);
        return (ar.width * ar.height) - (br.width * br.height);
      })[0] || null;
    }

    function findCard(title, label) {
      var candidates = [];
      var node = title;
      while (node && node !== document.body) {
        if (node.classList && node.classList.contains('wixui-box')) {
          var rect = visibleRect(node);
          var text = node.textContent || '';
          if (rect && rect.width >= 300 && rect.width <= 900 && rect.height >= 220 && rect.height <= 750 && text.indexOf(label) !== -1) {
            candidates.push({ node: node, area: rect.width * rect.height, hasButton: !!node.querySelector('button, [role="button"]') });
          }
        }
        node = node.parentElement;
      }
      candidates.sort(function (a, b) {
        if (a.hasButton !== b.hasButton) return a.hasButton ? -1 : 1;
        return a.area - b.area;
      });
      return candidates[0] && candidates[0].node;
    }

    reports.forEach(function (report) {
      var title = findTitle(report.label);
      var card = (report.root && document.querySelector(report.root)) || (title && findCard(title, report.label));
      if (!card) return;
      card.classList.add('tsc-work-report-link');
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open ' + report.label + ' impact report');
      card.setAttribute('data-tsc-work-report-link', report.href);
      if (!card.querySelector('.tsc-work-report-anchor')) {
        var anchor = document.createElement('a');
        anchor.className = 'tsc-work-report-anchor';
        anchor.href = report.href;
        anchor.setAttribute('aria-label', 'Open ' + report.label + ' impact report');
        anchor.textContent = 'Open ' + report.label + ' impact report';
        card.appendChild(anchor);
      }
      Array.prototype.forEach.call(card.querySelectorAll('a[href]'), function (anchor) {
        anchor.setAttribute('href', report.href);
        anchor.setAttribute('target', '_self');
        anchor.removeAttribute('rel');
      });
      if (card.getAttribute('data-tsc-work-report-wired') === 'true') return;
      card.setAttribute('data-tsc-work-report-wired', 'true');
      card.addEventListener('click', function (event) {
        if (event.defaultPrevented) return;
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(report.href);
      }, true);
      card.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(report.href);
      });
    });
  }

  function mountFilmReportCards(path) {
    if (path !== '/films') return;
    /* Clone-faithful: keep Wix card copy; only wire impact-report links. */
    var cards = [
      { root: '#comp-mqmi3w3o', href: '/mahavatar-narsimha-impact', title: 'Mahavatar Narsimha' },
      { root: '#comp-mqmi6ynt2', href: '/hanuman-ansh-impact', title: 'Hanuman Ansh' },
      { root: '#comp-mqmi8cxm2', href: '/mahaprabhu-jagannath-impact', title: 'Mahaprabhu Jagannath' },
      { root: '#comp-mqmi8sui', href: '/kalki-impact', title: 'Kalki' }
    ];

    function isModifiedClick(event) {
      return event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    }

    function openImpactReport(event, href) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      }
      window.location.href = href;
    }

    cards.forEach(function (card) {
      var root = document.querySelector(card.root);
      if (!root) return;
      root.classList.add('tsc-film-report-card');
      root.setAttribute('role', 'link');
      root.setAttribute('tabindex', '0');
      root.setAttribute('aria-label', 'Open ' + card.title + ' impact report');
      root.setAttribute('data-tsc-film-report-link', card.href);
      Array.prototype.forEach.call(root.querySelectorAll('a'), function (anchor) {
        anchor.setAttribute('href', card.href);
        anchor.setAttribute('target', '_self');
        anchor.removeAttribute('rel');
      });
      if (!root.querySelector('.tsc-film-report-hitarea')) {
        var hitarea = document.createElement('a');
        hitarea.className = 'tsc-film-report-hitarea';
        hitarea.href = card.href;
        hitarea.setAttribute('aria-label', 'Open ' + card.title + ' impact report');
        hitarea.textContent = 'Open ' + card.title + ' impact report';
        root.appendChild(hitarea);
      }
      if (root.getAttribute('data-tsc-film-report-wired') === 'true') return;
      root.setAttribute('data-tsc-film-report-wired', 'true');
      root.addEventListener('click', function (event) {
        if (event.defaultPrevented || isModifiedClick(event)) return;
        openImpactReport(event, card.href);
      }, true);
      root.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        openImpactReport(event, card.href);
      });
    });
  }

  function mountFilmsMobileAbout(path) {
    if (path !== '/films') return;
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var existing = document.querySelector('.tsc-mobile-films-about');
    var source = document.querySelector('#comp-mqksjwhn');
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      if (source) source.removeAttribute('aria-hidden');
      document.body.classList.remove('tsc-films-mobile-about-mounted');
      return;
    }
    if (existing) return;
    if (!source || !source.parentNode) return;
    var shell = document.createElement('section');
    shell.className = 'tsc-mobile-films-about';
    shell.setAttribute('aria-label', 'About TSC Films');
    shell.innerHTML = [
      '<div class="tsc-mobile-films-about__logo">TSC<br>Films</div>',
      '<article class="tsc-mobile-films-about__panel">',
      '<h2>About Us</h2>',
      '<p>A great film is not defined only by how it is made. It is defined by how deeply it connects with people.</p>',
      '</article>'
    ].join('');
    source.insertAdjacentElement('afterend', shell);
    source.setAttribute('aria-hidden', 'true');
    document.body.classList.add('tsc-films-mobile-about-mounted');
  }

  function mountFilmsMobileOriginals(path) {
    var existing = document.querySelector('.tsc-mobile-films-originals');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    document.body.classList.remove('tsc-films-mobile-originals-mounted');
  }

  function mountFilmBottomCtas(path) {
    if (path !== '/films') return;
    var ctas = [
      { id: 'comp-mqmkrjnm', href: '/resources', label: 'Resources' },
      { id: 'comp-mqmkth8f', href: 'mailto:' + CONTACT_EMAIL, label: 'Email Us' }
    ];
    ctas.forEach(function (cta) {
      var node = document.getElementById(cta.id);
      if (!node) return;
      node.classList.add('tsc-film-bottom-cta');
      node.setAttribute('role', 'link');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', cta.label);
      node.setAttribute('data-tsc-film-bottom-cta', cta.href);
      var existing = node.querySelector('.tsc-film-bottom-cta-hitarea');
      if (!existing) {
        existing = document.createElement('a');
        existing.className = 'tsc-film-bottom-cta-hitarea';
        existing.textContent = cta.label;
        node.appendChild(existing);
      }
      existing.href = cta.href;
      existing.setAttribute('aria-label', cta.label);
      if (node.getAttribute('data-tsc-film-bottom-cta-wired') === 'true') return;
      node.setAttribute('data-tsc-film-bottom-cta-wired', 'true');
      node.addEventListener('click', function (event) {
        if (event.defaultPrevented) return;
        window.location.assign(cta.href);
      });
      node.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(cta.href);
      });
    });
  }

  function mountAboutMobileFilmsCard(path) {
    if (path !== '/about') return;
    if (!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches)) {
      var stale = document.querySelector('.tsc-mobile-about-films-card');
      if (stale && stale.parentNode) stale.parentNode.removeChild(stale);
      document.body.classList.remove('tsc-about-mobile-films-mounted');
      return;
    }
    var original = document.getElementById('comp-mr3hkny1');
    if (!original || !original.parentNode) {
      if (!window.__tscAboutMobileFilmsRetry) {
        window.__tscAboutMobileFilmsRetry = true;
        [250, 700, 1400, 2600].forEach(function (delay) {
          window.setTimeout(function () {
            mountAboutMobileFilmsCard('/about');
          }, delay);
        });
      }
      return;
    }
    var shell = document.querySelector('.tsc-mobile-about-films-card');
    if (!shell) {
      shell = document.createElement('section');
      shell.className = 'tsc-mobile-about-films-card';
      shell.setAttribute('aria-label', 'TSC Films');
      shell.innerHTML = [
        '<article>',
        '<div class="tsc-mobile-about-films-card__logo">TSC<br>Films</div>',
        '<p class="tsc-mobile-about-films-card__kicker">Building Audiences For Stories</p>',
        '<h2>A great film deserves more than successful release.</h2>',
        '<p>TSC Films partners with filmmakers, producers, and studios to build audience demand through strategic positioning, cultural storytelling, partnerships, release planning, and long-term IP development.</p>',
        '<div class="tsc-mobile-about-films-card__chips" aria-label="TSC Films focus areas">',
        '<span>Film Positioning</span>',
        '<span>Audience Strategy</span>',
        '<span>Partnerships</span>',
        '<span>IP Development</span>',
        '</div>',
        '<a href="/films">Know More</a>',
        '</article>'
      ].join('');
    }
    if (shell.parentNode !== original.parentNode || shell.nextSibling !== original) {
      original.parentNode.insertBefore(shell, original);
    }
    try {
      var placement = window.getComputedStyle(original);
      ['gridArea', 'gridRow', 'gridColumn'].forEach(function (prop) {
        var value = placement[prop];
        if (value && value !== 'auto / auto / auto / auto' && value !== 'auto') {
          shell.style[prop] = value;
        }
      });
    } catch (err) {}
    original.setAttribute('aria-hidden', 'true');
    document.body.classList.add('tsc-about-mobile-films-mounted');
  }

  function repairMobileDesignDetails(path) {
    if (!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches)) return;
    if (path === '/films') {
      document.querySelectorAll('#comp-mqmi3w46 h2, #comp-mqmi6yo71 h2, #comp-mqmi8cy13 h2, #comp-mqmi8suv6 h2').forEach(function (title) {
        title.style.setProperty('height', 'auto', 'important');
        title.style.setProperty('min-height', '0', 'important');
        title.style.setProperty('max-height', 'none', 'important');
        title.style.setProperty('overflow', 'visible', 'important');
        title.style.setProperty('white-space', 'normal', 'important');
        title.style.setProperty('text-overflow', 'clip', 'important');
      });
    }
    if (path === '/harshad-duhita' || path === '/mohit-shankar') {
      ['comp-mq7ox4wz', 'comp-mq7p00rc'].forEach(function (id) {
        var chip = document.getElementById(id);
        if (!chip) return;
        chip.style.setProperty('height', '44px', 'important');
        chip.style.setProperty('min-height', '44px', 'important');
        chip.style.setProperty('display', 'inline-flex', 'important');
        chip.style.setProperty('align-items', 'center', 'important');
        chip.style.setProperty('justify-content', 'center', 'important');
        chip.style.setProperty('overflow', 'visible', 'important');
      });
    }
  }

  function repairAffiliateHeroImage(path) {
    if (path !== '/affiliate') return;
    document.querySelectorAll('img[src*="hero-singer.png"], img[srcset*="hero-singer.png"]').forEach(function (img) {
      img.src = '/assets/pages/affiliate/hero-singer.png';
      img.removeAttribute('srcset');
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
    });
  }

  function wireLockedArtistsDropdownClickGuard() {
    if (window.__tscArtistsDropdownClickGuard) return;
    window.__tscArtistsDropdownClickGuard = true;
    var targets = {
      'TSC Artists': '/artists',
      'Artist Path': '/artist-path',
      'Learn With TSC': '/academy'
    };
    function visibleRect(node) {
      if (!node || !node.getBoundingClientRect) return null;
      var rect = node.getBoundingClientRect();
      return rect && rect.width > 2 && rect.height > 2 ? rect : null;
    }
    function isArtistsLabel(node) {
      return (node.textContent || '').trim().replace(/\s+/g, ' ') === 'Artists';
    }
    function visibleArtistsTrigger() {
      var candidates = Array.prototype.filter.call(document.querySelectorAll('header a, header button, header .wixui-horizontal-menu__item, header .wixui-menu__item'), function (node) {
        var rect = visibleRect(node);
        return rect && isArtistsLabel(node);
      });
      candidates.sort(function (a, b) {
        var ar = a.getBoundingClientRect();
        var br = b.getBoundingClientRect();
        return ar.top - br.top || br.left - ar.left;
      });
      return candidates[0] || null;
    }
    function alignOpenArtistsDropdown() {
      var trigger = visibleArtistsTrigger();
      var triggerRect = visibleRect(trigger);
      if (!triggerRect) return;
      /* Wix .rpHatU uses left:var(--dropdown-left)!important — plain style.left loses. */
      Array.prototype.forEach.call(document.querySelectorAll('[id$="-dropdown"][data-part="dropdown-container"]'), function (dropdown) {
        var label = (dropdown.textContent || '').trim().replace(/\s+/g, ' ');
        if (label.indexOf('TSC Artists') === -1 || label.indexOf('Artist Path') === -1 || label.indexOf('Learn With TSC') === -1) return;
        var rect = visibleRect(dropdown);
        if (!rect) return;
        var delta = Math.abs(rect.left - triggerRect.left);
        if (delta <= 2) return;
        var parent = dropdown.offsetParent;
        var parentLeft = parent && parent.getBoundingClientRect ? parent.getBoundingClientRect().left : 0;
        var leftPx = Math.round(triggerRect.left - parentLeft) + 'px';
        dropdown.style.setProperty('--dropdown-left', leftPx);
        dropdown.style.setProperty('left', leftPx, 'important');
        dropdown.style.setProperty('right', 'auto', 'important');
        dropdown.style.setProperty('transform', 'none', 'important');
        dropdown.dataset.tscArtistsDropdownAligned = 'true';
      });
    }
    function scheduleArtistsDropdownAlign() {
      window.requestAnimationFrame(alignOpenArtistsDropdown);
      window.setTimeout(alignOpenArtistsDropdown, 80);
      window.setTimeout(alignOpenArtistsDropdown, 200);
    }
    function dropdownTarget(event) {
      var node = event.target && event.target.closest && event.target.closest('a, [role="menuitem"], .wixui-dropdown-menu__item, .wixui-vertical-menu__item-label');
      if (!node) return null;
      var label = (node.textContent || '').trim().replace(/\s+/g, ' ');
      var href = targets[label];
      if (!href) return null;
      var rect = node.getBoundingClientRect && node.getBoundingClientRect();
      if (!rect || rect.width < 2 || rect.height < 2) return null;
      return href;
    }
    document.addEventListener('click', function (event) {
      var href = dropdownTarget(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var href = dropdownTarget(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('pointerover', scheduleArtistsDropdownAlign, true);
    document.addEventListener('mouseover', scheduleArtistsDropdownAlign, true);
    document.addEventListener('focusin', scheduleArtistsDropdownAlign, true);
    document.addEventListener('click', scheduleArtistsDropdownAlign, true);
    window.addEventListener('resize', scheduleArtistsDropdownAlign);
    if (window.MutationObserver && document.body) {
      new MutationObserver(scheduleArtistsDropdownAlign).observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class', 'data-state', 'data-open', 'data-anchor', 'aria-expanded'] });
    }
  }

  function watchLinkNormalization() {
    if (window.__tscLinkNormalizationObserver || !window.MutationObserver || !document.body) return;
    window.__tscLinkNormalizationObserver = true;
    var scheduled = false;
    var observer = new MutationObserver(function (mutations) {
      var relevant = mutations.some(function (mutation) {
        if (mutation.type === 'attributes') return mutation.attributeName === 'href';
        return Array.prototype.some.call(mutation.addedNodes || [], function (node) {
          return node.nodeType === 1 && (node.matches && node.matches('a[href]') || node.querySelector && node.querySelector('a[href]'));
        });
      });
      if (!relevant || scheduled) return;
      scheduled = true;
      window.setTimeout(function () {
        scheduled = false;
        normalizeInternalProtocolRelativeLinks();
        normalizeArtistLinks();
        forceLearnHubLinksToAcademy();
      }, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
  }

  function syncWixChoiceState() {
    document.querySelectorAll('[data-hook="box-selection-option"]').forEach(function (option) {
      var selected =
        option.getAttribute('aria-checked') === 'true' ||
        option.getAttribute('aria-selected') === 'true' ||
        option.getAttribute('data-preview') === 'selected' ||
        !!option.querySelector('input:checked');
      option.classList.toggle('is-selected', selected);
      var wrapper = option.closest && option.closest('[data-hook="box-selection-option-wrapper"]');
      if (wrapper && wrapper.classList) wrapper.classList.toggle('is-selected', selected);
    });
  }

  function watchWixChoiceState() {
    if (window.__tscWixChoiceObserver || !window.MutationObserver || !document.body) return;
    window.__tscWixChoiceObserver = true;
    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(function () {
        scheduled = false;
        syncWixChoiceState();
      }, 20);
    });
    syncWixChoiceState();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['aria-checked', 'aria-selected', 'data-preview', 'class']
    });
    document.addEventListener('change', syncWixChoiceState, true);
    document.addEventListener('click', function () {
      window.setTimeout(syncWixChoiceState, 0);
    }, true);
  }

  /** Flat canonical path even when served as /pages/*.html or nested alias. */
  function canonicalPathname() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    var pagesMatch = path.match(/^\/pages\/([^/]+?)(?:\.html)?$/);
    if (pagesMatch) {
      return pagesMatch[1] === 'home' || pagesMatch[1] === 'index' ? '/' : '/' + pagesMatch[1];
    }
    var parts = path.split('/').filter(Boolean);
    if (parts.length >= 2) {
      // Nested aliases (/work/mba, /academy/learn-with-tsc) → leaf slug
      return '/' + parts[parts.length - 1];
    }
    return path;
  }

  function pathBasename(path) {
    if (!path || path === '/') return 'home';
    return path.replace(/^\//, '').split('/')[0] || 'home';
  }

  /* 1:1 slug → mobile CSS; prefer window.TSCMobileRouteMap when loaded */
  var MOBILE_CSS_VERSION = 'mobile-own-5';
  var MOBILE_CSS_MEDIA = '(max-width: 1024px)';

  var LEARN_PATHS = {
    '/roots-of-hindustani-classical': true,
    '/the-heart-of-composition': true,
    '/music-production': true,
    '/course-bundle': true,
    '/book-a-call': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };

  var ARTISTS_PATHS = {
    '/artists': true,
    '/harshad-duhita': true,
    '/mohit-shankar': true,
    '/yugm': true,
    '/artist-path': true,
    '/book-an-artist': true,
    '/artist-query': true,
    '/collab-query': true
  };

  var WORK_PATHS = { '/work': true, '/insta-music-league': true, '/young-gunns': true };
  var IMPACT_PATHS = {
    '/mba': true,
    '/mba-impact': true,
    '/havells-myousic': true,
    '/insta-music-league': true,
    '/young-gunns': true,
    '/impact-report': true
  };
  var FILMS_PATHS = {
    '/films': true,
    '/mahavatar-narsimha': true,
    '/mahavatar-narsimha-impact': true,
    '/hanuman-ansh': true,
    '/hanuman-ansh-impact': true,
    '/mahaprbhu': true,
    '/mahaprbhu-impact': true,
    '/mahaprabhu-jagannath-impact': true,
    '/kalki': true,
    '/kalki-impact': true
  };
  var RESOURCES_PATHS = {
    '/resources': true,
    '/blog-1': true,
    '/blog-2': true,
    '/blog-3': true,
    '/start-making-music': true,
    '/online-music-course-worth-it': true,
    '/artist-release-playbook': true,
    '/from-bhajan-to-clubbing': true,
    '/you-released-a-song-now-what': true,
    '/how-i-curate-music-with-independent-artists': true
  };

  /* Nav logos: locked desktop treatment — no flush-bust after lock (stable v). */
  var TSC_LOGO_SRC = '/assets/brand/tsc-logo-trim-nav.png?v=nav-lock-4';
  var ACADEMY_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-nav.png?v=nav-lock-4';
  var TSC_FOOTER_LOGO_SRC = '/assets/brand/tsc-logo-trim-footer.png?v=flush-1';
  var ACADEMY_FOOTER_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-footer.png?v=flush-1';
  var DEFAULT_BRAND_ASSETS = {
    main: {
      logo: TSC_LOGO_SRC,
      icon: '/assets/brand/tsc-favicon-32.png',
      touchIcon: '/assets/brand/tsc-apple-touch-icon.png',
      name: 'The Shakti Collective',
      tagline: 'Unfolding Artist Force .'
    },
    academy: {
      logo: ACADEMY_LOGO_SRC,
      icon: '/assets/brand/academy-favicon-32.png',
      touchIcon: '/assets/brand/academy-apple-touch-icon.png',
      name: 'TSC Academy',
      tagline: 'Mentorship-led learning for serious artists.'
    }
  };

  var DEFAULT_ACADEMY_PATHS = {
    '/academy': true,
    '/learn-with-tsc': true,
    '/resources': true,
    '/blog-1': true,
    '/blog-2': true,
    '/blog-3': true,
    '/start-making-music': true,
    '/online-music-course-worth-it': true,
    '/artist-release-playbook': true,
    '/from-bhajan-to-clubbing': true,
    '/you-released-a-song-now-what': true,
    '/how-i-curate-music-with-independent-artists': true,
    '/the-heart-of-composition': true,
    '/roots-of-hindustani-classical': true,
    '/music-production': true,
    '/course-bundle': true,
    '/affiliate': true,
    '/book-a-call': true,
    '/artist-query': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true,
    '/blank-9': true,
    '/about-9': true,
    '/blank-9-1': true,
    '/about-9-1': true,
    '/blank-8': true,
    '/about-8': true
  };

  function isAcademyPath(path) {
    return !!DEFAULT_ACADEMY_PATHS[path || canonicalPathname()];
  }

  /** Native Wix header (About / Academy home) — not TSC-injected chrome. */
  function usesNativeWixNav(path) {
    if (document.querySelector('.report-page')) return false;
    if ((path || canonicalPathname()) === '/course-bundle') return false;
    return true;
  }

  function removeInjectedTscHeaders() {
    var desktop = document.querySelector('.tsc-desktop-site-header');
    if (desktop && desktop.parentNode) desktop.parentNode.removeChild(desktop);
    var mobile = document.querySelector('.tsc-mobile-site-header');
    if (mobile && mobile.parentNode) mobile.parentNode.removeChild(mobile);
    document.body.classList.remove('tsc-has-mobile-chrome');
  }

  function clearNativeHeaderLockState() {
    document.querySelectorAll('.tsc-legacy-header, .tsc-locked-desktop-header-hidden').forEach(function (node) {
      node.classList.remove('tsc-legacy-header', 'tsc-locked-desktop-header-hidden');
      node.removeAttribute('aria-hidden');
    });
    document.querySelectorAll('[data-tsc-locked-desktop-header="true"]').forEach(function (node) {
      node.removeAttribute('data-tsc-locked-desktop-header');
    });
  }

  function restoreNativeWixNavChrome() {
    removeInjectedTscHeaders();
    clearNativeHeaderLockState();
    document.querySelectorAll('[data-tsc-wix-nav-hidden="true"]').forEach(function (node) {
      node.removeAttribute('data-tsc-wix-nav-hidden');
      node.style.removeProperty('display');
      node.style.removeProperty('pointer-events');
    });
    document.querySelectorAll('.tsc-hidden-duplicate-nav').forEach(function (node) {
      node.classList.remove('tsc-hidden-duplicate-nav');
      node.removeAttribute('aria-hidden');
    });
  }

  var wixHeaderScrollBound = false;

  function getPageScrollY() {
    var y = window.scrollY || window.pageYOffset || 0;
    if (!y && document.body) y = document.body.scrollTop || 0;
    if (!y && document.documentElement) y = document.documentElement.scrollTop || 0;
    return y;
  }

  /** ponytail: Wix sticky header scroll classes when Thunderbolt hydrate is thin/offline. */
  function ensureWixHeaderScrollAnimation() {
    if (wixHeaderScrollBound) return;
    wixHeaderScrollBound = true;

    var update = function () {
      var scrolled = getPageScrollY() > 12;
      var headerRoot = document.querySelector('[data-tsc-locked-desktop-header="true"]') ||
        document.querySelector('header:not(.tsc-locked-desktop-header-hidden):not(.tsc-hidden-main-site-header)');

      if (headerRoot) {
        headerRoot.querySelectorAll('section.wixui-header[id$="_r_comp-kbgajy18"], section.Lnr3dj.wixui-header').forEach(function (section) {
          section.classList.toggle('aBo_xL', scrolled);
        });
        headerRoot.querySelectorAll('section[id$="_r_comp-mrqgho3a"].w2JesW, section[id$="_r_comp-mrqgho3a"] .w2JesW').forEach(function (node) {
          node.classList.toggle('VHnL1N', scrolled);
        });
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    document.addEventListener('scroll', update, { passive: true, capture: true });
    if (document.body) document.body.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /** mrriywbr = desktop horizontal nav (About, Work, …). Never hide it. */
  function ensurePrimaryWixNavVisible() {
    document.querySelectorAll('[id$="_r_comp-mrriywbr"], [id^="portal-comp-"][id$="_r_comp-mrriywbr"]').forEach(function (node) {
      node.classList.remove('tsc-hidden-duplicate-nav');
      node.removeAttribute('aria-hidden');
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('height');
      node.style.removeProperty('max-height');
      node.style.removeProperty('overflow');
      node.style.removeProperty('pointer-events');
    });
  }

  function hideAcademyMainSiteHeaders() {
    document.querySelectorAll('header, #SITE_HEADER, [data-testid="siteHeader"]').forEach(function (header) {
      if (header.classList.contains('tsc-desktop-site-header') || header.classList.contains('tsc-mobile-site-header')) return;
      if (header.querySelector('[id$="_r_comp-mrrjao68"]')) return;
      if (header.querySelector('[id$="_r_comp-mb5540mw"]') || header.querySelector('[id$="_r_comp-mrriywbr"]')) {
        header.classList.add('tsc-hidden-main-site-header');
        header.setAttribute('aria-hidden', 'true');
      }
    });
  }

  var SOCIAL_SVGS = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24zm6.3-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0zM12 4.32c-2.1 0-2.36.01-3.19.05-.82.04-1.39.17-1.88.36a3.8 3.8 0 0 0-1.37.89 3.8 3.8 0 0 0-.89 1.37c-.19.49-.32 1.06-.36 1.88-.04.83-.05 1.09-.05 3.19s.01 2.36.05 3.19c.04.82.17 1.39.36 1.88.2.51.46.95.89 1.37.42.43.86.69 1.37.89.49.19 1.06.32 1.88.36.83.04 1.09.05 3.19.05s2.36-.01 3.19-.05c.82-.04 1.39-.17 1.88-.36a3.8 3.8 0 0 0 1.37-.89 3.8 3.8 0 0 0 .89-1.37c.19-.49.32-1.06.36-1.88.04-.83.05-1.09.05-3.19s-.01-2.36-.05-3.19c-.04-.82-.17-1.39-.36-1.88a3.8 3.8 0 0 0-.89-1.37 3.8 3.8 0 0 0-1.37-.89c-.49-.19-1.06-.32-1.88-.36C14.36 4.33 14.1 4.32 12 4.32zm0 1.52c2.06 0 2.31.01 3.12.05.75.03 1.16.16 1.43.26.36.14.62.31.89.58.27.27.44.53.58.89.1.27.23.68.26 1.43.04.81.05 1.06.05 3.12s-.01 2.31-.05 3.12c-.03.75-.16 1.16-.26 1.43-.14.36-.31.62-.58.89a2.4 2.4 0 0 1-.89.58c-.27.1-.68.23-1.43.26-.81.04-1.06.05-3.12.05s-2.31-.01-3.12-.05c-.75-.03-1.16-.16-1.43-.26a2.4 2.4 0 0 1-.89-.58 2.4 2.4 0 0 1-.58-.89c-.1-.27-.23-.68-.26-1.43-.04-.81-.05-1.06-.05-3.12s.01-2.31.05-3.12c.03-.75.16-1.16.26-1.43.14-.36.31-.62.58-.89.27-.27.53-.44.89-.58.27-.1.68-.23 1.43-.26.81-.04 1.06-.05 3.12-.05z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.53 14.94L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2zm5.79 14.13c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.18-4.93-4.38-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .4-.07.63.48.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.15.32-.3.49-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.4-.24.67-.14.27.1 1.72.81 2.01.96.29.14.49.22.56.34.07.12.07.7-.17 1.38z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.58A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 7.05a1.96 1.96 0 1 0 0-3.92 1.96 1.96 0 0 0 0 3.92zM20.44 20h-3.37v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.7V8.5h3.23v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V20z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2 5h20v14H2V5zm2.4 2 7.6 5.15L19.6 7H4.4zm15.6 9.6V8.95l-8 5.42-8-5.42v7.65h16z"/></svg>'
  };

  /** Learn hub + course pages share learn-with-tsc for sticky full-width override. */
  var LEARN_DATA_PAGE = {
    '/roots-of-hindustani-classical': true,
    '/the-heart-of-composition': true,
    '/music-production': true
  };

  function mobilePageCssHref(path) {
    if (window.TSCMobileRouteMap && typeof window.TSCMobileRouteMap.hrefForPath === 'function') {
      return window.TSCMobileRouteMap.hrefForPath(path);
    }
    var slug = pathBasename(path);
    if (path === '/' || path === '/home') slug = 'home';
    return '/css/mobile/' + slug + '.css?v=' + MOBILE_CSS_VERSION;
  }

  function pageDatasetSlug(path) {
    if (LEARN_DATA_PAGE[path]) return 'learn-with-tsc';
    var base = pathBasename(path);
    // Semantic blog slugs keep blog-N mobile CSS / layout rules
    var dataPageAlias = {
      'start-making-music': 'blog-1',
      'online-music-course-worth-it': 'blog-2',
      'artist-release-playbook': 'blog-3',
      'mohit-shankar': 'harshad-duhita',
      'impact-report': 'mba-impact'
    };
    return dataPageAlias[base] || base;
  }

  function isLearnStickyPage(path) {
    return !!LEARN_PATHS[path] || path === '/academy';
  }

  function injectStickyCta(path) {
    var existing = document.querySelector('[data-tsc-sticky-cta], .tsc-phone-fab, .tsc-sticky-cta');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var academyFab = !!(LEARN_PATHS && LEARN_PATHS[path]) ||
      path === '/academy' || path === '/book-a-call' ||
      path === '/artist-path' || path === '/' ||
      path.indexOf('/the-heart') === 0 || path.indexOf('/roots-of') === 0 ||
      path.indexOf('/music-production') === 0;
    if (!academyFab) return;

    var a = document.createElement('a');
    a.className = 'tsc-sticky-cta tsc-phone-fab is-visible';
    a.href = '/book-a-call';
    a.setAttribute('data-tsc-sticky-cta', 'phone-fab');
    a.setAttribute('aria-label', 'Book a Call');
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>';
    document.body.appendChild(a);
  }

  function setBodyPage(path) {
    if (!document.body) return;
    var page = pageDatasetSlug(path);
    document.body.dataset.page = page;
    document.body.setAttribute('data-page', page);
  }

  function hideWixMobileNavChrome() {
    if (!document.body) return;
    var hasTsc = !!document.querySelector('.tsc-mobile-site-header');
    document.body.classList.toggle('tsc-has-mobile-chrome', hasTsc);
    if (!hasTsc) return;
    // Wix Menu buttons + overlay chrome — hide so only TSC hamburger remains.
    var nodes = document.querySelectorAll([
      'header button[aria-label="Menu"]',
      'header button[aria-label*="menu" i]',
      '#SITE_HEADER button[aria-label="Menu"]',
      '[data-hook="hamburger-overlay-root"]',
      '[data-hook="menu-overlay-root"]',
      '[id$="-pinned-layer"]:has(.wixui-vertical-menu)',
      '[id$="-pinned-layer"]:has([data-hook="menu-root"])',
      '[id$="-pinned-layer"]:has([data-hook="hamburger-overlay-root"])'
    ].join(','));
    Array.prototype.forEach.call(nodes, function (node) {
      node.setAttribute('data-tsc-wix-nav-hidden', 'true');
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
    });
  }

  function wireMobileAssets() {
    if (!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches)) return;
    if (window.__tscMobileWired) return;
    window.__tscMobileWired = true;
    try {
      var path = canonicalPathname();
      setBodyPage(path);
      normalizeInternalProtocolRelativeLinks();
      var media =
        (window.TSCMobileRouteMap && window.TSCMobileRouteMap.MEDIA) || MOBILE_CSS_MEDIA;
      // tsc-mobile-system.css @imports tokens + safe-base — media-gated (no desktop leak)
      ensureStylesheet('/css/tsc-mobile-system.css?v=' + MOBILE_CSS_VERSION, { media: media });
      ensureStylesheet(mobilePageCssHref(path), { media: media });
      mountAboutMobileFilmsCard(path);
      repairMobileDesignDetails(path);
      [350, 900, 1800, 3200].forEach(function (delay) {
        window.setTimeout(function () {
          repairMobileDesignDetails(path);
        }, delay);
      });
      injectStickyCta(path);
      // Keep cloned Wix chrome as baseline across breakpoints.
      // Custom mobile header/footer changed layout too far from source design.
      if (ENABLE_CUSTOM_MOBILE_CHROME) {
        mountDesktopFooter({ path: path });
        mountMobileHeader({ path: path });
        mountMobileFooter({ path: path });
        hideWixMobileNavChrome();
        // Re-assert after Thunderbolt hydration may re-show Wix menu.
        [400, 1200, 2500, 5000, 8000].forEach(function (delay) {
          window.setTimeout(function () {
            mountMobileHeader({ path: path });
            mountMobileFooter({ path: path });
            hideWixMobileNavChrome();
          }, delay);
        });
      } else {
        unmountCustomMobileChrome();
      }
      ensureScript('/js/tsc-mobile-system.js', function () {
        // CTA may have been injected after first auto-init; rebind if API present.
        // Nav takeover only binds when [data-tsc-nav-takeover] exists — skip if absent.
        if (window.TSCMobileSystem) {
          if (window.TSCMobileSystem.initStickyCta) window.TSCMobileSystem.initStickyCta();
          if (window.TSCMobileSystem.initNavTakeover) window.TSCMobileSystem.initNavTakeover();
        }
        normalizeInternalProtocolRelativeLinks();
      });
      // Page *.animations.js not inlined on locked primary HTML — load mesh/content
      // replacements here so Work/Films/Home mobile shells still mount under mobile-only loader.
      if (path === '/artists') {
        ensureScript('/js/tsc-artists-accordion.js?v=yugm-cta-nav-1', function () {
          if (window.TSCArtistsAccordion && window.TSCArtistsAccordion.init) {
            window.TSCArtistsAccordion.init();
          }
        });
      }
    } catch (err) {
      if (typeof console !== 'undefined' && console.warn) console.warn('[tsc] mobile wire failed', err);
    } finally {
      markMobileReadySafe();
    }
  }

  function markMobileReadySafe() {
    try {
      document.documentElement.classList.add('tsc-mobile-ready');
      document.documentElement.classList.add('tsc-skel-revealed');
    } catch (e) { }
  }

  function unmountCustomMobileChrome() {
    document.querySelectorAll('.tsc-mobile-site-header, .tsc-mobile-footer, .tsc-desktop-footer').forEach(function (node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    document.body.classList.remove('tsc-has-mobile-footer', 'tsc-has-desktop-footer', 'tsc-has-mobile-chrome');
  }

  function optionMarkup(options, selected) {
    return ['<option value="">Select</option>'].concat((options || []).map(function (option) {
      return '<option value="' + escapeHtml(option) + '"' + (option === selected ? ' selected' : '') + '>' + escapeHtml(option) + '</option>';
    })).join('');
  }

  function countryCodeFromValue(value) {
    var match = String(value || '').match(/^\+\d+/);
    return match ? match[0] : '';
  }

  function phoneWithCountryCode(countryValue, phoneValue) {
    var code = countryCodeFromValue(countryValue);
    var phone = String(phoneValue || '').trim();
    if (!code || !phone) return phone;
    if (phone.indexOf('+') === 0) return phone;
    return code + ' ' + phone;
  }

  function labelMarkup(field) {
    return '<span class="tsc-label-text">' + escapeHtml(field.label) + (field.required ? ' <span class="tsc-required-mark" aria-hidden="true">*</span>' : '') + '</span>';
  }

  function fieldMarkup(field, formName, shared) {
    var id = 'tsc-' + formName + '-' + slug(field.label);
    var required = field.required ? ' required' : '';
    var ariaRequired = field.required ? ' aria-required="true"' : '';
    var isFull = field.full || field.type === 'textarea' || field.type === 'checkboxes' || field.type === 'radios';
    var cls = 'tsc-field' + (isFull ? ' tsc-field-full' : '') + (field.required ? ' tsc-field-required' : '');
    var name = escapeHtml(field.name || slug(field.label));
    var label = labelMarkup(field);

    if (field.type === 'select') {
      return '<label class="' + cls + '" for="' + id + '">' + label + '<select id="' + id + '" name="' + name + '"' + required + ariaRequired + '>' + optionMarkup(field.options || []) + '</select></label>';
    }

    if (field.type === 'date') {
      return '<label class="' + cls + ' tsc-picker-field" for="' + id + '">' + label + '<span class="tsc-picker-shell tsc-date-picker is-empty" data-placeholder="Select date"><span class="tsc-picker-icon" aria-hidden="true"></span><input id="' + id + '" name="' + name + '" type="date"' + required + ariaRequired + '></span></label>';
    }

    if (field.type === 'timeSelect') {
      return '<label class="' + cls + ' tsc-picker-field" for="' + id + '">' + label + '<span class="tsc-picker-shell tsc-time-picker"><span class="tsc-picker-icon" aria-hidden="true"></span><select id="' + id + '" name="' + name + '"' + required + ariaRequired + '>' + optionMarkup(field.options || []) + '</select></span></label>';
    }

    if (field.type === 'textarea') {
      return '<label class="' + cls + '" for="' + id + '">' + label + '<textarea id="' + id + '" name="' + name + '"' + required + ariaRequired + '></textarea></label>';
    }

    if (field.type === 'phoneCountry') {
      return '<div class="' + cls + '"><label for="' + id + '-phone">' + label + '</label><div class="tsc-phone-row"><select id="' + id + '-country" name="country-code" aria-label="Country code">' + optionMarkup(shared.countryCodes, shared.defaultCountryCode || '+91 India') + '</select><input id="' + id + '-phone" name="' + name + '" type="tel"' + required + ariaRequired + '></div></div>';
    }

    if (field.type === 'checkboxes' || field.type === 'radios') {
      var inputType = field.type === 'checkboxes' ? 'checkbox' : 'radio';
      var choices = (field.options || []).map(function (option, index) {
        var choiceId = id + '-' + index;
        var choiceName = name + (inputType === 'checkbox' ? '[]' : '');
        return '<label class="tsc-choice" for="' + choiceId + '"><input id="' + choiceId + '" type="' + inputType + '" name="' + choiceName + '" value="' + escapeHtml(option) + '"' + (field.required && index === 0 ? required + ariaRequired : '') + '><span>' + escapeHtml(option) + '</span></label>';
      }).join('');
      return '<fieldset class="' + cls + ' tsc-choice-group"><legend>' + label + '</legend><div class="tsc-choices">' + choices + '</div></fieldset>';
    }

    return '<label class="' + cls + '" for="' + id + '">' + label + '<input id="' + id + '" name="' + name + '" type="' + escapeHtml(field.type || 'text') + '"' + required + ariaRequired + '></label>';
  }

  function formMarkup(def, name, shared) {
    if (def.multiStep) {
      var step1Fields = (def.fields || []).filter(function (f) { return (f.step || 1) === 1; });
      var step2Fields = (def.fields || []).filter(function (f) { return f.step === 2; });
      var step3Fields = (def.fields || []).filter(function (f) { return f.step === 3; });

      return '<form class="tsc-local-form tsc-multistep-form" data-tsc-form="' + name + '">' +
        '<h2>' + escapeHtml(def.title) + '</h2>' +
        '<div class="tsc-step-nav" aria-label="Form progress">' +
        '<span class="tsc-step-badge is-active" data-step-badge="1">Step 1: Personal</span>' +
        '<span class="tsc-step-badge" data-step-badge="2">Step 2: Craft & Story</span>' +
        '<span class="tsc-step-badge" data-step-badge="3">Step 3: Vision</span>' +
        '</div>' +
        '<div class="tsc-form-step is-active" data-step="1">' +
        '<div class="tsc-form-grid">' + step1Fields.map(function (f) { return fieldMarkup(f, name, shared || {}); }).join('') + '</div>' +
        '<div class="tsc-step-actions"><button type="button" class="tsc-submit tsc-next-btn" data-goto="2">Next Step →</button></div>' +
        '</div>' +
        '<div class="tsc-form-step" data-step="2" hidden>' +
        '<div class="tsc-form-grid">' + step2Fields.map(function (f) { return fieldMarkup(f, name, shared || {}); }).join('') + '</div>' +
        '<div class="tsc-step-actions"><button type="button" class="tsc-prev-btn" data-goto="1">← Back</button><button type="button" class="tsc-submit tsc-next-btn" data-goto="3">Next Step →</button></div>' +
        '</div>' +
        '<div class="tsc-form-step" data-step="3" hidden>' +
        '<div class="tsc-form-grid">' + step3Fields.map(function (f) { return fieldMarkup(f, name, shared || {}); }).join('') + '</div>' +
        '<div class="tsc-step-actions"><button type="button" class="tsc-prev-btn" data-goto="2">← Back</button><button class="tsc-submit" type="submit">Submit Application</button></div>' +
        '</div>' +
        '<p class="tsc-form-note" role="status" hidden></p>' +
        '</form>';
    }

    return '<form class="tsc-local-form" data-tsc-form="' + name + '"><h2>' + escapeHtml(def.title) + '</h2><p class="tsc-required-note"><span class="tsc-required-mark" aria-hidden="true">*</span> Required</p><div class="tsc-form-grid">' + (def.fields || []).map(function (field) {
      return fieldMarkup(field, name, shared || {});
    }).join('') + '<div class="tsc-field tsc-field-full"><button class="tsc-submit" type="submit">Submit</button><p class="tsc-form-note" role="status" hidden></p></div></div></form>';
  }

  function formEndpoint(name) {
    return {
      bookCall: '/api/book-call',
      bookArtist: '/api/query',
      artistPath: '/api/artist-path',
      collabQuery: '/api/leads',
      affiliateApp: '/api/leads',
      review01: '/api/reviews',
      review02: '/api/reviews02',
      classicalReview: '/api/reviews'
    }[name] || '';
  }

  function readFormValues(form) {
    var values = {};
    var data = new FormData(form);
    data.forEach(function (value, key) {
      var cleanKey = key.replace(/\[\]$/, '');
      if (values[cleanKey] !== undefined) {
        if (!Array.isArray(values[cleanKey])) values[cleanKey] = [values[cleanKey]];
        values[cleanKey].push(value);
      } else {
        values[cleanKey] = value;
      }
    });
    return values;
  }

  function syncChoiceState(form) {
    if (!form || !form.querySelectorAll) return;
    form.querySelectorAll('.tsc-choice').forEach(function (choice) {
      var input = choice.querySelector('input');
      choice.classList.toggle('is-selected', !!(input && input.checked));
    });
  }

  function bindChoiceState(form) {
    if (!form || form.dataset.choiceStateBound) return;
    form.dataset.choiceStateBound = 'true';
    syncChoiceState(form);
    form.addEventListener('change', function (event) {
      if (event.target && event.target.matches && event.target.matches('.tsc-choice input')) {
        syncChoiceState(form);
      }
    });
    form.addEventListener('reset', function () {
      window.setTimeout(function () { syncChoiceState(form); }, 0);
    });
  }

  function bindDatePickers(form) {
    if (!form || form.dataset.datePickersBound) return;
    form.dataset.datePickersBound = 'true';
    function syncDateState(input) {
      var shell = input && input.closest ? input.closest('.tsc-date-picker') : null;
      if (shell) shell.classList.toggle('is-empty', !input.value);
    }
    function openDatePicker(input) {
      if (!input) return;
      try {
        input.focus({ preventScroll: true });
      } catch (e) {
        input.focus();
      }
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
          return;
        } catch (e) { }
      }
      if (document.activeElement !== input) input.focus();
    }
    // Legacy parity: never allow past dates (fallback local form path).
    function localCountryCode(form) {
      var sel = form.querySelector('select[name="country-code"]');
      var val = sel ? String(sel.value || '').trim() : '';
      var m = val.match(/\+?\d{1,3}/);
      return m ? (m[0].indexOf('+') === 0 ? m[0] : '+' + m[0]) : '+91';
    }
    function refreshLocalDateMin() {
      var minDate = todayInTimeZone(timezoneForCountryCode(localCountryCode(form)));
      form.querySelectorAll('.tsc-date-picker input[type="date"]').forEach(function (input) {
        input.min = minDate;
        if (input.value && input.value < minDate) input.value = '';
      });
    }
    refreshLocalDateMin();
    var localCountrySelect = form.querySelector('select[name="country-code"]');
    if (localCountrySelect) {
      localCountrySelect.addEventListener('change', refreshLocalDateMin);
    }
    form.querySelectorAll('.tsc-date-picker input[type="date"]').forEach(function (input) {
      syncDateState(input);
      input.addEventListener('input', function () { syncDateState(input); });
      input.addEventListener('change', function () { syncDateState(input); });
      input.addEventListener('click', function () {
        openDatePicker(input);
      });
      var shell = input.closest('.tsc-date-picker');
      if (!shell) return;
      shell.addEventListener('click', function (event) {
        if (event.target !== input) openDatePicker(input);
      });
    });
    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        form.querySelectorAll('.tsc-date-picker input[type="date"]').forEach(syncDateState);
      }, 0);
    });
  }

  function payloadForForm(name, values) {
    if (name === 'bookCall') {
      return {
        course: values['which-course-are-you-interested-in'],
        name: values['what-s-your-name'],
        phone: phoneWithCountryCode(values['country-code'], values['phone-whatsapp-number']),
        countryCode: countryCodeFromValue(values['country-code']) || values['country-code'],
        email: values['email-address'],
        date: values['pick-a-date'],
        time: values['pick-a-time'],
        source: 'tsc-website'
      };
    }
    if (name === 'bookArtist') {
      return {
        name: values['full-name'],
        organization: values.organization,
        company: values.organization,
        email: values['email-address'],
        phone: values['contact-number-with-91'],
        collabType: values['kind-of-engagement'],
        artist: values['which-artist-talent'],
        nature: values['nature-of-project'],
        locationTime: values['when-and-where'],
        scale: values['expected-scale-reach'],
        logisticsSupport: values['logistics-provided'],
        additionalVision: values['additional-vision-details'],
        source: 'tsc-website'
      };
    }
    if (name === 'artistPath') {
      return {
        firstName: values['first-name'],
        lastName: values['last-name'],
        place: values['where-are-you-based'],
        mobile: values['mobile-number'],
        email: values['email-address'],
        stageName: values['stage-name-identity'],
        instagram: values['instagram-url'],
        spotify: values['spotify-url'],
        youtube: values['youtube-url'],
        artistIdentity: values['i-am-an-artist-because'],
        trainingDetails: values['the-foundation-training-backstory'],
        coreSkills: values['core-skills-primary-weapon'],
        strengthsUniqueness: values['your-x-factor'],
        dailyTime: values['daily-dedication'],
        mentorName: values['mentor-guruji'],
        songsReleased: values['songs-released'],
        showsPerformed: values['live-shows'],
        currentFans: values['your-tribe-fanbase'],
        currentSetup: values['toolkit-setup'],
        currentlyWorkingOn: values['current-projects'],
        dailyRituals: values['daily-rituals-riyaaz'],
        learningNeeds: values['skill-gaps-what-to-learn'],
        mentorshipNeeds: values['guidance-mentorship'],
        curationNeeds: values['curation-needs-audio-video-stage'],
        fandomNeeds: values['fandom-engine-growth-missing'],
        aspirationalGoal: values['your-north-star-next-12-months'],
        anythingElse: values['anything-else-open-mic'],
        source: 'tsc-website'
      };
    }
    if (name === 'collabQuery') {
      return {
        userType: values['i-am-a'] || values['user-type'] || 'Brand',
        name: values['full-name'] || values.name,
        email: values['email-address'],
        phone: values['contact-number'] || values.phone,
        company: values.organization || values.company,
        message: values['how-can-we-collaborate'] || values.message,
        lookingFor: values['what-are-you-looking-for'],
        campaignType: values['collaboration-type'],
        source: 'tsc-website-collab'
      };
    }
    if (name === 'affiliateApp') {
      var why = values['why-do-you-want-to-join-the-tsc-affiliate-program'] || '';
      var website = values['website-social-media-profile'] || '';
      var affiliateMessage = why;
      if (website) affiliateMessage = affiliateMessage ? affiliateMessage + '\n\nWebsite / Social Media Profile: ' + website : website;
      return {
        userType: 'Affiliate',
        name: values['full-name'],
        email: values['email-address'],
        phone: phoneWithCountryCode(values['country-code'], values['phone-whatsapp-number']),
        countryCode: countryCodeFromValue(values['country-code']) || values['country-code'],
        message: affiliateMessage,
        source: 'tsc-website-affiliate'
      };
    }
    if (name === 'review01' || name === 'review02' || name === 'classicalReview') {
      return {
        firstName: values['first-name'],
        lastName: values['last-name'],
        registeredEmail: values['registered-email'],
        registeredMobile: values['registered-mobile-number'],
        musicianType: values['which-type-of-musician-artist-are-you-select-all-that-apply'],
        overallExperience: values['overall-experience'],
        pacing: values['how-was-the-pacing-of-the-sessions'],
        conceptClarity: values['concept-clarity'],
        depthOfContent: values['depth-of-content'],
        practicalUsefulness: values['practical-usefulness'],
        courseInterest: values['are-you-interested-in-taking-up-the-course-after-the-masterclass'],
        completion: values['how-much-of-the-recorded-masterclass-did-you-complete'],
        oneLineExperience: values['describe-your-experience-of-the-masterclass'],
        improvementSuggestion: values['what-should-we-improve-in-this-recorded-masterclass'],
        source: name === 'classicalReview' ? 'classical-review' : name
      };
    }
    return values;
  }

  function setFormStatus(scope, message, state) {
    var note = scope && scope.querySelector && scope.querySelector('.tsc-form-note, .tsc-desktop-footer-newsnote, .tsc-mobile-footer-newsnote');
    if (!note) return;
    note.textContent = message;
    note.hidden = false;
    note.dataset.visible = 'true';
    note.dataset.state = state || '';
  }

  // ponytail: keyword score from archived Next.js artist-path.tsx
  var ARTIST_PATH_COURSES = [
    {
      id: 'composition',
      title: 'The heART of Composition',
      mentor: 'Sandesh Shandilya',
      banner: '/assets/mirror/static.wixstatic.com/media/19f989_3583e149066b4ebf9a6f37cc7d80382a~mv2.jpg/v1/crop/x_0,y_7,w_677,h_461/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/sandesh_edited.jpg',
      url: '/the-heart-of-composition',
      keywords: ['imagination', 'emotion', 'expression', 'songwriting', 'composer', 'lyrics', 'writing', 'mainstream']
    },
    {
      id: 'classical',
      title: 'Roots of Hindustani Classical',
      mentor: 'Prasad Khaparde',
      banner: '/assets/mirror/static.wixstatic.com/media/19f989_07c6e896e4a54fcc99b08a98ceccaff4~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/prasad-hero.jpg',
      url: '/roots-of-hindustani-classical',
      keywords: ['classical', 'riyaaz', 'vocal', 'guruji', 'raag', 'hindustani', 'gharanas', 'singing']
    },
    {
      id: 'production',
      title: 'A to Z of Music Production',
      mentor: 'Luca Petracca',
      banner: '/assets/mirror/static.wixstatic.com/media/19f989_72c26b9f755948e59217c0f217c9af16~mv2.jpeg/v1/fill/w_640,h_517,fp_0.50_0.30,q_80,enc_avif,quality_auto/ab6761610000e5ebf205ff385c2272184580fd45.jpeg',
      url: '/music-production',
      keywords: ['daw', 'ableton', 'logic', 'fl studio', 'production', 'mixing', 'mastering', 'tech', 'studio', 'beat', 'orchestration']
    }
  ];

  var ARTIST_PATH_WHATSAPP = 'https://wa.me/919168665455';

  /** Home closing CTAs: keep Join → WhatsApp community; keep Build → /films. */
  function linkHomeClosingCtas() {
    var path = canonicalPathname();
    if (path !== '/' && path !== '/home' && path !== '/pages/home.html') return;

    function promoteToAnchor(wrapper) {
      if (!wrapper) return null;
      var control = wrapper.querySelector('[data-testid="linkElement"], a, button') || wrapper;
      if (control.tagName && control.tagName.toLowerCase() !== 'a') {
        var anchor = document.createElement('a');
        Array.prototype.slice.call(control.attributes || []).forEach(function (attribute) {
          if (attribute.name === 'role' || attribute.name === 'tabindex') return;
          anchor.setAttribute(attribute.name, attribute.value);
        });
        while (control.firstChild) anchor.appendChild(control.firstChild);
        if (control.parentNode) control.parentNode.replaceChild(anchor, control);
        control = anchor;
      }
      return control;
    }

    var join = promoteToAnchor(document.getElementById('comp-mrly2iho'));
    if (join) {
      join.setAttribute('href', ARTIST_PATH_WHATSAPP);
      join.setAttribute('target', '_blank');
      join.setAttribute('rel', 'noreferrer noopener');
      join.setAttribute('aria-label', 'Join The Ecosystem');
      var joinLabel = join.querySelector('.wixui-button__label, span');
      if (joinLabel) joinLabel.textContent = 'Join The Ecosystem';
      join.style.pointerEvents = 'auto';
    }

    var build = promoteToAnchor(document.getElementById('comp-mrly1u79'));
    if (build) {
      build.setAttribute('href', '/films');
      build.setAttribute('target', '_self');
      build.removeAttribute('rel');
      build.setAttribute('aria-label', 'Build With TSC');
      build.style.pointerEvents = 'auto';
    }
  }

  function getRecommendedCourse(data) {
    var text = [
      data && data.artistIdentity,
      data && data.trainingDetails,
      data && data.coreSkills,
      data && data.mentorshipNeeds,
      data && data.learningNeeds,
      data && data.currentSetup,
      data && data.currentlyWorkingOn
    ].join(' ').toLowerCase();
    var scores = { composition: 0, classical: 0, production: 0 };
    ARTIST_PATH_COURSES.forEach(function (course) {
      course.keywords.forEach(function (kw) {
        if (text.indexOf(kw) !== -1) scores[course.id] += 1;
      });
    });
    if (scores.classical > 0 && scores.classical >= scores.production && scores.classical >= scores.composition) {
      return ARTIST_PATH_COURSES[1];
    }
    if (scores.production > scores.composition && scores.production > scores.classical) {
      return ARTIST_PATH_COURSES[2];
    }
    return ARTIST_PATH_COURSES[0];
  }

  function renderArtistPathSuccess(form, payload) {
    if (!form) return;
    var course = getRecommendedCourse(payload || {});
    var panel = document.createElement('div');
    panel.className = 'tsc-artist-path-result';
    panel.setAttribute('role', 'status');
    panel.innerHTML =
      '<div class="tsc-artist-path-thanks">' +
      '<p class="tsc-artist-path-check" aria-hidden="true">✓</p>' +
      '<h2>Thank You!</h2>' +
      '<p>Your artist journey has been recorded. We&apos;ve recommended a course that matches your path.</p>' +
      '<a class="tsc-artist-path-whatsapp" href="' + ARTIST_PATH_WHATSAPP + '" target="_blank" rel="noreferrer noopener">Join the Community</a>' +
      '</div>' +
      '<div class="tsc-artist-path-recommend">' +
      '<p class="tsc-artist-path-kicker">Recommended for your growth</p>' +
      '<article class="tsc-artist-path-card">' +
      '<div class="tsc-artist-path-banner">' +
      '<img src="' + escapeHtml(course.banner) + '" alt="' + escapeHtml(course.title) + '">' +
      '<span class="tsc-artist-path-badge">Personalized Recommendation</span>' +
      '</div>' +
      '<div class="tsc-artist-path-card-body">' +
      '<h3>' + escapeHtml(course.title) + '</h3>' +
      '<p class="tsc-artist-path-mentor">Mentor: ' + escapeHtml(course.mentor) + '</p>' +
      '<a class="tsc-artist-path-explore" href="' + escapeHtml(course.url) + '">Explore Course Details</a>' +
      '<a class="tsc-artist-path-book" href="/book-a-call">Book a Call</a>' +
      '</div>' +
      '</article>' +
      '</div>';
    form.replaceWith(panel);
    try {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) { }
  }

  function bindLocalSubmit(form) {
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) return;
      var name = form.dataset.tscForm || '';
      var endpoint = formEndpoint(name);
      var button = form.querySelector('[type="submit"]');
      if (!endpoint) {
        setFormStatus(form, 'Form route missing. Please email artist@theshakticollective.in.', 'error');
        return;
      }
      if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Submitting...';
      }
      setFormStatus(form, 'Submitting...', 'pending');
      var payload = payloadForForm(name, readFormValues(form));
      try {
        var response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        });
        var body = await response.json().catch(function () { return {}; });
        if (!response.ok || body.success !== true) throw new Error(body.error || body.message || 'Submission failed');
        if (name === 'artistPath') {
          renderArtistPathSuccess(form, payload);
          return;
        }
        setFormStatus(form, body.message || 'Successfully submitted. We will follow up soon.', 'success');
        form.reset();
      } catch (error) {
        setFormStatus(form, (error && error.message) || 'Could not submit. Please try again.', 'error');
      } finally {
        if (button && form.isConnected) {
          button.disabled = false;
          button.textContent = button.dataset.originalText || 'Submit';
        }
      }
    });
  }

  function bindNewsletterSubmit(form, shell) {
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var button = form.querySelector('[type="submit"]');
      var input = form.querySelector('input[type="email"]');
      var rawEmail = input ? String(input.value || '').trim() : '';
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!rawEmail || !emailRegex.test(rawEmail)) {
        setFormStatus(shell || form, 'Please enter a valid email address (e.g. name@domain.com)', 'error');
        if (input) input.focus();
        return;
      }
      if (button) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = 'Sending...';
      }
      try {
        var response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: rawEmail, source: form.dataset.source || 'footer' })
        });
        var body = await response.json().catch(function () { return {}; });
        if (!response.ok || body.success !== true) throw new Error(body.error || body.message || 'Subscription failed');
        setFormStatus(shell || form, body.message || 'Welcome to the TSC Family!', 'success');
        form.reset();
      } catch (error) {
        setFormStatus(shell || form, (error && error.message) || 'Could not subscribe. Please try again.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.innerHTML = button.dataset.originalText || 'Subscribe';
        }
      }
    });
  }

  function switchFormStep(form, targetStep) {
    if (!form) return;
    var steps = form.querySelectorAll('.tsc-form-step');
    steps.forEach(function (step) {
      var stepNum = step.dataset.step;
      var isActive = String(stepNum) === String(targetStep);
      step.classList.toggle('is-active', isActive);
      step.hidden = !isActive;
      step.style.display = isActive ? 'block' : 'none';
    });
    form.querySelectorAll('.tsc-step-badge').forEach(function (badge) {
      badge.classList.toggle('is-active', String(badge.dataset.stepBadge) === String(targetStep));
    });
    try {
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) { }
  }

  function bindMultiStepNav(form) {
    if (!form || form.dataset.multiStepBound) return;
    form.dataset.multiStepBound = 'true';
    form.addEventListener('click', function (event) {
      var nextBtn = event.target && event.target.closest ? event.target.closest('.tsc-next-btn') : null;
      if (nextBtn) {
        event.preventDefault();
        var currentStep = form.querySelector('.tsc-form-step.is-active');
        if (currentStep) {
          var inputs = Array.prototype.slice.call(currentStep.querySelectorAll('input, select, textarea'));
          var isValid = true;
          for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (typeof input.checkValidity === 'function' && !input.checkValidity()) {
              isValid = false;
              if (typeof input.reportValidity === 'function') input.reportValidity();
              break;
            }
          }
          if (!isValid) return;
        }
        var targetStep = nextBtn.dataset.goto || '2';
        switchFormStep(form, targetStep);
        return;
      }
      var prevBtn = event.target && event.target.closest ? event.target.closest('.tsc-prev-btn') : null;
      if (prevBtn) {
        event.preventDefault();
        var prevTarget = prevBtn.dataset.goto || '1';
        switchFormStep(form, prevTarget);
      }
    });
  }

  /** Book-a-call slot logic — mirrors the legacy Next.js book-a-call page. */
  var BOOK_CALL_SLOTS = [
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ];
  var SLOT_AVAILABILITY_BUFFER_MS = 90 * 60 * 1000; // 1.5 hours
  var COUNTRY_TIMEZONES = {
    '+91': 'Asia/Kolkata',
    '+1': 'America/New_York',
    '+44': 'Europe/London',
    '+971': 'Asia/Dubai',
    '+61': 'Australia/Sydney',
    '+65': 'Asia/Singapore',
    '+49': 'Europe/Berlin',
    '+33': 'Europe/Paris'
  };
  var COUNTRY_FLAG_CODES = {
    IND: '+91', USA: '+1', GBR: '+44', ARE: '+971',
    AUS: '+61', SGP: '+65', DEU: '+49', FRA: '+33'
  };

  function readBookCallCountryCode(wixForm) {
    if (!wixForm) return '+91';
    var trigger = wixForm.querySelector('button[data-hook="country-selector-trigger"]');
    if (!trigger) return '+91';
    var txt = String(trigger.innerText || trigger.textContent || trigger.getAttribute('aria-label') || '').trim();
    var m = txt.match(/\+?\d{1,3}/);
    if (m) return m[0].indexOf('+') === 0 ? m[0] : '+' + m[0];
    // Runtime may only render the flag — map the flag code to a dial code.
    var img = trigger.querySelector('img[src*="flags"]');
    var src = img ? String(img.getAttribute('src') || '').toUpperCase() : '';
    var fm = src.match(/SQUARE\/([A-Z]{2,3})/);
    if (fm && COUNTRY_FLAG_CODES[fm[1]]) return COUNTRY_FLAG_CODES[fm[1]];
    return '+91';
  }

  function timezoneForCountryCode(code) {
    return COUNTRY_TIMEZONES[code] || 'Asia/Kolkata';
  }

  /** "Now" as a device-local Date holding the wall clock of the given timezone. */
  function wallClockNow(timeZone) {
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      }).formatToParts(new Date());
    } catch (e) {
      return new Date();
    }
    function getPart(type) {
      var p = parts.filter(function (x) { return x.type === type; })[0];
      return p ? p.value : '';
    }
    var hour = getPart('hour');
    if (hour === '24') hour = '00';
    return new Date(getPart('year') + '-' + getPart('month') + '-' + getPart('day') + 'T' + hour + ':' + getPart('minute') + ':' + getPart('second'));
  }

  /** YYYY-MM-DD of "today" in the given timezone (for native date-picker min). */
  function todayInTimeZone(timeZone) {
    var now = wallClockNow(timeZone);
    var y = now.getFullYear();
    var mo = String(now.getMonth() + 1);
    var d = String(now.getDate());
    return y + '-' + (mo.length < 2 ? '0' + mo : mo) + '-' + (d.length < 2 ? '0' + d : d);
  }

  /** '01:30 PM' → '13:30'; returns null for malformed input. */
  function slotTo24(slot) {
    var m = String(slot || '').match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return null;
    var h = parseInt(m[1], 10);
    var period = m[3].toUpperCase();
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return (h < 10 ? '0' + h : String(h)) + ':' + m[2];
  }

  /** True when dateStr + timeStr is at least 1.5h in the future in the timezone. */
  function isSlotAvailable(dateStr, timeStr, timeZone) {
    if (!dateStr || !timeStr) return false;
    var t24 = slotTo24(timeStr);
    if (!t24) return false;
    try {
      var slot = new Date(dateStr + 'T' + t24);
      return slot.getTime() - wallClockNow(timeZone).getTime() >= SLOT_AVAILABILITY_BUFFER_MS;
    } catch (e) {
      return false;
    }
  }

  function bindNativeForm(wixForm, def, name, shared) {
    if (!wixForm || wixForm.dataset.tscNativeBound) return;
    wixForm.dataset.tscNativeBound = 'true';

    // Ensure form and all ancestor containers stay visible
    wixForm.hidden = false;
    wixForm.style.display = '';
    var p = wixForm.parentElement;
    while (p && p !== document.body) {
      p.hidden = false;
      if (p.style.display === 'none') p.style.display = '';
      p = p.parentElement;
    }

    // 1. Text & Email & Tel & Textarea inputs
    var textInputs = wixForm.querySelectorAll('input, textarea');
    textInputs.forEach(function(input) {
      function updateState() {
        var root = input.closest('[data-hook="text-field-root"]') || input.closest('.s__72lfJk') || input;
        if (root) {
          root.setAttribute('data-empty-state', input.value.trim() ? 'false' : 'true');
          root.setAttribute('data-error', 'false');
        }
      }
      input.addEventListener('input', updateState);
      input.addEventListener('change', updateState);
      input.addEventListener('blur', updateState);
      updateState();
    });

    // 2. Checkbox option wrappers (e.g. Course selection on /book-a-call)
    var boxWrappers = wixForm.querySelectorAll('[data-hook="box-selection-option-wrapper"]');
    boxWrappers.forEach(function(wrapper) {
      var cb = wrapper.querySelector('input[type="checkbox"]');
      function toggleCheckbox(checked) {
        if (typeof checked !== 'boolean') checked = wrapper.getAttribute('data-checked') !== 'true';
        wrapper.setAttribute('data-checked', checked ? 'true' : 'false');
        wrapper.setAttribute('aria-checked', checked ? 'true' : 'false');
        if (cb) {
          cb.checked = checked;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      wrapper.addEventListener('click', function(e) {
        if (e.target !== cb) {
          e.preventDefault();
          toggleCheckbox();
        }
      });
      if (cb) {
        cb.addEventListener('change', function() {
          wrapper.setAttribute('data-checked', cb.checked ? 'true' : 'false');
        });
      }
    });

    // 3. Radio buttons (e.g. Artist selection on /book-an-artist)
    var radioWrappers = wixForm.querySelectorAll('.siroRCe, [data-hook="core-radio-button"]');
    radioWrappers.forEach(function(wrapper) {
      var radio = wrapper.querySelector('input[type="radio"]');
      var radioName = radio ? radio.name : null;
      wrapper.addEventListener('click', function(e) {
        if (e.target !== radio) {
          e.preventDefault();
          if (radio) {
            radio.checked = true;
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        if (radioName) {
          var groupRadios = wixForm.querySelectorAll('input[type="radio"][name="' + radioName + '"]');
          groupRadios.forEach(function(r) {
            var w = r.closest('.siroRCe') || r.closest('[data-hook="core-radio-button"]');
            if (w) {
              w.setAttribute('data-checked', r.checked ? 'true' : 'false');
              w.setAttribute('aria-checked', r.checked ? 'true' : 'false');
            }
          });
        }
      });
    });

    // 4. Dropdowns (e.g. Type of Engagement on /book-an-artist)
    var dropdownWrappers = wixForm.querySelectorAll('[data-field-type="DROPDOWN"]');
    dropdownWrappers.forEach(function(dd) {
      var trigger = dd.querySelector('[data-hook="dropdown-base"]');
      var textEl = dd.querySelector('[data-hook="dropdown-base-text"]');
      var fieldLabel = dd.closest('.GLWhGq') ? dd.closest('.GLWhGq').querySelector('.shszO9W') : null;
      var labelText = (fieldLabel ? fieldLabel.textContent.trim() : '').toLowerCase();

      var optionsList = ['Select'];
      if (/engagement/i.test(labelText)) {
        optionsList = ['Live Performance', 'Brand Collaboration', 'Social Media Content', 'Music Production / Feature', 'Other'];
      } else if (/talent|artist/i.test(labelText)) {
        optionsList = ['Harshad and Duhita Golesar', 'YUGM', 'Open to Recommendations'];
      } else if (/logistics/i.test(labelText)) {
        optionsList = ['Yes - Full Travel & Stay', 'Partially Provided', 'To be Negotiated', 'Not Provided'];
      } else if (/collaboration/i.test(labelText)) {
        optionsList = ['Music-led Campaign', 'Cultural Storytelling', 'Branded Experience', 'Talent Program', 'Other'];
      } else {
        optionsList = ['Live Performance', 'Brand Collaboration', 'Cultural Storytelling', 'Other'];
      }

      if (textEl && !textEl.textContent.trim()) {
        textEl.textContent = 'Select';
        textEl.style.color = '#7d7a75';
      }

      if (trigger) {
        trigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          var existingMenu = dd.querySelector('.native-dropdown-menu');
          if (existingMenu) {
            existingMenu.remove();
            return;
          }
          document.querySelectorAll('.native-dropdown-menu').forEach(function(m) { m.remove(); });
          var menu = document.createElement('div');
          menu.className = 'native-dropdown-menu';
          optionsList.forEach(function(opt) {
            var item = document.createElement('div');
            item.className = 'native-dropdown-item';
            item.textContent = opt;
            item.addEventListener('click', function(ev) {
              ev.stopPropagation();
              if (textEl) {
                textEl.textContent = opt;
                textEl.style.color = '#053f40';
              }
              dd.dataset.selectedValue = opt;
              dd.setAttribute('data-empty-state', opt === 'Select' ? 'true' : 'false');
              menu.remove();
            });
            menu.appendChild(item);
          });
          dd.style.position = 'relative';
          dd.appendChild(menu);
        });
      }
    });

    document.addEventListener('click', function() {
      document.querySelectorAll('.native-dropdown-menu').forEach(function(m) { m.remove(); });
    });

    // 5. Date Picker (e.g. /book-a-call)
    var dateFields = wixForm.querySelectorAll('[data-field-type="DATE_PICKER"]');
    dateFields.forEach(function(df) {
      // The Wix DOM renders two elements with data-hook="date-picker-input": the
      // wrapper box (a DIV, no .value) and the actual text input nested inside.
      // Always target the real input so the picked date is visible and readable.
      var dateInput = df.querySelector('input[data-hook="date-picker-input"]') || df.querySelector('[data-hook="date-picker-input"] input') || df.querySelector('[data-hook="date-picker-input"]');
      var calButton = df.querySelector('[data-hook="date-picker-calendar-icon"]');
      var hiddenDate = document.createElement('input');
      hiddenDate.type = 'date';
      hiddenDate.className = 'native-hidden-date-picker';
      hiddenDate.setAttribute('aria-hidden', 'true');
      hiddenDate.tabIndex = -1;
      // Inline styles as a belt-and-suspenders guarantee the injected native
      // picker can never render visibly, even if forms.css is stale/broken.
      hiddenDate.style.cssText = 'position:absolute !important;opacity:0 !important;pointer-events:none !important;width:0 !important;min-width:0 !important;max-width:0 !important;height:0 !important;min-height:0 !important;max-height:0 !important;border:0 !important;padding:0 !important;margin:0 !important;';
      df.appendChild(hiddenDate);

      // Legacy parity: never allow dates before today (in the caller's timezone).
      function refreshDateMin() {
        var tz = timezoneForCountryCode(readBookCallCountryCode(wixForm));
        hiddenDate.min = todayInTimeZone(tz);
        if (hiddenDate.value && hiddenDate.value < hiddenDate.min) {
          hiddenDate.value = '';
          if (dateInput) dateInput.value = '';
        }
        if (typeof wixForm._tscRenderSlots === 'function') wixForm._tscRenderSlots();
      }
      refreshDateMin();

      // Wix renders the country list in a portal — pick up changes via click.
      var lastCountry = readBookCallCountryCode(wixForm);
      document.addEventListener('click', function () {
        var current = readBookCallCountryCode(wixForm);
        if (current !== lastCountry) {
          lastCountry = current;
          refreshDateMin();
        }
      });

      function triggerDatePicker() {
        if (typeof hiddenDate.showPicker === 'function') {
          try { hiddenDate.showPicker(); return; } catch(err){}
        }
        hiddenDate.focus();
        hiddenDate.click();
      }

      if (dateInput) {
        dateInput.readOnly = true;
        dateInput.style.cursor = 'pointer';
        dateInput.addEventListener('click', triggerDatePicker);
      }
      if (calButton) {
        calButton.addEventListener('click', function(e) {
          e.preventDefault();
          triggerDatePicker();
        });
      }
      hiddenDate.addEventListener('change', function() {
        if (hiddenDate.value) {
          if (dateInput) {
            dateInput.value = hiddenDate.value;
            dateInput.dispatchEvent(new Event('input', { bubbles: true }));
            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
        if (typeof wixForm._tscRenderSlots === 'function') wixForm._tscRenderSlots();
      });
    });

    // 6. Time Input (e.g. /book-a-call)
    var timeFields = wixForm.querySelectorAll('[data-field-type="TIME_INPUT"]');
    timeFields.forEach(function(tf) {
      var hoursInput = tf.querySelector('[data-hook="hours"]');
      var minutesInput = tf.querySelector('[data-hook="minutes"]');
      var ampmBtn = tf.querySelector('[data-hook="ampm"]');

      // Legacy parity: replace the free-form HH:MM box with the fixed slot grid
      // from the old site — slots inside the 1.5h buffer are unavailable.
      var slotInput = document.createElement('input');
      slotInput.type = 'hidden';
      slotInput.className = 'tsc-slot-value';
      slotInput.setAttribute('data-tsc-slot', 'true');
      var slotGrid = document.createElement('div');
      slotGrid.className = 'tsc-time-slot-grid';
      slotGrid.setAttribute('role', 'group');
      slotGrid.setAttribute('aria-label', 'Select a time');
      tf.appendChild(slotInput);
      tf.appendChild(slotGrid);
      tf.classList.add('tsc-has-slot-grid');

      wixForm._tscRenderSlots = function () {
        var dateInputNode = null;
        var dateFieldsForForm = wixForm.querySelectorAll('[data-field-type="DATE_PICKER"]');
        if (dateFieldsForForm[0]) {
          dateInputNode = dateFieldsForForm[0].querySelector('input[type="date"]') || dateFieldsForForm[0].querySelector('input[data-hook="date-picker-input"]');
        }
        var dateStr = dateInputNode ? dateInputNode.value : '';
        var tz = timezoneForCountryCode(readBookCallCountryCode(wixForm));

        // Clear the pick if the chosen slot has since become unavailable.
        if (slotInput.value && dateStr && !isSlotAvailable(dateStr, slotInput.value, tz)) {
          slotInput.value = '';
        }

        slotGrid.innerHTML = '';
        BOOK_CALL_SLOTS.forEach(function (slot) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'tsc-time-slot';
          btn.setAttribute('data-slot', slot);
          btn.textContent = slot;
          // Without a date we cannot judge availability — leave all selectable.
          var taken = !!dateStr && !isSlotAvailable(dateStr, slot, tz);
          if (taken) {
            btn.disabled = true;
            btn.classList.add('is-unavailable');
            btn.setAttribute('aria-disabled', 'true');
          }
          if (!taken && slotInput.value === slot) btn.classList.add('is-selected');
          btn.addEventListener('click', function () {
            if (btn.disabled) return;
            slotInput.value = slot;
            wixForm._tscRenderSlots();
          });
          slotGrid.appendChild(btn);
        });
      };
      wixForm._tscRenderSlots();

      // Keep the old free-form bindings as a fallback (segments are hidden by
      // CSS when the grid is present).
      if (hoursInput && !hoursInput.value) hoursInput.placeholder = '10';
      if (minutesInput && !minutesInput.value) minutesInput.placeholder = '00';

      if (ampmBtn) {
        ampmBtn.addEventListener('click', function(e) {
          e.preventDefault();
          var label = ampmBtn.querySelector('.sezcxt9') || ampmBtn;
          var current = (label.textContent || '').trim().toUpperCase();
          var next = current === 'PM' ? 'AM' : 'PM';
          label.textContent = next;
          ampmBtn.dataset.ampm = next;
        });
      }

      if (hoursInput) {
        hoursInput.addEventListener('input', function() {
          hoursInput.value = hoursInput.value.replace(/[^0-9]/g, '').slice(0, 2);
          if (hoursInput.value.length === 2 && minutesInput) {
            minutesInput.focus();
          }
        });
      }
      if (minutesInput) {
        minutesInput.addEventListener('input', function() {
          minutesInput.value = minutesInput.value.replace(/[^0-9]/g, '').slice(0, 2);
        });
      }
    });

    // 7. Submit Button and Submission handling
    var submitBtn = wixForm.querySelector('button[data-hook="submit-button"], button[data-hook="next-button"], button[type="submit"], [data-field-type="SUBMIT_BUTTON"] button');

    function showFeedback(msg, isSuccess) {
      var existing = wixForm.querySelector('.native-form-feedback');
      if (existing) existing.remove();
      var box = document.createElement('div');
      box.className = 'native-form-feedback ' + (isSuccess ? 'is-success' : 'is-error');
      box.textContent = msg;
      if (submitBtn && submitBtn.closest('.GLWhGq')) {
        var row = submitBtn.closest('.GLWhGq');
        row.parentNode.insertBefore(box, row);
      } else {
        wixForm.appendChild(box);
      }
    }

    function handleNativeSubmit() {
      var endpoint = formEndpoint(name);
      if (!endpoint) return;

      var payload = {};
      var isValid = true;
      var errorMsg = '';

      if (name === 'bookCall') {
        var firstNameInput = wixForm.querySelector('[data-hook="form-field-first_name_e937"] input') || wixForm.querySelector('input[aria-label*="First name"]');
        var lastNameInput = wixForm.querySelector('[data-hook="form-field-last_name_24e1"] input') || wixForm.querySelector('input[aria-label*="Last name"]');
        var phoneInput = wixForm.querySelector('[data-hook="form-field-phone_9f79"] input') || wixForm.querySelector('input[type="phone"], input[inputmode="tel"]');
        var emailInput = wixForm.querySelector('[data-hook="form-field-email_3810"] input') || wixForm.querySelector('input[type="email"]');
        var dateInput = wixForm.querySelector('input[data-hook="date-picker-input"]') || wixForm.querySelector('[data-hook="date-picker-input"] input') || wixForm.querySelector('[data-hook="date-picker-input"]') || wixForm.querySelector('input[type="date"]');
        var hoursInput = wixForm.querySelector('[data-hook="hours"]');
        var minutesInput = wixForm.querySelector('[data-hook="minutes"]');
        var ampmBtn = wixForm.querySelector('[data-hook="ampm"]');
        var ampmVal = ampmBtn ? (ampmBtn.querySelector('.sezcxt9') || ampmBtn).textContent.trim() : 'AM';
        var slotInput = wixForm.querySelector('input[data-tsc-slot="true"]');
        var timeZone = timezoneForCountryCode(readBookCallCountryCode(wixForm));

        var checkedCourses = [];
        wixForm.querySelectorAll('[data-hook="form-field-which_course_are_you_interested_in"] [data-checked="true"]').forEach(function(item) {
          checkedCourses.push(item.getAttribute('data-id') || item.textContent.trim());
        });

        var firstName = firstNameInput ? firstNameInput.value.trim() : '';
        var lastName = lastNameInput ? lastNameInput.value.trim() : '';
        var nameVal = (firstName + ' ' + lastName).trim() || firstName;
        var phoneVal = phoneInput ? phoneInput.value.trim() : '';
        var emailVal = emailInput ? emailInput.value.trim() : '';
        var courseVal = checkedCourses.join(', ') || 'The heART of Composition';
        var dateVal = dateInput ? dateInput.value.trim() : '';
        var timeVal = slotInput && slotInput.value ? slotInput.value : (hoursInput || minutesInput) ? ((hoursInput && hoursInput.value.trim() ? hoursInput.value.trim() : '10') + ':' + (minutesInput && minutesInput.value.trim() ? minutesInput.value.trim() : '00') + ' ' + ampmVal) : '';

        if (!firstName) {
          isValid = false;
          errorMsg = 'Please enter your First Name';
          if (firstNameInput) firstNameInput.focus();
        } else if (!phoneVal) {
          isValid = false;
          errorMsg = 'Please enter your Phone Number';
          if (phoneInput) phoneInput.focus();
        } else if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          isValid = false;
          errorMsg = 'Please enter a valid Email Address';
          if (emailInput) emailInput.focus();
        } else if (checkedCourses.length === 0) {
          isValid = false;
          errorMsg = 'Please select which course you are interested in';
        } else if (!dateVal) {
          isValid = false;
          errorMsg = 'Please select a date for the call';
          if (dateInput) dateInput.click();
        } else if (dateVal < todayInTimeZone(timeZone)) {
          isValid = false;
          errorMsg = 'Please select a date that has not passed';
        } else if (!timeVal) {
          isValid = false;
          errorMsg = 'Please select a time for the call';
        } else if (!isSlotAvailable(dateVal, timeVal, timeZone)) {
          isValid = false;
          errorMsg = 'This slot is no longer available. Please pick a later time.';
        }

        payload = {
          name: nameVal,
          firstName: firstName,
          lastName: lastName,
          phone: phoneVal,
          email: emailVal,
          course: courseVal,
          date: dateVal,
          time: timeVal,
          timezone: timeZone,
          source: 'tsc-website'
        };
      } else if (name === 'bookArtist') {
        var nameInput = wixForm.querySelector('[data-hook="form-field-first_name_e937"] input') || wixForm.querySelector('input[aria-label*="Full Name"]');
        var orgInput = wixForm.querySelector('[data-hook="form-field-organisation_name"] input');
        var emailInput = wixForm.querySelector('[data-hook="form-field-email_3810"] input');
        var phoneInput = wixForm.querySelector('[data-hook="form-field-phone_9f79"] input');
        var engagementDd = wixForm.querySelector('[data-hook="form-field-type_of_engagement"]');
        var artistRadio = wixForm.querySelector('[data-hook="form-field-select_artist_talent"] [data-checked="true"]');
        
        var natureInput = wixForm.querySelector('[data-hook="form-field-nature_of_project"] textarea, textarea[aria-label*="Nature"]');
        var whenWhereInput = wixForm.querySelector('[data-hook="form-field-when_and_where"] textarea, textarea[aria-label*="When"]');
        var scaleInput = wixForm.querySelector('[data-hook="form-field-expected_scale_reach"] input, input[aria-label*="Scale"]');
        var logisticsDd = wixForm.querySelector('[data-hook="form-field-logistics_provided"]');
        var visionInput = wixForm.querySelector('[data-hook="form-field-additional_vision_details"] textarea, textarea[aria-label*="Vision"]');

        var nameVal = nameInput ? nameInput.value.trim() : '';
        var orgVal = orgInput ? orgInput.value.trim() : '';
        var emailVal = emailInput ? emailInput.value.trim() : '';
        var phoneVal = phoneInput ? phoneInput.value.trim() : '';
        var engagementVal = (engagementDd && engagementDd.dataset.selectedValue) || 'Live Performance';
        var artistVal = (artistRadio ? (artistRadio.getAttribute('data-id') || artistRadio.textContent.trim()) : '') || 'Harshad and Duhita Golesar';
        var natureVal = natureInput ? natureInput.value.trim() : '';
        var whenWhereVal = whenWhereInput ? whenWhereInput.value.trim() : '';
        var scaleVal = scaleInput ? scaleInput.value.trim() : '';
        var logisticsVal = (logisticsDd && logisticsDd.dataset.selectedValue) || 'Yes - Full Travel & Stay';
        var visionVal = visionInput ? visionInput.value.trim() : '';

        if (!nameVal) {
          isValid = false;
          errorMsg = 'Please enter your Full Name';
          if (nameInput) nameInput.focus();
        } else if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          isValid = false;
          errorMsg = 'Please enter a valid Email Address';
          if (emailInput) emailInput.focus();
        } else if (!phoneVal) {
          isValid = false;
          errorMsg = 'Please enter your Contact Number';
          if (phoneInput) phoneInput.focus();
        }

        payload = {
          name: nameVal,
          company: orgVal,
          organization: orgVal,
          email: emailVal,
          phone: phoneVal,
          collabType: engagementVal,
          collaborationType: engagementVal,
          artist: artistVal,
          projectNature: natureVal,
          nature: natureVal,
          whenWhere: whenWhereVal,
          scale: scaleVal,
          scaleReach: scaleVal,
          logisticsSupport: logisticsVal,
          logistics: logisticsVal,
          additionalVision: visionVal,
          vision: visionVal,
          source: 'tsc-website'
        };
      } else if (name === 'artistPath') {
        var fNameInput = wixForm.querySelector('[data-hook="form-field-first_name_c985"] input') || wixForm.querySelector('input[aria-label*="First name"]');
        var lNameInput = wixForm.querySelector('[data-hook="form-field-last_name_2463"] input') || wixForm.querySelector('input[aria-label*="Last name"]');
        var placeInput = wixForm.querySelector('[data-hook="form-field-where_are_you_based"] input') || wixForm.querySelector('input[aria-label*="Where"]');
        var mobInput = wixForm.querySelector('[data-hook="form-field-mobile_no"] input') || wixForm.querySelector('input[aria-label*="Mobile"]');
        var emInput = wixForm.querySelector('[data-hook="form-field-email_6410"] input') || wixForm.querySelector('input[aria-label*="Email"]');
        var stageInput = wixForm.querySelector('[data-hook="form-field-stage_name"] input') || wixForm.querySelector('input[aria-label*="Stage"]');

        var fName = fNameInput ? fNameInput.value.trim() : '';
        var lName = lNameInput ? lNameInput.value.trim() : '';
        var fullName = (fName + ' ' + lName).trim() || fName;
        var mob = mobInput ? mobInput.value.trim() : '';
        var em = emInput ? emInput.value.trim() : '';

        if (!fName) {
          isValid = false;
          errorMsg = 'Please enter your First Name';
          if (fNameInput) fNameInput.focus();
        } else if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
          isValid = false;
          errorMsg = 'Please enter a valid Email Address';
          if (emInput) emInput.focus();
        } else if (!mob) {
          isValid = false;
          errorMsg = 'Please enter your Mobile Number';
          if (mobInput) mobInput.focus();
        }

        payload = {
          firstName: fName,
          lastName: lName,
          fullName: fullName,
          mobile: mob,
          email: em,
          place: placeInput ? placeInput.value.trim() : '',
          stageName: stageInput ? stageInput.value.trim() : '',
          source: 'tsc-website'
        };
      }

      if (!isValid) {
        showFeedback(errorMsg, false);
        return;
      }

      var submitSpan = submitBtn ? (submitBtn.querySelector('.sezcxt9') || submitBtn) : null;
      var originalBtnText = submitSpan ? submitSpan.textContent : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitSpan) submitSpan.textContent = 'Submitting...';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(res) {
        return res.json().then(function(data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function(result) {
        if (result.ok && result.data && result.data.success !== false) {
          showFeedback(result.data.message || 'Thank you! We have received your submission.', true);
          if (submitSpan) submitSpan.textContent = 'Submitted ✓';
          wixForm.reset();
        } else {
          var err = (result.data && result.data.error) || 'Submission failed. Please try again.';
          showFeedback(err, false);
          if (submitBtn) {
            submitBtn.disabled = false;
            if (submitSpan) submitSpan.textContent = originalBtnText;
          }
        }
      })
      .catch(function(err) {
        showFeedback('Network error. Please try again.', false);
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitSpan) submitSpan.textContent = originalBtnText;
        }
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleNativeSubmit();
      });
    }
    wixForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNativeSubmit();
    });
  }

  function mountFormInto(target, def, name, shared) {
    if (!target) return;
    // For multiStep forms, skip the native Wix form and render the TSC
    // multi-step form instead — the Wix form's own step pagination is broken
    // and its "Next" button submits the form directly.
    if (!def.multiStep) {
      var wixNativeForm = document.querySelector('form[id^="form-"]') || (target.tagName === 'FORM' ? target : target.querySelector('form'));
      if (wixNativeForm) {
        bindNativeForm(wixNativeForm, def, name, shared);
        return;
      }
    }
    var existingForm = document.querySelector('.tsc-local-form[data-tsc-form="' + name + '"]');
    if (existingForm) return;
    target.dataset.tscFormMounted = name;
    var holder = document.createElement('div');
    holder.innerHTML = formMarkup(def, name, shared);
    var form = holder.firstElementChild;
    target.parentNode.insertBefore(form, target);
    target.hidden = true;
    target.style.setProperty('display', 'none', 'important');
    bindChoiceState(form);
    bindDatePickers(form);
    if (def.multiStep) bindMultiStepNav(form);
    bindLocalSubmit(form);
  }

  function mountStandaloneForm(target, def, name, shared) {
    if (!target) return;
    target.dataset.tscFormMounted = name;
    target.innerHTML = formMarkup(def, name, shared);
    var form = target.querySelector('form');
    bindChoiceState(form);
    bindDatePickers(form);
    if (def.multiStep) bindMultiStepNav(form);
    bindLocalSubmit(form);
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function setImage(selector, image) {
    var img = document.querySelector(selector);
    if (!img || !image) return;
    img.src = image.src;
    img.removeAttribute('srcset');
    img.alt = image.alt || '';
    img.loading = image.loading || 'lazy';
    img.style.objectFit = image.objectFit || 'cover';
    img.style.objectPosition = image.objectPosition || '50% 50%';
  }

  function updateButton(selector, config) {
    var button = document.querySelector(selector);
    if (!button || !config) return;
    if (config.href) button.setAttribute('href', config.href);
    if (config.target) button.setAttribute('target', config.target);
    if (config.label) {
      button.setAttribute('aria-label', config.label);
      var label = button.querySelector('.wixui-button__label, span') || button;
      label.textContent = config.label;
    }
  }

  function hideElement(selector) {
    var node = document.querySelector(selector);
    if (!node) return;
    node.style.display = 'none';
    node.setAttribute('aria-hidden', 'true');
    node.querySelectorAll('a, button, [role="button"], [tabindex]').forEach(function (child) {
      child.setAttribute('tabindex', '-1');
      child.setAttribute('aria-hidden', 'true');
      if (child.tagName === 'A') child.removeAttribute('href');
    });
  }

  function normalizeNewsletter() {
    document.querySelectorAll('input[type="email"][name="email"]').forEach(function (input) {
      var wrapper = input.closest('.wixui-text-input') || input.closest('div');
      var label = wrapper && wrapper.querySelector('label');
      if (!label || !/subscribe|newsletter|stay in the collective/i.test(label.textContent || '')) return;
      label.textContent = 'Stay in the collective';
      input.placeholder = 'Email address';
      input.autocomplete = 'email';
    });
  }

  function componentOptions(opts) {
    opts = opts || {};
    var assets = opts.brandAssets || DEFAULT_BRAND_ASSETS;
    var academyMap = opts.academyPaths || DEFAULT_ACADEMY_PATHS;
    var path = opts.path || canonicalPathname();
    var academy = !!academyMap[path];
    return {
      academy: academy,
      brand: academy ? assets.academy : assets.main,
      assets: assets,
      path: path,
      whatsapp: opts.whatsappCommunityUrl || 'https://wa.me/919168665455'
    };
  }

  var MAIN_NAV_ITEMS = [
    { href: '/about', key: 'about', label: 'About' },
    { href: '/work', key: 'work', label: 'Work' },
    { href: '/artists', key: 'artists', label: 'Artists' },
    { href: '/films', key: 'films', label: 'Films' },
    { href: '/resources', key: 'resources', label: 'Resources' },
    { href: '/academy', key: 'academy', label: 'TSC Academy', className: 'tsc-main-academy-link' }
  ];

  var MAIN_ARTISTS_MENU_ITEMS = [
    { href: '/artists', label: 'TSC Artists' },
    { href: '/artist-path', label: 'Artist Path' },
    { href: '/academy', label: 'Learn With TSC' }
  ];

  var ACADEMY_COURSE_ITEMS = [
    { href: '/course-bundle', label: 'All Courses Bundle' },
    { href: '/music-production', label: 'A to Z of Music Production' },
    { href: '/the-heart-of-composition', label: 'The HeART of Composition' },
    { href: '/roots-of-hindustani-classical', label: 'Roots of Hindustani Classical' }
  ];

  var ACADEMY_COURSE_HREFS = {
    '/course-bundle': true,
    '/music-production': true,
    '/the-heart-of-composition': true,
    '/roots-of-hindustani-classical': true
  };

  var HEART_COMPOSITION_CHECKOUT_URL = 'https://tscacademy.exlyapp.com/checkout/55bdc656-c92d-4812-a775-944d5becf544?dynamic_link=ad961260-1373-49a9-9307-241497380256';
  var ROOTS_HINDUSTANI_CHECKOUT_URL = HEART_COMPOSITION_CHECKOUT_URL;
  var MUSIC_PRODUCTION_CHECKOUT_URL = 'https://shakticollectivellp.exlyapp.com/checkout/f4d71afd-d494-49ba-b6e1-c8c53da020f8';
  var COURSE_BUNDLE_CHECKOUT_URL = 'https://shakticollectivellp.exlyapp.com/combo/ae855d75-c65f-4ea5-b5aa-dd2f5e4042f4';
  var COURSE_CHECKOUT_URL = HEART_COMPOSITION_CHECKOUT_URL;

  var MOBILE_COURSE_PAGES = {
    '/course-bundle': {
      number: 'Bundle',
      title: 'All Three Courses Bundle',
      shortTitle: 'All Courses Bundle',
      mentor: 'Sandesh Shandilya + Pt. Prasad Khaparde + Luca Petracca',
      image: '/assets/course-bundle/3-courses-bundle.png?v=bundle-art-1',
      imageAlt: 'Sandesh Shandilya, Prasad Khaparde, and Luca Petracca',
      intro: 'Composition, Hindustani classical foundations, and music production brought together as one complete artist learning path.',
      stats: ['3 Courses', '₹12,000 Value', 'Now ₹9,999', 'One Enrollment'],
      learn: ['The heART of Music Composition', 'The Roots of Hindustani Classical', 'A to Z of Music Production', 'A clear path across craft, voice, and production'],
      outcomes: ['Build stronger original compositions', 'Develop classical grounding and disciplined practice', 'Finish cleaner, release-ready tracks'],
      checkout: COURSE_BUNDLE_CHECKOUT_URL
    },
    '/the-heart-of-composition': {
      number: '001',
      title: 'The heART of Music Composition',
      shortTitle: 'The heART of Composition',
      mentor: 'Sandesh Shandilya',
      image: '/assets/mirror/static.wixstatic.com/media/19f989_3583e149066b4ebf9a6f37cc7d80382a~mv2.jpg/v1/crop/x_0,y_7,w_677,h_461/fill/w_960,h_640,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/sandesh_edited.jpg',
      imageAlt: 'Sandesh Shandilya leading a music session',
      intro: 'Dive deeper into advanced composition techniques with this comprehensive 6-month course. Learn the art of imagination, emotion to expression, and mainstream mastery directly from a legend.',
      stats: ['6 Months', '200+ Mins Content', '3 Live Sessions', 'Industry Mentorship'],
      learn: ['Composition foundations', 'Melody and emotion mapping', 'Film and independent song structure', 'Creative discipline for original music'],
      outcomes: ['Build a stronger composition process', 'Translate ideas into complete songs', 'Create music with sharper emotional intent'],
      checkout: HEART_COMPOSITION_CHECKOUT_URL
    },
    '/roots-of-hindustani-classical': {
      number: '002',
      title: 'The Roots of Hindustani Classical',
      shortTitle: 'Roots of Hindustani Classical',
      mentor: 'Pt. Prasad Khaparde',
      image: '/assets/mirror/static.wixstatic.com/media/19f989_07c6e896e4a54fcc99b08a98ceccaff4~mv2.jpg/v1/fill/w_960,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/prasad-hero.jpg',
      imageAlt: 'Pandit Prasad Khaparde performing Hindustani classical music',
      intro: 'Immerse yourself in the timeless art of Hindustani classical singing. Build your foundation through focused group sessions, quality assessments, and guidance from Pandit Prasad Khaparde.',
      stats: ['6 Months', '300+ Mins Content', '3+ Live Sessions', 'Certification'],
      learn: ['Voice culture and riyaaz', 'Raag foundations', 'Classical phrasing and expression', 'Performance confidence'],
      outcomes: ['Strengthen classical fundamentals', 'Develop disciplined vocal practice', 'Understand raag-based expression'],
      checkout: ROOTS_HINDUSTANI_CHECKOUT_URL
    },
    '/music-production': {
      number: '003',
      title: 'A to Z of Music Production',
      shortTitle: 'A to Z of Music Production',
      mentor: 'Luca Petracca',
      image: '/assets/luca/luca-production-session.jpg?v=luca-blu05000-3',
      imageAlt: 'Luca Petracca in a music production studio',
      intro: 'Master the end-to-end process of producing professional music for your songs. From recording and arrangement to mixing and mastering, learn the technical and creative steps of modern music production.',
      stats: ['DAW Training', 'Film Music', 'Orchestration', 'Certification'],
      learn: ['Recording workflow', 'Arrangement and programming', 'Mixing and mastering basics', 'Production for release-ready songs'],
      outcomes: ['Build a complete production workflow', 'Understand modern studio tools', 'Finish cleaner, stronger tracks'],
      checkout: MUSIC_PRODUCTION_CHECKOUT_URL
    }
  };

  function courseCheckoutHref(href) {
    var data = MOBILE_COURSE_PAGES[href];
    return data && data.checkout ? data.checkout : COURSE_CHECKOUT_URL;
  }

  function checkoutHrefForCoursePath(path) {
    var route = path || canonicalPathname();
    return ACADEMY_COURSE_HREFS[route] ? courseCheckoutHref(route) : '';
  }

  function normalizeCourseCheckoutLinks(path) {
    var checkoutHref = checkoutHrefForCoursePath(path);
    if (!checkoutHref) return;
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var raw = anchor.getAttribute('href') || '';
      if (!/exlyapp\.com\/(?:checkout|combo)\//i.test(raw)) return;
      anchor.setAttribute('href', checkoutHref);
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noreferrer noopener');
    });
  }

  function visibleElementRect(element) {
    if (!element) return null;
    try {
      var style = window.getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return null;
      var rect = element.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) return null;
      return rect;
    } catch (e) {
      return null;
    }
  }

  function ensureAcademyLucaMobileImage() {
    var lucaCard = document.querySelector('#comp-mpjxxeqt');
    if (!lucaCard) return;

    var visibleImage = Array.prototype.slice.call(lucaCard.querySelectorAll('img')).some(function (img) {
      var src = [img.currentSrc, img.getAttribute('src'), img.getAttribute('alt'), img.className].join(' ');
      return /luca|production|petracca|blu05000/i.test(src) && !!visibleElementRect(img);
    });
    if (visibleImage) return;

    var existing = lucaCard.querySelector('.tsc-luca-mobile-media');
    if (!existing) {
      existing = document.createElement('a');
      existing.className = 'tsc-luca-mobile-media';
      existing.href = '/music-production';
      existing.setAttribute('aria-label', 'Open A to Z of Music Production');
      existing.innerHTML =
        '<img src="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].image) +
        '" alt="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].imageAlt) +
        '">';
      var title =
        lucaCard.querySelector('#comp-mpjz6jkk') ||
        lucaCard.querySelector('[id*="mpjz6jkk"]') ||
        lucaCard.querySelector('#comp-mpjxxerk');
      if (title && title.parentNode) title.parentNode.insertBefore(existing, title.nextSibling);
      else lucaCard.insertBefore(existing, lucaCard.firstChild);
    }

    existing.style.setProperty('display', 'block', 'important');
    existing.style.setProperty('width', '100%', 'important');
    existing.style.setProperty('max-width', 'calc(100% - 44px)', 'important');
    existing.style.setProperty('aspect-ratio', '16 / 9', 'important');
    existing.style.setProperty('margin', '10px auto 12px', 'important');
    existing.style.setProperty('border', '1px solid rgba(255, 236, 209, 0.72)', 'important');
    existing.style.setProperty('border-radius', '10px', 'important');
    existing.style.setProperty('overflow', 'hidden', 'important');
    existing.style.setProperty('position', 'relative', 'important');
    existing.style.setProperty('z-index', '8', 'important');
    var image = existing.querySelector('img');
    if (image) {
      image.style.setProperty('display', 'block', 'important');
      image.style.setProperty('width', '100%', 'important');
      image.style.setProperty('height', '100%', 'important');
      image.style.setProperty('object-fit', 'cover', 'important');
      image.style.setProperty('object-position', '48% 42%', 'important');
      image.loading = 'eager';
      image.removeAttribute('loading');
    }
  }

  function wireAcademyCourseCardNavigation(path) {
    path = path || canonicalPathname();
    if (path !== '/academy') return;
    if (window.__tscAcademyCourseCardNavigation) return;
    window.__tscAcademyCourseCardNavigation = true;
    var ids = {
      'comp-mpjo65qn': '/the-heart-of-composition',
      'comp-mpjxmotk': '/roots-of-hindustani-classical',
      'comp-mpjxxery4': '/music-production'
    };
    function hrefForCourseCardEvent(event) {
      var target = event.target;
      if (!target || !target.closest) return null;
      var anchor = target.closest('a[href]');
      if (anchor) {
        var anchorHref = (anchor.getAttribute('href') || '').split('#')[0];
        if (ACADEMY_COURSE_HREFS[anchorHref]) return anchorHref;
        if (anchorHref === '/course-bundle') return anchorHref;
      }
      var cta = target.closest('#comp-mpjo65qn, #comp-mpjxmotk, #comp-mpjxxery4, .tsc-academy-bundle-card__cta, .tsc-luca-mobile-media');
      if (cta) {
        if (cta.classList && cta.classList.contains('tsc-academy-bundle-card__cta')) return '/course-bundle';
        if (cta.classList && cta.classList.contains('tsc-luca-mobile-media')) return '/music-production';
        return ids[cta.id] || null;
      }
      var card = target.closest('#comp-mpjvjuos, #comp-mpjxmose, #comp-mpjxxeqt, .tsc-academy-bundle-card');
      if (!card) return null;
      if (card.classList && card.classList.contains('tsc-academy-bundle-card')) return '/course-bundle';
      if (card.id === 'comp-mpjvjuos') return '/the-heart-of-composition';
      if (card.id === 'comp-mpjxmose') return '/roots-of-hindustani-classical';
      if (card.id === 'comp-mpjxxeqt') return '/music-production';
      return null;
    }
    document.addEventListener('click', function (event) {
      var href = hrefForCourseCardEvent(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('pointerup', function (event) {
      if (event.pointerType && event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
      var href = hrefForCourseCardEvent(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('touchend', function (event) {
      var href = hrefForCourseCardEvent(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var href = hrefForCourseCardEvent(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
  }

  function mountAcademyMobileBundleCard(path) {
    path = path || canonicalPathname();
    if (path !== '/academy') return;
    if (window.matchMedia && !window.matchMedia('(max-width: 1024px)').matches) return;

    var lucaMedia = document.querySelector('#comp-mrg3xrfp');
    var lucaImageHost = document.querySelector('#comp-mrg3zuhs');
    if (lucaImageHost && !lucaImageHost.querySelector('.tsc-luca-course-thumb')) {
      lucaImageHost.innerHTML =
        '<img class="tsc-luca-course-thumb" src="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].image) +
        '" alt="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].imageAlt) +
        '">';
    }
    [lucaMedia, lucaImageHost].forEach(function (node) {
      if (!node) return;
      node.removeAttribute('aria-hidden');
      node.style.setProperty('display', 'block', 'important');
      node.style.setProperty('visibility', 'visible', 'important');
      node.style.setProperty('opacity', '1', 'important');
    });
    var lucaContainer = document.querySelector('.comp-mpjxxerb1-container');
    if (lucaContainer && !lucaContainer.querySelector('.tsc-luca-inline-thumb')) {
      var lucaFigure = document.createElement('figure');
      lucaFigure.className = 'tsc-luca-inline-thumb';
      lucaFigure.innerHTML =
        '<img src="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].image) +
        '" alt="' +
        escapeHtml(MOBILE_COURSE_PAGES['/music-production'].imageAlt) +
        '">';
      var title = lucaContainer.querySelector('#comp-mpjz6jkk');
      if (title && title.nextSibling) lucaContainer.insertBefore(lucaFigure, title.nextSibling);
      else lucaContainer.insertBefore(lucaFigure, lucaContainer.firstChild);
    }
    ensureAcademyLucaMobileImage();
    wireAcademyCourseCardNavigation(path);

    if (document.querySelector('.tsc-academy-bundle-card')) return;
    var lucaCard = document.querySelector('#comp-mpjxxeqt');
    if (!lucaCard || !lucaCard.parentNode) return;
    var bundle = MOBILE_COURSE_PAGES['/course-bundle'];
    var card = document.createElement('article');
    card.className = 'tsc-academy-bundle-card';
    card.setAttribute('aria-label', bundle.shortTitle);
    card.innerHTML = [
      '<div class="tsc-academy-bundle-card__title"><span>04</span><strong>' + escapeHtml(bundle.shortTitle) + '</strong></div>',
      '<div class="tsc-academy-bundle-card__media tsc-academy-bundle-card__media-single">',
      '<img src="' + escapeHtml(bundle.image) + '" alt="' + escapeHtml(bundle.imageAlt) + '">',
      '</div>',
      '<div class="tsc-academy-bundle-card__mentor"><span>Mentors</span><strong>SANDESH + PRASAD + LUCA</strong></div>',
      '<div class="tsc-academy-bundle-card__copy"><p>' + escapeHtml(bundle.intro) + '</p></div>',
      '<div class="tsc-academy-bundle-card__stats">',
      bundle.stats.map(function (stat) {
        return '<span>' + escapeHtml(stat) + '</span>';
      }).join(''),
      '</div>',
      '<a class="tsc-academy-bundle-card__cta" href="/course-bundle">Know More</a>'
    ].join('');
    lucaCard.insertAdjacentElement('afterend', card);
  }

  var ACADEMY_NAV_ITEMS = [
    { href: '/resources', key: 'resources', label: 'Resources' },
    { href: '/academy#testimonials', key: 'testimonials', label: 'Testimonials' },
    { href: '/book-a-call', key: 'know-more', label: 'Know More' }
  ];

  function navLinksFor(academy) {
    if (academy) {
      return ACADEMY_NAV_ITEMS.map(function (item) {
        return [item.href, item.label, item.key, item.className || ''];
      });
    }
    return MAIN_NAV_ITEMS.map(function (item) {
      return [item.href, item.label, item.key, item.className || ''];
    });
  }

  function mainActivePage(path) {
    path = path || canonicalPathname();
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
    if (WORK_PATHS[path] || IMPACT_PATHS[path]) return 'work';
    if (ARTISTS_PATHS[path] || path === '/harshad-duhita' || path === '/mohit-shankar' || path === '/yugm') return 'artists';
    if (FILMS_PATHS[path]) return 'films';
    if (RESOURCES_PATHS[path]) return 'resources';
    if (isAcademyPath(path)) return 'academy';
    return '';
  }

  function mainNavAttrs(href, key, activePage, className) {
    var active = key && key === activePage;
    var attrs = ['href="' + escapeHtml(href) + '"'];
    var classes = className ? [className] : [];
    if (active) classes.push('is-active');
    if (classes.length) attrs.push('class="' + escapeHtml(classes.join(' ')) + '"');
    if (active) attrs.push('aria-current="page"');
    return attrs.join(' ');
  }

  function renderMainNav(activePage) {
    activePage = activePage || mainActivePage();
    var artistsDropdown = MAIN_ARTISTS_MENU_ITEMS.map(function (item) {
      return '<a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a>';
    }).join('');
    return [
      '<a ' + mainNavAttrs('/about', 'about', activePage) + '>About</a>',
      '<a ' + mainNavAttrs('/work', 'work', activePage) + '>Work</a>',
      '<details class="tsc-main-artists-menu' + (activePage === 'artists' ? ' is-active' : '') + '">',
      '<summary' + (activePage === 'artists' ? ' aria-current="page"' : '') + '>Artists</summary>',
      '<div class="tsc-main-artists-dropdown">',
      artistsDropdown,
      '</div>',
      '</details>',
      '<a ' + mainNavAttrs('/films', 'films', activePage) + '>Films</a>',
      '<a ' + mainNavAttrs('/resources', 'resources', activePage) + '>Resources</a>',
      '<a ' + mainNavAttrs('/academy', 'academy', activePage, 'tsc-main-academy-link') + '>TSC Academy</a>'
    ].join('');
  }

  function academyActivePage(path, hash) {
    path = path || canonicalPathname();
    hash = hash || location.hash || '';
    if (path === '/resources' || RESOURCES_PATHS[path]) return 'resources';
    if (hash === '#testimonials') return 'testimonials';
    if (hash === '#know-more') return 'know-more';
    if (path === '/book-a-call' || path === '/artist-query' || path === '/masterclass-review01' || path === '/masterclass-review02' || path === '/classicalreview') return 'know-more';
    if (LEARN_PATHS[path] || path === '/academy' || path === '/learn-with-tsc') return 'courses';
    return '';
  }

  function academyNavItemMarkup(item, activePage) {
    var active = item.key && item.key === activePage;
    var attrs = [
      'href="' + escapeHtml(item.href) + '"',
      'data-tsc-nav-key="' + escapeHtml(item.key || '') + '"'
    ];
    if (item.className) attrs.push('class="' + escapeHtml(item.className + (active ? ' is-active' : '')) + '"');
    else if (active) attrs.push('class="is-active"');
    if (active) attrs.push('aria-current="page"');
    return '<a ' + attrs.join(' ') + '>' + escapeHtml(item.label) + '</a>';
  }

  function renderAcademyNav(activePage, mobile) {
    activePage = activePage || academyActivePage();
    var courseActive = activePage === 'courses';
    var courseItems = ACADEMY_COURSE_ITEMS.map(function (item) {
      var active = item.href === canonicalPathname();
      return '<a href="' + escapeHtml(item.href) + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + escapeHtml(item.label) + '</a>';
    }).join('');
    if (mobile) {
      return [
        academyNavItemMarkup({ href: '/resources', key: 'resources', label: 'Resources' }, activePage),
        '<details class="tsc-mobile-academy-courses' + (courseActive ? ' is-active' : '') + '">',
        '<summary' + (courseActive ? ' aria-current="page"' : '') + '>Courses</summary>',
        '<div>',
        courseItems,
        '</div>',
        '</details>',
        academyNavItemMarkup({ href: '/academy#testimonials', key: 'testimonials', label: 'Testimonials' }, activePage),
        academyNavItemMarkup({ href: '/book-a-call', key: 'know-more', label: 'Know More' }, activePage),
        academyNavItemMarkup({ href: '/', key: 'main-site', label: 'MAIN WEBSITE' }, activePage)
      ].join('');
    }
    return [
      academyNavItemMarkup({ href: '/resources', key: 'resources', label: 'Resources' }, activePage),
      '<details class="tsc-academy-courses-menu' + (courseActive ? ' is-active' : '') + '">',
      '<summary' + (courseActive ? ' aria-current="page"' : '') + '>Courses</summary>',
      '<div class="tsc-academy-courses-dropdown">',
      courseItems,
      '</div>',
      '</details>',
      academyNavItemMarkup({ href: '/academy#testimonials', key: 'testimonials', label: 'Testimonials' }, activePage),
      academyNavItemMarkup({ href: '/book-a-call', key: 'know-more', label: 'Know More' }, activePage),
      academyNavItemMarkup({ href: '/', key: 'main-site', label: 'MAIN WEBSITE', className: 'tsc-academy-main-site-link' }, activePage)
    ].join('');
  }

  /** Wix blanks collide (Courses+Testimonials share //blank-3). Force top nav by label. */
  var ACADEMY_TOP_NAV_HREFS = [
    { key: 'resources', href: '/resources', label: 'resources' },
    { key: 'courses', href: '/academy#courses', label: 'courses' },
    { key: 'testimonials', href: '/academy#testimonials', label: 'testimonials' },
    { key: 'know-more', href: '/book-a-call', label: 'know more' },
    { key: 'main-site', href: '/', label: 'main website' }
  ];

  function navLinkLabel(node) {
    if (!node) return '';
    var labelNode =
      (node.querySelector &&
        node.querySelector(
          '[data-part="label"], .wixui-horizontal-menu__item-label, .wixui-menu__item-label, [data-testid="submenu-item-label"]'
        )) ||
      null;
    if (labelNode) return textKeyNav(labelNode.textContent);
    return textKeyNav(node.textContent);
  }

  function clearNavActiveMarks(node) {
    if (!node || !node.classList) return;
    node.classList.remove('is-active', 'WB5Q35');
    node.removeAttribute('aria-current');
    if (node.getAttribute && node.getAttribute('data-preview') === 'selected') {
      node.removeAttribute('data-preview');
    }
  }

  function markNavActive(node) {
    if (!node || !node.classList) return;
    node.classList.add('is-active');
    node.setAttribute('aria-current', 'page');
  }

  function repairLockedAcademyTopNav(header) {
    if (!header) return;
    Array.prototype.forEach.call(header.querySelectorAll('a[href]'), function (anchor) {
      if (
        anchor.closest(
          '.wixui-dropdown-menu, [data-testid="submenu"], .tsc-academy-courses-dropdown, .tsc-mobile-academy-courses > div, .tsc-main-artists-dropdown'
        )
      ) {
        return;
      }
      var label = navLinkLabel(anchor);
      for (var i = 0; i < ACADEMY_TOP_NAV_HREFS.length; i++) {
        if (ACADEMY_TOP_NAV_HREFS[i].label !== label) continue;
        anchor.setAttribute('href', ACADEMY_TOP_NAV_HREFS[i].href);
        anchor.setAttribute('target', '_self');
        anchor.removeAttribute('rel');
        return;
      }
    });
  }

  function academyTopNavKey(label) {
    if (label === 'resources') return 'resources';
    if (label === 'courses') return 'courses';
    if (label === 'testimonials') return 'testimonials';
    if (label === 'know more') return 'know-more';
    return '';
  }

  function mainTopNavKey(label) {
    if (label === 'about') return 'about';
    if (label === 'work') return 'work';
    if (label === 'artists') return 'artists';
    if (label === 'films') return 'films';
    if (label === 'resources') return 'resources';
    if (label === 'tsc academy' || label === 'academy') return 'academy';
    return '';
  }

  function applyLockedDesktopActiveState(header, config) {
    if (!header || !config) return;
    if (config.academy) repairLockedAcademyTopNav(header);

    var activePage = config.academy ? academyActivePage(config.path) : mainActivePage(config.path);
    Array.prototype.forEach.call(
      header.querySelectorAll('a, summary, [role="menuitem"], [data-part="menu-item-content"], details'),
      clearNavActiveMarks
    );
    if (!activePage) return;

    Array.prototype.forEach.call(header.querySelectorAll('a[href]'), function (anchor) {
      if (anchor.classList.contains('tsc-desktop-brand-link')) return;
      var href = anchor.getAttribute('href') || '';
      var hrefPath = href.split('#')[0];
      var inCourseDropdown = !!(
        anchor.closest &&
        anchor.closest(
          '.tsc-academy-courses-dropdown, .tsc-mobile-academy-courses > div, .wixui-dropdown-menu, [data-testid="submenu"]'
        )
      );
      var inArtistsDropdown = !!(
        anchor.closest && anchor.closest('.tsc-main-artists-dropdown, .tsc-mobile-artists-menu > div')
      );

      // Dropdown leaves: only the matching destination page is active.
      if (inCourseDropdown || ACADEMY_COURSE_HREFS[hrefPath]) {
        if (hrefPath && hrefPath === config.path) markNavActive(anchor);
        return;
      }
      if (inArtistsDropdown) {
        if (hrefPath && hrefPath === config.path) markNavActive(anchor);
        return;
      }

      // Top-level: label/key only — never "href === current path" (Wix blanks share URLs).
      var label = navLinkLabel(anchor);
      var key = config.academy ? academyTopNavKey(label) : mainTopNavKey(label);
      if (key && key === activePage) markNavActive(anchor);
    });

    Array.prototype.forEach.call(header.querySelectorAll('summary'), function (summary) {
      var label = navLinkLabel(summary);
      if (config.academy && label === 'courses' && activePage === 'courses') {
        markNavActive(summary);
        if (summary.parentElement) summary.parentElement.classList.add('is-active');
      }
      if (!config.academy && label === 'artists' && activePage === 'artists') {
        markNavActive(summary);
        if (summary.parentElement) summary.parentElement.classList.add('is-active');
      }
    });
  }

  function textKeyNav(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function ensureWixCourseDropdownItem(menu, course, template) {
    var item = (template && template.cloneNode(true)) || document.createElement('li');
    item.setAttribute('data-tsc-course-item', course.href);
    item.setAttribute('data-item-depth', '1');
    // Keep Wix item chrome from template — wiping className clipped last-row hit area on some pages.
    if (!item.className && template && template.className) item.className = template.className;
    var anchor = item.querySelector('a') || document.createElement('a');
    if (!anchor.parentNode) item.appendChild(anchor);
    anchor.setAttribute('href', course.href);
    anchor.setAttribute('target', '_self');
    anchor.removeAttribute('rel');
    anchor.removeAttribute('aria-current');
    anchor.classList.remove('WB5Q35', 'is-active');
    anchor.setAttribute('aria-label', course.label);
    var labelNode =
      anchor.querySelector('[data-testid="submenu-item-label"], [data-part="dropdown-item-label"], span') ||
      anchor;
    labelNode.textContent = course.label;
    labelNode.removeAttribute('data-selected');
    return item;
  }

  function isMusicProductionLabel(label) {
    return (
      label === 'a-z of music production' ||
      label === 'a to z of music production' ||
      label === 'a to z course' ||
      label.indexOf('a to z') >= 0 ||
      label.indexOf('a-z') >= 0
    );
  }

  function matchesAcademyCourse(anchor, course) {
    var label = textKeyNav(anchor.textContent);
    var href = anchor.getAttribute('href') || '';
    if (href === course.href || label === textKeyNav(course.label)) return true;
    // ponytail: a-z aliases only for music-production — shared match rewrote A-Z → HeART and looped injects
    if (course.href === '/music-production' && isMusicProductionLabel(label)) return true;
    return false;
  }

  function isAcademyCoursesDropdownMenu(menu) {
    var menuText = textKeyNav(menu.textContent);
    if (!menuText) return false;
    // Never rewrite Artists mega-menu.
    if (menuText.indexOf('tsc artists') >= 0 && menuText.indexOf('artist path') >= 0) return false;
    return (
      menuText.indexOf('roots of hindustani') >= 0 ||
      menuText.indexOf('heart of composition') >= 0 ||
      isMusicProductionLabel(menuText) ||
      menuText.indexOf('music production') >= 0
    );
  }

  /** Force all 3 course rows (labels + hrefs) into Wix Courses dropdowns — every academy/course page. */
  function ensureAcademyCoursesInWixMenus() {
    document.querySelectorAll('ul.wixui-dropdown-menu, ul[role="menu"]').forEach(function (menu) {
      if (!isAcademyCoursesDropdownMenu(menu)) return;

      var template = menu.querySelector('li[data-item-depth], li');
      var rebuilt = document.createDocumentFragment();
      ACADEMY_COURSE_ITEMS.forEach(function (course) {
        rebuilt.appendChild(ensureWixCourseDropdownItem(menu, course, template));
      });
      menu.innerHTML = '';
      menu.appendChild(rebuilt);
      menu.style.setProperty('--items-number', String(ACADEMY_COURSE_ITEMS.length));
      menu.setAttribute('data-tsc-courses-menu', '1');
    });
  }

  /** Label wins over Wix //blank-9 collisions (A-Z and HeART both used blank-9). */
  function wireLockedCoursesDropdownClickGuard() {
    if (window.__tscCoursesDropdownClickGuard) return;
    window.__tscCoursesDropdownClickGuard = true;
    var targets = {
      'All Courses Bundle': '/course-bundle',
      'Course Bundle': '/course-bundle',
      'A to Z of Music Production': '/music-production',
      'A-Z of Music Production': '/music-production',
      'A to Z Course': '/music-production',
      'The HeART of Composition': '/the-heart-of-composition',
      'The Heart of Composition': '/the-heart-of-composition',
      'Roots of Hindustani Classical': '/roots-of-hindustani-classical'
    };
    function courseHrefFromEvent(event) {
      var node =
        event.target &&
        event.target.closest &&
        event.target.closest(
          'a, [role="menuitem"], .wixui-dropdown-menu__item, [data-testid="submenu-item-label"], [data-part="dropdown-item-label"]'
        );
      if (!node) return null;
      var inCourses =
        node.closest &&
        node.closest(
          '.wixui-dropdown-menu, [data-testid="submenu"], .tsc-academy-courses-dropdown, [data-tsc-courses-menu="1"]'
        );
      if (!inCourses) return null;
      var label = (node.textContent || '').trim().replace(/\s+/g, ' ');
      if (targets[label]) return targets[label];
      var key = textKeyNav(label);
      if (isMusicProductionLabel(key)) return '/music-production';
      if (key.indexOf('heart') >= 0 && key.indexOf('composition') >= 0) return '/the-heart-of-composition';
      if (key.indexOf('roots') >= 0 || key.indexOf('hindustani') >= 0) return '/roots-of-hindustani-classical';
      var anchor = node.closest ? node.closest('a[href]') : null;
      var href = (anchor && anchor.getAttribute('href')) || '';
      if (ACADEMY_COURSE_HREFS[href.split('#')[0]]) return href.split('#')[0];
      return null;
    }
    document.addEventListener(
      'click',
      function (event) {
        var href = courseHrefFromEvent(event);
        if (!href) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(href);
      },
      true
    );
    document.addEventListener(
      'keydown',
      function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        var href = courseHrefFromEvent(event);
        if (!href) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(href);
      },
      true
    );
  }

  /**
   * Course pages: Courses dropdown sits left of trigger + ~35px gap.
   * Mouse path to "Roots…" leaves Wix hover → menu closes. Pin open under Courses.
   */
  function wireCoursesDropdownStayOpen() {
    if (window.__tscCoursesDropdownStayOpen) return;
    window.__tscCoursesDropdownStayOpen = true;
    var openLi = null;
    var closeTimer = null;
    var dropRect = null;

    function coursesItemLi(node) {
      if (!node || !node.closest) return null;
      var header = node.closest('[data-tsc-locked-desktop-header="true"]');
      if (!header) return null;
      var li = node.closest('li');
      if (!li || !header.contains(li)) return null;
      var labelEl =
        li.querySelector('[data-part="label"], .wixui-horizontal-menu__item-label, .wixui-menu__item-label') || li;
      if (navLinkLabel(labelEl) !== 'courses') return null;
      return li;
    }

    function dropdownFor(li) {
      return (
        (li &&
          (li.querySelector('#dataItem-mrxcvn15-dropdown') ||
            li.querySelector('.rpHatU') ||
            li.querySelector('[id$="-dropdown"]'))) ||
        null
      );
    }

    function pinOpen(li) {
      if (!li) return;
      window.clearTimeout(closeTimer);
      if (openLi && openLi !== li) releaseOpen(openLi);
      openLi = li;
      li.setAttribute('data-tsc-courses-open', '1');
      var drop = dropdownFor(li);
      if (!drop) return;
      var liRect = li.getBoundingClientRect();
      drop.setAttribute('data-tsc-courses-pinned', '1');
      drop.style.setProperty('position', 'fixed', 'important');
      drop.style.setProperty('top', Math.round(liRect.bottom - 6) + 'px', 'important');
      drop.style.setProperty('left', Math.round(liRect.left) + 'px', 'important');
      drop.style.setProperty('right', 'auto', 'important');
      drop.style.setProperty('transform', 'none', 'important');
      drop.style.setProperty('display', 'grid', 'important');
      drop.style.setProperty('visibility', 'visible', 'important');
      drop.style.setProperty('opacity', '1', 'important');
      drop.style.setProperty('pointer-events', 'auto', 'important');
      drop.style.setProperty('z-index', '100000', 'important');
      dropRect = drop.getBoundingClientRect();
    }

    function releaseOpen(li) {
      if (!li) return;
      li.removeAttribute('data-tsc-courses-open');
      var drop = dropdownFor(li);
      if (drop) {
        drop.removeAttribute('data-tsc-courses-pinned');
        ['position', 'top', 'left', 'right', 'transform', 'display', 'visibility', 'opacity', 'pointer-events', 'z-index'].forEach(
          function (prop) {
            drop.style.removeProperty(prop);
          }
        );
      }
      if (openLi === li) {
        openLi = null;
        dropRect = null;
      }
    }

    function inOpenZone(x, y) {
      if (!openLi) return false;
      var lr = openLi.getBoundingClientRect();
      var dr = dropRect || lr;
      var left = Math.min(lr.left, dr.left) - 4;
      var right = Math.max(lr.right, dr.right) + 4;
      var top = Math.min(lr.top, dr.top) - 4;
      var bottom = Math.max(lr.bottom, dr.bottom) + 4;
      return x >= left && x <= right && y >= top && y <= bottom;
    }

    document.addEventListener(
      'pointerover',
      function (event) {
        var li = coursesItemLi(event.target);
        if (li) pinOpen(li);
      },
      true
    );

    document.addEventListener(
      'pointermove',
      function (event) {
        if (!openLi) return;
        if (inOpenZone(event.clientX, event.clientY)) {
          window.clearTimeout(closeTimer);
          pinOpen(openLi);
          return;
        }
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
          if (openLi) releaseOpen(openLi);
        }, 160);
      },
      true
    );

    document.addEventListener(
      'pointerout',
      function (event) {
        if (!openLi) return;
        var related = event.relatedTarget;
        if (related && openLi.contains(related)) return;
        if (related && related.closest && related.closest('[data-tsc-courses-pinned="1"]')) return;
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(function () {
          if (openLi && !inOpenZone(event.clientX, event.clientY)) releaseOpen(openLi);
        }, 160);
      },
      true
    );

    window.addEventListener('scroll', function () {
      if (openLi) pinOpen(openLi);
    }, true);
  }

  function markLegacyHeaders() {
    document.querySelectorAll('header, #SITE_HEADER, [data-testid="siteHeader"]').forEach(function (header) {
      if (header.classList && header.classList.contains('tsc-desktop-site-header')) return;
      if (header.classList && header.classList.contains('tsc-mobile-site-header')) return;
      header.classList.add('tsc-legacy-header');
      header.setAttribute('aria-hidden', 'true');
    });
  }

  function activateLockedDesktopHeader() {
    var headers = Array.prototype.filter.call(
      document.querySelectorAll('header, #SITE_HEADER, [data-testid="siteHeader"]'),
      function (header) {
        return !header.classList.contains('tsc-desktop-site-header') &&
          !header.classList.contains('tsc-mobile-site-header');
      }
    );
    if (!headers.length) return null;

    /* Stick to already-locked header — never flip to a competing Wix master after hydrate. */
    var expected = headers.find(function (header) {
      return header.getAttribute('data-tsc-locked-desktop-header') === 'true';
    });
    if (!expected) {
      expected = headers.find(function (header) {
        var style = window.getComputedStyle(header);
        var rect = header.getBoundingClientRect();
        return style.display !== 'none' && rect.width > 0 && rect.height > 0;
      }) || headers[0];
    }

    headers.forEach(function (header) {
      var active = header === expected;
      header.classList.toggle('tsc-locked-desktop-header-hidden', !active);
      header.classList.toggle('tsc-legacy-header', !active);
      if (active) {
        header.setAttribute('data-tsc-locked-desktop-header', 'true');
        header.removeAttribute('aria-hidden');
      } else {
        header.removeAttribute('data-tsc-locked-desktop-header');
        header.setAttribute('aria-hidden', 'true');
      }
    });
    return expected;
  }

  function syncLockedDesktopHeaderBrand(header, config) {
    if (!header || !config) return;
    /* Clone-faithful: href/aria only — never replace Wix SVG/img or force box size/colour. */
    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var homeHref = config.academy ? '/academy' : '/';
    var candidates = Array.prototype.filter.call(header.querySelectorAll('a'), function (link) {
      var rect = link.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.left > 430) return false;
      return !!link.querySelector('img, svg, wix-vector-image, .wixui-vector-image') ||
        /shakti|academy|logo|brand/i.test(link.getAttribute('aria-label') || link.textContent || '');
    });
    var brandLink = candidates[0];
    if (!brandLink) return;
    brandLink.href = homeHref;
    brandLink.setAttribute('aria-label', brandName);
    header.setAttribute('data-tsc-brand-locked', '1');
  }

  /* About hero shankha: keep Wix's original vector frame so authored motion stays aligned. */
  function fixAboutHeroShellViewBox() {
    var host = document.getElementById('comp-mr1ttkgk');
    if (!host) return;
    host.dataset.tscShellFixed = '1';
  }

  function mountDesktopHeader(opts) {
    var config = componentOptions(opts);
    var forceCustomHeader = !!(opts && opts.forceCustomHeader) || !!document.querySelector('.report-page');
    if (usesNativeWixNav(config.path) && !forceCustomHeader) {
      removeInjectedTscHeaders();
      var nativeDesktop = !window.matchMedia || window.matchMedia('(min-width: 1025px)').matches;
      var lockedNative = null;
      if (nativeDesktop) {
        lockedNative = activateLockedDesktopHeader();
        if (lockedNative) {
          syncLockedDesktopHeaderBrand(lockedNative, config);
          applyLockedDesktopActiveState(lockedNative, config);
        }
      } else {
        clearNativeHeaderLockState();
      }
      ensurePrimaryWixNavVisible();
      ensureWixHeaderScrollAnimation();
      if (isAcademyPath(config.path)) {
        hideAcademyMainSiteHeaders();
        ensureAcademyCoursesInWixMenus();
      }
      return lockedNative;
    }
    var desktop = !window.matchMedia || window.matchMedia('(min-width: 1025px)').matches;
    var existing = document.querySelector('.tsc-desktop-site-header');
    if (!desktop) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return null;
    }
    var variant = config.academy ? 'academy' : 'main';
    var activePage = opts && opts.activePage || academyActivePage(config.path);
    /* Prefer any native Wix header in DOM (even pre-layout) over injecting a second custom bar. */
    var nativeHeaders = document.querySelectorAll('header:not(.tsc-desktop-site-header):not(.tsc-mobile-site-header), #SITE_HEADER, [data-testid="siteHeader"]');
    var locked = forceCustomHeader ? null : (nativeHeaders.length ? activateLockedDesktopHeader() : null);
    if (locked) {
      syncLockedDesktopHeaderBrand(locked, config);
      if (config.academy) ensureAcademyCoursesInWixMenus();
      applyLockedDesktopActiveState(locked, config);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return locked;
    }
    if (
      existing &&
      existing.dataset.tscVariant === variant &&
      (!config.academy || existing.dataset.tscActivePage === activePage)
    ) {
      markLegacyHeaders();
      return existing;
    }
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    markLegacyHeaders();

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var navMarkup = config.academy ? renderAcademyNav(activePage, false) : navLinksFor(false).map(function (item) {
      return '<a href="' + escapeHtml(item[0]) + '">' + escapeHtml(item[1]) + '</a>';
    }).join('');
    if (!config.academy) navMarkup = renderMainNav(mainActivePage(config.path));
    var header = document.createElement('header');
    header.className = 'tsc-desktop-site-header' + (config.academy ? ' tsc-desktop-site-header-academy' : '');
    header.dataset.tscVariant = variant;
    if (forceCustomHeader) header.dataset.tscForcedHeader = 'true';
    if (config.academy) header.dataset.tscActivePage = activePage;
    header.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'main');
    header.innerHTML = [
      '<a class="tsc-desktop-site-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
      '<img class="tsc-desktop-brand-logo tsc-desktop-brand-logo-unified" src="' + logoSrcForConfig(config) + '" alt="' + escapeHtml(brandName) + '" decoding="async">',
      '</a>',
      '<nav class="tsc-desktop-site-nav" aria-label="' + (config.academy ? 'TSC Academy' : 'The Shakti Collective') + ' navigation">',
      navMarkup,
      '</nav>'
    ].join('');
    document.body.insertBefore(header, document.body.firstChild);
    return header;
  }

  var CONTACT_EMAIL = 'artist@theshakticollective.in';
  var LINKEDIN_URL = 'https://www.linkedin.com/company/the-shakti-collective/';

  function footerGroupsFor(academy, whatsappUrl) {
    if (academy) {
      return [
        ['Start Here', [
          ['/book-a-call', 'Book a Call'],
          ['/artist-query', 'Apply for Artist Path'],
          ['/book-an-artist', 'Book an Artist']
        ]],
        ['Academy', [
          ['/academy', 'Academy Home'],
          ['/academy#courses', 'Courses'],
          ['/course-bundle', 'All Courses Bundle'],
          ['/music-production', 'A-Z of Music Production'],
          ['/the-heart-of-composition', 'The HeART of Composition'],
          ['/roots-of-hindustani-classical', 'Roots of Hindustani Classical'],
          ['/affiliate', 'Affiliate Program']
        ]],
        ['Explore TSC', [
          ['/', 'The Shakti Collective'],
          ['/about', 'About'],
          ['/artists', 'Artists'],
          ['/resources', 'Resources']
        ]]
      ];
    }
    return [
      ['Start Here', [
        ['/book-a-call', 'Book a Call'],
        ['/book-an-artist', 'Book an Artist'],
        ['/artist-query', 'Apply for Artist Path']
      ]],
      ['Quick Links', [
        ['/', 'Home'],
        ['/about', 'About'],
        ['/work', 'Work'],
        ['/artists', 'Artists'],
        ['/academy', 'TSC Academy'],
        ['/films', 'Films']
      ]],
      ['Explore', [
        ['/artist-path', 'Artist Path'],
        ['/academy', 'Learn With TSC'],
        ['/resources', 'Resources'],
        ['/affiliate', 'Affiliate Program']
      ]],
      ['Join Our Community', [
        [whatsappUrl, 'WhatsApp community', true],
        ['mailto:' + CONTACT_EMAIL, CONTACT_EMAIL]
      ]]
    ];
  }

  function mountMobileHeader(opts) {
    if (!ENABLE_CUSTOM_MOBILE_CHROME) {
      unmountCustomMobileChrome();
      return null;
    }
    var mobileConfig = componentOptions(opts);
    var mobileForceCustom = !!(opts && opts.forceCustomHeader) || !!document.querySelector('.report-page');
    // Mobile-only: componentized header handles both main TSC + Academy navs.
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    if (usesNativeWixNav(mobileConfig.path) && !mobileForceCustom && !compact) {
      removeInjectedTscHeaders();
      ensurePrimaryWixNavVisible();
      ensureWixHeaderScrollAnimation();
      if (isAcademyPath(mobileConfig.path)) hideAcademyMainSiteHeaders();
      return null;
    }
    // Tablet + phone: Wix hamburger is broken 701–1024px — use TSC chrome through 1024.
    var existing = document.querySelector('.tsc-mobile-site-header');
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return null;
    }

    var config = componentOptions(opts);
    var variant = config.academy ? 'academy' : 'main';
    var activePage = opts && opts.activePage || academyActivePage(config.path);
    if (
      existing &&
      existing.dataset.tscVariant === variant &&
      (!config.academy || existing.dataset.tscActivePage === activePage)
    ) {
      hideWixMobileNavChrome();
      return existing;
    }
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    markLegacyHeaders();

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var mobileActivePage = config.academy ? activePage : mainActivePage(config.path);
    var mobileNavMarkup = config.academy ? renderAcademyNav(activePage, true) : navLinksFor(false).map(function (item) {
      var key = mainActivePage(item[0]);
      var active = key && key === mobileActivePage;
      return '<a href="' + escapeHtml(item[0]) + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + escapeHtml(item[1]) + '</a>';
    }).join('');
    var header = document.createElement('div');
    header.className = 'tsc-mobile-site-header' + (config.academy ? ' tsc-mobile-site-header-academy' : '');
    header.dataset.tscVariant = variant;
    if (config.academy) header.dataset.tscActivePage = activePage;
    header.innerHTML = [
      '<a class="tsc-mobile-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
      mobileHeaderLogoMarkup(config),
      '</a>',
      '<details class="tsc-mobile-menu">',
      '<summary aria-label="Open navigation"><span></span><span></span><span></span></summary>',
      '<nav aria-label="' + (config.academy ? 'TSC Academy mobile' : 'TSC mobile') + '">',
      mobileNavMarkup,
      '</nav>',
      '</details>',
      '<a class="tsc-mobile-header-cta" href="' + (config.academy ? '/' : '/academy') + '">' + (config.academy ? 'Main Website' : 'TSC Academy') + '</a>'
    ].join('');
    document.body.insertBefore(header, document.getElementById('SITE_CONTAINER') || document.body.firstChild);
    hideWixMobileNavChrome();

    var menu = header.querySelector('.tsc-mobile-menu');
    if (menu) {
      menu.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.removeAttribute('open');
        });
      });
      menu.querySelectorAll('.tsc-mobile-academy-courses > summary').forEach(function (summary) {
        summary.addEventListener('click', function (event) {
          var courses = summary.parentElement;
          if (!courses) return;
          event.preventDefault();
          event.stopPropagation();
          courses.open = !courses.open;
        });
      });
      document.addEventListener('click', function (event) {
        if (!menu.hasAttribute('open')) return;
        if (!menu.contains(event.target)) menu.removeAttribute('open');
      });
    }
    return header;
  }

  function findSiteFooter() {
    return document.querySelector('footer#SITE_FOOTER') ||
      document.querySelector('footer[data-testid="siteFooter"]') ||
      document.querySelector('footer:not(.tsc-shared-footer-host)') ||
      document.getElementById('SITE_FOOTER');
  }

  function ensureSharedFooterHost() {
    var host = document.querySelector('footer.tsc-shared-footer-host');
    if (host) return host;
    host = document.createElement('footer');
    host.className = 'tsc-shared-footer-host';
    host.dataset.tscComponent = 'shared-footer';
    host.setAttribute('aria-label', 'Site footer');
    document.body.appendChild(host);
    return host;
  }

  function scrapeFooterSocialHref(footer, needle, fallback) {
    if (!footer) return fallback;
    var link = footer.querySelector('a[href*="' + needle + '"]');
    var href = (link && link.getAttribute('href')) || fallback;
    if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href;
    return fallback;
  }

  function scrapeFooterSvgMarkup(footer, needle, fallback) {
    if (!footer) return fallback;
    var selector = needle ? 'a[href*="' + needle + '"] svg' : 'svg';
    var svg = footer.querySelector(selector);
    if (!svg) return fallback;
    var clone = svg.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('data-testid');
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('focusable', 'false');
    return clone.outerHTML || fallback;
  }

  function findFooterSectionInRoot(root) {
    if (!root || !root.querySelectorAll) return null;
    return Array.prototype.slice.call(root.querySelectorAll('.wixui-footer, section, [data-testid="section-container"]')).find(function (section) {
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      return /Quick Links/i.test(text) && /Join Our Community/i.test(text);
    }) || null;
  }

  function referenceFooterPathForPage(config) {
    var page = document.body && document.body.dataset && document.body.dataset.page || '';
    if (config && config.academy) return '/academy';
    if (/films|mahavatar|hanuman|mahaprbhu|mahaprabhu|kalki/i.test(page)) return '/films';
    if (/resources|blog|music-course|release-playbook|bhajan|released-a-song|curate-music/i.test(page)) return '/resources';
    return '/';
  }

  function hydrateReferenceFooterAssets(shell, config, sourceFooter) {
    if (!shell || sourceFooter || !window.fetch || !window.DOMParser) return;
    var referencePath = referenceFooterPathForPage(config);
    window.fetch(referencePath, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Footer reference unavailable');
        return response.text();
      })
      .then(function (html) {
        var parsed = new DOMParser().parseFromString(html, 'text/html');
        var footer = findFooterSectionInRoot(parsed);
        if (!footer) return;
        Array.prototype.forEach.call(shell.querySelectorAll('[data-tsc-social-id]'), function (link) {
          var id = link.getAttribute('data-tsc-social-id');
          var needle = id === 'email' ? 'mailto:' : id;
          var svg = scrapeFooterSvgMarkup(footer, needle, '');
          if (svg) link.innerHTML = svg;
        });
        if (config && config.academy) return;
        var logoSvg = scrapeFooterLogoSvgMarkup(footer);
        if (!logoSvg) return;
        Array.prototype.forEach.call(shell.querySelectorAll('.tsc-desktop-footer-brand, .tsc-mobile-footer-brand'), function (brand) {
          var isMobile = brand.classList.contains('tsc-mobile-footer-brand');
          brand.innerHTML = '<span class="' + (isMobile ? 'tsc-mobile-footer-logo tsc-mobile-footer-logo-svg' : 'tsc-desktop-footer-logo tsc-desktop-footer-logo-legacy') + '" aria-hidden="true">' + logoSvg + '</span>';
        });
      })
      .catch(function () { });
  }

  function findLegacyFooterSections() {
    return Array.prototype.slice.call(document.querySelectorAll('.wixui-footer, section, [data-testid="section-container"]')).filter(function (section) {
      if (section.closest('.tsc-desktop-footer, .tsc-mobile-footer')) return false;
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      var footerText = /©\s*2026\s*The Shakti Collective|All rights reserved/i.test(text);
      var legacyFooterCluster = /Quick Links/i.test(text) && /Join Our Community/i.test(text) && /Unfolding Artist Force /i.test(text);
      if (!section.classList.contains('wixui-footer') && !footerText && !legacyFooterCluster) return false;
      return !section.closest('.tsc-desktop-footer, .tsc-mobile-footer');
    });
  }

  function markLegacyFooters() {
    findLegacyFooterSections().forEach(function (section) {
      section.classList.add('tsc-legacy-footer');
      var parentFooter = section.closest('footer');
      if (parentFooter && !parentFooter.querySelector('.tsc-desktop-footer, .tsc-mobile-footer')) {
        parentFooter.classList.add('tsc-legacy-footer-host');
      }
    });
  }

  /** Hide mirrored Wix page footers once TSC shared footer is active (About, Work, etc.). */
  function suppressNativeWixFooters() {
    markLegacyFooters();
    document.querySelectorAll('footer:not(.tsc-shared-footer-host)').forEach(function (footer) {
      if (footer.querySelector('.tsc-desktop-footer, .tsc-mobile-footer')) return;
      var text = (footer.textContent || '').replace(/\s+/g, ' ').trim();
      var looksLikeWixFooter = /Quick Links/i.test(text) &&
        (/Join Our Community/i.test(text) || /Unfolding Artist Force /i.test(text));
      if (!looksLikeWixFooter) return;
      footer.classList.add('tsc-legacy-footer-host');
      footer.setAttribute('aria-hidden', 'true');
      footer.style.setProperty('display', 'none', 'important');
      footer.style.setProperty('visibility', 'hidden', 'important');
      footer.style.setProperty('height', '0', 'important');
      footer.style.setProperty('min-height', '0', 'important');
      footer.style.setProperty('overflow', 'hidden', 'important');
      footer.style.setProperty('pointer-events', 'none', 'important');
    });

    document.querySelectorAll('footer').forEach(function (footer) {
      if (!footer.querySelector('.tsc-desktop-footer, .tsc-mobile-footer')) return;
      Array.prototype.slice.call(footer.children).forEach(function (child) {
        if (!child.classList.contains('tsc-desktop-footer') && !child.classList.contains('tsc-mobile-footer')) {
          child.classList.add('tsc-legacy-footer');
          child.setAttribute('aria-hidden', 'true');
          child.style.setProperty('display', 'none', 'important');
          child.style.setProperty('visibility', 'hidden', 'important');
          child.style.setProperty('height', '0', 'important');
          child.style.setProperty('min-height', '0', 'important');
          child.style.setProperty('max-height', '0', 'important');
          child.style.setProperty('overflow', 'hidden', 'important');
          child.style.setProperty('pointer-events', 'none', 'important');
          child.style.setProperty('margin', '0', 'important');
          child.style.setProperty('padding', '0', 'important');
        }
      });
    });
  }

  /* Nav header: Collective on main, Academy mark on Academy chrome. Same CSS size box. */
  function logoSrcForConfig(config) {
    return config && config.academy ? ACADEMY_LOGO_SRC : TSC_LOGO_SRC;
  }

  function footerLogoSrcForConfig(config) {
    return config && config.academy ? ACADEMY_FOOTER_LOGO_SRC : TSC_FOOTER_LOGO_SRC;
  }

  function scrapeFooterLogoSvgMarkup(footer) {
    if (!footer) return '';
    var links = Array.prototype.slice.call(footer.querySelectorAll('.wixui-vector-image a[href] svg, a[href] .wixui-vector-image svg, a[href] svg'));
    var logo = links.find(function (svg) {
      var href = (svg.closest('a') && svg.closest('a').getAttribute('href')) || '';
      return href === '/' || href === '/academy' || /theshakticollective|academy/i.test(href);
    }) || footer.querySelector('.wixui-vector-image svg');
    if (!logo) return '';
    var clone = logo.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('data-testid');
    clone.setAttribute('aria-hidden', 'true');
    clone.setAttribute('focusable', 'false');
    return clone.outerHTML || '';
  }

  function legacyFooterLogoMarkup(config, brandName, sourceFooter) {
    var svgMarkup = scrapeFooterLogoSvgMarkup(sourceFooter);
    if (svgMarkup) return '<span class="tsc-desktop-footer-logo tsc-desktop-footer-logo-legacy" aria-hidden="true">' + svgMarkup + '</span>';
    return '<img class="tsc-desktop-footer-logo" src="' + footerLogoSrcForConfig(config) + '" alt="' + escapeHtml(brandName) + '" width="260" height="108" decoding="async">';
  }

  function mobileFooterLogoMarkup(config, brandName, sourceFooter) {
    var svgMarkup = config && config.academy ? '' : scrapeFooterLogoSvgMarkup(sourceFooter);
    if (svgMarkup) return '<span class="tsc-mobile-footer-logo tsc-mobile-footer-logo-svg" aria-hidden="true">' + svgMarkup + '</span>';
    return '<img class="tsc-mobile-footer-logo" src="' + footerLogoSrcForConfig(config) + '" alt="' + escapeHtml(brandName) + '" width="180" height="74" decoding="async">';
  }

  function mobileHeaderLogoMarkup(config) {
    return '<img class="tsc-mobile-brand-logo tsc-mobile-brand-logo-unified" src="' + logoSrcForConfig(config) + '" alt="" width="166" height="44" decoding="async">';
  }

  function buildFooterLinks(group) {
    return '<div class="tsc-desktop-footer-group"><h3>' + escapeHtml(group[0]) + '</h3><div class="tsc-desktop-footer-links">' + group[1].map(function (link) {
      var external = link[2] ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + escapeHtml(link[0]) + '"' + external + '>' + escapeHtml(link[1]) + '</a>';
    }).join('') + '</div></div>';
  }

  function buildFooterStartHereBox(group) {
    if (!group) return '';
    return '<div class="tsc-desktop-footer-group"><h3>' + escapeHtml(group[0]) + '</h3><div class="tsc-desktop-footer-links">' + group[1].map(function (link) {
      var external = link[2] ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + escapeHtml(link[0]) + '"' + external + '>' + escapeHtml(link[1]) + '</a>';
    }).join('') + '</div></div>';
  }

  function buildFooterCopyrightUnderSocials(brandName) {
    return [
      '<div class="tsc-desktop-footer-meta">',
      '<p class="tsc-desktop-footer-copy">&copy; 2026 ' + escapeHtml(brandName) + '. All rights reserved.</p>',
      '</div>'
    ].join('');
  }

  function buildMobileFooterCopyrightUnderSocials(brandName) {
    return [
      '<div class="tsc-mobile-footer-bottom">',
      '<span>&copy; 2026 ' + escapeHtml(brandName) + '. All rights reserved.</span>',
      '</div>'
    ].join('');
  }

  function mountDesktopFooter(opts) {
    if (!ENABLE_CUSTOM_MOBILE_CHROME) {
      unmountCustomMobileChrome();
      return null;
    }
    var desktop = !window.matchMedia || window.matchMedia('(min-width: 1025px)').matches;
    var existing = document.querySelector('.tsc-desktop-footer');
    if (!desktop) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('tsc-has-desktop-footer');
      return null;
    }

    markLegacyFooters();
    var config = componentOptions(opts);
    var variant = config.academy ? 'academy' : 'main';
    if (existing && existing.dataset.tscVariant === variant) {
      document.body.classList.add('tsc-has-desktop-footer');
      suppressNativeWixFooters();
      return existing;
    }
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var sourceFooter = findSiteFooter();
    var footer = ensureSharedFooterHost();
    footer.classList.remove('tsc-legacy-footer-host');

    var socials = [
      { id: 'instagram', aria: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective/', needle: 'instagram' },
      { id: 'whatsapp', aria: 'WhatsApp', href: config.whatsapp, needle: 'whatsapp' },
      { id: 'youtube', aria: 'YouTube', href: 'https://youtube.com/@theshakticollective', needle: 'youtube' },
      { id: 'facebook', aria: 'Facebook', href: 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/', needle: 'facebook' },
      { id: 'linkedin', aria: 'LinkedIn', href: LINKEDIN_URL, needle: 'linkedin' },
      { id: 'email', aria: 'Email', href: 'mailto:' + CONTACT_EMAIL, needle: 'mailto:' }
    ].map(function (s) {
      var scraped = scrapeFooterSocialHref(sourceFooter, s.needle, s.href);
      // Prefer canonical LinkedIn / contact email over stale Wix scraped URLs.
      var href = s.id === 'linkedin' ? LINKEDIN_URL
        : s.id === 'email' ? ('mailto:' + CONTACT_EMAIL)
          : scraped;
      return {
        id: s.id,
        aria: s.aria,
        href: href,
        svg: scrapeFooterSvgMarkup(sourceFooter, s.needle, SOCIAL_SVGS[s.id])
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var baseGroups = footerGroupsFor(config.academy, config.whatsapp);
    var startGroup = baseGroups.find(function (group) {
      return /^start here$/i.test(group[0]);
    });
    // Start Here is a nav column (same title row as Quick Links / Explore); community = newsletter/social.
    var navGroups = baseGroups.filter(function (group) {
      return !/start here|join our community|get started/i.test(group[0]);
    });
    var emailId = 'tsc-desktop-footer-email-' + variant;
    var shell = document.createElement('div');
    shell.className = 'tsc-desktop-footer' + (config.academy ? ' tsc-desktop-footer-academy' : '');
    shell.dataset.tscComponent = 'shared-footer';
    shell.dataset.tscVariant = variant;
    shell.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'dark');
    var logoMarkup = legacyFooterLogoMarkup(config, brandName, sourceFooter);
    shell.innerHTML = [
      '<div class="tsc-desktop-footer-main">',
      '<div class="tsc-desktop-footer-brandblock">',
      '<a class="tsc-desktop-footer-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
      logoMarkup,
      '</a>',
      '<p class="tsc-desktop-footer-tagline">' + escapeHtml(config.brand.tagline || (config.academy ? 'Mentorship-led learning for serious artists.' : 'Unfolding Artist Force .')) + '</p>',
      '</div>',
      buildFooterStartHereBox(startGroup),
      '<nav class="tsc-desktop-footer-nav" aria-label="Footer navigation">',
      navGroups.map(buildFooterLinks).join(''),
      '</nav>',
      '<div class="tsc-desktop-footer-news">',
      '<h2>' + (config.academy ? 'Join Our Community' : 'Join Our Community') + '</h2>',
      '<p>Subscribe to our Newsletter *</p>',
      '<form class="tsc-desktop-footer-newsrow" action="#" method="post" data-source="footer">',
      '<label class="tsc-sr-only" for="' + emailId + '">Email</label>',
      '<input id="' + emailId + '" name="email" type="email" autocomplete="email" required placeholder="example@domain.com">',
      '<button type="submit" aria-label="Subscribe"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>',
      '</form>',
      '<p class="tsc-desktop-footer-newsnote" role="status" hidden>Thanks, you are on the list.</p>',
      '<div class="tsc-desktop-footer-social">',
      socials.map(function (s) {
        return '<a class="tsc-desktop-footer-icon" data-tsc-social-id="' + escapeHtml(s.id) + '" href="' + escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(s.aria) + '">' + s.svg + '</a>';
      }).join(''),
      '</div>',
      buildFooterCopyrightUnderSocials(brandName),
      '</div>',
      '</div>'
    ].join('');

    footer.insertBefore(shell, footer.firstChild);
    Array.prototype.slice.call(footer.children).forEach(function (child) {
      if (child !== shell && !child.classList.contains('tsc-mobile-footer')) {
        child.classList.add('tsc-legacy-footer');
        child.setAttribute('aria-hidden', 'true');
        child.style.setProperty('display', 'none', 'important');
        child.style.setProperty('visibility', 'hidden', 'important');
        child.style.setProperty('height', '0', 'important');
        child.style.setProperty('min-height', '0', 'important');
        child.style.setProperty('max-height', '0', 'important');
        child.style.setProperty('overflow', 'hidden', 'important');
        child.style.setProperty('pointer-events', 'none', 'important');
        child.style.setProperty('margin', '0', 'important');
        child.style.setProperty('padding', '0', 'important');
      }
    });
    document.body.classList.add('tsc-has-desktop-footer');
    suppressNativeWixFooters();
    var form = shell.querySelector('.tsc-desktop-footer-newsrow');
    bindNewsletterSubmit(form, shell);
    hydrateReferenceFooterAssets(shell, config, sourceFooter);
    return shell;
  }

  function mountMobileFooter(opts) {
    if (!ENABLE_CUSTOM_MOBILE_CHROME) {
      unmountCustomMobileChrome();
      return null;
    }
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var existing = document.querySelector('.tsc-mobile-footer');
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('tsc-has-mobile-footer');
      return null;
    }

    markLegacyFooters();
    var config = componentOptions(opts);
    var variant = config.academy ? 'academy' : 'main';
    if (existing && existing.dataset.tscVariant === variant) {
      document.body.classList.add('tsc-has-mobile-footer');
      suppressNativeWixFooters();
      return existing;
    }
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var sourceFooter = findSiteFooter();
    var footer = ensureSharedFooterHost();
    footer.classList.remove('tsc-legacy-footer-host');

    var socials = [
      { id: 'instagram', aria: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective/', needle: 'instagram' },
      { id: 'whatsapp', aria: 'WhatsApp', href: config.whatsapp, needle: 'whatsapp' },
      { id: 'youtube', aria: 'YouTube', href: 'https://youtube.com/@theshakticollective', needle: 'youtube' },
      { id: 'facebook', aria: 'Facebook', href: 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/', needle: 'facebook' },
      { id: 'linkedin', aria: 'LinkedIn', href: LINKEDIN_URL, needle: 'linkedin' },
      { id: 'email', aria: 'Email', href: 'mailto:' + CONTACT_EMAIL, needle: 'mailto:' }
    ].map(function (s) {
      var scraped = scrapeFooterSocialHref(sourceFooter, s.needle, s.href);
      var href = s.id === 'linkedin' ? LINKEDIN_URL
        : s.id === 'email' ? ('mailto:' + CONTACT_EMAIL)
          : scraped;
      return {
        id: s.id,
        aria: s.aria,
        href: href,
        svg: scrapeFooterSvgMarkup(sourceFooter, s.needle, SOCIAL_SVGS[s.id])
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var emailId = 'tsc-mobile-footer-email-' + variant;
    // Start Here stays in accordion columns; copyright only under socials.
    var mobileGroups = footerGroupsFor(config.academy, config.whatsapp).filter(function (group) {
      return !/get started/i.test(group[0]);
    });
    var shell = document.createElement('div');
    shell.className = 'tsc-mobile-footer' + (config.academy ? ' tsc-mobile-footer-academy' : '');
    shell.dataset.tscVariant = variant;
    shell.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'dark');
    shell.innerHTML = [
      '<div class="tsc-mobile-footer-brand">',
      mobileFooterLogoMarkup(config, brandName, sourceFooter),
      '</div>',
      mobileGroups.map(function (group, index) {
        return '<details class="tsc-mobile-footer-acc"' + (index === 0 ? ' open' : '') + '><summary>' + escapeHtml(group[0]) + '</summary><div class="tsc-mobile-footer-links">' + group[1].map(function (link) {
          var external = link[2] ? ' target="_blank" rel="noopener noreferrer"' : '';
          return '<a href="' + escapeHtml(link[0]) + '"' + external + '>' + escapeHtml(link[1]) + '</a>';
        }).join('') + '</div></details>';
      }).join(''),
      '<div class="tsc-mobile-footer-news">',
      '<h4>' + (config.academy ? 'Academy updates' : 'Subscribe to our newsletter') + '</h4>',
      '<p>Apply to newsletter</p>',
      '<form class="tsc-mobile-footer-newsrow" action="#" method="post">',
      '<label class="tsc-sr-only" for="' + emailId + '">Email</label>',
      '<input id="' + emailId + '" name="email" type="email" autocomplete="email" required placeholder="email@domain.com">',
      '<button type="submit" aria-label="Subscribe"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></button>',
      '</form>',
      '<p class="tsc-mobile-footer-newsnote" role="status" hidden>Thanks, you are on the list.</p>',
      '</div>',
      '<div class="tsc-mobile-footer-social">',
      socials.map(function (s) {
        return '<a class="tsc-mobile-footer-icon" data-tsc-social-id="' + escapeHtml(s.id) + '" href="' + escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(s.aria) + '">' + s.svg + '</a>';
      }).join(''),
      '</div>',
      buildMobileFooterCopyrightUnderSocials(brandName)
    ].join('');

    footer.insertBefore(shell, footer.firstChild);
    Array.prototype.slice.call(footer.children).forEach(function (child) {
      if (child !== shell && !child.classList.contains('tsc-desktop-footer')) {
        child.classList.add('tsc-legacy-footer');
        child.setAttribute('aria-hidden', 'true');
        child.style.setProperty('display', 'none', 'important');
        child.style.setProperty('visibility', 'hidden', 'important');
        child.style.setProperty('height', '0', 'important');
        child.style.setProperty('min-height', '0', 'important');
        child.style.setProperty('max-height', '0', 'important');
        child.style.setProperty('overflow', 'hidden', 'important');
        child.style.setProperty('pointer-events', 'none', 'important');
        child.style.setProperty('margin', '0', 'important');
        child.style.setProperty('padding', '0', 'important');
      }
    });
    document.body.classList.add('tsc-has-mobile-footer');
    suppressNativeWixFooters();
    var form = shell.querySelector('.tsc-mobile-footer-newsrow');
    bindNewsletterSubmit(form, shell);
    hydrateReferenceFooterAssets(shell, config, sourceFooter);
    return shell;
  }

  function normalizeArtistLinks() {
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var text = anchor.textContent || '';
        if (url.pathname === '/query') {
          anchor.setAttribute('href', '/book-an-artist' + url.search + url.hash);
        }
      } catch (e) { }
    });
  }

  function normalizeAcademyLogoLinks() {
    var academyPaths = {
      '/academy': true,
      '/learn-with-tsc': true,
      '/the-heart-of-composition': true,
      '/roots-of-hindustani-classical': true,
      '/music-production': true,
      '/book-a-call': true,
      '/masterclass-review01': true,
      '/masterclass-review02': true,
      '/classicalreview': true
    };
    if (!academyPaths[location.pathname]) return;
    document.querySelectorAll('header a[href], [class*="wixui-header"] a[href]').forEach(function (anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var isHomeLink = url.pathname === '/' || url.pathname === '/blank-3';
        var isLogo = !!anchor.closest('.wixui-vector-image, [class*="wixui-vector-image"]');
        if (isHomeLink && isLogo) {
          anchor.setAttribute('href', '/academy');
          anchor.setAttribute('target', '_self');
        }
      } catch (e) { }
    });
  }

  function configureVideoPlayer(video) {
    if (!video) return;
    video.controls = true;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.volume = 0;
    video.setAttribute('controls', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.removeAttribute('crossorigin');

    try {
      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(function () { });
      }
    } catch (e) { }

    var wrapper = video.closest('wix-video, wix-media-canvas, [id*="videoContainer"], .LH0J3M') || video.parentElement;
    if (wrapper) {
      wrapper.classList.add('tsc-native-video-player');
      wrapper.setAttribute('data-tsc-native-video-player', '');
      wrapper.querySelectorAll('.IuQm4G, .uqsi3c, .JODVkC, .juFBxh, .QpcXUG, [data-audio], [aria-label*="Mute"], [aria-label*="Sound"]').forEach(function (control) {
        control.setAttribute('aria-hidden', 'true');
        control.setAttribute('tabindex', '-1');
        control.style.setProperty('display', 'none', 'important');
        control.style.setProperty('pointer-events', 'none', 'important');
      });
    }
  }

  function observeVideoPlayers() {
    if (!window.MutationObserver || window.__tscVideoPlayerObserver) return;
    window.__tscVideoPlayerObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (!node || node.nodeType !== 1) return;
          if (node.tagName === 'VIDEO') configureVideoPlayer(node);
          if (node.querySelectorAll) {
            node.querySelectorAll('video').forEach(configureVideoPlayer);
          }
        });
      });
    });
    window.__tscVideoPlayerObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function muteVideos() {
    document.querySelectorAll('video').forEach(configureVideoPlayer);
    observeVideoPlayers();
    document.querySelectorAll('[data-audio], [aria-label*="Mute"], [aria-label*="Sound"]').forEach(function (node) {
      node.setAttribute('data-audio', 'off');
    });
  }

  function patchMutedPlay() {
    if (!window.HTMLMediaElement || window.__tscMutedPlayPatch) return;
    window.__tscMutedPlayPatch = true;
    var originalPlay = window.HTMLMediaElement.prototype.play;
    window.HTMLMediaElement.prototype.play = function () {
      this.muted = true;
      this.defaultMuted = true;
      this.volume = 0;
      this.setAttribute('muted', '');
      if (this.tagName === 'VIDEO') configureVideoPlayer(this);
      return originalPlay.apply(this, arguments);
    };
  }

  function applyOnSchedule(callback) {
    callback();
    window.addEventListener('load', callback);
    [250, 1000, 2500, 5000].forEach(function (delay) {
      window.setTimeout(callback, delay);
    });
  }

  window.TSCComponents = {
    applyOnSchedule: applyOnSchedule,
    bindLocalSubmit: bindLocalSubmit,
    getRecommendedCourse: getRecommendedCourse,
    normalizeInternalProtocolRelativeLinks: normalizeInternalProtocolRelativeLinks,
    ensureScript: ensureScript,
    ensureStylesheet: ensureStylesheet,
    escapeHtml: escapeHtml,
    formMarkup: formMarkup,
    hideElement: hideElement,
    isAcademyPath: isAcademyPath,
    mountFormInto: mountFormInto,
    mountDesktopFooter: mountDesktopFooter,
    mountDesktopHeader: mountDesktopHeader,
    mountMobileFooter: mountMobileFooter,
    mountMobileHeader: mountMobileHeader,
    mountStandaloneForm: mountStandaloneForm,
    configureVideoPlayer: configureVideoPlayer,
    muteVideos: muteVideos,
    normalizeAcademyLogoLinks: normalizeAcademyLogoLinks,
    normalizeArtistLinks: normalizeArtistLinks,
    normalizeNewsletter: normalizeNewsletter,
    patchMutedPlay: patchMutedPlay,
    renderAcademyNav: renderAcademyNav,
    setImage: setImage,
    setText: setText,
    slug: slug,
    updateButton: updateButton,
    wireMobileAssets: wireMobileAssets
  };
  function wireCourseAccordions() {
    var path = canonicalPathname();
    if (!LEARN_DATA_PAGE[path]) return;
    ensureScript('/js/tsc-course-accordion.js', function () {
      if (window.TSCCourseAccordion && window.TSCCourseAccordion.init) {
        window.TSCCourseAccordion.init();
      }
    });
  }

  /** Legacy duplicate hub → canonical /academy (local preview + stale caches). */
  function mobileCourseList(items) {
    return '<ul>' + (items || []).map(function (item) {
      return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
  }

  function mountMobileCoursePage(path) {
    var route = path || canonicalPathname();
    var data = MOBILE_COURSE_PAGES[route];
    var mobile = !window.matchMedia || window.matchMedia('(max-width: 1024px)').matches;
    var renderCourseShell = data && (mobile || route === '/course-bundle');
    var existing = document.querySelector('.tsc-mobile-course-page');
    if (!renderCourseShell) {
      document.body.classList.remove('tsc-mobile-course-rendered');
      if (existing) existing.remove();
      return;
    }
    var main = document.querySelector('main[data-main-content-parent="true"], main, #SITE_PAGES');
    if (!main) return;
    var checkoutHref = data.checkout || COURSE_CHECKOUT_URL;
    var marqueeItem = '<a href="' + escapeHtml(checkoutHref) + '" target="_blank" rel="noreferrer noopener">' +
      '<span>Enroll Now</span>' +
      '<img src="/assets/brand/tsc-shankha-cream.png" alt="" aria-hidden="true">' +
      '</a>';
    var marqueeMarkup = [1, 2].map(function () {
      return '<div class="tsc-mobile-course-marquee-track">' + Array(8).fill(marqueeItem).join('') + '</div>';
    }).join('');

    var html = [
      '<section class="tsc-mobile-course-page" data-tsc-mobile-course="' + escapeHtml(route) + '">',
      '<div class="tsc-mobile-course-marquee">' + marqueeMarkup + '</div>',
      '<article class="tsc-mobile-course-hero-card">',
      '<p class="tsc-mobile-course-kicker">Course ' + escapeHtml(data.number) + '</p>',
      '<h1>' + escapeHtml(data.title) + '</h1>',
      '<p class="tsc-mobile-course-mentor">Mentor: <strong>' + escapeHtml(data.mentor) + '</strong></p>',
      '<figure><img src="' + escapeHtml(data.image) + '" alt="' + escapeHtml(data.imageAlt) + '"></figure>',
      '<p class="tsc-mobile-course-intro">' + escapeHtml(data.intro) + '</p>',
      '<div class="tsc-mobile-course-stats">' + data.stats.map(function (stat) {
        return '<span>' + escapeHtml(stat) + '</span>';
      }).join('') + '</div>',
      '<a class="tsc-mobile-course-enroll" href="' + escapeHtml(checkoutHref) + '" target="_blank" rel="noreferrer noopener">Enroll Now</a>',
      '</article>',
      '<section class="tsc-mobile-course-section">',
      '<h2>What You Will Learn</h2>',
      mobileCourseList(data.learn),
      '</section>',
      '<section class="tsc-mobile-course-section tsc-mobile-course-section-dark">',
      '<h2>Outcomes</h2>',
      mobileCourseList(data.outcomes),
      '</section>',
      '<section class="tsc-mobile-course-section">',
      '<h2>Explore More Courses</h2>',
      '<div class="tsc-mobile-course-links">',
      ACADEMY_COURSE_ITEMS.map(function (item) {
        return [
          '<article class="tsc-mobile-course-link-card">',
          '<a class="tsc-mobile-course-link-title" href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a>',
          '<a class="tsc-mobile-course-link-enroll" href="' + escapeHtml(courseCheckoutHref(item.href)) + '" target="_blank" rel="noreferrer noopener">Enroll Now</a>',
          '</article>'
        ].join('');
      }).join(''),
      '</div>',
      '</section>',
      '</section>'
    ].join('');

    if (existing) {
      if (existing.getAttribute('data-tsc-mobile-course') !== route) existing.outerHTML = html;
    } else {
      main.insertAdjacentHTML('afterbegin', html);
    }
    document.body.classList.add('tsc-mobile-course-rendered');
  }

  function redirectLegacyLearnHub() {
    var path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    if (
      path === '/learn-with-tsc' ||
      path === '/academy/learn-with-tsc' ||
      path === '/pages/learn-with-tsc' ||
      path === '/pages/learn-with-tsc.html'
    ) {
      location.replace('/academy' + (location.search || '') + (location.hash || ''));
      return true;
    }
    return false;
  }

  /** Wix viewer-model can rehydrate Courses → /learn-with-tsc after our rewrite. */
  function forceLearnHubLinksToAcademy() {
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var raw = anchor.getAttribute('href') || '';
      if (!/learn-with-tsc|blank-3-1/i.test(raw)) return;
      try {
        var url = new URL(raw, location.origin);
        var leaf = url.pathname.replace(/\/+$/, '');
        if (
          leaf === '/learn-with-tsc' ||
          leaf === '/academy/learn-with-tsc' ||
          leaf === '/pages/learn-with-tsc' ||
          leaf === '/pages/learn-with-tsc.html' ||
          leaf === '/blank-3-1'
        ) {
          anchor.setAttribute('href', '/academy' + url.search + url.hash);
        }
      } catch (e) { }
    });
  }

  function wireLearnHubClickGuard() {
    if (window.__tscLearnHubGuard) return;
    window.__tscLearnHubGuard = true;
    document.addEventListener('click', function (event) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
      if (!anchor || anchor.target === '_blank') return;
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var leaf = url.pathname.replace(/\/+$/, '');
        if (
          leaf === '/learn-with-tsc' ||
          leaf === '/academy/learn-with-tsc' ||
          leaf === '/pages/learn-with-tsc' ||
          leaf === '/pages/learn-with-tsc.html' ||
          leaf === '/blank-3-1'
        ) {
          event.preventDefault();
          event.stopPropagation();
          location.assign('/academy' + url.search + url.hash);
        }
      } catch (e) { }
    }, true);
  }

  /** Courses / Testimonials nav hashes — markers keep Wix section IDs intact. */
  function ensureAcademySectionAnchor(id, sectionSelector, opts) {
    if (canonicalPathname() !== '/academy') return;
    if (document.getElementById(id)) return;
    var section = document.querySelector(sectionSelector);
    if (!section || !section.parentNode) return;
    var marker = document.createElement('div');
    marker.id = id;
    marker.setAttribute('aria-hidden', 'true');
    var inside = opts && opts.inside;
    if (inside) {
      // Grid siblings can reorder visually — pin marker to section top edge.
      if (window.getComputedStyle(section).position === 'static') {
        section.style.setProperty('position', 'relative');
      }
      marker.style.cssText =
        'height:0;width:0;overflow:hidden;position:absolute;top:0;left:0;scroll-margin-top:96px;pointer-events:none;';
      section.insertBefore(marker, section.firstChild);
      return;
    }
    marker.style.cssText = 'height:0;width:0;overflow:hidden;position:relative;scroll-margin-top:96px;';
    section.parentNode.insertBefore(marker, section);
  }

  function ensureAcademyCoursesAnchor() {
    ensureAcademySectionAnchor('courses', '#comp-mpjvjuos, #comp-mpjvo1xd');
  }

  function ensureAcademyTestimonialsAnchor() {
    if (canonicalPathname() !== '/academy') return;
    var section = document.querySelector('#comp-mpl384rr');
    if (!section) return;
    var existing = document.getElementById('testimonials');
    if (existing && section.contains(existing)) return;
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    ensureAcademySectionAnchor('testimonials', '#comp-mpl384rr', { inside: true });
  }

  function academyHashScrollTarget(hash) {
    if (!hash || hash.charAt(0) !== '#') return null;
    var id = hash.slice(1);
    if (!id) return null;
    if (id === 'testimonials') {
      return document.getElementById('comp-mpl384rr') || document.getElementById('testimonials');
    }
    if (id === 'courses') {
      return document.getElementById('comp-mpjvjuos') || document.getElementById('courses');
    }
    return document.getElementById(id);
  }

  function scrollAcademyHash(hash) {
    var el = academyHashScrollTarget(hash);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  /** In-page Academy hash nav (Testimonials) — Wix clicks can eat hash scroll. */
  function wireAcademyHashNavGuard() {
    if (window.__tscAcademyHashNavGuard) return;
    window.__tscAcademyHashNavGuard = true;
    document.addEventListener(
      'click',
      function (event) {
        if (event.defaultPrevented || event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!anchor || anchor.target === '_blank') return;
        try {
          var url = new URL(anchor.getAttribute('href'), location.origin);
          if (url.origin !== location.origin) return;
          var path = url.pathname.replace(/\/+$/, '') || '/';
          var here = canonicalPathname();
          if (!url.hash) return;
          if (path === '/academy' && here !== '/academy') return;
          if (path !== '/academy' && path !== here) return;
          ensureAcademyCoursesAnchor();
          ensureAcademyTestimonialsAnchor();
          if (!scrollAcademyHash(url.hash)) return;
          event.preventDefault();
          event.stopPropagation();
          if (here === '/academy' && location.hash !== url.hash) {
            history.replaceState(null, '', '/academy' + (location.search || '') + url.hash);
          }
          // Remount storms can nudge layout — re-assert scroll.
          window.setTimeout(function () {
            scrollAcademyHash(url.hash);
          }, 350);
          window.setTimeout(function () {
            scrollAcademyHash(url.hash);
          }, 900);
        } catch (e) { }
      },
      true
    );
    window.addEventListener('hashchange', function () {
      if (canonicalPathname() !== '/academy') return;
      ensureAcademyCoursesAnchor();
      ensureAcademyTestimonialsAnchor();
      scrollAcademyHash(location.hash || '');
    });
  }

  /* Critical desktop nav lock BEFORE any header mount (stops size/colour flash). */
  ensureStylesheet('/css/tsc-nav-overrides.css?v=nav-restore-links-1');
  ensureStylesheet('/css/tsc-responsive.css?v=yugm-hero-exact-1');
  ensureStylesheet('/css/pages/yugm-fixes.css?v=yugm-hero-exact-1');
  ensureStylesheet('/css/tsc-desktop-nav-lock.css?v=nav-lock-noop-1');
  ensureStylesheet('/css/tsc-brand-card.css');
  ensureScript('/js/tsc-brand-cards.js?v=films-card-copy-1');
  // Play paused Wix enter/loop motions + slideshow word-swap (all viewports).
  ensureStylesheet('/css/tsc-wix-motion.css?v=hero-word-single-1');
  ensureScript('/js/tsc-wix-motion.js?v=motion-replay-all-3');
  ensureScript('/js/tsc-wix-authored-motion.js?v=motion-payload-auto-3');
  function bootUi() {
    if (redirectLegacyLearnHub()) return;
    var path = canonicalPathname();
    setBodyPage(path);
    mountBlogChrome(path);
    var mountSharedChrome = function () {
      mountDesktopHeader({ path: path });
      mountDesktopFooter({ path: path });
      mountBlogChrome(path);
      mountMobileHeader({ path: path });
      mountMobileFooter({ path: path });
      if (usesNativeWixNav(path)) {
        ensurePrimaryWixNavVisible();
        ensureWixHeaderScrollAnimation();
        if (isAcademyPath(path)) {
          hideAcademyMainSiteHeaders();
          ensureAcademyCoursesInWixMenus();
        }
      } else if (isAcademyPath(path) || ACADEMY_COURSE_HREFS[path]) {
        ensureAcademyCoursesInWixMenus();
        var lockedHeader = document.querySelector('[data-tsc-locked-desktop-header="true"]');
        if (lockedHeader) {
          applyLockedDesktopActiveState(lockedHeader, componentOptions({ path: path }));
        }
      }
      linkHomeClosingCtas();
      ensureWixHeaderScrollAnimation();
    };
    wireLearnHubClickGuard();
    wireLockedArtistsDropdownClickGuard();
    wireLockedCoursesDropdownClickGuard();
    wireCoursesDropdownStayOpen();
    wireAcademyHashNavGuard();
    normalizeInternalProtocolRelativeLinks();
    repairAffiliateHeroImage(path);
    [350, 900, 1800, 3200].forEach(function (delay) {
      window.setTimeout(function () {
        repairAffiliateHeroImage(path);
      }, delay);
    });
    forceLearnHubLinksToAcademy();
    ensureAcademyCoursesAnchor();
    ensureAcademyTestimonialsAnchor();
    if (isAcademyPath(path) || ACADEMY_COURSE_HREFS[path]) {
      ensureAcademyCoursesInWixMenus();
    }
    if (path === '/academy' && location.hash) {
      window.setTimeout(function () {
        ensureAcademyCoursesAnchor();
        ensureAcademyTestimonialsAnchor();
        scrollAcademyHash(location.hash || '');
      }, 400);
      window.setTimeout(function () {
        scrollAcademyHash(location.hash || '');
      }, 1200);
    }
    // Form pages: load forms.css early (Wix widget + local form mobile layout)
    var formPages = {
      '/book-a-call': true,
      '/book-an-artist': true,
      '/artist-query': true,
      '/collab-query': true,
      '/query': true,
      '/affiliate': true,
      '/masterclass-review01': true,
      '/masterclass-review02': true,
      '/classicalreview': true
    };
    if (formPages[path]) {
      ensureStylesheet('/css/forms.css?v=form-picker-hitarea-3');
      ensureScript('/js/forms.js?v=form-picker-hitarea-3');
      watchWixChoiceState();
    }
    mountSharedChrome();
    mountMobileCoursePage(path);
    normalizeCourseCheckoutLinks(path);
    mountAcademyMobileBundleCard(path);
    linkHomeClosingCtas();
    mountHarshadDigitalPresenceLinks(path);
    mountYugmIplYearFix(path);
    mountYugmHeroMedia(path);
    mountYugmBandCardToggles(path);
    mountWorkImpactLinks(path);
    mountFilmsMobileAbout(path);
    mountFilmsMobileOriginals(path);
    mountFilmReportCards(path);
    mountFilmBottomCtas(path);
    if (path === '/about') {
      fixAboutHeroShellViewBox();
      [200, 800, 2000].forEach(function (delay) {
        window.setTimeout(fixAboutHeroShellViewBox, delay);
      });
    }
    [250, 900, 1800, 3200, 6000, 9000].forEach(function (delay) {
      window.setTimeout(function () {
        mountSharedChrome();
        mountMobileCoursePage(path);
        normalizeCourseCheckoutLinks(path);
        mountAcademyMobileBundleCard(path);
        linkHomeClosingCtas();
        mountHarshadDigitalPresenceLinks(path);
        mountYugmIplYearFix(path);
        mountYugmHeroMedia(path);
        mountYugmBandCardToggles(path);
        mountWorkImpactLinks(path);
        mountFilmsMobileAbout(path);
        mountFilmsMobileOriginals(path);
        mountFilmReportCards(path);
        mountFilmBottomCtas(path);
        if (path === '/about') fixAboutHeroShellViewBox();
      }, delay);
    });
    if ('MutationObserver' in window && !window.__tscSharedChromeObserver) {
      window.__tscSharedChromeObserver = new MutationObserver(function () {
        var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
        if (path === '/films') {
          window.clearTimeout(window.__tscFilmReportRepairTimer);
          window.__tscFilmReportRepairTimer = window.setTimeout(function () {
            mountFilmsMobileAbout(path);
            mountFilmsMobileOriginals(path);
            mountFilmReportCards(path);
            mountFilmBottomCtas(path);
          }, 80);
        }
        var nativeNav = usesNativeWixNav(path) && !compact;
        var missing = nativeNav
          ? !document.querySelector('.tsc-desktop-footer')
          : compact
            ? !document.querySelector('.tsc-mobile-site-header') || !document.querySelector('.tsc-mobile-footer')
            : !document.querySelector('[data-tsc-locked-desktop-header="true"], .tsc-desktop-site-header') ||
            !document.querySelector('.tsc-desktop-brand-logo-unified') ||
            !document.querySelector('.tsc-desktop-footer');
        if (!missing) return;
        window.clearTimeout(window.__tscSharedChromeRepairTimer);
        window.__tscSharedChromeRepairTimer = window.setTimeout(function () {
          mountSharedChrome();
          mountFilmsMobileAbout(path);
          mountFilmsMobileOriginals(path);
          mountFilmReportCards(path);
          mountFilmBottomCtas(path);
        }, 40);
      });
      window.__tscSharedChromeObserver.observe(document.body, { childList: true, subtree: true });
    }
    if (path === '/resources') {
    }
    if (path === '/academy' || path === '/learn-with-tsc') {
    }
    wireMobileAssets();
    if (window.matchMedia && !window.__tscMobileMqBound) {
      window.__tscMobileMqBound = true;
      var mobileMq = window.matchMedia('(max-width: 1024px)');
      var onMq = function () {
        if (mobileMq.matches) {
          window.__tscMobileWired = false;
          wireMobileAssets();
          mountMobileCoursePage(canonicalPathname());
          mountAcademyMobileBundleCard(canonicalPathname());
        } else {
          mountMobileCoursePage(canonicalPathname());
          mountAcademyMobileBundleCard(canonicalPathname());
        }
      };
      if (mobileMq.addEventListener) mobileMq.addEventListener('change', onMq);
      else if (mobileMq.addListener) mobileMq.addListener(onMq);
    }
    if (path === '/artist-path') {
      mountDesktopFooter({ path: '/artist-path' });
    }
    wireCourseAccordions();
    watchLinkNormalization();
    [400, 1500, 3000].forEach(function (delay) {
      window.setTimeout(function () {
        normalizeInternalProtocolRelativeLinks();
        forceLearnHubLinksToAcademy();
      }, delay);
    });
  }
  if (document.body) {
    bootUi();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootUi);
  } else {
    bootUi();
  }
})();
