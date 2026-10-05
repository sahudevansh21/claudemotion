import { interpolate } from "remotion";
import { PM_EASE } from "../brand";

/** Eased 0 → 1 from `start` over `duration` frames (clamped). */
export const ez = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = PM_EASE.out,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Linear mix. */
export const lerp = (t: number, a: number, b: number): number =>
  a + (b - a) * t;

/** Slow "camera" push used on most shots so no frame is ever static. */
export const push = (
  frame: number,
  duration: number,
  from = 1,
  to = 1.04,
): number => interpolate(frame, [0, duration], [from, to]);
