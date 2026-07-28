const puppeteer=require("puppeteer");
(async()=>{
  const b=await puppeteer.launch({headless:"shell",args:["--no-sandbox"]});
  const p=await b.newPage();
  await p.setViewport({width:1280,height:800});
  await p.goto("http://127.0.0.1:3000/the-heart-of-composition",{waitUntil:"networkidle2",timeout:90000});
  await new Promise(r=>setTimeout(r,4000));
  await p.evaluate(()=>document.getElementById("comp-mpqy3lne").scrollIntoView({block:"center"}));
  await new Promise(r=>setTimeout(r,1500));
  const info=await p.evaluate(async()=>{
    const open0=document.querySelector("#comp-mpnvvkdi .AccordionContainer1266025101--isOpened");
    const btn=[...document.querySelectorAll("#comp-mppkbcdr button")].find(b=>/07/.test(b.textContent||""));
    const item=btn.closest(".wixui-accordion__item");
    function snap(item,label){
      const box=item.querySelector(".AccordionContainer1266025101__animationBox");
      const content=item.querySelector(".AccordionContainer1266025101__accordionContent");
      const kids=[...content.children].map(c=>({tag:c.tagName,cls:(c.className||"").toString().slice(0,60),h:c.getBoundingClientRect().height,display:getComputedStyle(c).display}));
      return {
        label,
        boxH:box.getBoundingClientRect().height,
        contentH:content.getBoundingClientRect().height,
        rows:getComputedStyle(box).gridTemplateRows,
        contentCls:content.className,
        overflow:getComputedStyle(content).overflow,
        kids,
        textLen:(content.innerText||"").length
      };
    }
    const beforeNative=snap(open0,"native-open");
    btn.click();
    await new Promise(r=>setTimeout(r,600));
    const after=snap(item,"poly-open");
    // try closing native and compare structure HTML snippet
    return {
      beforeNative,
      after,
      contentHTML: item.querySelector(".AccordionContainer1266025101__accordionContent").innerHTML.slice(0,300)
    };
  });
  console.log(JSON.stringify(info,null,2));
  await p.screenshot({path:"artifacts/rollback/mfix-acc-open-detail.png"});
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
