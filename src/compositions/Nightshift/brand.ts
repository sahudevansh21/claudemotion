import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";
// Loads Inter + JetBrains Mono (UI copy, tickers).
import "../../config/theme";

/**
 * NIGHTSHIFT brand tokens — matched to the supplied logo and website
 * screenshots (near-black canvas, glowing mint mark, wide geometric display
 * type, mono status lines). Unbounded stands in for the wide display face,
 * Michroma for the squared logo wordmark. Both OFL, self-hosted.
 */
loadFont({
  family: "Unbounded",
  url: staticFile("nightshift/fonts/unbounded-latin-500-normal.woff2"),
  weight: "500",
});
loadFont({
  family: "Unbounded",
  url: staticFile("nightshift/fonts/unbounded-latin-700-normal.woff2"),
  weight: "700",
});
loadFont({
  family: "Unbounded",
  url: staticFile("nightshift/fonts/unbounded-latin-800-normal.woff2"),
  weight: "800",
});
loadFont({
  family: "Michroma",
  url: staticFile("nightshift/fonts/michroma-latin-400-normal.woff2"),
  weight: "400",
});

export const NS = {
  bg: "#050807",
  canvas: "#0A0F0D",
  panel: "#111816",
  panelHi: "#18211E",
  line: "rgba(255,255,255,0.09)",
  grid: "rgba(185,245,216,0.06)",
  mint: "#B9F5D8",
  glow: "#6FF0C2",
  deep: "#0E3B2E",
  text: "#E9EFEC",
  dim: "#8C9893",
  faint: "#55615C",
  up: "#7EE2A8",
  down: "#FF7F76",
  amber: "#E8C27A",
  paper: "#EDEFEE",
  ink: "#0A0D0C",
} as const;

export const NS_FONTS = {
  display: "Unbounded, Inter, sans-serif",
  word: "Michroma, Inter, sans-serif",
  sans: "Inter, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const NS_EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.76, 0, 0.24, 1),
  snap: Easing.bezier(0.2, 1.4, 0.4, 1),
} as const;

/** Sample values exactly as shown on the supplied site screenshots. */
export const ETFS = [
  { sym: "SPY", price: 779.36, chg: "+0.10%", conf: 78 },
  { sym: "QQQ", price: 750.77, chg: "−0.07%", conf: 75 },
  { sym: "GLD", price: 383.15, chg: "−0.37%", conf: 72 },
  { sym: "IBIT", price: 47.14, chg: "+1.26%", conf: 59 },
] as const;

export const STOCKS = [
  { sym: "AAPL", name: "Apple", price: 336.56, chg: "−0.03%", close: 336.64, conf: 54 },
  { sym: "NVDA", name: "Nvidia", price: 229.05, chg: "−0.10%", close: 229.28, conf: 64 },
  { sym: "MSFT", name: "Microsoft", price: 534.64, chg: "−0.08%", close: 535.07, conf: 58 },
  { sym: "TSLA", name: "Tesla", price: 382.25, chg: "−0.12%", close: 382.7, conf: 62 },
] as const;

export const money = (v: number) =>
  `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
