(function() {
  var ui = window.TSCComponents;
  if (!ui) return;

  ui.ensureStylesheet('/css/forms.css?v=artist-path-recommend-1');

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
      'A to Z of Music Production'
    ],
    timeSlots: [
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
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
      'Mohit Shankar',
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
      routes: ['/book-a-call'],
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
      routes: ['/book-an-artist', '/query'],
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
      routes: ['/artist-query'],
      fields: [
        { label: 'First Name', type: 'text', required: true },
        { label: 'Last Name', type: 'text', required: true },
        { label: 'Where are you based?', type: 'text', full: true },
        { label: 'Mobile Number', type: 'tel' },
        { label: 'Email Address', type: 'email' },
        { label: 'Stage Name / Identity', type: 'text', full: true },
        { label: 'Instagram URL', type: 'url' },
        { label: 'Spotify URL', type: 'url' },
        { label: 'YouTube URL', type: 'url' },
        { label: 'I am an artist because...', type: 'textarea', full: true },
        { label: 'The Foundation (Training Backstory)', type: 'textarea', full: true },
        { label: 'Core Skills (Primary Weapon)', type: 'textarea', full: true },
        { label: 'Your X-Factor', type: 'textarea', full: true },
        { label: 'Daily Dedication', type: 'textarea', full: true },
        { label: 'Mentor / Guruji', type: 'text', full: true },
        { label: 'Songs Released', type: 'number' },
        { label: 'Live Shows', type: 'number' },
        { label: 'Your Tribe (Fanbase)', type: 'textarea', full: true },
        { label: 'Toolkit & Setup', type: 'textarea', full: true },
        { label: 'Current Projects', type: 'textarea', full: true },
        { label: 'Daily Rituals (Riyaaz)', type: 'textarea', full: true },
        { label: 'Skill Gaps (What to learn?)', type: 'textarea', full: true },
        { label: 'Guidance & Mentorship', type: 'textarea', full: true },
        { label: 'Curation Needs (Audio/Video/Stage)', type: 'textarea', full: true },
        { label: 'Fandom Engine (Growth missing?)', type: 'textarea', full: true },
        { label: 'Your North Star (Next 12 Months)', type: 'textarea', full: true },
        { label: 'Anything Else? (Open Mic)', type: 'textarea', full: true }
      ]
    },
    review01: { title: 'Masterclass Review 01', standalone: true, routes: ['/masterclass-review01', '/pages/masterclass-review01.html'], fields: reviewFields() },
    review02: { title: 'Masterclass Review 02', standalone: true, routes: ['/masterclass-review02', '/pages/masterclass-review02.html'], fields: reviewFields() },
    classicalReview: { title: 'Classical Review', standalone: true, routes: ['/classicalreview', '/pages/classicalreview.html'], fields: reviewFields() }
  };

  function normalizeArtistNameParam(value) {
    var raw = String(value || '').trim().toLowerCase();
    if (!raw) return '';
    if (/harshad|duhita/.test(raw)) return 'Harshad and Duhita Golesar';
    if (/yugm/.test(raw)) return 'YUGM';
    if (/mohit/.test(raw)) return 'Mohit Shankar';
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
    var path = location.pathname.replace(/\/$/, '') || '/';
    ui.normalizeNewsletter();
    ui.normalizeArtistLinks();
    ui.normalizeAcademyLogoLinks();
    Object.keys(forms).forEach(function(name) {
      var def = forms[name];
      if (def.routes.indexOf(path) === -1) return;
      if (def.standalone) {
        ui.mountStandaloneForm(document.querySelector('[data-tsc-standalone-form]'), def, name, shared);
      } else {
        ui.mountFormInto(document.querySelector(def.mount), def, name, shared);
      }
    });
    prefillBookArtistForm();
  }

  ui.applyOnSchedule(boot);
})();
