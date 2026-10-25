import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";
import { C, CL, DEPLOYMENTS, DISPLAY, ez, IO, MONO, OUT, SANS, VERDICTS } from "./brand";
import { Badge, Chip } from "./parts";
import tl from "./intro.json";

const sc = (id: string) => {
  const s = tl.scenes.find((x) => x.id === id);
  if (!s) throw new Error(id);
  return s;
};
const cu = (id: string, n: string) => (sc(id).cues as unknown as Record<string, number>)[n] ?? 0;
const len = (id: string) => sc(id).end - sc(id).start;

/** Flat background colour per idea, cross-faded (no wipes). */
const BG: [number, string][] = [[0, C.cream], [240, C.cream], [540, C.paper], [1080, C.blue], [1500, C.cream]];
const mixHex = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a); const [r2, g2, b2] = p(b);
  const h = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return `#${h(r1 + (r2 - r1) * t)}${h(g1 + (g2 - g1) * t)}${h(b1 + (b2 - b1) * t)}`;
};
const bgAt = (f: number) => {
  for (let i = 1; i < BG.length; i++) {
    const [t, col] = BG[i];
    if (f < t - 14) return BG[i - 1][1];
    if (f <= t + 14) return mixHex(BG[i - 1][1], col, interpolate(f, [t - 14, t + 14], [0, 1], CL));
  }
  return BG[BG.length - 1][1];
};

/** Words/phrases swapped in place: each blurs out as the next blurs in. */
const Swap: React.FC<{ items: React.ReactNode[]; at: number; each: number; style?: React.CSSProperties }> = ({ items, at, each, style }) => {
  const f = useCurrentFrame();
  return (
    <span style={{ display: "inline-grid", ...style }}>
      {items.map((it, i) => {
        const a = at + i * each;
        const last = i === items.length - 1;
        const inP = ez(f, a, 16);
        const outP = last ? 0 : ez(f, a + each - 6, 14, IO);
        const o = inP * (1 - outP);
        const blur = (1 - inP) * 14 + outP * 14;
        return (
          <span key={i} style={{ gridArea: "1 / 1", opacity: o, filter: `blur(${blur}px)`, transform: `translateY(${(1 - inP) * 18 - outP * 14}px)`, whiteSpace: "nowrap" }}>{it}</span>
        );
      })}
    </span>
  );
};

const Reveal: React.FC<{ children: React.ReactNode; at: number; style?: React.CSSProperties }> = ({ children, at, style }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 24);
  return <div style={{ opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `translateY(${(1 - p) * 26}px)`, ...style }}>{children}</div>;
};

const Cursor: React.FC<{ x: number; y: number; click?: number; color?: string }> = ({ x, y, click = 0, color = C.blue }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
    {click > 0 && <div style={{ position: "absolute", left: -40 * click - 4, top: -40 * click - 4, width: 80 * click + 8, height: 80 * click + 8, borderRadius: 999, border: `4px solid ${color}`, opacity: 1 - click }} />}
    <svg width={54} height={62} viewBox="0 0 27 31" style={{ position: "absolute", left: -3, top: -3, filter: "drop-shadow(0 6px 8px rgba(13,13,15,0.25))" }}>
      <path d="M3 2 L3 24 L9 18.5 L13 28 L17.5 26 L13.5 16.8 L22 16.5 Z" fill={color} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  </div>
);

/** Piecewise cursor path with easing between waypoints: [frame, x, y]. */
const path = (f: number, pts: [number, number, number][]) => {
  if (f <= pts[0][0]) return { x: pts[0][1], y: pts[0][2] };
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, xa, ya] = pts[i]; const [b, xb, yb] = pts[i + 1];
    if (f <= b) { const t = Easing.inOut(Easing.cubic)((f - a) / (b - a)); return { x: xa + (xb - xa) * t, y: ya + (yb - ya) * t }; }
  }
  const l = pts[pts.length - 1];
  return { x: l[1], y: l[2] };
};
const pulse = (f: number, at: number) => interpolate(f, [at, at + 18], [0.001, 1], CL) * (f >= at && f < at + 18 ? 1 : 0);

