import { interpolate } from "remotion";
import { PM_EASE } from "../brand";
import tl from "./golden.json";

/** Absolute cue frames (60 fps) — shared with the audio script. */
export const C = tl.cues;

export const INK = "#211912";
export const PAPER = "#ECE5D6";
export const CREAM = "#F5EEDF";
export const GOLD = "#D7AA55";
export const GOLD_HI = "#FFF0C8";
export const SAPPHIRE = "#1A3FB0";
export const SAPPHIRE_DEEP = "#0A1A5C";
export const BURGUNDY = "#7A1F2B";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const iv = (f: number, inp: number[], out: number[], easing: (t: number) => number = PM_EASE.inOut) =>
  interpolate(f, inp, out, { ...CLAMP, easing });
export const lin = (f: number, inp: number[], out: number[]) => interpolate(f, inp, out, CLAMP);
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

/** World anchors (design px, camera at rest). */
export const RING = { x: 960, y: 540, r: 150 };
export const ALTAR_TOP = 690;
export const EMBLEM = { x: 960, y: 588, w: 236 };
/** Emblem aspect (supplied PNG is 1476x1232). */
export const EMBLEM_AR = 1232 / 1476;

/**
 * One continuous camera: a slow push through the first act, a dolly toward
 * the altar, a pan right to make room for the interface, then a pull back as
 * the doors open. World → screen: X = 960 + (x − 960)·s + tx.
 */
export const camera = (f: number) => {
  const push = lin(f, [0, 720], [1.0, 1.08]);
  const dolly = iv(f, [720, 1160], [0, 1]);
  const pull = iv(f, [C.pullStart, C.pullEnd], [0, 1], PM_EASE.inOut);
  const s = lerp(pull, lerp(dolly, push, 1.34), 1.0);
  const pan = iv(f, [1150, 1265], [0, 1]) * (1 - iv(f, [C.collapse, C.collapse + 80], [0, 1]));
  const tx = -400 * pan;
  const ty = lerp(dolly, 0, -40) * (1 - pull);
  return { s, tx, ty };
};

export const toScreen = (f: number, x: number, y: number) => {
  const { s, tx, ty } = camera(f);
  return { x: 960 + (x - 960) * s + tx, y: 540 + (y - 540) * s + ty, s };
};

export const toWorld = (f: number, X: number, Y: number) => {
  const { s, tx, ty } = camera(f);
  return { x: 960 + (X - 960 - tx) / s, y: 540 + (Y - 540 - ty) / s, s };
};
