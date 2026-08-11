const fs = require('fs');

const filmsHtml = fs.readFileSync('public/pages/films.html', 'utf8');
const impactCss = fs.readFileSync('public/css/pages/impact-report.css', 'utf8');

const failures = [];

if (!/setTimeout\(\s*finish\s*,\s*1200\s*\)/.test(filmsHtml)) {
  failures.push('films page reveal promise needs timeout fallback');
}

if (!impactCss.includes('orig_alan_sans_light')) {
  failures.push('impact report body font must use films Alan Sans stack');
}

if (/Madefor Text|Poppins/.test(impactCss)) {
  failures.push('impact report still uses non-films fallback font stack');
}

if (!impactCss.includes('--report-film-brown: #612314')) {
  failures.push('impact report needs shared TSC Films brown token');
}

if (!/\.report-page--film[\s\S]*var\(--report-film-brown\)/.test(impactCss)) {
  failures.push('film impact design must apply TSC Films brown');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('films reveal fallback and impact report design tokens verified');
