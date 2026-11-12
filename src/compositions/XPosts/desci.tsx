import { loadFont } from "@remotion/fonts";
import { Img, random, staticFile } from "remotion";
import { makeStill } from "./still";

/** desciBnb X-profile posts (15): banner system = black stage, gold light, widely tracked caps (DECENTRALIZING / SCIENTIFIC DISCOVERY), golden molecule nodes and a dotted planet arc, hex-ribbon logo. Copy only from the profile, banner and the pinned thread. */
loadFont({ family: "DJost", url: staticFile("quantora/fonts/jost-latin-300-normal.woff2"), weight: "300" });
loadFont({ family: "DJost", url: staticFile("quantora/fonts/jost-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: "DSerif", url: staticFile("quantora/fonts/newsreader-latin-400-italic.woff2"), weight: "400", style: "italic" });
export const INK = "#050403";
export const GOLD = "#e8b936";
export const GOLD2 = "#f6d56a";
export const DEEP = "#8a5d12";
export const DIM = "rgba(240,215,160,0.66)";
export const J = "DJost, sans-serif";
export const MONO = "'JetBrains Mono', monospace";

export const gt: React.CSSProperties = { background: `linear-gradient(180deg, ${GOLD2}, ${GOLD} 55%, #c8921f)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
export const Dots: React.FC<{ cx: number; cy: number; r: number; seed: string; from?: number; to?: number }> = ({ cx, cy, r, seed, from = 200, to = 340 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 150 }).map((_, i) => {
      const a = ((from + (to - from) * (i / 150)) * Math.PI) / 180; const rr = r + (random(`${seed}r${i}`) - 0.5) * 14;
      return <circle key={i} cx={cx + Math.cos(a) * rr} cy={cy + Math.sin(a) * rr} r={1 + random(`${seed}s${i}`) * 1.8} fill={GOLD2} opacity={0.3 + random(`${seed}o${i}`) * 0.6} />;
    })}
  </svg>
);
export const Bg: React.FC<{ planet?: boolean; seed?: string; glow?: number }> = ({ planet, seed = "a", glow = 1 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: INK }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 45% at 85% 10%, rgba(200,146,31,${0.35 * glow}), transparent 70%)` }} />
    {planet && (
      <>
        <div style={{ position: "absolute", left: -300, top: 760, width: 1700, height: 1700, borderRadius: 1700, background: "radial-gradient(circle at 50% 0%, rgba(232,185,54,0.45), rgba(120,78,10,0.25) 6%, rgba(5,4,3,0.95) 22%)", boxShadow: "0 -4px 40px rgba(246,213,106,0.45)", border: "2px solid rgba(246,213,106,0.55)" }} />
        <Dots cx={540} cy={2000} r={1250} seed={seed} from={248} to={292} />
      </>
    )}
  </>
);
export const Node: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, background: "radial-gradient(circle at 35% 30%, #fff3b8, #e8b936 45%, #7a4d0c 100%)", boxShadow: "0 0 30px rgba(232,185,54,0.45)" }} />
);
export const Molecule: React.FC<{ pts: [number, number, number][]; links: [number, number][] }> = ({ pts, links }) => (
  <>
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>{links.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke={GOLD} strokeWidth={2.5} opacity={0.7} />)}</svg>
    {pts.map(([x, y, r], i) => <Node key={i} x={x} y={y} r={r} />)}
  </>
);
export const Logo: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => <Img src={staticFile("desci/logo.png")} style={{ width: s, height: (s * 860) / 880, ...style }} />;
export const Foot: React.FC<{ n: number; total?: number }> = ({ n, total = 15 }) => (
  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,215,160,0.5)", position: "absolute", left: 70, right: 70, bottom: 42, display: "flex", justifyContent: "space-between" }}>
    <span>desciBnb · Illustrative graphics · Not financial advice</span><span>{String(n).padStart(2, "0")}/{total}</span>
  </div>
);
export const Cap: React.FC<{ children: React.ReactNode; fs?: number; top: number; c?: string; style?: React.CSSProperties }> = ({ children, fs = 22, top, c = DIM, style }) => (
  <div style={{ fontFamily: J, fontWeight: 400, fontSize: fs, letterSpacing: fs * 0.5, textTransform: "uppercase", color: c, position: "absolute", left: 70, right: 70, top, ...style }}>{children}</div>
);
export const H: React.FC<{ children: React.ReactNode; fs: number; top: number; center?: boolean; style?: React.CSSProperties }> = ({ children, fs, top, center, style }) => (
  <div style={{ fontFamily: J, fontWeight: 300, fontSize: fs, lineHeight: 1.04, letterSpacing: -fs * 0.02, color: "#f7ecd0", position: "absolute", left: 70, right: 70, top, textAlign: center ? "center" : "left", ...style }}>{children}</div>
);
export const G: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ ...gt, fontWeight: 400 }}>{children}</span>;
export const I: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontFamily: "DSerif, serif", fontStyle: "italic", ...gt }}>{children}</span>;
export const Bar: React.FC<{ x: number; y: number }> = ({ x, y }) => <div style={{ position: "absolute", left: x, top: y, width: 3, height: 70, background: DEEP }} />;
export const M1: [number, number, number][] = [[820, 230, 34], [960, 330, 20], [900, 110, 16], [720, 380, 12]];
export const L1: [number, number][] = [[0, 1], [0, 2], [0, 3]];

