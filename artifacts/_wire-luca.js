const fs = require('fs');

function read(p) { return fs.readFileSync(p, 'utf8'); }
function write(p, c) { fs.writeFileSync(p, c); }

// Accordion leftovers
{
  let mp = read('public/pages/music-production.html');
  const accordionFix = [
    ['00 : IT ALL STARTS HERE', '00 : Intro'],
    ['02 : BHAAV (EMOTIONS)', '02 : Melody and Chords'],
    ['07 : EXTENDING THE BASIC MELODY', '07 : Recording'],
    ['08 : COMPOSITION FUNDAMENTALS', '08 : Production Techniques'],
    ['11  : COLLABORATION', '11 : Studio Workflow'],
    ['12 : COMPOSING A SONG TOGETHER', '12 : Hands-on Project'],
    ['13 : Unfolding Artist Force ', '13 : Final Track'],
    ['05 : Song Forms ', '05 : Song Forms']
  ];
  for (const [a, b] of accordionFix) mp = mp.split(a).join(b);
  write('public/pages/music-production.html', mp);
  console.log('accordions', [...mp.matchAll(/wixui-accordion__title[^>]*>([^<]+)/g)].map((m) => m[1]));
}

function ensurePrice(file) {
  // Owner: enroll marquee must NOT show ₹3,999 — leave as "Enroll Now" only.
  let h = read(file);
  if (h.includes('tsc-course-price') || /marquee-item-text[\s\S]{0,160}3,?999/.test(h)) {
    h = h.replace(/<span class="tsc-course-price"[^>]*>[\s\S]*?<\/span>/gi, '');
    write(file, h);
    console.log('price stripped', file);
    return;
  }
  console.log('price already clean', file);
}
ensurePrice('public/pages/the-heart-of-composition.html');
ensurePrice('public/pages/roots-of-hindustani-classical.html');

function wireLucaCard(file, opts) {
  let h = read(file);
  h = h.split('Coming Soon...').join('A-Z of Music Production');

  // Know More: div role=button + inner div linkElement -> outer div + <a>
  const openFrom =
    `<div class="${opts.btnClass} lIkFMb" id="${opts.btnId}" role="button" tabindex="0" aria-disabled="false"><div data-testid="linkElement" class="PoVCDy wixui-button ZhVEJq" aria-label="Know More                                               " aria-disabled="false">`;
  const openTo =
    `<div class="${opts.btnClass} lIkFMb" id="${opts.btnId}" aria-disabled="false"><a data-testid="linkElement" href="/music-production" target="_self" class="PoVCDy wixui-button ZhVEJq" aria-disabled="false" aria-label="Know More                                               ">`;
  if (!h.includes(openFrom)) throw new Error('Know More open miss ' + file);
  h = h.split(openFrom).join(openTo);

  const labelCloseFrom = `id="${opts.btnId}"`;
  const bi = h.indexOf(labelCloseFrom);
  const spanClose = h.indexOf('</span></div></div><!--/$-->', bi);
  if (spanClose < 0) throw new Error('Know More close miss ' + file);
  h = h.slice(0, spanClose) + '</span></a></div><!--/$-->' + h.slice(spanClose + '</span></div></div><!--/$-->'.length);
  console.log('Know More wired', file);

  for (const imgId of opts.imageIds) {
    const openImgFrom = `<div id="${imgId}" data-testid="imageX" class="i4P7Vt ${imgId} ZYZJBv wixui-image"><div class="YX2qkL" data-motion-part="BG_LAYER ${imgId}">`;
    const openImgTo = `<div id="${imgId}" data-testid="imageX" class="i4P7Vt ${imgId} ZYZJBv wixui-image"><a data-motion-part="BG_LAYER ${imgId}" data-testid="linkElement" href="/music-production" target="_self" class="YX2qkL">`;
    if (!h.includes(openImgFrom)) throw new Error('img open miss ' + file + ' ' + imgId);
    h = h.split(openImgFrom).join(openImgTo);

    const imgStart = h.indexOf(`id="${imgId}"`);
    const wow = h.indexOf('</wow-image>', imgStart);
    const closeFrom = '</wow-image></div></div></div><!--/$-->';
    if (h.slice(wow, wow + closeFrom.length) !== closeFrom) {
      throw new Error('img close miss ' + file + ' ' + imgId + ' got ' + h.slice(wow, wow + 80));
    }
    h = h.slice(0, wow) + '</wow-image></div></a></div><!--/$-->' + h.slice(wow + closeFrom.length);
    console.log('image linked', file, imgId);
  }

  write(file, h);
}

wireLucaCard('public/pages/academy.html', {
  btnClass: 'comp-mpjxxery4',
  btnId: 'comp-mpjxxery4',
  imageIds: ['comp-mpjxxere2', 'comp-mrg43yyg']
});
wireLucaCard('public/pages/learn-with-tsc.html', {
  btnClass: 'comp-mrufx9si',
  btnId: 'comp-mrufx9si',
  imageIds: ['comp-mrufx9s5', 'comp-mrufx9s8']
});

function patchCoursesDropdown(file) {
  let h = read(file);
  const item =
    '<li class="" data-item-depth="1"><a data-testid="linkElement" data-part="dropdown-item" href="/music-production" target="_self" class="ptLEUT eP1KVV x0UOau wixui-dropdown-menu__item has-inner-focus-ring"><span class="u9_aLl wixui-dropdown-menu__item-label" data-part="dropdown-item-label" data-testid="submenu-item-label">A-Z of Music Production</span></a></li>';
  const rootsItemEnd =
    'href="/roots-of-hindustani-classical" target="_self" class="ptLEUT eP1KVV x0UOau wixui-dropdown-menu__item has-inner-focus-ring"><span class="u9_aLl wixui-dropdown-menu__item-label" data-part="dropdown-item-label" data-testid="submenu-item-label">Roots of Hindustani Classical</span></a></li>';
  if (!h.includes(rootsItemEnd)) throw new Error('dropdown roots miss ' + file);

  let out = '';
  let idx = 0;
  let count = 0;
  while (true) {
    const found = h.indexOf(rootsItemEnd, idx);
    if (found < 0) {
      out += h.slice(idx);
      break;
    }
    const after = found + rootsItemEnd.length;
    out += h.slice(idx, after);
    const window = h.slice(after, after + 220);
    if (!window.includes('A-Z of Music Production')) {
      out += item;
      count++;
    }
    idx = after;
  }
  h = out.split('style="--items-number:2"').join('style="--items-number:3"');
  write(file, h);
  console.log('dropdown patched', file, 'inserts', count);
}
patchCoursesDropdown('public/pages/academy.html');
patchCoursesDropdown('public/pages/learn-with-tsc.html');

console.log('wire ok');
