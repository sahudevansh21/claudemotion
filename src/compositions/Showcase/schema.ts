import { zColor } from "@remotion/zod-types";
import { z } from "zod";

/**
 * Props for the Showcase composition. Every field is editable live in the
 * Remotion Studio sidebar and can be overridden at render time with --props.
 */
export const showcaseSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accentColor: zColor(),
  /** Tempo of the music track — drives beat-synced animation. */
  bpm: z.number().min(40).max(240),
  musicVolume: z.number().min(0).max(1),
  /** Output format. Duration is computed from scene lengths in seconds. */
  width: z.number().int().min(16),
  height: z.number().int().min(16),
  fps: z.number().min(1).max(120),
});

export type ShowcaseProps = z.infer<typeof showcaseSchema>;
