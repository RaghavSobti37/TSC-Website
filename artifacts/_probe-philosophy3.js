const fs = require("fs");
const html = fs.readFileSync(
  "c:/Users/ragha/OneDrive/Desktop/website cloner/public/pages/about.html",
  "utf8"
);
const start = html.indexOf('<section id="comp-mr1ychhq"');
const end = html.indexOf("</section>", start);
const section = html.slice(start, end + 10);

// For each journey step, dump structure briefly
const steps = [
  "comp-mr22200q",
  "comp-mr224lmj",
  "comp-mr224td1",
  "comp-mr224yhj",
  "comp-mr225543",
  "comp-mr225awb",
  "comp-mr225fky",
  "comp-mr225jy2",
];
for (const id of steps) {
  const i = section.indexOf('id="' + id + '"');
  // crude: next 1200 chars
  const chunk = section.slice(i, i + 1500);
  const ids = [...chunk.matchAll(/id="(comp-[^"]+)"/g)].map((m) => m[1]);
  const texts = [...chunk.matchAll(/wixui-rich-text__text">([^<]+)/g)].map(
    (m) => m[1]
  );
  console.log("\n" + id, texts[0] || "");
  console.log("  ids:", ids.slice(0, 8).join(", "));
}
