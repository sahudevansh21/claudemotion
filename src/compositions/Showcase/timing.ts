import { seconds } from "../../lib/timing";

/**
 * Scene lengths in SECONDS. Edit these to retime the video — the total
 * duration is recomputed automatically (see calculateShowcaseMetadata).
 */
export const SCENE_SECONDS = {
  intro: 4,
  shapes: 4,
  features: 4.5,
  outro: 3.5,
} as const;

/** Length of each transition between scenes, in seconds. */
export const TRANSITION_SECONDS = 0.6;

/**
 * Total frames. Transitions overlap adjacent scenes, so each one shortens
 * the timeline by its own length.
 */
export const showcaseDurationInFrames = (fps: number): number => {
  const scenes = Object.values(SCENE_SECONDS);
  const sceneFrames = scenes.reduce((sum, s) => sum + seconds(s, fps), 0);
  return sceneFrames - (scenes.length - 1) * seconds(TRANSITION_SECONDS, fps);
};
