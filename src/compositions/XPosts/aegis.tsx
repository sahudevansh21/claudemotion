import { loadFont } from "@remotion/fonts";
import { Img, random, staticFile } from "remotion";
import "../../config/theme";
import { makeStill } from "./still";

/** AegisNet X-profile posts (15): banner system = black stage with a silver dotted wave, white Inter headline with one italic serif word, "Agentic DeFi Infrastructure" pill, white + dark buttons, two-bar mark. Copy only from the profile, banner, pinned post and site; AegisNet is building on Sepolia testnet. */
loadFont({ family: "AegisSerif", url: staticFile("quantora/fonts/newsreader-latin-400-italic.woff2"), weight: "400", style: "italic" });
const INK = "#050505";
const SILVER = "#c9ccd1";
const DIM = "rgba(255,255,255,0.62)";
const SANS = "Inter, system-ui, sans-serif";
const SERIF = "AegisSerif, Georgia, serif";
const MONO = "'JetBrains Mono', monospace";

const Wave: React.FC<{ y: number; amp?: number; rows?: number; seed?: string }> = ({ y, amp = 90, rows = 20, seed = "w" }) => (
  <svg width={1080} height={520} style={{ position: "absolute", left: 0, top: y }}>
    {Array.from({ length: rows }).map((_, k) => Array.from({ length: 68 }).map((__, i) => {
      const x = i * 16 + 4;
      const yy = 120 + k * 15 + Math.sin(i * 0.11 + k * 0.28) * amp * (0.4 + k / rows) + Math.sin(i * 0.05 - k * 0.1) * amp * 0.5;
      return <circle key={`${k}-${i}`} cx={x} cy={yy} r={1.3 + random(`${seed}${k}${i}`) * 0.8} fill="#fff" opacity={0.25 + (k / rows) * 0.7 * random(`o${seed}${k}${i}`)} />;
    }))}
  </svg>
);
const Bg: React.FC<{ wave?: number | false; seed?: string }> = ({ wave = false, seed }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: INK }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(80% 50% at 50% 0%, rgba(210,215,225,0.20), transparent 70%)" }} />
    {wave !== false && <Wave y={wave} seed={seed} />}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 70%, rgba(5,5,5,0.85) 100%)" }} />
  </>
);
const Mark: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={style}>
    <rect x={18} y={26} width={13} height={60} rx={6.5} fill="#fff" transform="rotate(-22 24 56)" /><circle cx={21} cy={24} r={7.5} fill="#fff" />
    <rect x={52} y={14} width={13} height={60} rx={6.5} fill="#fff" transform="rotate(-22 58 44)" /><circle cx={70} cy={80} r={7.5} fill="#fff" />
  </svg>
);
const Pill: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 26px", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", fontFamily: SANS, fontWeight: 500, fontSize: 24, color: "#fff", ...style }}>
    <span style={{ fontSize: 28 }}>✦</span>{children}
  </div>
);
const Btn: React.FC<{ children: React.ReactNode; solid?: boolean }> = ({ children, solid }) => (
  <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 28, padding: "20px 40px", borderRadius: 10, background: solid ? "#e9e9ea" : "rgba(255,255,255,0.06)", color: solid ? INK : "#fff", border: solid ? "none" : "1px solid rgba(255,255,255,0.2)" }}>{children}</div>
);
const Foot: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", position: "absolute", left: 70, right: 70, bottom: 44, display: "flex", justifyContent: "space-between" }}>
    <span>AegisNet · Building on Sepolia testnet · Not financial advice</span><span>{String(n).padStart(2, "0")}/15</span>
  </div>
);
const H: React.FC<{ children: React.ReactNode; fs: number; top: number; center?: boolean; style?: React.CSSProperties }> = ({ children, fs, top, center, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: fs, lineHeight: 1.02, letterSpacing: -fs * 0.045, color: "#fff", position: "absolute", left: 70, right: 70, top, textAlign: center ? "center" : "left", ...style }}>{children}</div>
);
const I: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: SILVER, letterSpacing: "-0.02em" }}>{children}</span>;
const Sub: React.FC<{ children: React.ReactNode; top: number; w?: number; center?: boolean }> = ({ children, top, w = 820, center }) => (
  <div style={{ fontFamily: SANS, fontSize: 36, lineHeight: 1.3, color: DIM, position: "absolute", left: center ? (1080 - w) / 2 : 70, width: w, top, textAlign: center ? "center" : "left" }}>{children}</div>
);
const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#fff", padding: "14px 22px", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 10, background: "rgba(255,255,255,0.06)", ...style }}>{children}</div>
);
const Shot: React.FC<{ src: string; top: number; h: number; pos?: string }> = ({ src, top, h, pos = "50% 0%" }) => (
  <div style={{ position: "absolute", left: 70, right: 70, top, height: h, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
    <Img src={staticFile(`aegis/site/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
  </div>
);

const P1: React.FC = () => (
  <>
    <Bg wave={720} seed="a" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}><Pill>Agentic DeFi Infrastructure</Pill></div>
    <H fs={118} top={260} center>Let <I>AI agents</I> trade onchain, with a human on the big calls.</H>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", gap: 20 }}><Btn solid>Connect wallet</Btn><Btn>See how it works</Btn></div>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg wave={820} seed="b" /><Mark s={90} style={{ position: "absolute", left: 70, top: 80 }} />
    <H fs={120} top={260}>An AI agent with your wallet and no brakes is a <I>liability.</I></H>
    <Foot n={2} />
  </>
);
const Pillar: React.FC<{ n: number; k: string; head: React.ReactNode; sub: string; chips: string[] }> = ({ n, k, head, sub, chips }) => (
  <>
    <Bg wave={760} seed={`p${n}`} />
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: DIM, textTransform: "uppercase", position: "absolute", left: 70, top: 90 }}>{k}</div>
    <H fs={170} top={200}>{head}</H>
    <Sub top={500}>{sub}</Sub>
    <div style={{ position: "absolute", left: 70, top: 660, display: "flex", gap: 16, flexWrap: "wrap", width: 940 }}>{chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>
    <Foot n={n} />
  </>
);
const P3: React.FC = () => <Pillar n={3} k="01 / A name" head={<>A <I>name.</I></>} sub="AegisNet gives every agent a name (ENS)." chips={["ENS identity"]} />;
const P4: React.FC = () => <Pillar n={4} k="02 / Clean routes" head={<>Clean <I>routes.</I></>} sub="Trades routed through 1inch and Uniswap v4." chips={["1inch SwapVM", "Uniswap v4"]} />;
const P5: React.FC = () => <Pillar n={5} k="03 / A human veto" head={<>A human <I>veto.</I></>} sub="High-value moves pause for World ID proof of human." chips={["World ID"]} />;
const P6: React.FC = () => (
  <>
    <Bg wave={780} seed="r" />
    <H fs={132} top={230}>Routine <I>→</I> auto.</H>
    <H fs={132} top={470}>Big calls <I>→</I> you.</H>
    <Foot n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Bg wave={760} seed="s" /><Mark s={90} style={{ position: "absolute", left: 70, top: 80 }} />
    <H fs={150} top={260}>Agents <I>act.</I></H>
    <H fs={150} top={480}>Humans keep the <I>veto.</I></H>
    <Sub top={900}>The design.</Sub>
    <Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Bg wave={800} seed="t" />
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: DIM, textTransform: "uppercase", position: "absolute", left: 70, top: 90 }}>Every trade</div>
    <H fs={130} top={200}>Small ones <I>run.</I></H>
    <H fs={130} top={420}>Big ones <I>wait.</I></H>
    <H fs={130} top={640}>Rogue ones <I>stop.</I></H>
    <Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Bg wave={820} seed="u" />
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: DIM, textTransform: "uppercase", position: "absolute", left: 70, top: 90 }}>The big calls</div>
    <H fs={140} top={190}>A <I>human</I> on the big calls.</H>
    <div style={{ position: "absolute", left: 70, top: 700, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", width: 940 }}>
      <Chip>≥ $1,000</Chip><span style={{ color: DIM, fontSize: 34 }}>→</span><Chip>Midnight ZK gate</Chip><span style={{ color: DIM, fontSize: 34 }}>→</span><Chip>World ID</Chip><span style={{ color: DIM, fontSize: 34 }}>→</span><Chip>Cleared</Chip>
    </div>
    <Foot n={9} />
  </>
);
const P10: React.FC = () => (
  <>
    <Bg />
    <H fs={110} top={110}>Your AI agent's <I>control room.</I></H>
    <Shot src="dashboard" top={500} h={640} />
    <Foot n={10} />
  </>
);
const P11: React.FC = () => (
  <>
    <Bg />
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: DIM, textTransform: "uppercase", position: "absolute", left: 70, top: 90 }}>Walkthrough</div>
    <H fs={130} top={180}>Five steps, <I>in order.</I></H>
    <Shot src="walkthrough" top={480} h={660} />
    <Foot n={11} />
  </>
);
const P12: React.FC = () => (
  <>
    <Bg wave={760} seed="v" />
    <H fs={150} top={220}>Autonomy for <I>agents.</I></H>
    <H fs={150} top={560}>Control for <I>owners.</I></H>
    <Foot n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Bg wave={800} seed="x" /><Mark s={90} style={{ position: "absolute", left: 70, top: 80 }} />
    <H fs={140} top={260}>Building on Sepolia <I>testnet.</I></H>
    <Sub top={700}>Agents act, humans keep the veto.</Sub>
    <Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg wave={780} seed="y" />
    <H fs={150} top={230}>Give your first agent <I>guardrails.</I></H>
    <div style={{ position: "absolute", left: 70, top: 880, display: "flex", gap: 20 }}><Btn solid>Connect wallet</Btn><Btn>See how it works</Btn></div>
    <Foot n={14} />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg wave={640} seed="z" />
    <Mark s={170} style={{ position: "absolute", left: 455, top: 210 }} />
    <H fs={96} top={430} center>AegisNet</H>
    <H fs={64} top={580} center>Let <I>AI agents</I> trade onchain, with a human on the big calls.</H>
    <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#fff", position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>aegisnet.solrun.fun · @AegisNets</div>
    <Foot n={15} />
  </>
);
export const AegisX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], INK);
