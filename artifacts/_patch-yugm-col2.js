const fs = require('fs');
const p = 'public/css/pages/yugm.css';
let c = fs.readFileSync(p, 'utf8');
if (!c.includes('/* second track column */')) {
  const extra = `
  /* second track column */
  #comp-mqi6gg5f,
  #comp-mqi6gg5f > [data-testid="responsive-container-content"],
  #comp-mqi6gg5f [class*="-container"] {
    display: flex !important;
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    margin: 0 !important;
    left: auto !important;
    transform: none !important;
    grid-template-columns: none !important;
    grid-template-rows: none !important;
  }

  #comp-mqi6gg5f [id*="__item"] {
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    margin: 0 0 16px !important;
    position: relative !important;
    inset: auto !important;
    left: auto !important;
    transform: none !important;
  }

  #comp-mqi6gg5f [id*="__item"] [id^="comp-"] {
    position: relative !important;
    inset: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    margin: 0 !important;
    transform: none !important;
  }

  #comp-mqi6gg5f [id^="comp-mqi6gg5o2"] {
    aspect-ratio: 1 / 1 !important;
    overflow: hidden !important;
    border-radius: 10px !important;
  }

  #comp-mqi6gg5f [id^="comp-mqi6gg5o2"] img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }

  #comp-mqi6gg5f [id^="comp-mqi6gg5z5"],
  #comp-mqi6gg5f [id^="comp-mqi6gg5q2"] {
    display: none !important;
  }

  #comp-mqi6gg5f [data-testid="richTextElement"] .wixui-rich-text__text {
    font-size: 14px !important;
    line-height: 1.35 !important;
    color: #083d3a !important;
    text-align: center !important;
  }
}
`;
  c = c.replace(/\}\s*$/, extra);
  fs.writeFileSync(p, c);
  console.log('second col flattened');
} else console.log('skip');
