/*
 * Wix animation runtime compatibility.
 *
 * The mirrored Thunderbolt motion runtime owns all animation definitions. This
 * guard only prevents browser Animation rangeStart/rangeEnd setter exceptions
 * from aborting Wix's own scroll/progress task queue on static mirrors.
 */
(function () {
  if (!window.Animation || window.__tscWixAnimationRuntimeGuard) return;
  window.__tscWixAnimationRuntimeGuard = true;

  ['rangeStart', 'rangeEnd'].forEach(function (property) {
    var descriptor = Object.getOwnPropertyDescriptor(window.Animation.prototype, property);
    if (!descriptor || typeof descriptor.set !== 'function' || typeof descriptor.get !== 'function') return;
    Object.defineProperty(window.Animation.prototype, property, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: function () {
        return descriptor.get.call(this);
      },
      set: function (value) {
        try {
          descriptor.set.call(this, value);
        } catch (error) {
          if (
            error &&
            error.name === 'InvalidStateError' &&
            (!this.effect || !this.effect.target)
          ) {
            return;
          }
          throw error;
        }
      },
    });
  });

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event && event.reason;
    var message = String((reason && (reason.stack || reason.message)) || reason || '');
    if (
      reason &&
      reason.name === 'AbortError' &&
      /wix-thunderbolt\/dist\/motion|motion\.[\w.-]+\.chunk\.min\.js/i.test(message)
    ) {
      event.preventDefault();
    }
  });
})();
