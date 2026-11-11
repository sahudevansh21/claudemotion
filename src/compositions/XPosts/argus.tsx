import { Img, random, staticFile } from "remotion";
import "../../config/theme";
import { makeStill } from "./still";

/** ARGUS X-profile posts (15): banner system = black stage with a teal-green UV glow and fluorescent specks, white grotesk headline with the key phrase in mint gradient, gold swirl logo. Figures (15 ms inference, 99.4% precision) are quoted from the Argus profile; detection visuals are illustrative. */
const INK = "#030504";
const MINT = "#2ee6a6";
const SOFT = "rgba(255,255,255,0.66)";
const GOLD = "#e8c43a";
const SANS = "Inter, system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

const Specks: React.FC<{ cx: number; cy: number; n?: number; spread?: number; seed?: string; max?: number }> = ({ cx, cy, n = 70, spread = 420, seed = "a", max = 7 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: n }).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2; const d = Math.pow(random(`${seed}d${i}`), 0.7) * spread;
      const r = 1.5 + random(`${seed}r${i}`) * max;
      return <circle key={i} cx={cx + Math.cos(a) * d * 1.25} cy={cy + Math.sin(a) * d * 0.8} r={r} fill={MINT} opacity={0.25 + random(`${seed}o${i}`) * 0.7} style={{ filter: `blur(${r > 5 ? 1.5 : 0}px)` }} />;
    })}
  </svg>
);
const Bg: React.FC<{ cx?: number; cy?: number; seed?: string; n?: number; glow?: number }> = ({ cx = 760, cy = 330, seed, n = 60, glow = 1 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: INK }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 40% at ${(cx / 1080) * 100}% ${(cy / 1350) * 100}%, rgba(20,200,140,${0.55 * glow}), rgba(8,100,70,${0.25 * glow}) 45%, transparent 75%)` }} />
    {seed && <Specks cx={cx} cy={cy} seed={seed} n={n} />}
  </>
);
const Logo: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => <Img src={staticFile("argus/logo.png")} style={{ width: w, height: (w * 370) / 1070, ...style }} />;
const Foot: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", position: "absolute", left: 70, right: 70, bottom: 44, display: "flex", justifyContent: "space-between" }}>
    <span>Argus · Figures as stated on the Argus profile · Illustrative visuals</span><span>{String(n).padStart(2, "0")}/15</span>
  </div>
);
const H: React.FC<{ children: React.ReactNode; fs: number; top: number; center?: boolean; style?: React.CSSProperties }> = ({ children, fs, top, center, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: fs, lineHeight: 1.02, letterSpacing: -fs * 0.04, color: "#f4f6f5", position: "absolute", left: 70, right: 70, top, textAlign: center ? "center" : "left", ...style }}>{children}</div>
);
const G: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ background: `linear-gradient(90deg, #7ff5c9, ${MINT} 50%, #12b783)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{children}</span>;
const Sub: React.FC<{ children: React.ReactNode; top: number; w?: number }> = ({ children, top, w = 840 }) => <div style={{ fontFamily: SANS, fontSize: 38, lineHeight: 1.3, color: SOFT, position: "absolute", left: 70, width: w, top }}>{children}</div>;
const Tag: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 90 }) => <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: MINT, position: "absolute", left: 70, top }}>{children}</div>;
const Card: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", boxSizing: "border-box", padding: 40, ...style }}>{children}</div>
);
const Viewfinder: React.FC<{ x: number; y: number; w: number; h: number; seed: string }> = ({ x, y, w, h, seed }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", background: "#04100c" }}>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(60% 55% at 55% 50%, rgba(25,210,150,0.45), transparent 70%)" }} />
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 34 }).map((_, i) => <circle key={i} cx={random(`${seed}x${i}`) * w} cy={random(`${seed}y${i}`) * h} r={2 + random(`${seed}r${i}`) * 6} fill={MINT} opacity={0.3 + random(`${seed}o${i}`) * 0.6} />)}
      {[0, 1, 2].map((i) => { const bx = 80 + random(`${seed}bx${i}`) * (w - 260); const by = 70 + random(`${seed}by${i}`) * (h - 220); return <rect key={i} x={bx} y={by} width={110} height={90} fill="none" stroke={GOLD} strokeWidth={3} rx={4} />; })}
      {[[40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={4} fill="#fff" opacity={0.6} />)}
    </svg>
    <div style={{ position: "absolute", left: 22, top: 18, fontFamily: MONO, fontSize: 15, letterSpacing: 3, color: "#fff", opacity: 0.7, textTransform: "uppercase" }}>Illustrative · UV view</div>
  </div>
);

