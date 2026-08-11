/*
 * Compatibility stub only.
 *
 * Wix-authored animation data lives in Thunderbolt motion / trigger payloads and
 * is released by tsc-wix-motion.js. Do not add independent reveal animations here.
 */
(function () {
  document.querySelectorAll('.tsc-reveal-pending, .tsc-reveal-ready').forEach(function (element) {
    element.classList.remove('tsc-reveal-pending', 'tsc-reveal-ready');
    element.style.removeProperty('--tsc-reveal-from-transform');
    element.style.removeProperty('--tsc-reveal-to-transform');
    element.style.removeProperty('--tsc-reveal-delay');
  });
})();
