import { loadFont } from "@remotion/fonts";
import { Img, random, staticFile } from "remotion";
import { makeStill } from "./still";

/** QUANTORA LABS X-profile posts (15): banner system = warm paper, serif headline with one italic word, wide Jost wordmark, spaced mono labels, annotated line charts on a dotted grid. Charts are synthetic and labelled. */
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Newsreader", url: staticFile("quantora/fonts/newsreader-latin-400-italic.woff2"), weight: "400", style: "italic" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "Jost", url: staticFile("quantora/fonts/jost-latin-300-normal.woff2"), weight: "300" });

export const Q = { paper: "#ECE8DF", ink: "#161514", soft: "#55524C", faint: "#8F8A80", line: "rgba(22,21,20,0.4)", grid: "rgba(22,21,20,0.2)" };
export const F = { serif: "Newsreader, Georgia, serif", word: "Jost, Inter, sans-serif", mono: "'JetBrains Mono', monospace" };

export const Paper: React.FC<{ seed: number }> = ({ seed }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: Q.paper }} />
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
      <filter id={`pp${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={seed} /><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 0.55 -0.1" /></filter>
      <filter id={`pf${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.012 0.04" numOctaves={3} seed={seed + 7} /><feColorMatrix values="0 0 0 0 0.4  0 0 0 0 0.37  0 0 0 0 0.32  0 0 0 0.25 -0.05" /></filter>
      <rect width={1080} height={1350} filter={`url(#pp${seed})`} opacity={0.5} />
      <rect width={1080} height={1350} filter={`url(#pf${seed})`} opacity={0.6} />
    </svg>
  </>
);
export const Mono: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ children, size = 16, style }) => (
  <div style={{ fontFamily: F.mono, fontSize: size, letterSpacing: size * 0.42, color: Q.ink, lineHeight: 1.75, textTransform: "uppercase", ...style }}>{children}</div>
);
export const Mark: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => <Img src={staticFile("quantora/img/mark.png")} style={{ width: s, height: s, ...style }} />;
export const Shell: React.FC<{ n: number; total?: number; seed: number; children: React.ReactNode; label?: string }> = ({ n, total = 15, seed, children, label = "Quantora Labs" }) => (
  <>
    <Paper seed={seed} />
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
      <g stroke={Q.grid} strokeWidth={1.2}><line x1={60} y1={0} x2={60} y2={120} /><line x1={0} y1={60} x2={120} y2={60} /><line x1={1020} y1={1350} x2={1020} y2={1230} /><line x1={1080} y1={1290} x2={960} y2={1290} /></g>
      <line x1={70} y1={1262} x2={1010} y2={1262} stroke={Q.line} strokeWidth={1.2} />
    </svg>
    <Mono size={13} style={{ position: "absolute", left: 70, top: 78, letterSpacing: 6 }}>{label}</Mono>
    {children}
    <Mono size={12} style={{ position: "absolute", left: 70, right: 70, bottom: 38, display: "flex", justifyContent: "space-between", letterSpacing: 4, color: Q.soft }}>
      <span>Quantora research preview · Synthetic demo data</span><span>{String(n).padStart(2, "0")}/{total}</span>
    </Mono>
  </>
);
export const H: React.FC<{ children: React.ReactNode; fs: number; top: number; style?: React.CSSProperties }> = ({ children, fs, top, style }) => (
  <div style={{ fontFamily: F.serif, fontWeight: 400, fontSize: fs, lineHeight: 1.0, letterSpacing: -fs * 0.02, color: Q.ink, position: "absolute", left: 70, right: 70, top, ...style }}>{children}</div>
);
export const I: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontStyle: "italic" }}>{children}</span>;
export const Sub: React.FC<{ children: React.ReactNode; top: number; w?: number }> = ({ children, top, w = 760 }) => (
  <div style={{ fontFamily: F.serif, fontSize: 36, lineHeight: 1.25, color: Q.soft, position: "absolute", left: 70, width: w, top }}>{children}</div>
);

