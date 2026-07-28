const fs = require('fs');
const h = fs.readFileSync('public/pages/resources.html', 'utf8');

// Find Free Tools section parent mesh
const freeIdx = h.indexOf('Free Tools');
console.log('Free Tools at', freeIdx);
console.log(h.slice(freeIdx - 800, freeIdx + 400).replace(/\s+/g, ' ').slice(0, 900));

// Tab strip structure
const tabIdx = h.indexOf('Digital Audio Workstations');
console.log('\nTAB at', tabIdx);
console.log(h.slice(Math.max(0, tabIdx - 600), tabIdx + 200).replace(/\s+/g, ' ').slice(0, 700));

// Blog featured cards parent
const blogCards = [...h.matchAll(/id="(comp-mrdq8[^"]+|comp-mrdp[^"]+)"[^>]*wixui-box/g)].map((m) => m[1]);
console.log('\nBlog boxes', [...new Set(blogCards)].slice(0, 25));

// Find container for mrdq81q0
const card0 = h.indexOf('id="comp-mrdq81q0"');
console.log('\ncard0 parents', h.slice(card0 - 500, card0).replace(/\s+/g, ' ').slice(-400));
