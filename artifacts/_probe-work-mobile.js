const fs = require('fs');

function probe(file) {
  const h = fs.readFileSync(file, 'utf8');
  const secs = [...h.matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  const comps = [...new Set([...h.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]))];
  console.log('===', file, '===');
  console.log('sections:', secs.slice(0, 25).join(', '));
  console.log('comps sample:', comps.slice(0, 25).join(', '));
  console.log('counts', { secs: secs.length, comps: comps.length });
}

probe('public/pages/work.html');
probe('public/pages/mba.html');
