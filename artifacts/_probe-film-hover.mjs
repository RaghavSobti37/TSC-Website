import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, '../public/css/pages/films.css');
const css = fs.readFileSync(cssPath, 'utf8');

const ids = [
  'comp-mqmi3w4b3', 'comp-mqmi6yoc4', 'comp-mqmi8cy66', 'comp-mqmi8sv12',
  'comp-mqmi3w3o', 'comp-mqmi6ynt2', 'comp-mqmi8cxm2', 'comp-mqmi8sui',
  'comp-mqmi3w4i1', 'comp-mqmi3w473'
];

for (const id of ids) {
  const re = new RegExp(`#${id}[^{}]*\\{[^}]*\\}`, 'g');
  const matches = css.match(re) || [];
  const hoverRe = new RegExp(`#${id}[^\\{]*:hover[^\\{]*\\{[^}]*\\}`, 'g');
  const hover = css.match(hoverRe) || [];
  console.log(`\n=== ${id} rules=${matches.length} hover=${hover.length}`);
  hover.slice(0, 8).forEach((m) => console.log(m.slice(0, 300)));
}

// broader hover near film image comps
const near = [...css.matchAll(/#[^\s,{]*mqmi3w4b3[^\s,{]*:hover[^{]*\{[^}]*\}/g)].slice(0, 20);
console.log('\n=== near mqmi3w4b3:hover ===');
near.forEach((m) => console.log(m[0].slice(0, 400)));

const grayscale = [...css.matchAll(/[^{}]*grayscale[^{}]*\{[^}]*\}|[^{}]*\{[^}]*grayscale[^}]*\}/g)].slice(0, 15);
console.log('\n=== grayscale rules ===');
grayscale.forEach((m) => console.log(m[0].slice(0, 300)));

const filterHover = [...css.matchAll(/[^{}]*:hover[^{]*\{[^}]*filter:[^}]*\}/g)].slice(0, 30);
console.log('\n=== :hover with filter ===');
filterHover.forEach((m) => console.log(m[0].slice(0, 350)));

// fetch live page image srcs
http.get('http://127.0.0.1:3017/films', (res) => {
  let d = '';
  res.on('data', (c) => (d += c));
  res.on('end', () => {
    for (const id of ['comp-mqmi3w4b3', 'comp-mqmi6yoc4', 'comp-mqmi8cy66', 'comp-mqmi8sv12']) {
      const i = d.indexOf(`id="${id}"`);
      if (i < 0) {
        console.log('\nMISSING', id);
        continue;
      }
      const chunk = d.slice(i, i + 2500);
      const imgs = [...chunk.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
      const styles = [...chunk.matchAll(/style="([^"]*background[^"]*)"/gi)].map((m) => m[1].slice(0, 200));
      console.log(`\n=== HTML ${id} ===`);
      console.log('imgs', imgs.slice(0, 6));
      console.log('bg styles', styles.slice(0, 4));
      console.log(chunk.slice(0, 600).replace(/\s+/g, ' '));
    }
  });
}).on('error', (e) => console.error('fetch fail', e.message));
