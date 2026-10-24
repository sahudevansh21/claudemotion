import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Stage } from "../../components/Stage";
import { CL } from "../Collatera/brand";
import { ez, IN } from "./Kit";
import TL from "./launch.json";
import { Backs, BrowserShot, End, Hook, Intro, Lending, Logo, Monitor, Steps, TerminalShot, Wall } from "./Shots";

/**
 * COLLATERA launch — 20 s, 3840x2160 @ 120 fps (2,400 frames).
 * Motion grammar from the supplied SaaS launch reel (glitch-resolve type,
 * corner marks, tilted screens, screen wall, ray bursts, neon waves, stacked
 * end lines, noise → logo). launch.json drives picture cuts AND the audio.
 */
const SHOTS: Record<string, React.FC> = {
  hook: Hook,
  browser: BrowserShot,
  intro: Intro,
  terminal: TerminalShot,
  lending: Lending,
  wall: Wall,
  backs: Backs,
  monitor: Monitor,
  steps: Steps,
  end: End,
  logo: Logo,
};

/** Motion-blurred push in, short smear out — every cut lands on the beat. */
const Cut: React.FC<{ len: number; children: React.ReactNode }> = ({ len, children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const i = ez(t, 0, 0.22);
  const o = ez(t, len - 0.1, len, IN);
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${1.08 - 0.08 * i + o * 0.06}) translateX(${-o * 60}px)`,
        filter: i < 1 || o > 0 ? `blur(${(1 - i) * 18 + o * 14}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Kick pulse + drop flash, from the global clock. */
const Pulse: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const beat = 60 / TL.bpm;
  const inGroove = t >= TL.drop && t < 16.5;
  const ph = ((t - TL.drop) % beat) / beat;
  const pulse = inGroove ? Math.exp(-ph * 7) : 0;
  const flash = Math.max(0, 1 - Math.abs(t - TL.drop) / 0.09) + Math.max(0, 1 - Math.abs(t - 18.5) / 0.08);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1 + pulse * 0.007})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: CL.mint, opacity: Math.min(0.85, flash), mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export const CollateraLaunch: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: CL.night }}>
      <Stage>
        <Pulse>
          {TL.shots.map((s) => {
            const S = SHOTS[s.id];
            const from = Math.round(s.from * fps);
            const dur = Math.round(s.to * fps) - from;
            return (
              <Sequence key={s.id} name={s.id} from={from} durationInFrames={dur} premountFor={fps}>
                <Cut len={s.to - s.from}>
                  <S />
                </Cut>
              </Sequence>
            );
          })}
        </Pulse>
      </Stage>
      <Audio src={staticFile("collatera-launch/audio/mix.wav")} />
    </AbsoluteFill>
  );
};