const P1: React.FC = () => (
  <>
    <Bg seed="p1" cx={780} cy={380} /><Logo w={330} style={{ position: "absolute", left: 70, top: 90 }} />
    <H fs={150} top={330}>Making the <G>Invisible Visible.</G></H>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg seed="p2" cx={800} cy={1000} n={50} /><Tag>Argus</Tag>
    <H fs={118} top={170}>Detecting microbial contamination <G>invisible to the human eye.</G></H>
    <Foot n={2} />
  </>
);
const Step: React.FC<{ n: number; k: string; head: React.ReactNode; sub: string; seed: string }> = ({ n, k, head, sub, seed }) => (
  <>
    <Bg seed={seed} cx={560} cy={940} n={80} glow={0.9} /><Tag>{k}</Tag>
    <H fs={156} top={210}>{head}</H>
    <Sub top={760}>{sub}</Sub>
    <Foot n={n} />
  </>
);
const P3: React.FC = () => <Step n={3} k="01 / Detect" head={<><G>UV</G> fluorescence.</>} sub="Contamination that is invisible to the human eye." seed="p3" />;
const P4: React.FC = () => <Step n={4} k="02 / See" head={<>Optical <G>CV.</G></>} sub="Computer vision reads what the light reveals." seed="p4" />;
const P5: React.FC = () => <Step n={5} k="03 / Decide" head={<>Biomedical <G>AI.</G></>} sub="Built on Virtu." seed="p5" />;
const P6: React.FC = () => (
  <>
    <Bg seed="p6" cx={540} cy={1000} n={40} glow={0.6} /><Tag>The stack</Tag>
    <H fs={110} top={160}>One pipeline, <G>three layers.</G></H>
    {["UV fluorescence", "Optical CV", "Biomedical AI"].map((t, i) => (
      <Card key={t} x={70} y={520 + i * 220} w={940} h={180} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, letterSpacing: -2, color: "#fff" }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 24, color: MINT }}>0{i + 1}</span>
      </Card>
    ))}
    <Foot n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Bg seed="p7" cx={800} cy={420} /><Tag>Speed</Tag>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 380, letterSpacing: -18, lineHeight: 0.9, position: "absolute", left: 60, top: 210 }}><G>15</G></div>
    <H fs={120} top={620}>ms inference.</H>
    <Sub top={850}>Stated on the Argus profile.</Sub>
    <Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Bg seed="p8" cx={800} cy={420} /><Tag>Precision</Tag>
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 330, letterSpacing: -16, lineHeight: 0.9, position: "absolute", left: 60, top: 220 }}><G>99.4%</G></div>
    <H fs={120} top={600}>precision.</H>
    <Sub top={830}>Stated on the Argus profile.</Sub>
    <Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Bg glow={0.35} cx={540} cy={700} /><H fs={230} top={330} center>It looks <br />clean.</H>
    <Foot n={9} />
  </>
);
const P10: React.FC = () => (
  <>
    <Bg seed="p10" cx={540} cy={700} n={110} /><Logo w={300} style={{ position: "absolute", left: 390, top: 180 }} />
    <H fs={130} top={420} center>Argus makes the <G>invisible visible.</G></H>
    <Foot n={10} />
  </>
);
const P11: React.FC = () => (
  <>
    <Bg glow={0.4} /><Tag>Look closer</Tag>
    <H fs={120} top={150}>Invisible to the <G>human eye.</G></H>
    <Viewfinder x={70} y={560} w={940} h={600} seed="v1" />
    <Foot n={11} />
  </>
);
const P12: React.FC = () => (
  <>
    <Bg seed="p12" cx={540} cy={800} n={50} glow={0.7} /><Tag>Foundation</Tag>
    <H fs={200} top={260}>Built on <G>Virtu.</G></H>
    <Foot n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Bg glow={0.5} cx={300} cy={900} /><Tag>Two views</Tag>
    <H fs={110} top={150}>Same surface. <G>Two views.</G></H>
    <Card x={70} y={560} w={450} h={520} style={{ background: "#12161a", padding: 28 }}><div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 4, color: SOFT, textTransform: "uppercase" }}>To the eye</div><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 64, color: "#fff", marginTop: 20 }}>It looks clean.</div></Card>
    <Viewfinder x={560} y={560} w={450} h={520} seed="v2" />
    <Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg seed="p14" cx={540} cy={1000} n={50} glow={0.6} /><Tag>At a glance</Tag>
    <H fs={110} top={150}>Fast. Precise. <G>Visible.</G></H>
    {[["15 ms", "inference"], ["99.4%", "precision"], ["3 layers", "UV fluorescence, optical CV, biomedical AI"]].map(([a, b], i) => (
      <Card key={a} x={70} y={480 + i * 230} w={940} h={200} style={{ display: "flex", alignItems: "center", gap: 36, padding: "0 44px" }}>
        <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: -3, color: MINT, minWidth: 330 }}>{a}</span><span style={{ fontFamily: SANS, fontSize: 32, color: SOFT, lineHeight: 1.25 }}>{b}</span>
      </Card>
    ))}
    <Foot n={14} />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg seed="p15" cx={540} cy={600} n={40} /><Logo w={420} style={{ position: "absolute", left: 330, top: 340 }} />
    <H fs={84} top={640} center>Making the <G>Invisible Visible.</G></H>
    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#fff", position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>argus-iota.vercel.app · @argus_io</div>
    <Foot n={15} />
  </>
);
export const ArgusX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], INK);
