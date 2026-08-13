/*
 * DESKTOP DESIGN LOCK — PERMANENT. Desktop (>=1025px) of the 9 primary pages is locked to commit faf9dea.
 * This script must NOT alter desktop rendering of those pages. Mobile-only behavior must be guarded by
 * matchMedia('(max-width: 1024px)'). Never change desktop unless the site owner explicitly asks.
 */
(function () {
  // Runtime content replacement is disabled: static Wix HTML is the source of truth.
  return;
  var ui = window.TSCComponents;
  if (!ui) return;

  var resourcesBlogCards = [
    {
      title: 'From Bhajan to Clubbing, From Mythology to Cinema',
      description: 'Indian culture is not suddenly becoming relevant.',
      date: 'JUL 26',
      readTime: '5 mins',
      href: 'https://rohitsobti1.medium.com/from-bhajan-to-clubbing-from-mythology-to-cinema-how-indian-culture-is-finding-new-mainstream-161432be0966',
      image: {
        src: '/assets/blogs/from-bhajan-to-clubbing-medium.png',
        alt: 'From Bhajan to Clubbing Medium article visual'
      }
    },
    {
      title: 'You Released a Song. Now What?',
      description: 'A practical guide for independent artists to build listeners, fans and momentum.',
      date: 'JUL 27',
      readTime: '12 mins',
      href: 'https://rohitsobti1.medium.com/you-released-a-song-now-what-1bc33923ee1c',
      image: {
        src: '/assets/blogs/you-released-a-song-medium.png',
        alt: 'You Released a Song Medium article visual'
      }
    },
    {
      title: 'How Do I Start Making Music if I Have No Experience?',
      description: 'A lot of people feel drawn to music but do not know where to begin.',
      date: 'JUL 26',
      readTime: '3 mins',
      href: 'https://rohitsobti1.medium.com/how-do-i-start-making-music-if-i-have-no-experience-9c42a7409cd5',
      image: {
        src: '/assets/blogs/start-making-music-medium.png',
        alt: 'Start Making Music Medium article visual'
      }
    },
    {
      title: 'The Independent Film Growth Playbook',
      description: '10 principles every Indian producer should know before releasing a film.',
      date: 'JUL 29',
      readTime: '8 mins',
      href: 'https://rohitsobti1.medium.com/the-independent-film-growth-playbook-ac5765bec3a7',
      image: {
        src: '/assets/blogs/independent-film-growth-playbook-medium.png',
        alt: 'Independent Film Growth Playbook Medium article visual'
      }
    },
    {
      title: 'The Artist Path',
      description: 'A journey of self-discovery, exposure, fandom and monetisation.',
      date: 'JUL 29',
      readTime: '8 mins',
      href: 'https://rohitsobti1.medium.com/the-artist-path-a-journey-of-self-discovery-exposure-fandom-and-monetisation-c130b58b2e0e',
      image: {
        src: '/assets/blogs/artist-path-medium.png',
        alt: 'Artist Path Medium article visual'
      }
    },
    {
      title: 'How I Curate Music With Independent Artists',
      description: 'Lessons from Lost;Found with Faheem Abdullah — curation reveals the artist.',
      date: 'JUL 29',
      readTime: '14 mins',
      href: 'https://rohitsobti1.medium.com/how-i-curate-music-with-independent-artists-lessons-from-lost-found-with-faheem-abdullah-9d2c76cb8418',
      image: {
        src: '/assets/blogs/curate-music-independent-artists.jpeg',
        alt: 'Lost;Found album visual for an essay on curating music with independent artists'
      }
    }
  ];
  var whatsappCommunityUrl = 'https://chat.whatsapp.com/IaS1GaJT7Gp7ufxHIjDkZu?mode=gi_t';
  var TSC_LOGO_SRC = '/assets/brand/tsc-logo-trim-nav.png?v=nav-lock-3';
  var ACADEMY_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-nav.png?v=nav-lock-3';
  var TSC_FOOTER_LOGO_SRC = '/assets/brand/tsc-logo-trim-footer.png?v=flush-1';
  var ACADEMY_FOOTER_LOGO_SRC = '/assets/brand/tsc-academy-logo-trim-footer.png?v=flush-1';
  var brandAssets = {
    main: {
      logo: TSC_LOGO_SRC,
      icon: '/assets/brand/tsc-favicon-32.png',
      touchIcon: '/assets/brand/tsc-apple-touch-icon.png'
    },
    academy: {
      logo: ACADEMY_LOGO_SRC,
      icon: '/assets/brand/academy-favicon-32.png',
      touchIcon: '/assets/brand/academy-apple-touch-icon.png'
    }
  };

  /* Nav header: Collective on main, Academy mark on Academy chrome. Same size via CSS lock. */
  function logoSrcForPage() {
    return academyPaths[normalizedPath()] ? ACADEMY_LOGO_SRC : TSC_LOGO_SRC;
  }

  function footerLogoSrcForPage() {
    return academyPaths[normalizedPath()] ? ACADEMY_FOOTER_LOGO_SRC : TSC_FOOTER_LOGO_SRC;
  }
  var mobileCoursePages = {
    '/the-heart-of-composition': {
      course: 'COURSE 001',
      mentor: 'Mentor: Sandesh Shandilya',
      title: 'The heART of Music Composition',
      eyebrow: 'Course Overview',
      description: 'Dive deeper into advanced composition techniques with a comprehensive program designed for artists ready to master the heART of music composition.',
      details: 'Learn directly from Sandesh Shandilya through 3 exclusive live interactive sessions, personalized feedback, recorded learning content, lifetime community access, and direct mentorship.',
      mentorName: 'Sandesh Shandilya',
      mentorBio: 'A celebrated music director, composer, and arranger whose work spans Bollywood, sonic branding, and artist mentorship. This course brings his composition process into a practical, guided format for serious learners.',
      mentorBadges: ['Bollywood Soundtracks', 'Industry Experience', 'Award-Winning Composer'],
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
      mentorName: 'Pt. Prasad Khaparde',
      mentorBio: 'A Rampur Sahaswan Gharana master with 30+ years of performance and teaching experience, known for rigorous classical training and expressive vocal development.',
      mentorBadges: ['Rampur Sahaswan Gharana', '30+ Years Experience', 'Legendary Classical Vocalist'],
      imageSelector: '#img-comp-mrf1e0gi img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_07c6e896e4a54fcc99b08a98ceccaff4~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/prasad-hero.jpg',
      href: '/book-a-call'
    },
    '/music-production': {
      course: 'COURSE 003',
      mentor: 'Mentor: Luca Petracca',
      title: 'A-Z of Music Production',
      eyebrow: 'Course Overview',
      description: 'A practical international masterclass teaching end-to-end music production for artists using only a laptop.',
      details: 'Take an idea to a finished track: melodies, chords, harmonic progressions, song forms, virtual instruments, recording, FX, production, mixing and mastering through hands-on projects.',
      mentorName: 'Luca Petracca',
      mentorBio: 'Luca Petracca is a music producer and composer from Italy. He studied classical guitar at Conservatory S. Cecilia of Rome, classical composition at the Conservatorium van Amsterdam, and has taught music globally for more than 17 years.',
      mentorBadges: ['Music Producer & Composer', '17+ Years Teaching', 'Laptop-Based Production'],
      imageSelector: 'img[alt*="Luca"], img[src*="luca-petracca"]',
      fallbackImage: '/assets/luca/luca-production-session.jpg?v=luca-blu05000-3',
      href: '/book-a-call'
    }
  };
  var mobileWorkCards = [
    {
      num: '01',
      title: 'Main Bhi Artist',
      eyebrow: 'Every Artist Has a Story',
      stat: '4,000+ artists connected',
      href: '/mba',
      imageSelector: '#comp-mr69hwvu1 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_54d60cf6fe45451f9a6c467ec19ca7bf~mv2.png/v1/fill/w_960,h_600,fp_0.51_0.34,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/process.png'
    },
    {
      num: '02',
      title: 'Havells mYOUsic',
      eyebrow: "Discovering India's Next Musical Voices",
      stat: '2500+ artist entries',
      href: '/havells-myousic',
      imageSelector: '#comp-mr69hwud img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_31e0c2f0485747acb1a4b9d831588423~mv2.jpg/v1/fill/w_960,h_600,fp_0.50_0.43,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/4.jpg'
    },
    {
      num: '03',
      title: 'Insta Music League',
      eyebrow: 'Where Original Music Takes Centre Stage',
      stat: '4,000+ original entries',
      href: '/insta-music-league',
      imageSelector: '#comp-mr69hwwa4 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/11062b_277a34827c9542fca4c9d0e384dfcdac~mv2.jpeg/v1/fill/w_960,h_600,fp_0.58_0.25,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Singer%20In%20Studio.jpeg'
    },
    {
      num: '04',
      title: 'The Young Gunns',
      eyebrow: 'Building the Next Generation of Artists',
      stat: '9 emerging artists',
      href: '/young-gunns',
      imageSelector: '#comp-mr69hwvh img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/nsplsh_5b5a3fc5c58a46f384bd44052dad52f8~mv2.jpg/v1/fill/w_960,h_600,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image%20by%20Neel%20Patel.jpg'
    }
  ];
  var mobileFilmCards = [
    {
      num: '01',
      title: 'Mahavatar Narsimha',
      blurb: 'Mythology-led animated feature mounted for cultural positioning, audience demand, monetisation and long-term IP growth.',
      href: '/mahavatar-narsimha-impact',
      titleSelector: '#comp-mqmi3w46',
      blurbSelector: '#comp-mqmi3w4a',
      imageSelector: '#comp-mqmi3w4b3 img',
      fallbackImage: '/assets/films/mahavatar-narsimha.jpg'
    },
    {
      num: '02',
      title: 'Hanuman Ansh',
      blurb: 'Spiritual entertainment IP shaped for faith communities, contemporary families and a long-term story universe.',
      href: '/hanuman-ansh-impact',
      titleSelector: '#comp-mqmi6yo71',
      blurbSelector: '#comp-mqmi6yob',
      imageSelector: '#comp-mqmi6yoc4 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_ca20c3bfe20b447fb264a2d00c44069e~mv2.png/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11_edited_edited.png'
    },
    {
      num: '03',
      title: 'Mahaprabhu Jagannath',
      blurb: 'Lord Jagannath cultural story positioned through devotion, community access, partnerships and new-generation storytelling.',
      href: '/mahaprabhu-jagannath-impact',
      titleSelector: '#comp-mqmi8cy13',
      blurbSelector: '#comp-mqmi8cy52',
      imageSelector: '#comp-mrbzj9mg img',
      fallbackImage: '/assets/films/mahaprabhu-jagannath.png'
    },
    {
      num: '04',
      title: 'Kalki',
      blurb: 'Future-facing mythology story connecting dharma, transformation, ancient Indian imagination and modern audience anticipation.',
      href: '/kalki-impact',
      titleSelector: '#comp-mqmi8suv6',
      blurbSelector: '#comp-mqmi8sv0',
      imageSelector: '#comp-mqmi8sv12 img',
      fallbackImage: '/assets/mirror/static.wixstatic.com/media/19f989_f84950fe51a84d3baf15f59a5c864731~mv2.jpg/v1/fill/w_720,h_720,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/kalki.jpg'
    }
  ];
  var desktopFilmCards = [
    {
      root: '#comp-mqmi3w3o',
      href: '/mahavatar-narsimha-impact',
      title: 'Mahavatar Narsimha',
      titleSelector: '#comp-mqmi3w46',
      badgesSelector: '#comp-mqmi3w484',
      blurbSelector: '#comp-mqmi3w4a',
      labelSelector: '#comp-mqmi3w4k',
      nameSelector: '#comp-mqmi3w4l3',
      focus: 'Mythology-Led Animation',
      meta: ['Animated Feature', 'Mythology IP', 'Audience Demand', 'Monetisation'],
      metaSelectors: ['#comp-mqmi3w3v3', '#comp-mqmi3w3x2', '#comp-mqmi3w3z', '#comp-mqmi3w41'],
      badges: 'Mythology-Led Animation | Audience Strategy | IP Growth',
      blurb: 'A culturally rooted animated feature mounted around mythology-led positioning, audience demand, partnerships, monetisation and long-term IP growth.'
    },
    {
      root: '#comp-mqmi6ynt2',
      href: '/hanuman-ansh-impact',
      title: 'Hanuman Ansh',
      titleSelector: '#comp-mqmi6yo71',
      badgesSelector: '#comp-mqmi6yo94',
      blurbSelector: '#comp-mqmi6yob',
      labelSelector: '#comp-mqmi6yol3',
      nameSelector: '#comp-mqmi6yom7',
      focus: 'Spiritual Entertainment',
      meta: ['Spiritual IP', 'Faith Communities', 'Family Audiences', 'Story Universe'],
      metaSelectors: ['#comp-mqmi6yny', '#comp-mqmi6ynz5', '#comp-mqmi6yo1', '#comp-mqmi6yo2'],
      badges: 'Spiritual Entertainment | Faith Communities | IP Development',
      blurb: 'A spiritual entertainment IP shaped to connect devotion-led communities, contemporary families and a long-term story universe.'
    },
    {
      root: '#comp-mqmi8cxm2',
      href: '/mahaprabhu-jagannath-impact',
      title: 'Mahaprabhu Jagannath',
      titleSelector: '#comp-mqmi8cy13',
      badgesSelector: '#comp-mqmi8cy4',
      blurbSelector: '#comp-mqmi8cy52',
      labelSelector: '#comp-mqmi8cyf',
      nameSelector: '#comp-mqmi8cyg2',
      focus: 'Devotional Culture',
      meta: ['Living Tradition', 'Devotional Story', 'Community Access', 'New-Gen Reach'],
      metaSelectors: ['#comp-mqmi8cxr2', '#comp-mqmi8cxt', '#comp-mqmi8cxu6', '#comp-mqmi8cxw'],
      badges: 'Devotional Culture | Community Access | Story Positioning',
      blurb: "A Lord Jagannath cultural story positioned through devotion, community access, partnerships and new-generation storytelling."
    },
    {
      root: '#comp-mqmi8sui',
      href: '/kalki-impact',
      title: 'Kalki',
      titleSelector: '#comp-mqmi8suv6',
      badgesSelector: '#comp-mqmi8suy3',
      blurbSelector: '#comp-mqmi8sv0',
      labelSelector: '#comp-mqmi8sv51',
      nameSelector: '#comp-mqmi8sv66',
      focus: 'Future Mythology',
      meta: ['Future Mythology', 'Dharma & Renewal', 'Audience Anticipation', 'Franchise Potential'],
      metaSelectors: ['#comp-mqmi8sul4', '#comp-mqmi8sun1', '#comp-mqmi8suo6', '#comp-mqmi8suq'],
      badges: 'Ancient Imagination | Future Mythology | Audience Anticipation',
      blurb: 'A future-facing mythology story connecting dharma, transformation, ancient Indian imagination and modern audience anticipation.'
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
    '/blank-9': true,
    '/about-9': true,
    '/music-production': true,
    '/course-bundle': true,
    '/roots-of-hindustani-classical': true,
    '/blank-9-1': true,
    '/about-9-1': true,
    '/affiliate': true,
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
    },
    {
      title: '#comp-mrdq85og5',
      description: '#comp-mrdq85oi3',
      date: '#comp-mrdq85ok',
      readTime: '#comp-mrdq85ol7',
      button: '#comp-mrdq85on2 a',
      mediumButton: '#comp-mrdq85oo5',
      image: '#comp-mrdq85of5 img'
    }
  ];

  function updateBlogCard(slot, card) {
    if (!card) return;
    ui.setText(slot.title, card.title);
    ui.setText(slot.description, card.description);
    ui.setText(slot.date, card.date);
    ui.setText(slot.readTime, card.readTime);
    ui.setImage(slot.image, card.image);
    ui.updateButton(slot.button, { href: card.href, target: '_self', label: 'Read Blog' });
    var button = document.querySelector(slot.button);
    if (button) {
      button.setAttribute('data-blog-href', card.href);
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(card.href);
      }, true);
    }
    ui.hideElement(slot.mediumButton);
  }

  function wireResourcesBlogClicks() {
    if (location.pathname !== '/resources' && location.pathname !== '/pages/resources.html') return;
    if (window.__tscResourcesBlogClickGuard) return;
    window.__tscResourcesBlogClickGuard = true;
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest && event.target.closest('.tsc-resources-blog-card a[data-blog-href], .tsc-resources-blog-card[data-blog-href]');
      if (!target) return;
      var href = target.getAttribute('data-blog-href') || (target.closest('.tsc-resources-blog-card') && target.closest('.tsc-resources-blog-card').getAttribute('data-blog-href'));
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      window.location.assign(href);
    }, true);
  }

  function injectResourcesBlogGrid() {
    if (location.pathname !== '/resources' && location.pathname !== '/pages/resources.html') return;
    var section = document.querySelector('#comp-mrdp2u69');
    var hero = document.querySelector('#comp-mpgmnan2');
    if (section && hero && hero.parentNode && hero.previousSibling !== section) {
      hero.parentNode.insertBefore(section, hero);
    }
    var container = section && section.querySelector('.comp-mrdp2u69-container');
    if (!container) return;
    var nativeGrid = container.querySelector('#comp-mrdq8d4s');
    if (nativeGrid) nativeGrid.remove();
    if (!document.getElementById('tsc-resources-blog-style')) {
      var style = document.createElement('style');
      style.id = 'tsc-resources-blog-style';
      style.textContent =
        '#comp-mrdp2u69{grid-area:2/1/3/2!important}' +
        '#comp-mpgmnan2{grid-area:3/1/4/2!important}' +
        '#comp-mrdp2u69,#comp-mrdp2u69 .comp-mrdp2u69-container{height:auto!important;min-height:0!important;overflow:visible!important}' +
        '#comp-mrdp2u69 .comp-mrdp2u69-container{position:relative!important;z-index:1!important;display:grid!important;grid-template-columns:minmax(0,.92fr) minmax(420px,1.08fr)!important;grid-template-rows:auto auto!important;align-items:end!important;column-gap:clamp(56px,8vw,160px)!important;row-gap:34px!important;padding:84px max(6vw,80px) 64px!important;box-sizing:border-box!important;pointer-events:auto!important}' +
        '#comp-mrdpc84n,#comp-mrdpc824{position:relative!important;left:auto!important;top:auto!important;width:100%!important;height:auto!important;margin:0!important;grid-area:auto!important;transform:none!important;overflow:visible!important}' +
        '#comp-mrdpc84n{grid-column:1!important;grid-row:1!important}' +
        '#comp-mrdpc824{grid-column:2!important;grid-row:1!important;max-width:650px!important;align-self:center!important}' +
        '#comp-mrdpc84n,#comp-mrdpc824,#comp-mrdpc84n .wixui-rich-text__text,#comp-mrdpc824 .wixui-rich-text__text{color:#ffecd1!important}' +
        '#comp-mrdpc84n,#comp-mrdpc84n .wixui-rich-text__text{font-size:clamp(64px,5vw,90px)!important;line-height:.94!important;letter-spacing:-.02em!important}' +
        '#comp-mrdpc824,#comp-mrdpc824 .wixui-rich-text__text{font-size:clamp(22px,1.65vw,30px)!important;line-height:1.32!important;letter-spacing:-.01em!important}' +
        '#comp-mrdq8d4s{display:none!important}' +
        '.tsc-resources-blog-grid{grid-column:1/-1!important;grid-row:2!important;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;width:100%;margin-top:24px}' +
        '.tsc-resources-blog-card{display:flex;flex-direction:column;min-width:0;padding:14px;border:1px solid #b74b02;border-radius:8px;background:#ffecd1;color:#083d3a;box-sizing:border-box;overflow:hidden}' +
        '.tsc-resources-blog-card img{display:block;width:100%;aspect-ratio:16/9;border:1px solid #126d5e;border-radius:6px;object-fit:cover;box-sizing:border-box}' +
        '.tsc-resources-blog-meta{display:flex;justify-content:space-between;gap:12px;margin:10px 0;color:#126d5e;font-family:"Madefor Text",sans-serif;font-size:11px;font-weight:700;text-transform:uppercase}' +
        '.tsc-resources-blog-card h3{margin:0;color:#083d3a;font-family:Signika,"Madefor Text",sans-serif;font-size:20px;line-height:1.15}' +
        '.tsc-resources-blog-card p{flex:1;margin:10px 0 16px;color:#083d3a;font-family:"Madefor Text",sans-serif;font-size:14px;line-height:1.45}' +
        '.tsc-resources-blog-card a{align-self:center;display:inline-flex;align-items:center;justify-content:center;min-width:132px;min-height:40px;padding:9px 16px;border-radius:8px;background:#126d5e;color:#ffecd1;font-family:"Madefor Text",sans-serif;font-size:12px;font-weight:800;text-decoration:none;box-sizing:border-box}' +
        '@media(max-width:1024px){#comp-mrdp2u69 .comp-mrdp2u69-container{display:flex!important;flex-direction:column!important;gap:20px!important;padding:28px 16px 40px!important}#comp-mrdpc84n,#comp-mrdpc824{order:initial!important}#comp-mrdpc84n,#comp-mrdpc84n .wixui-rich-text__text{font-size:clamp(42px,13vw,64px)!important;line-height:.98!important}#comp-mrdpc824,#comp-mrdpc824 .wixui-rich-text__text{font-size:18px!important;line-height:1.35!important}.tsc-resources-blog-grid{grid-template-columns:repeat(2,minmax(0,1fr));margin-top:4px}.tsc-resources-blog-card h3{font-size:18px}}' +
        '@media(max-width:640px){.tsc-resources-blog-grid{grid-template-columns:1fr;gap:18px}}';
      document.head.appendChild(style);
    }
    var existing = container.querySelector('.tsc-resources-blog-grid');
    if (existing) existing.remove();
    var grid = document.createElement('div');
    grid.className = 'tsc-resources-blog-grid';
    grid.setAttribute('aria-label', 'All blog posts');
    grid.innerHTML = resourcesBlogCards.map(function (card) {
      return [
        '<article class="tsc-resources-blog-card" data-blog-href="' + ui.escapeHtml(card.href) + '">',
        '<img src="' + ui.escapeHtml(card.image.src) + '" alt="' + ui.escapeHtml(card.image.alt) + '">',
        '<div class="tsc-resources-blog-meta"><span>' + ui.escapeHtml(card.date) + '</span><span>' + ui.escapeHtml(card.readTime) + '</span></div>',
        '<h3>' + ui.escapeHtml(card.title) + '</h3>',
        '<p>' + ui.escapeHtml(card.description) + '</p>',
        '<a href="' + ui.escapeHtml(card.href) + '" data-blog-href="' + ui.escapeHtml(card.href) + '">Read Blog</a>',
        '</article>'
      ].join('');
    }).join('');
    container.appendChild(grid);
    wireResourcesBlogClicks();
  }

  function blogPathForCurrentPage() {
    var path = normalizedPath();
    var aliases = {
      '/blog-1': '/start-making-music',
      '/blog-2': '/online-music-course-worth-it',
      '/blog-3': '/artist-release-playbook'
    };
    if (path.indexOf('/resources/') === 0) {
      path = '/' + path.split('/').filter(Boolean).pop();
    }
    return aliases[path] || path;
  }

  function currentBlogIndex() {
    var path = blogPathForCurrentPage();
    for (var i = 0; i < resourcesBlogCards.length; i += 1) {
      if (resourcesBlogCards[i].href === path) return i;
    }
    return -1;
  }

  function syncBlogArticleNavigation(prev, next) {
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var text = (anchor.textContent || anchor.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (/^previous article$/i.test(text)) {
        anchor.setAttribute('href', prev.href);
        anchor.setAttribute('target', '_self');
      } else if (/^next article$/i.test(text)) {
        anchor.setAttribute('href', next.href);
        anchor.setAttribute('target', '_self');
      } else if (/^(back to resources|all blogs)$/i.test(text)) {
        anchor.setAttribute('href', '/resources');
        anchor.setAttribute('target', '_self');
      }
    });
  }

  function injectBlogArticleDirectory() {
    var currentIndex = currentBlogIndex();
    if (currentIndex < 0) return;
    var current = resourcesBlogCards[currentIndex];
    var prev = resourcesBlogCards[(currentIndex - 1 + resourcesBlogCards.length) % resourcesBlogCards.length];
    var next = resourcesBlogCards[(currentIndex + 1) % resourcesBlogCards.length];
    syncBlogArticleNavigation(prev, next);
    if (document.querySelector('.tsc-blog-directory')) return;
    var section = document.createElement('section');
    section.className = 'tsc-blog-directory';
    section.setAttribute('aria-label', 'More blog articles');
    section.innerHTML = [
      '<div class="tsc-blog-directory__inner">',
      '<div class="tsc-blog-directory__nav">',
      '<a class="tsc-blog-directory__navlink" href="' + ui.escapeHtml(prev.href) + '">Previous article</a>',
      '<a class="tsc-blog-directory__back" href="/resources">All blogs</a>',
      '<a class="tsc-blog-directory__navlink" href="' + ui.escapeHtml(next.href) + '">Next article</a>',
      '</div>',
      '<h2>More From the Blog</h2>',
      '<div class="tsc-blog-directory__grid">',
      resourcesBlogCards.map(function (card) {
        var active = card.href === current.href;
        return [
          '<article class="tsc-blog-directory__card' + (active ? ' is-current' : '') + '">',
          '<img src="' + ui.escapeHtml(card.image.src) + '" alt="' + ui.escapeHtml(card.image.alt) + '" loading="lazy">',
          '<div class="tsc-blog-directory__meta">' + ui.escapeHtml(card.date) + ' / ' + ui.escapeHtml(card.readTime) + '</div>',
          '<h3>' + ui.escapeHtml(card.title) + '</h3>',
          '<p>' + ui.escapeHtml(card.description) + '</p>',
          '<a href="' + ui.escapeHtml(card.href) + '"' + (active ? ' aria-current="page"' : '') + '>' + (active ? 'Current Blog' : 'Read Blog') + '</a>',
          '</article>'
        ].join('');
      }).join(''),
      '</div>',
      '</div>'
    ].join('');
    var footer = document.querySelector('footer#SITE_FOOTER, footer[data-testid="siteFooter"], footer');
    var main = document.querySelector('main') || document.getElementById('PAGES_CONTAINER') || document.body;
    if (footer && footer.parentNode) footer.parentNode.insertBefore(section, footer);
    else main.appendChild(section);
  }

  function updateResourcesBlogSection() {
    if (location.pathname !== '/resources' && location.pathname !== '/pages/resources.html') return;
    document.querySelectorAll('.tsc-medium-blog-band').forEach(function (section) {
      section.remove();
    });
    ui.setText('#comp-mrdpc84n', 'From the Blog');
    ui.setText('#comp-mrdpc824', 'Guides and insights from TSC');
    resourcesCardSlots.forEach(function (slot, index) {
      updateBlogCard(slot, resourcesBlogCards[index]);
    });
    // Unhide third card host if previously hidden
    var third = document.querySelector('#comp-mrdq85ob');
    if (third) third.style.removeProperty('display');
    injectResourcesBlogGrid();
    wireResourcesBlogClicks();
  }

  function repairResourcesCourseLinks() {
    if (location.pathname !== '/resources' && location.pathname !== '/pages/resources.html') return;
    var courseMap = {
      '/academy/music-production': '/music-production',
      '/courses/music-production': '/music-production',
      '/about-9': '/the-heart-of-composition',
      '/blank-9': '/the-heart-of-composition',
      '/about-9-1': '/roots-of-hindustani-classical',
      '/blank-9-1': '/roots-of-hindustani-classical'
    };
    document.querySelectorAll('a[href]').forEach(function (anchor) {
      try {
        var url = new URL(anchor.getAttribute('href'), location.origin);
        var cleanPath = url.pathname.replace(/\/+$/, '') || '/';
        var mapped = courseMap[cleanPath];
        if (!mapped) return;
        anchor.setAttribute('href', mapped + url.search + url.hash);
        anchor.setAttribute('target', '_self');
      } catch (e) { }
    });
  }

  function repairAcademyCourseDropdownLinks() {
    var path = normalizedPath();
    if (path !== '/academy' && path !== '/learn-with-tsc' && path !== '/course-bundle' && path !== '/music-production' && path !== '/the-heart-of-composition' && path !== '/roots-of-hindustani-classical') return;
    var courses = [
      { href: '/course-bundle', label: 'All Courses Bundle', match: /bundle|all courses/i },
      { href: '/music-production', label: 'A-Z of Music Production', match: /a[\s-]*z|music production/i },
      { href: '/the-heart-of-composition', label: 'The HeART of Composition', match: /heart|composition/i },
      { href: '/roots-of-hindustani-classical', label: 'Roots of Hindustani Classical', match: /roots|hindustani|classical/i }
    ];

    document.querySelectorAll('a[href]').forEach(function (anchor) {
      var text = (anchor.textContent || '').replace(/\s+/g, ' ').trim();
      courses.forEach(function (course) {
        if (!course.match.test(text)) return;
        anchor.setAttribute('href', course.href);
        anchor.setAttribute('target', '_self');
      });
    });

    document.querySelectorAll('details').forEach(function (details) {
      var summary = details.querySelector('summary');
      if (!summary || !/courses?/i.test(summary.textContent || '')) return;
      var dropdown = details.querySelector('div') || details;
      courses.slice().reverse().forEach(function (course) {
        var existing = Array.prototype.find.call(dropdown.querySelectorAll('a'), function (anchor) {
          return anchor.getAttribute('href') === course.href || course.match.test(anchor.textContent || '');
        });
        if (existing) {
          existing.href = course.href;
          existing.target = '_self';
          existing.textContent = course.label;
          return;
        }
        var link = document.createElement('a');
        link.href = course.href;
        link.target = '_self';
        link.textContent = course.label;
        dropdown.insertBefore(link, dropdown.firstChild);
      });
    });

    document.querySelectorAll('ul.wixui-dropdown-menu').forEach(function (menu) {
      var text = (menu.textContent || '').replace(/\s+/g, ' ').trim();
      if (!/HeART of Composition/i.test(text) || !/Roots of Hindustani Classical/i.test(text)) return;
      var anchors = Array.prototype.slice.call(menu.querySelectorAll('a'));
      anchors.forEach(function (anchor) {
        courses.forEach(function (course) {
          if (!course.match.test(anchor.textContent || '')) return;
          anchor.href = course.href;
          anchor.target = '_self';
        });
      });
      if (anchors.some(function (anchor) { return new URL(anchor.href, location.origin).pathname === '/music-production'; })) return;
      var sampleLink = anchors[0];
      var sampleItem = sampleLink && sampleLink.closest('li');
      var item = document.createElement('li');
      item.setAttribute('data-item-depth', '1');
      if (sampleItem) item.className = sampleItem.className || '';
      var link = document.createElement('a');
      link.href = '/music-production';
      link.target = '_self';
      link.className = sampleLink ? sampleLink.className : 'ptLEUT eP1KVV x0UOau wixui-dropdown-menu__item has-inner-focus-ring';
      link.setAttribute('data-testid', 'linkElement');
      link.setAttribute('data-part', 'dropdown-item');
      var span = document.createElement('span');
      span.className = 'u9_aLl wixui-dropdown-menu__item-label';
      span.setAttribute('data-part', 'dropdown-item-label');
      span.setAttribute('data-testid', 'submenu-item-label');
      span.textContent = 'A-Z of Music Production';
      link.appendChild(span);
      item.appendChild(link);
      menu.insertBefore(item, menu.firstChild);
      menu.style.setProperty('--items-number', String(menu.querySelectorAll(':scope > li').length));
    });
  }

  /* Card thumb = BLU05000 (converted ARW preview). Cache-bust when RAWs refresh. */
  var LUCA_COURSE_CARD_IMAGE = '/assets/luca/luca-production-session.jpg?v=luca-blu05000-3';
  var LUCA_COURSE_CARD_ALT = 'Luca Petracca in a music production studio';
  var BUNDLE_COURSE_CARD_IMAGE = '/assets/course-bundle/all-mentors.jpg?v=bundle-mentors-1';
  var BUNDLE_COURSE_CARD_ALT = 'Sandesh Shandilya, Prasad Khaparde, and Luca Petracca';
  var LUCA_COURSE_IMAGES = {
    hero: '/assets/luca/luca-hero.jpg?v=luca-blu04463-2',
    portrait: '/assets/luca/luca-petracca-studio-portrait.jpg?v=luca-blu04151-3',
    /* Three mentor-stat tiles — one ARW each (no shared source). */
    masterclass: '/assets/luca/luca-petracca-course-wide.jpg?v=luca-blu04463-3',
    laptop: '/assets/luca/luca-production-session.jpg?v=luca-blu05000-3',
    teaching: '/assets/luca/luca-petracca-studio-portrait.jpg?v=luca-blu04151-3'
  };
  var ACADEMY_BUNDLE_IMAGES = [
    {
      src: '/assets/mirror/static.wixstatic.com/media/19f989_731e678e8fce4048864da9ec987ec897~mv2.jpg/v1/fill/w_454,h_182,fp_0.47_0.40,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/sandesh.jpg',
      alt: 'Sandesh Shandilya composition course'
    },
    {
      src: '/assets/mirror/static.wixstatic.com/media/19f989_07c6e896e4a54fcc99b08a98ceccaff4~mv2.jpg/v1/fill/w_640,h_640,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/prasad-hero.jpg',
      alt: 'Prasad Khaparde Hindustani classical course'
    },
    {
      src: LUCA_COURSE_CARD_IMAGE,
      alt: LUCA_COURSE_CARD_ALT
    }
  ];

  /* Surgical Luca card image only — allowed on desktop; does not rewrite other Academy cards. */
  function ensureLucaCourseCardImage() {
    if (normalizedPath() !== '/academy' && normalizedPath() !== '/learn-with-tsc') return;
    var img =
      document.querySelector('#img-comp-mpjxxere2 img') ||
      document.querySelector('#comp-mpjxxere2 img') ||
      document.querySelector('#img-comp-mrufx9s5 img') ||
      document.querySelector('#comp-mrufx9s5 img');
    if (!img) return;
    if (img.dataset.tscLucaCardImage === '2' && (img.getAttribute('src') || '').indexOf('luca-petracca-course-wide') !== -1) {
      return;
    }
    img.removeAttribute('srcset');
    img.removeAttribute('data-src');
    img.loading = 'eager';
    img.removeAttribute('loading');
    img.src = LUCA_COURSE_CARD_IMAGE;
    img.alt = LUCA_COURSE_CARD_ALT;
    img.style.setProperty('object-fit', 'cover', 'important');
    img.style.setProperty('object-position', '48% 42%', 'important');
    img.dataset.tscLucaCardImage = '2';
    if (typeof img.decode === 'function') {
      img.decode().catch(function () { });
    }
  }

  function ensureLucaCourseCardLinks() {
    if (normalizedPath() !== '/academy') return;
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    ensureLucaCourseCardImage();

    // Soft link fix only — never replaceChild (breaks Wix React hydration).
    // Desktop: href/cursor only — no hitarea inject / no mobile mirror cards (desktop lock).
    try {
      document.querySelectorAll('#comp-mpjxxeqt a[href], #comp-mpjxxery4 a[href]').forEach(function (a) {
        a.setAttribute('href', '/music-production');
        a.setAttribute('target', '_self');
      });
      var lucaButton = document.querySelector('#comp-mpjxxery4');
      if (lucaButton) {
        lucaButton.setAttribute('role', 'link');
        lucaButton.setAttribute('tabindex', '0');
        lucaButton.setAttribute('aria-label', 'Open A-Z of Music Production course');
        lucaButton.style.cursor = 'pointer';
        if (compact) {
          lucaButton.style.position = 'relative';
          if (!lucaButton.querySelector('.tsc-luca-course-hitarea')) {
            var hitarea = document.createElement('a');
            hitarea.className = 'tsc-luca-course-hitarea';
            hitarea.href = '/music-production';
            hitarea.target = '_self';
            hitarea.setAttribute('aria-label', 'Open A-Z of Music Production course');
            hitarea.setAttribute(
              'style',
              'position:absolute;inset:0;z-index:30;border-radius:inherit;text-indent:-9999px;overflow:hidden;background:transparent'
            );
            hitarea.textContent = 'Open A-Z of Music Production course';
            lucaButton.appendChild(hitarea);
          }
        }
        if (lucaButton.dataset.tscLucaLinkWired !== '1') {
          lucaButton.dataset.tscLucaLinkWired = '1';
          lucaButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            window.location.assign('/music-production');
          }, true);
          lucaButton.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            event.stopPropagation();
            window.location.assign('/music-production');
          }, true);
        }
      }
      var lucaCard = document.querySelector('#comp-mpjxxeqt');
      if (lucaCard) {
        lucaCard.style.cursor = 'pointer';
        if (lucaCard.dataset.tscLucaCardWired !== '1') {
          lucaCard.dataset.tscLucaCardWired = '1';
          lucaCard.addEventListener('click', function (event) {
            if (event.target && event.target.closest && event.target.closest('a, button, input, textarea, select')) return;
            window.location.assign('/music-production');
          });
        }
      }
    } catch (e) { }

    // Mobile-only fallbacks — never inject into locked desktop Academy home.
    if (!compact) {
      document.querySelectorAll('.tsc-affiliate-cta, .tsc-luca-course-card').forEach(function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
      return;
    }

    // If Wix failed to mount course 3, inject a lightweight mirror card.
    var live = document.querySelector('#comp-mpjxxeqt');
    var visible = false;
    try {
      visible =
        !!live &&
        getComputedStyle(live).display !== 'none' &&
        live.getBoundingClientRect().height > 40;
    } catch (e) { }

    if (!visible && !document.querySelector('.tsc-luca-course-card')) {
      var mount = document.querySelector('main') || document.body;
      if (mount) {
        var card = document.createElement('article');
        card.className = 'tsc-luca-course-card';
        card.setAttribute('aria-label', 'A-Z of Music Production');
        card.setAttribute(
          'style',
          'display:block;margin:20px 16px;padding:22px 18px;border:1px solid rgba(255,236,209,.28);border-radius:12px;background:rgba(8,61,58,.55);color:#ffecd1;box-sizing:border-box;max-width:720px'
        );
        card.innerHTML =
          '<img class="tsc-luca-course-thumb" src="' + LUCA_COURSE_CARD_IMAGE + '" alt="' + LUCA_COURSE_CARD_ALT + '" style="display:block;width:100%;max-height:220px;object-fit:cover;object-position:48% 42%;border-radius:10px;margin:0 0 14px">' +
          '<p class="tsc-luca-kicker" style="margin:0;font-size:12px;letter-spacing:.08em;opacity:.75">03</p>' +
          '<h2 style="margin:6px 0 8px;font-size:22px;line-height:1.25;color:#ffecd1">A-Z of Music Production</h2>' +
          '<p class="tsc-luca-mentor" style="margin:0 0 10px;font-size:14px;opacity:.9">Luca Petracca</p>' +
          '<p style="margin:0;line-height:1.45">Master recording, arrangement, mixing, and mastering for your songs — end to end.</p>' +
          '<a class="tsc-luca-cta" href="/music-production" style="display:inline-flex;margin-top:14px;padding:10px 16px;border-radius:999px;background:#b74b02;color:#fff;text-decoration:none;font-size:14px;font-weight:600">Know More</a>';
        mount.appendChild(card);
      }
    }

    if (!document.querySelector('.tsc-affiliate-cta')) {
      var host = document.querySelector('main') || document.body;
      if (host) {
        var cta = document.createElement('a');
        cta.className = 'tsc-affiliate-cta';
        cta.href = '/affiliate';
        cta.textContent = 'Affiliate Program';
        cta.setAttribute('aria-label', 'TSC Academy Affiliate Program');
        host.appendChild(cta);
      }
    }
  }

  function polishMobileAcademyCourseCards() {
    if (normalizedPath() !== '/academy') return;
    if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;

    function setRichHtml(selector, html) {
      var el = document.querySelector(selector);
      if (!el || el.dataset.tscCoursePolished === '1') return;
      el.innerHTML = html;
      el.dataset.tscCoursePolished = '1';
    }

    setRichHtml(
      '#comp-mpjxmoth2',
      '<p class="font_2 wixui-rich-text__text">Rampur Sahaswan Gharana Master</p>' +
      '<p class="font_2 wixui-rich-text__text">30+ Years Experience</p>' +
      '<p class="font_2 wixui-rich-text__text">Legendary Classical Vocalist</p>'
    );
    setRichHtml(
      '#comp-mpjxxerw',
      '<p class="font_2 wixui-rich-text__text">International Practical Masterclass</p>' +
      '<p class="font_2 wixui-rich-text__text">Laptop-Based Production</p>' +
      '<p class="font_2 wixui-rich-text__text">17+ Years Teaching</p>'
    );
    setRichHtml(
      '#comp-mpjxxerx1',
      '<h2 class="font_2 wixui-rich-text__text">Master the end-to-end process of producing professional music using only a laptop. From melody and chords to recording, production, mixing and mastering, Luca Petracca guides you through hands-on projects.</h2>'
    );
    setRichHtml(
      '#comp-mrg3zuhs',
      '<img class="tsc-luca-course-thumb" src="' + LUCA_COURSE_CARD_IMAGE + '" alt="' + LUCA_COURSE_CARD_ALT + '">'
    );
    ['#comp-mrg3xrfp', '#comp-mrg3zuhs'].forEach(function (selector) {
      var node = document.querySelector(selector);
      if (!node) return;
      node.removeAttribute('aria-hidden');
      node.style.setProperty('display', 'block', 'important');
      node.style.setProperty('visibility', 'visible', 'important');
      node.style.setProperty('opacity', '1', 'important');
    });
    ensureLucaCourseCardImage();
    ensureAcademyBundleCourseCard();
  }

  function ensureAcademyBundleCourseCard() {
    if (normalizedPath() !== '/academy') return;
    if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
    if (document.querySelector('.tsc-academy-bundle-card')) return;
    var lucaCard = document.querySelector('#comp-mpjxxeqt') || document.querySelector('.tsc-luca-course-card');
    if (!lucaCard || !lucaCard.parentNode) return;

    var card = document.createElement('article');
    card.className = 'tsc-academy-bundle-card';
    card.setAttribute('aria-label', 'All Courses Bundle');
    card.innerHTML = [
      '<div class="tsc-academy-bundle-card__title"><span>04</span><strong>All Courses Bundle</strong></div>',
      '<div class="tsc-academy-bundle-card__media tsc-academy-bundle-card__media-single">',
      '<img src="' + ui.escapeHtml(BUNDLE_COURSE_CARD_IMAGE) + '" alt="' + ui.escapeHtml(BUNDLE_COURSE_CARD_ALT) + '">',
      '</div>',
      '<div class="tsc-academy-bundle-card__mentor"><span>Mentors</span><strong>SANDESH + PRASAD + LUCA</strong></div>',
      '<div class="tsc-academy-bundle-card__copy">',
      '<p>Composition, Hindustani classical foundations, and music production brought together as one complete artist learning path.</p>',
      '</div>',
      '<div class="tsc-academy-bundle-card__stats">',
      '<span>3 Courses</span>',
      '<span>₹12,000 Value</span>',
      '<span>Now ₹9,999</span>',
      '<span>One Enrollment</span>',
      '</div>',
      '<a class="tsc-academy-bundle-card__cta" href="/course-bundle">Know More</a>'
    ].join('');
    lucaCard.insertAdjacentElement('afterend', card);
  }

  var academyDesktopCourseCards = [
    {
      href: '/the-heart-of-composition',
      imageSelector: '#img-comp-mpjo65q32 img',
      imageSrc: '/assets/mirror/static.wixstatic.com/media/19f989_731e678e8fce4048864da9ec987ec897~mv2.jpg/v1/fill/w_852,h_341,fp_0.47_0.40,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/sandesh.jpg',
      imageAlt: 'Sandesh Shandilya',
      buttonSelector: '#comp-mpjo65qn',
      fields: [
        ['#comp-mpjo65q93', '01'],
        ['#comp-mpjo65qb', 'The heART of Composition'],
        ['#comp-mpjo65qc', '6 Months'],
        ['#comp-mpjo65qd3', '200+ Mins Content'],
        ['#comp-mpjo65qe6', '3 Live Sessions'],
        ['#comp-mpjo65qg', 'Industry Mentorship'],
        ['#comp-mpjo65qk', 'Mentor'],
        ['#comp-mpjo65qi4', 'SANDESH SHANDILYA'],
        ['#comp-mpjo65ql3', 'Dive deeper into advanced composition techniques with this comprehensive 6-month course. Learn the art of imagination, emotion to expression, and mainstream mastery directly from a legend.']
      ],
      badgesSelector: '#comp-mpjwvo70',
      badges: ['Acclaimed Music Composer', '30+ Years Experience', '7Bn+ Streams']
    },
    {
      href: '/roots-of-hindustani-classical',
      imageSelector: '#img-comp-mpjxmot0 img',
      imageAlt: 'Pandit Prasad Khaparde',
      buttonSelector: '#comp-mpjxmotk',
      fields: [
        ['#comp-mpjxmot64', '02'],
        ['#comp-mpjxmot8', 'Roots of Hindustani Classical'],
        ['#comp-mpjxmot92', '6 Months'],
        ['#comp-mpjxmota5', '300+ Mins Content'],
        ['#comp-mpjxmotb6', '3+ Live Sessions'],
        ['#comp-mpjxmotc9', 'Certification'],
        ['#comp-mpjxmotf', 'Mentor'],
        ['#comp-mpjxmotg2', 'PRASAD KHAPARDE'],
        ['#comp-mpjxmoti5', 'Immerse yourself in the timeless art of Hindustani classical singing. Twelve exclusive online group sessions, quality assessments, and certification under the guidance of Pandit Prasad Khaparde.']
      ],
      badgesSelector: '#comp-mpjxmoth2',
      badges: ['Rampur Sahaswan Gharana Master', '30+ Years Experience', 'Legendary Classical Vocalist']
    },
    {
      href: '/music-production',
      imageSelector: '#img-comp-mpjxxere2 img',
      imageSrc: LUCA_COURSE_CARD_IMAGE,
      imageAlt: LUCA_COURSE_CARD_ALT,
      buttonSelector: '#comp-mpjxxery4',
      fields: [
        ['#comp-mpjxxerk', '03'],
        ['#comp-mpjxxerm', 'A-Z of Music Production'],
        ['#comp-mpjxxern1', 'Laptop Production'],
        ['#comp-mpjxxero6', 'Hands-on Projects'],
        ['#comp-mpjxxerq', 'Mixing & Mastering'],
        ['#comp-mpjxxerr2', 'Certification'],
        ['#comp-mpjxxert4', 'Mentor'],
        ['#comp-mpjxxerv', 'LUCA PETRACCA'],
        ['#comp-mpjxxerx1', 'A practical international masterclass in end-to-end track creation, built for artists who want to produce professional music using only a laptop.']
      ],
      badgesSelector: '#comp-mpjxxerw',
      badges: ['Music Producer & Composer', '17+ Years Teaching', 'Laptop-Based Production'],
      hideSelectors: ['#comp-mrg3zuhs', '#comp-mrg3xrfp']
    }
  ];

  function setAcademyBadgeList(selector, badges) {
    var node = document.querySelector(selector);
    if (!node || !badges || !badges.length) return;
    node.innerHTML =
      '<ul class="font_2 wixui-rich-text__text">' +
      badges.map(function (badge) {
        return '<li class="wixui-rich-text__text"><p class="font_2 wixui-rich-text__text">' + ui.escapeHtml(badge) + '</p></li>';
      }).join('') +
      '</ul>';
  }

  function forceRichText(selector, value, tagName) {
    var node = document.querySelector(selector);
    if (!node) return;
    tagName = tagName || 'h2';
    node.innerHTML = '<' + tagName + ' class="font_2 wixui-rich-text__text"><span class="wixui-rich-text__text">' + ui.escapeHtml(value) + '</span></' + tagName + '>';
  }

  function repairAcademyCourseCards() {
    var path = normalizedPath();
    if (path !== '/academy' && path !== '/learn-with-tsc') return;
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    ensureLucaCourseCardImage();
    academyDesktopCourseCards.forEach(function (card) {
      card.fields.forEach(function (field) {
        forceRichText(field[0], field[1], field[0] === '#comp-mpjxxerx1' || field[0] === '#comp-mpjo65ql3' || field[0] === '#comp-mpjxmoti5' ? 'h2' : 'h2');
      });
      setAcademyBadgeList(card.badgesSelector, card.badges);
      if (card.imageSelector && card.imageSrc) {
        ui.setImage(card.imageSelector, {
          src: card.imageSrc,
          alt: card.imageAlt || '',
          objectFit: 'cover',
          objectPosition: '50% 50%'
        });
      } else if (card.imageSelector) {
        var img = document.querySelector(card.imageSelector);
        if (img && card.imageAlt) img.alt = card.imageAlt;
      }
      setButtonLink(document.querySelector(card.buttonSelector), card.href);
      var mediaLink = document.querySelector(card.imageSelector) && document.querySelector(card.imageSelector).closest('a[href]');
      if (mediaLink) {
        mediaLink.setAttribute('href', card.href);
        mediaLink.setAttribute('target', '_self');
      }
      (card.hideSelectors || []).forEach(function (selector) {
        if (compact) return;
        var node = document.querySelector(selector);
        if (!node) return;
        node.style.setProperty('display', 'none', 'important');
        node.setAttribute('aria-hidden', 'true');
      });
    });
  }

  function polishMobileMusicProductionPage() {
    var path = normalizedPath();
    if (path !== '/music-production' && path !== '/pages/music-production.html') return;

    function setRichHtml(selector, html) {
      var el = document.querySelector(selector);
      if (!el || el.dataset.tscMusicProductionPolished === '1') return;
      el.innerHTML = html;
      el.dataset.tscMusicProductionPolished = '1';
    }

    function setCourseImage(selector, src, alt, objectPosition) {
      var img = document.querySelector(selector);
      if (!img) return;
      var alreadyGood =
        img.dataset.tscMusicProductionImage === '2' &&
        (img.getAttribute('src') || '') === src;
      if (alreadyGood) return;
      img.removeAttribute('srcset');
      img.removeAttribute('data-src');
      img.loading = 'eager';
      img.removeAttribute('loading');
      img.src = src;
      img.alt = alt;
      img.style.setProperty('object-fit', 'cover', 'important');
      img.style.setProperty('object-position', objectPosition || '50% 50%', 'important');
      img.dataset.tscMusicProductionImage = '2';
      if (typeof img.decode === 'function') {
        img.decode().catch(function () { });
      }
    }

    setRichHtml('#comp-mpmj3dm7', '<h1 class="font_2 wixui-rich-text__text">A-Z of Music Production</h1>');
    setRichHtml('#comp-mpmj3dno8', '<p class="font_8 wixui-rich-text__text">A practical international masterclass teaching end-to-end music production for artists using only a laptop.</p>');
    setRichHtml(
      '#comp-mpmvpcgf',
      '<p class="font_8 wixui-rich-text__text">This practical learning program by Luca Petracca teaches you how to take an idea to a finished track: crafting melodies, understanding chord progressions and harmonic functions, shaping sounds with virtual instruments, arranging song forms across genres, recording clean takes with laptop-friendly gear, applying production, mixing and mastering techniques.</p>'
    );
    setRichHtml(
      '#comp-mpmvpezz',
      '<p class="font_8 wixui-rich-text__text">Modules cover essential topics with hands-on projects so you can produce professional-sounding songs without expensive studio gear.</p>'
    );
    setRichHtml('#comp-mpu7z3t2', '<p class="font_8 wixui-rich-text__text">LUCA PETRACCA</p>');
    setRichHtml(
      '#comp-mpu7u82h',
      '<p class="font_8 wixui-rich-text__text">Hi, I am Luca Petracca, a music producer and composer from Italy. I learned classical guitar from the Conservatory S. Cecilia of Rome before moving to the Netherlands to study classical composition at the Conservatorium van Amsterdam. Traveling across the globe, I have been teaching music for more than 17 years and have produced multiple tracks. I am here to help you find the right questions. With this, let us dive into the A-Z of Music Production.</p>'
    );
    setRichHtml('#comp-mpu80o0a', '<p class="font_8 wixui-rich-text__text">Music Producer & Composer</p>');
    setRichHtml('#comp-mpu8628h', '<p class="font_8 wixui-rich-text__text">Classical Guitar & Composition</p>');
    setRichHtml('#comp-mpu86yn7', '<p class="font_8 wixui-rich-text__text">17+ Years Teaching</p>');
    setRichHtml('#comp-mpmizynh', '<h3 class="font_5 wixui-rich-text__text">Melody, Chords and Harmony</h3>');
    setRichHtml('#comp-mpmizynl', '<p class="font_8 wixui-rich-text__text">Craft melodies, understand chord progressions, and use harmonic functions with purpose.</p>');
    setRichHtml('#comp-mpmizyo2', '<h3 class="font_5 wixui-rich-text__text">Genres, Song Forms and Sounds</h3>');
    setRichHtml('#comp-mpmizyo4', '<p class="font_8 wixui-rich-text__text">Arrange common song forms across genres and shape sounds with virtual instruments.</p>');
    setRichHtml('#comp-mpmizyok5', '<h3 class="font_5 wixui-rich-text__text">Recording and Production</h3>');
    setRichHtml('#comp-mpmizyom4', '<p class="font_8 wixui-rich-text__text">Record clean takes with laptop-friendly gear and build complete productions.</p>');
    setRichHtml('#comp-mpmizyp2', '<h3 class="font_5 wixui-rich-text__text">FX, Mixing and Mastering</h3>');
    setRichHtml('#comp-mpmizyp39', '<p class="font_8 wixui-rich-text__text">Apply effects processing, balance mixes, and master finished tracks for release.</p>');
    setRichHtml('#comp-mpny86eb', '<p class="font_8 wixui-rich-text__text">Create professional-sounding songs without expensive studio gear.</p>');

    setCourseImage('#img-comp-mpmj3doh img', LUCA_COURSE_IMAGES.hero, 'Luca Petracca producing music on keyboard in studio', '48% 58%');
    setCourseImage('#img-comp-mpu7qgfn img', LUCA_COURSE_IMAGES.portrait, 'Luca Petracca at a keyboard in the studio', '46% 54%');
    setCourseImage('#img-comp-mpu8m8vg img', LUCA_COURSE_IMAGES.masterclass, 'Luca Petracca with guitar in the studio', '48% 42%');
    setCourseImage('#img-comp-mpu8nwd9 img', LUCA_COURSE_IMAGES.laptop, 'Luca Petracca in a music production session', '50% 45%');
    setCourseImage('#img-comp-mpu8o6tu img', LUCA_COURSE_IMAGES.teaching, 'Luca Petracca teaching music production', '50% 36%');

    [
      '01 : Introduction to Music Production',
      '02 : Melody and Chords',
      '03 : Harmonic Progressions and Functions',
      '04 : Music Genres',
      '05 : Song Forms',
      '06 : Instruments and Sounds',
      '07 : Recording Techniques',
      '08 : Production Techniques',
      '09 : FXs (Effects Processing)',
      '10 : Mixing and Mastering'
    ].forEach(function (label, index) {
      var button = document.querySelectorAll('.AccordionContainer1266025101__accordionHeader')[index];
      if (!button) return;
      var labelNode = button.querySelector('[class*="label"], span, p, h2, h3') || button;
      labelNode.textContent = label;
      button.setAttribute('aria-label', label);
    });
    document.querySelectorAll('.AccordionContainer1266025101__accordionHeader').forEach(function (button, index) {
      if (index < 10) return;
      button.style.setProperty('display', 'none', 'important');
      button.setAttribute('aria-hidden', 'true');
      var content = button.nextElementSibling;
      if (content) {
        content.style.setProperty('display', 'none', 'important');
        content.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function removeMentorSessions() {
    var path = normalizedPath();
    if (path !== '/academy' && path !== '/learn-with-tsc') return;
    if (document.documentElement.dataset.tscMentorCleaned === '1') return;
    document.documentElement.dataset.tscMentorCleaned = '1';
    // Prefer CSS hide over DOM remove — DOM remove fights Wix React and can hang the page.
    ['#comp-mpl387ie', '#comp-mrufx9ud'].forEach(function (selector) {
      var section = document.querySelector(selector);
      if (!section) return;
      section.style.setProperty('display', 'none', 'important');
      section.setAttribute('aria-hidden', 'true');
    });
  }

  function promoteButtonToLink(wrapper, href, ariaLabel, opts) {
    if (!wrapper) return null;
    opts = opts || {};
    wrapper.removeAttribute('role');
    wrapper.removeAttribute('tabindex');

    var control = wrapper.querySelector('[data-testid="linkElement"]') || wrapper;
    if (!control) return null;

    if (control.tagName.toLowerCase() !== 'a') {
      var anchor = document.createElement('a');
      Array.prototype.slice.call(control.attributes).forEach(function (attribute) {
        if (attribute.name === 'role' || attribute.name === 'tabindex') return;
        anchor.setAttribute(attribute.name, attribute.value);
      });
      while (control.firstChild) {
        anchor.appendChild(control.firstChild);
      }
      if (control.parentNode) {
        control.parentNode.replaceChild(anchor, control);
      }
      control = anchor;
    }

    control.setAttribute('href', href);
    control.setAttribute('aria-label', ariaLabel);
    if (opts.external) {
      control.setAttribute('target', '_blank');
      control.setAttribute('rel', 'noreferrer noopener');
    } else {
      control.setAttribute('target', '_self');
      control.removeAttribute('rel');
    }
    return control;
  }

  function linkHomeEcosystemCta() {
    if (location.pathname !== '/' && location.pathname !== '/pages/home.html') return;
    var wrapper = document.querySelector('#comp-mrly2iho');
    var control = promoteButtonToLink(wrapper, whatsappCommunityUrl, 'Join The Ecosystem', { external: true });
    if (!control) return;
    var label = control.querySelector('.wixui-button__label, span');
    if (label) {
      label.textContent = 'Join The Ecosystem';
    }
    control.style.pointerEvents = 'auto';
    // Keep Build With TSC same click target + matched sizing handled in CSS.
    promoteButtonToLink(document.querySelector('#comp-mrly1u79'), '/films', 'Build With TSC');
  }

  /* Academy / Learn: Find Your Course → artist-path apply form (course recommend after submit). */
  function linkFindYourCourseCta() {
    var path = normalizedPath();
    if (path !== '/academy' && path !== '/learn-with-tsc') return;
    ['#comp-mr0g77kb', '#comp-mrufx9wm5'].forEach(function (selector) {
      var wrapper = document.querySelector(selector);
      if (!wrapper) return;
      var existing = wrapper.querySelector('a[href="/artist-query"]');
      if (existing) {
        if (wrapper.dataset) wrapper.dataset.tscFindCourseLinked = '1';
        return;
      }
      var control = promoteButtonToLink(wrapper, '/artist-query', 'Find Your Course');
      if (!control) return;
      if (wrapper.dataset) wrapper.dataset.tscFindCourseLinked = '1';
    });
  }

  /* In-card CTAs for What We Build (SSR may already include them; reinject after Wix hydrates). */
  function injectHomeWhatWeBuildCardCtas() {
    if (location.pathname !== '/' && location.pathname !== '/pages/home.html') return;

    var cards = [
      { id: 'comp-mrlr0ide', title: 'TSC ACADEMY', label: 'Explore TSC Academy', href: '/academy' },
      { id: 'comp-mrlrorgn', title: 'Artist Development', label: 'Discover artist path', href: '/artist-path' },
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
    cards.forEach(function (card) {
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
    document.querySelectorAll('main [data-testid="richTextElement"]').forEach(function (element) {
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
    labels.slice(0, 2).forEach(function (text) {
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
        ['/course-bundle', 'All Courses Bundle'],
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
    var activePath = path;
    var header = document.createElement('div');
    header.className = 'tsc-mobile-site-header' + (academyMode ? ' tsc-mobile-site-header-academy' : '');
    header.innerHTML = [
      '<a class="tsc-mobile-brand" href="' + (academyMode ? '/academy' : '/') + '" aria-label="' + (academyMode ? 'TSC Academy' : 'The Shakti Collective') + '">',
      '<img class="tsc-mobile-brand-logo tsc-mobile-brand-logo-unified" src="' + logoSrcForPage() + '" alt="" width="148" height="40" decoding="async">',
      '</a>',
      '<details class="tsc-mobile-menu">',
      '<summary aria-label="Open navigation"><span></span><span></span><span></span></summary>',
      '<nav aria-label="Mobile">',
      navLinks.map(function (item) {
        var href = item[0];
        var active = href === activePath ||
          (!academyMode && href === '/artists' && (activePath === '/artist-path' || activePath === '/harshad-duhita' || activePath === '/yugm')) ||
          (!academyMode && href === '/work' && (activePath === '/mba' || activePath === '/havells-myousic' || activePath === '/insta-music-league' || activePath === '/young-gunns')) ||
          (academyMode && href === '/academy' && (activePath === '/academy' || activePath === '/learn-with-tsc')) ||
          (academyMode && href === '/resources' && activePath === '/resources');
        return '<a href="' + href + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' + item[1] + '</a>';
      }).join(''),
      '</nav>',
      '</details>',
      '<a class="tsc-mobile-header-cta" href="' + (academyMode ? '/' : '/academy') + '">' + (academyMode ? 'Main Website' : 'TSC Academy') + '</a>'
    ].join('');
    document.body.insertBefore(header, document.getElementById('SITE_CONTAINER') || document.body.firstChild);

    var menu = header.querySelector('.tsc-mobile-menu');
    if (menu) {
      menu.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.removeAttribute('open');
        });
      });
      document.addEventListener('click', function (event) {
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
    Array.prototype.forEach.call(document.querySelectorAll('link[rel*="icon"]'), function (link) {
      link.parentNode.removeChild(link);
    });
    icons.forEach(function (icon) {
      var link = document.createElement('link');
      Object.keys(icon).forEach(function (key) {
        link.setAttribute(key, icon[key]);
      });
      document.head.appendChild(link);
    });
  }

  /* Footer logos only — never mutate header/nav brand logos after load (hydration shrink). */
  function updateFooterBrandLogos() {
    var academyMode = !!academyPaths[normalizedPath()];
    var footLogoSrc = footerLogoSrcForPage();
    var brandLabel = academyMode ? 'TSC Academy' : 'The Shakti Collective';
    var homeHref = academyMode ? '/academy' : '/';

    Array.prototype.forEach.call(document.querySelectorAll(
      '.tsc-desktop-footer-brand, .tsc-mobile-footer-brand a, .tsc-mobile-footer-brand'
    ), function (link) {
      if (!link || link.tagName !== 'A') return;
      if (!link.closest('.tsc-mobile-footer, .tsc-desktop-footer, .tsc-mobile-footer-brand, .tsc-desktop-footer-brand')) return;
      link.setAttribute('href', homeHref);
      link.setAttribute('aria-label', brandLabel);
      var img = link.querySelector('img.tsc-desktop-footer-logo, img.tsc-mobile-footer-logo');
      if (img) {
        if (img.getAttribute('src') !== footLogoSrc) img.setAttribute('src', footLogoSrc);
        img.setAttribute('alt', brandLabel);
        return;
      }
      var mobile = !!link.closest('.tsc-mobile-footer, .tsc-mobile-footer-brand');
      var cls = mobile ? 'tsc-mobile-footer-logo' : 'tsc-desktop-footer-logo';
      var size = mobile ? ' width="180" height="74"' : ' width="260" height="108"';
      link.innerHTML = '<img class="' + cls + '" src="' + footLogoSrc + '" alt="' + brandLabel + '"' + size + ' decoding="async">';
    });

    Array.prototype.forEach.call(document.querySelectorAll('.tsc-mobile-footer-logo, .tsc-desktop-footer-logo'), function (img) {
      if (img.getAttribute('src') !== footLogoSrc) img.setAttribute('src', footLogoSrc);
      img.setAttribute('alt', brandLabel);
    });
  }

  function syncResponsiveHeaderMenuCta() {
    var academyMode = !!academyPaths[normalizedPath()];
    var compact = !window.matchMedia || window.matchMedia('(max-width: 1000px)').matches;
    var href = academyMode ? '/' : '/academy';
    var label = academyMode ? 'Main Website' : 'TSC Academy';

    Array.prototype.forEach.call(document.querySelectorAll('header nav[data-hook="menu-root"]'), function (nav) {
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
    if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
    var path = normalizedPath();
    var config = mobileCoursePages[path] || mobileCoursePages[path.replace('/pages', '').replace('.html', '')];
    var main = document.querySelector('main');
    if (!config || !main || document.querySelector('.tsc-mobile-course-shell')) return;
    Array.prototype.slice.call(main.querySelectorAll(':scope > section')).slice(0, 3).forEach(function (section) {
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
      '<div class="tsc-mobile-course-card tsc-mobile-course-mentor-card">',
      '<p class="tsc-mobile-eyebrow">Course Mentor</p>',
      '<h2>' + ui.escapeHtml(config.mentorName || config.mentor.replace(/^Mentor:\\s*/i, '')) + '</h2>',
      '<p>' + ui.escapeHtml(config.mentorBio || config.details) + '</p>',
      '<div class="tsc-mobile-course-badges">' + (config.mentorBadges || []).map(function (badge) {
        return '<span>' + ui.escapeHtml(badge) + '</span>';
      }).join('') + '</div>',
      '</div>',
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
      var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
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
      var lastCompact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
      window.addEventListener('resize', function () {
        var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
        if (compact !== lastCompact) {
          lastCompact = compact;
          renderWorkHeroCopy();
        }
      });
    }

    var hero = document.getElementById('comp-mp3okkrk');
    if (!hero) return;
    if (!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches)) return;
    hero.classList.add('tsc-work-hero-redesign');
    [80, 300, 800].forEach(function (delay) {
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
    Array.prototype.forEach.call(host.querySelectorAll('.tsc-mobile-work-hide'), function (child) {
      child.classList.remove('tsc-mobile-work-hide');
      child.style.removeProperty('display');
    });
    host.style.removeProperty('height');
    host.style.removeProperty('min-height');
    host.style.removeProperty('overflow');
    document.body.classList.remove('tsc-has-mobile-work-cases');
  }

  function buildMobileWorkCases() {
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var path = location.pathname.replace(/\/$/, '') || '/';
    var host = document.querySelector('#comp-mr69hwoy');
    if ((path !== '/work' && path !== '/pages/work.html') || !host) return;

    // Desktop must keep Wix mesh — shell only on phone/tablet.
    if (!compact) {
      teardownMobileWorkCases();
      return;
    }

    var existing = host.querySelector('.tsc-mobile-work-cases');
    // Rebuild if legacy image-overlay shell (no title bar)
    if (existing && !existing.querySelector('.tsc-mobile-work-bar')) {
      teardownMobileWorkCases();
      host = document.querySelector('#comp-mr69hwoy');
      if (!host) return;
      existing = null;
    }
    if (existing) return;

    // Wix mesh uses explicit grid-row per section. Sibling shells with
    // grid-area:auto steal row 1 and bury the Work hero — mount inside host.
    host.classList.add('tsc-mobile-work-host');
    Array.prototype.forEach.call(host.children, function (child) {
      child.classList.add('tsc-mobile-work-hide');
      child.style.setProperty('display', 'none', 'important');
    });

    var shell = document.createElement('div');
    shell.className = 'tsc-mobile-work-cases';
    shell.innerHTML = [
      '<div class="tsc-mobile-section-heading"><p>Selected Work</p><h2>Culture-first projects, built for artists and audiences.</h2></div>',
      '<div class="tsc-mobile-work-list">',
      mobileWorkCards.map(function (card) {
        return [
          '<a class="tsc-mobile-work-card" href="' + ui.escapeHtml(card.href) + '">',
          '<span class="tsc-mobile-work-bar">',
          '<small>' + ui.escapeHtml(card.num) + '</small>',
          '<strong>' + ui.escapeHtml(card.title) + '</strong>',
          '</span>',
          '<img src="' + ui.escapeHtml(upscaleMirrorImage(localImageSrc(card.imageSelector, card.fallbackImage), 960)) + '" alt="" loading="lazy" decoding="async">',
          '<span class="tsc-mobile-work-body">',
          '<p>' + ui.escapeHtml(card.eyebrow) + '</p>',
          '<em>' + ui.escapeHtml(card.stat) + '</em>',
          '<span class="tsc-mobile-work-cta">Know More</span>',
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

  function updateDesktopFilmCards() {
    var path = normalizedPath();
    if (path !== '/films') return;
    /* Clone-faithful: keep Wix desktop card copy; wire impact links only. */
    desktopFilmCards.forEach(function (card) {
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
      if (root.getAttribute('data-tsc-film-report-wired') === 'true') return;
      root.setAttribute('data-tsc-film-report-wired', 'true');
      root.addEventListener('click', function (event) {
        if (event.defaultPrevented) return;
        window.location.assign(card.href);
      });
      root.addEventListener('keydown', function (event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.assign(card.href);
      });
    });
  }

  function upscaleMirrorImage(src, size) {
    if (!src) return src;
    if (src.indexOf('/assets/films/') === 0) return src;
    size = size || 720;
    return src.replace(/\/fill\/w_\d+,h_\d+/i, '/fill/w_' + size + ',h_' + size);
  }

  function filmCardImageSrc(card, size) {
    if (card.fallbackImage && card.fallbackImage.indexOf('/assets/films/') === 0) {
      return card.fallbackImage;
    }
    return upscaleMirrorImage(localImageSrc(card.imageSelector, card.fallbackImage), size || 720);
  }

  function suppressDuplicateFilmsPartnerships() {
    // Wix ships a duplicated Partnerships pair — suppress on every viewport.
    ['comp-mqmhowf1', 'comp-mqmhp1sq', 'comp-mqmhpx0p'].forEach(function (id) {
      var dup = document.getElementById(id);
      if (!dup) return;
      dup.classList.add('tsc-mobile-films-hide');
      dup.style.setProperty('display', 'none', 'important');
      dup.style.setProperty('height', '0', 'important');
      dup.style.setProperty('max-height', '0', 'important');
      dup.style.setProperty('margin', '0', 'important');
      dup.setAttribute('aria-hidden', 'true');
    });
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
      Array.prototype.forEach.call(whatHost.querySelectorAll('.tsc-mobile-films-hide'), function (child) {
        // Never restore Wix duplicate Partnerships pair
        if (child.id === 'comp-mqmhowf1' || child.id === 'comp-mqmhp1sq' || child.id === 'comp-mqmhpx0p') return;
        if (child.closest && (child.closest('#comp-mqmhowf1') || child.closest('#comp-mqmhp1sq'))) return;
        child.classList.remove('tsc-mobile-films-hide');
        child.style.removeProperty('display');
        child.style.removeProperty('height');
        child.style.removeProperty('min-height');
        child.removeAttribute('aria-hidden');
      });
      whatHost.style.removeProperty('height');
      whatHost.style.removeProperty('min-height');
    }

    suppressDuplicateFilmsPartnerships();

    var cardHost = document.getElementById('comp-mqmhuw20');
    if (cardHost) {
      var cases = cardHost.querySelector('.tsc-mobile-films-cases');
      if (cases && cases.parentNode) cases.parentNode.removeChild(cases);
      cardHost.classList.remove('tsc-mobile-films-host');
      Array.prototype.forEach.call(cardHost.querySelectorAll('.tsc-mobile-films-hide'), function (child) {
        child.classList.remove('tsc-mobile-films-hide');
        child.style.removeProperty('display');
      });
      cardHost.style.removeProperty('height');
      cardHost.style.removeProperty('min-height');
      cardHost.style.removeProperty('position');
      cardHost.style.removeProperty('top');
    }

    ['comp-mqmi6yn5', 'comp-mqmi8cwy', 'comp-mqmi8stx'].forEach(function (id) {
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

    suppressDuplicateFilmsPartnerships();

    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
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
      suppressDuplicateFilmsPartnerships();
      function hideWixWhatChildren() {
        Array.prototype.forEach.call(whatHost.children, function (child) {
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
          mobileFilmsWhatWeDo.map(function (item, i) {
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
      [120, 400, 900].forEach(function (delay) {
        window.setTimeout(hideWixWhatChildren, delay);
      });
    }

    var cardHost = document.getElementById('comp-mqmhuw20');
    if (cardHost) {
      var existingCases = cardHost.querySelector('.tsc-mobile-films-cases');
      // Rebuild if legacy layout (num/title inside copy, no title bar)
      if (existingCases && !existingCases.querySelector('.tsc-mobile-films-bar')) {
        existingCases.parentNode.removeChild(existingCases);
        existingCases = null;
        document.body.classList.remove('tsc-has-mobile-films-cases');
      }
    }
    if (cardHost && !document.querySelector('.tsc-mobile-films-cases')) {
      cardHost.classList.add('tsc-mobile-films-host');
      Array.prototype.forEach.call(cardHost.children, function (child) {
        child.classList.add('tsc-mobile-films-hide');
        child.style.setProperty('display', 'none', 'important');
      });
      ['comp-mqmi6yn5', 'comp-mqmi8cwy', 'comp-mqmi8stx'].forEach(function (id) {
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
        mobileFilmCards.map(function (card) {
          var src = filmCardImageSrc(card, 720);
          return [
            '<a class="tsc-mobile-films-card" href="' + ui.escapeHtml(card.href) + '">',
            '<span class="tsc-mobile-films-bar">',
            '<small>' + ui.escapeHtml(card.num) + '</small>',
            '<strong>' + ui.escapeHtml(card.title) + '</strong>',
            '</span>',
            '<img src="' + ui.escapeHtml(src) + '" alt="">',
            '<span class="tsc-mobile-films-card-copy">',
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
      ['comp-mqktgh65', 'comp-mql45ec4'].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.style.setProperty('height', 'auto', 'important');
        el.style.setProperty('min-height', '0', 'important');
        el.style.setProperty('overflow', 'visible', 'important');
        Array.prototype.forEach.call(el.querySelectorAll('*'), function (node) {
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
    [120, 400, 900].forEach(function (delay) {
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
    var href = (link && link.getAttribute('href')) || fallback;
    if (/^(?:https?:|mailto:|tel:)/i.test(href)) return href;
    return fallback;
  }

  function buildMobileFooter() {
    if (ui.mountMobileFooter) {
      return ui.mountMobileFooter({
        path: normalizedPath(),
        brandAssets: {
          main: Object.assign({ name: 'The Shakti Collective', tagline: 'Unfolding artist force.' }, brandAssets.main),
          academy: Object.assign({ name: 'TSC Academy', tagline: 'Mentorship-led learning for serious artists.' }, brandAssets.academy)
        },
        whatsappCommunityUrl: whatsappCommunityUrl
      });
    }
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var existing = document.querySelector('.tsc-mobile-footer');
    var footer = findSiteFooter();
    if (!compact) {
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('tsc-has-mobile-footer');
      return;
    }
    if (!footer || existing) return;

    var socials = mobileFooterSocials.map(function (s) {
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
      '<img class="tsc-mobile-footer-logo" src="' + ui.escapeHtml(footerLogoSrcForPage()) + '" alt="' + (academyPaths[normalizedPath()] ? 'TSC Academy' : 'The Shakti Collective') + '" width="180" height="74" decoding="async">',
      '</div>',
      '<details class="tsc-mobile-footer-acc" open>',
      '<summary>Start Here</summary>',
      '<div class="tsc-mobile-footer-links">',
      '<a href="/book-a-call">Book a Call</a>',
      '<a href="/book-an-artist">Book an Artist</a>',
      '<a href="/artist-query">Apply for Artist Path</a>',
      '</div>',
      '</details>',
      '<details class="tsc-mobile-footer-acc">',
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
      '<a href="/academy">Learn With TSC</a>',
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
      socials.map(function (s) {
        return '<a class="tsc-mobile-footer-icon" href="' + ui.escapeHtml(s.href) + '" target="_blank" rel="noopener noreferrer" aria-label="' + ui.escapeHtml(s.aria) + '">' + s.svg + '</a>';
      }).join(''),
      '</div>',
      '<div class="tsc-mobile-footer-bottom">',
      '<span>&copy; 2026 The Shakti Collective. All rights reserved.</span>',
      '</div>'
    ].join('');

    footer.insertBefore(shell, footer.firstChild);
    document.body.classList.add('tsc-has-mobile-footer');

    var form = shell.querySelector('.tsc-mobile-footer-newsrow');
    if (form && !form.dataset.bound) {
      form.dataset.bound = 'true';
      form.addEventListener('submit', function (event) {
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
    var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
    var selectors = [
      'footer .wixui-text-input',
      'footer .wixui-text-box'
    ];
    var elements = Array.prototype.slice.call(document.querySelectorAll(selectors.join(',')));

    elements.forEach(function (element) {
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
    Array.prototype.slice.call(control.attributes || []).forEach(function (attribute) {
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
    if (path !== '/harshad-duhita' && path !== '/mohit-shankar' && path !== '/yugm') return;

    var main = document.querySelector('main');
    if (!main) return;

    var heroSections = Array.prototype.slice.call(main.querySelectorAll('section')).filter(function (section) {
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      return /Book for Events/i.test(text) && /Explore Music/i.test(text);
    });
    if (!heroSections.length) return;

    var hero = heroSections[0];
    heroSections.slice(1).forEach(function (section) {
      if (section && section.parentNode) section.parentNode.removeChild(section);
    });

    var heroContent = hero.querySelector(':scope > [data-testid="responsive-container-content"], :scope .max-width-container');
    if (heroContent) {
      var compact = window.matchMedia && window.matchMedia('(max-width: 1024px)').matches;
      heroContent.style.setProperty('padding-top', compact ? '56px' : '28px', 'important');
    }

    var artistConfig = {
      '/harshad-duhita': {
        title: 'Harshaduhita Collective',
        description: 'A live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical expression.',
        badge: 'Winner - PADMA SHRI MAHENDRA KAPOOR AWARD 2026',
        artistQuery: '/query?artist=Harshad%20and%20Duhita%20Golesar'
      },
      '/mohit-shankar': {
        title: 'Mohit Shankar',
        description: 'An independent singer, composer and live performer building intimate, contemporary Indian music with heartfelt songwriting and stage-ready storytelling.',
        badge: 'TSC Artist',
        artistQuery: '/query?artist=Mohit%20Shankar'
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
    var description = richTextBlocks.find(function (node) {
      var text = (node.textContent || '').trim();
      return text && text !== artistConfig.title;
    });
    if (description) description.textContent = artistConfig.description;

    var badge = richTextBlocks.find(function (node) {
      return /winner|award|spotlight/i.test(node.textContent || '');
    });
    if (badge) badge.textContent = artistConfig.badge;

    var discographyHeading = Array.prototype.slice.call(main.querySelectorAll('h1, h2, h3')).find(function (node) {
      return /discography/i.test(node.textContent || '');
    });
    var discographySection = discographyHeading && discographyHeading.closest('section');
    var discographyHref = discographySection && discographySection.id ? ('#' + discographySection.id) : path;

    var buttons = Array.prototype.slice.call(hero.querySelectorAll('[data-testid="linkElement"], a, [role="button"]'));
    buttons.forEach(function (button) {
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
    Array.prototype.slice.call(hero.querySelectorAll('a[href], [data-testid="linkElement"]')).forEach(function (button) {
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

  /* Roster Learn More buttons: Wix still points Harshad at /young-gunns. */
  var ARTIST_ROSTER_HREFS = {
    'comp-mqtpn27z': '/harshad-duhita',
    'comp-mqtq8rt66': '/yugm',
    'comp-mqutenqm': '/mohit-shankar'
  };

  function repairArtistsRosterLinks() {
    if (normalizedPath() !== '/artists') return;
    Object.keys(ARTIST_ROSTER_HREFS).forEach(function (btnId) {
      var href = ARTIST_ROSTER_HREFS[btnId];
      var host = document.getElementById(btnId);
      if (!host) return;
      setButtonLink(host, href);
      var anchor = host.tagName === 'A' ? host : host.querySelector('a[href], [data-testid="linkElement"]');
      if (anchor) {
        anchor.setAttribute('href', href);
        anchor.setAttribute('target', '_self');
        anchor.removeAttribute('rel');
      }
    });
    document.querySelectorAll('.tsc-artist-acc').forEach(function (card) {
      var name = (card.querySelector('.tsc-artist-acc__bar-name, .tsc-artist-acc__collapsed-name') || {}).textContent || '';
      name = String(name).replace(/\s+/g, ' ').trim();
      var href = null;
      if (/harshad|duhita/i.test(name)) href = '/harshad-duhita';
      else if (/yugm/i.test(name)) href = '/yugm';
      else if (/mohit|artist 3/i.test(name)) href = '/mohit-shankar';
      if (!href) return;
      var cta = card.querySelector('.tsc-artist-acc__cta');
      if (cta) {
        cta.setAttribute('href', href);
        cta.setAttribute('target', '_self');
      }
    });
  }

  function purgeMohitFormOptions() {
    document.querySelectorAll('[aria-label="Mohit Shankar"], input[value="Mohit Shankar"]').forEach(function (node) {
      var option = node.closest('.siroRCe, [data-hook="core-radio-button"], label, li') || node.parentElement;
      if (option && option.parentNode) option.parentNode.removeChild(option);
    });
    document.querySelectorAll('[data-hook="label-wrapper"]').forEach(function (node) {
      if (!/Mohit Shankar/i.test(node.textContent || '')) return;
      var option = node.closest('.siroRCe, [data-hook="core-radio-button"], label, li');
      if (option && option.parentNode) option.parentNode.removeChild(option);
    });
  }

  function scheduleResponsiveAlignment() {
    [60, 250, 700, 1400, 2400, 4200].forEach(function (delay) {
      window.setTimeout(function () {
        updateFooterBrandLogos();
        syncResponsiveHeaderMenuCta();
        alignResponsiveElements();
        repairAcademyCourseCards();
        repairAcademyCourseDropdownLinks();
        repairArtistPages();
        repairArtistsRosterLinks();
        purgeMohitFormOptions();
        centerArtistsHeroButtons();
      }, delay);
    });
  }

  function boot() {
    applyBrandFavicons();
    ui.patchMutedPlay();
    ui.muteVideos();
    buildMobileHeader();
    if (ui.mountDesktopHeader) {
      ui.mountDesktopHeader({ path: normalizedPath(), brandAssets: brandAssets });
    }
    updateFooterBrandLogos();
    syncResponsiveHeaderMenuCta();
    updateWorkHero();
    addMobileCourseMeta();
    buildMobileCourseExperience();
    buildMobileWorkCases();
    updateDesktopFilmCards();
    repairAcademyCourseCards();
    repairAcademyCourseDropdownLinks();
    buildMobileFilmsShells();
    if (ui.mountDesktopFooter) {
      ui.mountDesktopFooter({
        path: normalizedPath(),
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
    repairArtistsRosterLinks();
    purgeMohitFormOptions();
    centerArtistsHeroButtons();
    scheduleResponsiveAlignment();
    updateResourcesBlogSection();
    injectBlogArticleDirectory();
    repairResourcesCourseLinks();
    // After Wix hydrate: hide mentor promo + ensure Luca card (once).
    function afterHydrate() {
      removeMentorSessions();
      updateDesktopFilmCards();
      repairAcademyCourseCards();
      repairAcademyCourseDropdownLinks();
      ensureLucaCourseCardImage();
      ensureLucaCourseCardLinks();
      polishMobileAcademyCourseCards();
      polishMobileMusicProductionPage();
      injectBlogArticleDirectory();
      injectResourcesBlogGrid();
      repairResourcesCourseLinks();
      linkFindYourCourseCta();
    }
    window.setTimeout(afterHydrate, 800);
    window.addEventListener('load', function () {
      window.setTimeout(afterHydrate, 600);
    });
    linkHomeEcosystemCta();
    linkFindYourCourseCta();
    injectHomeWhatWeBuildCardCtas();
  }

  ui.applyOnSchedule(boot);
  window.addEventListener('resize', function () {
    buildMobileHeader();
    if (ui.mountDesktopHeader) {
      ui.mountDesktopHeader({ path: normalizedPath(), brandAssets: brandAssets });
    }
    if (ui.mountDesktopFooter) {
      ui.mountDesktopFooter({
        path: normalizedPath(),
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
    var observer = new MutationObserver(function () {
      window.clearTimeout(window.__tscResponsiveAlignTimer);
      window.__tscResponsiveAlignTimer = window.setTimeout(function () {
        updateFooterBrandLogos();
        syncResponsiveHeaderMenuCta();
        alignResponsiveElements();
        updateDesktopFilmCards();
        injectHomeWhatWeBuildCardCtas();
        linkFindYourCourseCta();
        injectBlogArticleDirectory();
        injectResourcesBlogGrid();
        wireResourcesBlogClicks();
        repairResourcesCourseLinks();
        repairAcademyCourseCards();
        repairAcademyCourseDropdownLinks();
        ensureLucaCourseCardImage();
        ensureLucaCourseCardLinks();
        ensureAcademyBundleCourseCard();
        polishMobileMusicProductionPage();
      }, 80);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
