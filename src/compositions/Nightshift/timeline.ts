import { interpolate } from "remotion";
import { NS_EASE } from "./brand";
import timeline from "./timeline.json";

export const TIMELINE = timeline;

type TimelineJson = {
  shots: { id: string; start: number; end: number; cues: object }[];
};

/** Shot / cue lookups for a timeline JSON (frames). */
export const makeTimeline = (tl: TimelineJson) => {
  const shot = (id: string) => {
    const s = tl.shots.find((x) => x.id === id);
    if (!s) throw new Error(`Unknown shot ${id}`);
    return { ...s, duration: s.end - s.start };
  };
  /** Cue frame relative to its shot — the same numbers the audio script uses. */
  const cue = (id: string, name: string): number => {
    const v = (shot(id).cues as Record<string, number>)[name];
    if (v === undefined) throw new Error(`Unknown cue ${id}.${name}`);
    return v;
  };
  return { shot, cue };
};

/** Teaser timeline (frames @ 30 fps). */
export const { shot, cue } = makeTimeline(timeline);

/** Eased 0 → 1 from `start` over `duration` frames (clamped). */
export const ez = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = NS_EASE.out,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const lerp = (t: number, a: number, b: number): number =>
  a + (b - a) * t;
