// Export campaign stills (P2 slides, P3, P5, P8, P6, A1–A5 headers) as PNG → out/campaign/stills
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
const out = path.resolve("out/campaign/stills");
mkdirSync(out, { recursive: true });
const browserExecutable = process.env.REMOTION_BROWSER;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), rspack: true });
const jobs = {
  CampaignPosts45: ["p2-1", "p2-2", "p2-3", "p2-4", "p2-5", "p3"],
  CampaignPostsSquare: ["p5", "p8"],
  CampaignPostsWide: ["p6", "a1", "a2", "a3", "a4", "a5"],
};
for (const [id, names] of Object.entries(jobs)) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  for (let f = 0; f < names.length; f++) {
    await renderStill({ serveUrl, composition, frame: f, output: `${out}/${names[f]}.png`, imageFormat: "png", browserExecutable });
    console.log(names[f]);
  }
}
