import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";
import { C, CL, DISPLAY, ez, IO, MONO, SANS } from "./brand";
import { Badge } from "./parts";

/** Shared motion primitives for the Oryn reference-style films (in-place word swaps, cursor-led, flat colour per idea). */
export type Tl = { fps: number; durationInFrames: number; bpm: number; scenes: { id: string; start: number; end: number; cues: Record<string, number>; sfx: { cue: number; type: string; gain: number }[] }[] };

export const sceneOf = (tl: Tl, id: string) => {
  const s = tl.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`unknown scene ${id}`);
  return s;
};
export const cueOf = (tl: Tl, id: string, n: string) => sceneOf(tl, id).cues[n] ?? 0;
export const lenOf = (tl: Tl, id: string) => sceneOf(tl, id).end - sceneOf(tl, id).start;

export const mixHex = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a); const [r2, g2, b2] = p(b);
  const h = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return `#${h(r1 + (r2 - r1) * t)}${h(g1 + (g2 - g1) * t)}${h(b1 + (b2 - b1) * t)}`;
};
/** Flat colour per idea, cross-faded over 28 frames around each boundary. */
export const bgFrom = (keys: [number, string][]) => (f: number) => {
  for (let i = 1; i < keys.length; i++) {
    const [t, col] = keys[i];
    if (f < t - 14) return keys[i - 1][1];
    if (f <= t + 14) return mixHex(keys[i - 1][1], col, interpolate(f, [t - 14, t + 14], [0, 1], CL));
  }
  return keys[keys.length - 1][1];
};

/** Words/phrases swapped in place: each blurs out as the next blurs in. */
export const Swap: React.FC<{ items: React.ReactNode[]; at: number; each: number; keepLast?: boolean; style?: React.CSSProperties }> = ({ items, at, each, keepLast = true, style }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-grid", ...style }}>
      {items.map((it, i) => {
        const a = at + i * each;
        const last = i === items.length - 1 && keepLast;
        const inP = ez(f, a, 16);
        const outP = last ? 0 : ez(f, a + each - 6, 14, IO);
        return (
          <span key={i} style={{ gridArea: "1 / 1", opacity: inP * (1 - outP), filter: `blur(${(1 - inP) * 14 + outP * 14}px)`, transform: `translateY(${(1 - inP) * 18 - outP * 14}px)`, whiteSpace: "nowrap" }}>{it}</span>
        );
      })}
    </span>
  );
};

export const Reveal: React.FC<{ children: React.ReactNode; at: number; out?: number; style?: React.CSSProperties }> = ({ children, at, out, style }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 24);
  const o = out === undefined ? 0 : ez(f, out, 18, IO);
  return <div style={{ opacity: p * (1 - o), filter: `blur(${(1 - p) * 14 + o * 14}px)`, transform: `translateY(${(1 - p) * 26 - o * 12}px)`, ...style }}>{children}</div>;
};

/** Typing with a blinking caret, driven by the frame. */
export const Typed: React.FC<{ text: string; at: number; cps?: number; caret?: boolean; style?: React.CSSProperties; color?: string }> = ({ text, at, cps = 24, caret = true, style, color = C.ink }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - at) * cps) / 60)));
  const blink = Math.floor(f / 18) % 2 === 0;
  const typing = f >= at && n < text.length;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && f >= at - 6 && (typing || blink) && <span style={{ display: "inline-block", width: "0.09em", height: "0.95em", background: color, marginLeft: 4, verticalAlign: "-0.12em" }} />}
    </span>
  );
};

export const Cursor: React.FC<{ x: number; y: number; click?: number; color?: string; dark?: boolean }> = ({ x, y, click = 0, color = C.blue, dark }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, zIndex: 50 }}>
    {click > 0 && <div style={{ position: "absolute", left: -40 * click - 4, top: -40 * click - 4, width: 80 * click + 8, height: 80 * click + 8, borderRadius: 999, border: `4px solid ${color}`, opacity: 1 - click }} />}
    <svg width={54} height={62} viewBox="0 0 27 31" style={{ position: "absolute", left: -3, top: -3, filter: "drop-shadow(0 6px 8px rgba(13,13,15,0.25))" }}>
      <path d="M3 2 L3 24 L9 18.5 L13 28 L17.5 26 L13.5 16.8 L22 16.5 Z" fill={color} stroke={dark ? "#0d0d0f" : "#fff"} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  </div>
);

