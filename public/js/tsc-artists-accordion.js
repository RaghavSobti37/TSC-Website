/**
 * Meet Our Artists — mobile tap-to-expand accordion.
 * Hides Wix hover/peek carousel on ≤900px; desktop unchanged.
 */
(function () {
  var MQ = '(max-width: 1024px)';
  var SECTION = '#comp-mqtnpars';
  var CAROUSEL = '#comp-mqutig8q';
  var HOST_ATTR = 'data-tsc-artists-accordion';

  var CARD_SPECS = [
    {
      root: 'comp-mqtq8rsp',
      img: 'comp-mqtq8rsv',
      name: 'comp-mqtq8rt23',
      bio: 'comp-mqtq8rt44',
      btn: 'comp-mqtq8rt66',
      href: '/yugm'
    },
    {
      root: 'comp-mqutenq5',
      img: 'comp-mqutenqa',
      name: 'comp-mqutenqi',
      bio: 'comp-mqutenqk',
      btn: 'comp-mqutenqm',
      href: '/mohit-shankar'
    }
  ];

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function textOf(id) {
    var el = document.getElementById(id);
    if (!el) return '';
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function shortBio(raw) {
    var t = (raw || '').trim();
    if (!t) return '';
    // Prefer first sentence for cream panel readability
    var m = t.match(/^(.+?[.!?])(?:\s|$)/);
    if (m && m[1].length >= 40 && m[1].length <= 220) return m[1];
    if (t.length <= 220) return t;
    return t.slice(0, 200).replace(/\s+\S*$/, '') + '…';
  }

  function upgradeImg(src) {
    if (!src) return '';
    return src
      .replace(/\/v1\/fill\/w_\d+,h_\d+[^/]*/i, '/v1/fill/w_720,h_960,al_c,q_85,enc_avif,quality_auto')
      .replace(/,blur_\d+/i, '');
  }

  function imgOf(id) {
    var root = document.getElementById(id);
    if (!root) return { src: '', alt: '' };
    var img = root.querySelector('img');
    if (!img) return { src: '', alt: '' };
    return {
      src: upgradeImg(img.currentSrc || img.getAttribute('src') || ''),
      alt: img.getAttribute('alt') || ''
    };
  }

  function hrefOf(spec) {
    if (spec.href) return spec.href;
    var btn = document.getElementById(spec.btn);
    if (!btn) return '#';
    var a = btn.tagName === 'A' ? btn : btn.querySelector('a[href]');
    return (a && a.getAttribute('href')) || '#';
  }

  function collectArtists() {
    return CARD_SPECS.map(function (spec, index) {
      var img = imgOf(spec.img);
      var name = textOf(spec.name) || 'Artist ' + (index + 1);
      var bio = shortBio(textOf(spec.bio));
      var href = hrefOf(spec);
      return {
        id: 'tsc-artist-' + index,
        name: name,
        bio: bio,
        href: href,
        src: img.src,
        alt: img.alt || name
      };
    }).filter(function (a) {
      return a.src || a.name;
    });
  }

  function chevronSvg(dir) {
    // dir: 'up' | 'down'
    var points = dir === 'up' ? '6 14 12 8 18 14' : '6 10 12 16 18 10';
    return (
      '<svg class="tsc-artist-acc__chev-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<polyline points="' + points + '" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function cardMarkup(artist, open) {
    var expanded = open ? ' is-open' : '';
    var aria = open ? 'true' : 'false';
    return (
      '<article class="tsc-artist-acc' + expanded + '" data-tsc-artist-id="' + escapeHtml(artist.id) + '">' +
        '<button type="button" class="tsc-artist-acc__collapsed" aria-expanded="' + aria + '" aria-controls="' + escapeHtml(artist.id) + '-panel">' +
          '<span class="tsc-artist-acc__thumb-wrap">' +
            (artist.src
              ? '<img class="tsc-artist-acc__thumb" src="' + escapeHtml(artist.src) + '" alt="" loading="lazy" decoding="async">'
              : '') +
          '</span>' +
          '<span class="tsc-artist-acc__collapsed-name">' + escapeHtml(artist.name) + '</span>' +
          '<span class="tsc-artist-acc__chev tsc-artist-acc__chev--down" aria-hidden="true">' + chevronSvg('down') + '</span>' +
        '</button>' +
        '<div class="tsc-artist-acc__expanded" id="' + escapeHtml(artist.id) + '-panel"' + (open ? '' : ' hidden') + '>' +
          '<div class="tsc-artist-acc__photo-wrap">' +
            (artist.src
              ? '<img class="tsc-artist-acc__photo" src="' + escapeHtml(artist.src) + '" alt="' + escapeHtml(artist.alt) + '" loading="lazy" decoding="async">'
              : '') +
          '</div>' +
          '<div class="tsc-artist-acc__bar">' +
            '<p class="tsc-artist-acc__bar-name">' + escapeHtml(artist.name) + '</p>' +
            '<button type="button" class="tsc-artist-acc__collapse" aria-label="Collapse ' + escapeHtml(artist.name) + '">' +
              '<span class="tsc-artist-acc__chev tsc-artist-acc__chev--up" aria-hidden="true">' + chevronSvg('up') + '</span>' +
            '</button>' +
          '</div>' +
          '<div class="tsc-artist-acc__body">' +
            (artist.bio ? '<p class="tsc-artist-acc__bio">' + escapeHtml(artist.bio) + '</p>' : '') +
            (artist.href && artist.href !== '#'
              ? '<a class="tsc-artist-acc__cta" href="' + escapeHtml(artist.href) + '">Learn More</a>'
              : '') +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function setOpen(host, openId) {
    host.querySelectorAll('.tsc-artist-acc').forEach(function (card) {
      var id = card.getAttribute('data-tsc-artist-id');
      var isOpen = id === openId;
      card.classList.toggle('is-open', isOpen);
      var collapsedBtn = card.querySelector('.tsc-artist-acc__collapsed');
      var panel = card.querySelector('.tsc-artist-acc__expanded');
      if (collapsedBtn) collapsedBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (panel) {
        if (isOpen) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      }
    });
  }

  function bind(host) {
    if (host.dataset.bound === 'true') return;
    host.dataset.bound = 'true';
    host.addEventListener('click', function (event) {
      var collapse = event.target.closest('.tsc-artist-acc__collapse');
      if (collapse) {
        event.preventDefault();
        var openCard = collapse.closest('.tsc-artist-acc');
        if (openCard) setOpen(host, null);
        return;
      }
      var expand = event.target.closest('.tsc-artist-acc__collapsed');
      if (!expand) return;
      event.preventDefault();
      var card = expand.closest('.tsc-artist-acc');
      if (!card) return;
      var id = card.getAttribute('data-tsc-artist-id');
      var already = card.classList.contains('is-open');
      setOpen(host, already ? null : id);
    });
  }

  function mount() {
    if (!window.matchMedia(MQ).matches) {
      unmount();
      return;
    }
    var section = document.querySelector(SECTION);
    var carousel = document.querySelector(CAROUSEL);
    if (!section || !carousel) return;
    if (section.querySelector('[' + HOST_ATTR + ']')) return;

    var artists = collectArtists();
    if (!artists.length) return;

    var host = document.createElement('div');
    host.className = 'tsc-artists-accordion';
    host.setAttribute(HOST_ATTR, 'true');
    host.innerHTML = artists.map(function (artist, i) {
      return cardMarkup(artist, i === 0);
    }).join('');

    carousel.insertAdjacentElement('afterend', host);
    carousel.setAttribute('data-tsc-carousel-hidden-mobile', 'true');
    bind(host);
  }

  function unmount() {
    document.querySelectorAll('[' + HOST_ATTR + ']').forEach(function (node) {
      node.remove();
    });
    document.querySelectorAll('[data-tsc-carousel-hidden-mobile]').forEach(function (node) {
      node.removeAttribute('data-tsc-carousel-hidden-mobile');
    });
  }

  function init() {
    if (document.body && document.body.getAttribute('data-page') !== 'artists') return;
    mount();
  }

  window.TSCArtistsAccordion = { init: init, mount: mount, unmount: unmount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('load', init);
  [400, 1200, 3000].forEach(function (ms) {
    window.setTimeout(init, ms);
  });
  if (window.matchMedia) {
    window.matchMedia(MQ).addEventListener('change', function () {
      unmount();
      init();
    });
  }
})();
