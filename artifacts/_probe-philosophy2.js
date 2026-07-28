const fs = require("fs");
const html = fs.readFileSync(
  "c:/Users/ragha/OneDrive/Desktop/website cloner/public/pages/about.html",
  "utf8"
);
const start = html.indexOf('<section id="comp-mr1ychhq"');
const end = html.indexOf("</section>", start);
const section = html.slice(start, end + 10);

// Get direct children of .comp-mr1ychhq-container
const cStart = section.indexOf('class="comp-mr1ychhq-container');
const after = section.indexOf(">", cStart);
let i = after + 1;
const children = [];
while (i < section.length) {
  const m = section.slice(i).match(/^[\s\S]*?(?:<!--\$-->)?<(div|section) id="(comp-[^"]+)"/);
  if (!m || m.index > 200) break;
  const tag = m[1];
  const id = m[2];
  i += m.index + m[0].length;
  // find matching close at depth 1 from this open - simplify: find next sibling marker
  children.push(id);
  // advance to after this element's outer close by counting depth
  let depth = 1;
  while (depth > 0 && i < section.length) {
    const nextOpen = section.indexOf("<" + tag, i);
    const nextClose = section.indexOf("</" + tag + ">", i);
    if (nextClose < 0) break;
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++;
      i = nextOpen + 1;
    } else {
      depth--;
      i = nextClose + ("</" + tag + ">").length;
    }
  }
  // extract text briefly
  const block = section.slice(section.indexOf('id="' + id + '"'), i);
  const t = (block.match(/wixui-rich-text__text">([^<]+)/) || [])[1] || "";
  const isVec = /wixui-vector-image/.test(block);
  const isLine = /wixui-vertical-line/.test(block);
  console.log(
    id,
    isVec ? "[VECTOR]" : isLine ? "[HAS LINE]" : "",
    t.replace(/&[a-z]+;/g, " ").slice(0, 80)
  );
}
