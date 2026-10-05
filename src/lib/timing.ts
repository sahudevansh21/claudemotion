/**
 * Time helpers. Author everything in seconds, convert at the edge.
 */

/** Convert seconds to a whole number of frames. */
export const seconds = (s: number, fps: number): number => Math.round(s * fps);

/** Convert frames back to seconds. */
export const toSeconds = (frames: number, fps: number): number => frames / fps;

/** Frame offset for the i-th item of a staggered group. */
export const stagger = (index: number, stepFrames: number, delay = 0): number =>
  delay + index * stepFrames;

/** Frames per beat for a tempo. */
export const framesPerBeat = (bpm: number, fps: number): number =>
  (60 / bpm) * fps;

/**
 * Beat information at a frame — use it to sync visuals to music.
 *
 * - `beat`: index of the current beat (0-based)
 * - `progress`: 0 → 1 position inside the current beat
 * - `pulse`: 1 on the beat, decaying exponentially towards 0 (great for "kicks")
 */
export const beatAt = (
  frame: number,
  fps: number,
  bpm: number,
  offsetSeconds = 0,
): { beat: number; progress: number; pulse: number } => {
  const fpb = framesPerBeat(bpm, fps);
  const t = Math.max(0, frame - offsetSeconds * fps) / fpb;
  const beat = Math.floor(t);
  const progress = t - beat;
  return { beat, progress, pulse: Math.exp(-progress * 6) };
};
