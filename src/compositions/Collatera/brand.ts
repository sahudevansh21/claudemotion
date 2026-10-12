import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";
// Loads Inter + JetBrains Mono (secondary UI / data copy).
import "../../config/theme";

/**
 * COLLATERA brand tokens — palette from the brief, matched to the supplied
 * logo, banner and website screenshot. Silkscreen (pixel) is the closest open
 * match to the site's display + nav type; self-hosted in public/collatera/fonts.
 */
loadFont({
  family: "Silkscreen",
  url: staticFile("collatera/fonts/Silkscreen-Regular.ttf"),
  weight: "400",
});
loadFont({
  family: "Silkscreen",
  url: staticFile("collatera/fonts/Silkscreen-Bold.ttf"),
  weight: "700",
});

export const CL = {
  forest: "#004B35",
  evergreen: "#003D2D",
  night: "#002A1F", // opening "nearly black" green
  panel: "#00543C",
  shadow: "#00261C", // offset pixel shadow
  lime: "#75FF00",
  chartreuse: "#A4FF2B",
  mint: "#D8FFE0",
  sage: "#86B99A",
  line: "#2E7A5A", // thin panel borders
} as const;

export const CL_FONTS = {
  pixel: "Silkscreen, 'JetBrains Mono', monospace",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Deliberate, polished motion. UI moves ≈ 9–18 frames (150–300 ms @ 60 fps). */
export const CL_EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.76, 0, 0.24, 1),
  camera: Easing.bezier(0.65, 0, 0.35, 1),
} as const;

/** Snap a value to whole pixels so pixel art stays crisp. */
export const snap = (v: number, step = 1): number =>
  Math.round(v / step) * step;
