import { loadFont } from "@remotion/fonts";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";

/**
 * QUANTORA LABS — 10 still posts in the brand's banner system: warm paper,
 * editorial serif headline with one italic word, wide geometric wordmark,
 * spaced mono labels, fine annotated charts on a dotted grid, crop lines and
 * footer rules. Frame N (0–9) renders post N+1. Copy only from the supplied
 * banner / X profile; every chart is illustrative (no data values).
 */
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-300-normal.woff2"), weight: "300" });

const Q = { paper: "#ECE8DF", paperDeep: "#E2DDD2", ink: "#161514", soft: "#55524C", faint: "#8F8A80", line: "rgba(22,21,20,0.35)", grid: "rgba(22,21,20,0.16)" };
const F = { serif: "Newsreader, Georgia, serif", word: "Jost, Inter, sans-serif", mono: "'JetBrains Mono', monospace" };

/* ---------------------------------------------------------------- */
const Paper: React.FC<{ seed: number }> = ({ seed }) => (
  <AbsoluteFill style={{ background: Q.paper }}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <filter id={`paper-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={seed} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 0.55 -0.1" />
      </filter>
      <filter id={`fiber-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={3} seed={seed + 7} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.37  0 0 0 0 0.32  0 0 0 0.25 -0.05" />
      </filter>
      <rect width={1920} height={1080} filter={`url(#paper-${seed})`} opacity={0.5} />
      <rect width={1920} height={1080} filter={`url(#fiber-${seed})`} opacity={0.6} />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 45%, rgba(255,253,247,0.35) 0%, transparent 60%, rgba(120,110,95,0.10) 100%)" }} />
  </AbsoluteFill>
);

const Mono: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 17, style }) => (
  <div style={{ fontFamily: F.mono, fontSize: size, letterSpacing: size * 0.42, color: Q.ink, lineHeight: 1.75, textTransform: "uppercase", ...style }}>{children}</div>
);

const Lockup: React.FC<{ x?: number; y?: number; size?: number; tagline?: boolean }> = ({ x = 140, y = 120, size = 1, tagline }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 30 * size }}>
    <Img src={staticFile("quantora/img/mark.png")} style={{ width: 132 * size, height: 132 * size }} />
    <div>
      <div style={{ fontFamily: F.word, fontWeight: 400, fontSize: 70 * size, letterSpacing: 70 * size * 0.16, color: Q.ink, lineHeight: 1 }}>QUANTORA</div>
      {tagline ? <Mono size={14 * size} style={{ marginTop: 14 * size, letterSpacing: 14 * size * 0.55 }}>The market, read clearly.</Mono> : null}
    </div>
  </div>
);

/** Crop marks / guide lines, footer rules and the post counter — shared by every post. */
const Frame: React.FC<{ n: number; tr?: [string, string] }> = ({ n, tr = ["Quantitative research", "for tokenized markets"] }) => (
  <>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g stroke={Q.grid} strokeWidth={1.2}>
        <line x1={70} y1={0} x2={70} y2={140} />
        <line x1={0} y1={70} x2={140} y2={70} />
        <line x1={1850} y1={940} x2={1850} y2={1080} />
        <line x1={1780} y1={1010} x2={1920} y2={1010} />
        <line x1={70} y1={960} x2={70} y2={1080} strokeDasharray="4 6" />
      </g>
    </svg>
    <div style={{ position: "absolute", right: 140, top: 104, textAlign: "left" }}>
      <Mono size={17}>{tr[0]}<br />{tr[1]}</Mono>
      <div style={{ width: 90, height: 1.5, background: Q.ink, marginTop: 18, marginLeft: "auto" }} />
    </div>
    <div style={{ position: "absolute", left: 140, bottom: 92, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 90, height: 1.5, background: Q.ink }} />
      <Mono size={16}>Quantora Labs</Mono>
    </div>
    <div style={{ position: "absolute", right: 140, bottom: 92, display: "flex", alignItems: "center", gap: 26 }}>
      <Mono size={16} style={{ color: Q.soft }}>{String(n).padStart(2, "0")} / 10</Mono>
      <div style={{ width: 70, height: 1.5, background: Q.ink }} />
      <Mono size={16}>Research before capital</Mono>
    </div>
  </>
);

