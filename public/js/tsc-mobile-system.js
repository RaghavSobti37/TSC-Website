/**
 * TSC mobile design system — sticky CTA, nav takeover, progress rail
 * Data attributes (wire later in integration slice):
 *   [data-tsc-sticky-cta]           sticky bar root
 *   [data-tsc-nav-takeover]         takeover panel
 *   [data-tsc-nav-open]             open trigger(s)
 *   [data-tsc-nav-close]            close trigger(s)
 *   [data-tsc-progress-rail]        rail root (needs --fill child or .tsc-progress-rail__fill)
 *   [data-tsc-progress-section]     section/stage observed for progress
 *   [data-tsc-progress-dot]         optional stage jump markers (value = stage index/id)
 */
(function (global) {
  "use strict";

  var MQ = "(max-width: 900px)";
  var SCROLL_SHOW_VH = 1;
  var DIR_DELTA = 8;

  function mqMobile() {
    return global.matchMedia ? global.matchMedia(MQ).matches : true;
  }

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* —— Sticky CTA: show after 1vh; hide on scroll-down, show on scroll-up —— */
  function initStickyCta(root) {
    var el = root || qs("[data-tsc-sticky-cta]") || qs(".tsc-sticky-cta");
    if (!el || el.__tscStickyBound) return el;
    el.__tscStickyBound = true;

    var lastY = global.scrollY || 0;
    var ticking = false;

    function update() {
      ticking = false;
      if (!mqMobile()) {
        el.classList.remove("is-visible", "is-hidden-down");
        el.removeAttribute("data-visible");
        return;
      }

      var y = global.scrollY || 0;
      var threshold = global.innerHeight * SCROLL_SHOW_VH;
      var past = y >= threshold;
      var delta = y - lastY;

      if (!past) {
        el.classList.remove("is-visible", "is-hidden-down");
        el.setAttribute("data-visible", "false");
      } else {
        el.classList.add("is-visible");
        el.setAttribute("data-visible", "true");
        if (delta > DIR_DELTA) {
          el.classList.add("is-hidden-down");
        } else if (delta < -DIR_DELTA) {
          el.classList.remove("is-hidden-down");
        }
      }
      lastY = y;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      global.requestAnimationFrame(update);
    }

    global.addEventListener("scroll", onScroll, { passive: true });
    global.addEventListener("resize", onScroll, { passive: true });
    update();
    return el;
  }

  /* —— Nav takeover open/close —— */
  function setNavOpen(panel, open) {
    if (!panel) return;
    panel.classList.toggle("is-open", open);
    panel.setAttribute("data-open", open ? "true" : "false");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("tsc-nav-locked", open);
  }

  function initNavTakeover(opts) {
    opts = opts || {};
    var panel =
      opts.panel ||
      qs("[data-tsc-nav-takeover]") ||
      qs(".tsc-nav-takeover");
    if (!panel || panel.__tscNavBound) return panel;
    panel.__tscNavBound = true;

    setNavOpen(panel, false);

    function open(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!mqMobile()) return;
      setNavOpen(panel, true);
      var closeBtn = qs("[data-tsc-nav-close]", panel) || qs(".tsc-nav-takeover__close", panel);
      if (closeBtn && closeBtn.focus) closeBtn.focus();
    }

    function close(e) {
      if (e && e.preventDefault) e.preventDefault();
      setNavOpen(panel, false);
    }

    qsa("[data-tsc-nav-open]").forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    qsa("[data-tsc-nav-close]", panel).concat(qsa(".tsc-nav-takeover__close", panel)).forEach(function (btn) {
      btn.addEventListener("click", close);
    });

    panel.addEventListener("click", function (e) {
      if (e.target === panel) close(e);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && panel.classList.contains("is-open")) close(e);
    });

    return {
      panel: panel,
      open: function () {
        setNavOpen(panel, true);
      },
      close: function () {
        setNavOpen(panel, false);
      },
    };
  }

  /* —— Progress rail: IntersectionObserver on stages —— */
  function initProgressRail(opts) {
    opts = opts || {};
    var rail =
      opts.rail ||
      qs("[data-tsc-progress-rail]") ||
      qs(".tsc-progress-rail");
    if (!rail || rail.__tscProgressBound) return rail;
    rail.__tscProgressBound = true;

    var fill =
      qs(".tsc-progress-rail__fill", rail) ||
      qs("[data-tsc-progress-fill]", rail);
    if (!fill) {
      fill = document.createElement("span");
      fill.className = "tsc-progress-rail__fill";
      rail.appendChild(fill);
    }

    var sections = opts.sections || qsa("[data-tsc-progress-section]");
    if (!sections.length) return rail;

    var ratios = sections.map(function () {
      return 0;
    });

    function setFill(pct) {
      var p = Math.max(0, Math.min(1, pct));
      fill.style.height = p * 100 + "%";
      rail.style.setProperty("--tsc-progress", String(p));
    }

    function recompute() {
      var n = sections.length;
      if (!n) return;
      var sum = 0;
      for (var i = 0; i < n; i++) sum += ratios[i];
      // average visibility → rough fill; prefer furthest active stage
      var active = -1;
      for (var j = 0; j < n; j++) {
        if (ratios[j] > 0.35) active = j;
      }
      if (active < 0) {
        setFill(sum / n);
      } else {
        setFill((active + ratios[active]) / n);
      }

      qsa("[data-tsc-progress-dot], .tsc-progress-rail__dot", rail).forEach(function (dot, idx) {
        var key = dot.getAttribute("data-tsc-progress-dot");
        var i = key != null && key !== "" ? Number(key) : idx;
        var on = i === active || (active < 0 && i === 0 && ratios[0] > 0);
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    if (!("IntersectionObserver" in global)) {
      setFill(0);
      return rail;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var idx = sections.indexOf(entry.target);
          if (idx < 0) return;
          ratios[idx] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        recompute();
      },
      {
        root: null,
        rootMargin: "0px 0px -20% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach(function (sec) {
      io.observe(sec);
    });

    qsa("[data-tsc-progress-dot], .tsc-progress-rail__dot", rail).forEach(function (dot) {
      dot.addEventListener("click", function () {
        var key = dot.getAttribute("data-tsc-progress-dot");
        var idx = key != null && key !== "" ? Number(key) : -1;
        var target =
          (idx >= 0 && sections[idx]) ||
          qs('[data-tsc-progress-section="' + key + '"]') ||
          null;
        if (target && target.scrollIntoView) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    return {
      rail: rail,
      setProgress: setFill,
      disconnect: function () {
        io.disconnect();
      },
    };
  }

  function initAll() {
    if (!mqMobile()) {
      // still bind so resize into mobile works
    }
    initStickyCta();
    initNavTakeover();
    initProgressRail();
  }

  var api = {
    init: initAll,
    initStickyCta: initStickyCta,
    initNavTakeover: initNavTakeover,
    initProgressRail: initProgressRail,
  };

  global.TSCMobileSystem = api;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})(typeof window !== "undefined" ? window : globalThis);
