(function() {
  var ui = window.TSCComponents;
  if (!ui) return;

  ui.ensureStylesheet('/css/forms.css?v=form-slot-grid-1');

  var shared = {
    defaultCountryCode: '+91 India',
    countryCodes: [
      '+91 India',
      '+1 USA',
      '+44 UK',
      '+971 UAE',
      '+61 Australia',
      '+65 Singapore',
      '+49 Germany',
      '+33 France'
    ]
  };

  var options = {
    courses: [
      'The heART of Composition',
      'Roots of Hindustani Classical',
      'A to Z of Music Production',
      'Other'
    ],
    timeSlots: [
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
      'Other'
    ],
    engagement: [
      'Live Performance',
      'Brand Collaboration',
      'Social Media Content',
      'Music Production / Feature',
      'Other'
    ],
    talent: [
      'Harshad and Duhita Golesar',
      'YUGM',
      'Open to Recommendations'
    ],
    logistics: [
      'Yes - Full Travel & Stay',
      'Partially Provided',
      'To be Negotiated',
      'Not Provided'
    ],
    ratings: ['Excellent', 'Very Good', 'Good', 'Fair', 'Needs Work'],
    musicianTypes: ['Singer', 'Songwriter', 'Lyricist', 'Music Composer', 'Music Producer']
  };

  function reviewFields() {
    return [
      { label: 'First name', type: 'text', required: true },
      { label: 'Last name', type: 'text', required: true },
      { label: 'Registered email', type: 'email', required: true },
      { label: 'Registered mobile number', type: 'tel', required: true },
      { label: 'Which type of musician / artist are you? (Select all that apply)', type: 'checkboxes', options: options.musicianTypes, full: true },
      { label: 'Overall experience', type: 'radios', options: options.ratings, full: true },
      { label: 'How was the pacing of the sessions?', type: 'radios', options: ['Just right', 'Too fast', 'Too slow'], full: true },
      { label: 'Concept clarity', type: 'radios', options: options.ratings, full: true },
      { label: 'Depth of content', type: 'radios', options: options.ratings, full: true },
      { label: 'Practical usefulness', type: 'radios', options: options.ratings, full: true },
      { label: 'Are you interested in taking up the course after the masterclass?', type: 'radios', options: ['Yes', 'Maybe', 'No'], full: true },
      { label: 'How much of the recorded masterclass did you complete?', type: 'radios', options: ['Saw complete', 'Left in between'], full: true },
      { label: 'Describe your experience of the masterclass!', type: 'textarea', full: true },
      { label: 'What should we improve in this recorded masterclass?', type: 'textarea', full: true }
    ];
  }

  var forms = {
    bookCall: {
      title: 'Book A Call',
      mount: '#comp-mrxe1crw',
      routes: ['/book-a-call', '/pages/book-a-call.html', '/forms/book-a-call', '/blank-8', '/about-8'],
      fields: [
        { label: 'Which course are you interested in?', type: 'radios', options: options.courses, required: true, full: true },
        { label: "What's your name?", type: 'text', required: true },
        { label: 'Phone / WhatsApp Number', type: 'phoneCountry', required: true },
        { label: 'Email Address', type: 'email', required: true },
        { label: 'Select a Date', name: 'pick-a-date', type: 'date', required: true },
        { label: 'Select The Time', name: 'pick-a-time', type: 'timeSelect', options: options.timeSlots, required: true }
      ]
    },
    bookArtist: {
      title: 'Book An Artist',
      mount: '#comp-mrxmc0z9',
      routes: ['/book-an-artist', '/pages/book-an-artist.html', '/query', '/forms/book-an-artist'],
      fields: [
        { label: 'Full Name', type: 'text', required: true },
        { label: 'Organization', type: 'text', required: true },
        { label: 'Email Address', type: 'email', required: true },
        { label: 'Contact Number (with +91)', type: 'tel', required: true },
        { label: 'Kind of Engagement?', type: 'select', options: options.engagement, required: true },
        { label: 'Which Artist / Talent?', type: 'select', options: options.talent, required: true },
        { label: 'Nature of Project?', type: 'textarea', full: true },
        { label: 'When and Where?', type: 'textarea', full: true },
        { label: 'Expected Scale / Reach', type: 'text', full: true },
        { label: 'Logistics Provided?', type: 'select', options: options.logistics, full: true },
        { label: 'Additional Vision / Details', type: 'textarea', full: true }
      ]
    },
    artistPath: {
      title: 'Apply for Artist Path',
      mount: '#comp-mrxv5lfu2',
      routes: ['/artist-query', '/pages/artist-query.html', '/artist-path', '/pages/artist-path.html', '/forms/artist-query'],
      multiStep: true,
      fields: [
        { label: 'First Name', type: 'text', required: true, step: 1 },
        { label: 'Last Name', type: 'text', required: true, step: 1 },
        { label: 'Where are you based?', type: 'text', full: true, step: 1 },
        { label: 'Mobile Number', type: 'tel', required: true, step: 1 },
        { label: 'Email Address', type: 'email', required: true, step: 1 },
        { label: 'Stage Name / Identity', type: 'text', full: true, step: 1 },
        { label: 'Instagram URL', type: 'url', step: 1 },
        { label: 'Spotify URL', type: 'url', step: 1 },
        { label: 'YouTube URL', type: 'url', step: 1 },
        { label: 'I am an artist because...', type: 'textarea', full: true, step: 2 },
        { label: 'The Foundation (Training Backstory)', type: 'textarea', full: true, step: 2 },
        { label: 'Core Skills (Primary Weapon)', type: 'textarea', full: true, step: 2 },
        { label: 'Your X-Factor', type: 'textarea', full: true, step: 2 },
        { label: 'Daily Dedication', type: 'textarea', full: true, step: 2 },
        { label: 'Mentor / Guruji', type: 'text', full: true, step: 2 },
        { label: 'Songs Released', type: 'number', step: 2 },
        { label: 'Live Shows', type: 'number', step: 2 },
        { label: 'Your Tribe (Fanbase)', type: 'textarea', full: true, step: 2 },
        { label: 'Toolkit & Setup', type: 'textarea', full: true, step: 2 },
        { label: 'Current Projects', type: 'textarea', full: true, step: 2 },
        { label: 'Daily Rituals (Riyaaz)', type: 'textarea', full: true, step: 2 },
        { label: 'Skill Gaps (What to learn?)', type: 'textarea', full: true, step: 3 },
        { label: 'Guidance & Mentorship', type: 'textarea', full: true, step: 3 },
        { label: 'Curation Needs (Audio/Video/Stage)', type: 'textarea', full: true, step: 3 },
        { label: 'Fandom Engine (Growth missing?)', type: 'textarea', full: true, step: 3 },
        { label: 'Your North Star (Next 12 Months)', type: 'textarea', full: true, step: 3 },
        { label: 'Anything Else? (Open Mic)', type: 'textarea', full: true, step: 3 }
      ]
    },
    affiliateApp: {
      title: 'Apply for Affiliate Program',
      mount: '#comp-mqz7149p',
      standalone: true,
      routes: ['/affiliate-apply', '/pages/affiliate-apply.html', '/forms/affiliate'],
      fields: [
        { label: 'Full Name', type: 'text', required: true },
        { label: 'Email Address', type: 'email', required: true },
        { label: 'Phone / WhatsApp Number', type: 'phoneCountry', required: true },
        { label: 'Website / Social Media Profile', type: 'url', required: true, full: true },
        { label: 'Why do you want to join the TSC Affiliate Program?', type: 'textarea', required: true, full: true }
      ]
    },
    review01: { title: 'Masterclass Review 01', standalone: true, routes: ['/masterclass-review01', '/pages/masterclass-review01.html'], fields: reviewFields() },
    review02: { title: 'Masterclass Review 02', standalone: true, routes: ['/masterclass-review02', '/pages/masterclass-review02.html'], fields: reviewFields() },
    classicalReview: { title: 'Classical Review', standalone: true, routes: ['/classicalreview', '/pages/classicalreview.html'], fields: reviewFields() },
    collabQuery: {
      title: 'Collaborate With TSC',
      mount: '#comp-mp2w3ngp2',
      routes: ['/collab-query', '/pages/collab-query.html', '/blank-6', '/forms/collab-query'],
      fields: [
        { label: 'I am a', name: 'i-am-a', type: 'radios', options: ['Brand', 'Artist', 'Institution', 'Other'], required: true, full: true },
        { label: 'Full Name', type: 'text', required: true },
        { label: 'Organization', type: 'text', required: true },
        { label: 'Email Address', type: 'email', required: true },
        { label: 'Contact Number', type: 'tel', required: true },
        { label: 'Collaboration Type', type: 'select', options: ['Music-led Campaign', 'Cultural Storytelling', 'Branded Experience', 'Talent Program', 'Other'], required: true },
        { label: 'What are you looking for?', type: 'textarea', full: true },
        { label: 'How can we collaborate?', type: 'textarea', required: true, full: true }
      ]
    }
  };

  function normalizeArtistNameParam(value) {
    var raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (/harshad|duhita/.test(raw)) return 'Harshad and Duhita Golesar';
    if (/yugm/.test(raw)) return 'YUGM';
    if (/open/.test(raw) && /recommend/.test(raw)) return 'Open to Recommendations';
    return '';
  }

  function prefillBookArtistForm() {
    var params;
    try {
      params = new URLSearchParams(location.search || '');
    } catch (e) {
      return;
    }
    var artist = normalizeArtistNameParam(params.get('artist') || params.get('talent'));
    if (!artist) return;

    // Check native radio option first
    var nativeRadio = document.querySelector('input[type="radio"][value*="' + artist + '"]') || document.querySelector('input[type="radio"][aria-label*="' + artist + '"]');
    if (nativeRadio) {
      nativeRadio.checked = true;
      var w = nativeRadio.closest('.siroRCe') || nativeRadio.closest('[data-hook="core-radio-button"]');
      if (w) {
        var groupRadios = document.querySelectorAll('input[type="radio"][name="' + nativeRadio.name + '"]');
        groupRadios.forEach(function(r) {
          var other = r.closest('.siroRCe') || r.closest('[data-hook="core-radio-button"]');
          if (other) other.setAttribute('data-checked', r.checked ? 'true' : 'false');
        });
      }
    }

    // Check dropdown or select fallback
    var select = document.querySelector('[data-tsc-form="bookArtist"] select[name="which-artist-talent"]');
    if (!select) return;
    var hasOption = Array.prototype.some.call(select.options || [], function(option) {
      return option.value === artist;
    });
    if (!hasOption) return;
    select.value = artist;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function boot() {
    var rawPath = location.pathname || '/';
    var canonical = (typeof ui.canonicalPathname === 'function' ? ui.canonicalPathname() : rawPath).replace(/\/+$/, '') || '/';
    ui.normalizeNewsletter();
    ui.normalizeArtistLinks();
    ui.normalizeAcademyLogoLinks();
    Object.keys(forms).forEach(function(name) {
      var def = forms[name];
      var matches = (def.routes || []).some(function(r) {
        return r === canonical || r === rawPath || rawPath.indexOf(r) === 0 || canonical.indexOf(r) === 0;
      });
      if (!matches) return;
      if (def.standalone) {
        ui.mountStandaloneForm(document.querySelector('[data-tsc-standalone-form]'), def, name, shared);
      } else {
        var container = document.querySelector(def.mount);
        if (!container && (name === 'bookCall' || name === 'bookArtist' || name === 'artistPath' || name === 'collabQuery' || name === 'affiliateApp')) {
          container = document.querySelector('form[id^="form-"]') || document.querySelector('main section') || document.querySelector('[data-testid="responsive-container"]');
        }
        ui.mountFormInto(container, def, name, shared);
      }
    });
    prefillBookArtistForm();
  }

  ui.applyOnSchedule(boot);
})();
