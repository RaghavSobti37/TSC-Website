const fs = require('fs');
const p = 'public/css/pages/yugm.css';
let c = fs.readFileSync(p, 'utf8');
if (!c.includes('/* collapse duplicate title wrappers */')) {
  const extra = `
  /* collapse duplicate title wrappers */
  #comp-mqhqa73a [id^="comp-mqhqa73w"],
  #comp-mqhqa73a [id^="comp-mqhqa73z"] {
    display: none !important;
  }
}
`;
  c = c.replace(/\}\s*$/, extra);
  fs.writeFileSync(p, c);
  console.log('collapsed dup titles');
} else console.log('skip');
