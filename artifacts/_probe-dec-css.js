const fs=require("fs");
const css=fs.readFileSync("public/css/pages/home.css","utf8");
for (const id of ["#comp-mrgcdx8y","#comp-mrgd8bb6"]) {
  const escaped=id.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const re=new RegExp(escaped+"[^{]*\\{[^}]*\\}","g");
  const m=css.match(re);
  console.log("====",id, m?m.length:0);
  if(m) console.log(m.slice(0,4).join("\n"));
}