const Drift: React.FC<{ children: React.ReactNode; n: number; from?: number; to?: number }> = ({ children, n, from = 1, to = 1.035 }) => {
  const f = useCurrentFrame();
  const s = from + (to - from) * interpolate(f, [0, n], [0, 1], { ...CL, easing: IO });
  return <AbsoluteFill style={{ transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

const Halftone: React.FC<{ o?: number }> = ({ o = 0.5 }) => (
  <div style={{ position: "absolute", inset: 0, opacity: o, backgroundImage: `radial-gradient(${C.cyan} 38%, transparent 42%)`, backgroundSize: "22px 22px", WebkitMaskImage: "radial-gradient(ellipse 52% 55% at 50% 48%, #000 0%, transparent 100%)", maskImage: "radial-gradient(ellipse 52% 55% at 50% 48%, #000 0%, transparent 100%)" }} />
);

const Corners: React.FC<{ w: number; h: number; at: number }> = ({ w, h, at }) => {
  const f = useCurrentFrame();
  const p = ez(f, at, 20);
  const sq = { position: "absolute" as const, width: 12, height: 12, background: C.ink, opacity: p };
  return (
    <div style={{ position: "absolute", left: 960 - w / 2, top: 540 - h / 2, width: w, height: h }}>
      <div style={{ ...sq, left: 0, top: 0 }} /><div style={{ ...sq, right: 0, top: 0 }} /><div style={{ ...sq, left: 0, bottom: 0 }} /><div style={{ ...sq, right: 0, bottom: 0 }} />
    </div>
  );
};

/* ---- 1: Introducing Oryn for [word] ---- */
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["xTSLA", "oNVDA", "BUIDL", "USTB"];
  const cursor = ez(f, 160, 40);
  return (
    <Drift n={len("intro")}>
      <Halftone o={0.5} />
      <Corners w={1180} h={250} at={10} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 104, color: C.ink, letterSpacing: -1 }}>
        <Reveal at={6} style={{ display: "inline-block" }}>Introducing <span style={{ color: C.blue, fontFamily: DISPLAY, fontWeight: 400, letterSpacing: 2 }}>ORYN</span> for{" "}</Reveal>
        <Swap at={cu("intro", "swap")} each={cu("intro", "each")} items={words.map((w) => <span key={w} style={{ fontFamily: DISPLAY, color: C.ink, fontSize: 112, letterSpacing: 1 }}>{w}</span>)} style={{ textAlign: "left", minWidth: 330, paddingLeft: 14 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: C.ink, opacity: 0.6, textTransform: "uppercase" }}>
        <Reveal at={36}>The state-of-the-asset layer</Reveal>
      </div>
      <div style={{ opacity: cursor }}><Cursor {...path(f, [[160, 1500, 880], [235, 1100, 640]])} /></div>
    </Drift>
  );
};

/* ---- 2: cursor draws the prompt card ---- */
const Prompt: React.FC = () => {
  const f = useCurrentFrame();
  const d = cu("prompt", "drag");
  const x1 = 360, y1 = 300, x2 = 1560, y2 = 780;
  const p = ez(f, d, 75, IO);
  const cx = x1 + (x2 - x1) * p, cy = y1 + (y2 - y1) * p;
  const fill = ez(f, d + 76, 22);
  const handles = interpolate(f, [d + 70, d + 100], [1, 0], CL);
  const cur = path(f, [[0, 1100, 640], [d, x1, y1], [d + 75, x2, y2], [d + 125, 1700, 900]]);
  return (
    <Drift n={len("prompt")} from={1.02} to={1}>
      <div style={{ position: "absolute", left: x1, top: y1, width: cx - x1, height: cy - y1, border: `3px solid ${C.blue}`, background: `rgba(38,48,200,${0.08 * (1 - fill)})`, borderRadius: 6 * (1 - fill) }} />
      {[[x1, y1], [cx, y1], [x1, cy], [cx, cy]].map(([hx, hy], i) => (
        <div key={i} style={{ position: "absolute", left: hx - 8, top: hy - 8, width: 16, height: 16, background: "#fff", border: `3px solid ${C.blue}`, opacity: handles * (p > 0.02 ? 1 : 0) }} />
      ))}
      <div style={{ position: "absolute", left: x1, top: y1, width: x2 - x1, height: y2 - y1, background: "#fff", borderRadius: 34, boxShadow: "0 40px 90px rgba(13,13,15,0.16), 0 6px 18px rgba(13,13,15,0.08)", opacity: fill }} />
      <div style={{ position: "absolute", left: x1 + 90, top: y1 + 80, width: x2 - x1 - 180, fontFamily: SANS, fontWeight: 500, fontSize: 80, lineHeight: 1.14, color: C.ink, letterSpacing: -1.5 }}>
        <Reveal at={cu("prompt", "text")}>Is it <span style={{ color: C.blue }}>safe</span> to act</Reveal>
        <Reveal at={cu("prompt", "text") + 22}>on this token right now?</Reveal>
      </div>
      <div style={{ position: "absolute", left: x1 + 90, top: y2 - 120, fontFamily: MONO, fontSize: 20, letterSpacing: 5, color: C.ink, opacity: 0.5 * ez(f, cu("prompt", "text") + 60, 20), textTransform: "uppercase" }}>One verdict · A reason · The evidence</div>
      <Cursor {...cur} click={pulse(f, d + 75)} />
    </Drift>
  );
};