/** Synthetic series (seeded). kind picks the shape. */
export const series = (seed: string, n: number, shape: (t: number) => number, noise: number) => {
  let w = 0;
  return Array.from({ length: n }, (_, i) => {
    w = w * 0.7 + (random(`${seed}${i}`) - 0.5) * noise;
    return shape(i / (n - 1)) + w;
  });
};
export const Chart: React.FC<{ x: number; y: number; w: number; h: number; lines: { d: number[]; width?: number; color?: string; op?: number }[]; marks?: { i: number; label: string; line: number; up?: boolean }[]; lo?: number; hi?: number }> = ({ x, y, w, h, lines, marks = [], lo = 0, hi = 2 }) => {
  const px = (i: number, len: number) => (i / (len - 1)) * w;
  const py = (v: number) => h - ((v - lo) / (hi - lo)) * h;
  return (
    <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={w} height={h + 20}>
      {Array.from({ length: 9 }).map((_, c) => Array.from({ length: 6 }).map((__, r) => <circle key={`${c}-${r}`} cx={(c / 8) * w} cy={(r / 5) * h} r={1.6} fill={Q.grid} />))}
      <line x1={0} y1={h} x2={w} y2={h} stroke={Q.line} strokeWidth={1.4} />
      {Array.from({ length: 8 }).map((_, t) => <line key={t} x1={(t / 7) * w} y1={h} x2={(t / 7) * w} y2={h + 8} stroke={Q.line} strokeWidth={1.2} />)}
      {lines.map((l, k) => <polyline key={k} points={l.d.map((v, i) => `${px(i, l.d.length)},${py(v)}`).join(" ")} fill="none" stroke={l.color ?? Q.ink} strokeWidth={l.width ?? 2.2} opacity={l.op ?? 1} strokeLinejoin="round" />)}
      {marks.map((m) => {
        const d = lines[0].d; const cx = px(m.i, d.length); const cy = py(d[m.i]);
        return (
          <g key={m.label}>
            <line x1={cx} y1={cy} x2={cx} y2={m.up ? cy - m.line : cy + m.line} stroke={Q.ink} strokeWidth={1} opacity={0.6} />
            <circle cx={cx} cy={cy} r={5.5} fill={Q.ink} />
            <text x={cx} y={m.up ? cy - m.line - 12 : cy + m.line + 26} textAnchor="middle" style={{ fontFamily: F.mono, fontSize: 14, letterSpacing: 5, fill: Q.ink, textTransform: "uppercase" }}>{m.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

export const DD = series("dd", 120, (t) => (t < 0.34 ? 0.9 + (t / 0.34) * 0.8 : t < 0.62 ? 1.7 - ((t - 0.34) / 0.28) * 0.95 : 0.75 + ((t - 0.62) / 0.38) * 1.0), 0.08);
export const peak = DD.indexOf(Math.max(...DD.slice(0, 50)));
export const trough = 60 + DD.slice(60, 85).indexOf(Math.min(...DD.slice(60, 85)));
export const PA = series("pa", 100, (t) => 1 + t * 0.8 + Math.sin(t * 7) * 0.25, 0.05);
export const PB = series("pb", 100, (t) => 1 + t * 0.8 - Math.sin(t * 7) * 0.25, 0.05);
export const FAN = Array.from({ length: 14 }, (_, k) => series(`fan${k}`, 80, (t) => 1 + t * 0.5, 0.2).map((v, i, a) => a.slice(0, i + 1).reduce((s, x) => s + x, 0) / (i + 1) * 0.0 + 1 + (v - 1) * (0.6 + (i / 79) * 1.6) + (random(`z${k}`) - 0.5) * (i / 79) * 0.9));

const P1: React.FC = () => (
  <Shell n={1} seed={11} label="">
    <Mark s={190} style={{ position: "absolute", left: 70, top: 420 }} />
    <div style={{ fontFamily: F.word, fontSize: 112, letterSpacing: 112 * 0.16, color: Q.ink, position: "absolute", left: 300, top: 440, lineHeight: 1 }}>QUANTORA</div>
    <Mono size={17} style={{ position: "absolute", left: 304, top: 580, letterSpacing: 10 }}>The market, read clearly.</Mono>
    <Chart x={70} y={800} w={940} h={300} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 90, up: true }, { i: trough, label: "Trough", line: 80 }]} />
  </Shell>
);
const P2: React.FC = () => (
  <Shell n={2} seed={12}>
    <H fs={150} top={230}>Quantitative research for <I>onchain</I> finance.</H>
    <Mark s={120} style={{ position: "absolute", left: 70, bottom: 150 }} />
    <Mono size={15} style={{ position: "absolute", left: 220, bottom: 190 }}>Tokenized stocks · ETFs · Market simulations</Mono>
  </Shell>
);
export const Topic: React.FC<{ n: number; seed: number; k: string; head: React.ReactNode; sub: string; chart: React.ReactNode }> = ({ n, seed, k, head, sub, chart }) => (
  <Shell n={n} seed={seed}>
    <Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>{k}</Mono>
    <H fs={172} top={230}>{head}</H>
    <Sub top={640}>{sub}</Sub>
    {chart}
  </Shell>
);
const P3: React.FC = () => <Topic n={3} seed={13} k="01 / Tokenized stocks" head={<>Tokenized <I>stocks.</I></>} sub="Research on onchain finance, read clearly." chart={<Chart x={70} y={860} w={940} h={260} lines={[{ d: PA }]} />} />;
const P4: React.FC = () => <Topic n={4} seed={14} k="02 / ETFs" head={<><I>ETFs,</I> read clearly.</>} sub="Quantitative research for onchain finance." chart={<Chart x={70} y={860} w={940} h={260} lines={[{ d: PB }, { d: PA, op: 0.35, width: 1.6 }]} />} />;
const P5: React.FC = () => <Topic n={5} seed={15} k="03 / Market simulations" head={<>Market <I>simulations.</I></>} sub="Many possible paths, one clear picture. Synthetic demo data." chart={<Chart x={70} y={840} w={940} h={300} lo={0} hi={2.4} lines={FAN.map((d, k) => ({ d, width: 1.3, op: 0.35 + (k % 3) * 0.15 }))} />} />;
const P6: React.FC = () => (
  <Shell n={6} seed={16}>
    <H fs={150} top={200}>How bad<br />can it <I>get?</I></H>
    <Sub top={540}>Drawdown, path and the assumptions behind both.</Sub>
    <Chart x={70} y={800} w={940} h={330} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 110, up: true }, { i: trough, label: "Drawdown", line: 90 }]} />
  </Shell>
);
const P7: React.FC = () => (
  <Shell n={7} seed={17}>
    <Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Fig. 01 / Drawdown</Mono>
    <H fs={130} top={230}>From the peak to the <I>trough.</I></H>
    <Chart x={70} y={620} w={940} h={420} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 120, up: true }, { i: trough, label: "Trough", line: 70 }]} />
    <Mono size={13} style={{ position: "absolute", left: 70, top: 1120, letterSpacing: 5, color: Q.soft }}>Illustrative path · synthetic demo data · no real values</Mono>
  </Shell>
);
const P8: React.FC = () => (
  <Shell n={8} seed={18}>
    <H fs={150} top={200}>The <I>path</I><br />matters.</H>
    <Sub top={540}>Two paths, the same start. Read both before you read the number.</Sub>
    <Chart x={70} y={780} w={940} h={340} lines={[{ d: PA }, { d: PB, width: 2.2, op: 0.55 }]} />
  </Shell>
);
const P9: React.FC = () => (
  <Shell n={9} seed={19}>
    <Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Fig. 02 / Assumptions</Mono>
    <H fs={124} top={230}>The assumptions behind <I>both.</I></H>
    {["Drawdown", "Path", "Assumptions"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 700 + i * 170, borderTop: `1.4px solid ${Q.line}`, paddingTop: 26, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: F.serif, fontSize: 84, color: Q.ink }}>{t}</span><Mono size={15}>{`0${i + 1}`}</Mono>
      </div>
    ))}
  </Shell>
);
const P10: React.FC = () => (
  <Shell n={10} seed={20}>
    <H fs={168} top={230}>The market,<br />read <I>clearly.</I></H>
    <Chart x={70} y={720} w={940} h={420} lines={[{ d: series("clr", 120, (t) => 0.8 + t * 1.2 + Math.sin(t * 9) * 0.12, 0.07) }]} marks={[{ i: 40, label: "Rise", line: 90, up: true }, { i: 70, label: "Context", line: 70 }, { i: 105, label: "Evidence", line: 90, up: true }]} />
  </Shell>
);
const P11: React.FC = () => (
  <Shell n={11} seed={21}>
    <H fs={130} top={220}>Research <I>preview.</I></H>
    <Sub top={400}>Quantora research preview, synthetic demo data.</Sub>
    <div style={{ position: "absolute", left: 70, right: 70, top: 600, border: `1.4px solid ${Q.line}`, padding: 44 }}>
      <Mono size={16}>What you see here</Mono>
      <div style={{ fontFamily: F.serif, fontSize: 56, lineHeight: 1.15, color: Q.ink, marginTop: 18 }}>Charts built on synthetic demo data, to show how a question gets read, not what the market will do.</div>
    </div>
  </Shell>
);
const P12: React.FC = () => (
  <Shell n={12} seed={22}>
    <H fs={150} top={200}>Read the <I>path,</I><br />not just the number.</H>
    <Chart x={70} y={720} w={940} h={400} lines={[{ d: PB, op: 0.5, width: 1.8 }, { d: DD, width: 2.4 }]} marks={[{ i: trough, label: "Trough", line: 80 }]} />
  </Shell>
);
const P13: React.FC = () => (
  <Shell n={13} seed={23}>
    <Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Three subjects</Mono>
    {[["Tokenized stocks", "I"], ["ETFs", "II"], ["Market simulations", "III"]].map(([t, r], i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 260 + i * 290, borderTop: `1.4px solid ${Q.line}`, paddingTop: 36, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: F.serif, fontSize: 96, color: Q.ink, fontStyle: i === 1 ? "italic" : "normal" }}>{t}</span><Mono size={16}>{r}</Mono>
      </div>
    ))}
  </Shell>
);
const P14: React.FC = () => (
  <Shell n={14} seed={24}>
    <H fs={128} top={210}>How bad can it get? <I>Ask before it does.</I></H>
    <Chart x={70} y={760} w={940} h={360} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 100, up: true }, { i: trough, label: "Drawdown", line: 80 }]} />
  </Shell>
);
const P15: React.FC = () => (
  <Shell n={15} seed={25} label="">
    <Mark s={230} style={{ position: "absolute", left: 425, top: 330 }} />
    <div style={{ fontFamily: F.word, fontSize: 92, letterSpacing: 92 * 0.16, color: Q.ink, position: "absolute", left: 0, right: 0, textAlign: "center", top: 620, lineHeight: 1, paddingLeft: 92 * 0.16 }}>QUANTORA</div>
    <Mono size={17} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 740, letterSpacing: 10 }}>The market, read clearly.</Mono>
    <H fs={64} top={860} style={{ textAlign: "center" }}>Quantitative research for <I>onchain</I> finance.</H>
    <Mono size={19} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 1100 }}>quantora.buzz · @Quantora_Labs</Mono>
  </Shell>
);
export const QuantoraX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], Q.paper);
