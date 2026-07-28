const fs=require("fs");
const html=fs.readFileSync("public/pages/home.html","utf8");
for (const id of ["comp-mrgcdx8y","comp-mrgd8bb6","comp-mrg8ludo"]) {
  const i=html.indexOf(`id="${id}"`);
  console.log("\n====",id,"====");
  console.log(html.slice(Math.max(0,i-80), i+500).replace(/\s+/g," ").slice(0,450));
}
