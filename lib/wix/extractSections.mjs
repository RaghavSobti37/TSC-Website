import { MOTION_CLASS_MAP } from './types.mjs';

function stripHtml(s) {
  return s
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&bull;/g, '•')
    .replace(/\s+/g, ' ')
    .trim();
}

function sectionChunk(html, id) {
  const re = new RegExp(`<section id="${id}"[\\s\\S]*?(?=<section id="comp-|<\\/main>)`, 'i');
  return html.match(re)?.[0] || '';
}

function extractSectionAnimations(chunk, sectionId) {
  /** @type {import('./types.mjs').WixAnimationEntry[]} */
  const entries = [];

  for (const [cls, preset] of Object.entries(MOTION_CLASS_MAP)) {
    if (chunk.includes(cls)) {
      entries.push({
        id: `${sectionId}--class-${cls}`,
        sectionId,
        preset,
        duration: 0.8,
        source: 'class',
      });
    }
  }

  const motionParts = [...chunk.matchAll(/data-motion-part="([^"]+)"/g)].map((m) => m[1]);
  for (const part of [...new Set(motionParts)]) {
    entries.push({
      id: part.replace(/\s+/g, '-'),
      sectionId,
      preset: part.startsWith('BG_') ? 'fade-in' : 'fade-up',
      duration: 0.8,
      source: 'data-motion-part',
    });
  }

  for (const m of chunk.matchAll(/data-image-info="([^"]+)"/g)) {
    try {
      const raw = m[1].replace(/&quot;/g, '"');
      const info = JSON.parse(raw);
      const id = info.containerId || `img-${entries.length}`;
      if (info.parallaxSpeed && info.parallaxSpeed !== 1) {
        entries.push({
          id: `${id}--parallax`,
          sectionId,
          preset: 'parallax',
          parallaxSpeed: info.parallaxSpeed,
          source: 'parallaxSpeed',
        });
      }
    } catch {
      /* skip malformed */
    }
  }

  if (chunk.includes('data-animate-blur')) {
    entries.push({
      id: `${sectionId}--blur`,
      sectionId,
      preset: 'blur-reveal',
      duration: 0.8,
      source: 'blur',
    });
  }

  if (!entries.length) {
    entries.push({
      id: `${sectionId}--default`,
      sectionId,
      preset: 'fade-up',
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      source: 'default',
    });
  }

  return entries;
}

/**
 * @param {string} html
 * @param {string} [pageSectionsId]
 */
export function extractSections(html, pageSectionsId = 'PAGE_SECTIONSlnrwl') {
  const mainRe = new RegExp(`<main id="${pageSectionsId}"[\\s\\S]*?<\\/main>`);
  const mainHtml = html.match(mainRe)?.[0] || '';
  const sectionIds = [...mainHtml.matchAll(/<section id="(comp-mq[^"]+)"/g)].map((m) => m[1]);

  return sectionIds.map((id) => {
    const chunk = sectionChunk(html, id);
    const headings = [...chunk.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi)].map((m) => stripHtml(m[1]));
    const paragraphs = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map((m) => stripHtml(m[1]))
      .filter((t) => t.length > 2);
    const imageUris = [...new Set([...chunk.matchAll(/&quot;uri&quot;:&quot;(19f989_[^&]+)&quot;/g)].map((m) => m[1]))];
    const buttons = [...chunk.matchAll(/aria-label="([^"]+)"[^>]*data-testid="buttonContent"/g)].map((m) => m[1]);
    const links = [...chunk.matchAll(/href="([^"]+)"[^>]*>[\s\S]*?(?:data-part="label"|aria-label)="?([^"<]+)/g)]
      .map((m) => ({ href: m[1].replace(/&amp;/g, '&'), label: stripHtml(m[2]) }))
      .filter((v, i, a) => a.findIndex((x) => x.href === v.href) === i)
      .slice(0, 20);

    return {
      id,
      label: headings[0] || id,
      headings,
      paragraphs: paragraphs.slice(0, 30),
      imageUris,
      buttons,
      links,
      animations: extractSectionAnimations(chunk, id),
    };
  });
}