const Headline: React.FC<{ a: string; i: string; b?: string; x?: number; y?: number; size?: number; br?: boolean }> = ({ a, i, b = "", x = 140, y = 330, size = 132, br = true }) => (
  <div style={{ position: "absolute", left: x, top: y, fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.02, letterSpacing: -size * 0.02, color: Q.ink }}>
    {a}
    {br ? <br /> : " "}
    <span style={{ fontStyle: "italic", fontWeight: 400 }}>{i}</span>
    {b}
  </div>
);

const Pills: React.FC<{ items: string[][]; x?: number; y?: number }> = ({ items, x = 140, y = 820 }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex" }}>
    {items.map((lines, k) => (
      <div key={k} style={{ borderLeft: `1.5px solid ${Q.ink}`, padding: "4px 64px 4px 30px" }}>
        <Mono size={16}>{lines.map((l, j) => <div key={j}>{l}</div>)}</Mono>
      </div>
    ))}
  </div>
);

/* ------------------------------ chart kit ------------------------- */
/** Seeded random-walk price series in [0,1], biased by `drift`, with optional waypoints. */
const series = (seed: string, n: number, drift: number, vol = 0.03, pins: [number, number][] = []) => {
  const raw: number[] = [];
  let v = 0;
  for (let i = 0; i < n; i++) {
    v += drift + (random(`${seed}${i}`) - 0.5) * vol * 2;
    raw.push(v);
  }
  // bend through waypoints (index fraction, value 0–1)
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  let out = raw.map((r) => (r - min) / (max - min || 1));
  if (pins.length) {
    out = out.map((y, i) => {
      const t = i / (n - 1);
      let w = 0;
      let acc = 0;
      for (const [pt, pv] of pins) {
        const k = Math.exp(-((t - pt) ** 2) / 0.006);
        acc += k * pv;
        w += k;
      }
      const base = pins.reduce((s, [pt, pv], j) => {
        const next = pins[j + 1];
        if (t >= pt && next && t <= next[0]) return pv + ((t - pt) / (next[0] - pt)) * (next[1] - pv);
        return s;
      }, pins[0][1] + (t < pins[0][0] ? 0 : pins[pins.length - 1][1] - pins[0][1]) * (t >= pins[pins.length - 1][0] ? 1 : 0));
      const shaped = 0.75 * base + 0.25 * y;
      return w > 0.0001 ? shaped * (1 - Math.min(1, w)) + (acc / w) * Math.min(1, w) : shaped;
    });
  }
  return out;
};

const toPath = (ys: number[], x0: number, x1: number, yTop: number, yBot: number) =>
  ys.map((y, i) => `${i ? "L" : "M"}${(x0 + ((x1 - x0) * i) / (ys.length - 1)).toFixed(1)} ${(yBot - y * (yBot - yTop)).toFixed(1)}`).join(" ");

const Candles: React.FC<{ ys: number[]; x0: number; x1: number; yTop: number; yBot: number; seed: string; every?: number }> = ({ ys, x0, x1, yTop, yBot, seed, every = 3 }) => (
  <g>
    {ys.map((y, i) => {
      if (i % every) return null;
      const x = x0 + ((x1 - x0) * i) / (ys.length - 1);
      const cy = yBot - y * (yBot - yTop);
      const h = 8 + random(`${seed}h${i}`) * 26;
      const wick = h + 10 + random(`${seed}w${i}`) * 16;
      const up = random(`${seed}u${i}`) > 0.45;
      return (
        <g key={i} opacity={0.32}>
          <line x1={x} x2={x} y1={cy - wick / 2} y2={cy + wick / 2} stroke={Q.ink} strokeWidth={1.2} />
          <rect x={x - 4} y={cy - h / 2} width={8} height={h} fill={up ? Q.paper : "#7A756C"} stroke={Q.ink} strokeWidth={1} />
        </g>
      );
    })}
  </g>
);

