import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../components/Stage";
import { CL, CL_FONTS } from "../Collatera/brand";
import { Mascot } from "../Collatera/components/Mascot";

/**
 * Shared kit for the COLLATERA 15-day campaign films. Only the locked
 * whatships vocabulary (docs/reference/whatships/STYLE.md): blur-in type,
 * word swaps, rebuilt clean UI, tiles, cursor, tinted plates, scribbles,
 * slot lists, checklists, notification stacks, pixel dissolve, spotlight,
 * smooth camera and logo ends. Time is authored in seconds.
 */
export const K = {
  bg: "#04150F",
  text: "#EAF7EE",
  dim: "#7FA591",
  panel: "#0A2219",
  edge: "#1E3D30",
  lime: CL.lime,
  ink: "#00301F",
  paper: "#F3FAF2",
  mintPlate: "#DDF3E2",
  peach: "#FBE7DA",
  butter: "#FBF0C9",
  sky: "#DCEFF7",
};
export const SANS = "Inter, sans-serif";
export const MONO = CL_FONTS.mono;
export const PIX = CL_FONTS.pixel;

export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.65, 0, 0.35, 1);
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ez = (t: number, a: number, b: number, e = OUT) => interpolate(t, [a, b], [0, 1], { ...C, easing: e });
export const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/** Blur-in at start, blur-out at end (the references' cross-blur hand-off). */
export const Scene: React.FC<{ len: number; children: React.ReactNode; inDur?: number; outDur?: number }> = ({
  len,
  children,
  inDur = 0.3,
  outDur = 0.28,
}) => {
  const t = useT();
  const i = inDur <= 0.02 ? 1 : ez(t, 0, inDur);
  const o = outDur <= 0.02 ? 0 : ez(t, len - outDur, len, Easing.in(Easing.quad));
  const k = Math.max(1 - i, o);
  return (
    <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), filter: k > 0.001 ? `blur(${k * 16}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/** Letter-by-letter blur-in. */
export const Letters: React.FC<{ text: string; at: number; step?: number; dur?: number; style?: React.CSSProperties }> = ({
  text,
  at,
  step = 0.03,
  dur = 0.4,
  style,
}) => {
  const t = useT();
  return (
    <span style={{ whiteSpace: "pre", display: "inline-block", ...style }}>
      {Array.from(text).map((ch, i) => {
        const p = ez(t, at + i * step, at + i * step + dur);
        return (
          <span key={i} style={{ display: "inline-block", opacity: p, filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, transform: `translateY(${(1 - p) * 10}px)` }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/** Word-by-word blur-in (Notion style). */
export const Words: React.FC<{ text: string; at: number; step?: number; style?: React.CSSProperties; hi?: string[]; hiColor?: string }> = ({
  text,
  at,
  step = 0.09,
  style,
  hi = [],
  hiColor = CL.lime,
}) => {
  const t = useT();
  return (
    <span style={{ display: "inline", ...style }}>
      {text.split(" ").map((w, i) => {
        const p = ez(t, at + i * step, at + i * step + 0.35);
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: p, filter: p < 1 ? `blur(${(1 - p) * 9}px)` : undefined, transform: `translateY(${(1 - p) * 12}px)`, color: hi.includes(w.replace(/[.,]/g, "")) ? hiColor : undefined }}>
            {w}
            {i < text.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

/** Swap a single word/phrase in place on cue times (blur cross-fade). */
export const Swap: React.FC<{ items: string[]; times: number[]; color?: string; minWidth?: number }> = ({ items, times, color = CL.lime, minWidth = 300 }) => {
  const t = useT();
  return (
    <span style={{ position: "relative", display: "inline-block", minWidth }}>
      {items.map((w, i) => {
        const a = i === 0 && times[0] <= 0 ? 1 : ez(t, times[i] - 0.05, times[i] + 0.3);
        const b = i < items.length - 1 ? ez(t, times[i + 1] - 0.12, times[i + 1] + 0.1) : 0;
        const v = a * (1 - b);
        return (
          <span key={w + i} style={{ position: i === 0 ? "relative" : "absolute", left: 0, top: 0, whiteSpace: "nowrap", color, opacity: v, filter: v < 1 ? `blur(${(1 - v) * 12}px)` : undefined, transform: `translateY(${(1 - a) * 18 - b * 10}px)` }}>
            {w}
          </span>
        );
      })}
    </span>
  );
};

export const Glyph: React.FC<{ kind: string; size?: number; color?: string }> = ({ kind, size = 44, color = CL.lime }) => {
  const s = { width: size, height: size };
  const p = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinecap: "square" as const };
  const g: Record<string, React.ReactNode> = {
    price: (
      <>
        <path d="M8 6v28M20 10v22M32 4v26" {...p} />
        <rect x="5" y="14" width="6" height="12" fill={color} />
        <rect x="17" y="16" width="6" height="8" fill={color} />
        <rect x="29" y="8" width="6" height="12" fill={color} />
      </>
    ),
    oracle: (
      <>
        <circle cx="20" cy="20" r="14" {...p} />
        <path d="M20 11v10l7 4" {...p} />
      </>
    ),
    buffer: (
      <>
        <path d="M20 4l13 5v10c0 9-6 14-13 17C13 33 7 28 7 19V9z" {...p} />
        <path d="M14 20l5 5 8-9" {...p} />
      </>
    ),
    ltv: (
      <>
        <path d="M6 28a14 14 0 0 1 28 0" {...p} />
        <path d="M20 28l8-10" {...p} />
        <rect x="17" y="25" width="6" height="6" fill={color} />
      </>
    ),
    closed: <path d="M26 6a14 14 0 1 0 8 22A11 11 0 0 1 26 6z" {...p} />,
    bell: (
      <>
        <path d="M10 28h20l-3-5V16a7 7 0 0 0-14 0v7z" {...p} />
        <path d="M17 32h6" {...p} />
      </>
    ),
    wallet: (
      <>
        <rect x="6" y="11" width="28" height="20" {...p} />
        <path d="M26 21h8" {...p} />
      </>
    ),
    chain: (
      <>
        <rect x="5" y="15" width="14" height="10" {...p} />
        <rect x="21" y="15" width="14" height="10" {...p} />
      </>
    ),
    vault: (
      <>
        <rect x="6" y="6" width="28" height="28" {...p} />
        <circle cx="20" cy="20" r="6" {...p} />
      </>
    ),
    eye: (
      <>
        <path d="M4 20c4-7 10-11 16-11s12 4 16 11c-4 7-10 11-16 11S8 27 4 20z" {...p} />
        <circle cx="20" cy="20" r="4" fill={color} />
      </>
    ),
    stress: <path d="M6 10l8 8 6-4 14 16" {...p} />,
    check: <path d="M8 21l8 8 16-17" {...p} />,
  };
  return (
    <svg viewBox="0 0 40 40" style={s}>
      {g[kind] ?? <rect x="8" y="8" width="24" height="24" {...p} />}
    </svg>
  );
};

export const Tile: React.FC<{ children: React.ReactNode; size?: number; active?: boolean; light?: boolean; style?: React.CSSProperties }> = ({
  children,
  size = 104,
  active,
  light,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: light ? "#FFFFFF" : active ? "#0E2E22" : K.panel,
      border: `1.5px solid ${light ? "rgba(0,48,31,0.08)" : active ? "#2F6A4E" : K.edge}`,
      boxShadow: light ? "0 14px 30px rgba(0,48,31,0.12)" : "0 18px 40px rgba(0,0,0,0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Window chrome (dark or light) for rebuilt UI. */
export const Window: React.FC<{ width: number; title?: string; light?: boolean; children: React.ReactNode; style?: React.CSSProperties; right?: string }> = ({
  width,
  title,
  light,
  children,
  style,
  right,
}) => (
  <div
    style={{
      width,
      background: light ? "#FFFFFF" : "#081C15",
      border: `1.5px solid ${light ? "rgba(0,48,31,0.10)" : K.edge}`,
      borderRadius: 16,
      boxShadow: light ? "0 30px 70px rgba(0,48,31,0.16)" : "0 40px 90px rgba(0,0,0,0.55)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 18px", borderBottom: `1px solid ${light ? "rgba(0,48,31,0.08)" : K.edge}` }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 11, height: 11, borderRadius: 99, background: light ? "#D7E5DB" : "#2A4A3C" }} />
      ))}
      {title ? <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 17, color: light ? "#5B7A69" : K.dim }}>{title}</span> : null}
      {right ? <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 14, color: light ? "#5B7A69" : K.dim }}>{right}</span> : null}
    </div>
    {children}
  </div>
);

/** Big friendly pointer with click press. */
export const Cursor: React.FC<{ x: number; y: number; press?: number; color?: string; opacity?: number }> = ({ x, y, press = 0, color = "#0B0F0D", opacity = 1 }) => (
  <svg width={54} height={54} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: "10% 10%", opacity, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.25))", zIndex: 50 }}>
    <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill={color} stroke="#FFFFFF" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** Path along waypoints [t, x, y]; returns x,y,press (press peaks at click times). */
export const cursorPath = (t: number, pts: [number, number, number][], clicks: number[] = []) => {
  let x = pts[0][1];
  let y = pts[0][2];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, x0, y0] = pts[i];
    const [t1, x1, y1] = pts[i + 1];
    if (t >= t0) {
      const p = ez(t, t0, t1, IO);
      x = lerp(p, x0, x1);
      y = lerp(p, y0, y1);
    }
  }
  const press = clicks.reduce((m, c) => Math.max(m, 1 - Math.min(1, Math.abs(t - c) / 0.12)), 0);
  return { x, y, press };
};

/** Hand-drawn underline write-on. */
export const Underline: React.FC<{ width: number; at: number; color?: string; stroke?: number }> = ({ width, at, color = CL.lime, stroke = 6 }) => {
  const t = useT();
  const p = ez(t, at, at + 0.45);
  return (
    <svg width={width} height={28} viewBox={`0 0 ${width} 28`} style={{ display: "block", overflow: "visible" }}>
      <path d={`M4 16 C ${width * 0.3} 6, ${width * 0.6} 24, ${width - 4} 10`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

/** Scribbled annotation with arrow (caps, slightly rotated, writes on). */
export const Scribble: React.FC<{ lines: string[]; at: number; color?: string; size?: number; rotate?: number; arrow?: "left" | "up" }> = ({
  lines,
  at,
  color = K.ink,
  size = 26,
  rotate = -6,
  arrow = "left",
}) => {
  const t = useT();
  const a = ez(t, at, at + 0.35);
  return (
    <div style={{ transform: `rotate(${rotate}deg)`, display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={70} height={50} viewBox="0 0 70 50" style={{ overflow: "visible", transform: arrow === "up" ? "rotate(60deg)" : undefined }}>
        <path d="M66 30 C 46 34, 26 30, 10 18 M10 18 l 12 -2 M10 18 l 4 11" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - a} />
      </svg>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontStyle: "italic", fontSize: size, lineHeight: 1.1, letterSpacing: 0.5, color, textTransform: "uppercase" }}>
        {lines.map((l, i) => (
          <div key={l} style={{ clipPath: `inset(0 ${100 - 100 * ez(t, at + 0.2 + i * 0.25, at + 0.55 + i * 0.25, Easing.linear)}% 0 0)` }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Tinted plate that wipes up (Notion section change). */
export const Plate: React.FC<{ color: string; at?: number; children?: React.ReactNode }> = ({ color, at = 0, children }) => {
  const t = useT();
  const p = ez(t, at, at + 0.55, IO);
  return (
    <AbsoluteFill style={{ background: color, clipPath: `inset(${(1 - p) * 100}% 0 0 0 round 0)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Vertical slot-machine list with fading edges. */
export const SlotList: React.FC<{ items: string[]; at: number; speed?: number; size?: number; color?: string; activeColor?: string; visible?: number; stopAt?: number }> = ({
  items,
  at,
  speed = 3.2,
  size = 40,
  color = "#7A8F84",
  activeColor = K.ink,
  visible = 5,
  stopAt,
}) => {
  const t = useT();
  const rowH = size * 1.55;
  const tt = stopAt !== undefined ? Math.min(t, stopAt) : t;
  const pos = Math.max(0, (tt - at) * speed);
  const center = Math.floor(visible / 2);
  return (
    <div style={{ position: "relative", height: rowH * visible, width: 640, overflow: "hidden", WebkitMaskImage: "linear-gradient(transparent, #000 25%, #000 75%, transparent)", maskImage: "linear-gradient(transparent, #000 25%, #000 75%, transparent)" }}>
      {items.map((it, i) => {
        const y = (i - pos + center) * rowH;
        const d = Math.abs(i - pos);
        return (
          <div key={it + i} style={{ position: "absolute", top: y, left: 0, height: rowH, display: "flex", alignItems: "center", gap: 18, fontFamily: SANS, fontWeight: 500, fontSize: size, color: d < 0.5 ? activeColor : color }}>
            <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: 6, background: d < 0.5 ? CL.lime : "#C9D6CE" }} />
            {it}
          </div>
        );
      })}
    </div>
  );
};

