const fs = require('fs');
const p = 'public/css/pages/yugm.css';
let c = fs.readFileSync(p, 'utf8');
if (!c.includes('#comp-mqhqa6wl3,')) {
  const snippet = `
  #comp-mqhqa6wl3,
  #comp-mqhqa6wl3 *,
  #comp-mqhqa6x51,
  #comp-mqhqa6x51 * {
    color: #ffecd1 !important;
  }
}
`;
  c = c.replace(/\}\s*$/, snippet);
  fs.writeFileSync(p, c);
  console.log('appended yugm text color');
} else {
  console.log('already present');
}
