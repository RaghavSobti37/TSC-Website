const fs = require("fs");
const css = fs.readFileSync("public/css/pages/resources.css", "utf8");
const keys = [
  "comp-mparh5c7",
  "comp-mpbii8",
  "comp-mrdp2u69",
  "comp-mrd4o8h8",
  "comp-mrd4uy36",
  "comp-mp2vpkoa",
  "comp-mpgmnan2",
  "comp-mrdpsm83",
  "comp-mrdpmm1q",
  "TabsList",
  "multiStateBox",
  "Repeater"
];
for (const k of keys) {
  let idx = 0, n = 0;
  while ((idx = css.indexOf(k, idx)) !== -1 && n < 3) {
    console.log("\n===", k, "@", idx, "===");
    console.log(css.slice(Math.max(0, idx - 80), idx + 220).replace(/\s+/g, " ").slice(0, 300));
    idx += k.length;
    n++;
  }
}
