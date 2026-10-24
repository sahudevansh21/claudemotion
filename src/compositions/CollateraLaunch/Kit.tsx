import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CL, CL_FONTS } from "../Collatera/brand";

/**
 * Shared kit for COLLATERA launch (20 s, 4K, 120 fps). All timing is in
 * SECONDS (frame / fps), so motion stays sub-frame smooth at 120 fps.
 */
export const PAPER = "#EDF7EA";
export const INK = "#00301F";
export const SANS = "Inter, sans-serif";
export const PIX = CL_FONTS.pixel;
export const MONO = CL_FONTS.mono;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const useSec = (): number => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};
export const ez = (t: number, a: number, b: number, e = OUT): number =>
  interpolate(t, [a, b], [0, 1], { ...C, easing: e });
export const lerp = (p: number, a: number, b: number): number => a + (b - a) * p;

/** Light "paper" plate (reference's white cards, in brand mint). */
export const Paper: React.FC = () => {
  const t = useSec();
  const o = (t * 6) % 28;
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${INK}1c 1.3px, transparent 1.4px)`,
          backgroundSize: "28px 28px",
          backgroundPosition: `${o}px 0px`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,48,31,0.10) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Dark forest plate with dotted grid and a slow lime glow. */
export const Night: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const t = useSec();
  const o = (t * 10) % 32;
  const gx = 50 + Math.sin(t * 0.8) * 12;
  return (
    <AbsoluteFill style={{ background: CL.night }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${gx}% 60%, rgba(117,255,0,${0.16 * glow}) 0%, transparent 55%), radial-gradient(ellipse at 50% 50%, ${CL.evergreen} 0%, ${CL.night} 80%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${CL.sage}40 1.2px, transparent 1.3px)`,
          backgroundSize: "32px 32px",
          backgroundPosition: `0px ${o}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Four small corner squares around a box (reference's crop marks). */
export const Corners: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  opacity?: number;
  size?: number;
}> = ({ x, y, w, h, color = INK, opacity = 1, size = 9 }) => (
  <>
    {[
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ].map(([cx, cy], i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: cx - size / 2,
          top: cy - size / 2,
          width: size,
          height: size,
          background: color,
          opacity,
        }}
      />
    ))}
  </>
);

/**
 * Text that resolves out of a chromatic, scan-lined blur (reference's
 * "Your product / aren't." treatment) and smears out sideways on exit.
 */
export const GlitchText: React.FC<{
  text: string;
  at: number;
  out?: number;
  size: number;
  color?: string;
  font?: string;
  weight?: number;
  tracking?: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  at,
  out,
  size,
  color = INK,
  font = PIX,
  weight = 700,
  tracking = 0,
  dur = 0.4,
  style,
}) => {
  const t = useSec();
  const p = ez(t, at, at + dur);
  const q = out === undefined ? 0 : ez(t, out, out + 0.22, IN);
  if (t < at - 0.001 || q >= 1) return null;
  const k = 1 - p + q;
  const chroma = k * size * 0.16;
  const blur = (1 - p) * size * 0.12 + q * size * 0.2;
  const base: React.CSSProperties = {
    fontFamily: font,
    fontWeight: weight,
    fontSize: size,
    letterSpacing: tracking,
    lineHeight: 1.05,
    whiteSpace: "pre",
    ...style,
  };
  const scan = `repeating-linear-gradient(0deg, #000 0 ${Math.max(2, size * 0.035)}px, rgba(0,0,0,${0.15 + 0.85 * p * (1 - q)}) ${Math.max(2, size * 0.035)}px ${Math.max(4, size * 0.06)}px)`;
  const wrap: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    opacity: Math.min(1, p * 2.5) * (1 - q),
    transform: `translateX(${(1 - p) * size * 0.25 - q * size * 0.6}px) scaleX(${1 + q * 0.5})`,
    transformOrigin: "left center",
    filter: `blur(${blur}px)`,
    WebkitMaskImage: scan,
    maskImage: scan,
  };
  return (
    <div style={wrap}>
      {k > 0.01 ? (
        <>
          <div style={{ ...base, position: "absolute", left: -chroma, top: 0, color: CL.lime, opacity: 0.8 }}>
            {text}
          </div>
          <div style={{ ...base, position: "absolute", left: chroma, top: 0, color: "#00A3FF", opacity: 0.45 }}>
            {text}
          </div>
        </>
      ) : null}
      <div style={{ ...base, position: "relative", color }}>{text}</div>
    </div>
  );
};

