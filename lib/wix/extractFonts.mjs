/**
 * @param {string} html
 */
export function extractFonts(html) {
  const faces = [];
  const re = /@font-face\s*\{([^}]+)\}/g;
  let m;
  while ((m = re.exec(html))) {
    const block = m[1];
    const family = block.match(/font-family:\s*([^;]+)/)?.[1]?.trim();
    const urls = [...block.matchAll(/url\(([^)]+)\)/g)].map((u) => u[1].replace(/['"]/g, ''));
    if (family && urls.length) {
      faces.push({ family, urls });
    }
  }
  return faces;
}
