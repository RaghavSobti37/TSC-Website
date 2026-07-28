const fs = require("fs");
const html = fs.readFileSync(
  "c:/Users/ragha/OneDrive/Desktop/website cloner/public/pages/about.html",
  "utf8"
);
const start = html.indexOf('id="comp-mr1ychhq"');
const end = html.indexOf("</section>", start);
const section = html.slice(start, end + 10);

// Top-level children of section container
const containerMatch = section.match(
  /comp-mr1ychhq-container[^>]*>([\s\S]*)/
);
const container = containerMatch ? containerMatch[1] : section;

// Direct top-level comps (rough): id= after <!--$-->
const topIds = [];
const re = /<!--\$--><(?:div|section) id="(comp-[^"]+)"/g;
let m;
while ((m = re.exec(section))) {
  // only count depth-ish by looking at preceding open/close - simpler: all IDs with text nearby
  topIds.push(m[1]);
}

const texts = [];
const tre = /id="(comp-[^"]+)"[^>]*>[\s\S]*?wixui-rich-text__text">([\s\S]*?)<\//g;
while ((m = tre.exec(section))) {
  const t = m[2]
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-zA-Z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t) texts.push({ id: m[1], text: t.slice(0, 140) });
}

const vectors = [];
const vre = /id="(comp-[^"]+)"[^>]*class="[^"]*wixui-vector-image/g;
while ((m = vre.exec(section))) vectors.push(m[1]);

console.log("=== TEXTS ===");
texts.forEach((t) => console.log(t.id, "→", t.text));
console.log("\n=== VECTORS ===");
console.log(vectors.join("\n"));
console.log("\n=== ANIM attrs ===");
const anim = section.match(/data-motion[^ ]*|hasAnimation|animation|rotate|transform/gi);
console.log([...new Set(anim || [])].slice(0, 40));

// Journey step boxes (have vertical-line OR keyword)
const steps = texts.filter((t) =>
  /^(human|artist|art|audience|community|culture|opportunity|sustainable career)$/i.test(
    t.text
  )
);
console.log("\n=== JOURNEY STEPS ===");
steps.forEach((s) => console.log(s.id, s.text));