/** Agent-style checklist with timer. */
export const Checklist: React.FC<{ items: string[]; at: number; step?: number; timerLabel?: string; light?: boolean; size?: number }> = ({ items, at, step = 0.55, timerLabel = "Watching for", light = true, size = 30 }) => {
  const t = useT();
  const secs = Math.max(0, Math.floor((t - at) * 3));
  const c = light ? K.ink : K.text;
  return (
    <div style={{ fontFamily: SANS, fontSize: size, color: c }}>
      <div style={{ color: light ? "#6E8578" : K.dim, fontSize: size * 0.85, marginBottom: size * 0.6 }}>
        {timerLabel} {secs}s
      </div>
      {items.map((it, i) => {
        const p = ez(t, at + 0.3 + i * step, at + 0.6 + i * step);
        const done = t > at + 0.3 + (i + 1) * step;
        return (
          <div key={it} style={{ display: "flex", alignItems: "center", gap: size * 0.5, marginBottom: size * 0.55, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
            <span style={{ width: size * 0.85, height: size * 0.85, borderRadius: 99, border: `2.5px solid ${done ? "#1E9B4F" : "#9DB3A6"}`, background: done ? "#1E9B4F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {done ? <Glyph kind="check" size={size * 0.6} color="#FFFFFF" /> : null}
            </span>
            {it}
          </div>
        );
      })}
    </div>
  );
};

/** macOS-style notification stack. */
export const Notifs: React.FC<{ items: { title: string; body: string; at: number }[]; width?: number; light?: boolean }> = ({ items, width = 560, light = false }) => {
  const t = useT();
  const shown = items.filter((n) => t >= n.at - 0.05);
  return (
    <div style={{ position: "relative", width }}>
      {shown
        .slice()
        .reverse()
        .map((n, i) => {
          const p = ez(t, n.at, n.at + 0.45);
          return (
            <div
              key={n.title + n.at}
              style={{
                width,
                marginBottom: 14,
                padding: "18px 22px",
                borderRadius: 22,
                background: light ? "rgba(255,255,255,0.9)" : "rgba(30,44,38,0.82)",
                border: `1px solid ${light ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}`,
                boxShadow: "0 20px 44px rgba(0,0,0,0.35)",
                backdropFilter: "blur(14px)",
                opacity: p,
                transform: `translateY(${(1 - p) * -40}px) scale(${0.96 + 0.04 * p})`,
                display: "flex",
                gap: 16,
                alignItems: "center",
                zIndex: 10 - i,
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 12, background: K.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Mascot cell={3} shadow={false} />
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: light ? "#111" : "#F2F7F4" }}>{n.title}</div>
                <div style={{ fontFamily: SANS, fontSize: 20, color: light ? "#444" : "#C9D6CE", marginTop: 3 }}>{n.body}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

/** Blocky pixel dissolve: reveals `children` over a cover colour. */
export const PixelDissolve: React.FC<{ at: number; dur?: number; cols?: number; color: string; w?: number; h?: number }> = ({ at, dur = 0.6, cols = 32, color, w = 1920, h = 1080 }) => {
  const t = useT();
  const rows = Math.round((cols * h) / w);
  const cw = w / cols;
  const ch = h / rows;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const th = random(`pd${r}-${c}`) * 0.7 + (c / cols) * 0.3;
      const gone = ez(t, at + th * dur, at + th * dur + 0.02, Easing.linear);
      if (gone < 1) cells.push(<rect key={`${r}-${c}`} x={c * cw} y={r * ch} width={cw + 0.5} height={ch + 0.5} fill={color} />);
    }
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">
      {cells}
    </svg>
  );
};

/** Lime halftone texture plate (Conqueror's dither look, in brand colours). */
export const Halftone: React.FC<{ drift?: number }> = ({ drift = 0 }) => (
  <AbsoluteFill style={{ background: "#0F3A28" }}>
    <AbsoluteFill
      style={{
        backgroundImage: "radial-gradient(rgba(164,255,43,0.55) 2.2px, transparent 2.6px)",
        backgroundSize: "11px 11px",
        backgroundPosition: `${drift}px 0`,
        WebkitMaskImage: "linear-gradient(170deg, #000 0%, rgba(0,0,0,0.25) 55%, #000 100%)",
        maskImage: "linear-gradient(170deg, #000 0%, rgba(0,0,0,0.25) 55%, #000 100%)",
      }}
    />
  </AbsoluteFill>
);

/** Corner crop marks around a box. */
export const Corners: React.FC<{ x: number; y: number; w: number; h: number; color?: string; opacity?: number }> = ({ x, y, w, h, color = K.text, opacity = 1 }) => (
  <>
    {[
      [x, y],
      [x + w, y],
      [x, y + h],
      [x + w, y + h],
    ].map(([cx, cy], i) => (
      <div key={i} style={{ position: "absolute", left: cx - 4, top: cy - 4, width: 8, height: 8, background: color, opacity }} />
    ))}
  </>
);

/** Logo end card. */
export const LogoEnd: React.FC<{ light?: boolean; at?: number; line?: string }> = ({ light, at = 0.1, line }) => {
  const t = useT();
  const p = ez(t, at, at + 0.5);
  const w = ez(t, at + 0.35, at + 0.9, IO);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", background: light ? K.paper : "transparent" }}>
      <div style={{ display: "flex", alignItems: "center", gap: lerp(w, 0, 30) }}>
        <div style={{ transform: `scale(${0.7 + 0.3 * p})`, opacity: p }}>
          <Mascot cell={10} />
        </div>
        <div style={{ overflow: "hidden", width: lerp(w, 0, 640) }}>
          <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 76, letterSpacing: 2, color: light ? K.ink : K.text, transform: `translateX(${(1 - w) * -120}px)`, whiteSpace: "nowrap" }}>COLLATERA</div>
        </div>
      </div>
      {line ? (
        <div style={{ marginTop: 26, fontFamily: MONO, fontSize: 24, color: light ? "#4C6E5C" : K.dim, opacity: ez(t, at + 0.8, at + 1.1) }}>{line}</div>
      ) : null}
    </AbsoluteFill>
  );
};

export type SceneDef = { id: string; from: number; to: number; in?: number; out?: number };

/** Film runner: scenes from a timeline + mix.wav. */
export const Film: React.FC<{ scenes: SceneDef[]; map: Record<string, React.FC>; audio: string; bg?: string; glow?: boolean }> = ({ scenes, map, audio, bg = K.bg, glow = true }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: bg }}>
      {glow ? <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #0A2A1E 0%, ${bg} 70%)` }} /> : null}
      <Stage>
        {scenes.map((s) => {
          const S = map[s.id];
          const from = Math.round(s.from * fps);
          const dur = Math.round(s.to * fps) - from;
          return (
            <Sequence key={s.id} name={s.id} from={from} durationInFrames={dur} premountFor={fps}>
              <Scene len={s.to - s.from} inDur={s.in ?? 0.3} outDur={s.out ?? 0.28}>
                <S />
              </Scene>
            </Sequence>
          );
        })}
      </Stage>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};
