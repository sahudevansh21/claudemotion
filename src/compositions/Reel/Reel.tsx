import { Audio, Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { FONTS } from "../../config/theme";
import { CLAMP } from "../../lib/animation";
import { seconds } from "../../lib/timing";
import REEL from "./reel.json";

/**
 * Vertical reel, 1080x1920 @ 60 fps, 23 s. Edit grammar copied from the
 * reference in docs/references/REEL_ANALYSIS.md: two hook shots (second in
 * B&W) under a red line, a beat-cut montage under one locked white line,
 * then a black name card and an Instagram handle card.
 * Shot list and timings live in reel.json (shared with the audio script).
 */

export const reelSchema = z.object({
  hook: z.string(),
  payoff: z.string(),
  name: z.string(),
  handle: z.string(),
  lowercase: z.boolean(),
});

export type ReelProps = z.infer<typeof reelSchema>;

export const REEL_SECONDS = REEL.durationSeconds;

type Shot = (typeof REEL.shots)[number] & {
  grade?: string;
  zoom?: number;
  focusX?: number;
  focusY?: number;
};

const RED = "#e3241b";

const ShotClip: React.FC<{ shot: Shot; length: number }> = ({ shot, length }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bw = shot.grade === "bw";
  const zoom = shot.zoom ?? 1;
  // The very first frames whip in (the reference opens on a motion-blurred pan).
  const whip = shot.at === 0 ? interpolate(frame, [0, seconds(0.12, fps)], [1, 0], CLAMP) : 0;
  // Gentle push on the close-up ending only (stands in for a true macro shot).
  const push = zoom > 1 ? interpolate(frame, [0, length], [zoom, zoom * 1.06], CLAMP) : 1;
  const grade = bw
    ? "grayscale(1) contrast(1.08) brightness(0.98)"
    : "contrast(0.96) saturate(0.86) brightness(0.97) sepia(0.08)";

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "black" }}>
      <AbsoluteFill
        style={{
          transform: `translateX(${whip * -260}px) scale(${push})`,
          transformOrigin: `${(shot.focusX ?? 0.5) * 100}% ${(shot.focusY ?? 0.5) * 100}%`,
          filter: `${grade}${whip > 0 ? ` blur(${whip * 18}px)` : ""}`,
        }}
      >
        <Video
          src={staticFile(`reel/clips/${shot.clip}.mp4`)}
          trimBefore={Math.round(shot.from * fps)}
          muted
          objectFit="cover"
          style={{ width: "100%", height: "100%" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Text printed into the footage: soft-light blend + faint RGB fringe. */
const BlendedText: React.FC<{
  lines: string[];
  color: string;
  size: number;
  opacity: number;
}> = ({ lines, color, size, opacity }) => {
  const style = (extra: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONTS.sans,
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1.0,
    letterSpacing: "-0.065em",
    textAlign: "center",
    whiteSpace: "nowrap",
    ...extra,
  });
  const text = lines.map((l) => <div key={l}>{l}</div>);
  return (
    <AbsoluteFill style={{ top: -110, opacity }}>
      <div style={style({ color: "#ff2a2a", transform: "translate(-3px, 0)", mixBlendMode: "screen", opacity: 0.35 })}>{text}</div>
      <div style={style({ color: "#22d3ff", transform: "translate(3px, 0)", mixBlendMode: "screen", opacity: 0.3 })}>{text}</div>
      <div style={style({ color, opacity: 0.72 })}>{text}</div>
      <div style={style({ color, mixBlendMode: "overlay" })}>{text}</div>
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 12;
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 540 960" preserveAspectRatio="none">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at 50% 45%, transparent 55%, color-mix(in srgb, black 45%, transparent) 100%)",
    }}
  />
);

const InstaGlyph: React.FC<{ size: number; gradient: number }> = ({ size, gradient }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="ig" x1="0.1" y1="1" x2="0.9" y2="0">
        <stop offset="0" stopColor="#feda75" />
        <stop offset="0.3" stopColor="#fa7e1e" />
        <stop offset="0.55" stopColor="#d62976" />
        <stop offset="0.8" stopColor="#962fbf" />
        <stop offset="1" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    {[
      { stroke: "white", o: 1 - gradient },
      { stroke: "url(#ig)", o: gradient },
    ].map(({ stroke, o }) => (
      <g key={stroke} opacity={o} fill="none" stroke={stroke} strokeWidth={8}>
        <rect x={8} y={8} width={84} height={84} rx={24} />
        <circle cx={50} cy={50} r={19} />
        <circle cx={74} cy={26} r={3.5} fill={stroke} stroke="none" />
      </g>
    ))}
  </svg>
);

