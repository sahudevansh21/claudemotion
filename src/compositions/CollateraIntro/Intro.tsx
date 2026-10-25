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
import TL from "./intro.json";

/**
 * COLLATERA: "Introducing Collatera" (content plan V1, Day 1).
 * 25 s · 1920×1080 · 60 fps. Recreates the locked Supabase Middleware
 * reference (docs/reference/whatships/ANALYSIS.md §5) shot for shot with
 * Collatera's brand. Allowed vocabulary only: letter blur-in, title morph,
 * word swap + icon reel, burst to constellation, staggered card grid,
 * 3D-tilted panel with annotation pills, type-on window, end terminal.
 * All terminal values are the site's SIMULATED demo data.
 */

const BG = "#04150F";
const TEXT = "#EAF7EE";
const DIM = "#7FA591";
const PANEL = "#0A2219";
const EDGE = "#1E3D30";
const SANS = "Inter, sans-serif";
const MONO = CL_FONTS.mono;
const PIX = CL_FONTS.pixel;

const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ez = (t: number, a: number, b: number, e = OUT) => interpolate(t, [a, b], [0, 1], { ...C, easing: e });
const lerp = (p: number, a: number, b: number) => a + (b - a) * p;

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/** Scene wrapper: blur-in at start, blur-out at end (reference cross-blur). */
const Scene: React.FC<{ len: number; children: React.ReactNode; inDur?: number; outDur?: number }> = ({
  len,
  children,
  inDur = 0.3,
  outDur = 0.28,
}) => {
  const t = useT();
  const i = ez(t, 0, inDur);
  const o = ez(t, len - outDur, len, Easing.in(Easing.quad));
  const k = Math.max(1 - i, o);
  return (
    <AbsoluteFill style={{ opacity: Math.min(i, 1 - o), filter: k > 0.001 ? `blur(${k * 16}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

/** Letter-by-letter blur-in (≈35 ms per glyph), the reference's signature. */
const Letters: React.FC<{ text: string; at: number; step?: number; dur?: number; style?: React.CSSProperties }> = ({
  text,
  at,
  step = 0.035,
  dur = 0.4,
  style,
}) => {
  const t = useT();
  return (
    <span style={{ whiteSpace: "pre", display: "inline-block", ...style }}>
      {Array.from(text).map((ch, i) => {
        const p = ez(t, at + i * step, at + i * step + dur);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
              transform: `translateY(${(1 - p) * 10}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </span>
  );
};

/* ── glyphs for icon tiles ── */
const Glyph: React.FC<{ kind: string; size?: number; color?: string }> = ({ kind, size = 44, color = CL.lime }) => {
  const s = { width: size, height: size };
  const p = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinecap: "square" as const };
  switch (kind) {
    case "price":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M8 6v28M20 10v22M32 4v26" {...p} />
          <rect x="5" y="14" width="6" height="12" fill={color} />
          <rect x="17" y="16" width="6" height="8" fill={color} />
          <rect x="29" y="8" width="6" height="12" fill={color} />
        </svg>
      );
    case "oracle":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <circle cx="20" cy="20" r="14" {...p} />
          <path d="M20 11v10l7 4" {...p} />
        </svg>
      );
    case "buffer":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M20 4l13 5v10c0 9-6 14-13 17C13 33 7 28 7 19V9z" {...p} />
          <path d="M14 20l5 5 8-9" {...p} />
        </svg>
      );
    case "ltv":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M6 28a14 14 0 0 1 28 0" {...p} />
          <path d="M20 28l8-10" {...p} />
          <rect x="17" y="25" width="6" height="6" fill={color} />
        </svg>
      );
    case "closed":
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <path d="M26 6a14 14 0 1 0 8 22A11 11 0 0 1 26 6z" {...p} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" style={s}>
          <rect x="8" y="8" width="24" height="24" {...p} />
        </svg>
      );
  }
};

