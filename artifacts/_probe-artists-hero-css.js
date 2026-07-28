const fs = require('fs');
const css = fs.readFileSync('public/css/pages/artists.css', 'utf8');
const ids = [
  'comp-mq6d6age',
  'bgLayers_comp-mq6d6age',
  'bgMedia_comp-mq6d6age',
  'comp-mquw2yp8',
  'comp-mqtlidtz',
  'comp-mqtljrd2',
  'comp-mqtlkwo0',
  'comp-mquw4grq',
  'comp-mquvv9nj',
  'comp-mquvy98g'
];
for (const id of ids) {
  const re = new RegExp('#' + id + '(?:\\\\b|\\{|\\.|\\s|,|:)', 'g');
  let idx = 0;
  let count = 0;
  while ((idx = css.indexOf('#' + id, idx)) !== -1 && count < 6) {
    // find rule end - rough: next } that balances
    let end = idx;
    let depth = 0;
    let started = false;
    for (let i = idx; i < Math.min(css.length, idx + 2500); i++) {
      if (css[i] === '{') { depth++; started = true; }
      if (css[i] === '}') {
        depth--;
        if (started && depth === 0) { end = i + 1; break; }
      }
    }
    console.log('\n---', id, 'at', idx, '---');
    console.log(css.slice(idx, end));
    idx = end;
    count++;
  }
  if (count === 0) console.log('\nNONE', id);
}

// section height / media queries for mq6d6age
const mediaHits = [...css.matchAll(/@media[^{]+\{[^}]*mq6d6age[^}]*\}/g)];
console.log('\nmedia hits', mediaHits.length);
