/** @typedef {'fade-up'|'fade-in'|'slide-up'|'slide-left'|'blur-reveal'|'parallax'|'none'} WixMotionPreset */

/**
 * @typedef {object} WixAnimationEntry
 * @property {string} id
 * @property {string} [sectionId]
 * @property {WixMotionPreset} preset
 * @property {number} [duration]
 * @property {number[]} [ease]
 * @property {number} [delay]
 * @property {number} [parallaxSpeed]
 * @property {string} [source] data-motion-part | class | blur | css
 */

/**
 * @typedef {object} WixSection
 * @property {string} id
 * @property {string} [label]
 * @property {string[]} headings
 * @property {string[]} paragraphs
 * @property {string[]} imageUris
 * @property {string[]} buttons
 * @property {{ href: string, label?: string }[]} links
 * @property {WixAnimationEntry[]} animations
 */

/**
 * @typedef {object} WixImportResult
 * @property {string} slug
 * @property {string} sourceHtml
 * @property {string} extractedAt
 * @property {{ cream?: string, orange?: string, orangeDark?: string, teal?: string, tealDark?: string }} theme
 * @property {{ label: string, href: string }[]} nav
 * @property {string[]} sectionIds
 * @property {WixSection[]} sections
 * @property {WixAnimationEntry[]} animationMap
 * @property {{ uri: string, localPath: string, source: 'local'|'cdn' }[]} assets
 */

export const WIX_EASE = {
  fadeUp: [0.22, 1, 0.36, 1],
  fadeIn: [0.37, 0, 0.63, 1],
  slide: [0.87, 0, 0.13, 1],
};

export const MOTION_CLASS_MAP = {
  XWeqiF: 'fade-in',
  sAGPNe: 'fade-in',
  gG6uhp: 'fade-up',
  cCFKrw: 'fade-in',
  k0CnHT: 'slide-left',
  JMRv7x: 'slide-left',
};