/* ---- 3: leaderboard + click ---- */
const ROWS = [0, 1, 2, 3, 4, 5, 6, 7];
const ORDER = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => DEPLOYMENTS[i]);
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const rows = cu("board", "rows"), click = cu("board", "click"), card = cu("board", "card");
  const sel = ez(f, click, 22);
  const shift = ez(f, click + 10, 40, IO);
  const rowH = 76, gap = 11, top = 205;
  const cur = path(f, [[0, 1500, 960], [rows + 80, 1500, 960], [click - 20, 760, top + (rowH + gap) * 1 + rowH / 2], [click + 12, 760, top + (rowH + gap) * 1 + rowH / 2], [card + 120, 1460, 760]]);
  return (
    <Drift n={len("board")} from={1} to={1.03}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateX(${-220 * shift}px)` }}>
        <Reveal at={6} style={{ position: "absolute", left: 360, top: 98, fontFamily: MONO, fontSize: 21, letterSpacing: 5, textTransform: "uppercase", color: C.ink, whiteSpace: "nowrap" }}>Oryn board · 15 deployments</Reveal>
        {ORDER.map((d, i) => {
          const a = rows + i * 8;
          const p = ez(f, a, 28);
          const isSel = i === 1;
          const v = VERDICTS[d.status];
          const dim = isSel ? 1 : 1 - 0.62 * sel;
          return (
            <div key={i} style={{ position: "absolute", left: 360, top: top + i * (rowH + gap), width: 1200 - 120, height: rowH, opacity: p * dim, filter: `blur(${(1 - p) * 10}px)`, transform: `translateY(${(1 - p) * 140}px) scale(${isSel ? 1 + 0.035 * sel : 1})`, transformOrigin: "30% 50%", background: isSel ? mixHex("#ffffff", C.ink, sel) : "#fff", color: isSel ? mixHex(C.ink, "#ffffff", sel) : C.ink, borderRadius: 22, boxShadow: isSel && sel > 0.1 ? "0 26px 60px rgba(13,13,15,0.35)" : "0 10px 26px rgba(13,13,15,0.08)", display: "flex", alignItems: "center", padding: "0 34px", gap: 28 }}>
              <div style={{ fontFamily: MONO, fontSize: 21, opacity: 0.45, width: 36 }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ width: 40, height: 40, borderRadius: 99, background: isSel && sel > 0.5 ? C.red : v.chip === C.ink ? C.ink : v.chip, opacity: 0.9 }} />
              <div style={{ fontFamily: DISPLAY, fontSize: 44, letterSpacing: 1, width: 190 }}>{d.sym}</div>
              <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, width: 120, opacity: 0.6 }}>{d.chain}</div>
              <div style={{ marginLeft: "auto" }}><Chip status={d.status} size={19} style={isSel && sel > 0.5 ? { border: "2px solid #fff" } : undefined} /></div>
            </div>
          );
        })}
      </div>
      {/* reason card */}
      <div style={{ position: "absolute", left: 1290, top: 270, width: 510, opacity: ez(f, card, 26), transform: `translateY(${(1 - ez(f, card, 30)) * 120}px)`, filter: `blur(${(1 - ez(f, card, 26)) * 12}px)` }}>
        <div style={{ background: "#fff", borderRadius: 30, padding: "46px 48px 50px", boxShadow: "0 40px 90px rgba(13,13,15,0.18)" }}>
          <Chip status="divergent" size={24} />
          <div style={{ fontFamily: DISPLAY, fontSize: 130, lineHeight: 1.05, color: C.red, marginTop: 24 }}>xTSLA</div>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", opacity: 0.55, marginTop: 2 }}>Chain SOL</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: C.ink, marginTop: 28 }}>
            <Reveal at={card + 40}>Stock split 3:1 not applied on Solana.</Reveal>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 3, textTransform: "uppercase", marginTop: 26, opacity: ez(f, card + 80, 20) * 0.6 }}>Next change · unknown</div>
        </div>
      </div>
      <Cursor {...cur} click={pulse(f, click)} />
    </Drift>
  );
};

/* ---- 4: claims on flat blue ---- */
const Claims: React.FC = () => {
  const a = cu("claims", "one"), b = cu("claims", "reason");
  const f = useCurrentFrame();
  const big: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, fontSize: 132, lineHeight: 1.06, letterSpacing: -2.5, color: C.cream, textAlign: "center" };
  const out1 = ez(f, b - 22, 18, IO);
  return (
    <Drift n={len("claims")} from={1} to={1.04}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, ...big, opacity: 1 - out1, filter: `blur(${out1 * 16}px)` }}>
        <Reveal at={a}>One verdict</Reveal>
        <Reveal at={a + 28}>per token, per <span style={{ fontFamily: DISPLAY, fontWeight: 400, letterSpacing: 1, color: C.yellow }}>chain.</span></Reveal>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, ...big }}>
        <Reveal at={b}>A reason.</Reveal>
        <Reveal at={b + 30}>The <span style={{ fontFamily: DISPLAY, fontWeight: 400, letterSpacing: 1, color: C.yellow }}>evidence.</span></Reveal>
      </div>
    </Drift>
  );
};

/* ---- 5: end card ---- */
const End: React.FC = () => {
  const f = useCurrentFrame();
  const p = ez(f, cu("end", "badge"), 40);
  return (
    <Drift n={len("end")} from={1} to={1.03}>
      <Halftone o={0.55} />
      <div style={{ position: "absolute", left: 960 - 190, top: 190, opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${0.86 + 0.14 * p})` }}><Badge size={380} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: SANS, fontWeight: 500, fontSize: 86, letterSpacing: -1.5, color: C.ink }}>
        <Reveal at={cu("end", "line")}>State of assets <span style={{ color: C.blue }}>activated.</span></Reveal>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, textAlign: "center", fontFamily: MONO, fontSize: 16, letterSpacing: 4, opacity: 0.55, textTransform: "uppercase" }}>
        <Reveal at={cu("end", "foot")}>Oryn © 2026 · MVP · Simulated issuer data · Not investment advice</Reveal>
      </div>
    </Drift>
  );
};

const SCENES: Record<string, React.FC> = { intro: Intro, prompt: Prompt, board: Board, claims: Claims, end: End };

/**
 * ORYN "Introducing Oryn" — Day 1 / V1 of the content plan.
 * 30 s, 3840x2160 @ 60 fps (1,800 frames). Reference grammar only: in-place
 * word swaps, cursor-led story, one idea per beat on one flat colour, cards
 * that rise in, centred badge + one line. Timing and sound cues: intro.json.
 */
export const OrynIntro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bgAt(f) }}>
      <Stage>
        {tl.scenes.map((s) => {
          const S = SCENES[s.id];
          return (
            <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={s.end - s.start + 14} premountFor={60}>
              <S />
            </Sequence>
          );
        })}
      </Stage>
      <Audio src={staticFile("oryn/audio/intro.wav")} />
    </AbsoluteFill>
  );
};
export { ROWS, OUT };
