import { interpolate } from "remotion";
import timeline from "./timeline.json";
import { TN_EASE } from "./brand";

export const TIMELINE = timeline;

/** Scene start/end/cues by id (frames @ timeline.fps). */
export const scene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return { ...s, duration: s.end - s.start };
};

/** Cue frame relative to its scene — the same numbers the audio script uses. */
export const cue = (id: string, name: string): number => {
  const v = (scene(id).cues as unknown as Record<string, number>)[name];
  if (v === undefined) throw new Error(`Unknown cue ${id}.${name}`);
  return v;
};

/** Eased 0 → 1 from `start` over `duration` frames (clamped). */
export const ez = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = TN_EASE.out,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (t: number, a: number, b: number): number =>
  a + (b - a) * t;

/**
 * Handheld camera: smooth pseudo-random drift built from incommensurate
 * sines (deterministic per frame). Returns a CSS transform.
 */
export const handheld = (frame: number, amp = 1, seed = 0): string => {
  const t = frame / 30 + seed * 10;
  const x = (Math.sin(t * 1.3) * 0.6 + Math.sin(t * 2.9 + 1) * 0.4) * 6 * amp;
  const y = (Math.sin(t * 1.7 + 2) * 0.6 + Math.sin(t * 3.3) * 0.4) * 4 * amp;
  const r =
    (Math.sin(t * 0.9 + 3) * 0.6 + Math.sin(t * 2.3) * 0.4) * 0.25 * amp;
  return `translate(${x}px, ${y}px) rotate(${r}deg)`;
};

/** interpolate() options for camera moves: clamped, gentle in-out. */
export const TN_DOLLY = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: TN_EASE.soft,
} as const;
