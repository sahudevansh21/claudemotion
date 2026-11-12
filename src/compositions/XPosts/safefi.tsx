import { Img, staticFile } from "remotion";
import "../../config/theme";
import { makeStill } from "./still";

/** SafeFi X-profile posts (15): banner system = clean white stage with a faint grid and rings, heavy black grotesk headlines (bold + regular pairing), the black arrow wordmark, a glossy shield with an orbit and floating coin tiles. Copy only from the profile, banner and pinned post. */
export const BG = "#fbfbfb";
export const INK = "#0d0d0f";
export const SOFT = "#5c5c63";
export const SANS = "Inter, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', monospace";

export const Bg: React.FC<{ rings?: boolean; dark?: boolean }> = ({ rings = true, dark }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: dark ? INK : BG }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px), linear-gradient(90deg, ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"} 1px, transparent 1px)`, backgroundSize: "180px 180px" }} />
    {rings && (
      <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>
        <circle cx={880} cy={420} r={420} fill="none" stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"} strokeWidth={2} />
        <circle cx={880} cy={420} r={300} fill="none" stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth={2} />
      </svg>
    )}
  </>
);
export const Logo: React.FC<{ w: number; style?: React.CSSProperties; invert?: boolean }> = ({ w, style, invert }) => (
  <Img src={staticFile("safefi/logo.png")} style={{ width: w, height: (w * 360) / 1680, filter: invert ? "invert(1)" : undefined, ...style }} />
);
export const Shield: React.FC<{ s: number; style?: React.CSSProperties; orbit?: boolean }> = ({ s, style, orbit = true }) => (
  <svg width={s} height={s * 1.1} viewBox="0 0 260 286" style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#e4e4e7" /><stop offset="1" stopColor="#b9b9bf" /></linearGradient>
      <filter id="ssh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#000" floodOpacity="0.25" /></filter>
    </defs>
    <g transform="translate(30 20)" filter="url(#ssh)">
      <path d="M100 6 L186 38 V124 C186 186 148 228 100 248 C52 228 14 186 14 124 V38 Z" fill="url(#sg)" stroke="#26262a" strokeWidth={8} strokeLinejoin="round" />
      <path d="M100 26 L168 51 V124 C168 175 138 210 100 227 C62 210 32 175 32 124 V51 Z" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={3} />
      <path d="M56 124 L90 158 L148 86" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    {orbit && (
      <g transform="rotate(-14 130 150)">
        <ellipse cx={130} cy={150} rx={150} ry={46} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="0" opacity={0.85} />
        <path d="M262 122 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill={INK} />
      </g>
    )}
  </svg>
);
export const Tile: React.FC<{ x: number; y: number; s?: number; kind: "eth" | "btc" | "lines" }> = ({ x, y, s = 84, kind }) => (
  <div style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: s * 0.28, background: "#fff", boxShadow: "0 14px 36px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {kind === "eth" && <svg width={s * 0.4} height={s * 0.56} viewBox="0 0 40 56"><path d="M20 0 L38 28 20 38 2 28z M20 42 L38 32 20 56 2 32z" fill={INK} /></svg>}
    {kind === "btc" && <svg width={s * 0.4} height={s * 0.5} viewBox="0 0 40 50"><path d="M8 6 H24 C32 6 34 12 32 17 C30 21 27 22 24 22 C30 22 34 25 33 32 C32 40 26 44 18 44 H8z M16 14 V20 H22 C26 20 26 14 22 14z M16 28 V36 H23 C28 36 28 28 23 28z" fill={INK} fillRule="evenodd" /><rect x={14} y={0} width={4} height={50} fill={INK} /><rect x={22} y={0} width={4} height={50} fill={INK} /></svg>}
    {kind === "lines" && <svg width={s * 0.42} height={s * 0.34} viewBox="0 0 42 34"><path d="M2 4h38M2 17h38M2 30h38" stroke={INK} strokeWidth={7} strokeLinecap="round" /></svg>}
  </div>
);
export const Foot: React.FC<{ n: number; total?: number; dark?: boolean }> = ({ n, total = 15, dark }) => (
  <div style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 3, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.55)" : "rgba(13,13,15,0.5)", position: "absolute", left: 70, right: 70, bottom: 44, display: "flex", justifyContent: "space-between" }}>
    <span>SafeFi · Illustrative graphics · Not financial advice</span><span>{String(n).padStart(2, "0")}/{total}</span>
  </div>
);
export const H: React.FC<{ children: React.ReactNode; fs: number; top: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ children, fs, top, c = INK, w = 940, style }) => (
  <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: fs, lineHeight: 1.0, letterSpacing: -fs * 0.045, color: c, position: "absolute", left: 70, width: w, top, ...style }}>{children}</div>
);
export const L: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ fontWeight: 400 }}>{children}</span>;
export const Sub: React.FC<{ children: React.ReactNode; top: number; c?: string; w?: number }> = ({ children, top, c = SOFT, w = 800 }) => <div style={{ fontFamily: SANS, fontSize: 38, lineHeight: 1.3, color: c, position: "absolute", left: 70, width: w, top }}>{children}</div>;
export const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({ children, style, dark }) => (
  <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, padding: "16px 28px", borderRadius: 99, background: dark ? "rgba(255,255,255,0.1)" : "#fff", color: dark ? "#fff" : INK, boxShadow: dark ? "0 0 0 1px rgba(255,255,255,0.2)" : "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)", display: "inline-block", ...style }}>{children}</div>
);