export const path = (f: number, pts: [number, number, number][]) => {
  if (f <= pts[0][0]) return { x: pts[0][1], y: pts[0][2] };
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, xa, ya] = pts[i]; const [b, xb, yb] = pts[i + 1];
    if (f <= b) { const t = Easing.inOut(Easing.cubic)((f - a) / (b - a)); return { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t }; }
  }
  const l = pts[pts.length - 1];
  return { x: l[1], y: l[2] };
};
export const pulse = (f: number, at: number) => (f >= at && f < at + 18 ? interpolate(f, [at, at + 18], [0.001, 1], CL) : 0);

export const Drift: React.FC<{ children: React.ReactNode; n: number; from?: number; to?: number }> = ({ children, n, from = 1, to = 1.035 }) => {
  const f = useCurrentFrame();
  const s = from + (to - from) * interpolate(f, [0, n], [0, 1], { ...CL, easing: IO });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Halftone: React.FC<{ o?: number; color?: string }> = ({ o = 0.5, color = C.cyan }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, backgroundImage: `radial-gradient(${color} 38%, transparent 42%)`, backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 52% 55% at 50% 48%, #000 0%, transparent 100%)", maskImage: "radial-gradient(ellipse 52% 55% at 50% 48%, #000 0%, transparent 100%)" }} />
);

/** Small "Illustrative" tag required on any mocked UI. */
export const Illustrative: React.FC<{ at?: number; dark?: boolean; style?: React.CSSProperties }> = ({ at = 0, dark, style }) => {
  const f = useCurrentFrame();
  return <div style={{ position: "absolute", fontFamily: MONO, fontSize: 15, letterSpacing: 4, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.55)" : "rgba(13,13,15,0.5)", opacity: ez(f, at, 20), ...style }}>Illustrative</div>;
};

/** Centred badge + one line + disclaimer. */
export const EndCard: React.FC<{ line: React.ReactNode; dark?: boolean; at?: number; n: number }> = ({ line, dark, at = 14, n }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 40);
  return (
    <Drift n={n} from={1} to={1.03}>
      {!dark && <Halftone o={0.55} />}
      <div style={{ position: "absolute", left: 960 - 170, top: 170, opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${0.86 + 0.14 * p})` }}><Badge size={340} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 78, letterSpacing: -1.5, color: dark ? C.cream : C.ink }}>
        <Reveal at={at + 56}>{line}</Reveal>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: MONO, fontSize: 16, letterSpacing: 4, opacity: 0.55, color: dark ? C.cream : C.ink, textTransform: "uppercase" }}>
        <Reveal at={at + 100}>Oryn © 2026 · MVP · Simulated issuer data · Not investment advice</Reveal>
      </div>
    </Drift>
  );
};

export const Film: React.FC<{ tl: Tl; scenes: Record<string, React.FC>; bg: (f: number) => string; audio: string }> = ({ tl, scenes, bg, audio }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg(f) }}>
      <Stage>
        {tl.scenes.map((s) => {
          const S = scenes[s.id];
          return (
            <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={s.end - s.start + 14} premountFor={60}>
              <S />
            </Sequence>
          );
        })}
      </Stage>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

/** Dark tilted plane (Pages / Supabase grammar). */
export const Plane: React.FC<{ children: React.ReactNode; rx?: number; ry?: number; rz?: number; x?: number; y?: number; z?: number }> = ({ children, rx = 8, ry = -10, rz = 0, x = 0, y = 0, z = 1 }) => (
  <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
    <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${z})`, transformStyle: "preserve-3d", transformOrigin: "50% 50%" }}>{children}</div>
  </AbsoluteFill>
);

export { Video, DISPLAY, C, CL, ez, IO, MONO, SANS, interpolate, useCurrentFrame, AbsoluteFill };
