import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, Sequence, staticFile, useVideoConfig } from "remotion";
import { ez, Scene, useT } from "../CollateraCampaign/kit";

/**
 * QUANTORA LABS vertical kit (design canvas 1080×1920, 60 fps).
 * Brand system from the supplied banner: warm paper with fibre, ink black,
 * Newsreader serif with one italic word, wide-tracked Jost wordmark, spaced
 * mono labels, fine annotated charts (RISK / CONTEXT / EVIDENCE).
 * Motion stays inside the locked whatships vocabulary.
 */
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-300-normal.woff2"), weight: "300" });

export const Q = { paper: "#ECE8DF", deep: "#E2DDD2", ink: "#161514", soft: "#55524C", faint: "#8F8A80", grid: "rgba(22,21,20,0.14)" };
export const SERIF = "Newsreader, Georgia, serif";
export const WORD = "Jost, Inter, sans-serif";
export const QMONO = "'JetBrains Mono', monospace";
export const VW = 1080;
export const VH = 1920;

/** Warm paper with fibre texture and a faint dotted grid. */
export const Paper: React.FC<{ seed?: number; dots?: boolean }> = ({ seed = 3, dots = true }) => (
  <AbsoluteFill style={{ background: Q.paper }}>
    <svg width={VW} height={VH} style={{ position: "absolute", inset: 0 }}>
      <filter id={`qp-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={seed} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 0.45 -0.1" />
      </filter>
      <rect width={VW} height={VH} filter={`url(#qp-${seed})`} opacity={0.45} />
    </svg>
    {dots ? <AbsoluteFill style={{ backgroundImage: `radial-gradient(${Q.grid} 1.3px, transparent 1.5px)`, backgroundSize: "36px 36px" }} /> : null}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, rgba(255,253,247,0.35) 0%, transparent 60%, rgba(120,110,95,0.10) 100%)" }} />
  </AbsoluteFill>
);

export const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 20, color = Q.ink, style }) => (
  <div style={{ fontFamily: QMONO, fontSize: size, letterSpacing: size * 0.38, color, lineHeight: 1.6, textTransform: "uppercase", ...style }}>{children}</div>
);

export const Mark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => <Img src={staticFile("quantora/img/mark.png")} style={{ width: size, height: size, ...style }} />;

export const Lockup: React.FC<{ size?: number; tagline?: boolean; p?: number }> = ({ size = 1, tagline = true, p = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 26 * size }}>
    <Mark size={110 * size} style={{ opacity: p, transform: `scale(${0.8 + 0.2 * p})` }} />
    <div>
      <div style={{ fontFamily: WORD, fontWeight: 400, fontSize: 64 * size, letterSpacing: 64 * size * 0.18, color: Q.ink, lineHeight: 1, opacity: p }}>QUANTORA</div>
      {tagline ? (
        <Mono size={14 * size} style={{ marginTop: 12 * size, letterSpacing: 14 * size * 0.5, opacity: p }}>
          The market, read clearly.
        </Mono>
      ) : null}
    </div>
  </div>
);

/** Serif headline with italic accent: parts = [["The market,", false], ["read clearly.", true]]. */
export const Head: React.FC<{ parts: [string, boolean][]; size: number; center?: boolean; color?: string }> = ({ parts, size, center, color = Q.ink }) => (
  <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.02, color, textAlign: center ? "center" : "left" }}>
    {parts.map(([s, it], i) => (
      <div key={i} style={{ fontStyle: it ? "italic" : "normal", fontWeight: it ? 400 : 500 }}>
        {s}
      </div>
    ))}
  </div>
);

/** The banner chart: fine line, dotted guides with spaced mono labels. Draws on with `draw` (0–1). */
export const CHART_PTS: [number, number][] = [
  [0, 0.55], [0.06, 0.5], [0.11, 0.56], [0.16, 0.45], [0.23, 0.22], [0.28, 0.34], [0.34, 0.5], [0.41, 0.66], [0.47, 0.76], [0.52, 0.72], [0.58, 0.58], [0.64, 0.5], [0.7, 0.46], [0.76, 0.3], [0.82, 0.18], [0.86, 0.26], [0.92, 0.14], [1, 0.02],
];
export const MARKS = [
  { i: 4, label: "RISK" },
  { i: 8, label: "CONTEXT" },
  { i: 14, label: "EVIDENCE" },
];
export const chartXY = (w: number, h: number, i: number) => [CHART_PTS[i][0] * w, 40 + CHART_PTS[i][1] * (h - 80)] as const;

