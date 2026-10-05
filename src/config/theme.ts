import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are self-hosted in public/fonts so renders work offline and never
// depend on a CDN. loadFont() blocks rendering (delayRender) until the font is
// ready, so no frame is ever drawn with a fallback font. Both files are
// variable fonts, so every weight in the range is available.
// To add a font: drop a .woff2 into public/fonts and add a loadFont() call.
loadFont({
  family: "Inter",
  url: staticFile("fonts/Inter-Variable-latin.woff2"),
  weight: "100 900",
});
loadFont({
  family: "JetBrains Mono",
  url: staticFile("fonts/JetBrainsMono-Variable-latin.woff2"),
  weight: "100 800",
});

export const FONTS = {
  sans: "Inter, system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const COLORS = {
  background: "#0b0d17",
  backgroundAlt: "#151a33",
  text: "#f5f7ff",
  muted: "#9aa3c7",
  primary: "#7c5cff",
  secondary: "#22d3ee",
  accent: "#ff5c8a",
  warm: "#ffb547",
} as const;

/** Type scale in design-canvas pixels (1920x1080). */
export const TYPE = {
  display: 150,
  h1: 104,
  h2: 72,
  body: 44,
  caption: 32,
} as const;
