(function() {
  var ui = window.TSCComponents;
  if (!ui) return;

  var resourcesBlogCards = [
    {
      title: 'From Bhajan to Clubbing, From Mythology to Cinema',
      description: 'How Indian culture is finding new mainstream forms across music, film, and shared spaces.',
      date: 'JUL 26',
      readTime: '5 mins',
      href: '/from-bhajan-to-clubbing',
      image: {
        src: '/assets/blogs/indian-culture-mainstream.jpeg',
        alt: 'Culture essay editorial visual'
      }
    },
    {
      title: 'You Released a Song. Now What?',
      description: 'A practical release guide for independent artists building listeners, fans, and momentum.',
      date: 'JUL 27',
      readTime: '12 mins',
      href: '/you-released-a-song-now-what',
      image: {
        src: '/assets/blogs/song-release-now-what.jpeg',
        alt: 'Artist release playbook editorial visual'
      }
    }
  ];
  var whatsappCommunityUrl = 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu?mode=gi_t';
  var brandAssets = {
    main: {
      logo: '/assets/brand/tsc-logo.png',
      icon: '/assets/brand/tsc-favicon-32.png',
      touchIcon: '/assets/brand/tsc-apple-touch-icon.png'
    },
    academy: {
      logo: '/assets/brand/academy-logo.png',
      icon: '/assets/brand/academy-favicon-32.png',
      touchIcon: '/assets/brand/academy-apple-touch-icon.png'
    }
  };
  var mobileCoursePages = {
    '/the-heart-of-composition': {
      course: 'COURSE 001',
      mentor: 'Mentor: Sandesh Shandilya',
      title: 'The heART of Music Composition',
      eyebrow: 'Course Overview',
      description: 'Dive deeper into advanced composition techniques with a comprehensive program designed for artists ready to master the heART of music composition.',
      details: 'Learn directly from Sandesh Shandilya through 3 exclusive live interactive sessions, personalized feedback, recorded learning content, lifetime community access, and direct mentorship.',
      imageSelector: '#img-comp-mpmj3doh img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_3583e149066b4ebf9a6f37cc7d80382a~mv2.jpg/v1/crop/x_0,y_7,w_677,h_461/fill/w_640,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/sandesh_edited.jpg',
      href: '/book-a-call'
    },
    '/roots-of-hindustani-classical': {
      course: 'COURSE 002',
      mentor: 'Mentor: Pt. Prasad Khaparde',
      title: 'The Roots of Hindustani Classical',
      eyebrow: 'Course Overview',
      description: 'Immerse yourself in the timeless art of Hindustani classical music through a structured program designed for vocalists of all levels.',
      details: 'Learn directly from Pandit Prasad Khaparde through 5+ exclusive live sessions, focused feedback, recorded learning content, quality assessments, and a community-led learning rhythm.',
      imageSelector: '#img-comp-mrf1e0gi img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_07c6e896e4a54fcc99b08a98ceccaff4~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/prasad-hero.jpg',
      href: '/book-a-call'
    }
  };
  var mobileWorkCards = [
    {
      title: 'Mai Bhi Artist',
      eyebrow: 'Every Artist Has a Story',
      stat: '4,000+ artists connected',
      href: '/mba',
      imageSelector: '#comp-mr69hwvu1 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_54d60cf6fe45451f9a6c467ec19ca7bf~mv2.png/v1/fill/w_608,h_540,fp_0.51_0.34,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/process.png'
    },
    {
      title: 'Havells mYOUsic',
      eyebrow: "Discovering India's Next Musical Voices",
      stat: '2500+ artist entries',
      href: '/work2',
      imageSelector: '#comp-mr69hwud img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_31e0c2f0485747acb1a4b9d831588423~mv2.jpg/v1/fill/w_608,h_497,fp_0.50_0.43,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4.jpg'
    },
    {
      title: 'Insta Music League',
      eyebrow: 'Where Original Music Takes Centre Stage',
      stat: '4,000+ original entries',
      href: '/work3',
      imageSelector: '#comp-mr69hwwa4 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/11062b_277a34827c9542fca4c9d0e384dfcdac~mv2.jpeg/v1/fill/w_608,h_480,fp_0.58_0.25,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Singer%20In%20Studio.jpeg'
    },
    {
      title: 'Young Gunns',
      eyebrow: 'Building the Next Generation of Artists',
      stat: '9 emerging artists',
      href: '/work0',
      imageSelector: '#comp-mr69hwvh img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/nsplsh_5b5a3fc5c58a46f384bd44052dad52f8~mv2.jpg/v1/fill/w_608,h_523,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Neel%20Patel.jpg'
    }
  ];
  var academyPaths = {
    '/academy': true,
    '/learn-with-tsc': true,
    '/the-heart-of-composition': true,
    '/blank-9': true,
    '/about-9': true,
    '/roots-of-hindustani-classical': true,
    '/blank-9-1': true,
    '/about-9-1': true,
    '/book-a-call': true,
    '/blank-8': true,
    '/about-8': true,
    '/masterclass-review01': true,
    '/masterclass-review02': true,
    '/classicalreview': true
  };

  function normalizedPath() {
    var path = location.pathname.replace(/\/$/, '') || '/';
    if (path.indexOf('/pages/') === 0) {
      path = path.replace('/pages', '').replace(/\.html$/, '') || '/';
    }
    return path;
  }

  function currentBrand() {
    return academyPaths[normalizedPath()] ? brandAssets.academy : brandAssets.main;
  }

  var resourcesCardSlots = [
    {
      title: '#comp-mrdpsm83',
      description: '#comp-mrdpvin1',
      date: '#comp-mrdpwwps',
      readTime: '#comp-mrdpxd14',
      button: '#comp-mrdpzaj6 a',
      mediumButton: '#comp-mrdq16ht',
      image: '#comp-mrdpmm1q img'
    },
    {
      title: '#comp-mrdq81q74',
      description: '#comp-mrdq81q97',
      date: '#comp-mrdq81qb2',
      readTime: '#comp-mrdq81qc8',
      button: '#comp-mrdq81qe1 a',
      mediumButton: '#comp-mrdq81qf4',
      image: '#comp-mrdq81q63 img'
    }
  ];

  function updateBlogCard(slot, card) {
    ui.setText(slot.title, card.title);
    ui.setText(slot.description, card.description);
    ui.setText(slot.date, card.date);
    ui.setText(slot.readTime, card.readTime);
    ui.setImage(slot.image, card.image);
    ui.updateButton(slot.button, { href: card.href, target: '_self', label: 'Read Blog' });
    ui.hideElement(slot.mediumButton);
  }

  function updateResourcesBlogSection() {
    if (location.pathname !== '/resources' && location.pathname !== '/pages/resources.html') return;
    document.querySelectorAll('.tsc-medium-blog-band').forEach(function(section) {
      section.remove();
    });
    ui.setText('#comp-mrdpc84n', 'From the Blog');
    ui.setText('#comp-mrdpc824', 'New essays for culture-first artists');
    resourcesCardSlots.forEach(function(slot, index) {
      updateBlogCard(slot, resourcesBlogCards[index]);
    });
    ui.hideElement('#comp-mrdq85ob');
  }

  function removeMentorSessions() {
    if (location.pathname !== '/academy' && location.pathname !== '/learn-with-tsc') return;
    ['#comp-mpl387ie', '#comp-mrufx9ud', '#comp-mpjxxeqt', '#comp-mrufx9rd2'].forEach(function(selector) {
      var section = document.querySelector(selector);
      if (section) section.remove();
    });
    document.querySelectorAll('main section').forEach(function(section) {
      var text = (section.textContent || '').replace(/\s+/g, ' ');
      if ((/Mentor Sessions/i.test(text) && /Upcoming courses with industry experts/i.test(text)) || (/Luca Petracca/i.test(text) && /Geet Sagar/i.test(text))) {
        section.remove();
      }
    });
  }

  function linkHomeEcosystemCta() {
    if (location.pathname !== '/' && location.pathname !== '/pages/home.html') return;
    var wrapper = document.querySelector('#comp-mrly2iho');
    if (!wrapper) return;

    wrapper.removeAttribute('role');
    wrapper.removeAttribute('tabindex');

    var control = wrapper.querySelector('[data-testid="linkElement"]');
    if (!control) return;

    if (control.tagName.toLowerCase() !== 'a') {
      var anchor = document.createElement('a');
      Array.prototype.slice.call(control.attributes).forEach(function(attribute) {
        anchor.setAttribute(attribute.name, attribute.value);
      });
      while (control.firstChild) {
        anchor.appendChild(control.firstChild);
      }
      control.parentNode.replaceChild(anchor, control);
      control = anchor;
    }

    control.setAttribute('href', whatsappCommunityUrl);
    control.setAttribute('target', '_blank');
    control.setAttribute('rel', 'noreferrer noopener');
    control.setAttribute('aria-label', 'Join The Ecosystem');

    var label = control.querySelector('.wixui-button__label, span');
    if (label) {
      label.textContent = 'Join The Ecosystem';
    }
  }

  function addMobileCourseMeta() {
    if (document.querySelector('.tsc-course-mobile-meta')) return;
    var labels = [];
    document.querySelectorAll('main [data-testid="richTextElement"]').forEach(function(element) {
      var text = (element.textContent || '').replace(/\s+/g, ' ').trim();
      if (/^COURSE\s+\d{3}$/i.test(text) || /^Mentor:/i.test(text)) {
        element.classList.add('tsc-mobile-hidden-label');
        labels.push(text);
      }
    });
    if (!labels.length) return;

    var main = document.querySelector('main');
    var anchor = main && main.querySelector('section:nth-of-type(2), section');
    if (!main || !anchor) return;

    var meta = document.createElement('div');
    meta.className = 'tsc-course-mobile-meta';
    labels.slice(0, 2).forEach(function(text) {
      var item = document.createElement('span');
      item.textContent = text;
      meta.appendChild(item);
    });
    main.insertBefore(meta, anchor.nextSibling);
  }

  function localImageSrc(selector, fallback) {
    var img = selector && document.querySelector(selector);
    if (!img) return fallback;
    if (img.naturalWidth === 0 && img.complete) return fallback;
    return img.currentSrc || img.src || fallback;
  }

  function buildMobileHeader() {
    var compact = window.matchMedia && window.matchMedia('(max-width: 700px)').matches;
    var existing = document.querySelector('.tsc-mobile-site-header');
    if (!compact) {
      if (existing) existing.parentNode.removeChild(existing);
      return;
    }
    if (existing) return;
    var path = normalizedPath();
    var academyMode = !!academyPaths[path];
    var brand = academyMode ? brandAssets.academy : brandAssets.main;
    var navLinks = academyMode
      ? [
          ['/resources', 'Resources'],
          ['/the-heart-of-composition', 'The HeART of Composition'],
          ['/roots-of-hindustani-classical', 'Roots of Hindustani Classical'],
          ['/academy', 'Courses'],
          ['/academy', 'Testimonials'],
          ['/book-a-call', 'Know More']
        ]
      : [
          ['/about', 'About'],
          ['/work', 'Work'],
          ['/artists', 'Artists'],
          ['/films', 'Films'],
          ['/resources', 'Resources'],
          ['/academy', 'TSC Academy']
        ];
    var header = document.createElement('div');
    header.className = 'tsc-mobile-site-header' + (academyMode ? ' tsc-mobile-site-header-academy' : '');
    header.innerHTML = [
      '<a class="tsc-mobile-brand" href="' + (academyMode ? '/academy' : '/') + '" aria-label="' + (academyMode ? 'TSC Academy' : 'The Shakti Collective') + '">',
        '<img class="tsc-mobile-brand-logo ' + (academyMode ? 'tsc-mobile-brand-logo-academy' : 'tsc-mobile-brand-logo-main') + '" src="' + brand.logo + '" alt="">',
      '</a>',
      '<details class="tsc-mobile-menu">',
        '<summary aria-label="Open navigation"><span></span><span></span><span></span></summary>',
        '<nav aria-label="Mobile">',
          navLinks.map(function(item) {
            return '<a href="' + item[0] + '">' + item[1] + '</a>';
          }).join(''),
        '</nav>',
      '</details>',
      '<a class="tsc-mobile-header-cta" href="' + (academyMode ? '/' : '/academy') + '">' + (academyMode ? 'Main Website' : 'TSC Academy') + '</a>'
    ].join('');
    document.body.insertBefore(header, document.getElementById('SITE_CONTAINER') || document.body.firstChild);

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
  }

  function applyBrandFavicons() {
    var brand = currentBrand();
    var icons = [
      { rel: 'icon', href: brand.icon, type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: brand.touchIcon, sizes: '180x180' }
    ];
    Array.prototype.forEach.call(document.querySelectorAll('link[rel*="icon"]'), function(link) {
      link.parentNode.removeChild(link);
    });
    icons.forEach(function(icon) {
      var link = document.createElement('link');
      Object.keys(icon).forEach(function(key) {
        link.setAttribute(key, icon[key]);
      });
      document.head.appendChild(link);
    });
  }

  function updateHeaderBrandLogos() {
    var path = normalizedPath();
    var academyMode = !!academyPaths[path];
    // ponytail: keep original Wix wordmarks; only fix href/aria
    Array.prototype.forEach.call(document.querySelectorAll('header .wixui-vector-image a'), function(link) {
      var rect = link.getBoundingClientRect();
      if (rect.left > 360 || rect.width < 40 || rect.height < 35) return;
      link.setAttribute('href', academyMode ? '/academy' : '/');
      link.setAttribute('aria-label', academyMode ? 'TSC Academy' : 'The Shakti Collective');
      link.classList.remove('tsc-desktop-brand-link');
      delete link.dataset.tscBrandLogo;
    });
  }

  function buildMobileCourseExperience() {
    var path = normalizedPath();
    var config = mobileCoursePages[path] || mobileCoursePages[path.replace('/pages', '').replace('.html', '')];
    var main = document.querySelector('main');
    if (!config || !main || document.querySelector('.tsc-mobile-course-shell')) return;
    Array.prototype.slice.call(main.querySelectorAll(':scope > section')).slice(0, 3).forEach(function(section) {
      section.classList.add('tsc-mobile-hide-course-original');
    });

    var shell = document.createElement('section');
    shell.className = 'tsc-mobile-course-shell';
    shell.innerHTML = [
      '<div class="tsc-mobile-course-meta"><span>' + ui.escapeHtml(config.course) + '</span><span>' + ui.escapeHtml(config.mentor) + '</span></div>',
      '<div class="tsc-mobile-course-hero">',
        '<img class="tsc-mobile-course-mark" src="' + brandAssets.academy.logo + '" alt="">',
        '<h1>' + ui.escapeHtml(config.title) + '</h1>',
      '</div>',
      '<div class="tsc-mobile-course-card">',
        '<p class="tsc-mobile-eyebrow">' + ui.escapeHtml(config.eyebrow) + '</p>',
        '<p>' + ui.escapeHtml(config.description) + '</p>',
      '</div>',
      '<figure class="tsc-mobile-course-media">',
        '<img src="' + ui.escapeHtml(localImageSrc(config.imageSelector, config.fallbackImage)) + '" alt="">',
      '</figure>',
      '<div class="tsc-mobile-course-card tsc-mobile-course-card-dark">',
        '<p>' + ui.escapeHtml(config.details) + '</p>',
        '<a href="' + ui.escapeHtml(config.href) + '">Book A Call</a>',
      '</div>'
    ].join('');
    main.parentNode.insertBefore(shell, main);
  }

  function buildMobileWorkCases() {
    var path = location.pathname.replace(/\/$/, '') || '/';
    var main = document.querySelector('main');
    var anchor = document.querySelector('#comp-mr69hwoy');
    if ((path !== '/work' && path !== '/pages/work.html') || !main || !anchor || main.querySelector('.tsc-mobile-work-cases')) return;

    var shell = document.createElement('section');
    shell.className = 'tsc-mobile-work-cases';
    shell.innerHTML = [
      '<div class="tsc-mobile-section-heading"><p>Selected Work</p><h2>Culture-first projects, built for artists and audiences.</h2></div>',
      '<div class="tsc-mobile-work-list">',
        mobileWorkCards.map(function(card) {
          return [
            '<a class="tsc-mobile-work-card" href="' + ui.escapeHtml(card.href) + '">',
              '<img src="' + ui.escapeHtml(localImageSrc(card.imageSelector, card.fallbackImage)) + '" alt="">',
              '<span class="tsc-mobile-work-arrow" aria-hidden="true">&nearr;</span>',
              '<span class="tsc-mobile-work-copy">',
                '<small>' + ui.escapeHtml(card.eyebrow) + '</small>',
                '<strong>' + ui.escapeHtml(card.title) + '</strong>',
                '<em>' + ui.escapeHtml(card.stat) + '</em>',
              '</span>',
            '</a>'
          ].join('');
        }).join(''),
      '</div>'
    ].join('');
    anchor.parentNode.insertBefore(shell, anchor);
  }

  function centerWithinViewport(element) {
    if (!element) return;
    var rect = element.getBoundingClientRect();
    if (!rect.width) return;
    var targetLeft = Math.max(16, (window.innerWidth - rect.width) / 2);
    var currentShift = parseFloat(element.dataset.tscResponsiveShift || '0') || 0;
    var unshiftedLeft = rect.left - currentShift;
    var delta = targetLeft - unshiftedLeft;
    element.style.transform = 'translateX(' + Math.round(delta) + 'px)';
    element.style.setProperty('--tsc-responsive-shift', Math.round(delta) + 'px');
    element.dataset.tscResponsiveShift = String(Math.round(delta));
  }

  function alignResponsiveElements() {
    var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    var selectors = [
      'footer .wixui-text-input',
      'footer .wixui-text-box'
    ];
    var elements = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));

    elements.forEach(function(element) {
      if (!compact) {
        element.style.removeProperty('transform');
        element.style.removeProperty('--tsc-responsive-shift');
        delete element.dataset.tscResponsiveShift;
        return;
      }
      centerWithinViewport(element);
    });
  }

  function scheduleResponsiveAlignment() {
    [60, 250, 700, 1400, 2400].forEach(function(delay) {
      window.setTimeout(function() {
        updateHeaderBrandLogos();
        alignResponsiveElements();
      }, delay);
    });
  }

  function boot() {
    applyBrandFavicons();
    ui.patchMutedPlay();
    ui.muteVideos();
    buildMobileHeader();
    updateHeaderBrandLogos();
    addMobileCourseMeta();
    buildMobileCourseExperience();
    buildMobileWorkCases();
    alignResponsiveElements();
    scheduleResponsiveAlignment();
    updateResourcesBlogSection();
    removeMentorSessions();
    linkHomeEcosystemCta();
  }

  ui.applyOnSchedule(boot);
  window.addEventListener('resize', function() {
    buildMobileHeader();
    alignResponsiveElements();
  });
  window.addEventListener('load', scheduleResponsiveAlignment);
  if ('MutationObserver' in window) {
    var observer = new MutationObserver(function() {
      window.clearTimeout(window.__tscResponsiveAlignTimer);
      window.__tscResponsiveAlignTimer = window.setTimeout(function() {
        updateHeaderBrandLogos();
        alignResponsiveElements();
      }, 80);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
