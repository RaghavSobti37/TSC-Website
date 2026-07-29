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
      '/blank-3-1': '/learn-with-tsc',
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
      '/forms/collab-query': '/collab-query'
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
        var mapped = aliasMap[url.pathname];
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
    about: '/css/mobile/about.css',
    work: '/css/mobile/work.css',
    artists: '/css/mobile/artists.css',
    learn: '/css/mobile/learn.css',
    films: '/css/mobile/films.css',
    resources: '/css/mobile/resources.css'
  };

  var LEARN_PATHS = {
    '/learn-with-tsc': true,
    '/academy': true,
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

  var WORK_PATHS = { '/work': true, '/mba': true, '/mba-impact': true, '/impact-report': true };
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
    '/you-released-a-song-now-what': true
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
    '/the-heart-of-composition': true,
    '/roots-of-hindustani-classical': true,
    '/music-production': true,
    '/book-a-call': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };

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
    '/learn-with-tsc': true,
    '/roots-of-hindustani-classical': true,
    '/the-heart-of-composition': true,
    '/music-production': true
  };

  function mobileCssBucket(path) {
    if (path === '/' || path === '/home') return 'home';
    if (path === '/about') return 'about';
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
    return !!LEARN_PATHS[path];
  }

  function injectStickyCta(path) {
    if (!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches)) return;
    var existing = document.querySelector('[data-tsc-sticky-cta], .tsc-phone-fab, .tsc-sticky-cta');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var academyFab = !!(LEARN_PATHS && LEARN_PATHS[path]) ||
      path === '/academy' || path === '/learn-with-tsc' || path === '/book-a-call' ||
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
    var path = canonicalPathname();
    setBodyPage(path);
    normalizeInternalProtocolRelativeLinks();
    // tsc-mobile-system.css @imports ./mobile/_tokens.css — no separate tokens link
    ensureStylesheet('/css/tsc-mobile-system.css?v=no-mentor-1');
    var bucket = mobileCssBucket(path);
    if (bucket && MOBILE_PAGE_CSS[bucket]) {
      ensureStylesheet(MOBILE_PAGE_CSS[bucket]);
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
      [400, 1200, 2500].forEach(function(delay) {
        window.setTimeout(hideWixMobileNavChrome, delay);
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
    ensureScript('/js/content-replacements.js');
    if (path === '/artists') {
      ensureScript('/js/tsc-artists-accordion.js', function() {
        if (window.TSCArtistsAccordion && window.TSCArtistsAccordion.init) {
          window.TSCArtistsAccordion.init();
        }
      });
    }
    document.documentElement.classList.add('tsc-mobile-ready');
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

  function bindLocalSubmit(form) {
    if (!form || form.dataset.bound) return;
    form.dataset.bound = 'true';
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var note = form.querySelector('.tsc-form-note');
      if (note) note.dataset.visible = 'true';
      form.reset();
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
        ['/academy', 'Academy Home'],
        ['/learn-with-tsc', 'Courses'],
        ['/music-production', 'A-Z of Music Production'],
        ['/the-heart-of-composition', 'The HeART of Composition'],
        ['/roots-of-hindustani-classical', 'Roots of Hindustani Classical'],
        ['/resources', 'Resources'],
        ['/book-a-call', 'Book a Call'],
        ['/', 'The Shakti Collective']
      ];
    }
    return [
      ['/about', 'About'],
      ['/work', 'Work'],
      ['/artists', 'Artists'],
      ['/films', 'Films'],
      ['/resources', 'Resources'],
      ['/academy', 'TSC Academy']
    ];
  }

  function footerGroupsFor(academy, whatsappUrl) {
    if (academy) {
      return [
        ['Academy', [
          ['/academy', 'Academy Home'],
          ['/learn-with-tsc', 'Courses'],
          ['/music-production', 'A-Z of Music Production'],
          ['/the-heart-of-composition', 'The HeART of Composition'],
          ['/roots-of-hindustani-classical', 'Roots of Hindustani Classical']
        ]],
        ['Explore TSC', [
          ['/', 'The Shakti Collective'],
          ['/about', 'About'],
          ['/artists', 'Artists'],
          ['/resources', 'Resources']
        ]],
        ['Get Started', [
          ['/book-a-call', 'Book a Call'],
          [whatsappUrl, 'WhatsApp community', true],
          ['mailto:Artist@theshakticollective.in', 'Artist@theshakticollective.in']
        ]]
      ];
    }
    return [
      ['Quick links', [
        ['/', 'Home'],
        ['/about', 'About'],
        ['/work', 'Work'],
        ['/artists', 'Artists'],
        ['/academy', 'TSC Academy'],
        ['/films', 'Films']
      ]],
      ['Explore', [
        ['/artist-path', 'Artist Path'],
        ['/learn-with-tsc', 'Learn With TSC'],
        ['/resources', 'Resources']
      ]],
      ['Join our community', [
        [whatsappUrl, 'WhatsApp community', true],
        ['mailto:Artist@theshakticollective.in', 'Artist@theshakticollective.in']
      ]]
    ];
  }

  function mountMobileHeader(opts) {
    if (!ENABLE_CUSTOM_MOBILE_CHROME) {
      unmountCustomMobileChrome();
      return null;
    }
    var compact = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
    var existing = document.querySelector('.tsc-mobile-site-header');
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      return null;
    }

    var config = componentOptions(opts);
    var variant = config.academy ? 'academy' : 'main';
    if (existing && existing.dataset.tscVariant === variant) {
      hideWixMobileNavChrome();
      return existing;
    }
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var header = document.createElement('div');
    header.className = 'tsc-mobile-site-header' + (config.academy ? ' tsc-mobile-site-header-academy' : '');
    header.dataset.tscVariant = variant;
    header.innerHTML = [
      '<a class="tsc-mobile-brand" href="' + (config.academy ? '/academy' : '/') + '" aria-label="' + escapeHtml(brandName) + '">',
        mobileHeaderLogoMarkup(config),
      '</a>',
      '<details class="tsc-mobile-menu">',
        '<summary aria-label="Open navigation"><span></span><span></span><span></span></summary>',
        '<nav aria-label="' + (config.academy ? 'TSC Academy mobile' : 'TSC mobile') + '">',
          navLinksFor(config.academy).map(function(item) {
            return '<a href="' + escapeHtml(item[0]) + '">' + escapeHtml(item[1]) + '</a>';
          }).join(''),
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
      document.querySelector('footer') ||
      document.getElementById('SITE_FOOTER');
  }

  function scrapeFooterSocialHref(footer, needle, fallback) {
    if (!footer) return fallback;
    var link = footer.querySelector('a[href*="' + needle + '"]');
    return (link && link.getAttribute('href')) || fallback;
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

    var footer = findSiteFooter();
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'SITE_FOOTER';
      document.body.appendChild(footer);
    }
    footer.classList.remove('tsc-legacy-footer-host');

    var socials = [
      { id: 'instagram', aria: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective/', needle: 'instagram' },
      { id: 'whatsapp', aria: 'WhatsApp', href: config.whatsapp, needle: 'whatsapp' },
      { id: 'youtube', aria: 'YouTube', href: 'https://youtube.com/@theshakticollective', needle: 'youtube' },
      { id: 'facebook', aria: 'Facebook', href: 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/', needle: 'facebook' },
      { id: 'linkedin', aria: 'LinkedIn', href: 'https://www.linkedin.com/company/theshakticollective', needle: 'linkedin' },
      { id: 'email', aria: 'Email', href: 'mailto:Artist@theshakticollective.in', needle: 'mailto:' }
    ].map(function(s) {
      return {
        aria: s.aria,
        href: scrapeFooterSocialHref(footer, s.needle, s.href),
        svg: SOCIAL_SVGS[s.id]
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var baseGroups = footerGroupsFor(config.academy, config.whatsapp);
    var navGroups = baseGroups.filter(function(group) {
      return !/join our community|get started/i.test(group[0]);
    });
    var actionGroup = ['Start Here', config.academy ? [
      ['/book-a-call', 'Book a Call'],
      ['/artist-query', 'Apply for Artist Path'],
      ['/query', 'Book an Artist']
    ] : [
      ['/book-a-call', 'Book a Call'],
      ['/query', 'Book an Artist'],
      ['/artist-query', 'Apply for Artist Path']
    ]];
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
          [actionGroup].concat(navGroups).map(buildFooterLinks).join(''),
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
    document.body.classList.add('tsc-has-desktop-footer');
    var form = shell.querySelector('.tsc-desktop-footer-newsrow');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        var note = shell.querySelector('.tsc-desktop-footer-newsnote');
        if (note) note.hidden = false;
        form.reset();
      });
    }
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

    var footer = findSiteFooter();
    if (!footer) {
      footer = document.createElement('footer');
      footer.id = 'SITE_FOOTER';
      document.body.appendChild(footer);
    }
    footer.classList.remove('tsc-legacy-footer-host');

    var socials = [
      { id: 'instagram', aria: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective/', needle: 'instagram' },
      { id: 'whatsapp', aria: 'WhatsApp', href: config.whatsapp, needle: 'whatsapp' },
      { id: 'youtube', aria: 'YouTube', href: 'https://youtube.com/@theshakticollective', needle: 'youtube' },
      { id: 'facebook', aria: 'Facebook', href: 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/', needle: 'facebook' },
      { id: 'linkedin', aria: 'LinkedIn', href: 'https://www.linkedin.com/company/theshakticollective', needle: 'linkedin' },
      { id: 'email', aria: 'Email', href: 'mailto:Artist@theshakticollective.in', needle: 'mailto:' }
    ].map(function(s) {
      return {
        aria: s.aria,
        href: scrapeFooterSocialHref(footer, s.needle, s.href),
        svg: SOCIAL_SVGS[s.id]
      };
    });

    var brandName = config.brand.name || (config.academy ? 'TSC Academy' : 'The Shakti Collective');
    var emailId = 'tsc-mobile-footer-email-' + variant;
    var mobileActionGroup = ['Start Here', [
      ['/book-a-call', 'Book a Call'],
      ['/query', 'Book an Artist'],
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
    document.body.classList.add('tsc-has-mobile-footer');
    var form = shell.querySelector('.tsc-mobile-footer-newsrow');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        var note = shell.querySelector('.tsc-mobile-footer-newsnote');
        if (note) note.hidden = false;
        form.reset();
      });
    }
    return shell;
  }

  function normalizeArtistLinks() {
    document.querySelectorAll('a[href]').forEach(function(anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var text = anchor.textContent || '';
        if (url.pathname === '/book-an-artist' && (/book an artist|partner with us/i.test(text) || location.pathname === '/artists')) {
          anchor.setAttribute('href', '/query' + url.search + url.hash);
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
    normalizeInternalProtocolRelativeLinks: normalizeInternalProtocolRelativeLinks,
    ensureScript: ensureScript,
    ensureStylesheet: ensureStylesheet,
    escapeHtml: escapeHtml,
    formMarkup: formMarkup,
    hideElement: hideElement,
    mountFormInto: mountFormInto,
    mountDesktopFooter: mountDesktopFooter,
    mountMobileFooter: mountMobileFooter,
    mountMobileHeader: mountMobileHeader,
    mountStandaloneForm: mountStandaloneForm,
    configureVideoPlayer: configureVideoPlayer,
    muteVideos: muteVideos,
    normalizeAcademyLogoLinks: normalizeAcademyLogoLinks,
    normalizeArtistLinks: normalizeArtistLinks,
    normalizeNewsletter: normalizeNewsletter,
    patchMutedPlay: patchMutedPlay,
    setImage: setImage,
    setText: setText,
    slug: slug,
    updateButton: updateButton,
    wireMobileAssets: wireMobileAssets
  };
  function wireCourseAccordions() {
    var path = canonicalPathname();
    if (!LEARN_DATA_PAGE[path] || path === '/learn-with-tsc') return;
    ensureScript('/js/tsc-course-accordion.js', function () {
      if (window.TSCCourseAccordion && window.TSCCourseAccordion.init) {
        window.TSCCourseAccordion.init();
      }
    });
  }

  ensureStylesheet('/css/tsc-responsive.css?v=no-mentor-1');
  ensureStylesheet('/css/tsc-brand-card.css');
  ensureScript('/js/tsc-brand-cards.js');
  // Play paused Wix enter/loop motions + slideshow word-swap (all viewports).
  ensureStylesheet('/css/tsc-wix-motion.css?v=no-mentor-1');
  ensureScript('/js/tsc-wix-motion.js?v=no-mentor-1');
  function bootUi() {
    wireMobileAssets();
    wireCourseAccordions();
  }
  if (document.body) {
    bootUi();
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootUi);
  } else {
    bootUi();
  }
})();
