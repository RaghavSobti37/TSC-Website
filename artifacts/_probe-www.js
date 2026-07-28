const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');
const needles = [
  'Who We Work',
  'FILMMAKERS',
  'STORYTELLERS',
  'We help artists',
  'discover identity',
  'Artists —',
  'Brands —',
  'Audiences',
  'Institutions',
];
for (const n of needles) console.log(JSON.stringify(n), html.includes(n));

const re =
  /<(?:h[1-6]|p)[^>]*class="[^"]*wixui-rich-text__text"[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/gi;
const titles = [];
let m;
while ((m = re.exec(html))) {
  const t = m[1]
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 2 && t.length < 90) titles.push(t);
}
console.log(
  'hits',
  titles.filter((t) => /work|artist|film|brand|audience|who|story/i.test(t)).slice(0, 50)
);

// also search about
const about = fs.readFileSync('public/pages/about.html', 'utf8');
for (const n of needles) console.log('about', JSON.stringify(n), about.includes(n));
