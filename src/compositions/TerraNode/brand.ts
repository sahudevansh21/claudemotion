import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";
// Loads Inter + JetBrains Mono (used for UI copy).
import "../../config/theme";

/**
 * TerraNode brand tokens.
 * - Logo (supplied): black rounded wordmark ".TerraNode" with two violet dots
 *   (sampled #701CD0).
 * - X banner (supplied): forest-green wordmark (#18422D), leaf accent, tagline
 *   "Offline Edge-AI for Smarter Farms", golden-hour farmland photography.
 * Wordmark font: Quicksand Bold (closest open match to the rounded logotype),
 * self-hosted in public/terranode/fonts.
 */
loadFont({
  family: "Quicksand",
  url: staticFile("terranode/fonts/Quicksand-Bold.ttf"),
  weight: "700",
});
loadFont({
  family: "Quicksand",
  url: staticFile("terranode/fonts/Quicksand-SemiBold.ttf"),
  weight: "600",
});

export const TN = {
  violet: "#701CD0",
  violetLight: "#9B5CF0",
  forest: "#18422D",
  leaf: "#4E9A3A",
  leafLight: "#8CC66B",
  ink: "#111111",
  white: "#FFFFFF",
  paper: "#F6FAF5",
  uiLine: "#E3EBE2",
  uiMuted: "#6E7A70",
  // golden-hour grade
  sun: "#FFE3A3",
  gold: "#F4B860",
  amber: "#E8893A",
  // end-card sky (reference: soft blue gradient)
  skyTop: "#5F86AC",
  skyBottom: "#AFC2CD",
} as const;

export const TN_FONTS = {
  brand: "Quicksand, Inter, sans-serif",
  ui: "Inter, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Reference motion: slow, organic camera moves; gentle ease-outs. */
export const TN_EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.45, 0, 0.55, 1),
} as const;
