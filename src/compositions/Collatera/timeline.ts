import { interpolate } from "remotion";
import { CL_EASE } from "./brand";
import timeline from "./timeline.json";

export const TIMELINE = timeline;

/** Scene start/end/cues by id (frames @ 60 fps). */
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
  easing: (t: number) => number = CL_EASE.out,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (t: number, a: number, b: number): number =>
  a + (b - a) * t;
