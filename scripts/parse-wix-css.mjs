import fs from 'fs';
import path from 'path';

const html = fs.readFileSync(process.env.WIX_HTML || path.join(process.env.TEMP, 'wix-hdc-full.html'), 'utf8');
const comps = ['comp-mq928b0f', 'comp-mq92f6f7', 'comp-mq92f14b', 'comp-mq92f39k', 'comp-mq7r4iw7', 'comp-mq6h99jp'];
for (const id of comps) {
  const re = new RegExp(`#${id}\\{[^}]+\\}`, 'g');
  const matches = html.match(re);
  console.log('\n' + id, matches ? matches.slice(0, 3).join('\n') : 'none');
}
