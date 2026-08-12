/*
 * IntersectionObserver Reveal Animation System
 * Smooth entrance animations for elements with reveal classes or motion attributes.
 */
(function () {
  if (window.__tscAnimationsInit) return;
  window.__tscAnimationsInit = true;

  function initRevealAnimations() {
    var targets = document.querySelectorAll('.tsc-reveal-pending, [data-motion-enter], .wixui-rich-text, .wixui-image, .wixui-box');
    if (!targets.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('tsc-animated-visible');
            entry.target.dataset.motionEnter = 'done';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      targets.forEach(function (el) {
        if (!el.dataset.motionEnter || el.dataset.motionEnter !== 'done') {
          observer.observe(el);
        }
      });
    } else {
      targets.forEach(function (el) {
        el.classList.add('tsc-animated-visible');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRevealAnimations);
  } else {
    initRevealAnimations();
  }
  window.addEventListener('load', initRevealAnimations);
})();
