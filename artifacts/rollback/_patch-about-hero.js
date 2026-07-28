const fs = require('fs');
const p = 'public/css/mobile/about.css';
let s = fs.readFileSync(p, 'utf8');
const i = s.search(/\r?\n\/\*\r?\n \* About hero mobile/);
if (i < 0) {
  console.error('marker missing');
  process.exit(1);
}
const head = s.slice(0, i).replace(/\s+$/, '') + '\n';
const hero = `
/*
 * About hero mobile — vertical desktop composition.
 * Stack: tiny shell → THE SHAKTI COLLECTIVE → tagline.
 * Specificity must beat tsc-responsive (loads after mobile/about.css).
 */
@media (max-width: 900px) {
  html body.responsive[data-page="about"] #comp-mp2vlkbh2,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 .comp-mp2vlkbh2-overflow-wrapper {
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 .comp-mp2vlkbh2-container,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 [data-testid="responsive-container-content"] {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    padding: 36px 24px 44px !important;
    box-sizing: border-box !important;
    gap: 10px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1vbgc2.comp-mr1vbgc2,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tvuqc.comp-mr1tvuqc,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    margin: 0 auto !important;
    align-self: center !important;
    justify-self: center !important;
    z-index: 2 !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk {
    order: 1 !important;
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
    min-height: 56px !important;
    max-width: 56px !important;
    max-height: 56px !important;
    flex: 0 0 56px !important;
    margin: 0 auto 4px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk svg {
    width: 56px !important;
    height: 56px !important;
    max-width: 56px !important;
    max-height: 56px !important;
    display: block !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1vbgc2.comp-mr1vbgc2 {
    order: 2 !important;
    display: block !important;
    width: min(72vw, 280px) !important;
    max-width: min(72vw, 280px) !important;
    height: auto !important;
    overflow: visible !important;
    grid-template-columns: none !important;
    grid-template-rows: none !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tvuqc.comp-mr1tvuqc,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tvuqc.comp-mr1tvuqc svg {
    aspect-ratio: 867.52 / 415.6 !important;
    display: block !important;
    width: 100% !important;
    height: auto !important;
    max-width: 100% !important;
    position: relative !important;
    grid-area: auto !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l {
    order: 3 !important;
    width: min(86vw, 340px) !important;
    max-width: min(86vw, 340px) !important;
    height: auto !important;
    margin-top: 4px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l .wixui-rich-text__text,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l h1,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l p {
    font-size: clamp(16px, 4.4vw, 20px) !important;
    line-height: 1.2 !important;
    text-align: center !important;
    white-space: normal !important;
    max-width: 100% !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 :is(#comp-mr1ttkgk, #comp-mr1vbgc2, #comp-mr1tvuqc, #comp-mr1tvuqc *, #comp-mr1tv44l, #comp-mr1tv44l *) {
    animation: none !important;
    filter: none !important;
    opacity: 1 !important;
    transition: none !important;
  }
}

@media (max-width: 600px) {
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 .comp-mp2vlkbh2-container,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 [data-testid="responsive-container-content"] {
    padding: 28px 20px 36px !important;
    gap: 8px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1vbgc2.comp-mr1vbgc2 {
    width: min(78vw, 260px) !important;
    max-width: min(78vw, 260px) !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
    max-width: 48px !important;
    max-height: 48px !important;
    flex: 0 0 48px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk svg {
    width: 48px !important;
    height: 48px !important;
    max-width: 48px !important;
    max-height: 48px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l .wixui-rich-text__text,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l h1,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l p {
    font-size: clamp(15px, 4.2vw, 18px) !important;
  }
}

@media (min-width: 601px) and (max-width: 900px) {
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 .comp-mp2vlkbh2-container,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 [data-testid="responsive-container-content"] {
    padding: 48px 40px 56px !important;
    gap: 14px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1vbgc2.comp-mr1vbgc2 {
    width: min(48vw, 340px) !important;
    max-width: min(48vw, 340px) !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk {
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
    min-height: 56px !important;
    max-width: 56px !important;
    max-height: 56px !important;
    flex: 0 0 56px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1ttkgk.comp-mr1ttkgk svg {
    width: 56px !important;
    height: 56px !important;
    max-width: 56px !important;
    max-height: 56px !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l {
    width: min(70vw, 480px) !important;
    max-width: min(70vw, 480px) !important;
  }

  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l .wixui-rich-text__text,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l h1,
  html body.responsive[data-page="about"] #comp-mp2vlkbh2 #comp-mr1tv44l.comp-mr1tv44l p {
    font-size: clamp(18px, 2.8vw, 24px) !important;
  }
}
`;
fs.writeFileSync(p, head + hero);
console.log('ok', head.length, hero.length);
