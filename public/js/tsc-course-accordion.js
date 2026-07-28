/**
 * Course curriculum accordions — Wix Thunderbolt accordion JS is not hydrated on
 * the static mirror, so headers never toggle. Polyfill open/close using the same
 * classes the mirrored CSS already animates (grid-template-rows 0fr ↔ 1fr).
 */
(function () {
  if (window.__tscCourseAccordion) return;
  window.__tscCourseAccordion = true;

  var OPEN = 'AccordionContainer1266025101--isOpened';
  var HIDDEN = 'AccordionContainer1266025101--isContentHidden';
  var ITEM = '.AccordionContainer1266025101__accordion, .wixui-accordion__item';
  var HEADER = '.AccordionContainer1266025101__accordionHeader, .wixui-accordion__title';
  var CONTENT = '.AccordionContainer1266025101__accordionContent';

  function closestItem(node) {
    return node && node.closest ? node.closest(ITEM) : null;
  }

  function setOpen(item, open) {
    if (!item) return;
    var btn = item.querySelector('button.AccordionContainer1266025101__accordionHeader, button[aria-controls]');
    var content = item.querySelector(CONTENT);
    item.classList.toggle(OPEN, open);
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (content) content.classList.toggle(HIDDEN, !open);
  }

  function onClick(event) {
    var header = event.target && event.target.closest
      ? event.target.closest('button.AccordionContainer1266025101__accordionHeader')
      : null;
    if (!header) return;
    var item = closestItem(header);
    if (!item || !item.closest('.wixui-accordion, .AccordionContainer1266025101__root, [id^="comp-"]')) return;
    event.preventDefault();
    var willOpen = !item.classList.contains(OPEN);
    // Single-open within the same accordion list (matches typical Wix course UX).
    var list = item.parentElement;
    if (list && willOpen) {
      Array.prototype.forEach.call(list.children, function (sibling) {
        if (sibling !== item && sibling.classList && sibling.classList.contains('AccordionContainer1266025101__accordion')) {
          setOpen(sibling, false);
        }
      });
    }
    setOpen(item, willOpen);
  }

  function bind() {
    if (document.documentElement.dataset.tscCourseAccordionBound === '1') return;
    document.documentElement.dataset.tscCourseAccordionBound = '1';
    document.addEventListener('click', onClick, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.TSCCourseAccordion = { init: bind, setOpen: setOpen };
})();
