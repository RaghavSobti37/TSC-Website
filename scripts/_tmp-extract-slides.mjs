import fs from "fs";
const h = fs.readFileSync("public/pages/films.html", "utf8");
for (const id of ["mqmkrjnm", "mqmkth8f", "mqmfx7ou2", "mqmfx7q11", "mqml20ge", "mqktywoc"]) {
  const idx = h.indexOf(`#comp-${id}`);
  console.log("\n===", id, "idx", idx, "===");
  if (idx < 0) continue;
  console.log(h.slice(idx, idx + 500));
}
// also lIkFMb
const i2 = h.indexOf(".lIkFMb");
console.log("\n=== lIkFMb ===\n", h.slice(i2, i2 + 300));
