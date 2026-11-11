import { loadFont } from "@remotion/fonts";
import { Img, staticFile } from "remotion";
import { PM, PM_FONTS } from "../Polymate/brand";
import { makeStill } from "./still";

/** PolyMate X-profile posts (15): banner system = golden-hour Rome, cream marble, lapis + gold laurel emblem, Roman red banners, heavy italic Poppins with Instrument Serif accents. UI cards reuse the vocabulary visible on the X banner and are labelled illustrative. */
loadFont({ family: "Cinzel", url: staticFile("polymate/fonts/cinzel-latin-700-normal.woff2"), weight: "700" });
loadFont({ family: "Cinzel", url: staticFile("polymate/fonts/cinzel-latin-500-normal.woff2"), weight: "500" });
const D = PM_FONTS.display; const S = PM_FONTS.serif; const U = PM_FONTS.ui;
const cin = (fs: number, color: string = PM.inkSoft, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: fs, letterSpacing: fs * 0.22, textTransform: "uppercase", color, ...extra });
const NOISE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='4'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0.35 0'/></filter><rect width='500' height='500' filter='url(%23n)'/></svg>")`;

const Marble: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 70% at 30% 20%, ${PM.marble}, ${PM.cream} 70%, ${PM.marbleShade})` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: NOISE, opacity: 0.25, mixBlendMode: "multiply" }} />
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
      <path d="M-20 300 C200 260 260 420 460 380 S760 260 1100 420" fill="none" stroke="#b8ae9a" strokeWidth={1.6} />
      <path d="M-20 980 C180 1020 300 900 520 960 S820 1100 1100 1000" fill="none" stroke="#b8ae9a" strokeWidth={1.2} />
    </svg>
  </>
);
const Lapis: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(90% 60% at 30% 10%, ${PM.lapisLight}, ${PM.lapis} 45%, ${PM.lapisDeep})` }} />
    <svg width={1080} height={1350} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
      <path d="M-20 260 C240 200 360 420 560 340 S860 200 1100 360" fill="none" stroke="#dfe6ff" strokeWidth={2} />
      <path d="M200 1400 C300 1100 520 1000 760 760 S980 420 1100 360" fill="none" stroke="#dfe6ff" strokeWidth={1.4} />
    </svg>
  </>
);
const Banner: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 360 }) => (
  <svg width={110} height={h} viewBox="0 0 110 360" style={{ position: "absolute", left: x, top: y }}>
    <path d="M0 0 H110 V330 L55 360 L0 330 Z" fill="#8E1F1F" /><path d="M8 8 H102 V324 L55 350 L8 324 Z" fill="none" stroke={PM.goldLight} strokeWidth={3} />
    <circle cx={55} cy={150} r={30} fill="none" stroke={PM.goldLight} strokeWidth={4} strokeDasharray="6 5" /><path d="M40 160 q15 -40 30 0" fill="none" stroke={PM.goldLight} strokeWidth={4} />
  </svg>
);
const Emblem: React.FC<{ s: number; style?: React.CSSProperties }> = ({ s, style }) => <Img src={staticFile("polymate/img/emblem.png")} style={{ width: s, height: (s * 1232) / 1476, filter: "drop-shadow(0 20px 30px rgba(60,40,10,0.3))", ...style }} />;
const Photo: React.FC<{ x: number; y: number; w: number; h: number; src?: string; pos?: string; style?: React.CSSProperties }> = ({ x, y, w, h, src = "polymate/img/forum.jpg", pos = "50% 50%", style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", border: `4px solid ${PM.goldLight}`, boxShadow: "0 30px 70px rgba(60,40,10,0.35)", ...style }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} />
  </div>
);
const Foot: React.FC<{ n: number; c?: string }> = ({ n, c = PM.inkSoft }) => (
  <div style={{ ...cin(13, c, { letterSpacing: 4, fontWeight: 500 }), position: "absolute", left: 70, right: 70, bottom: 42, display: "flex", justifyContent: "space-between", zIndex: 5 }}>
    <span>PolyMate · Illustrative UI · Not financial advice</span><span>{String(n).padStart(2, "0")}/15</span>
  </div>
);
const H: React.FC<{ children: React.ReactNode; fs: number; top: number; c?: string; w?: number; center?: boolean; style?: React.CSSProperties }> = ({ children, fs, top, c = PM.ink, w = 940, center, style }) => (
  <div style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: fs, lineHeight: 1.0, letterSpacing: -fs * 0.035, color: c, position: "absolute", left: center ? (1080 - w) / 2 : 70, width: w, top, textAlign: center ? "center" : "left", ...style }}>{children}</div>
);
const Ser: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = PM.lapis }) => <span style={{ fontFamily: S, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: c }}>{children}</span>;
const Tag: React.FC<{ children: React.ReactNode; top?: number; c?: string }> = ({ children, top = 80, c = PM.gold }) => <div style={{ ...cin(18, c), position: "absolute", left: 70, top }}>{children}</div>;
const Card: React.FC<{ x: number; y: number; w: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: "linear-gradient(160deg,#fffdf8,#f1eadb)", border: `2px solid ${PM.goldLight}`, borderRadius: 26, boxShadow: "0 30px 70px rgba(60,40,10,0.28)", boxSizing: "border-box", padding: 40, ...style }}>{children}</div>
);
const Ill: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = PM.muted }) => <div style={{ ...cin(14, c, { fontWeight: 500 }), position: "absolute", left: x, top: y }}>Illustrative · not live data</div>;

