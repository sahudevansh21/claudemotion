import { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { beatAt } from "../lib/timing";

type BeatInfo = ReturnType<typeof beatAt> & { bpm: number };

const BeatContext = createContext<BeatInfo | null>(null);

/**
 * Put this at the ROOT of a composition, at the same level as the <Audio>
 * whose tempo it describes. It reads the absolute (composition-level) frame,
 * so components nested in <Sequence>/<TransitionSeries> — where
 * useCurrentFrame() is relative to the sequence — still stay on the beat.
 */
export const BeatProvider: React.FC<{
  bpm: number;
  /** Seconds into the audio where beat 1 lands. */
  offsetSeconds?: number;
  children: React.ReactNode;
}> = ({ bpm, offsetSeconds = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = { ...beatAt(frame, fps, bpm, offsetSeconds), bpm };
  return <BeatContext.Provider value={value}>{children}</BeatContext.Provider>;
};

/** { beat, progress, pulse, bpm } synced to the music. */
export const useBeat = (): BeatInfo => {
  const ctx = useContext(BeatContext);
  if (!ctx) {
    throw new Error("useBeat() must be used inside <BeatProvider>");
  }
  return ctx;
};
