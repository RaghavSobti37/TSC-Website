/*
 * DESKTOP LOCK (>=1025px): The desktop design is locked to commit faf9dea forever.
 * This injector is intentionally a NO-OP for page HTML. Do NOT reintroduce automatic
 * CSS/JS injection into public/pages/*.html — it previously mutated the locked desktop
 * design. Mobile styles are linked manually with media="(max-width: 1024px)" only.
 * Never change desktop rendering unless the owner explicitly asks.
 */
function injectAllPages() {
  return { scanned: 0, updated: 0 };
}

module.exports = { injectAllPages };
