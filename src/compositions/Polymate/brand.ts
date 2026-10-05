import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";
// Loads Inter + JetBrains Mono (used for UI copy).
import "../../config/theme";

/**
 * Polymate brand tokens, sampled from the official logo (lapis gem, gold
 * laurel, marble tile, black italic wordmark on warm cream) and the X banner
 * (Roman red banners). Fonts are self-hosted in public/polymate/fonts.
 */
loadFont({
  family: "Poppins",
  url: staticFile("polymate/fonts/Poppins-ExtraBoldItalic-latin.woff2"),
  weight: "800",
  style: "italic",
});
loadFont({
  family: "Instrument Serif",
  url: staticFile("polymate/fonts/InstrumentSerif-Regular-latin.woff2"),
  weight: "400",
  style: "normal",
});
loadFont({
  family: "Instrument Serif",
  url: staticFile("polymate/fonts/InstrumentSerif-Italic-latin.woff2"),
  weight: "400",
  style: "italic",
});

export const PM = {
  cream: "#F4EFE6",
  marble: "#FBF9F5",
  marbleShade: "#E4DCCD",
  ink: "#141414",
  inkSoft: "#57524A",
  muted: "#A39C90",
  lapis: "#2445C4",
  lapisLight: "#3E63E0",
  lapisDeep: "#132A80",
  gold: "#B48A3C",
  goldLight: "#DDB868",
  red: "#8E1F1F",
} as const;

export const PM_FONTS = {
  /** Wordmark + headlines: heavy italic geometric sans. */
  display: "Poppins, Inter, sans-serif",
  /** Editorial serif for taglines (mirrors the reference's serif treatment). */
  serif: "'Instrument Serif', Georgia, serif",
  /** UI copy. Inter + JetBrains Mono are loaded by src/config/theme.ts. */
  ui: "Inter, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

/** Motion language of the reference: fast expo-out arrivals, sharp in-outs. */
export const PM_EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;
