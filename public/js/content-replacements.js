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
  var unifiedLogoSrc = '/assets/brand/tsc-logo.png';
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
      title: 'Main Bhi Artist',
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
      href: '/havells-myousic',
      imageSelector: '#comp-mr69hwud img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_31e0c2f0485747acb1a4b9d831588423~mv2.jpg/v1/fill/w_608,h_497,fp_0.50_0.43,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/4.jpg'
    },
    {
      title: 'Insta Music League',
      eyebrow: 'Where Original Music Takes Centre Stage',
      stat: '4,000+ original entries',
      href: '/insta-music-league',
      imageSelector: '#comp-mr69hwwa4 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/11062b_277a34827c9542fca4c9d0e384dfcdac~mv2.jpeg/v1/fill/w_608,h_480,fp_0.58_0.25,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Singer%20In%20Studio.jpeg'
    },
    {
      title: 'Young Gunns',
      eyebrow: 'Building the Next Generation of Artists',
      stat: '9 emerging artists',
      href: '/young-gunns',
      imageSelector: '#comp-mr69hwvh img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/nsplsh_5b5a3fc5c58a46f384bd44052dad52f8~mv2.jpg/v1/fill/w_608,h_523,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Neel%20Patel.jpg'
    }
  ];
  var mobileFilmCards = [
    {
      num: '01',
      title: 'Mahaavatar Narsimha',
      blurb: 'Mythology-led animated feature — cultural positioning, audience development, monetisation and long-term IP growth.',
      href: '/mahavatar-narsimha',
      imageSelector: '#comp-mqmi3w4b3 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_a9399d943c794787aa9a5a4babaa82b7~mv2.jpg/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/9_edited_edited.jpg'
    },
    {
      num: '02',
      title: 'Hanuman Ansh',
      blurb: 'Spiritual entertainment IP connecting faith, story, community and contemporary audiences.',
      href: '/hanuman-ansh',
      imageSelector: '#comp-mqmi6yoc4 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_ca20c3bfe20b447fb264a2d00c44069e~mv2.png/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11_edited_edited.png'
    },
    {
      num: '03',
      title: 'Mahaprabhu Jagannath',
      blurb: 'Cultural resonance initiative for Lord Jagannath’s living tradition — community, devotion, new-generation storytelling.',
      href: '/mahaprbhu',
      imageSelector: '#comp-mqmi8cy66 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_3f14ef87c77647c6bac92fc2415274ad~mv2.png/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/12_edited.png'
    },
    {
      num: '04',
      title: 'Kalki',
      blurb: 'Culture-forward storytelling — tradition and the future, strategic positioning and modern audience engagement.',
      href: '/kalki',
      imageSelector: '#comp-mqmi8sv12 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_f84950fe51a84d3baf15f59a5c864731~mv2.jpg/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/kalki.jpg'
    }
  ];
  var mobileFilmsWhatWeDo = [
    ['Film mounting', 'Getting projects production-ready.'],
    ['Audience building', 'Growing a real audience pre-release.'],
    ['Partnerships and collabs', 'Brand and platform tie-ins.'],
    ['Monetisation and growth', 'Sustainable revenue paths.'],
    ['Franchise and universe development', 'Building beyond a single release.']
  ];
  var academyPaths = {
    '/academy': true,
    '/learn-with-tsc': true,
    '/the-heart-of-composition': true,
    '/blank-9': true,
    '/about-9': true,
    '/music-production': true,
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

  /* In-card CTAs for What We Build (SSR may already include them; reinject after Wix hydrates). */
  function injectHomeWhatWeBuildCardCtas() {
    if (location.pathname !== '/' && location.pathname !== '/pages/home.html') return;

    var cards = [
      { id: 'comp-mrlr0ide', title: 'TSC ACADEMY', label: 'Explore TSC Academy', href: '/academy' },
      { id: 'comp-mrlrorgn', title: 'Artist Development', label: 'Discover Artist Paths', href: '/artist-path' },
      { id: 'comp-mrlrqzuf', title: 'IP Development', label: 'Build With TSC', href: '/films' },
      { id: 'comp-mrlrv5on', title: 'Brand Collaborations', label: 'Collab with TSC', href: '/collab-query' },
      { id: 'comp-mrlrv5ly', title: 'Community', label: 'Join The Ecosystem', href: whatsappCommunityUrl, external: true }
    ];

    function findHost(card) {
      var host = document.getElementById(card.id);
      if (host) return host;
      var nodes = document.querySelectorAll('[data-testid="richTextElement"], .wixui-rich-text');
      for (var i = 0; i < nodes.length; i++) {
        var text = (nodes[i].textContent || '').replace(/\s+/g, ' ').trim();
        if (text.toLowerCase() !== card.title.toLowerCase()) continue;
        var box = nodes[i].closest('.wixui-box, [class*="-container"]');
        if (box) return box;
      }
      return null;
    }

    var injected = 0;
    cards.forEach(function(card) {
      var host = findHost(card);
      if (!host) return;
      var existing = host.querySelector(':scope > .tsc-wwb-cta, .tsc-wwb-cta');
      if (existing) {
        injected += 1;
        return;
      }
      var a = document.createElement('a');
      a.className = 'tsc-wwb-cta';
      a.href = card.href;
      a.textContent = card.label;
      a.setAttribute('aria-label', card.label);
      if (card.external) {
        a.target = '_blank';
        a.rel = 'noreferrer noopener';
      }
      host.appendChild(a);
      injected += 1;
    });
    return injected;
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
    if (ui.mountMobileHeader) {
      return ui.mountMobileHeader({
        path: normalizedPath(),
        academyPaths: academyPaths,
        brandAssets: brandAssets,
        whatsappCommunityUrl: whatsappCommunityUrl
      });
    }
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
          ['/music-production', 'A-Z of Music Production'],
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
        '<img class="tsc-mobile-brand-logo tsc-mobile-brand-logo-unified" src="' + unifiedLogoSrc + '" alt="">',
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
    Array.prototype.forEach.call(document.querySelectorAll('header .wixui-vector-image a'), function(link) {
      var rect = link.getBoundingClientRect();
      if (rect.left > 360 || rect.width < 40 || rect.height < 35) return;
      link.setAttribute('href', academyMode ? '/academy' : '/');
      link.setAttribute('aria-label', academyMode ? 'TSC Academy' : 'The Shakti Collective');
      link.classList.add('tsc-desktop-brand-link');
      if (link.dataset.tscBrandLogo === 'unified') return;
      link.innerHTML = '<img class="tsc-desktop-brand-logo tsc-desktop-brand-logo-unified" src="' + unifiedLogoSrc + '" alt="">';
      link.dataset.tscBrandLogo = 'unified';
    });
  }

  function syncResponsiveHeaderMenuCta() {
    var academyMode = !!academyPaths[normalizedPath()];
    var compact = !window.matchMedia || window.matchMedia('(max-width: 1000px)').matches;
    var href = academyMode ? '/' : '/academy';
    var label = academyMode ? 'Main Website' : 'TSC Academy';

    Array.prototype.forEach.call(document.querySelectorAll('header nav[data-hook="menu-root"]'), function(nav) {
      var list = nav.querySelector('ul');
      if (!list) return;

      var existing = list.querySelector('.tsc-responsive-header-extra');
      if (!compact) {
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
        return;
      }

      if (!existing) {
        var template = list.querySelector('li[data-part="menu-item"], li');
        if (!template) return;
        existing = template.cloneNode(true);
        existing.classList.add('tsc-responsive-header-extra');
        list.appendChild(existing);
      }

      var link = existing.querySelector('a[href]');
      var labelNode = existing.querySelector('[data-part="label"], .wixui-horizontal-menu__item-label, .wixui-menu__item-label');
      if (!link || !labelNode) return;

      link.setAttribute('href', href);
      link.setAttribute('target', '_self');
      labelNode.textContent = label;
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

  function updateWorkHero() {
    var path = normalizedPath();
    if (path !== '/work') return;

    function renderWorkHeroCopy() {
      var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      if (!compact) return;
      var titleHost = document.querySelector('#comp-mr4ozdiu');
      if (titleHost) {
        titleHost.innerHTML = '<h1 class="font_0 wixui-rich-text__text">Building cultural movements that last.</h1>';
      }

      var quote = document.querySelector('#comp-mr4pwv07');
      if (quote) {
        quote.innerHTML = '<p class="font_8 wixui-rich-text__text">Creating meaningful opportunities for <span style="font-style:italic;" class="wixui-rich-text__text">artists, stories &amp; communities.</span></p>';
      }
    }

    renderWorkHeroCopy();
    if (!window.__tscWorkHeroCopyResizeBound) {
      window.__tscWorkHeroCopyResizeBound = true;
      var lastCompact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      window.addEventListener('resize', function() {
        var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
        if (compact !== lastCompact) {
          lastCompact = compact;
          renderWorkHeroCopy();
        }
      });
    }

    var hero = document.getElementById('comp-mp3okkrk');
    if (!hero) return;
    if (!(window.matchMedia && window.matchMedia('(max-width: 900px)').matches)) return;
    hero.classList.add('tsc-work-hero-redesign');
    [80, 300, 800].forEach(function(delay) {
      window.setTimeout(renderWorkHeroCopy, delay);
    });

    var content = hero.querySelector('[data-testid="responsive-container-content"], .comp-mp3okkrk-container');
    if (!content || content.querySelector('.tsc-work-hero-cta')) return;

    var cta = document.createElement('a');
    cta.className = 'tsc-work-hero-cta';
    cta.href = '#comp-mr4pxqsd';
    cta.innerHTML = '<span>Explore Our Work</span><span aria-hidden="true">&rarr;</span>';
    content.appendChild(cta);

    var down = document.createElement('a');
    down.className = 'tsc-work-hero-down';
    down.href = '#comp-mr4pxqsd';
    down.setAttribute('aria-label', 'Scroll to selected work');
    down.setAttribute('aria-hidden', 'true');
    content.appendChild(down);
  }

  function teardownMobileWorkCases() {
    var host = document.querySelector('#comp-mr69hwoy');
    if (!host) return;
    var shell = host.querySelector('.tsc-mobile-work-cases');
    if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
    host.classList.remove('tsc-mobile-work-host');
    Array.prototype.forEach.call(host.querySelectorAll('.tsc-mobile-work-hide'), function(child) {
      child.classList.remove('tsc-mobile-work-hide');
      child.style.removeProperty('display');
    });
    host.style.removeProperty('height');
    host.style.removeProperty('min-height');
    host.style.removeProperty('overflow');
    document.body.classList.remove('tsc-has-mobile-work-cases');
  }

  function buildMobileWorkCases() {
    var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    var path = location.pathname.replace(/\/$/, '') || '/';
    var host = document.querySelector('#comp-mr69hwoy');
    if ((path !== '/work' && path !== '/pages/work.html') || !host) return;

    // Desktop must keep Wix mesh — shell only on phone/tablet.
    if (!compact) {
      teardownMobileWorkCases();
      return;
    }
    if (host.querySelector('.tsc-mobile-work-cases')) return;

    // Wix mesh uses explicit grid-row per section. Sibling shells with
    // grid-area:auto steal row 1 and bury the Work hero — mount inside host.
    host.classList.add('tsc-mobile-work-host');
    Array.prototype.forEach.call(host.children, function(child) {
      child.classList.add('tsc-mobile-work-hide');
      child.style.setProperty('display', 'none', 'important');
    });

    var shell = document.createElement('div');
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
    host.appendChild(shell);
    host.style.setProperty('height', 'auto', 'important');
    host.style.setProperty('min-height', '0', 'important');
    host.style.setProperty('overflow', 'visible', 'important');
    document.body.classList.add('tsc-has-mobile-work-cases');
  }

  function upscaleMirrorImage(src, size) {
    if (!src) return src;
    size = size || 720;
    return src.replace(/\/fill\/w_\d+,h_\d+/i, '/fill/w_' + size + ',h_' + size);
  }

  function teardownMobileFilmsShells() {
    var titleBand = document.getElementById('comp-mqktsjdh');
    if (titleBand) {
      titleBand.classList.remove('tsc-mobile-films-hide');
      titleBand.style.removeProperty('display');
    }

    var whatHost = document.getElementById('comp-mqktx0nc');
    if (whatHost) {
      var what = whatHost.querySelector('.tsc-mobile-films-what');
      if (what && what.parentNode) what.parentNode.removeChild(what);
      whatHost.classList.remove('tsc-mobile-films-host');
      Array.prototype.forEach.call(whatHost.querySelectorAll('.tsc-mobile-films-hide'), function(child) {
        child.classList.remove('tsc-mobile-films-hide');
        child.style.removeProperty('display');
        child.style.removeProperty('height');
        child.style.removeProperty('min-height');
        child.removeAttribute('aria-hidden');
      });
      whatHost.style.removeProperty('height');
      whatHost.style.removeProperty('min-height');
    }

    var dupPartnerships = document.getElementById('comp-mqmhowf1');
    if (dupPartnerships) {
      dupPartnerships.classList.remove('tsc-mobile-films-hide');
      dupPartnerships.style.removeProperty('display');
      dupPartnerships.style.removeProperty('height');
      dupPartnerships.removeAttribute('aria-hidden');
    }

    var cardHost = document.getElementById('comp-mqmhuw20');
    if (cardHost) {
      var cases = cardHost.querySelector('.tsc-mobile-films-cases');
      if (cases && cases.parentNode) cases.parentNode.removeChild(cases);
      cardHost.classList.remove('tsc-mobile-films-host');
      Array.prototype.forEach.call(cardHost.querySelectorAll('.tsc-mobile-films-hide'), function(child) {
        child.classList.remove('tsc-mobile-films-hide');
        child.style.removeProperty('display');
      });
      cardHost.style.removeProperty('height');
      cardHost.style.removeProperty('min-height');
      cardHost.style.removeProperty('position');
      cardHost.style.removeProperty('top');
    }

    ['comp-mqmi6yn5', 'comp-mqmi8cwy', 'comp-mqmi8stx'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('tsc-mobile-films-hide');
      el.style.removeProperty('display');
      el.style.removeProperty('height');
      el.style.removeProperty('min-height');
    });

    document.body.classList.remove('tsc-has-mobile-films-what', 'tsc-has-mobile-films-cases');
  }

  function buildMobileFilmsShells() {
    var path = normalizedPath();
    if (path !== '/films') return;

    var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    if (!compact) {
      teardownMobileFilmsShells();
      return;
    }

    // Wix page mesh is CSS grid with explicit grid-row per section.
    // New sibling sections get grid-row:auto → steal row 1 (above hero).
    // Always mount shells INSIDE existing section hosts.

    var titleBand = document.getElementById('comp-mqktsjdh');
    if (titleBand) titleBand.classList.add('tsc-mobile-films-hide');

    var whatHost = document.getElementById('comp-mqktx0nc');
    if (whatHost) {
      whatHost.classList.add('tsc-mobile-films-host');
      // Wix ships a duplicated Partnerships pair (#comp-mqmhowf1) — always suppress on compact.
      var dupPartnerships = document.getElementById('comp-mqmhowf1');
      if (dupPartnerships) {
        dupPartnerships.classList.add('tsc-mobile-films-hide');
        dupPartnerships.style.setProperty('display', 'none', 'important');
        dupPartnerships.style.setProperty('height', '0', 'important');
        dupPartnerships.setAttribute('aria-hidden', 'true');
      }
      function hideWixWhatChildren() {
        Array.prototype.forEach.call(whatHost.children, function(child) {
          if (child.classList && child.classList.contains('tsc-mobile-films-what')) return;
          child.classList.add('tsc-mobile-films-hide');
          child.style.setProperty('display', 'none', 'important');
          child.style.setProperty('height', '0', 'important');
          child.style.setProperty('min-height', '0', 'important');
          child.setAttribute('aria-hidden', 'true');
        });
      }
      hideWixWhatChildren();
      var existingWhat = whatHost.querySelector('.tsc-mobile-films-what');
      // Replace legacy list shell with cream cards if needed
      if (existingWhat && !existingWhat.querySelector('.tsc-mobile-films-feat-card')) {
        existingWhat.parentNode.removeChild(existingWhat);
        existingWhat = null;
      }
      if (!existingWhat) {
        var what = document.createElement('div');
        what.className = 'tsc-mobile-films-what';
        what.innerHTML = [
          '<div class="tsc-mobile-films-featlist">',
            mobileFilmsWhatWeDo.map(function(item, i) {
              var n = (i + 1 < 10 ? '0' : '') + (i + 1);
              return [
                '<article class="tsc-mobile-films-feat-card">',
                  '<span class="tsc-mobile-films-feat-num" aria-hidden="true">' + n + '</span>',
                  '<h3>' + ui.escapeHtml(item[0]) + '</h3>',
                  '<p>' + ui.escapeHtml(item[1]) + '</p>',
                '</article>'
              ].join('');
            }).join(''),
          '</div>'
        ].join('');
        whatHost.appendChild(what);
      }
      whatHost.style.setProperty('height', 'auto', 'important');
      whatHost.style.setProperty('min-height', '0', 'important');
      document.body.classList.add('tsc-has-mobile-films-what');
      [120, 400, 900].forEach(function(delay) {
        window.setTimeout(hideWixWhatChildren, delay);
      });
    }

    var cardHost = document.getElementById('comp-mqmhuw20');
    if (cardHost && !document.querySelector('.tsc-mobile-films-cases')) {
      cardHost.classList.add('tsc-mobile-films-host');
      Array.prototype.forEach.call(cardHost.children, function(child) {
        child.classList.add('tsc-mobile-films-hide');
        child.style.setProperty('display', 'none', 'important');
      });
      ['comp-mqmi6yn5', 'comp-mqmi8cwy', 'comp-mqmi8stx'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) {
          el.classList.add('tsc-mobile-films-hide');
          el.style.setProperty('display', 'none', 'important');
          el.style.setProperty('height', '0', 'important');
          el.style.setProperty('min-height', '0', 'important');
        }
      });
      var cases = document.createElement('div');
      cases.className = 'tsc-mobile-films-cases';
      cases.innerHTML = [
        '<div class="tsc-mobile-films-list">',
          mobileFilmCards.map(function(card) {
            var src = upscaleMirrorImage(localImageSrc(card.imageSelector, card.fallbackImage), 720);
            return [
              '<a class="tsc-mobile-films-card" href="' + ui.escapeHtml(card.href) + '">',
                '<img src="' + ui.escapeHtml(src) + '" alt="">',
                '<span class="tsc-mobile-films-card-copy">',
                  '<small>' + ui.escapeHtml(card.num) + '</small>',
                  '<strong>' + ui.escapeHtml(card.title) + '</strong>',
                  '<p>' + ui.escapeHtml(card.blurb) + '</p>',
                  '<em>Know More</em>',
                '</span>',
              '</a>'
            ].join('');
          }).join(''),
        '</div>'
      ].join('');
      cardHost.appendChild(cases);
      cardHost.style.setProperty('height', 'auto', 'important');
      cardHost.style.setProperty('min-height', '0', 'important');
      cardHost.style.setProperty('position', 'relative', 'important');
      cardHost.style.setProperty('top', 'auto', 'important');
      document.body.classList.add('tsc-has-mobile-films-cases');
    }

    // Video player wrappers keep Wix fixed heights that clip 16:9 media
    function unclipFilmsVideo() {
      ['comp-mqktgh65', 'comp-mql45ec4'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('min-height', '0', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
        Array.prototype.forEach.call(el.querySelectorAll('*'), function(node) {
          var tag = node.tagName;
          if (tag === 'VIDEO' || tag === 'IMG' || tag === 'SOURCE') return;
          var cs = window.getComputedStyle(node);
          if (cs.position === 'absolute') return;
          node.style.setProperty('height', 'auto', 'important');
          node.style.setProperty('min-height', '0', 'important');
          node.style.setProperty('overflow', 'visible', 'important');
        });
        var media = el.querySelector('video, img');
        if (media) {
          media.style.setProperty('width', '100%', 'important');
          media.style.setProperty('height', 'auto', 'important');
          media.style.setProperty('max-height', 'none', 'important');
          media.style.setProperty('aspect-ratio', '16 / 9', 'important');
          media.style.setProperty('object-fit', 'cover', 'important');
          media.style.setProperty('display', 'block', 'important');
        }
      });
      var mid = document.getElementById('comp-mqmh352i');
      if (mid) {
        mid.style.setProperty('height', 'auto', 'important');
        mid.style.setProperty('min-height', '0', 'important');
      }
    }
    unclipFilmsVideo();
    [120, 400, 900].forEach(function(delay) {
      window.setTimeout(unclipFilmsVideo, delay);
    });
  }

  /* Mockup skeleton: accordion footer (Quick Links / Explore / Join) + news + socials */
  // ponytail: compact path-only SVGs; cream fill via currentColor
  var mobileFooterSocialSvgs = {
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24zm6.3-8.1a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0zM12 4.32c-2.1 0-2.36.01-3.19.05-.82.04-1.39.17-1.88.36a3.8 3.8 0 0 0-1.37.89 3.8 3.8 0 0 0-.89 1.37c-.19.49-.32 1.06-.36 1.88-.04.83-.05 1.09-.05 3.19s.01 2.36.05 3.19c.04.82.17 1.39.36 1.88.2.51.46.95.89 1.37.42.43.86.69 1.37.89.49.19 1.06.32 1.88.36.83.04 1.09.05 3.19.05s2.36-.01 3.19-.05c.82-.04 1.39-.17 1.88-.36a3.8 3.8 0 0 0 1.37-.89 3.8 3.8 0 0 0 .89-1.37c.19-.49.32-1.06.36-1.88.04-.83.05-1.09.05-3.19s-.01-2.36-.05-3.19c-.04-.82-.17-1.39-.36-1.88a3.8 3.8 0 0 0-.89-1.37 3.8 3.8 0 0 0-1.37-.89c-.49-.19-1.06-.32-1.88-.36C14.36 4.33 14.1 4.32 12 4.32zm0 1.52c2.06 0 2.31.01 3.12.05.75.03 1.16.16 1.43.26.36.14.62.31.89.58.27.27.44.53.58.89.1.27.23.68.26 1.43.04.81.05 1.06.05 3.12s-.01 2.31-.05 3.12c-.03.75-.16 1.16-.26 1.43-.14.36-.31.62-.58.89a2.4 2.4 0 0 1-.89.58c-.27.1-.68.23-1.43.26-.81.04-1.06.05-3.12.05s-2.31-.01-3.12-.05c-.75-.03-1.16-.16-1.43-.26a2.4 2.4 0 0 1-.89-.58 2.4 2.4 0 0 1-.58-.89c-.1-.27-.23-.68-.26-1.43-.04-.81-.05-1.06-.05-3.12s.01-2.31.05-3.12c.03-.75.16-1.16.26-1.43.14-.36.31-.62.58-.89.27-.27.53-.44.89-.58.27-.1.68-.23 1.43-.26.81-.04 1.06-.05 3.12-.05z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.53 14.94L2 22l5.2-1.36A9.9 9.9 0 1 0 12.04 2zm5.79 14.13c-.24.68-1.4 1.25-1.94 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.18-4.93-4.38-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .4-.07.63.48.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.2-.15.32-.3.49-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.33 1.44.29.14.46.12.63-.07.17-.2.73-.85.93-1.14.2-.29.4-.24.67-.14.27.1 1.72.81 2.01.96.29.14.49.22.56.34.07.12.07.7-.17 1.38z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.38.58A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 7.05a1.96 1.96 0 1 0 0-3.92 1.96 1.96 0 0 0 0 3.92zM20.44 20h-3.37v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.7V8.5h3.23v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V20z"/></svg>'
  };
  var mobileFooterSocials = [
    { id: 'instagram', aria: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective/', needle: 'instagram' },
    { id: 'whatsapp', aria: 'WhatsApp', href: whatsappCommunityUrl, needle: 'whatsapp' },
    { id: 'youtube', aria: 'YouTube', href: 'https://youtube.com/@theshakticollective', needle: 'youtube' },
    { id: 'facebook', aria: 'Facebook', href: 'https://www.facebook.com/people/The-Shakti-Collective/61575006284507/', needle: 'facebook' },
    { id: 'linkedin', aria: 'LinkedIn', href: 'https://www.linkedin.com/company/theshakticollective', needle: 'linkedin' }
  ];

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

  function buildMobileFooter() {
    if (ui.mountMobileFooter) {
      return ui.mountMobileFooter({
        path: normalizedPath(),
        academyPaths: academyPaths,
        brandAssets: {
          main: Object.assign({ name: 'The Shakti Collective', tagline: 'Unfolding artist force.' }, brandAssets.main),
          academy: Object.assign({ name: 'TSC Academy', tagline: 'Mentorship-led learning for serious artists.' }, brandAssets.academy)
        },
        whatsappCommunityUrl: whatsappCommunityUrl
      });
    }
    var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    var existing = document.querySelector('.tsc-mobile-footer');
    var footer = findSiteFooter();
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('tsc-has-mobile-footer');
      return;
    }
    if (!footer || existing) return;

    var socials = mobileFooterSocials.map(function(s) {
      return {
        id: s.id,
        aria: s.aria,
        href: scrapeFooterSocialHref(footer, s.needle, s.href),
        svg: mobileFooterSocialSvgs[s.id]
      };
    });

    var shell = document.createElement('div');
    shell.className = 'tsc-mobile-footer';
    shell.setAttribute('data-tsc-theme', 'dark');
    shell.innerHTML = [
      '<div class="tsc-mobile-footer-brand">',
        '<img class="tsc-mobile-footer-logo" src="' + ui.escapeHtml(unifiedLogoSrc) + '" alt="The Shakti Collective" width="168" height="56" decoding="async">',
      '</div>',
      '<details class="tsc-mobile-footer-acc" open>',
        '<summary>Quick links</summary>',
        '<div class="tsc-mobile-footer-links">',
          '<a href="/">Home</a>',
          '<a href="/about">About</a>',
          '<a href="/work">Work</a>',
          '<a href="/artists">Artists</a>',
          '<a href="/academy">TSC Academy</a>',
          '<a href="/films">Films</a>',
        '</div>',
      '</details>',
      '<details class="tsc-mobile-footer-acc">',
        '<summary>Explore</summary>',
        '<div class="tsc-mobile-footer-links">',
          '<a href="/artist-path">Artist Path</a>',
          '<a href="/learn-with-tsc">Learn With TSC</a>',
          '<a href="/resources">Resources</a>',
        '</div>',
      '</details>',
      '<details class="tsc-mobile-footer-acc">',
        '<summary>Join our community</summary>',
        '<div class="tsc-mobile-footer-links">',
          '<a href="' + ui.escapeHtml(whatsappCommunityUrl) + '" target="_blank" rel="noopener noreferrer">WhatsApp community</a>',
          '<a href="mailto:Artist@theshakticollective.in">Artist@theshakticollective.in</a>',
        '</div>',
      '</details>',
      '<div class="tsc-mobile-footer-news">',
        '<h4>Subscribe to our newsletter</h4>',
        '<p>New essays and course drops, occasionally.</p>',
        '<form class="tsc-mobile-footer-newsrow" action="#" method="post">',
          '<label class="tsc-sr-only" for="tsc-mobile-footer-email">Email</label>',
          '<input id="tsc-mobile-footer-email" name="email" type="email" autocomplete="email" required placeholder="email@domain.com">',
          '<button type="submit">Join</button>',
        '</form>',
        '<p class="tsc-mobile-footer-newsnote" role="status" hidden>Thanks — you&apos;re on the list.</p>',
      '</div>',
      '<div class="tsc-mobile-footer-social">',
        socials.map(function(s) {
          return '<a class="tsc-mobile-footer-icon" href="' + ui.escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + ui.escapeHtml(s.aria) + '">' + s.svg + '</a>';
        }).join(''),
      '</div>',
      '<div class="tsc-mobile-footer-bottom">',
        '<span>&copy; 2026 The Shakti Collective · All rights reserved</span>',
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

  function setButtonLink(buttonLike, href) {
    if (!buttonLike || !href) return;
    var control = buttonLike.matches('a') ? buttonLike : buttonLike.querySelector('a, [data-testid="linkElement"]');
    if (!control) return;
    if (control.tagName && control.tagName.toLowerCase() === 'a') {
      control.setAttribute('href', href);
      control.setAttribute('target', '_self');
      return;
    }
    var anchor = document.createElement('a');
    Array.prototype.slice.call(control.attributes || []).forEach(function(attribute) {
      if (attribute.name === 'role' || attribute.name === 'tabindex') return;
      anchor.setAttribute(attribute.name, attribute.value);
    });
    anchor.setAttribute('href', href);
    anchor.setAttribute('target', '_self');
    while (control.firstChild) anchor.appendChild(control.firstChild);
    control.parentNode.replaceChild(anchor, control);
  }

  function repairArtistPages() {
    var path = normalizedPath();
    if (path !== '/harshad-duhita' && path !== '/yugm') return;

    var main = document.querySelector('main');
    if (!main) return;

    var heroSections = Array.prototype.slice.call(main.querySelectorAll('section')).filter(function(section) {
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      return /Book for Events/i.test(text) && /Explore Music/i.test(text);
    });
    if (!heroSections.length) return;

    var hero = heroSections[0];
    heroSections.slice(1).forEach(function(section) {
      if (section && section.parentNode) section.parentNode.removeChild(section);
    });

    var heroContent = hero.querySelector(':scope > [data-testid="responsive-container-content"], :scope .max-width-container');
    if (heroContent) {
      var compact = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      heroContent.style.setProperty('padding-top', compact ? '56px' : '28px', 'important');
    }

    var artistConfig = {
      '/harshad-duhita': {
        title: 'Harshaduhita Collective',
        description: 'A live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical expression.',
        badge: 'Winner - PADMA SHRI MAHENDRA KAPOOR AWARD 2026',
        artistQuery: '/query?artist=Harshad%20and%20Duhita%20Golesar'
      },
      '/yugm': {
        title: 'YUGM',
        description: 'A bridge between tradition and transformation.',
        badge: 'Netflix Spotlight - Mismatched Season 2 & 3',
        artistQuery: '/query?artist=YUGM'
      }
    }[path];
    if (!artistConfig) return;

    var title = hero.querySelector('h1, h2');
    if (title) title.textContent = artistConfig.title;

    var richTextBlocks = Array.prototype.slice.call(hero.querySelectorAll('[data-testid="richTextElement"]'));
    var description = richTextBlocks.find(function(node) {
      var text = (node.textContent || '').trim();
      return text && text !== artistConfig.title;
    });
    if (description) description.textContent = artistConfig.description;

    var badge = richTextBlocks.find(function(node) {
      return /winner|award|spotlight/i.test(node.textContent || '');
    });
    if (badge) badge.textContent = artistConfig.badge;

    var discographyHeading = Array.prototype.slice.call(main.querySelectorAll('h1, h2, h3')).find(function(node) {
      return /discography/i.test(node.textContent || '');
    });
    var discographySection = discographyHeading && discographyHeading.closest('section');
    var discographyHref = discographySection && discographySection.id ? ('#' + discographySection.id) : path;

    var buttons = Array.prototype.slice.call(hero.querySelectorAll('[data-testid="linkElement"], a, [role="button"]'));
    buttons.forEach(function(button) {
      var text = (button.textContent || button.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (/book for events/i.test(text)) {
        setButtonLink(button, artistConfig.artistQuery);
      } else if (/explore music/i.test(text)) {
        setButtonLink(button, discographyHref);
      }
    });
  }

  function centerArtistsHeroButtons() {
    if (normalizedPath() !== '/artists') return;
    var hero = document.querySelector('main section');
    if (!hero) return;
    Array.prototype.slice.call(hero.querySelectorAll('a[href], [data-testid="linkElement"]')).forEach(function(button) {
      var text = (button.textContent || button.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (!/^(Explore Artists|Partner With Us)$/i.test(text)) return;
      var host = button.closest('.lIkFMb, .wixui-button, [role="group"], [data-testid="responsive-container-content"]');
      if (host) {
        host.style.setProperty('display', 'flex', 'important');
        host.style.setProperty('justify-content', 'center', 'important');
      }
      if (button.tagName && button.tagName.toLowerCase() === 'a') {
        button.style.setProperty('margin-left', 'auto', 'important');
        button.style.setProperty('margin-right', 'auto', 'important');
      }
    });
  }

  function scheduleResponsiveAlignment() {
    [60, 250, 700, 1400, 2400].forEach(function(delay) {
      window.setTimeout(function() {
        updateHeaderBrandLogos();
        syncResponsiveHeaderMenuCta();
        alignResponsiveElements();
        repairArtistPages();
        centerArtistsHeroButtons();
      }, delay);
    });
  }

  function boot() {
    applyBrandFavicons();
    ui.patchMutedPlay();
    ui.muteVideos();
    buildMobileHeader();
    updateHeaderBrandLogos();
    syncResponsiveHeaderMenuCta();
    updateWorkHero();
    addMobileCourseMeta();
    buildMobileCourseExperience();
    buildMobileWorkCases();
    buildMobileFilmsShells();
    if (ui.mountDesktopFooter) {
      ui.mountDesktopFooter({
        path: normalizedPath(),
        academyPaths: academyPaths,
        brandAssets: {
          main: Object.assign({ name: 'The Shakti Collective', tagline: 'Unfolding artist force.' }, brandAssets.main),
          academy: Object.assign({ name: 'TSC Academy', tagline: 'Mentorship-led learning for serious artists.' }, brandAssets.academy)
        },
        whatsappCommunityUrl: whatsappCommunityUrl
      });
    }
    buildMobileFooter();
    alignResponsiveElements();
    repairArtistPages();
    centerArtistsHeroButtons();
    scheduleResponsiveAlignment();
    updateResourcesBlogSection();
    removeMentorSessions();
    linkHomeEcosystemCta();
    injectHomeWhatWeBuildCardCtas();
  }

  ui.applyOnSchedule(boot);
  window.addEventListener('resize', function() {
    buildMobileHeader();
    if (ui.mountDesktopFooter) {
      ui.mountDesktopFooter({
        path: normalizedPath(),
        academyPaths: academyPaths,
        brandAssets: {
          main: Object.assign({ name: 'The Shakti Collective', tagline: 'Unfolding artist force.' }, brandAssets.main),
          academy: Object.assign({ name: 'TSC Academy', tagline: 'Mentorship-led learning for serious artists.' }, brandAssets.academy)
        },
        whatsappCommunityUrl: whatsappCommunityUrl
      });
    }
    buildMobileFooter();
    buildMobileWorkCases();
    buildMobileFilmsShells();
    syncResponsiveHeaderMenuCta();
    alignResponsiveElements();
  });
  window.addEventListener('load', scheduleResponsiveAlignment);
  if ('MutationObserver' in window) {
    var observer = new MutationObserver(function() {
      window.clearTimeout(window.__tscResponsiveAlignTimer);
      window.__tscResponsiveAlignTimer = window.setTimeout(function() {
        updateHeaderBrandLogos();
        syncResponsiveHeaderMenuCta();
        alignResponsiveElements();
        injectHomeWhatWeBuildCardCtas();
      }, 80);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
