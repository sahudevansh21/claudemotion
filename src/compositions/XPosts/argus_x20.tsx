import { Bg, Foot, GOLD, G, INK, Logo, MINT, MONO, SANS, SOFT, Viewfinder } from "./argus";
import { random } from "remotion";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/argus.json";

/** ARGUS: 20 new posts in the banner system (black stage, UV-green glow and fluorescent specks, white grotesk with mint key phrase, gold swirl logo). Figures are quoted from the profile; visuals are illustrative. */
const tone = { ink: "#f4f6f5", mute: SOFT, accent: MINT, line: "rgba(255,255,255,0.2)" };
const card = (x: number, y: number, w: number, h: number, c: React.ReactNode) => <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 24, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)", boxSizing: "border-box", padding: 34 }}>{c}</div>;
const theme: Theme = {
  cw: 0.54, sCw: 0.52, lh: 1.03, hMax: 148, hMin: 56,
  tone: () => tone,
  bg: (n) => <Bg cx={[760, 300, 540, 860][n % 4]} cy={[380, 900, 1000, 600][n % 4]} seed={`g${n}`} n={46} glow={0.8} />,
  foot: (n) => <Foot n={n} total={20} />,
  lab: (t) => <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: MINT, textTransform: "uppercase", position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs) => ({ fontFamily: SANS, fontWeight: 600, fontSize: fs, letterSpacing: -fs * 0.04, color: "#f4f6f5" }),
  accent: (t) => <G>{t}</G>,
  s: (fs) => ({ fontFamily: SANS, fontSize: fs, color: SOFT, lineHeight: 1.3 }),
  num: (i) => <div style={{ fontFamily: MONO, fontSize: 22, color: MINT, width: 50 }}>{String(i + 1).padStart(2, "0")}</div>,
  opt: (i, t, w, h) => (<div style={{ width: w, height: h, borderRadius: 22, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 30, padding: "0 34px", boxSizing: "border-box" }}><span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 56, color: MINT, width: 50 }}>{"ABCD"[i]}</span><span style={{ fontFamily: SANS, fontWeight: 500, fontSize: Math.min(44, h * 0.34), color: "#fff", lineHeight: 1.1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, _t, i) => card(b.x, b.y, b.w, b.h, <div style={{ color: i ? MINT : "#fff" }}>{c}</div>),
  vis: (v, b: Box) => {
    const h = Math.min(b.h - 10, 520);
    if (v === "vf") return <Viewfinder x={b.x} y={b.y + 10} w={b.w} h={h} seed={`v${Math.round(b.y)}`} />;
    if (v === "specks") return (<svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={random(`sx${i}${b.y}`) * 940 + 70} cy={b.y + random(`sy${i}${b.y}`) * Math.max(80, h)} r={1.5 + random(`sr${i}`) * 6} fill={MINT} opacity={0.3 + random(`so${i}`) * 0.6} />)}</svg>);
    if (v === "pipe") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w, display: "flex", gap: 14, alignItems: "center" }}>{["UV fluorescence", "Optical CV", "Biomedical AI"].map((t, i) => <span key={t} style={{ display: "contents" }}><div style={{ flex: 1, borderRadius: 18, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", padding: "26px 20px", fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "#fff", textAlign: "center" }}>{t}</div>{i < 2 && <span style={{ color: MINT, fontSize: 36 }}>→</span>}</span>)}</div>;
    if (v === "stats") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w, display: "flex", gap: 20 }}>{[["15 ms", "inference"], ["99.4%", "precision"]].map(([a, c]) => <div key={a} style={{ flex: 1, borderRadius: 22, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.16)", padding: 30 }}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 84, letterSpacing: -3, color: MINT }}>{a}</div><div style={{ fontFamily: SANS, fontSize: 30, color: SOFT }}>{c} · as stated on the Argus profile</div></div>)}</div>;
    if (v === "prec") return (<div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w }}><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{Array.from({ length: 100 }).map((_, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 20, background: i === 99 ? GOLD : MINT, opacity: i === 99 ? 1 : 0.8 }} />)}</div><div style={{ fontFamily: MONO, fontSize: 18, color: SOFT, marginTop: 20, letterSpacing: 2 }}>If precision is 99.4%, about 994 of 1,000 flags are correct. Illustrative arithmetic.</div></div>);
    return null;
  },
  end: (it) => (<><Logo w={420} style={{ position: "absolute", left: 330, top: 340 }} /><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 70, letterSpacing: -2, color: "#fff", position: "absolute", left: 60, right: 60, top: 640, textAlign: "center", lineHeight: 1.05 }}>{it.s}</div><div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#fff", position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center" }}>argus-iota.vercel.app · @argus_io</div></>),
};
export const ArgusX20 = makeAccount(theme, data as Item[], INK);
