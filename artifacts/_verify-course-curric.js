const puppeteer=require("puppeteer");
const pages=[
  ["/the-heart-of-composition","mpqy3lne","mpnvvkdi","mppkbcdr"],
  ["/music-production","mpqy3lne","mpnvvkdi","mppkbcdr"],
  ["/roots-of-hindustani-classical","mrf1e0hg3","mrf1e0hk","mrf1e0j9"]
];
(async()=>{
  const b=await puppeteer.launch({headless:"shell",args:["--no-sandbox"]});
  const p=await b.newPage();
  for(const [path,parent,a,b2] of pages){
    await p.setViewport({width:390,height:844});
    await p.goto("http://127.0.0.1:3000"+path,{waitUntil:"networkidle2",timeout:90000});
    await new Promise(r=>setTimeout(r,4000));
    await p.evaluate((id)=>{const el=document.getElementById(id); if(el) el.scrollIntoView({block:"start"});}, parent);
    await new Promise(r=>setTimeout(r,800));
    const m=await p.evaluate((parent,a,b2)=>{
      const out={path:location.pathname, parentFlex:null};
      const pe=document.getElementById(parent);
      if(pe) out.parentFlex=getComputedStyle(pe).flexDirection;
      for(const id of [parent,a,b2]){
        const el=document.getElementById(id);
        if(!el){out[id]=null;continue;}
        const r=el.getBoundingClientRect();
        out[id]={w:+r.width.toFixed(1),left:+r.left.toFixed(1),top:+r.top.toFixed(1)};
      }
      out.items=[...document.querySelectorAll("#"+a+" .wixui-accordion__item, #"+b2+" .wixui-accordion__item")].slice(0,4).map(e=>{
        const r=e.getBoundingClientRect();
        const t=(e.querySelector(".wixui-accordion__title")||{}).textContent||"";
        return {t:t.trim().slice(0,36),w:+r.width.toFixed(1),left:+r.left.toFixed(1)};
      });
      return out;
    },parent,a,b2);
    console.log("MOBILE", JSON.stringify(m));
    await p.screenshot({path:"artifacts/rollback/mfix-"+path.slice(1)+"-390.png"});
  }
  await p.setViewport({width:1280,height:800});
  await p.goto("http://127.0.0.1:3000/the-heart-of-composition",{waitUntil:"networkidle2",timeout:90000});
  await new Promise(r=>setTimeout(r,4000));
  await p.evaluate(()=>document.getElementById("comp-mpqy3lne").scrollIntoView({block:"center"}));
  await new Promise(r=>setTimeout(r,1500));
  const desk=await p.evaluate(()=>{
    const el=document.getElementById("comp-mpqy3lne");
    const btn=[...document.querySelectorAll("#comp-mppkbcdr button")].find(b=>/07/.test(b.textContent||""));
    const item=btn.closest(".wixui-accordion__item");
    const box=item.querySelector(".AccordionContainer1266025101__animationBox");
    const content=item.querySelector(".AccordionContainer1266025101__accordionContent");
    const before={op:getComputedStyle(el).opacity, ready:el.classList.contains("tsc-reveal-ready"), expanded:btn.getAttribute("aria-expanded"), boxH:box.getBoundingClientRect().height, script:!!window.TSCCourseAccordion};
    btn.click();
    const after={expanded:btn.getAttribute("aria-expanded"), opened:item.classList.contains("AccordionContainer1266025101--isOpened"), boxH:box.getBoundingClientRect().height, hidden:content.classList.contains("AccordionContainer1266025101--isContentHidden")};
    return {before,after};
  });
  console.log("DESKTOP", JSON.stringify(desk,null,2));
  await p.screenshot({path:"artifacts/rollback/mfix-heart-accordion-1280.png"});
  // also music + roots accordion
  for(const [path, parent, , col2] of pages.slice(1)){
    await p.goto("http://127.0.0.1:3000"+path,{waitUntil:"networkidle2",timeout:90000});
    await new Promise(r=>setTimeout(r,3500));
    await p.evaluate((id)=>document.getElementById(id).scrollIntoView({block:"center"}), parent);
    await new Promise(r=>setTimeout(r,1200));
    const r=await p.evaluate((col2)=>{
      const btn=document.querySelector("#"+col2+" button");
      if(!btn) return {path:location.pathname, ok:false};
      const item=btn.closest(".wixui-accordion__item");
      btn.click();
      return {path:location.pathname, script:!!window.TSCCourseAccordion, opened:item.classList.contains("AccordionContainer1266025101--isOpened"), expanded:btn.getAttribute("aria-expanded"), boxH:item.querySelector(".AccordionContainer1266025101__animationBox").getBoundingClientRect().height};
    }, col2);
    console.log("ACC", JSON.stringify(r));
  }
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
