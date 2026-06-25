/**
 * @param {string} html
 */
export function extractTheme(html) {
  const themeMatch = html.match(
    /--color_11:(\d+,\d+,\d+);--color_12:(\d+,\d+,\d+);--color_13:(\d+,\d+,\d+);--color_14:(\d+,\d+,\d+);--color_15:(\d+,\d+,\d+)/
  );
  const hex = (s) => {
    const [r, g, b] = s.split(',').map(Number);
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  };

  if (!themeMatch) return {};

  return {
    cream: hex(themeMatch[1]),
    orangeDark: hex(themeMatch[2]),
    tealDark: hex(themeMatch[3]),
    teal: hex(themeMatch[4]),
    orange: hex(themeMatch[5]),
  };
}
