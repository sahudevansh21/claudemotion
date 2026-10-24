import tl from "./timeline.json";

export const FPS = tl.fps;
export const DURATION = tl.durationInFrames;

export const scene = (id: string) => {
  const s = tl.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scene ${id}`);
  return s;
};

export const cue = (id: string, name: string): number =>
  (scene(id).cues as unknown as Record<string, number>)[name] ?? 0;

export { tl };
