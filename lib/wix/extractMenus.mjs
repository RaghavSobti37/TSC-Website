/**
 * @param {string} html
 */
export function extractMenus(html) {
  const nav = [...html.matchAll(/data-part="menu-item-link" href="([^"]+)"[^>]*>[\s\S]*?data-part="label">([^<]+)</g)]
    .map((m) => ({ href: m[1].replace(/&amp;/g, '&'), label: m[2].trim() }))
    .filter((v, i, a) => a.findIndex((x) => x.label === v.label) === i);

  const breakpoint = [...html.matchAll(/max-width:\s*(\d+)px\)[^{]*comp-mq6d7i8b/g)].map((m) => Number(m[1]))[0] || 1000;

  return {
    items: nav,
    mobileBreakpoint: breakpoint,
    desktopComponent: 'comp-mq6d7i6d',
    mobileDrawer: 'comp-mq6d7i8b',
  };
}