const DotGrid: React.FC<{ x0: number; x1: number; y0: number; y1: number; nx?: number; ny?: number }> = ({ x0, x1, y0, y1, nx = 12, ny = 6 }) => (
  <g stroke={Q.grid} strokeWidth={1.2} strokeDasharray="2 9">
    {Array.from({ length: nx + 1 }, (_, i) => <line key={`v${i}`} x1={x0 + ((x1 - x0) * i) / nx} x2={x0 + ((x1 - x0) * i) / nx} y1={y0} y2={y1} />)}
    {Array.from({ length: ny + 1 }, (_, i) => <line key={`h${i}`} x1={x0} x2={x1} y1={y0 + ((y1 - y0) * i) / ny} y2={y0 + ((y1 - y0) * i) / ny} />)}
  </g>
);

const Pin: React.FC<{ x: number; y: number; label: string; up?: number; base?: number }> = ({ x, y, label, up = 110, base }) => (
  <g>
    <line x1={x} x2={x} y1={y - up} y2={base ?? y + 120} stroke={Q.ink} strokeWidth={1.2} strokeDasharray="4 5" />
    <circle cx={x} cy={y} r={7} fill={Q.ink} />
    <text x={x} y={y - up - 16} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={17} letterSpacing={6} fill={Q.ink}>{label}</text>
  </g>
);

const at = (ys: number[], t: number, x0: number, x1: number, yTop: number, yBot: number): [number, number] => {
  const i = Math.round(t * (ys.length - 1));
  return [x0 + ((x1 - x0) * i) / (ys.length - 1), yBot - ys[i] * (yBot - yTop)];
};

const Volume: React.FC<{ n: number; x0: number; x1: number; yBase: number; seed: string }> = ({ n, x0, x1, yBase, seed }) => (
  <g opacity={0.22}>
    {Array.from({ length: n }, (_, i) => {
      const h = 10 + random(`${seed}v${i}`) ** 2 * 70;
      return <rect key={i} x={x0 + ((x1 - x0) * i) / n} y={yBase - h} width={3} height={h} fill={Q.ink} />;
    })}
  </g>
);

/* ------------------------------ posts ----------------------------- */
const Post1 = () => {
  const ys = series("p1", 120, 0.012, 0.035, [[0, 0.1], [0.25, 0.32], [0.45, 0.6], [0.6, 0.38], [0.85, 0.8], [1, 0.95]]);
  const [x0, x1, yT, yB] = [900, 1800, 330, 820];
  const pins = [["DATA", 0.25], ["RISK", 0.45], ["COSTS", 0.6], ["STRATEGY", 0.85]] as const;
  return (
    <>
      <Lockup />
      <Headline a="Research" i="before" b=" capital." br={false} y={340} size={118} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 520 }}>Every allocation starts<br />with a question.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} />
        <Candles ys={ys} x0={x0} x1={x1} yTop={yT} yBot={yB} seed="c1" />
        <path d={toPath(ys, x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={2.2} />
        {pins.map(([l, t]) => { const [x, y] = at(ys, t, x0, x1, yT, yB); return <Pin key={l} x={x} y={y} label={l} up={90} base={yB} />; })}
        <Volume n={110} x0={x0} x1={x1} yBase={yB + 60} seed="v1" />
      </svg>
      <Pills items={[["Tokenized", "stocks"], ["ETFs"], ["Market", "simulations"]]} />
    </>
  );
};

const Post2 = () => {
  const ys = series("p2", 60, 0.01, 0.05);
  const [x0, x1, yT, yB] = [980, 1780, 300, 780];
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 300, color: Q.soft }}>01 — Data</Mono>
      <Headline a="Data," i="before" b=" opinion." y={360} size={124} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 640 }}>Clean prices. Every session.<br />Every venue. Every gap.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} nx={10} ny={6} />
        <Candles ys={ys} x0={x0} x1={x1} yTop={yT} yBot={yB} seed="c2" every={1} />
        {[0.2, 0.5, 0.8].map((t, k) => { const [x, y] = at(ys, t, x0, x1, yT, yB); return <g key={k}><circle cx={x} cy={y} r={20} fill="none" stroke={Q.ink} strokeWidth={1.2} /><circle cx={x} cy={y} r={4} fill={Q.ink} /></g>; })}
        <Volume n={80} x0={x0} x1={x1} yBase={yB + 70} seed="v2" />
      </svg>
    </>
  );
};

