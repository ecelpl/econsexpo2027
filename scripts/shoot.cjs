// Screenshots a built page at several widths while scrolling. Usage:
// node scripts/shoot.mjs <url> <outDir> [widths=1440,390] [steps=14]
const { chromium } = require("playwright");
const { mkdirSync } = require("node:fs");
(async () => {
const [url, out, widths = "1440,390", stepsArg = "14", reduce = ""] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await chromium.launch();
for (const w of widths.split(",").map(Number)) {
  const mobile = w < 700;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: reduce ? "reduce" : "no-preference", isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const errs = [];
  p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  p.on("pageerror", (e) => errs.push(String(e)));
  p.on("requestfailed", (r) => errs.push("FAILED " + r.url()));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(3200);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const vh = mobile ? 844 : 900;
  const steps = Math.min(Number(stepsArg), Math.ceil(H / (vh * 0.8)));
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((H - vh) * (i / steps));
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(1400);
    await p.screenshot({ path: `${out}/${w}-${String(i).padStart(2, "0")}.jpg`, type: "jpeg", quality: 70 });
  }
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(w, "height", H, "overflowX", overflow, "errors", errs.slice(0, 8));
  await ctx.close();
}
await b.close();
})();
