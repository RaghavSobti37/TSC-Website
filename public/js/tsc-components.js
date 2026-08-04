/*
 * DESKTOP DESIGN LOCK — PERMANENT. Desktop (>=1025px) of the 9 primary pages is locked to commit faf9dea.
 * This script must NOT alter desktop rendering of those pages. Mobile-only behavior must be guarded by
 * matchMedia('(max-width: 1024px)'). Never change desktop unless the site owner explicitly asks.
 */
(function() {
  var ENABLE_CUSTOM_MOBILE_CHROME = true;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function slug(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function ensureStylesheet(href) {
    if (!document.querySelector('link[href="' + href + '"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

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
      script.addEventListener('load', function() {
        script.dataset.tscLoaded = 'true';
        onload();
      });
    }
    (document.body || document.head).appendChild(script);
    return script;
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
      '/IaS1GaJT7Gp7ufxHIjDkZu': 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu',
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
    document.querySelectorAll('a[href]').forEach(function(anchor) {
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

  function mountYugmIplYearFix(path) {
    if (path !== '/yugm') return;
    var timelineYears = [
      ['#comp-mqhqa70a .wixui-rich-text__text', '2025'],
      ['#comp-mqhqa70h3 .wixui-rich-text__text', '2023']
    ];
    timelineYears.forEach(function(item) {
      var year = document.querySelector(item[0]);
      if (year && year.textContent !== item[1]) {
        year.textContent = item[1];
      }
    });
    document.querySelectorAll('#comp-mqhqa7081 .wixui-rich-text__text, #comp-mqhqa70f5 .wixui-rich-text__text').forEach(function(node) {
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
    ].map(function(item) {
      return {
        key: item.key,
        group: document.querySelector(item.group),
        image: document.querySelector(item.image)
      };
    });
    if (timelineItems.some(function(item) { return !item.group || !item.image; })) return;
    timelineItems.forEach(function(item) {
      item.group.style.removeProperty('translate');
      item.image.style.removeProperty('translate');
    });
    var textSlots = timelineItems.map(function(item) {
      return item.group.getBoundingClientRect().top;
    }).sort(function(a, b) { return a - b; });
    var imageSlots = timelineItems.map(function(item) {
      return item.image.getBoundingClientRect().top;
    }).sort(function(a, b) { return a - b; });
    timelineItems.forEach(function(item, index) {
      var textDelta = Math.round(textSlots[index] - item.group.getBoundingClientRect().top);
      var imageDelta = Math.round(imageSlots[index] - item.image.getBoundingClientRect().top);
      item.group.style.setProperty('translate', '0 ' + textDelta + 'px', 'important');
      item.image.style.setProperty('translate', '0 ' + imageDelta + 'px', 'important');
      item.group.setAttribute('data-tsc-yugm-timeline-order', String(index + 1));
      item.image.setAttribute('data-tsc-yugm-timeline-order', String(index + 1));
    });
  }

  function mountWorkImpactLinks(path) {
    if (path !== '/work') return;
    var reports = [
      { label: 'Mai Bhi Artist', href: '/mba' },
      { label: 'Havells mYOUsic', href: '/havells-myousic' },
      { label: 'Insta Music League', href: '/insta-music-league' },
      { label: 'Young Gunns', href: '/young-gunns' }
    ];
    var textNodes = Array.prototype.slice.call(document.querySelectorAll('.wixui-rich-text, [data-testid="richTextElement"], h1, h2, h3, p'));

    function visibleRect(node) {
      var rect = node && node.getBoundingClientRect && node.getBoundingClientRect();
      return rect && rect.width > 1 && rect.height > 1 ? rect : null;
    }

    function findTitle(label) {
      return textNodes.filter(function(node) {
        return (node.textContent || '').indexOf(label) !== -1 && visibleRect(node);
      }).sort(function(a, b) {
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
      candidates.sort(function(a, b) {
        if (a.hasButton !== b.hasButton) return a.hasButton ? -1 : 1;
        return a.area - b.area;
      });
      return candidates[0] && candidates[0].node;
    }

    reports.forEach(function(report) {
      var title = findTitle(report.label);
      var card = title && findCard(title, report.label);
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
      if (card.getAttribute('data-tsc-work-report-wired') === 'true') return;
      card.setAttribute('data-tsc-work-report-wired', 'true');
      card.addEventListener('click', function(event) {
        if (event.defaultPrevented) return;
        if (event.target && event.target.closest && event.target.closest('a[href]')) return;
        window.location.assign(report.href);
      });
      card.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(report.href);
      });
    });
  }

  function mountFilmReportCards(path) {
    if (path !== '/films') return;
    var cards = [
      {
        root: '#comp-mqmi3w3o',
        href: '/mahavatar-narsimha',
        title: 'Mahaavatar Narsimha',
        titleSelector: '#comp-mqmi3w46',
        badgesSelector: '#comp-mqmi3w484',
        blurbSelector: '#comp-mqmi3w4a',
        labelSelector: '#comp-mqmi3w4k',
        nameSelector: '#comp-mqmi3w4l3',
        meta: ['Animated Feature', 'Cultural Positioning', 'Audience Building', 'Long-Term IP Growth'],
        metaSelectors: ['#comp-mqmi3w3v3', '#comp-mqmi3w3x2', '#comp-mqmi3w3z', '#comp-mqmi3w41'],
        badges: 'Mythology-Led Storytelling | Film Mounting | IP Strategy',
        blurb: 'A culturally rooted animated feature strategy built around audience development, mythology-led positioning, partnerships, monetisation and long-term IP growth.'
      },
      {
        root: '#comp-mqmi6ynt2',
        href: '/hanuman-ansh',
        title: 'Hanuman Ansh',
        titleSelector: '#comp-mqmi6yo71',
        badgesSelector: '#comp-mqmi6yo94',
        blurbSelector: '#comp-mqmi6yob',
        labelSelector: '#comp-mqmi6yol3',
        nameSelector: '#comp-mqmi6yom7',
        meta: ['Spiritual IP', 'Community Building', 'Faith-Led Story', 'Modern Audiences'],
        metaSelectors: ['#comp-mqmi6yny', '#comp-mqmi6ynz5', '#comp-mqmi6yo1', '#comp-mqmi6yo2'],
        badges: 'Spiritual Entertainment | Community Strategy | Cultural IP',
        blurb: 'A spiritual entertainment IP shaped to connect faith, story, community and contemporary audiences through culture-first positioning.'
      },
      {
        root: '#comp-mqmi8cxm2',
        href: '/mahaprbhu',
        title: 'Mahaprabhu Jagannath',
        titleSelector: '#comp-mqmi8cy13',
        badgesSelector: '#comp-mqmi8cy4',
        blurbSelector: '#comp-mqmi8cy52',
        labelSelector: '#comp-mqmi8cyf',
        nameSelector: '#comp-mqmi8cyg2',
        meta: ['Living Tradition', 'Devotional Story', 'Cultural Resonance', 'New-Gen Reach'],
        metaSelectors: ['#comp-mqmi8cxr2', '#comp-mqmi8cxt', '#comp-mqmi8cxu6', '#comp-mqmi8cxw'],
        badges: 'Devotional Culture | Community Context | Story Positioning',
        blurb: "A cultural resonance initiative for Lord Jagannath's living tradition, built around devotion, community and new-generation storytelling."
      },
      {
        root: '#comp-mqmi8sui',
        href: '/kalki',
        title: 'Kalki',
        titleSelector: '#comp-mqmi8suv6',
        badgesSelector: '#comp-mqmi8suy3',
        blurbSelector: '#comp-mqmi8sv0',
        labelSelector: '#comp-mqmi8sv51',
        nameSelector: '#comp-mqmi8sv66',
        meta: ['Future Mythology', 'Audience Strategy', 'Cultural Positioning', 'Franchise Potential'],
        metaSelectors: ['#comp-mqmi8sul4', '#comp-mqmi8sun1', '#comp-mqmi8suo6', '#comp-mqmi8suq'],
        badges: 'Ancient Imagination | Future Story | Strategic Positioning',
        blurb: 'A culture-forward storytelling initiative connecting ancient Indian imagination with modern audience engagement and franchise potential.'
      }
    ];

    function setText(selector, value) {
      var node = document.querySelector(selector);
      if (!node) return;
      var textNode = node.querySelector('.wixui-rich-text__text') || node;
      textNode.textContent = value;
    }

    cards.forEach(function(card) {
      var root = document.querySelector(card.root);
      if (!root) return;
      setText(card.titleSelector, card.title);
      setText(card.badgesSelector, card.badges);
      setText(card.blurbSelector, card.blurb);
      setText(card.labelSelector, 'Focus');
      setText(card.nameSelector, 'IMPACT REPORT');
      card.metaSelectors.forEach(function(selector, i) {
        setText(selector, card.meta[i]);
      });
      root.classList.add('tsc-film-report-card');
      root.setAttribute('role', 'link');
      root.setAttribute('tabindex', '0');
      root.setAttribute('aria-label', 'Open ' + card.title + ' impact report');
      root.setAttribute('data-tsc-film-report-link', card.href);
      Array.prototype.forEach.call(root.querySelectorAll('a'), function(anchor) {
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
      root.addEventListener('click', function(event) {
        if (event.defaultPrevented) return;
        window.location.assign(card.href);
      });
      root.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(card.href);
      });
    });
  }

  function mountFilmBottomCtas(path) {
    if (path !== '/films') return;
    var ctas = [
      { id: 'comp-mqmkrjnm', href: '/resources', label: 'Resources' },
      { id: 'comp-mqmkth8f', href: 'mailto:' + CONTACT_EMAIL, label: 'Email Us' }
    ];
    ctas.forEach(function(cta) {
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
      node.addEventListener('click', function(event) {
        if (event.defaultPrevented) return;
        window.location.assign(cta.href);
      });
      node.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(cta.href);
      });
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
    document.addEventListener('click', function(event) {
      var href = dropdownTarget(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
    document.addEventListener('keydown', function(event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      var href = dropdownTarget(event);
      if (!href) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(href);
    }, true);
  }

  function watchLinkNormalization() {
    if (window.__tscLinkNormalizationObserver || !window.MutationObserver || !document.body) return;
    window.__tscLinkNormalizationObserver = true;
    var scheduled = false;
    var observer = new MutationObserver(function(mutations) {
      var relevant = mutations.some(function(mutation) {
        if (mutation.type === 'attributes') return mutation.attributeName === 'href';
        return Array.prototype.some.call(mutation.addedNodes || [], function(node) {
          return node.nodeType === 1 && (node.matches && node.matches('a[href]') || node.querySelector && node.querySelector('a[href]'));
        });
      });
      if (!relevant || scheduled) return;
      scheduled = true;
      window.setTimeout(function() {
        scheduled = false;
        normalizeInternalProtocolRelativeLinks();
        normalizeArtistLinks();
        forceLearnHubLinksToAcademy();
      }, 120);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });
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

  var MOBILE_PAGE_CSS = {
    home: '/css/mobile/home.css',
    about: '/css/mobile/about.css?v=about-hero-img-sm-1',
    work: '/css/mobile/work.css',
    artists: '/css/mobile/artists.css',
    learn: '/css/mobile/learn.css',
    academy: '/css/mobile/academy.css',
    films: '/css/mobile/films.css?v=mobile-space-3',
    resources: '/css/mobile/resources.css',
    impact: '/css/mobile/impact-report.css'
  };

  var LEARN_PATHS = {
    '/roots-of-hindustani-classical': true,
    '/the-heart-of-composition': true,
    '/music-production': true,
    '/book-a-call': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };

  var ARTISTS_PATHS = {
    '/artists': true,
    '/harshad-duhita': true,
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
    '/impact-report': true
  };
  var FILMS_PATHS = {
    '/films': true,
    '/mahavatar-narsimha': true,
    '/hanuman-ansh': true,
    '/mahaprbhu': true,
    '/kalki': true
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

  var TSC_LOGO_SRC = '/assets/brand/tsc-logo-trim-nav.png';
  var ACADEMY_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-nav.png';
  var TSC_FOOTER_LOGO_SRC = '/assets/brand/tsc-logo-trim-footer.png';
  var ACADEMY_FOOTER_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-footer.png';
  var DEFAULT_BRAND_ASSETS = {
    main: {
      logo: TSC_LOGO_SRC,
      icon: '/assets/brand/tsc-favicon-32.png',
      touchIcon: '/assets/brand/tsc-apple-touch-icon.png',
      name: 'The Shakti Collective',
      tagline: 'Unfolding artist force.'
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

  function mobileCssBucket(path) {
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
    if (path === '/academy' || path === '/affiliate') return 'academy';
    if (IMPACT_PATHS[path]) return 'impact';
    if (WORK_PATHS[path]) return 'work';
    if (ARTISTS_PATHS[path]) return 'artists';
    if (LEARN_PATHS[path]) return 'learn';
    if (FILMS_PATHS[path]) return 'films';
    if (RESOURCES_PATHS[path]) return 'resources';
    return null;
  }

  function pageDatasetSlug(path) {
    if (LEARN_DATA_PAGE[path]) return 'learn-with-tsc';
    var base = pathBasename(path);
    // Semantic blog slugs keep blog-N mobile CSS / layout rules
    var dataPageAlias = {
      'start-making-music': 'blog-1',
      'online-music-course-worth-it': 'blog-2',
      'artist-release-playbook': 'blog-3',
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
    Array.prototype.forEach.call(nodes, function(node) {
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
      // Drop stale course-hub CSS if soft-nav left learn.css on /academy
      if (path === '/academy') {
        var stripLearnCss = function() {
          document.querySelectorAll('link[rel="stylesheet"][href*="/css/mobile/learn.css"]').forEach(function(link) {
            if (link.parentNode) link.parentNode.removeChild(link);
          });
        };
        stripLearnCss();
        [300, 1200].forEach(function(delay) {
          window.setTimeout(stripLearnCss, delay);
        });
      }
      // tsc-mobile-system.css @imports ./mobile/_tokens.css — no separate tokens link
      ensureStylesheet('/css/tsc-mobile-system.css?v=academy-one-2');
      var bucket = mobileCssBucket(path);
      if (bucket && MOBILE_PAGE_CSS[bucket]) {
        // ponytail: paths may already carry ?v= — don't double-append
        var href = MOBILE_PAGE_CSS[bucket];
        ensureStylesheet(href.indexOf('?') >= 0 ? href : href + '?v=academy-one-2');
      }
      injectStickyCta(path);
      // Keep cloned Wix chrome as baseline across breakpoints.
      // Custom mobile header/footer changed layout too far from source design.
      if (ENABLE_CUSTOM_MOBILE_CHROME) {
        mountDesktopFooter({ path: path });
        mountMobileHeader({ path: path });
        mountMobileFooter({ path: path });
        hideWixMobileNavChrome();
        // Re-assert after Thunderbolt hydration may re-show Wix menu.
        [400, 1200, 2500, 5000, 8000].forEach(function(delay) {
          window.setTimeout(function() {
            mountMobileHeader({ path: path });
            mountMobileFooter({ path: path });
            hideWixMobileNavChrome();
          }, delay);
        });
      } else {
        unmountCustomMobileChrome();
      }
      ensureScript('/js/tsc-mobile-system.js', function() {
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
      ensureScript('/js/content-replacements.js?v=work-cards-1');
      if (path === '/artists') {
        ensureScript('/js/tsc-artists-accordion.js', function() {
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
    } catch (e) {}
  }

  function unmountCustomMobileChrome() {
    document.querySelectorAll('.tsc-mobile-site-header, .tsc-mobile-footer, .tsc-desktop-footer').forEach(function(node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    document.body.classList.remove('tsc-has-mobile-footer', 'tsc-has-desktop-footer', 'tsc-has-mobile-chrome');
  }

  function optionMarkup(options, selected) {
    return ['<option value="">Select</option>'].concat((options || []).map(function(option) {
      return '<option value="' + escapeHtml(option) + '"' + (option === selected ? ' selected' : '') + '>' + escapeHtml(option) + '</option>';
    })).join('');
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
      return '<label class="' + cls + ' tsc-picker-field" for="' + id + '">' + label + '<span class="tsc-picker-shell tsc-date-picker"><span class="tsc-picker-icon" aria-hidden="true"></span><input id="' + id + '" name="' + name + '" type="date"' + required + ariaRequired + '></span></label>';
    }

    if (field.type === 'timeSelect') {
      return '<label class="' + cls + ' tsc-picker-field" for="' + id + '">' + label + '<span class="tsc-picker-shell tsc-time-picker"><span class="tsc-picker-icon" aria-hidden="true"></span><select id="' + id + '" name="' + name + '"' + required + ariaRequired + '>' + optionMarkup(field.options || []) + '</select></span></label>';
    }

    if (field.type === 'textarea') {
      return '<label class="' + cls + '" for="' + id + '">' + label + '<textarea id="' + id + '" name="' + name + '"' + required + ariaRequired + '></textarea></label>';
    }

    if (field.type === 'phoneCountry') {
      return '<div class="' + cls + '"><label for="' + id + '-phone">' + label + '</label><div class="tsc-phone-row"><select id="' + id + '-country" name="country-code">' + optionMarkup(shared.countryCodes, shared.defaultCountryCode || '+91 India') + '</select><input id="' + id + '-phone" name="' + name + '" type="tel"' + required + ariaRequired + '></div></div>';
    }

    if (field.type === 'checkboxes' || field.type === 'radios') {
      var inputType = field.type === 'checkboxes' ? 'checkbox' : 'radio';
      var choices = (field.options || []).map(function(option, index) {
        var choiceId = id + '-' + index;
        var choiceName = name + (inputType === 'checkbox' ? '[]' : '');
        return '<label class="tsc-choice" for="' + choiceId + '"><input id="' + choiceId + '" type="' + inputType + '" name="' + choiceName + '" value="' + escapeHtml(option) + '"' + (field.required && index === 0 ? required + ariaRequired : '') + '><span>' + escapeHtml(option) + '</span></label>';
      }).join('');
      return '<fieldset class="' + cls + ' tsc-choice-group"><legend>' + label + '</legend><div class="tsc-choices">' + choices + '</div></fieldset>';
    }

    return '<label class="' + cls + '" for="' + id + '">' + label + '<input id="' + id + '" name="' + name + '" type="' + escapeHtml(field.type || 'text') + '"' + required + ariaRequired + '></label>';
  }

  function formMarkup(def, name, shared) {
    return '<form class="tsc-local-form" data-tsc-form="' + name + '"><h2>' + escapeHtml(def.title) + '</h2><p class="tsc-required-note"><span class="tsc-required-mark" aria-hidden="true">*</span> Required</p><div class="tsc-form-grid">' + (def.fields || []).map(function(field) {
      return fieldMarkup(field, name, shared || {});
    }).join('') + '<div class="tsc-field tsc-field-full"><button class="tsc-submit" type="submit">Submit</button><p class="tsc-form-note" role="status">Thank you. Your details have been captured locally for this demo.</p></div></div></form>';
  }

  function formEndpoint(name) {
    return {
      bookCall: '/api/book-call',
      bookArtist: '/api/query',
      artistPath: '/api/artist-path',
      review01: '/api/reviews',
      review02: '/api/reviews02',
      classicalReview: '/api/reviews'
    }[name] || '';
  }

  function readFormValues(form) {
    var values = {};
    var data = new FormData(form);
    data.forEach(function(value, key) {
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

  function payloadForForm(name, values) {
    if (name === 'bookCall') {
      return {
        course: values['which-course-are-you-interested-in'],
        name: values['what-s-your-name'],
        phone: values['phone-whatsapp-number'],
        countryCode: values['country-code'],
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

  var ARTIST_PATH_WHATSAPP = 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu?mode=gi_t';

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
    ARTIST_PATH_COURSES.forEach(function(course) {
      course.keywords.forEach(function(kw) {
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
    } catch (e) {}
  }

  function bindLocalSubmit(form) {
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
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
        var body = await response.json().catch(function() { return {}; });
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
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      var button = form.querySelector('[type="submit"]');
      var input = form.querySelector('input[type="email"]');
      if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Sending...';
      }
      try {
        var response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ email: input && input.value, source: 'footer' })
        });
        var body = await response.json().catch(function() { return {}; });
        if (!response.ok || body.success !== true) throw new Error(body.error || body.message || 'Subscription failed');
        setFormStatus(shell || form, body.message || 'Thanks, you are on the list.', 'success');
        form.reset();
      } catch (error) {
        setFormStatus(shell || form, (error && error.message) || 'Could not subscribe. Please try again.', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = button.dataset.originalText || 'Subscribe';
        }
      }
    });
  }

  function mountFormInto(target, def, name, shared) {
    if (!target || target.dataset.tscFormMounted === name) return;
    target.dataset.tscFormMounted = name;
    var holder = document.createElement('div');
    holder.innerHTML = formMarkup(def, name, shared);
    var form = holder.firstElementChild;
    target.parentNode.insertBefore(form, target);
    target.hidden = true;
    target.style.display = 'none';
    bindLocalSubmit(form);
  }

  function mountStandaloneForm(target, def, name, shared) {
    if (!target || target.dataset.tscFormMounted === name) return;
    target.dataset.tscFormMounted = name;
    target.innerHTML = formMarkup(def, name, shared);
    bindLocalSubmit(target.querySelector('form'));
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
    node.querySelectorAll('a, button, [role="button"], [tabindex]').forEach(function(child) {
      child.setAttribute('tabindex', '-1');
      child.setAttribute('aria-hidden', 'true');
      if (child.tagName === 'A') child.removeAttribute('href');
    });
  }

  function normalizeNewsletter() {
    document.querySelectorAll('input[type="email"][name="email"]').forEach(function(input) {
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
      whatsapp: opts.whatsappCommunityUrl || 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu?mode=gi_t'
    };
  }

  function navLinksFor(academy) {
    if (academy) {
      return [
        ['/resources', 'Resources'],
        ['/academy#courses', 'Courses'],
        ['/academy', 'Testimonials'],
        ['/academy', 'Know More']
      ];
    }
    return [
      ['/about', 'About'],
      ['/work', 'Work'],
      ['/artists', 'Artists'],
      ['/artist-path', 'Artist Path'],
      ['/academy', 'Learn With TSC'],
      ['/films', 'Films'],
      ['/resources', 'Resources'],
      ['/academy', 'TSC Academy']
    ];
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
    var courseItems = [
      { href: '/music-production', label: 'A-Z of Music Production' },
      { href: '/the-heart-of-composition', label: 'The HeART of Composition' },
      { href: '/roots-of-hindustani-classical', label: 'Roots of Hindustani Classical' }
    ].map(function(item) {
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
        academyNavItemMarkup({ href: '/academy#know-more', key: 'know-more', label: 'Know More' }, activePage),
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
      academyNavItemMarkup({ href: '/academy#know-more', key: 'know-more', label: 'Know More' }, activePage),
      academyNavItemMarkup({ href: '/', key: 'main-site', label: 'MAIN WEBSITE', className: 'tsc-academy-main-site-link' }, activePage)
    ].join('');
  }

  function markLegacyHeaders() {
    document.querySelectorAll('header, #SITE_HEADER, [data-testid="siteHeader"]').forEach(function(header) {
      if (header.classList && header.classList.contains('tsc-desktop-site-header')) return;
      if (header.classList && header.classList.contains('tsc-mobile-site-header')) return;
      header.classList.add('tsc-legacy-header');
      header.setAttribute('aria-hidden', 'true');
    });
  }

  function activateLockedDesktopHeader() {
    var headers = Array.prototype.filter.call(
      document.querySelectorAll('header, #SITE_HEADER, [data-testid="siteHeader"]'),
      function(header) {
        return !header.classList.contains('tsc-desktop-site-header') &&
          !header.classList.contains('tsc-mobile-site-header');
      }
    );
    var expected = headers.find(function(header) {
      var style = window.getComputedStyle(header);
      var rect = header.getBoundingClientRect();
      return style.display !== 'none' && rect.width > 0 && rect.height > 0;
    }) || headers[0];
    if (!expected) return null;

    headers.forEach(function(header) {
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
    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var logoSrc = logoSrcForConfig(config);
    var homeHref = config.academy ? '/academy' : '/';
    var candidates = Array.prototype.filter.call(header.querySelectorAll('a'), function(link) {
      var rect = link.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0 && rect.left > 430) return false;
      return !!link.querySelector('img, svg, wix-vector-image, .wixui-vector-image') ||
        /shakti|academy|logo|brand/i.test(link.getAttribute('aria-label') || link.textContent || '');
    });
    var brandLink = candidates[0];
    if (!brandLink) return;
    brandLink.href = homeHref;
    brandLink.setAttribute('aria-label', brandName);
    brandLink.classList.add('tsc-desktop-brand-link');
    brandLink.dataset.tscBrandLogo = config.academy ? 'academy' : 'main';
    brandLink.innerHTML = '<img class="tsc-desktop-brand-logo tsc-desktop-brand-logo-unified" src="' + logoSrc + '" alt="' + escapeHtml(brandName) + '" width="' + (config.academy ? '270' : '205') + '" height="' + (config.academy ? '86' : '51') + '" decoding="async">';
  }

  function mountDesktopHeader(opts) {
    var desktop = !window.matchMedia || window.matchMedia('(min-width: 1025px)').matches;
    var existing = document.querySelector('.tsc-desktop-site-header');
    if (!desktop) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return null;
    }
    var config = componentOptions(opts);
    var variant = config.academy ? 'academy' : 'main';
    var activePage = opts && opts.activePage || academyActivePage(config.path);
    var locked = activateLockedDesktopHeader();
    if (locked) {
      syncLockedDesktopHeaderBrand(locked, config);
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
    var navMarkup = config.academy ? renderAcademyNav(activePage, false) : navLinksFor(false).map(function(item) {
      return '<a href="' + escapeHtml(item[0]) + '">' + escapeHtml(item[1]) + '</a>';
    }).join('');
    var header = document.createElement('header');
    header.className = 'tsc-desktop-site-header' + (config.academy ? ' tsc-desktop-site-header-academy' : '');
    header.dataset.tscVariant = variant;
    if (config.academy) header.dataset.tscActivePage = activePage;
    header.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'main');
    header.innerHTML = [
      '<a class="tsc-desktop-site-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
        '<img src="' + logoSrcForConfig(config) + '" alt="" width="205" height="51" decoding="async">',
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
      ['Join our community', [
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
    // Tablet + phone: Wix hamburger is broken 701–1024px — use TSC chrome through 1024.
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
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
    var mobileNavMarkup = config.academy ? renderAcademyNav(activePage, true) : navLinksFor(false).map(function(item) {
      return '<a href="' + escapeHtml(item[0]) + '">' + escapeHtml(item[1]) + '</a>';
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
      menu.querySelectorAll('nav a').forEach(function(link) {
        link.addEventListener('click', function() {
          menu.removeAttribute('open');
        });
      });
      document.addEventListener('click', function(event) {
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

  function findLegacyFooterSections() {
    return Array.prototype.slice.call(document.querySelectorAll('.wixui-footer, section, [data-testid="section-container"]')).filter(function(section) {
      if (section.closest('.tsc-desktop-footer, .tsc-mobile-footer')) return false;
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      var footerText = /©\s*2026\s*The Shakti Collective|All rights reserved/i.test(text);
      var legacyFooterCluster = /Quick Links/i.test(text) && /Join Our Community/i.test(text) && /Unfolding artist force/i.test(text);
      if (!section.classList.contains('wixui-footer') && !footerText && !legacyFooterCluster) return false;
      return !section.closest('.tsc-desktop-footer, .tsc-mobile-footer');
    });
  }

  function markLegacyFooters() {
    findLegacyFooterSections().forEach(function(section) {
      section.classList.add('tsc-legacy-footer');
      var parentFooter = section.closest('footer');
      if (parentFooter && !parentFooter.querySelector('.tsc-desktop-footer, .tsc-mobile-footer')) {
        parentFooter.classList.add('tsc-legacy-footer-host');
      }
    });
  }

  function logoSrcForConfig(config) {
    return config && config.academy ? ACADEMY_LOGO_SRC : TSC_LOGO_SRC;
  }

  function footerLogoSrcForConfig(config) {
    return config && config.academy ? ACADEMY_FOOTER_LOGO_SRC : TSC_FOOTER_LOGO_SRC;
  }

  function legacyFooterLogoMarkup(config, brandName, fallbackLogo) {
    return '<img class="tsc-desktop-footer-logo" src="' + footerLogoSrcForConfig(config) + '" alt="' + escapeHtml(brandName) + '" width="360" height="96" decoding="async">';
  }

  function mobileFooterLogoMarkup(config, brandName) {
    return '<img class="tsc-mobile-footer-logo" src="' + footerLogoSrcForConfig(config) + '" alt="' + escapeHtml(brandName) + '" width="168" height="56" decoding="async">';
  }

  function mobileHeaderLogoMarkup(config) {
    return '<img class="tsc-mobile-brand-logo tsc-mobile-brand-logo-unified" src="' + logoSrcForConfig(config) + '" alt="" width="160" height="40" decoding="async">';
  }

  function buildFooterLinks(group) {
    return '<div class="tsc-desktop-footer-group"><h3>' + escapeHtml(group[0]) + '</h3><div class="tsc-desktop-footer-links">' + group[1].map(function(link) {
      var external = link[2] ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a href="' + escapeHtml(link[0]) + '"' + external + '>' + escapeHtml(link[1]) + '</a>';
    }).join('') + '</div></div>';
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
    if (existing && existing.dataset.tscVariant === variant) return existing;
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
    ].map(function(s) {
      var scraped = scrapeFooterSocialHref(sourceFooter, s.needle, s.href);
      // Prefer canonical LinkedIn / contact email over stale Wix scraped URLs.
      var href = s.id === 'linkedin' ? LINKEDIN_URL
        : s.id === 'email' ? ('mailto:' + CONTACT_EMAIL)
        : scraped;
      return {
        aria: s.aria,
        href: href,
        svg: SOCIAL_SVGS[s.id]
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var baseGroups = footerGroupsFor(config.academy, config.whatsapp);
    var navGroups = baseGroups.filter(function(group) {
      return !/join our community|get started/i.test(group[0]);
    });
    var emailId = 'tsc-desktop-footer-email-' + variant;
    var shell = document.createElement('div');
    shell.className = 'tsc-desktop-footer' + (config.academy ? ' tsc-desktop-footer-academy' : '');
    shell.dataset.tscVariant = variant;
    shell.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'dark');
    var logoMarkup = legacyFooterLogoMarkup(config, brandName, config.brand.logo);
    shell.innerHTML = [
      '<div class="tsc-desktop-footer-main">',
        '<div class="tsc-desktop-footer-brandblock">',
          '<a class="tsc-desktop-footer-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
            logoMarkup,
          '</a>',
          '<p class="tsc-desktop-footer-tagline">' + escapeHtml(config.brand.tagline || (config.academy ? 'Mentorship-led learning for serious artists.' : 'Unfolding artist force.')) + '</p>',
          '<p class="tsc-desktop-footer-copy">&copy; 2026 ' + escapeHtml(brandName) + '. All rights reserved.</p>',
        '</div>',
        '<nav class="tsc-desktop-footer-nav" aria-label="Footer navigation">',
          navGroups.map(buildFooterLinks).join(''),
        '</nav>',
        '<div class="tsc-desktop-footer-news">',
          '<h2>' + (config.academy ? 'Join Our Community' : 'Join Our Community') + '</h2>',
          '<p>Subscribe to our Newsletter *</p>',
          '<form class="tsc-desktop-footer-newsrow" action="#" method="post">',
            '<label class="tsc-sr-only" for="' + emailId + '">Email</label>',
            '<input id="' + emailId + '" name="email" type="email" autocomplete="email" required placeholder="example@domain.com">',
            '<button type="submit">Subscribe</button>',
          '</form>',
          '<p class="tsc-desktop-footer-newsnote" role="status" hidden>Thanks, you are on the list.</p>',
          '<div class="tsc-desktop-footer-social">',
            socials.map(function(s) {
              return '<a class="tsc-desktop-footer-icon" href="' + escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(s.aria) + '">' + s.svg + '</a>';
            }).join(''),
          '</div>',
        '</div>',
      '</div>'
    ].join('');

    footer.insertBefore(shell, footer.firstChild);
    Array.prototype.slice.call(footer.children).forEach(function(child) {
      if (child !== shell && !child.classList.contains('tsc-mobile-footer')) {
        child.classList.add('tsc-legacy-footer');
      }
    });
    document.body.classList.add('tsc-has-desktop-footer');
    var form = shell.querySelector('.tsc-desktop-footer-newsrow');
    bindNewsletterSubmit(form, shell);
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
    if (existing && existing.dataset.tscVariant === variant) return existing;
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
    ].map(function(s) {
      var scraped = scrapeFooterSocialHref(sourceFooter, s.needle, s.href);
      var href = s.id === 'linkedin' ? LINKEDIN_URL
        : s.id === 'email' ? ('mailto:' + CONTACT_EMAIL)
        : scraped;
      return {
        aria: s.aria,
        href: href,
        svg: SOCIAL_SVGS[s.id]
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var emailId = 'tsc-mobile-footer-email-' + variant;
    var mobileActionGroup = ['Start Here', [
      ['/book-a-call', 'Book a Call'],
      ['/book-an-artist', 'Book an Artist'],
      ['/artist-query', 'Apply for Artist Path']
    ]];
    var mobileGroups = footerGroupsFor(config.academy, config.whatsapp).filter(function(group) {
      return !/get started/i.test(group[0]);
    }).concat([mobileActionGroup]);
    var shell = document.createElement('div');
    shell.className = 'tsc-mobile-footer' + (config.academy ? ' tsc-mobile-footer-academy' : '');
    shell.dataset.tscVariant = variant;
    shell.setAttribute('data-tsc-theme', config.academy ? 'academy' : 'dark');
    shell.innerHTML = [
      '<div class="tsc-mobile-footer-brand">',
        mobileFooterLogoMarkup(config, brandName),
      '</div>',
      mobileGroups.map(function(group, index) {
        return '<details class="tsc-mobile-footer-acc"' + (index === 0 ? ' open' : '') + '><summary>' + escapeHtml(group[0]) + '</summary><div class="tsc-mobile-footer-links">' + group[1].map(function(link) {
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
          '<button type="submit">Subscribe</button>',
        '</form>',
        '<p class="tsc-mobile-footer-newsnote" role="status" hidden>Thanks, you are on the list.</p>',
      '</div>',
      '<div class="tsc-mobile-footer-social">',
        socials.map(function(s) {
          return '<a class="tsc-mobile-footer-icon" href="' + escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(s.aria) + '">' + s.svg + '</a>';
        }).join(''),
      '</div>',
      '<div class="tsc-mobile-footer-bottom">',
        '<span>&copy; 2026 ' + escapeHtml(brandName) + ' - All rights reserved</span>',
      '</div>'
    ].join('');

    footer.insertBefore(shell, footer.firstChild);
    Array.prototype.slice.call(footer.children).forEach(function(child) {
      if (child !== shell && !child.classList.contains('tsc-desktop-footer')) {
        child.classList.add('tsc-legacy-footer');
      }
    });
    document.body.classList.add('tsc-has-mobile-footer');
    var form = shell.querySelector('.tsc-mobile-footer-newsrow');
    bindNewsletterSubmit(form, shell);
    return shell;
  }

  function normalizeArtistLinks() {
    document.querySelectorAll('a[href]').forEach(function(anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var text = anchor.textContent || '';
        if (url.pathname === '/query') {
          anchor.setAttribute('href', '/book-an-artist' + url.search + url.hash);
        }
      } catch (e) {}
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
    document.querySelectorAll('header a[href], [class*="wixui-header"] a[href]').forEach(function(anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var isHomeLink = url.pathname === '/' || url.pathname === '/blank-3';
        var isLogo = !!anchor.closest('.wixui-vector-image, [class*="wixui-vector-image"]');
        if (isHomeLink && isLogo) {
          anchor.setAttribute('href', '/academy');
          anchor.setAttribute('target', '_self');
        }
      } catch (e) {}
    });
  }

  function configureVideoPlayer(video) {
    if (!video) return;
    video.controls = true;
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.setAttribute('controls', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    var wrapper = video.closest('wix-video, wix-media-canvas, [id*="videoContainer"], .LH0J3M') || video.parentElement;
    if (wrapper) {
      wrapper.classList.add('tsc-native-video-player');
      wrapper.setAttribute('data-tsc-native-video-player', '');
      wrapper.querySelectorAll('.IuQm4G, .uqsi3c, .JODVkC, .juFBxh, .QpcXUG, [data-audio], [aria-label*="Mute"], [aria-label*="Sound"]').forEach(function(control) {
        control.setAttribute('aria-hidden', 'true');
        control.setAttribute('tabindex', '-1');
        control.style.setProperty('display', 'none', 'important');
        control.style.setProperty('pointer-events', 'none', 'important');
      });
    }
  }

  function observeVideoPlayers() {
    if (!window.MutationObserver || window.__tscVideoPlayerObserver) return;
    window.__tscVideoPlayerObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
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
    document.querySelectorAll('[data-audio], [aria-label*="Mute"], [aria-label*="Sound"]').forEach(function(node) {
      node.setAttribute('data-audio', 'off');
    });
  }

  function patchMutedPlay() {
    if (!window.HTMLMediaElement || window.__tscMutedPlayPatch) return;
    window.__tscMutedPlayPatch = true;
    var originalPlay = window.HTMLMediaElement.prototype.play;
    window.HTMLMediaElement.prototype.play = function() {
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
    [250, 1000, 2500, 5000].forEach(function(delay) {
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
    document.querySelectorAll('a[href]').forEach(function(anchor) {
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
      } catch (e) {}
    });
  }

  function wireLearnHubClickGuard() {
    if (window.__tscLearnHubGuard) return;
    window.__tscLearnHubGuard = true;
    document.addEventListener('click', function(event) {
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
      } catch (e) {}
    }, true);
  }

  /** Courses nav uses /academy#courses — marker before course cards (keeps Wix IDs intact). */
  function ensureAcademyCoursesAnchor() {
    if (canonicalPathname() !== '/academy') return;
    if (document.getElementById('courses')) return;
    var section = document.querySelector('#comp-mpjvjuos') || document.querySelector('#comp-mpjvo1xd');
    if (!section || !section.parentNode) return;
    var marker = document.createElement('div');
    marker.id = 'courses';
    marker.setAttribute('aria-hidden', 'true');
    marker.style.cssText = 'height:0;width:0;overflow:hidden;position:relative;scroll-margin-top:96px;';
    section.parentNode.insertBefore(marker, section);
  }

  ensureStylesheet('/css/tsc-nav-overrides.css?v=desktop-top-1');
  ensureStylesheet('/css/tsc-responsive.css?v=academy-chrome-1');
  ensureStylesheet('/css/tsc-brand-card.css');
  ensureScript('/js/tsc-brand-cards.js');
  // Play paused Wix enter/loop motions + slideshow word-swap (all viewports).
  ensureStylesheet('/css/tsc-wix-motion.css?v=academy-one-2');
  ensureScript('/js/tsc-wix-motion.js?v=academy-one-2');
  function bootUi() {
    if (redirectLegacyLearnHub()) return;
    var path = canonicalPathname();
    setBodyPage(path);
    var mountSharedChrome = function() {
      mountDesktopHeader({ path: path });
      mountDesktopFooter({ path: path });
      mountMobileHeader({ path: path });
      mountMobileFooter({ path: path });
    };
    wireLearnHubClickGuard();
    wireLockedArtistsDropdownClickGuard();
    normalizeInternalProtocolRelativeLinks();
    forceLearnHubLinksToAcademy();
    ensureAcademyCoursesAnchor();
    // Form pages: load forms.css early (Wix widget + local form mobile layout)
    var formPages = {
      '/book-a-call': true,
      '/book-an-artist': true,
      '/artist-query': true,
      '/collab-query': true,
      '/query': true,
      '/masterclass-review01': true,
      '/masterclass-review02': true,
      '/classicalreview': true
    };
    if (formPages[path]) {
      ensureStylesheet('/css/forms.css?v=form-pickers-1');
    }
    mountSharedChrome();
    mountHarshadDigitalPresenceLinks(path);
    mountYugmIplYearFix(path);
    mountWorkImpactLinks(path);
    mountFilmReportCards(path);
    mountFilmBottomCtas(path);
    [250, 900, 1800, 3200, 6000, 9000].forEach(function(delay) {
      window.setTimeout(function() {
        mountSharedChrome();
        mountHarshadDigitalPresenceLinks(path);
        mountYugmIplYearFix(path);
        mountWorkImpactLinks(path);
        mountFilmReportCards(path);
        mountFilmBottomCtas(path);
      }, delay);
    });
    if ('MutationObserver' in window && !window.__tscSharedChromeObserver) {
      window.__tscSharedChromeObserver = new MutationObserver(function() {
        var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
        if (path === '/films') {
          window.clearTimeout(window.__tscFilmReportRepairTimer);
          window.__tscFilmReportRepairTimer = window.setTimeout(function() {
            mountFilmReportCards(path);
            mountFilmBottomCtas(path);
          }, 80);
        }
        var missing = compact
          ? !document.querySelector('.tsc-mobile-site-header') || !document.querySelector('.tsc-mobile-footer')
          : !document.querySelector('[data-tsc-locked-desktop-header="true"], .tsc-desktop-site-header') ||
            !document.querySelector('.tsc-desktop-footer');
        if (!missing) return;
        window.clearTimeout(window.__tscSharedChromeRepairTimer);
        window.__tscSharedChromeRepairTimer = window.setTimeout(function() {
          mountSharedChrome();
          mountFilmReportCards(path);
          mountFilmBottomCtas(path);
        }, 40);
      });
      window.__tscSharedChromeObserver.observe(document.body, { childList: true, subtree: true });
    }
    if (path === '/resources') {
      ensureScript('/js/content-replacements.js?v=resources-all-blogs-1');
    }
    if (path === '/academy' || path === '/learn-with-tsc') {
      ensureScript('/js/content-replacements.js?v=academy-chrome-1');
    }
    wireMobileAssets();
    if (path === '/artist-path') {
      mountDesktopFooter({ path: '/artist-path' });
    }
    wireCourseAccordions();
    watchLinkNormalization();
    [400, 1500, 3000].forEach(function(delay) {
      window.setTimeout(function() {
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
