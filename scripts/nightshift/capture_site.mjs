// Capture nightshift.buzz pages (2x) for the NightshiftLaunch film.
// Usage: node scripts/nightshift/capture_site.mjs <outDir>
import { chromium } from "playwright";
const out = process.argv[2];
const pages = [
  ["home", "/", [0, 900, 1800]],
  ["app", "/app", [0, 700, 1400]],
  ["oracle", "/oracle", [0, 650]],
  ["proof", "/proof", [0, 650]],
  ["transparency", "/transparency", [0, 900, 1700]],
  ["leaderboard", "/leaderboard", [0]],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, ignoreHTTPSErrors: true });
for (const [name, path, scrolls] of pages) {
  const p = await ctx.newPage();
  try {
    await p.goto("https://nightshift.buzz" + path, { waitUntil: "networkidle", timeout: 45000 });
  } catch (e) {
    console.log("warn", name, e.message.slice(0, 60));
  }
  await p.waitForTimeout(2500);
  for (const label of ["Skip", "Close"]) {
    const b = p.getByRole("button", { name: label });
    if (await b.count()) {
      await b.first().click().catch(() => {});
      await p.waitForTimeout(600);
    }
  }
  await p.keyboard.press("Escape").catch(() => {});
  await p.waitForTimeout(1500);
  for (const y of scrolls) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}/${name}-${y}.png` });
  }
  console.log("ok", name);
  await p.close();
}
await browser.close();
