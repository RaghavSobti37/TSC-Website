const puppeteer=require("puppeteer");
const pages=[
  ["/the-heart-of-composition","comp-mpqy3lne","comp-mpnvvkdi","comp-mppkbcdr"],
  ["/music-production","comp-mpqy3lne","comp-mpnvvkdi","comp-mppkbcdr"],
  ["/roots-of-hindustani-classical","comp-mrf1e0hg3","comp-mrf1e0hk","comp-mrf1e0j9"]
];
(async()=>{
  const b=await puppeteer.launch({headless:"shell",args:["--no-sandbox"]});
  const p=await b.newPage();
  for(const [path,parent,a,b2] of pages){
    await p.setViewport({width:390,height:844});
    await p.goto("http://127.0.0.1:3000"+path,{waitUntil:"networkidle2",timeout:90000});
    await new Promise(r=>setTimeout(r,4500));
    await p.evaluate((id)=>{const el=document.getElementById(id); if(el) el.scrollIntoView({block:"start"});}, parent);
    await new Promise(r=>setTimeout(r,800));
    const m=await p.evaluate((parent,a,b2)=>{
      const pe=document.getElementById(parent);
      const out={path:location.pathname, parentFlex:pe?getComputedStyle(pe).flexDirection:null};
      for(const id of [parent,a,b2]){
        const el=document.getElementById(id);
        if(!el){out[id]=null;continue;}
        const r=el.getBoundingClientRect();
        out[id]={w:+r.width.toFixed(1),left:+r.left.toFixed(1),top:+r.top.toFixed(1)};
      }
      out.stacked = out[a] && out[b2] && Math.abs(out[a].left - out[b2].left) < 5 && out[b2].top > out[a].top + 20;
      out.fullWidth = out.items = [...document.querySelectorAll("#"+a+" .wixui-accordion__item, #"+b2+" .wixui-accordion__item")].slice(0,3).map(e=>{
        const r=e.getBoundingClientRect();
        const t=(e.querySelector(".wixui-accordion__title")||{}).textContent||"";
        return {t:t.trim().slice(0,40),w:+r.width.toFixed(1),left:+r.left.toFixed(1)};
      });
      out.minItemW = Math.min(...out.items.map(i=>i.w));
      return out;
    },parent,a,b2);
    console.log("MOBILE", path, "flex="+m.parentFlex, "stacked="+m.stacked, "minW="+m.minItemW, "cols", m[a]&&m[a].w, m[b2]&&m[b2].w, "tops", m[a]&&m[a].top, m[b2]&&m[b2].top);
    console.log("  items", JSON.stringify(m.items));
    await p.screenshot({path:"artifacts/rollback/mfix2-"+path.replace(/\//g,"").slice(0,24)+"-390.png"});
  }
  await p.setViewport({width:1280,height:800});
  for(const [path,parent,,col2] of pages){
    await p.goto("http://127.0.0.1:3000"+path,{waitUntil:"networkidle2",timeout:90000});
    await new Promise(r=>setTimeout(r,4000));
    await p.evaluate((id)=>{const el=document.getElementById(id); if(el) el.scrollIntoView({block:"center"});}, parent);
    await new Promise(r=>setTimeout(r,1500));
    const r=await p.evaluate((parent,col2)=>{
      const wrap=document.getElementById(parent);
      const btn=document.querySelector("#"+col2+" button");
      if(!btn) return {path:location.pathname, ok:false};
      const item=btn.closest(".wixui-accordion__item");
      const box=item.querySelector(".AccordionContainer1266025101__animationBox");
      btn.click();
      return new Promise(resolve=>{
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          resolve({
            path:location.pathname,
            script:!!window.TSCCourseAccordion,
            op: wrap?getComputedStyle(wrap).opacity:null,
            opened:item.classList.contains("AccordionContainer1266025101--isOpened"),
            expanded:btn.getAttribute("aria-expanded"),
            boxH:+box.getBoundingClientRect().height.toFixed(1),
            text:(item.innerText||"").slice(0,60).replace(/\s+/g," ")
          });
        }));
      });
    }, parent, col2);
    console.log("DESK", JSON.stringify(r));
    await p.screenshot({path:"artifacts/rollback/mfix2-"+path.replace(/\//g,"").slice(0,24)+"-acc.png"});
  }
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