const Post3 = () => {
  const ys = series("p3", 140, 0.006, 0.045, [[0, 0.55], [0.3, 0.85], [0.55, 0.25], [1, 0.75]]);
  const [x0, x1, yT, yB] = [140, 1780, 560, 860];
  const peak = at(ys, 0.3, x0, x1, yT, yB);
  const trough = at(ys, 0.55, x0, x1, yT, yB);
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 270, color: Q.soft }}>02 — Risk</Mono>
      <Headline a="Risk," i="measured" b=" first." br={false} y={320} size={124} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} nx={16} ny={4} />
        <path d={`${toPath(ys.map((y) => Math.min(1, y + 0.12)), x0, x1, yT, yB)} L ${x1} ${yB} ${toPath(ys.map((y) => Math.max(0, y - 0.12)), x0, x1, yT, yB).replace("M", "L").split(" L").reverse().join(" L")} Z`} fill="rgba(22,21,20,0.06)" />
        <path d={toPath(ys, x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={2.2} />
        <rect x={peak[0]} y={peak[1]} width={trough[0] - peak[0]} height={trough[1] - peak[1]} fill="rgba(22,21,20,0.07)" stroke={Q.line} strokeDasharray="4 5" />
        <Pin x={peak[0]} y={peak[1]} label="PEAK" up={60} base={yB} />
        <Pin x={trough[0]} y={trough[1]} label="DRAWDOWN" up={trough[1] - yT + 40} base={yB} />
      </svg>
      <Mono size={17} style={{ position: "absolute", right: 140, top: 470 }}>Volatility · Drawdown · Exposure</Mono>
    </>
  );
};

const Post4 = () => {
  const [x0, yB] = [1060, 800];
  const layers = [["GROSS RETURN", 1], ["SPREAD", 0.86], ["FEES", 0.78], ["SLIPPAGE", 0.7], ["NET", 0.62]] as const;
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 300, color: Q.soft }}>03 — Costs</Mono>
      <Headline a="Costs," i="accounted" b=" for." y={360} size={124} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 660 }}>The return you see<br />is not the return you keep.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={1000} x1={1780} y0={300} y1={yB} nx={8} ny={5} />
        {layers.map(([l, v], k) => {
          const x = x0 + k * 150;
          const h = v * 420;
          return (
            <g key={l}>
              <rect x={x} y={yB - h} width={78} height={h} fill={k === layers.length - 1 ? Q.ink : "none"} stroke={Q.ink} strokeWidth={1.4} />
              {k > 0 && k < layers.length - 1 ? <rect x={x} y={yB - layers[k - 1][1] * 420} width={78} height={(layers[k - 1][1] - v) * 420} fill="rgba(22,21,20,0.18)" /> : null}
              <text x={x + 39} y={yB + 40} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={14} letterSpacing={3} fill={Q.ink}>{l}</text>
              {k < layers.length - 1 ? <line x1={x + 78} x2={x + 150} y1={yB - h} y2={yB - h} stroke={Q.ink} strokeDasharray="3 5" strokeWidth={1.2} /> : null}
            </g>
          );
        })}
      </svg>
    </>
  );
};

const Post5 = () => {
  const ys = series("p5", 130, 0.008, 0.03, [[0, 0.45], [0.33, 0.7], [0.5, 0.15], [0.8, 0.75], [1, 0.95]]);
  const [x0, x1, yT, yB] = [140, 1780, 660, 860];
  const pins = [["RISK", 0.33], ["CONTEXT", 0.5], ["EVIDENCE", 0.8]] as const;
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 270, color: Q.soft }}>04 — Context</Mono>
      <Headline a="Context changes" i="everything." y={320} size={112} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={x0} x2={x1} y1={yB + 30} y2={yB + 30} stroke={Q.ink} strokeWidth={1.2} />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={x0 + ((x1 - x0) * i) / 8} x2={x0 + ((x1 - x0) * i) / 8} y1={yB + 22} y2={yB + 38} stroke={Q.ink} strokeWidth={1.2} />)}
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} nx={16} ny={0} />
        <path d={toPath(ys, x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={2} />
        {pins.map(([l, t]) => { const [x, y] = at(ys, t, x0, x1, yT, yB); return <Pin key={l} x={x} y={y} label={l} up={50} base={yB + 30} />; })}
      </svg>
    </>
  );
};

