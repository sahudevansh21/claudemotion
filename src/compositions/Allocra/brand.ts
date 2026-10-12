import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";
import "../../config/theme"; // Inter + JetBrains Mono
import timeline from "./timeline.json";
import vo from "./vo.json";

/**
 * Allocra brand tokens, sampled from the supplied website + product UI.
 * Display serif: Instrument Serif (matches the condensed editorial serif);
 * UI sans: DM Sans; labels: JetBrains Mono. All self-hosted.
 */
loadFont({
  family: "Instrument Serif",
  url: staticFile("allocra/fonts/InstrumentSerif-Regular-latin.woff2"),
  weight: "400",
});
loadFont({
  family: "Instrument Serif",
  url: staticFile("allocra/fonts/InstrumentSerif-Italic-latin.woff2"),
  weight: "400",
  style: "italic",
});
loadFont({
  family: "DM Sans",
  url: staticFile("allocra/fonts/DMSans-Variable-latin.woff2"),
  weight: "300 600",
});

export const AL = {
  red: "#C12E19", // website hero
  logoRed: "#F82601",
  ui: "#20130E", // app background
  uiSide: "#1B0F0F",
  uiPanel: "#261713",
  uiLine: "#3A2620",
  cream: "#F6DAC3",
  creamDim: "#C9AE9A",
  accent: "#CF3321", // slider handles, dots
  green: "#B8E07A", // "Draft"/"Preview mode" dot
  black: "#050404",
} as const;

export const AL_FONTS = {
  serif: "'Instrument Serif', Georgia, serif",
  sans: "'DM Sans', Inter, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;

export const AL_EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  slow: Easing.bezier(0.33, 0, 0.15, 1),
} as const;

export const TIMELINE = timeline;
export const VO = vo as Record<string, { text: string; seconds: number }>;

export const shot = (id: string) => {
  const s = timeline.shots.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown shot ${id}`);
  return { ...s, duration: s.end - s.start };
};

export const cue = (id: string, name: string): number => {
  const v = (shot(id).cues as Record<string, number>)[name];
  if (v === undefined) throw new Error(`Unknown cue ${id}.${name}`);
  return v;
};

export const ez = (
  f: number,
  start: number,
  dur: number,
  easing: (t: number) => number = AL_EASE.out,
) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/** Slow cinematic camera drift (deterministic). */
export const drift = (f: number, amp = 1, seed = 0) => {
  const t = f / 60 + seed * 7;
  const x = (Math.sin(t * 0.9) * 0.6 + Math.sin(t * 2.1 + 1) * 0.4) * 5 * amp;
  const y = (Math.sin(t * 1.3 + 2) * 0.6 + Math.sin(t * 2.7) * 0.4) * 3 * amp;
  const r = Math.sin(t * 0.7 + 3) * 0.12 * amp;
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};
