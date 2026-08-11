import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const h = fs.readFileSync(join(root, 'public/films/index.html'), 'utf8');
const scripts = [...h.matchAll(/src=["']([^"']+)["']/g)].map((m) => m[1]);
console.log('scripts with tsc/content/boot:');
for (const s of scripts) {
  if (/tsc|content|boot|replacement|component/i.test(s)) console.log(s);
}
console.log('total scripts', scripts.length);
console.log('has tsc-components', scripts.some((s) => s.includes('tsc-components')));

// how is CSS loaded for page mesh?
const styleHrefs = [...h.matchAll(/data-href=["']([^"']+)["']/g)].map((m) => m[1]);
console.log('data-href count', styleHrefs.length);
console.log('sample data-href', styleHrefs.filter((x) => /films|css\/pages|static\.wix/i.test(x)).slice(0, 10));

// Check if pages/films.css content is inlined near end of last style
const lastStyle = h.lastIndexOf('<style');
console.log('last style starts', lastStyle);
const chunk = h.slice(lastStyle, lastStyle + 500);
console.log(chunk.slice(0, 300));

// Is TSC override in any style tag?
console.log('TSC Films hide in html styles', h.includes('hide Wix duplicate Partnerships'));
console.log('margin-left: 12px in html', h.includes('margin-left: 12px'));