/** Browser window chrome around a screen-recording clip. */
export const Browser: React.FC<{
  clip: string;
  width: number;
  rate?: number;
  dark?: boolean;
}> = ({ clip, width, rate = 1, dark = false }) => {
  const h = Math.round((width * 418) / 772);
  return (
    <div
      style={{
        width,
        borderRadius: 18,
        overflow: "hidden",
        background: dark ? "#06140E" : "#F7FBF5",
        border: dark ? `1px solid ${CL.line}` : "1px solid rgba(0,48,31,0.15)",
        boxShadow: dark
          ? "0 60px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(117,255,0,0.08)"
          : "0 50px 110px rgba(0,48,31,0.28), 0 12px 30px rgba(0,48,31,0.18)",
      }}
    >
      <div style={{ height: 46, display: "flex", alignItems: "center", gap: 9, padding: "0 18px" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        <div
          style={{
            margin: "0 auto",
            padding: "6px 22px",
            borderRadius: 8,
            fontFamily: MONO,
            fontSize: 16,
            color: dark ? CL.sage : "#4B6B5C",
            background: dark ? "#0D2219" : "#E4EFE2",
          }}
        >
          🔒 collatera.buzz
        </div>
        <div style={{ width: 57 }} />
      </div>
      <div style={{ width, height: h, overflow: "hidden", background: CL.forest }}>
        <Video
          src={staticFile(`collatera-launch/clips/${clip}.mp4`)}
          muted
          playbackRate={rate}
          style={{ width, height: h, display: "block" }}
        />
      </div>
    </div>
  );
};

/** Rotating lime light beams (reference's purple ray bursts). */
export const Rays: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const t = useSec();
  const rot = t * 14;
  const stops: string[] = [];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const a = (360 / n) * i;
    const w = 3 + random(`ray${i}`) * 7;
    const al = (0.18 + random(`raya${i}`) * 0.35) * strength;
    stops.push(
      `transparent ${a}deg`,
      `rgba(164,255,43,${al}) ${a + w / 2}deg`,
      `transparent ${a + w}deg`,
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -1040,
          top: -1460,
          width: 4000,
          height: 4000,
          background: `conic-gradient(from ${rot}deg at 50% 50%, ${stops.join(",")})`,
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 0%, #000 12%, transparent 48%)",
          maskImage: "radial-gradient(circle at 50% 50%, #000 0%, #000 12%, transparent 48%)",
          filter: "blur(6px)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(216,255,224,${0.55 * strength}) 0%, rgba(117,255,0,${0.25 * strength}) 18%, transparent 45%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Neon sine "wires" (reference's glowing line waves). */
export const NeonWaves: React.FC<{ reveal: number }> = ({ reveal }) => {
  const t = useSec();
  const lines = Array.from({ length: 7 }, (_, i) => {
    const amp = 120 + i * 26;
    const ph = t * (1.1 + i * 0.12) + i * 0.9;
    const pts: string[] = [];
    for (let x = -40; x <= 1960; x += 20) {
      const y =
        540 +
        Math.sin(x / (260 + i * 30) + ph) * amp * Math.sin(x / 1900 * Math.PI) +
        Math.sin(x / 90 + ph * 2) * 8;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return { d: `M${pts.join(" L")}`, i };
  });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map(({ d, i }) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i % 3 === 0 ? CL.mint : CL.lime}
          strokeWidth={i % 3 === 0 ? 2.2 : 1.6}
          opacity={0.25 + (i % 3 === 0 ? 0.35 : 0.2)}
          filter="url(#glow)"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - reveal}
        />
      ))}
    </svg>
  );
};

export const Label: React.FC<{ text: string; color?: string; dot?: string; size?: number }> = ({
  text,
  color = INK,
  dot = CL.lime,
  size = 26,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: SANS, fontWeight: 600, fontSize: size, color }}>
    <div style={{ width: size * 0.42, height: size * 0.42, background: dot, boxShadow: `0 0 0 2px ${INK}22` }} />
    {text}
  </div>
);
