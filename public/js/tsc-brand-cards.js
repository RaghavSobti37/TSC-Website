/**
 * Mark Wix bento cards with role classes — MOBILE ONLY.
 * Desktop DOM stays untouched (original Wix borders / CTA / cells).
 */
(function () {
  'use strict';

  var MQ = '(max-width: 1024px)';
  var ROLE_RE = /^tsc-(brand|mentor)-card(__[\w-]+)?$/;
  var observer = null;
  var pendingRun = 0;
  var applying = false;
  var RUNTIME_STYLE_ID = 'tsc-brand-card-runtime-mobile-style';

  var ABOUT_BRAND_CARDS = [
    {
      section: 'comp-mr38xqqo',
      card: 'comp-mr38xqqs',
      logoLabel: 'TSC Artists',
      accent: '#126d5f',
      media: 'comp-mr35c58m',
      eyebrow: 'comp-mr39ngdp',
      body: 'comp-mr38xqr6',
      list: 'comp-mr3a7k38',
      listTitle: 'comp-mr38xqri6',
      listItems: 'comp-mr38xqr7',
      tags: 'comp-mr38xqqu',
      cta: 'comp-mr35f98m',
      hide: ['comp-mr38xqr96']
    },
    {
      section: 'comp-mr3axlwa',
      card: 'comp-mr3axlxx',
      logoLabel: 'TSC Academy',
      accent: '#0c525f',
      media: 'comp-mr3axlz2',
      eyebrow: 'comp-mr3axlyr',
      body: 'comp-mr3axlzg',
      list: 'comp-mr3axly5',
      listTitle: 'comp-mr3axly63',
      listItems: 'comp-mr3axlyg',
      tags: 'comp-mr3axlyu4',
      cta: 'comp-mr3axlzv3'
    },
    {
      section: 'comp-mr3hvomh',
      card: 'comp-mr3hvona',
      logoLabel: 'TSC Originals',
      accent: '#592415',
      media: 'comp-mr3hvont',
      eyebrow: 'comp-mr3hvonj',
      body: 'comp-mr3hvonw2',
      list: 'comp-mr3hvond',
      listTitle: 'comp-mr3hvonh1',
      listItems: 'comp-mr3hvone',
      tags: 'comp-mr3hvonm',
      cta: 'comp-mr3hvoo22'
    },
    {
      section: 'comp-mr3fzsjq',
      card: 'comp-mr3fzskh1',
      logoLabel: 'Artist Path',
      accent: '#b74b02',
      media: 'comp-mr3fzsl0',
      eyebrow: 'comp-mr3fzskq4',
      body: 'comp-mr3fzsl44',
      list: 'comp-mr3fzskk',
      listTitle: 'comp-mr3fzskp',
      listItems: 'comp-mr3fzskl2',
      tags: 'comp-mr3fzskt3',
      cta: 'comp-mr3fzsla'
    },
    {
      section: 'comp-mr3hkny1',
      card: 'comp-mr3hknyr',
      logoLabel: 'TSC Films',
      accent: '#592415',
      media: 'comp-mr3hknz88',
      eyebrow: 'comp-mr3hknyz',
      body: 'comp-mr3hknzc5',
      list: 'comp-mr3hknyt5',
      listTitle: 'comp-mr3hknyx2',
      listItems: 'comp-mr3hknyu4',
      tags: 'comp-mr3hknz14',
      cta: 'comp-mr3hknzi1'
    }
  ];

  var LEARN_MENTOR_CARDS = [
    {
      card: 'comp-mrufx9pp4',
      title: 'comp-mrufx9py5',
      media: 'comp-mrufx9q74',
      identity: 'comp-mrufx9qb1',
      label: 'comp-mrufx9qc4',
      body: 'comp-mrufx9q33',
      tags: 'comp-mrufx9pr5',
      cta: 'comp-mrufx9qf1'
    },
    {
      card: 'comp-mrufx9qk',
      title: 'comp-mrufx9r03',
      media: 'comp-mrufx9r5',
      identity: 'comp-mrufx9r8',
      body: 'comp-mrufx9qn4',
      tags: 'comp-mrufx9qt3',
      cta: 'comp-mrufx9rb5'
    },
    {
      card: 'comp-mrufx9rg4',
      title: 'comp-mrufx9rt2',
      media: 'comp-mrufx9s5',
      identity: 'comp-mrufx9rp',
      body: 'comp-mrufx9rj1',
      tags: 'comp-mrufx9rx1',
      cta: 'comp-mrufx9si'
    }
  ];

  var ACADEMY_MENTOR_CARDS = [
    { card: 'comp-mpk4wrdy', identity: 'comp-mpjxmot92', body: 'comp-mpjo65ql3' },
    { card: 'comp-mpk4zpst', identity: 'comp-mpjxmoti5' },
    { card: 'comp-mpjxxers6', identity: 'comp-mpjxxert4' }
  ];

  function isMobile() {
    return window.matchMedia && window.matchMedia(MQ).matches;
  }

  function el(id) {
    return id ? document.getElementById(id) : null;
  }

  function addRole(node, role) {
    if (!node || !role) return;
    node.classList.add(role);
  }

  function ensureRuntimeStyles() {
    if (!isMobile() || !document.head) return;
    var css = [
      '@media (max-width: 1024px){',
      'body[data-page="about"] :is(#comp-mr38xqqo,#comp-mr3axlwa,#comp-mr3hvomh,#comp-mr3fzsjq,#comp-mr3hkny1),body[data-page="about"] :is(#comp-mr38xqqo,#comp-mr3axlwa,#comp-mr3hvomh,#comp-mr3fzsjq,#comp-mr3hkny1)>[data-testid="responsive-container-content"],body[data-page="about"] :is(#comp-mr38xqqo,#comp-mr3axlwa,#comp-mr3hvomh,#comp-mr3fzsjq,#comp-mr3hkny1)>[class*="-container"],body[data-page="about"] .tsc-brand-card,body[data-page="about"] .tsc-brand-card>[data-testid="responsive-container-content"],body[data-page="about"] .tsc-brand-card>[class*="-container"]{border:0!important;outline:0!important;box-shadow:none!important;}',
      'body[data-page="about"] .tsc-brand-card> .inner-box,body[data-page="about"] .tsc-brand-card> .jdJeEr{display:none!important;border:0!important;outline:0!important;box-shadow:none!important;background:transparent!important;}',
      'body[data-page="about"] .tsc-brand-card__eyebrow> .inner-box,body[data-page="about"] .tsc-brand-card__eyebrow> .jdJeEr,body[data-page="about"] .tsc-brand-card__body> .inner-box,body[data-page="about"] .tsc-brand-card__body> .jdJeEr,body[data-page="about"] .tsc-brand-card__list> .inner-box,body[data-page="about"] .tsc-brand-card__list> .jdJeEr,body[data-page="about"] .tsc-brand-card__tags> .inner-box,body[data-page="about"] .tsc-brand-card__tags> .jdJeEr{display:none!important;}',
      'body[data-page="about"] .tsc-brand-card__eyebrow,body[data-page="about"] .tsc-brand-card__body,body[data-page="about"] .tsc-brand-card__tags{display:block!important;height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important;padding:6px 2px!important;margin:0!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important;}',
      'body[data-page="about"] .tsc-brand-card__list{display:none!important;height:0!important;min-height:0!important;max-height:0!important;overflow:hidden!important;padding:0!important;margin:0!important;border:0!important;outline:0!important;box-shadow:none!important;}',
      'body[data-page="about"] .tsc-brand-card__mobile-logo{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;color:var(--tsc-card-accent,#126d5f)!important;font-family:Arial,Helvetica,sans-serif!important;font-weight:700!important;line-height:1!important;letter-spacing:.01em!important;}',
      'body[data-page="about"] .tsc-brand-card__mobile-logo-mark{display:block!important;width:28px!important;height:35px!important;flex:0 0 28px!important;background:currentColor!important;border-radius:68% 32% 58% 42%!important;transform:rotate(-16deg)!important;}',
      'body[data-page="about"] .tsc-brand-card__mobile-logo-text{display:block!important;font-size:18px!important;line-height:1.02!important;color:currentColor!important;text-align:left!important;white-space:normal!important;}',
      'body[data-page="about"] .tsc-brand-card__media .wixui-vector-image{display:block!important;}',
      'body[data-page="about"] .tsc-brand-card__eyebrow [data-testid="responsive-container-content"],body[data-page="about"] .tsc-brand-card__eyebrow [class*="-container"],body[data-page="about"] .tsc-brand-card__body [data-testid="responsive-container-content"],body[data-page="about"] .tsc-brand-card__body [class*="-container"],body[data-page="about"] .tsc-brand-card__list [data-testid="responsive-container-content"],body[data-page="about"] .tsc-brand-card__list [class*="-container"]{display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:4px!important;height:auto!important;min-height:0!important;max-height:none!important;padding:0!important;margin:0!important;overflow:visible!important;grid-template-columns:none!important;grid-template-rows:none!important;}',
      'body[data-page="about"] .tsc-brand-card__tags [data-testid="responsive-container-content"],body[data-page="about"] .tsc-brand-card__tags [class*="-container"]{display:flex!important;flex-direction:row!important;flex-wrap:wrap!important;align-items:flex-start!important;justify-content:flex-start!important;gap:6px!important;height:auto!important;min-height:0!important;max-height:none!important;padding:0!important;margin:0!important;overflow:visible!important;grid-template-columns:none!important;grid-template-rows:none!important;}',
      'body[data-page="about"] .tsc-brand-card__eyebrow [id^="comp-"],body[data-page="about"] .tsc-brand-card__body [id^="comp-"],body[data-page="about"] .tsc-brand-card__list [id^="comp-"],body[data-page="about"] .tsc-brand-card__tags [id^="comp-"]{position:relative!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;width:auto!important;max-width:100%!important;height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;transform:none!important;grid-area:auto!important;}',
      'body[data-page="about"] .tsc-brand-card__list-title{order:1!important;width:100%!important;margin:0 0 4px!important;}body[data-page="about"] .tsc-brand-card__list-items{order:2!important;width:100%!important;margin:0!important;}',
      'body[data-page="about"] .tsc-brand-card__pill,body[data-page="about"] .tsc-brand-card__list-items li,body[data-page="about"] .tsc-brand-card__list-items span:not(:empty){display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 1 auto!important;width:auto!important;max-width:100%!important;min-width:0!important;height:auto!important;min-height:0!important;margin:0!important;padding:5px 10px!important;border-radius:999px!important;background:rgba(255,255,255,.045)!important;border:1px solid rgba(255,255,255,.16)!important;}',
      'body[data-page="about"] .tsc-brand-card__body *,body[data-page="about"] .tsc-brand-card__body .wixui-rich-text__text{font-size:12.25px!important;line-height:1.45!important;font-weight:400!important;letter-spacing:0!important;text-align:left!important;color:#ffecd1!important;margin:0!important;max-height:none!important;overflow:visible!important;}',
      'body[data-page="about"] .tsc-brand-card__eyebrow *,body[data-page="about"] .tsc-brand-card__eyebrow .wixui-rich-text__text{font-size:10.5px!important;line-height:1.25!important;font-weight:700!important;letter-spacing:.07em!important;text-transform:uppercase!important;text-align:left!important;color:#ffecd1!important;margin:0!important;}',
      'body[data-page="about"] .tsc-brand-card__list-title *,body[data-page="about"] .tsc-brand-card__list-title .wixui-rich-text__text{font-size:11px!important;line-height:1.25!important;font-weight:700!important;text-align:left!important;color:#ffecd1!important;margin:0!important;}',
      'body[data-page="about"] .tsc-brand-card__pill *,body[data-page="about"] .tsc-brand-card__list-items *,body[data-page="about"] .tsc-brand-card__tags *{font-size:10px!important;line-height:1.2!important;font-weight:600!important;letter-spacing:0!important;text-align:center!important;color:#ffecd1!important;margin:0!important;}',
      '}'
    ].join('');
    var style = document.getElementById(RUNTIME_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = RUNTIME_STYLE_ID;
      style.textContent = css;
    }
    if (style.parentNode !== document.head || document.head.lastElementChild !== style) {
      document.head.appendChild(style);
    }
  }

  function stripRoles(root) {
    var nodes = (root || document).querySelectorAll('[class*="tsc-brand-card"], [class*="tsc-mentor-card"]');
    Array.prototype.forEach.call(nodes, function (node) {
      var next = [];
      Array.prototype.forEach.call(node.classList, function (cls) {
        if (!ROLE_RE.test(cls)) next.push(cls);
      });
      node.className = next.join(' ');
    });
  }

  function markPills(host) {
    if (!host) return;
    var content =
      host.querySelector(':scope > [data-testid="responsive-container-content"]') ||
      host.querySelector(':scope > [class*="-container"]') ||
      host;
    var direct = content.querySelectorAll(':scope > [id^="comp-"]');
    Array.prototype.forEach.call(direct, function (child) {
      if (child.classList.contains('tsc-brand-card') || child.classList.contains('tsc-mentor-card')) return;
      child.classList.add('tsc-brand-card__pill');
      if (host.classList.contains('tsc-mentor-card__tags')) {
        child.classList.add('tsc-mentor-card__pill');
      }
    });
  }

  function setImportant(node, styles) {
    if (!node || !node.style) return;
    Object.keys(styles).forEach(function (name) {
      node.style.setProperty(name, styles[name], 'important');
    });
  }

  function contentBox(host) {
    if (!host) return null;
    return (
      host.querySelector(':scope > [data-testid="responsive-container-content"]') ||
      host.querySelector(':scope > [class*="-container"]')
    );
  }

  function flattenRole(host, direction, gap) {
    if (!host) return;
    Array.prototype.forEach.call(host.querySelectorAll(':scope > .inner-box, :scope > .jdJeEr'), function (node) {
      setImportant(node, { display: 'none' });
    });
    setImportant(host, {
      display: 'block',
      height: 'auto',
      'min-height': '0',
      'max-height': 'none',
      overflow: 'visible'
    });
    var box = contentBox(host);
    if (box) {
      setImportant(box, {
        display: 'flex',
        'flex-direction': direction || 'column',
        'flex-wrap': direction === 'row' ? 'wrap' : 'nowrap',
        'align-items': direction === 'row' ? 'flex-start' : 'stretch',
        'justify-content': 'flex-start',
        gap: gap || '4px',
        height: 'auto',
        'min-height': '0',
        'max-height': 'none',
        padding: '0',
        margin: '0',
        overflow: 'visible',
        'grid-template-columns': 'none',
        'grid-template-rows': 'none'
      });
    }
    Array.prototype.forEach.call(host.querySelectorAll('[id^="comp-"]'), function (node) {
      setImportant(node, {
        position: 'relative',
        left: 'auto',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        width: 'auto',
        'max-width': '100%',
        height: 'auto',
        'min-height': '0',
        'max-height': 'none',
        margin: '0',
        transform: 'none',
        'grid-area': 'auto'
      });
    });
  }

  function clearFrame(node) {
    if (!node) return;
    setImportant(node, {
      border: '0',
      outline: '0',
      'box-shadow': 'none'
    });
    var box = contentBox(node);
    if (box) {
      setImportant(box, {
        border: '0',
        outline: '0',
        'box-shadow': 'none'
      });
    }
    Array.prototype.forEach.call(node.querySelectorAll(':scope > .inner-box, :scope > .jdJeEr'), function (layer) {
      setImportant(layer, {
        display: 'none',
        border: '0',
        outline: '0',
        'box-shadow': 'none',
        background: 'transparent'
      });
    });
  }

  function hideMiniList(spec) {
    var list = el(spec.list);
    if (!list) return;
    setImportant(list, {
      display: 'none',
      height: '0',
      'min-height': '0',
      'max-height': '0',
      padding: '0',
      margin: '0',
      overflow: 'hidden',
      border: '0',
      outline: '0',
      'box-shadow': 'none'
    });
  }

  function ensureMobileLogo(spec) {
    var media = el(spec.media);
    if (!media || !spec.logoLabel) return;
    var accent = spec.accent || '#126d5f';
    media.style.setProperty('--tsc-card-accent', accent);

    var realLogo = media.querySelector('.wixui-vector-image, [data-testid^="svgRoot"], svg');
    if (realLogo) {
      Array.prototype.forEach.call(media.querySelectorAll('.tsc-brand-card__mobile-logo'), function (node) {
        if (node.parentNode) node.parentNode.removeChild(node);
      });
      Array.prototype.forEach.call(media.querySelectorAll('.wixui-vector-image, [data-testid^="svgRoot"], svg'), function (node) {
        if (node.closest('.tsc-brand-card__mobile-logo')) return;
        setImportant(node, {
          display: 'block',
          visibility: 'visible',
          opacity: '1'
        });
      });
      return;
    }

    var box = contentBox(media) || media;
    var logo = media.querySelector('.tsc-brand-card__mobile-logo');
    if (!logo) {
      logo = document.createElement('div');
      logo.className = 'tsc-brand-card__mobile-logo';
      logo.setAttribute('aria-label', spec.logoLabel);
      logo.innerHTML =
        '<span class="tsc-brand-card__mobile-logo-mark" aria-hidden="true"></span>' +
        '<span class="tsc-brand-card__mobile-logo-text"></span>';
      box.appendChild(logo);
    }

    var text = logo.querySelector('.tsc-brand-card__mobile-logo-text');
    if (text) text.textContent = spec.logoLabel;

    setImportant(logo, {
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      gap: '8px',
      color: accent,
      margin: '0 auto',
      'font-weight': '700',
      'line-height': '1'
    });
    setImportant(logo.querySelector('.tsc-brand-card__mobile-logo-mark'), {
      display: 'block',
      width: '28px',
      height: '35px',
      flex: '0 0 28px',
      background: 'currentColor',
      'border-radius': '68% 32% 58% 42%',
      transform: 'rotate(-16deg)'
    });
    setImportant(text, {
      display: 'block',
      'font-size': '18px',
      'line-height': '1.02',
      color: 'currentColor',
      'text-align': 'left',
      'white-space': 'normal'
    });
  }

  function polishBrandSpec(spec) {
    var card = el(spec.card);
    var section = el(spec.section) || (card && card.closest('section'));
    clearFrame(section);
    clearFrame(card);

    var media = el(spec.media);
    if (media) {
      Array.prototype.forEach.call(media.querySelectorAll(':scope > .inner-box, :scope > .jdJeEr'), function (node) {
        setImportant(node, { display: 'none' });
      });
      setImportant(media, {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        height: 'auto',
        'min-height': '88px',
        padding: '12px 14px',
        overflow: 'hidden'
      });
      Array.prototype.forEach.call(media.querySelectorAll('[data-testid="responsive-container-overflow"], [data-testid="responsive-container-content"], [class*="-overflow-wrapper"], [class*="-container"]'), function (node) {
        setImportant(node, {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          width: '100%',
          height: 'auto',
          'min-height': '54px',
          padding: '0',
          margin: '0',
          overflow: 'visible'
        });
      });
      Array.prototype.forEach.call(media.querySelectorAll('[id^="comp-"].wixui-vector-image, svg'), function (node) {
        setImportant(node, {
          display: 'block',
          width: node.tagName && node.tagName.toLowerCase() === 'svg' ? '220px' : '220px',
          height: node.tagName && node.tagName.toLowerCase() === 'svg' ? 'auto' : '76px',
          'min-height': node.tagName && node.tagName.toLowerCase() === 'svg' ? '72px' : '72px',
          'max-width': '82%',
          'max-height': '76px',
          margin: '0 auto',
          overflow: 'visible'
        });
      });
      ensureMobileLogo(spec);
    }
    flattenRole(el(spec.eyebrow), 'column', '4px');
    flattenRole(el(spec.body), 'column', '4px');
    hideMiniList(spec);
    flattenRole(el(spec.tags), 'row', '6px');
    setImportant(el(spec.listTitle), { order: '1', width: '100%', margin: '0 0 4px' });
    setImportant(el(spec.listItems), { order: '2', width: '100%', margin: '0' });
    var pillsHost = el(spec.tags);
    if (!pillsHost) return;
    Array.prototype.forEach.call(pillsHost.querySelectorAll('.tsc-brand-card__pill'), function (pill) {
      setImportant(pill, {
        display: 'inline-flex',
        'align-items': 'center',
        'justify-content': 'center',
        flex: '0 1 auto',
        width: 'auto',
        'max-width': '100%',
        height: 'auto',
        'min-height': '0',
        margin: '0',
        padding: '5px 10px',
        'border-radius': '999px'
      });
    });
  }

  function applyBrandSpec(spec) {
    var card = el(spec.card);
    if (!card) return;
    addRole(card, 'tsc-brand-card');
    addRole(el(spec.media), 'tsc-brand-card__media');
    addRole(el(spec.eyebrow), 'tsc-brand-card__eyebrow');
    addRole(el(spec.body), 'tsc-brand-card__body');
    addRole(el(spec.list), 'tsc-brand-card__list');
    addRole(el(spec.listTitle), 'tsc-brand-card__list-title');
    addRole(el(spec.listItems), 'tsc-brand-card__list-items');
    addRole(el(spec.tags), 'tsc-brand-card__tags');
    addRole(el(spec.cta), 'tsc-brand-card__cta');
    (spec.hide || []).forEach(function (id) {
      addRole(el(id), 'tsc-brand-card__hide');
    });
    markPills(el(spec.tags));
    polishBrandSpec(spec);
  }

  function applyMentorSpec(spec) {
    var card = el(spec.card);
    if (!card) return;
    addRole(card, 'tsc-mentor-card');
    addRole(el(spec.title), 'tsc-mentor-card__title');
    addRole(el(spec.media), 'tsc-mentor-card__media');
    addRole(el(spec.identity), 'tsc-mentor-card__identity');
    addRole(el(spec.label), 'tsc-mentor-card__label');
    addRole(el(spec.creds), 'tsc-mentor-card__creds');
    addRole(el(spec.body), 'tsc-mentor-card__body');
    addRole(el(spec.tags), 'tsc-mentor-card__tags');
    addRole(el(spec.cta), 'tsc-mentor-card__cta');
    markPills(el(spec.tags));
  }

  function isKnownRoleId(id) {
    if (!id) return false;
    var lists = ABOUT_BRAND_CARDS.concat(LEARN_MENTOR_CARDS, ACADEMY_MENTOR_CARDS);
    return lists.some(function (spec) {
      return Object.keys(spec).some(function (key) {
        if (key === 'hide') return (spec.hide || []).indexOf(id) !== -1;
        return spec[key] === id;
      });
    });
  }

  function polishOrphanKnowMores() {
    var buttons = document.querySelectorAll(
      'a.wixui-button, a.PoVCDy, [role="button"], .lIkFMb'
    );
    Array.prototype.forEach.call(buttons, function (btn) {
      var label = (btn.getAttribute('aria-label') || btn.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();
      if (!/know more/i.test(label)) return;
      var host = btn.closest('[id^="comp-"]');
      if (!host) return;
      if (
        host.classList.contains('tsc-brand-card__cta') ||
        host.classList.contains('tsc-mentor-card__cta')
      ) {
        return;
      }
      var inCourse = host.closest(
        '#comp-mrufx9pp4, #comp-mrufx9qk, #comp-mrufx9rg4, #comp-mpk4wrdy, #comp-mpk4zpst, #comp-mpjxxers6, #comp-mpjzvp90, #comp-mqmi3w3o, #comp-mqmi6ynt2, #comp-mqmi8cxm2, #comp-mqmi8sui'
      );
      if (!inCourse) return;
      host.classList.add('tsc-mentor-card__cta');
    });
  }

  function polishFilmsMentorLabels() {
    var labels = document.querySelectorAll(
      '#comp-mqmi8sv51, #comp-mqmi3w4i1, #comp-mqmi6yok, #comp-mqmi8cyd1'
    );
    Array.prototype.forEach.call(labels, function (node) {
      node.classList.add('tsc-mentor-card__label');
      var parent = node.parentElement && node.parentElement.closest('[id^="comp-"]');
      if (parent) parent.classList.add('tsc-mentor-card__identity');
    });
  }

  function applyMobile() {
    applying = true;
    ensureRuntimeStyles();
    ABOUT_BRAND_CARDS.forEach(applyBrandSpec);
    LEARN_MENTOR_CARDS.forEach(applyMentorSpec);
    ACADEMY_MENTOR_CARDS.forEach(applyMentorSpec);
    polishOrphanKnowMores();
    polishFilmsMentorLabels();
    ensureRuntimeStyles();
    applying = false;
  }

  function run() {
    if (!isMobile()) {
      stripRoles(document);
      return;
    }
    applyMobile();
  }

  function scheduleRun(delay) {
    window.clearTimeout(pendingRun);
    pendingRun = window.setTimeout(run, delay == null ? 80 : delay);
  }

  function observeHydration() {
    if (observer || !window.MutationObserver || !document.body) return;
    observer = new MutationObserver(function (mutations) {
      if (applying || !isMobile()) return;
      var shouldRun = mutations.some(function (mutation) {
        if (mutation.type === 'childList') return mutation.addedNodes.length || mutation.removedNodes.length;
        if (mutation.type === 'attributes') {
          var target = mutation.target;
          var className = target && target.getAttribute ? target.getAttribute('class') || '' : '';
          return (
            target &&
            target.id &&
            isKnownRoleId(target.id) &&
            (
              className.indexOf('tsc-brand-card') === -1 ||
              className.indexOf('tsc-mentor-card') === -1
            )
          );
        }
        return false;
      });
      if (shouldRun) scheduleRun(60);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  function schedule() {
    run();
    observeHydration();
    [200, 600, 1200, 2400, 4000, 6500, 9000].forEach(function (ms) {
      window.setTimeout(run, ms);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('load', function () {
    run();
    observeHydration();
  });

  if (window.matchMedia) {
    var mql = window.matchMedia(MQ);
    var onChange = function () {
      run();
    };
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else if (mql.addListener) mql.addListener(onChange);
  }
  window.addEventListener('resize', function () {
    window.clearTimeout(window.__tscBrandCardResize);
    window.__tscBrandCardResize = window.setTimeout(run, 120);
  });
})();
