import fs from 'fs';
import { execSync } from 'child_process';

const h = fs.readFileSync('public/pages/about.html', 'utf8');

// Find which comps use color_23 / color_24 (burgundy)
for (const c of ['color_23', 'color_24', 'color_14', 'color_18', 'color_25', 'color_12']) {
  const re = new RegExp(`#(comp-[a-z0-9_]+)[^#]{0,200}--bg:var\\(--${c}\\)`, 'g');
  const hits = [];
  let m;
  while ((m = re.exec(h))) hits.push(m[1]);
  // also reverse order --bg then later
  const re2 = new RegExp(`#(comp-[a-z0-9_]+)\\{[^{}]{0,400}--bg:var\\(--${c}\\)`, 'g');
  while ((m = re2.exec(h))) hits.push(m[1]);
  console.log(c, [...new Set(hits)].slice(0, 30));
}

// Extract card bg for all known brand card shells from CSS in html
const cardIds = [
  'comp-mr3hvona','comp-mr3hvon9','comp-mr3hknyr','comp-mr3hknyp',
  'comp-mr38xqqs','comp-mr3axlxx','comp-mr3fzskh1','comp-mr3ifogb'
];
for (const id of cardIds) {
  const re = new RegExp(`#${id}\\{[^}]{0,500}`, 'g');
  const blocks = h.match(re) || [];
  const bg = blocks.map(b => (b.match(/--bg:[^;]+/) || [])[0]).filter(Boolean);
  console.log(id, 'bg', [...new Set(bg)]);
}

// Try restore from git blob without writing huge file - stream search
function gitHas(id) {
  try {
    const out = execSync(
      `git -C "c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website" grep -n "${id}" 4645192 -- public/pages/about.html`,
      { encoding: 'utf8', maxBuffer: 10e6 }
    );
    return out.slice(0, 200);
  } catch (e) {
    return e.stdout ? e.stdout.slice(0, 200) : 'NO';
  }
}
console.log('\ngit 4645192 mr3hvomh', gitHas('comp-mr3hvomh'));
console.log('git 4645192 Originals', gitHas('TSC Originals'));
console.log('git 4645192 Mounting films', gitHas('Mounting films'));

// Extract from warmup JSON the structure for originals/films cards
const warmStart = h.indexOf('id="wix-warmup-data"');
const warmJson = h.slice(h.indexOf('{', warmStart), h.indexOf('</script>', warmStart));
const warm = JSON.parse(warmJson);
const map = warm.pages?.compIdToTypeMap || {};
const related = Object.keys(map).filter(k => /mr3hv|mr3hk/.test(k));
console.log('\nwarmup related comps', related.length);
console.log(related.sort().join('\n'));

// Try show content from d45da49 with git show piped to node
try {
  const old = execSync(
    `git -C "c:/Users/ragha/OneDrive/Desktop/TSC Platform/website/TSC-Website" show d45da49:public/pages/about.html`,
    { encoding: 'utf8', maxBuffer: 80e6 }
  );
  console.log('\nold about size', old.length);
  console.log('has section mr3hvomh', old.includes('id="comp-mr3hvomh"'));
  console.log('has Originals text', old.includes('TSC Originals') || old.includes('Originals'));
  console.log('has Films text', /TSC Films|Mounting films/i.test(old));
  for (const sid of ['comp-mr3hvomh','comp-mr3hkny1']) {
    const i = old.indexOf(`id="${sid}"`);
    if (i < 0) { console.log(sid, 'missing in old'); continue; }
    const chunk = old.slice(i, i + 25000);
    const texts = [...chunk.matchAll(/wixui-rich-text__text[^>]*>([^<]{2,100})</g)].map(m => m[1].replace(/\s+/g,' ').trim()).filter(Boolean);
    console.log('\nOLD', sid, 'texts:', [...new Set(texts)].slice(0, 20).join(' | '));
    const vec = [...chunk.matchAll(/id="(comp-[^"]+)"[^>]*wixui-vector-image/g)].map(m => m[1]);
    console.log('vectors', vec);
    const boxes = [...chunk.matchAll(/id="(comp-[^"]+)"[^>]*wixui-box/g)].map(m => m[1]).slice(0, 20);
    console.log('boxes', boxes);
  }
  // card bg colors in old
  for (const id of ['comp-mr3hvona','comp-mr3hknyr','comp-mr3hvon9','comp-mr3hknyp']) {
    const re = new RegExp(`#${id}\\{[^}]{0,400}`, 'g');
    const b = (old.match(re) || [])[0] || '';
    console.log('old bg', id, (b.match(/--bg:[^;]+/) || [])[0]);
  }
} catch (e) {
  console.log('git show failed', e.message.slice(0, 200));
}