const Tile: React.FC<{ children: React.ReactNode; size?: number; active?: boolean; style?: React.CSSProperties }> = ({
  children,
  size = 104,
  active,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.24,
      background: active ? "#0E2E22" : PANEL,
      border: `1.5px solid ${active ? "#2F6A4E" : EDGE}`,
      boxShadow: "0 18px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small terminal window used in S2 (flat) and S6 (tilted). */
const ROWS: [string, string, string?][] = [
  ["tQQQ / USDCa", "483.79  ▲ 3.11%"],
  ["liquidation", "412.50"],
  ["buffer", "14.7%"],
  ["oracle_age", "89 min", "● ORACLE STALE"],
  ["ltv", "39.8%"],
];
const Terminal: React.FC<{ width: number; hiAt: number; t: number; pills?: { row: number; text: string; at: number }[] }> = ({
  width,
  hiAt,
  t,
  pills = [],
}) => {
  const hi = ez(t, hiAt, hiAt + 0.35);
  const fs = width / 34;
  return (
    <div
      style={{
        width,
        background: "#081C15",
        border: `1.5px solid ${EDGE}`,
        borderRadius: 14,
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        fontFamily: MONO,
        fontSize: fs,
        color: TEXT,
        overflow: "visible",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: `${fs * 0.7}px ${fs}px`, borderBottom: `1px solid ${EDGE}` }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: fs * 0.45, height: fs * 0.45, borderRadius: 99, background: "#2A4A3C" }} />
        ))}
        <span style={{ marginLeft: fs * 0.6, fontSize: fs * 0.62, color: DIM }}>collatera://terminal</span>
        <span style={{ marginLeft: "auto", fontSize: fs * 0.55, color: DIM }}>SIMULATED DATA</span>
      </div>
      <div style={{ padding: `${fs * 0.6}px 0` }}>
        {ROWS.map(([k, v, flag], i) => {
          const isHi = i >= 2;
          return (
            <div key={k} style={{ position: "relative", display: "flex", padding: `${fs * 0.28}px ${fs}px`, gap: fs }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(117,255,0,0.10)",
                  borderLeft: `3px solid ${CL.lime}`,
                  opacity: isHi ? hi : 0,
                }}
              />
              <span style={{ position: "relative", color: i === 0 ? CL.lime : DIM, width: fs * 8 }}>{k}</span>
              <span style={{ position: "relative" }}>{v}</span>
              {flag ? <span style={{ position: "relative", marginLeft: "auto", color: CL.lime, fontSize: fs * 0.7 }}>{flag}</span> : null}
              {pills
                .filter((p) => p.row === i)
                .map((p) => {
                  const q = ez(t, p.at, p.at + 0.35);
                  return (
                    <span
                      key={p.text}
                      style={{
                        position: "absolute",
                        left: fs * 15,
                        top: "50%",
                        transform: `translateY(-50%) scale(${0.8 + 0.2 * q})`,
                        transformOrigin: "left center",
                        opacity: q,
                        fontSize: fs * 0.62,
                        padding: `${fs * 0.15}px ${fs * 0.45}px`,
                        borderRadius: 99,
                        border: `1.5px solid ${CL.lime}`,
                        color: CL.lime,
                        background: "#0B2A1D",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.text}
                    </span>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div style={{ padding: `${fs * 0.4}px ${fs}px ${fs * 0.8}px`, fontSize: fs * 0.58, color: DIM }}>
        {"// simulated data for illustration · not a live feed"}
      </div>
    </div>
  );
};

/* ───────────── S1: Introducing → Collatera ───────────── */
const S1: React.FC = () => {
  const t = useT();
  const m = ez(t, 1.0, 1.6, IO);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: lerp(m, 104, 44),
          color: lerp(m, 1, 0) > 0.5 ? TEXT : "#BFD6C8",
          letterSpacing: -1.5,
          transform: `translateY(${lerp(m, 0, -40)}px)`,
        }}
      >
        <Letters text="Introducing" at={0.05} />
      </div>
      <div style={{ height: lerp(m, 0, 20) }} />
      <div style={{ display: "flex", alignItems: "center", gap: 32, opacity: ez(t, 1.15, 1.4), height: lerp(m, 0, 150), overflow: "visible" }}>
        <div style={{ transform: `scale(${ez(t, 1.2, 1.7)})` }}>
          <Mascot cell={11} cellProgress={(i) => ez(t, 1.15 + i * 0.006, 1.6 + i * 0.006)} scatter={60} />
        </div>
        <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: 112, color: TEXT, letterSpacing: 2 }}>
          <Letters text="COLLATERA" at={1.2} step={0.045} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S2: title left + terminal slides in ───────────── */
const S2: React.FC = () => {
  const t = useT();
  const p = ez(t, 0.0, 0.7, IO);
  const w = ez(t, 0.15, 0.85);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: lerp(p, 560, 110), top: lerp(p, 470, 500), display: "flex", alignItems: "center", gap: 22 }}>
        <Mascot cell={lerp(p, 11, 6)} />
        <div style={{ fontFamily: PIX, fontWeight: 700, fontSize: lerp(p, 112, 54), color: TEXT, letterSpacing: 2, whiteSpace: "nowrap" }}>COLLATERA</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 860,
          top: 300,
          opacity: w,
          filter: w < 1 ? `blur(${(1 - w) * 14}px)` : undefined,
          transform: `translateX(${(1 - w) * 220}px)`,
        }}
      >
        <Terminal width={950} hiAt={0.75} t={t} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S3: "Watch the [price → oracle → buffer → LTV]" + icon reel ───────────── */
