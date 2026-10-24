// Capture allocra.buzz (2x) for the AllocraLaunch film.
// Usage: node scripts/allocra/capture_site.mjs <outDir>
import { chromium } from "playwright";
const out = process.argv[2];
const pages = [["home", "/"], ["product", "/product"], ["dashboard", "/dashboard"], ["protocols", "/protocols"]];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
for (const [name, path] of pages) {
  const p = await ctx.newPage();
  await p.goto("https://allocra.buzz" + path, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.log("warn", name, e.message.slice(0, 50)));
  await p.waitForTimeout(3000);
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0, i = 0; y < Math.min(H, 6000); y += 900, i++) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/${name}-${String(i).padStart(2, "0")}.png` });
  }
  console.log("ok", name, H);
  await p.close();
  await new Promise((r) => setTimeout(r, 2000));
}
await browser.close();
