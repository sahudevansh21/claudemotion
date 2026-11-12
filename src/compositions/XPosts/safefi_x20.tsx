import { BG, Bg, Chip, Foot, INK, Logo, MONO, SANS, SOFT, Shield, Tile } from "./safefi";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/safefi.json";

/** SafeFi: 20 new posts in the banner system (white grid stage, heavy black grotesk, arrow wordmark, glossy shield, coin tiles). */
const L = { ink: INK, mute: SOFT, accent: "#5c5c63", line: "rgba(0,0,0,0.16)" };
const Dk = { ink: "#ffffff", mute: "rgba(255,255,255,0.65)", accent: "#c9c9cf", line: "rgba(255,255,255,0.22)" };
const tn = (it: Item) => (it.bg === "dark" ? Dk : L);
const theme: Theme = {
  cw: 0.58, sCw: 0.52, lh: 1.0, hMax: 168, hMin: 58,
  tone: tn,
  bg: (n, it) => <Bg dark={it.bg === "dark"} rings={n % 2 === 0} />,
  foot: (n, it) => <Foot n={n} total={20} dark={it.bg === "dark"} />,
  lab: (t, tone) => <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 6, color: tone.mute, textTransform: "uppercase", position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs, tone) => ({ fontFamily: SANS, fontWeight: 800, fontSize: fs, letterSpacing: -fs * 0.045, color: tone.ink }),
  accent: (t) => <span style={{ fontWeight: 400 }}>{t}</span>,
  s: (fs, tone) => ({ fontFamily: SANS, fontSize: fs, color: tone.mute, lineHeight: 1.3 }),
  num: (i, tone) => <div style={{ fontFamily: MONO, fontSize: 22, color: tone.mute, width: 50 }}>{String(i + 1).padStart(2, "0")}</div>,
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, borderRadius: 99, background: tone === Dk ? "rgba(255,255,255,0.1)" : "#fff", boxShadow: tone === Dk ? "0 0 0 1px rgba(255,255,255,0.25)" : "0 10px 28px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 30, padding: "0 44px", boxSizing: "border-box" }}><span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 52, color: tone.ink, width: 56 }}>{"ABCD"[i]}</span><span style={{ fontFamily: SANS, fontWeight: 600, fontSize: Math.min(42, h * 0.33), color: tone.ink }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, tone, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 28, background: tone === Dk ? "rgba(255,255,255,0.08)" : i ? "#0d0d0f" : "#fff", boxShadow: "0 20px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)", padding: 34, boxSizing: "border-box", color: i && tone !== Dk ? "#fff" : tone.ink }}>{c}</div>,
  vis: (v, b: Box, it) => {
    const dk = it.bg === "dark";
    if (v === "shield") return <Shield s={Math.min(300, b.h - 20)} style={{ position: "absolute", left: 640, top: b.y }} />;
    if (v === "tiles") return <><Tile x={b.x} y={b.y + 20} kind="eth" /><Tile x={b.x + 130} y={b.y + 20} kind="btc" /><Tile x={b.x + 260} y={b.y + 20} kind="lines" /></>;
    if (v === "lock") return (<svg width={200} height={240} viewBox="0 0 100 120" style={{ position: "absolute", left: 700, top: b.y }}><rect x={14} y={50} width={72} height={60} rx={12} fill={dk ? "#fff" : INK} /><path d="M30 50 V34 a20 20 0 0 1 40 0 V50" fill="none" stroke={dk ? "#fff" : INK} strokeWidth={9} /><circle cx={50} cy={78} r={7} fill={dk ? INK : "#fff"} /></svg>);
    if (v === "globe") return (<svg width={200} height={200} viewBox="0 0 64 64" fill="none" stroke={dk ? "#fff" : INK} strokeWidth={3} style={{ position: "absolute", left: 700, top: b.y }}><circle cx={32} cy={32} r={26} /><ellipse cx={32} cy={32} rx={11} ry={26} /><path d="M6 32h52M10 18h44M10 46h44" /></svg>);
    if (v === "hash") return <div style={{ position: "absolute", left: b.x, top: b.y + 10, display: "flex", gap: 14, flexWrap: "wrap", width: b.w }}>{["#SafeFi", "#SmartContractRisk", "#DeFi", "#CryptoInsurance"].map((t) => <Chip key={t} dark={dk}>{t}</Chip>)}</div>;
    return null;
  },
  end: (it) => (<><Shield s={300} style={{ position: "absolute", left: 390, top: 150 }} /><Logo w={560} style={{ position: "absolute", left: 260, top: 590 }} /><div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, color: INK, position: "absolute", left: 60, right: 60, top: 760, textAlign: "center" }}>{it.s}</div><div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: SOFT, position: "absolute", left: 0, right: 0, top: 960, textAlign: "center" }}>safefisolana.vercel.app · @safefi_io</div></>),
};
export const SafefiX20 = makeAccount(theme, data as Item[], BG);