const Post6 = () => {
  const ys = series("p6", 110, 0.014, 0.03, [[0, 0.1], [0.4, 0.45], [0.55, 0.38], [0.9, 0.9], [1, 0.97]]);
  const bench = ys.map((_, i) => 0.08 + (i / (ys.length - 1)) * 0.5);
  const [x0, x1, yT, yB] = [960, 1780, 300, 800];
  const [sx, sy] = at(ys, 0.9, x0, x1, yT, yB);
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 300, color: Q.soft }}>05 — Strategy</Mono>
      <Headline a="Strategy," i="backed" b=" by evidence." y={360} size={112} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 640 }}>Tested against the market<br />before it meets the market.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} nx={10} ny={6} />
        <path d={toPath(bench, x0, x1, yT, yB)} fill="none" stroke={Q.faint} strokeWidth={1.6} />
        <Candles ys={ys} x0={x0} x1={x1} yTop={yT} yBot={yB} seed="c6" every={4} />
        <path d={toPath(ys, x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={2.2} />
        <Pin x={sx} y={sy} label="STRATEGY" up={70} base={yB} />
        <text x={x1} y={yB - bench[bench.length - 1] * (yB - yT) + 30} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize={14} letterSpacing={4} fill={Q.soft}>BENCHMARK</text>
      </svg>
    </>
  );
};

const Post7 = () => {
  const names = ["Large cap · tech", "Large cap · consumer", "Semiconductors", "Energy", "Financials", "Healthcare"];
  return (
    <>
      <Lockup size={0.7} />
      <div style={{ position: "absolute", left: 140, top: 300, fontFamily: F.serif, fontWeight: 500, fontSize: 112, lineHeight: 1.04, letterSpacing: -2.2, color: Q.ink }}>
        Tokenized <span style={{ fontStyle: "italic", fontWeight: 400 }}>stocks,</span>
        <br />
        read clearly.
      </div>
      <Mono size={18} style={{ position: "absolute", left: 140, top: 640 }}>Onchain equity exposure,<br />studied like the real thing.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {names.map((n, k) => {
          const col = k % 2;
          const row = Math.floor(k / 2);
          const x = 1040 + col * 380;
          const y = 300 + row * 170;
          const ys = series(`t${k}`, 40, random(`d${k}`) * 0.02 - 0.004, 0.05);
          return (
            <g key={n}>
              <line x1={x} x2={x + 320} y1={y + 120} y2={y + 120} stroke={Q.line} strokeWidth={1} />
              <text x={x} y={y + 6} fontFamily="'JetBrains Mono', monospace" fontSize={14} letterSpacing={4} fill={Q.ink}>{n.toUpperCase()}</text>
              <path d={toPath(ys, x, x + 320, y + 26, y + 104)} fill="none" stroke={Q.ink} strokeWidth={1.8} />
            </g>
          );
        })}
      </svg>
      <Mono size={13} style={{ position: "absolute", right: 140, top: 820, color: Q.faint }}>Illustrative sectors</Mono>
    </>
  );
};

