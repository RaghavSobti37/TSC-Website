// Page animation bootstrap — course pages (heart / production / roots).
// Clear stale "already played" flags, then let tsc-wix-motion run enters + marquees.
(function () {
  try {
    sessionStorage.removeItem('wix-motion-played-animations');
  } catch (e) {}

  function ensureMotion() {
    if (document.querySelector('script[src*="tsc-wix-motion.js"]')) return;
    var s = document.createElement('script');
    s.src = '/js/tsc-wix-motion.js?v=course-marquee-1';
    s.defer = true;
    (document.body || document.documentElement).appendChild(s);
  }

  ensureMotion();

  var ready = window.__pageRevealPromise || Promise.resolve();
  ready.then(function () {
    requestAnimationFrame(function () {
      ensureMotion();
      // Nudge motion boot if it already loaded.
      if (typeof window.dispatchEvent === 'function') {
        try {
          window.dispatchEvent(new Event('tsc-course-motion-ready'));
        } catch (e) {}
      }
    });
  });
})();