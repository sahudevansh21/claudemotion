// Capture aegisnet.solrun.fun (2x) for the AegisLaunch film.
// Usage: node scripts/aegis/capture_site.mjs <outDir>
import { chromium } from "playwright";
const out = process.argv[2];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
const p = await ctx.newPage();
await p.goto("https://aegisnet.solrun.fun/", { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.log("warn", e.message.slice(0, 60)));
await p.waitForTimeout(3000);
const H = await p.evaluate(() => document.body.scrollHeight);
console.log("height", H);
for (let y = 0, i = 0; y < H; y += 900, i++) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${out}/home-${String(i).padStart(2, "0")}.png` });
}
const dash = p.getByRole("link", { name: "Dashboard" }).or(p.getByRole("button", { name: "Dashboard" }));
if (await dash.count()) {
  await dash.first().click().catch(() => {});
  await p.waitForTimeout(3500);
  for (const [i, y] of [0, 800, 1600].entries()) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/dash-${i}.png` });
  }
  console.log("dash", p.url());
}
await browser.close();