const Post8 = () => {
  const assets = ["EQ", "BND", "GLD", "INTL", "TECH"];
  const corr = (a: number, b: number) => (a === b ? 1 : 0.1 + random(`c${Math.min(a, b)}${Math.max(a, b)}`) * 0.8);
  const cell = 96;
  const [gx, gy] = [1180, 300];
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 300, color: Q.soft }}>06 — ETFs</Mono>
      <div style={{ position: "absolute", left: 140, top: 360, fontFamily: F.serif, fontWeight: 500, fontSize: 104, lineHeight: 1.04, letterSpacing: -2, color: Q.ink }}>
        What you hold,
        <br />
        <span style={{ fontStyle: "italic", fontWeight: 400 }}>and what</span> it holds.
      </div>
      <Mono size={18} style={{ position: "absolute", left: 140, top: 660 }}>Overlap. Correlation.<br />Concentration.</Mono>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {assets.map((a, i) => (
          <g key={a}>
            <text x={gx - 24} y={gy + i * cell + cell / 2 + 5} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize={15} letterSpacing={3} fill={Q.ink}>{a}</text>
            <text x={gx + i * cell + cell / 2} y={gy - 20} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={15} letterSpacing={3} fill={Q.ink}>{a}</text>
            {assets.map((_, j) => {
              const c = corr(i, j);
              return <g key={j}><rect x={gx + j * cell + 4} y={gy + i * cell + 4} width={cell - 8} height={cell - 8} fill={`rgba(22,21,20,${0.04 + c * 0.75})`} /><circle cx={gx + j * cell + cell / 2} cy={gy + i * cell + cell / 2} r={2.5} fill={c > 0.5 ? Q.paper : Q.ink} /></g>;
            })}
          </g>
        ))}
      </svg>
      <Mono size={13} style={{ position: "absolute", left: gx, top: gy + 5 * cell + 26, color: Q.faint }}>Illustrative correlation matrix</Mono>
    </>
  );
};

const Post9 = () => {
  const [x0, x1, yT, yB] = [140, 1780, 470, 860];
  const N = 60;
  const paths = Array.from({ length: 70 }, (_, k) => {
    let v = 0.5;
    return Array.from({ length: N }, (_, i) => {
      if (i) v += (random(`mc${k}-${i}`) - 0.47) * 0.13;
      return v;
    });
  });
  const all = paths.flat();
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const norm = (v: number) => (v - lo) / (hi - lo);
  return (
    <>
      <Lockup size={0.7} />
      <Mono size={18} style={{ position: "absolute", left: 140, top: 270, color: Q.soft }}>07 — Market simulations</Mono>
      <Headline a="Run the market" i="before" b=" you meet it." br={false} y={320} size={104} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <DotGrid x0={x0} x1={x1} y0={yT} y1={yB} nx={16} ny={4} />
        {paths.map((p, k) => <path key={k} d={toPath(p.map(norm), x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={1} opacity={0.14} />)}
        <path d={toPath(paths[7].map(norm), x0, x1, yT, yB)} fill="none" stroke={Q.ink} strokeWidth={2.4} />
        <line x1={x0} x2={x0} y1={yT - 20} y2={yB} stroke={Q.ink} strokeWidth={1.2} />
        <text x={x0 + 16} y={yT - 4} fontFamily="'JetBrains Mono', monospace" fontSize={14} letterSpacing={4} fill={Q.ink}>TODAY</text>
        <text x={x1} y={yT - 4} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize={14} letterSpacing={4} fill={Q.ink}>POSSIBLE FUTURES</text>
      </svg>
    </>
  );
};

const Post10 = () => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Img src={staticFile("quantora/img/mark.png")} style={{ width: 240, height: 240 }} />
      <div style={{ fontFamily: F.word, fontSize: 112, letterSpacing: 112 * 0.16, color: Q.ink, marginTop: 56, marginRight: -112 * 0.16 }}>QUANTORA</div>
      <Mono size={20} style={{ marginTop: 22, letterSpacing: 20 * 0.6 }}>The market, read clearly.</Mono>
      <div style={{ width: 90, height: 1.5, background: Q.ink, margin: "50px 0 34px" }} />
      <div style={{ fontFamily: F.serif, fontSize: 52, color: Q.ink }}>
        Quantitative research for <span style={{ fontStyle: "italic" }}>onchain</span> finance.
      </div>
      <Mono size={16} style={{ marginTop: 34, color: Q.soft }}>Tokenized stocks · ETFs · Market simulations · @Quantora_Labs</Mono>
    </div>
  </>
);

const POSTS = [Post1, Post2, Post3, Post4, Post5, Post6, Post7, Post8, Post9, Post10];

export const QuantoraPosts: React.FC = () => {
  const f = useCurrentFrame();
  const Post = POSTS[Math.min(POSTS.length - 1, f)];
  return (
    <AbsoluteFill style={{ background: Q.paper }}>
      <Stage>
        <Paper seed={f + 3} />
        <Post />
        <Frame n={f + 1} />
      </Stage>
    </AbsoluteFill>
  );
};
