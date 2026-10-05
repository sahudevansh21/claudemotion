/**
 * Reusable, frame-driven animation primitives.
 *
 * RULE: every animated value must be derived from the current frame
 * (useCurrentFrame) via interpolate()/spring(). Never use CSS transitions,
 * CSS @keyframes, setTimeout or requestAnimationFrame — they don't render
 * deterministically.
 */
import { Easing, interpolate, spring, type SpringConfig } from "remotion";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Named spring presets. */
export const SPRINGS = {
  /** Soft, no overshoot — UI elements, text. */
  smooth: { damping: 200 },
  /** Snappy with a little bounce — shapes, icons. */
  snappy: { damping: 14, stiffness: 160, mass: 0.6 },
  /** Big playful overshoot. */
  bouncy: { damping: 9, stiffness: 120 },
} satisfies Record<string, Partial<SpringConfig>>;

/** Named easing curves for interpolate(). */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
} as const;

/** 0 → 1 spring starting at `delay` frames. */
export const springIn = (
  frame: number,
  fps: number,
  {
    delay = 0,
    config = SPRINGS.smooth,
    durationInFrames,
  }: {
    delay?: number;
    config?: Partial<SpringConfig>;
    durationInFrames?: number;
  } = {},
): number => spring({ frame, fps, delay, config, durationInFrames });

/** Eased 0 → 1 between two frames (clamped). */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE.out,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], { ...CLAMP, easing });

/** Linear map of a 0 → 1 value onto [from, to]. */
export const mix = (t: number, from: number, to: number): number =>
  from + (to - from) * t;

/**
 * Fade-out over the last `duration` frames before `end` (use with
 * durationInFrames from useVideoConfig to exit a scene cleanly).
 */
export const fadeOut = (frame: number, end: number, duration: number): number =>
  interpolate(frame, [end - duration, end], [1, 0], CLAMP);

/** Common "enter from below" style from a 0 → 1 progress value. */
export const enterUp = (
  t: number,
  distance = 60,
  blur = 12,
): React.CSSProperties => ({
  opacity: t,
  transform: `translateY(${mix(t, distance, 0)}px)`,
  filter: blur > 0 ? `blur(${mix(t, blur, 0)}px)` : undefined,
});
