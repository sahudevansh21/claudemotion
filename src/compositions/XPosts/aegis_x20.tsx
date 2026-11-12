import { Bg, Chip, Foot, Mark, SANS, SERIF, Shot } from "./aegis";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/aegis.json";

/** AegisNet: 20 new posts in the banner system (black stage, silver wave, white Inter, italic serif accent). Building on Sepolia testnet. */
const MONO = "'JetBrains Mono', monospace";
const tone = { ink: "#f4f6f5", mute: "rgba(255,255,255,0.62)", accent: "#c9ccd1", line: "rgba(255,255,255,0.2)" };
const flow = (items: string[]) => <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14 }}>{items.map((t, i) => <span key={t} style={{ display: "contents" }}><Chip>{t}</Chip>{i < items.length - 1 && <span style={{ color: tone.mute, fontSize: 34 }}>→</span>}</span>)}</div>;
const theme: Theme = {
  cw: 0.53, sCw: 0.52, lh: 1.03, hMax: 148, hMin: 56,
  tone: () => tone,
  bg: (n, it) => <Bg wave={it.bg === "wave" && it.k !== "poll" && it.k !== "list" ? 700 + (n % 3) * 60 : false} seed={`a${n}`} />,
  foot: (n) => <Foot n={n} total={20} />,
  lab: (t) => <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: tone.mute, textTransform: "uppercase", position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs) => ({ fontFamily: SANS, fontWeight: 500, fontSize: fs, letterSpacing: -fs * 0.045, color: "#fff" }),
  accent: (t) => <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: tone.accent, letterSpacing: "-0.02em" }}>{t}</span>,
  s: (fs) => ({ fontFamily: SANS, fontSize: fs, color: tone.mute, lineHeight: 1.3 }),
  num: (i) => <div style={{ fontFamily: MONO, fontSize: 22, color: tone.mute, width: 50 }}>{String(i + 1).padStart(2, "0")}</div>,
  opt: (i, t, w, h) => (<div style={{ width: w, height: h, borderRadius: 18, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", gap: 30, padding: "0 34px", boxSizing: "border-box" }}><span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: tone.accent, width: 50 }}>{"ABCD"[i]}</span><span style={{ fontFamily: SANS, fontWeight: 500, fontSize: Math.min(44, h * 0.34), color: "#fff", lineHeight: 1.1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, _t, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 22, background: i ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.18)", padding: 34, boxSizing: "border-box", color: "#fff" }}>{c}</div>,
  vis: (v, b: Box) => {
    const [k, id] = v.split(":");
    if (k === "shot") return <Shot src={id} top={b.y} h={Math.min(b.h, 560)} />;
    if (v === "flow") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w }}>{flow(["≥ $1,000", "Midnight ZK gate", "World ID", "Cleared"])}</div>;
    if (v === "route") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w }}>{flow(["Agent", "1inch SwapVM", "Uniswap v4", "Onchain"])}</div>;
    if (v === "gate") return (<div style={{ position: "absolute", left: b.x, top: b.y, width: b.w }}>{[["Small trade", "RUNS"], ["Big trade", "WAITS"], ["Rogue trade", "STOPS"]].map(([a, c]) => <div key={a} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 100, borderBottom: `1px solid ${tone.line}` }}><span style={{ fontFamily: SANS, fontSize: 42, color: "#fff" }}>{a}</span><Chip>{c}</Chip></div>)}</div>);
    if (v === "ens") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w, borderRadius: 22, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", padding: "40px 44px", boxSizing: "border-box" }}><div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: tone.mute, textTransform: "uppercase" }}>Agent identity · ENS</div><div style={{ fontFamily: MONO, fontSize: 52, color: "#fff", marginTop: 22 }}>agent1.aegisnet.eth</div></div>;
    if (v === "mark") return <Mark s={Math.min(220, b.h - 10)} style={{ position: "absolute", left: b.x, top: b.y + 10 }} />;
    return null;
  },
  end: (it) => (<><Mark s={170} style={{ position: "absolute", left: 455, top: 250 }} /><div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 96, color: "#fff", position: "absolute", left: 0, right: 0, textAlign: "center", top: 470 }}>{it.h}</div><div style={{ fontFamily: SANS, fontSize: 40, color: tone.mute, position: "absolute", left: 90, right: 90, top: 620, textAlign: "center", lineHeight: 1.3 }}>{it.s}</div><div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#fff", position: "absolute", left: 0, right: 0, top: 980, textAlign: "center" }}>aegisnet.solrun.fun · @AegisNets</div></>),
};
export const AegisX20 = makeAccount(theme, data as Item[], "#050505");