export const Chart: React.FC<{ w: number; h: number; draw?: number; marks?: number; labels?: boolean; stroke?: number; fill?: number; fillFrom?: number }> = ({
  w,
  h,
  draw = 1,
  marks = 1,
  labels = true,
  stroke = 2.4,
  fill = 0,
  fillFrom = 0.6,
}) => {
  const d = CHART_PTS.map(([x, y], i) => `${i ? "L" : "M"}${(x * w).toFixed(1)} ${(40 + y * (h - 80)).toFixed(1)}`).join(" ");
  const fx = fillFrom * w;
  const fillPts = CHART_PTS.filter(([x]) => x >= fillFrom)
    .map(([x, y]) => `${(x * w).toFixed(1)},${(40 + y * (h - 80)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={w} height={h + 40} style={{ overflow: "visible" }}>
      <line x1={0} x2={w} y1={h} y2={h} stroke={Q.ink} strokeWidth={1.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={(i * w) / 8} x2={(i * w) / 8} y1={h} y2={h + 10} stroke={Q.ink} strokeWidth={1.2} />
      ))}
      {fill > 0 ? <polygon points={`${fx},${h} ${fillPts} ${w},${h}`} fill={Q.ink} opacity={0.08 * fill} /> : null}
      {MARKS.map((m, k) => {
        const p = Math.max(0, Math.min(1, marks * 3 - k));
        const [x, y] = chartXY(w, h, m.i);
        return (
          <g key={m.label} opacity={p}>
            <line x1={x} x2={x} y1={0} y2={h} stroke={Q.ink} strokeWidth={1.2} strokeDasharray="2 6" opacity={0.5} />
            <circle cx={x} cy={y} r={7} fill={Q.ink} />
            {labels ? (
              <text x={x} y={-14} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={17} letterSpacing={6} fill={Q.ink}>
                {m.label}
              </text>
            ) : null}
          </g>
        );
      })}
      <path d={d} fill="none" stroke={Q.ink} strokeWidth={stroke} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    </svg>
  );
};

/** Thin-bordered mono chip. */
export const Chip: React.FC<{ text: string; dark?: boolean; size?: number; style?: React.CSSProperties }> = ({ text, dark, size = 20, style }) => (
  <div style={{ display: "inline-block", padding: `${size * 0.5}px ${size * 0.9}px`, border: `1.5px solid ${Q.ink}`, background: dark ? Q.ink : "rgba(255,253,247,0.55)", ...style }}>
    <Mono size={size} color={dark ? Q.paper : Q.ink}>
      {text}
    </Mono>
  </div>
);

/** Corner crop guides like the banner. */
export const Guides: React.FC = () => (
  <svg width={VW} height={VH} style={{ position: "absolute", inset: 0 }}>
    <g stroke="rgba(22,21,20,0.3)" strokeWidth={1.2}>
      <line x1={60} y1={0} x2={60} y2={120} />
      <line x1={0} y1={60} x2={120} y2={60} />
      <line x1={VW - 60} y1={VH - 120} x2={VW - 60} y2={VH} />
      <line x1={VW - 120} y1={VH - 60} x2={VW} y2={VH - 60} />
    </g>
  </svg>
);

export type VScene = { id: string; from: number; to: number; in?: number; out?: number };

/** Vertical film runner: scenes on a 1080×1920 canvas + mix.wav. */
export const VFilm: React.FC<{ scenes: VScene[]; map: Record<string, React.FC>; audio: string; bg?: string }> = ({ scenes, map, audio, bg = Q.paper }) => {
  const { fps, width, height } = useVideoConfig();
  const s = Math.min(width / VW, height / VH);
  return (
    <AbsoluteFill style={{ background: bg, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: VW, height: VH, flexShrink: 0, overflow: "hidden", transform: `scale(${s})` }}>
        {scenes.map((sc) => {
          const S = map[sc.id];
          const from = Math.round(sc.from * fps);
          const dur = Math.round(sc.to * fps) - from;
          return (
            <Sequence key={sc.id} name={sc.id} from={from} durationInFrames={dur} premountFor={fps}>
              <Scene len={sc.to - sc.from} inDur={sc.in ?? 0.3} outDur={sc.out ?? 0.28}>
                <S />
              </Scene>
            </Sequence>
          );
        })}
      </div>
      <Audio src={staticFile(audio)} />
    </AbsoluteFill>
  );
};

/** End lockup + typed URL. */
export const QEnd: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const t = useT();
  const url = "quantora.buzz";
  const n = Math.max(0, Math.min(url.length, Math.floor((t - at - 0.6) * 16)));
  return (
    <AbsoluteFill>
      <Paper seed={9} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 60 }}>
        <Lockup size={1.1} p={ez(t, at, at + 0.5)} />
        <Mono size={26} style={{ letterSpacing: 6 }}>
          {url.slice(0, n)}
          <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }}>▍</span>
        </Mono>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
