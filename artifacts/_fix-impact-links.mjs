import fs from 'fs';
const p = 'public/pages/mahavatar-narsimha-impact.html';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\s*<link rel="stylesheet" href="\/css\/tsc-mobile-system\.css">\r?\n/g, '\n');
c = c.replace(/\s*<link rel="stylesheet" href="\/css\/mobile\/_safe-base\.css">\r?\n/g, '\n');
fs.writeFileSync(p, c);
console.log('mobile-system left:', /tsc-mobile-system\.css/.test(c) && !/data-tsc-mobile-boot/.test(c));
console.log('safe-base hard link:', /_safe-base\.css"/.test(c));
