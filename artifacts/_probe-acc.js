const puppeteer=require("puppeteer");
(async()=>{
  const b=await puppeteer.launch({headless:"shell",args:["--no-sandbox"]});
  const p=await b.newPage();
  await p.setViewport({width:1280,height:800});
  await p.goto("http://127.0.0.1:3000/the-heart-of-composition",{waitUntil:"networkidle2",timeout:90000});
  await new Promise(r=>setTimeout(r,5000));
  await p.evaluate(()=>document.getElementById("comp-mpqy3lne").scrollIntoView({block:"center"}));
  await new Promise(r=>setTimeout(r,1500));
  const info=await p.evaluate(()=>{
    const item=document.querySelector("#comp-mppkbcdr .wixui-accordion__item");
    const btn=item.querySelector("button");
    const box=item.querySelector(".AccordionContainer1266025101__animationBox");
    const scripts=[...document.scripts].map(s=>s.src).filter(s=>/accordion|Accordion/i.test(s));
    btn.click();
    return {
      expanded: btn.getAttribute("aria-expanded"),
      opened: item.classList.contains("AccordionContainer1266025101--isOpened"),
      boxH: box ? box.getBoundingClientRect().height : null,
      scripts,
      firstItemOpened: document.querySelector("#comp-mpnvvkdi .AccordionContainer1266025101--isOpened") != null
    };
  });
  console.log(JSON.stringify(info,null,2));
  await new Promise(r=>setTimeout(r,500));
  const after=await p.evaluate(()=>{
    const item=document.querySelector("#comp-mppkbcdr .wixui-accordion__item");
    const btn=item.querySelector("button");
    const box=item.querySelector(".AccordionContainer1266025101__animationBox");
    return {
      expanded: btn.getAttribute("aria-expanded"),
      opened: item.classList.contains("AccordionContainer1266025101--isOpened"),
      boxH: box ? box.getBoundingClientRect().height : null,
      contentVis: box ? getComputedStyle(box).visibility : null,
      gridTemplateRows: box ? getComputedStyle(box).gridTemplateRows : null
    };
  });
  console.log("after wait", JSON.stringify(after,null,2));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