const P1: React.FC = () => (
  <>
    <Marble /><Photo x={0} y={0} w={1080} h={800} style={{ border: "none", boxShadow: "none", WebkitMaskImage: "linear-gradient(180deg,#000 62%,transparent 100%)", maskImage: "linear-gradient(180deg,#000 62%,transparent 100%)" }} />
    <Emblem s={330} style={{ position: "absolute", left: 375, top: 520 }} />
    <H fs={150} top={860} center w={1000}>PolyMate</H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 56, color: PM.inkSoft, position: "absolute", left: 60, right: 60, top: 1040, textAlign: "center", lineHeight: 1.1 }}>The trading layer for prediction markets.</div>
    <Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Marble /><Banner x={930} y={0} /><Tag>The trading layer</Tag>
    <div style={{ fontFamily: S, fontSize: 150, lineHeight: 0.98, letterSpacing: -5, color: PM.ink, position: "absolute", left: 70, width: 820, top: 190 }}>The trading layer for <span style={{ fontStyle: "italic", color: PM.lapis }}>prediction markets.</span></div>
    <Emblem s={260} style={{ position: "absolute", left: 70, bottom: 130 }} />
    <Foot n={2} />
  </>
);
const P3: React.FC = () => (
  <>
    <Lapis /><Tag c={PM.goldLight}>Our mission</Tag>
    <H fs={150} top={190} c="#fff">Building tools to <span style={{ color: PM.goldLight }}>trade the future,</span> fast.</H>
    <Emblem s={260} style={{ position: "absolute", right: 70, bottom: 130 }} />
    <Foot n={3} c="rgba(255,255,255,0.7)" />
  </>
);
const P4: React.FC = () => (
  <>
    <Marble /><Tag>Prediction markets</Tag>
    <H fs={200} top={170}>Trade the <Ser>future.</Ser></H>
    <Photo x={70} y={700} w={940} h={470} pos="50% 70%" /><Foot n={4} />
  </>
);
const P5: React.FC = () => (
  <>
    <Marble /><Tag>Join in</Tag>
    <H fs={170} top={170}>↓ Start <Ser>trading.</Ser></H>
    <div style={{ position: "absolute", left: 70, top: 560, background: PM.lapis, color: "#fff", fontFamily: U, fontWeight: 600, fontSize: 46, padding: "28px 56px", borderRadius: 99, boxShadow: "0 20px 50px rgba(36,69,196,0.4)" }}>t.me/Tryoddsbot</div>
    <Photo x={560} y={820} w={450} h={380} src="polymate/img/robot.jpg" pos="50% 30%" /><Emblem s={240} style={{ position: "absolute", left: 70, top: 870 }} />
    <Foot n={5} />
  </>
);
const P6: React.FC = () => (
  <>
    <Marble /><Tag>Inside PolyMate</Tag>
    <H fs={108} top={140}>Trade. Markets. <Ser>Positions.</Ser></H>
    <Card x={70} y={540} w={940} h={640} style={{ padding: 34 }}>
      <div style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 40, color: PM.ink, marginBottom: 22 }}>PolyMate</div>
      {["Trade", "Markets", "Positions", "Strategy", "Balance"].map((t, i) => (
        <div key={t} style={{ height: 82, marginBottom: 12, borderRadius: 16, display: "flex", alignItems: "center", padding: "0 30px", fontFamily: U, fontWeight: 600, fontSize: 38, background: i === 0 ? "#8E1F1F" : "transparent", color: i === 0 ? "#fff" : PM.inkSoft }}>{t}</div>
      ))}
    </Card>
    <Ill x={70} y={1190} /><Foot n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Marble /><Tag>Live Markets</Tag>
    <H fs={150} top={140}>Live <Ser>Markets.</Ser></H>
    <Card x={70} y={440} w={940} h={700} style={{ padding: 34 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ height: 190, borderBottom: i < 2 ? `2px solid ${PM.marbleShade}` : "none", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ height: 22, width: 360 - i * 50, background: "#d9d1c0", borderRadius: 11 }} /><div style={{ height: 16, width: 230, background: "#e8e1d2", borderRadius: 8, marginTop: 18 }} /></div>
          <div style={{ display: "flex", gap: 12 }}>{["YES", "NO"].map((k, j) => <div key={k} style={{ fontFamily: U, fontWeight: 700, fontSize: 28, padding: "14px 26px", borderRadius: 14, background: j ? "#f3dcdc" : "#dbe6ff", color: j ? "#8E1F1F" : PM.lapis }}>{k}</div>)}</div>
        </div>
      ))}
    </Card>
    <Ill x={70} y={1170} /><Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Marble /><Tag>Position opened</Tag>
    <H fs={150} top={140}>Position <Ser>Opened.</Ser></H>
    <Card x={140} y={560} w={800} h={300} style={{ display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ width: 120, height: 120, borderRadius: 28, background: "#1f9d55", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={64} height={64} viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"><path d="M16 48 L48 16 M24 16 H48 V40" /></svg></div>
      <div><div style={{ fontFamily: U, fontWeight: 700, fontSize: 46, color: PM.ink }}>Position Opened</div><div style={{ fontFamily: U, fontSize: 36, color: PM.inkSoft, marginTop: 10 }}>YES · $50</div></div>
    </Card>
    <Ill x={140} y={900} /><Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Lapis /><Tag c={PM.goldLight}>In motion</Tag>
    <H fs={150} top={140} c="#fff">Executing <span style={{ color: PM.goldLight }}>Trade…</span></H>
    <Card x={140} y={560} w={800} h={240} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ fontFamily: U, fontWeight: 700, fontSize: 40, color: PM.ink }}>⚡ Executing Trade…</div>
      <div style={{ height: 22, borderRadius: 11, background: "#e4dccd", marginTop: 28, overflow: "hidden" }}><div style={{ width: "58%", height: "100%", background: `linear-gradient(90deg, ${PM.gold}, ${PM.goldLight})` }} /></div>
    </Card>
    <Photo x={640} y={860} w={370} h={340} src="polymate/img/robot.jpg" pos="50% 30%" />
    <div style={{ ...cin(14, "rgba(255,255,255,0.7)", { fontWeight: 500 }), position: "absolute", left: 70, top: 880 }}>Illustrative · not live data</div>
    <Foot n={9} c="rgba(255,255,255,0.7)" />
  </>
);
const P10: React.FC = () => (
  <>
    <Marble /><Banner x={60} y={0} h={300} />
    <div style={{ ...cin(24, PM.gold), position: "absolute", left: 220, top: 100 }}>PolyMate Weekly</div>
    <H fs={140} top={420}>Another week. More progress. <Ser>A major milestone ahead.</Ser></H>
    <Foot n={10} />
  </>
);
const P11: React.FC = () => (
  <>
    <Marble /><Emblem s={520} style={{ position: "absolute", left: 280, top: 140 }} />
    <H fs={300} top={720} center w={1000}>Fast.</H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 50, color: PM.inkSoft, position: "absolute", left: 0, right: 0, textAlign: "center", top: 1070 }}>Tools to trade the future.</div>
    <Foot n={11} />
  </>
);
const P12: React.FC = () => (
  <>
    <Marble /><Tag>Two outcomes</Tag>
    <H fs={104} top={140}>Pick a side. <Ser>YES or NO.</Ser></H>
    <div style={{ position: "absolute", left: 70, top: 520, width: 450, height: 560, borderRadius: 30, background: `linear-gradient(160deg, ${PM.lapisLight}, ${PM.lapisDeep})`, boxShadow: "0 30px 70px rgba(19,42,128,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 150, color: "#fff" }}>YES</span></div>
    <div style={{ position: "absolute", left: 560, top: 520, width: 450, height: 560, borderRadius: 30, background: "linear-gradient(160deg,#b02a2a,#6f1414)", boxShadow: "0 30px 70px rgba(111,20,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 150, color: "#fff" }}>NO</span></div>
    <Ill x={70} y={1110} /><Foot n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Marble /><Tag>Meet</Tag>
    <H fs={190} top={150}>Meet <Ser>PolyMate.</Ser></H>
    <Photo x={190} y={560} w={700} h={640} src="polymate/img/robot.jpg" pos="50% 30%" />
    <Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Photo x={0} y={0} w={1080} h={1350} pos="50% 62%" style={{ border: "none", boxShadow: "none" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,12,4,0.05) 20%, rgba(20,12,4,0.82) 100%)" }} />
    <H fs={150} top={640} c="#fff">Trade the future, <span style={{ color: PM.goldLight }}>fast.</span></H>
    <Foot n={14} c="rgba(255,255,255,0.8)" />
  </>
);
const P15: React.FC = () => (
  <>
    <Marble /><Banner x={60} y={0} h={300} /><Banner x={910} y={0} h={300} />
    <Emblem s={420} style={{ position: "absolute", left: 330, top: 220 }} />
    <H fs={140} top={680} center w={1000}>PolyMate</H>
    <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 50, color: PM.inkSoft, position: "absolute", left: 60, right: 60, top: 860, textAlign: "center" }}>The trading layer for prediction markets.</div>
    <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 990 }}><span style={{ display: "inline-block", background: PM.lapis, color: "#fff", fontFamily: U, fontWeight: 600, fontSize: 38, padding: "22px 48px", borderRadius: 99 }}>t.me/Tryoddsbot</span></div>
    <div style={{ ...cin(20, PM.gold), position: "absolute", left: 0, right: 0, textAlign: "center", top: 1120 }}>@Polymatedotfun</div>
    <Foot n={15} />
  </>
);
export const PolymateX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], PM.cream);