const P1: React.FC = () => (
  <>
    <Bg /><Logo w={460} style={{ position: "absolute", left: 70, top: 100 }} />
    <H fs={112} top={290}>Decentralized Insurance <L>for Your Digital Assets</L></H>
    <Shield s={440} style={{ position: "absolute", left: 540, top: 860 }} /><Tile x={470} y={1010} kind="btc" /><Tile x={960} y={880} s={78} kind="eth" /><Tile x={900} y={1180} s={70} kind="lines" />
    <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 28, color: SOFT, position: "absolute", left: 70, top: 1100 }}>Built for the Web3 Era</div>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg /><Shield s={200} orbit={false} style={{ position: "absolute", left: 70, top: 110 }} />
    <H fs={150} top={430}>Decentralized protection <L>for your digital assets.</L></H>
    <Foot n={2} />
  </>
);
const P3: React.FC = () => (
  <>
    <Bg /><div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: SOFT, position: "absolute", left: 70, top: 100, textTransform: "uppercase" }}>01</div>
    <H fs={210} top={200}>On-chain security.</H>
    <Tile x={80} y={880} kind="lines" /><Tile x={200} y={880} kind="eth" /><Tile x={320} y={880} kind="btc" />
    <Foot n={3} />
  </>
);
const P4: React.FC = () => (
  <>
    <Bg /><div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: SOFT, position: "absolute", left: 70, top: 100, textTransform: "uppercase" }}>02</div>
    <H fs={190} top={200}>Web3 insurance.</H>
    <Shield s={300} style={{ position: "absolute", left: 640, top: 820 }} />
    <Foot n={4} />
  </>
);
const P5: React.FC = () => (
  <>
    <Bg /><div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: SOFT, position: "absolute", left: 70, top: 100, textTransform: "uppercase" }}>03</div>
    <H fs={165} top={200}>Building a safer <L>decentralized future.</L></H>
    <Foot n={5} />
  </>
);
const P6: React.FC = () => (
  <>
    <Bg rings={false} />
    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 420, lineHeight: 0.8, color: "rgba(0,0,0,0.07)", position: "absolute", left: 50, top: 80 }}>“</div>
    <H fs={128} top={330}>Because “hoping nothing breaks” <L>isn’t a security strategy.</L></H>
    <Logo w={300} style={{ position: "absolute", left: 70, bottom: 130 }} />
    <Foot n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Bg /><H fs={120} top={130}>What we talk about.</H>
    {["Smart contract risk", "DeFi", "Crypto insurance"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 440 + i * 220, borderTop: "2px solid rgba(0,0,0,0.12)", paddingTop: 34, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 84, letterSpacing: -4, color: INK }}>{t}</span><span style={{ fontFamily: MONO, fontSize: 20, color: SOFT }}>0{i + 1}</span>
      </div>
    ))}
    <Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Bg /><div style={{ position: "absolute", left: 70, top: 110, display: "flex", alignItems: "center", gap: 18 }}>
      <svg width={64} height={64} viewBox="0 0 64 64" fill="none" stroke={INK} strokeWidth={4}><circle cx={32} cy={32} r={26} /><ellipse cx={32} cy={32} rx={11} ry={26} /><path d="M6 32h52M10 18h44M10 46h44" /></svg>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: INK }}>Built for the Web3 Era</span>
    </div>
    <H fs={190} top={300}>Built for the <L>Web3 era.</L></H>
    <Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Bg /><H fs={124} top={120}>Your digital assets, <L>protected by design.</L></H>
    <Shield s={420} style={{ position: "absolute", left: 330, top: 640 }} /><Tile x={190} y={760} kind="eth" /><Tile x={820} y={720} kind="btc" /><Tile x={790} y={1030} s={72} kind="lines" />
    <Foot n={9} />
  </>
);
const P10: React.FC = () => (
  <>
    <Bg dark rings /><Logo w={360} invert style={{ position: "absolute", left: 70, top: 100 }} />
    <H fs={124} top={300} c="#fff">Decentralized <L>insurance.</L></H>
    <Sub top={760} c="rgba(255,255,255,0.65)">On-chain security. Web3 insurance.</Sub>
    <Foot n={10} dark />
  </>
);
const P11: React.FC = () => (
  <>
    <Bg /><H fs={142} top={120}>A safer decentralized <L>future.</L></H>
    <Shield s={520} style={{ position: "absolute", left: 280, top: 600 }} /><Tile x={130} y={700} kind="btc" /><Tile x={860} y={640} kind="eth" /><Tile x={880} y={1000} s={70} kind="lines" />
    <Foot n={11} />
  </>
);
const P12: React.FC = () => (
  <>
    <Bg rings={false} />
    <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: SOFT, position: "absolute", left: 70, top: 100, textTransform: "uppercase" }}>Not a strategy</div>
    <H fs={150} top={220} c="rgba(13,13,15,0.35)" style={{ textDecoration: "line-through", textDecorationThickness: 8 }}>Hoping nothing breaks</H>
    <H fs={150} top={640}>is not a security <L>strategy.</L></H>
    <Foot n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Bg /><H fs={104} top={120}>Smart contract risk. <L>DeFi. Crypto insurance.</L></H>
    <Shield s={300} style={{ position: "absolute", left: 640, top: 800 }} />
    <div style={{ position: "absolute", left: 70, top: 600, display: "flex", gap: 16, flexWrap: "wrap", width: 940 }}>{["#SafeFi", "#SmartContractRisk", "#DeFi", "#CryptoInsurance"].map((t) => <Chip key={t}>{t}</Chip>)}</div>
    <Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg dark /><Shield s={260} style={{ position: "absolute", left: 70, top: 140 }} />
    <H fs={140} top={520} c="#fff">See what we’re <L>building.</L></H>
    <div style={{ position: "absolute", left: 70, top: 900 }}><Chip dark style={{ fontSize: 34 }}>safefisolana.vercel.app</Chip></div>
    <Foot n={14} dark />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg /><Shield s={300} style={{ position: "absolute", left: 390, top: 150 }} />
    <Logo w={560} style={{ position: "absolute", left: 260, top: 590 }} />
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, color: INK, position: "absolute", left: 60, right: 60, top: 760, textAlign: "center" }}>Decentralized protection for your digital assets.</div>
    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: SOFT, position: "absolute", left: 0, right: 0, top: 960, textAlign: "center" }}>safefisolana.vercel.app · @safefi_io</div>
    <Foot n={15} />
  </>
);
export const SafefiX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], BG);
