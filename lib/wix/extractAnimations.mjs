/**
 * Flatten section animations + global button hovers into animation-map.json shape.
 * @param {import('./types.mjs').WixSection[]} sections
 * @param {string} html
 */
export function buildAnimationMap(sections, html) {
  const map = sections.flatMap((s) => s.animations);

  if (html.includes('StylableButton') || html.includes('wixui-button')) {
    map.push({
      id: 'global--button-hover',
      preset: 'none',
      duration: 0.4,
      source: 'css-hover',
    });
  }

  const presets = {
    'fade-up': { duration: 0.8, ease: [0.22, 1, 0.36, 1], y: 40 },
    'fade-in': { duration: 1, ease: [0.37, 0, 0.63, 1] },
    'blur-reveal': { duration: 0.8, blur: 9 },
    parallax: { driver: 'scroll' },
    'slide-left': { duration: 0.8, ease: [0.87, 0, 0.13, 1], x: '100%' },
  };

  return { version: 1, presets, elements: map };
}
