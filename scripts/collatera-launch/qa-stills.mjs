// Render QA stills from one bundle: node scripts/collatera-launch/qa-stills.mjs <outDir> <sec,sec,...> [scale]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [outDir, secs, scale = "0.5"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
const browserExecutable = process.env.REMOTION_BROWSER;
const composition = await selectComposition({ serveUrl, id: "CollateraLaunch", browserExecutable });
for (const s of secs.split(",").map(Number)) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  await renderStill({ serveUrl, composition, frame, output: `${outDir}/s${String(s.toFixed(2)).padStart(5, "0")}.jpg`, browserExecutable, imageFormat: "jpeg", jpegQuality: 85, scale: Number(scale) });
  console.log("frame", frame);
}