const WORDS = ["price", "oracle", "buffer", "LTV"];
const S3: React.FC = () => {
  const t = useT();
  const base = TL.scenes.find((s) => s.id === "watch")!.from;
  const sw = TL.swaps.map((s) => s - base);
  let idx = 0;
  sw.forEach((s, i) => {
    if (t >= s) idx = i;
  });
  const roll = sw.reduce((acc, s) => acc + ez(t, s - 0.05, s + 0.35, IO), 0) - 1;
  const lineIn = ez(t, 0, 0.5);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 470, fontFamily: SANS, fontWeight: 500, fontSize: 84, letterSpacing: -2, color: TEXT, display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ opacity: lineIn, filter: lineIn < 1 ? `blur(${(1 - lineIn) * 10}px)` : undefined }}>Watch the</span>
        <span style={{ position: "relative", display: "inline-block", minWidth: 340 }}>
          {WORDS.map((w, i) => {
            const a = ez(t, sw[i] - 0.05, sw[i] + 0.3);
            const b = i < WORDS.length - 1 ? ez(t, sw[i + 1] - 0.12, sw[i + 1] + 0.1) : 0;
            const v = a * (1 - b);
            return (
              <span
                key={w}
                style={{
                  position: i === 0 ? "relative" : "absolute",
                  left: 0,
                  top: 0,
                  color: CL.lime,
                  opacity: v,
                  filter: v < 1 ? `blur(${(1 - v) * 12}px)` : undefined,
                  transform: `translateY(${(1 - a) * 18 - b * 10}px)`,
                }}
              >
                {w}.
              </span>
            );
          })}
        </span>
      </div>
      {/* vertical icon reel */}
      <div style={{ position: "absolute", left: 1560, top: 540 - 52 }}>
        {WORDS.map((w, i) => {
          const off = i - Math.max(0, roll);
          const y = off * 150;
          const d = Math.abs(off);
          return (
            <div
              key={w}
              style={{
                position: "absolute",
                top: y,
                left: 0,
                opacity: Math.max(0, 1 - d * 0.55) * lineIn,
                transform: `scale(${1 - Math.min(1, d) * 0.28}) perspective(800px) rotateX(${-off * 22}deg)`,
                filter: d > 0.05 ? `blur(${Math.min(1, d) * 2}px)` : undefined,
              }}
            >
              <Tile active={d < 0.5}>
                <Glyph kind={w.toLowerCase()} size={50} color={d < 0.5 ? CL.lime : DIM} />
              </Tile>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 122, top: 600, fontFamily: MONO, fontSize: 26, color: DIM, opacity: ez(t, 0.4, 0.8) }}>
        {idx >= 0 ? "for tokenized stocks & ETFs, side by side" : ""}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S4: "Watch all of it" → icons burst into a constellation ───────────── */
const BURST = ["price", "oracle", "buffer", "ltv", "closed", "tQQQ", "tSPY", "tAAPL", "tNVDA", "tTSLA"];
const S4: React.FC = () => {
  const t = useT();
  const b = ez(t, 0.05, 0.9);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: 440, fontFamily: SANS, fontWeight: 500, fontSize: 84, letterSpacing: -2, color: TEXT, lineHeight: 1.12 }}>
        <div>Watch every signal</div>
        <div style={{ color: CL.lime }}>
          <Letters text="behind your loan." at={0.1} step={0.03} />
        </div>
      </div>
      {BURST.map((k, i) => {
        const ang = (i / BURST.length) * Math.PI * 2 + random(`ba${i}`) * 0.5;
        const R = 330 + random(`br${i}`) * 170;
        const cx = 1430 + Math.cos(ang) * R * 0.9;
        const cy = 540 + Math.sin(ang) * R * 0.85;
        const x = lerp(b, 1560, cx);
        const y = lerp(b, 540, cy);
        const drift = Math.sin(t * 1.3 + i) * 6;
        const isTicker = k.startsWith("t");
        const sz = isTicker ? 0 : 88 + random(`bs${i}`) * 26;
        return (
          <div key={k} style={{ position: "absolute", left: x - (isTicker ? 70 : sz / 2), top: y - (isTicker ? 26 : sz / 2) + drift, opacity: Math.min(1, b * 1.5) }}>
            {isTicker ? (
              <div style={{ padding: "12px 20px", borderRadius: 14, background: PANEL, border: `1.5px solid ${EDGE}`, fontFamily: MONO, fontSize: 24, color: TEXT, boxShadow: "0 16px 34px rgba(0,0,0,0.45)" }}>
                <span style={{ color: CL.lime }}>{k}</span>
              </div>
            ) : (
              <Tile size={sz}>
                <Glyph kind={k} size={sz * 0.46} />
              </Tile>
            )}
          </div>
        );
      })}
      {Array.from({ length: 22 }, (_, i) => {
        const ang = random(`da${i}`) * Math.PI * 2;
        const R = 200 + random(`dr${i}`) * 420;
        return (
          <div
            key={`d${i}`}
            style={{
              position: "absolute",
              left: lerp(b, 1560, 1430 + Math.cos(ang) * R * 0.9),
              top: lerp(b, 540, 540 + Math.sin(ang) * R * 0.85),
              width: 8,
              height: 8,
              borderRadius: 2,
              background: i % 3 ? "#1E3D30" : CL.lime,
              opacity: b * 0.8,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── S5: 3×3 signal grid ───────────── */
const GRID = [
  ["Collateral health", "distance to liquidation"],
  ["Freshness checks", "stale oracle prices"],
  ["Liquidity risk", "thinner order books"],
  ["Buffer", "ctx · 14.7% (sim)"],
  ["Oracle age", "last update · 89 min (sim)"],
  ["LTV", "borrowed vs posted"],
  ["Closed markets", "exchange hours"],
  ["Overnight gaps", "open vs close"],
  ["Issuer events", "corporate actions"],
];
const HI = [1, 4, 6];
const S5: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 150, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 72, letterSpacing: -1.5, color: TEXT }}>
        <Letters text="Know what backs your position" at={0.05} step={0.018} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 330, display: "grid", gridTemplateColumns: "repeat(3, 480px)", gap: 20 }}>
        {GRID.map(([h, d], i) => {
          const q = ez(t, 0.25 + i * 0.07, 0.6 + i * 0.07);
          const lit = ez(t, 1.6 + HI.indexOf(i) * 0.12, 1.9 + HI.indexOf(i) * 0.12);
          const isHi = HI.includes(i);
          const dim = isHi ? 1 : 1 - 0.55 * ez(t, 1.6, 2.0);
          return (
            <div
              key={h}
              style={{
                height: 150,
                padding: "26px 28px",
                boxSizing: "border-box",
                borderRadius: 14,
                background: isHi ? `rgba(117,255,0,${0.06 * lit})` : PANEL,
                border: `1.5px solid ${isHi && lit > 0.5 ? "#3E7A3A" : EDGE}`,
                opacity: q * dim,
                filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined,
                transform: `translateY(${(1 - q) * 16}px)`,
                backgroundColor: PANEL,
                boxShadow: isHi && lit > 0.5 ? "0 0 0 1px rgba(117,255,0,0.15)" : undefined,
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 28, color: isHi && lit > 0.5 ? CL.lime : TEXT }}>{h}</div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: DIM, marginTop: 12 }}>{d}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S6: tilted terminal with annotation pills ───────────── */
const S6: React.FC = () => {
  const t = useT();
  const cam = ez(t, 0, 3.4, IO);
  const inP = ez(t, 0, 0.7, IO);
  return (
    <AbsoluteFill style={{ perspective: 2000, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 560,
          transform: `translate(-50%, -50%) translate(${lerp(cam, 160, -120)}px, ${lerp(cam, 80, -40)}px) rotateX(${lerp(inP, 46, 26)}deg) rotateZ(${lerp(cam, -12, -7)}deg) rotateY(${lerp(cam, 8, -4)}deg) scale(${lerp(inP, 0.8, 1.05) + cam * 0.12})`,
        }}
      >
        <Terminal
          width={1500}
          hiAt={0.4}
          t={t}
          pills={[
            { row: 2, text: "distance to liquidation", at: 0.9 },
            { row: 3, text: "price is 89 min old", at: 1.2 },
            { row: 4, text: "borrowed vs collateral", at: 1.5 },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S7a: "Read-only by design" ───────────── */
const S7a: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 96, letterSpacing: -2.5, color: TEXT }}>
      <Letters text="Read-only by design" at={0.05} step={0.03} />
    </div>
  </AbsoluteFill>
);

/* ───────────── S7b: type-on window ───────────── */
const LINES = [
  { t: "> watch DEMO 1", c: TEXT },
  { t: "  reading public data ......... ok", c: DIM },
  { t: "  keys requested .............. none", c: DIM },
  { t: "  signatures requested ........ none", c: DIM },
  { t: "  funds moved ................. none", c: DIM },
];
const S7b: React.FC = () => {
  const t = useT();
  const cps = 84;
  const start = 0.15;
  const total = Math.max(0, (t - start) * cps);
  let used = 0;
  const shown = LINES.map((l) => {
    const n = Math.max(0, Math.min(l.t.length, Math.floor(total - used)));
    used += l.t.length + 4;
    return { ...l, s: l.t.slice(0, n), done: n >= l.t.length, started: n > 0 };
  });
  const cur = shown.findIndex((l) => !l.done);
  const blink = Math.floor(t * 2.4) % 2 === 0;
  const box = ez(t, 0, 0.4);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          width: 1180,
          minHeight: 400,
          background: "#081C15",
          border: `1.5px solid ${EDGE}`,
          borderRadius: 14,
          boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
          opacity: box,
          transform: `scale(${0.96 + 0.04 * box})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 22px", borderBottom: `1px solid ${EDGE}` }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: 99, background: "#2A4A3C" }} />
          ))}
          <span style={{ marginLeft: 14, fontFamily: MONO, fontSize: 18, color: DIM }}>collatera.buzz/app</span>
        </div>
        <div style={{ padding: "26px 30px", fontFamily: MONO, fontSize: 30, lineHeight: 1.65 }}>
          {shown.map((l, i) =>
            l.started || i === 0 ? (
              <div key={i} style={{ color: l.c, whiteSpace: "pre" }}>
                {l.s.replace(/(ok|none)$/, "")}
                {/(ok|none)$/.test(l.s) ? <span style={{ color: CL.lime }}>{l.s.match(/(ok|none)$/)![0]}</span> : null}
                {i === (cur === -1 ? LINES.length - 1 : cur) && blink ? <span style={{ background: CL.lime, color: CL.lime }}>▍</span> : null}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── S8: end terminal + "Try the demo" ───────────── */
const S8: React.FC = () => {
  const t = useT();
  const cmd = "open collatera.buzz/app";
  const n = Math.max(0, Math.min(cmd.length, Math.floor((t - 0.3) * 14)));
  const up = ez(t, 1.75, 2.3, IO);
  const blink = Math.floor(t * 2.4) % 2 === 0;
  const brand = ez(t, 2.3, 2.8);
  const fade = ez(t, 3.55, 4.0);
  return (
    <AbsoluteFill style={{ opacity: 1 - fade }}>
      <div style={{ position: "absolute", top: 380 - up * 40, width: 1920, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 92, letterSpacing: -2.5, color: TEXT }}>
        {t > 1.8 ? <Letters text="Try the demo" at={1.8} step={0.04} /> : null}
      </div>
      <div style={{ position: "absolute", left: 960 - 330, top: lerp(up, 500, 520), width: 660 }}>
        <div style={{ background: "#081C15", border: `1.5px solid ${EDGE}`, borderRadius: 12, boxShadow: "0 30px 70px rgba(0,0,0,0.5)", opacity: ez(t, 0, 0.3) }}>
          <div style={{ display: "flex", gap: 7, padding: "12px 16px", borderBottom: `1px solid ${EDGE}` }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 99, background: "#2A4A3C" }} />
            ))}
          </div>
          <div style={{ padding: "18px 22px", fontFamily: MONO, fontSize: 28, color: TEXT, whiteSpace: "pre" }}>
            <span style={{ color: CL.lime }}>$ </span>
            {cmd.slice(0, n)}
            {blink || n < cmd.length ? <span style={{ background: TEXT }}> </span> : null}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 1920, top: 760, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: brand }}>
        <Mascot cell={5} />
        <span style={{ fontFamily: PIX, fontWeight: 700, fontSize: 34, color: TEXT, letterSpacing: 2 }}>COLLATERA</span>
        <span style={{ fontFamily: MONO, fontSize: 22, color: DIM, marginLeft: 10 }}>read-only · no keys · no signatures</span>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC> = {
  introducing: S1,
  title: S2,
  watch: S3,
  burst: S4,
  grid: S5,
  tilt: S6,
  readonly: S7a,
  typing: S7b,
  end: S8,
};

export const CollateraIntro: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #0A2A1E 0%, ${BG} 70%)` }} />
      <Stage>
        {TL.scenes.map((s) => {
          const S = SCENES[s.id];
          const from = Math.round(s.from * fps);
          const dur = Math.round(s.to * fps) - from;
          const last = s.id === "end";
          return (
            <Sequence key={s.id} name={s.id} from={from} durationInFrames={dur} premountFor={fps}>
              <Scene len={s.to - s.from} inDur={s.id === "introducing" ? 0.01 : 0.3} outDur={last ? 0.01 : 0.28}>
                <S />
              </Scene>
            </Sequence>
          );
        })}
      </Stage>
      <Audio src={staticFile("collatera-intro/audio/mix.wav")} />
    </AbsoluteFill>
  );
};
