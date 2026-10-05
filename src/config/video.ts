/**
 * Default video format for compositions registered in src/Root.tsx.
 *
 * Change these values to change the resolution / frame rate of every
 * composition that uses them. (Showcase takes its format from its
 * defaultProps in Root.tsx instead, so it can also be edited in Studio.)
 *
 * All timing in this project is authored in SECONDS and converted to frames
 * with `seconds()` from `src/lib/timing.ts`, so changing `fps` keeps the
 * video the same length in real time.
 *
 * Per-render overrides for Showcase (no code change needed):
 *   npx remotion render Showcase out/showcase.mp4 --props='{"fps":60}'
 *   npx remotion render Showcase out/vertical.mp4 --props='{"width":1080,"height":1920}'
 */
export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/**
 * The "design canvas" that layouts are authored against. `<Stage>` scales
 * content from this size to whatever the actual composition size is, so
 * pixel values in components can assume 1920x1080.
 */
export const DESIGN = {
  width: 1920,
  height: 1080,
} as const;
