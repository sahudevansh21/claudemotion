import timeline from "./timeline.json";

export type SceneId = (typeof timeline.scenes)[number]["id"];

export const TIMELINE = timeline;

/** Scene start/end/cues by id (frames at timeline.fps). */
export const scene = (id: string) => {
  const s = timeline.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene ${id}`);
  return { ...s, duration: s.end - s.start };
};

/** Cue frame (relative to its scene) — same numbers the audio script uses. */
export const cue = (id: string, name: string): number => {
  const cues = scene(id).cues as unknown as Record<string, number>;
  const v = cues[name];
  if (v === undefined) throw new Error(`Unknown cue ${id}.${name}`);
  return v;
};