/** Small corner watermark: top-right, then bottom-left from 9.53 s. */
const Watermark: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bottom = frame >= seconds(9.53, fps);
  return (
    <div
      style={{
        position: "absolute",
        ...(bottom ? { left: 90, bottom: 470, alignItems: "flex-start" } : { right: 90, top: 250, alignItems: "flex-end" }),
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity: 0.85,
      }}
    >
      <InstaGlyph size={50} gradient={0} />
      <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 22, color: "white", letterSpacing: "-0.02em" }}>
        @{handle.toUpperCase()}
      </div>
    </div>
  );
};

const EndCard: React.FC<{ name: string; handle: string; handleAt: number }> = ({ name, handle, handleAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = frame - handleAt;
  const showHandle = handle.length > 0 && h >= 0;
  const pop = showHandle ? spring({ frame: h, fps, config: { damping: 12, stiffness: 180 } }) : 0;
  const gradient = showHandle
    ? interpolate(h, [seconds(0.4, fps), seconds(0.8, fps), seconds(2.6, fps), seconds(3.0, fps)], [0, 1, 1, 0], CLAMP)
    : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "black", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: FONTS.sans,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.05em",
          color: "white",
          opacity: showHandle ? 0.32 : 1,
          marginTop: -110,
        }}
      >
        {name.toUpperCase()}
      </div>
      {showHandle ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: -110 }}>
          <div style={{ transform: `scale(${pop})` }}>
            <InstaGlyph size={150} gradient={gradient} />
          </div>
          <div
            style={{
              position: "absolute",
              top: "calc(50% + 105px)",
              fontFamily: FONTS.sans,
              fontWeight: 700,
              fontSize: 46,
              color: "white",
              letterSpacing: "-0.02em",
              opacity: pop,
            }}
          >
            @{handle.toUpperCase()}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const Reel: React.FC<ReelProps> = ({ hook, payoff, name, handle, lowercase }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = (s: number) => Math.round(s * fps);
  const shots = REEL.shots as Shot[];
  const nameAt = f(REEL.nameCard);
  const montageAt = f(REEL.montageStart);
  const hookIn = f(REEL.hookTextIn);
  const fmt = (s: string) => (lowercase ? s.toLowerCase() : s);
  // Hook line wraps after the word nearest the middle so it fits the 9:16 frame.
  const hookWords = fmt(hook).split(" ");
  const half = Math.ceil(hookWords.length / 2) - 1;
  const hookLines = [hookWords.slice(0, half + 1).join(" "), hookWords.slice(half + 1).join(" ")].filter(Boolean);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {shots.map((shot, i) => {
        const from = f(shot.at);
        const to = i + 1 < shots.length ? f(shots[i + 1].at) : nameAt;
        return (
          <Sequence key={`${shot.at}`} from={from} durationInFrames={to - from} premountFor={fps} name={shot.note}>
            <ShotClip shot={shot} length={to - from} />
          </Sequence>
        );
      })}

      <Sequence durationInFrames={nameAt} name="Grade">
        <Vignette />
        <Grain />
      </Sequence>

      <Sequence from={hookIn} durationInFrames={montageAt - hookIn} premountFor={fps} name="Hook line">
        <BlendedText
          lines={hookLines}
          color={RED}
          size={112}
          opacity={interpolate(frame - hookIn, [0, 4], [0, 1], CLAMP)}
        />
      </Sequence>

      <Sequence from={montageAt} durationInFrames={nameAt - montageAt} premountFor={fps} name="Payoff line">
        <BlendedText lines={[fmt(payoff)]} color="white" size={74} opacity={1} />
      </Sequence>

      {handle ? (
        <Sequence durationInFrames={nameAt} name="Watermark">
          <Watermark handle={handle} />
        </Sequence>
      ) : null}

      <Sequence from={nameAt} premountFor={fps} name="End card">
        <EndCard name={name} handle={handle} handleAt={f(REEL.handleCard) - nameAt} />
      </Sequence>

      <Audio src={staticFile("reel/audio/mix.wav")} />
    </AbsoluteFill>
  );
};
