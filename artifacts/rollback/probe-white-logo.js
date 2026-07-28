const puppeteer = require("puppeteer");

(async () => {
  const b = await puppeteer.launch({
    headless: "shell",
    args: ["--no-sandbox", "--disk-cache-size=0"],
  });
  const p = await b.newPage();
  await p.setCacheEnabled(false);
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  for (const [name, url] of [
    ["home", "/"],
    ["academy", "/academy"],
  ]) {
    await p.goto("http://127.0.0.1:3000" + url + "?w4=" + Date.now(), {
      waitUntil: "domcontentloaded",
    });
    await new Promise((r) => setTimeout(r, 4500));
    const box = await p.evaluate(() => {
      const img = document.querySelector(
        ".tsc-mobile-footer-logo, .tsc-desktop-footer-logo"
      );
      if (!img) return null;
      const r = img.getBoundingClientRect();
      return {
        y: r.top + window.scrollY,
        h: r.height,
        src: img.currentSrc || img.src,
        filter: getComputedStyle(img).filter,
      };
    });
    console.log(name, JSON.stringify(box));
    if (box) {
      await p.evaluate((y) => window.scrollTo(0, Math.max(0, y - 40)), box.y);
      await new Promise((r) => setTimeout(r, 300));
      await p.screenshot({
        path: "artifacts/rollback/white2-logo-" + name + ".png",
        clip: { x: 0, y: 0, width: 390, height: 160 },
      });
    }
  }

  await p.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await p.goto("http://127.0.0.1:3000/academy?w4d=" + Date.now(), {
    waitUntil: "domcontentloaded",
  });
  await new Promise((r) => setTimeout(r, 4500));
  const d = await p.evaluate(() => {
    const img = document.querySelector(
      'header .tsc-desktop-brand-logo-unified, header img[src*="academy"]'
    );
    if (!img) return { found: false };
    return {
      src: img.currentSrc || img.src,
      filter: getComputedStyle(img).filter,
      mix: getComputedStyle(img).mixBlendMode,
    };
  });
  console.log("desk academy", JSON.stringify(d));
  await p.screenshot({
    path: "artifacts/rollback/white2-desk-acad-nav.png",
    clip: { x: 0, y: 0, width: 1280, height: 100 },
  });
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
