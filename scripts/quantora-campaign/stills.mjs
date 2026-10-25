// Export Quantora stills (1080x1920 PNG → JPG) to out/quantora/stills
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
const names = ["QP1-launch-poster", "QP2-slide-1-of-5", "QP2-slide-2-of-5", "QP2-slide-3-of-5", "QP2-slide-4-of-5", "QP2-slide-5-of-5", "QP3-tokenized-stocks-vs-etfs", "QP4-what-a-simulation-is", "QA1-cover", "QA2-cover", "QA3-cover"];
const out = path.resolve("out/quantora/stills");
mkdirSync(out, { recursive: true });
const browserExecutable = process.env.REMOTION_BROWSER;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
const composition = await selectComposition({ serveUrl, id: "QuantoraPostsV", browserExecutable });
for (let f = 0; f < names.length; f++) {
  await renderStill({ serveUrl, composition, frame: f, output: `${out}/${names[f]}.png`, imageFormat: "png", browserExecutable });
  console.log(names[f]);
}
