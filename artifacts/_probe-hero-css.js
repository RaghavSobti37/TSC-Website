const fs=require("fs");
const css=fs.readFileSync("public/css/pages/home.css","utf8");
const ids=["#comp-mrxkm2y2","#comp-mrg8ludo","#comp-mrg6phqn","#comp-mrxl8fxe","#comp-mrjlvhv6"];
for (const id of ids){
  const escaped=id.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  const re=new RegExp(escaped+"[^{]*\\{[^}]*\\}","g");
  const m=css.match(re);
  console.log("====",id,"matches",m?m.length:0);
  if(m) console.log(m.slice(0,5).join("\n"));
}
