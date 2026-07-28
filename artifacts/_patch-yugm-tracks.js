const fs = require('fs');
const p = 'public/css/pages/yugm.css';
let c = fs.readFileSync(p, 'utf8');
const extra = `
  /* duplicate cover layer */
  #comp-mqhqa73a [id^="comp-mqhqa747"] {
    display: none !important;
  }

  /* restore title strip under cover */
  #comp-mqhqa73a [id^="comp-mqjsblc5"] {
    display: block !important;
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 10px 8px 4px !important;
    background: transparent !important;
  }

  #comp-mqhqa73a [id^="comp-mqjsblc5"] [id^="comp-"] {
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    transform: none !important;
  }
}
`;
if (!c.includes('#comp-mqhqa73a [id^="comp-mqhqa747"] {\n    display: none')) {
  // remove previous hide of mqjsblc5
  c = c.replace(/#comp-mqhqa73a \[id\^="comp-mqhqa74n1"\],\s*#comp-mqhqa73a \[id\^="comp-mqjsblc5"\] \{\s*display: none !important;\s*\}/,
    `#comp-mqhqa73a [id^="comp-mqhqa74n1"] {\n    display: none !important;\n  }`);
  c = c.replace(/\}\s*$/, extra);
  fs.writeFileSync(p, c);
  console.log('patched tracks');
} else {
  console.log('skip');
}
