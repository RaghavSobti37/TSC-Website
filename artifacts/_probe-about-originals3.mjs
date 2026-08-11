import fs from 'fs';

const h = fs.readFileSync('public/pages/about.html', 'utf8');
const css = fs.readFileSync('public/css/pages/about.css', 'utf8');
const mobile = fs.readFileSync('public/css/mobile/about.css', 'utf8');
const anim = fs.readFileSync('public/js/pages/about.animations.js', 'utf8');
const brand = fs.readFileSync('public/js/tsc-brand-cards.js', 'utf8');
const data = fs.readFileSync('public/js/content-data.js', 'utf8');

// warmup map mentions
const warm = h.match(/"comp-mr3h[^"]+"/g) || [];
console.log('warmup mr3h* ids:', [...new Set(warm)].slice(0, 40));

// Extract color vars near deleted sections from about.css
function extractBlock(src, id, n = 1200) {
  const i = src.indexOf(`#${id}`);
  if (i < 0) return null;
  return src.slice(i, i + n);
}

for (const id of ['comp-mr3hvomh','comp-mr3hkny1','comp-mr3hvon9','comp-mr3hknyp','comp-mr38xqqs','comp-mr3axlxx','comp-mr3fzskh1']) {
  for (const [label, src] of [['html', h], ['about.css', css]]) {
    const block = extractBlock(src, id, 2500);
    if (!block) continue;
    const colors = [...block.matchAll(/--(?:bg|brd|color)[^:]*:\s*([^;]+)/g)].map(m => m[0]);
    const rgb = [...block.matchAll(/rgb\([^)]+\)|#[0-9a-fA-F]{3,8}/g)].map(m => m[0]);
    console.log('\n', label, id, 'colors', [...new Set(colors)].slice(0,12));
    console.log('  rgb/hex', [...new Set(rgb)].slice(0,12));
  }
}

// color_ tokens that look purple/burgundy in about styles
const colorDefs = [...h.matchAll(/--color_(\d+):\s*([^;]+)/g)].slice(0, 40);
console.log('\ncolor tokens sample', colorDefs.map(m => m[0]).slice(0, 25));

// mobile about refs to deleted
for (const id of ['mr3hvomh','mr3hkny1','mr3hvon9','mr3hknyp','Originals','Films']) {
  console.log('mobile about', id, (mobile.match(new RegExp(id,'g'))||[]).length);
  console.log('anim', id, (anim.match(new RegExp(id,'g'))||[]).length);
  console.log('brand', id, (brand.match(new RegExp(id,'g'))||[]).length);
}

// content-data about block around Films/Originals
const idx = data.indexOf('TSC Films');
console.log('\ncontent-data near TSC Films:\n', data.slice(idx - 200, idx + 500));

// Who We Work With filmmakers - purple card?
const who = h.slice(h.indexOf('id="comp-mr3si7hw"'), h.indexOf('id="comp-mr3smd70"'));
console.log('\nWho We Work With length', who.length);
console.log('texts', [...who.matchAll(/wixui-rich-text__text[^>]*>([^<]{2,90})</g)].map(m=>m[1]).slice(0,20));
const whoBoxes = [...who.matchAll(/id="(comp-[^"]+)"[^>]*wixui-box/g)].map(m=>m[1]);
console.log('boxes', whoBoxes);
// bg for filmakers card
for (const id of whoBoxes.slice(0, 15)) {
  const b = extractBlock(h, id, 800) || extractBlock(css, id, 800);
  if (!b) continue;
  const bg = [...b.matchAll(/--bg:[^;]+|--bg-overlay[^;]+|background[^;]{0,40}/g)].slice(0,4);
  if (bg.length) console.log(id, bg.map(x=>x[0]));
}
