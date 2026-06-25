import fs from 'fs';

const html = fs.readFileSync(process.env.WIX_HTML || `${process.env.TEMP}/wix-hdc-full.html`, 'utf8');
const ids = ['comp-mq6h99jp', 'comp-mqffd5wc', 'comp-mq7lr7m2', 'comp-mq6ig1tw', 'comp-mq7r4iw7', 'comp-mq7z6hk6', 'comp-mq84m6ve', 'comp-mqgaclmh'];
for (const id of ids) {
  const re = new RegExp(`#${id}\\{[^}]{0,400}\\}`, 'g');
  const m = html.match(re);
  console.log('\n' + id);
  if (m) m.slice(0, 2).forEach((s) => console.log(s.slice(0, 350)));
}
