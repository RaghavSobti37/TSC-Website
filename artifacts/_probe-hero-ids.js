const fs=require("fs");
const html=fs.readFileSync("public/pages/home.html","utf8");
// Extract hero section roughly between comp-mrg6phqn and next section
const start=html.indexOf('id="comp-mrg6phqn"');
const end=html.indexOf('id="comp-m28o2bbb"');
const hero=html.slice(start, end>start?end:start+8000);
const ids=[...hero.matchAll(/id="(comp-[^"]+)"/g)].map(m=>m[1]);
console.log("hero ids:", [...new Set(ids)].join("\n"));
const imgs=[...hero.matchAll(/id="(comp-mrg[^"]+)".{0,200}/g)].slice(0,20);
