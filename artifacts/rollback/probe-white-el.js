const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const b = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disk-cache-size=0"],
  });
  const p = await b.newPage();
  await p.setCacheEnabled(false);

  // Mobile footer logos via element shot
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  for (const [name, url] of [
    ["home", "/"],
    ["academy", "/academy"],
  ]) {
    await p.goto("http://127.0.0.1:3000" + url + "?el=" + Date.now(), {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 4500));
    const handle = await p.$(".tsc-mobile-footer-logo");
    if (!handle) {
      console.log(name, "NO FOOTER LOGO");
      continue;
    }
    const info = await p.evaluate((el) => {
      el.scrollIntoView({ block: "center" });
      return {
        filter: getComputedStyle(el).filter,
        src: (el.currentSrc || el.src).split("/").pop(),
      };
    }, handle);
    console.log(name, "footer", JSON.stringify(info));
    await handle.screenshot({
      path: "artifacts/rollback/white2-el-foot-" + name + ".png",
    });
    const nav = await p.$(".tsc-mobile-brand-logo");
    if (nav) {
      const ninfo = await p.evaluate((el) => ({
        filter: getComputedStyle(el).filter,
        src: (el.currentSrc || el.src).split("/").pop(),
      }), nav);
      console.log(name, "nav", JSON.stringify(ninfo));
      await nav.screenshot({
        path: "artifacts/rollback/white2-el-nav-" + name + ".png",
      });
    }
  }

  // Desktop 1280 — academy + home header/footer
  await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  for (const [name, url] of [
    ["home", "/"],
    ["academy", "/academy"],
  ]) {
    await p.goto("http://127.0.0.1:3000" + url + "?d=" + Date.now(), {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await new Promise((r) => setTimeout(r, 5000));
    const info = await p.evaluate(() => {
      const imgs = [...document.querySelectorAll("header img, footer img, .tsc-desktop-footer-logo, [data-tsc-brand-logo] img")];
      return imgs.slice(0, 12).map((el) => ({
        cls: el.className,
        src: (el.currentSrc || el.src || "").split("/").pop().slice(0, 60),
        filter: getComputedStyle(el).filter.slice(0, 80),
        w: Math.round(el.getBoundingClientRect().width),
      }));
    });
    console.log("desk", name, JSON.stringify(info, null, 2));
    await p.screenshot({
      path: "artifacts/rollback/white2-desk-" + name + "-top.png",
      clip: { x: 0, y: 0, width: 1280, height: 120 },
    });
  }

  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
