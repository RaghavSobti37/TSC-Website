const fs = require('fs');

function probe(page) {
  const h = fs.readFileSync('public/pages/' + page + '.html', 'utf8');
  // Find main sections with ids
  const mainMatch = h.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  if (!mainMatch) { console.log(page, 'no main'); return; }
  const main = mainMatch[1];
  // section ids + classes
  const secs = [...main.matchAll(/<section id="([^"]+)"[^>]*class="([^"]*)"/g)];
  console.log('\n===', page, 'sections ===');
  secs.forEach((m, i) => console.log(i, m[1], m[2].slice(0, 80)));

  // Find absolute/fixed style hints in style tags related to comps
  const styleBlocks = [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  const joined = styleBlocks.join('\n');
  // Count width/left/top absolute for page comps
  const abs = (joined.match(/position:\s*absolute/g) || []).length;
  const fixedW = (joined.match(/width:\s*\d+px/g) || []).length;
  console.log('inline styles abs', abs, 'fixed widths', fixedW);

  // First hero section HTML length and key children
  if (secs[0]) {
    const id = secs[0][1];
    const re = new RegExp(`id="${id}"[\\s\\S]{0,2500}`);
    const snip = (main.match(re) || [''])[0];
    const childIds = [...snip.matchAll(/id="(comp-[a-z0-9]+)"/g)].map(x => x[1]);
    console.log('hero children', childIds.slice(0, 15).join(','));
  }
}

['films','mahavatar-narsimha','kalki','mahaprbhu','hanuman-ansh'].forEach(probe);

// Check if thunderbolt CSS exists for films
const cssDir = 'public/assets/mirror/siteassets.parastorage.com/pages/pages/thunderbolt';
if (fs.existsSync(cssDir)) {
  const files = fs.readdirSync(cssDir).filter(f => f.includes('css--') && f.includes('desktop'));
  console.log('\nthunderbolt css bundles', files.length);
}