const P1: React.FC = () => (
  <>
    <Bg glow={1.2} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 640, overflow: "hidden" }}><Img src={staticFile("desci/banner.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "100% 50%" }} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 262, background: `linear-gradient(180deg, transparent, ${INK})` }} />
    <Logo s={130} style={{ position: "absolute", left: 70, top: 640 }} />
    <Bar x={70} y={830} /><Cap top={840} fs={24} style={{ left: 100 }}>Decentralizing</Cap>
    <div style={{ fontFamily: J, fontWeight: 300, fontSize: 88, letterSpacing: 88 * 0.2, textTransform: "uppercase", color: "#f7ecd0", position: "absolute", left: 70, top: 920, lineHeight: 1.15 }}>Scientific<br /><span style={{ ...gt, fontWeight: 400 }}>Discovery</span></div>
    <Cap top={1180} fs={16} c={DIM}>Research × Funding × Collaboration × AI</Cap>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg planet seed="b" /><Molecule pts={M1} links={L1} /><Cap top={110}>desciBnb</Cap>
    <H fs={140} top={230}>The future of <G>science</G> is <I>decentralized.</I></H>
    <Foot n={2} />
  </>
);
const P3: React.FC = () => (
  <>
    <Bg seed="c" /><Cap top={110}>The stack</Cap>
    {["Research", "AI", "Blockchain"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 280 + i * 280, borderTop: "1px solid rgba(232,185,54,0.35)", paddingTop: 40, display: "flex", alignItems: "baseline", gap: 30 }}>
        <span style={{ fontFamily: J, fontWeight: 400, fontSize: 40, color: GOLD }}>×</span><span style={{ fontFamily: J, fontWeight: 300, fontSize: 150, letterSpacing: -5, ...(i === 1 ? gt : { color: "#f7ecd0" }) }}>{t}</span>
      </div>
    ))}
    <Foot n={3} />
  </>
);
const P4: React.FC = () => (
  <>
    <Bg planet seed="d" glow={1.2} /><Cap top={110}>Network</Cap>
    <H fs={170} top={240}>Built on <G>BNB Chain.</G></H>
    <Logo s={140} style={{ position: "absolute", right: 70, top: 100 }} />
    <Foot n={4} />
  </>
);
export const Thread: React.FC<{ n: number; text: React.ReactNode; k: string }> = ({ n, text, k }) => (
  <>
    <Bg seed={`t${n}`} /><Molecule pts={[[900, 220, 26], [1000, 120, 14], [800, 120, 11]]} links={[[0, 1], [0, 2]]} /><Cap top={110}>{k}</Cap>
    <H fs={118} top={330}>{text}</H>
    <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: DIM, position: "absolute", left: 70, bottom: 120 }}>{n - 4} / 4</div>
    <Foot n={n} />
  </>
);
const P5: React.FC = () => <Thread n={5} k="Thread" text={<>We can trade <G>billions of dollars</G> in assets with a few clicks.</>} />;
const P6: React.FC = () => <Thread n={6} k="Thread" text={<>But funding scientific research is still <G>painfully complicated.</G></>} />;
const P7: React.FC = () => <Thread n={7} k="Thread" text={<>Maybe <I>blockchain</I> can help fix that.</>} />;
const P8: React.FC = () => (
  <>
    <Bg planet seed="e" glow={1.3} /><Molecule pts={M1} links={L1} /><Cap top={110}>Thread / 4 of 4</Cap>
    <H fs={130} top={300}>Maybe that’s where <I>DeSci</I> comes in.</H>
    <Foot n={8} />
  </>
);
export const Pillar: React.FC<{ n: number; i: number; w: string }> = ({ n, i, w }) => (
  <>
    <Bg planet seed={`p${n}`} />
    <Cap top={110}>Research × Funding × Collaboration × AI</Cap>
    <div style={{ position: "absolute", left: 70, top: 160, display: "flex", gap: 14 }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ width: 90, height: 6, background: k === i ? GOLD : "rgba(232,185,54,0.25)" }} />)}</div>
    <div style={{ fontFamily: J, fontWeight: 300, fontSize: w.length > 9 ? 150 : 230, letterSpacing: -6, lineHeight: 1, position: "absolute", left: 70, top: 470, ...gt }}>{w}</div>
    <Foot n={n} />
  </>
);
const P9: React.FC = () => <Pillar n={9} i={0} w="Research" />;
const P10: React.FC = () => <Pillar n={10} i={1} w="Funding" />;
const P11: React.FC = () => <Pillar n={11} i={2} w="Collaboration" />;
const P12: React.FC = () => <Pillar n={12} i={3} w="AI" />;
const P13: React.FC = () => (
  <>
    <Bg seed="f" /><Cap top={110}>Decentralizing scientific discovery</Cap>
    {["Research", "Funding", "Collaboration", "AI"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 260 + i * 225, borderTop: "1px solid rgba(232,185,54,0.35)", paddingTop: 34, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: J, fontWeight: 300, fontSize: 110, letterSpacing: -3, color: "#f7ecd0" }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 20, color: GOLD }}>0{i + 1}</span>
      </div>
    ))}
    <Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg seed="g" glow={0.7} />
    <Molecule pts={[[540, 600, 46], [300, 420, 26], [780, 400, 30], [250, 780, 20], [830, 790, 24], [540, 940, 28], [160, 560, 14], [940, 600, 14]]} links={[[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [2, 7]]} />
    <Cap top={110}>Network</Cap>
    <H fs={100} top={1040}>Decentralizing <G>scientific discovery.</G></H>
    <Foot n={14} />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg seed="z" glow={1.3} /><Molecule pts={[[920, 200, 26], [1010, 120, 14]]} links={[[0, 1]]} />
    <Logo s={300} style={{ position: "absolute", left: 390, top: 200 }} />
    <div style={{ fontFamily: J, fontWeight: 400, fontSize: 74, color: "#f7ecd0", position: "absolute", left: 0, right: 0, textAlign: "center", top: 540 }}>desciBnb</div>
    <H fs={66} top={680} center>The future of science is <I>decentralized.</I></H>
    <Cap top={960} fs={20} style={{ textAlign: "center", letterSpacing: 8 }}>desciai.vercel.app · @desci_bnb</Cap>
    <Foot n={15} />
  </>
);
export const DesciX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], INK);
