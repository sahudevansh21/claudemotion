import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/terranode.json";

/** TerraNode: 20 new posts. PROVISIONAL theme derived from the TerraNode film (golden-hour fields, black Quicksand wordmark, violet dots #701CD0, field-unit hardware); awaiting the client's banner/logo to confirm. UI is illustrative. */
loadFont({ family: "Quicksand", url: staticFile("terranode/fonts/Quicksand-Bold.ttf"), weight: "700" });
loadFont({ family: "Quicksand", url: staticFile("terranode/fonts/Quicksand-SemiBold.ttf"), weight: "600" });
const VI = "#701CD0"; const INK = "#15121c"; const GOLDEN = "#F4C36B"; const SAGE = "#6f9a52"; const CREAM = "#FBF6EC";
const Q = "Quicksand, system-ui, sans-serif"; const MONO = "'JetBrains Mono', monospace";
const TONES: Record<string, { ink: string; mute: string; accent: string; line: string }> = {
  cream: { ink: INK, mute: "#5d5568", accent: VI, line: "rgba(21,18,28,0.2)" },
  gold: { ink: INK, mute: "#5a4630", accent: VI, line: "rgba(21,18,28,0.25)" },
  violet: { ink: "#ffffff", mute: "rgba(255,255,255,0.75)", accent: GOLDEN, line: "rgba(255,255,255,0.3)" },
};
const tn = (it: Item) => TONES[it.bg ?? "cream"];
const Rows: React.FC<{ y: number; c?: string; o?: number }> = ({ y, c = SAGE, o = 0.9 }) => (<svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 13 }).map((_, i) => <line key={i} x1={540 + (i - 6) * 20} y1={y} x2={540 + (i - 6) * 170} y2={1350} stroke={c} strokeWidth={5} opacity={o} />)}{[0.15, 0.35, 0.6].map((t, i) => <line key={i} x1={0} x2={1080} y1={y + (1350 - y) * t} y2={y + (1350 - y) * t} stroke={c} strokeWidth={3} opacity={0.35} />)}</svg>);
const Dot: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = VI }) => <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: r * 2, background: c }} />;
const card = (b: Box, c: React.ReactNode) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, borderRadius: 28, background: "#fff", boxShadow: "0 24px 60px rgba(60,40,100,0.18)", padding: 32, boxSizing: "border-box", color: INK }}>{c}</div>;
const theme: Theme = {
  cw: 0.56, sCw: 0.52, lh: 1.02, hMax: 150, hMin: 56,
  tone: tn,
  bg: (n, it) => (<>
    <div style={{ position: "absolute", inset: 0, background: it.bg === "violet" ? "linear-gradient(170deg,#3c0f7a,#1c0640)" : it.bg === "gold" ? `linear-gradient(180deg, #ffe4b0, ${GOLDEN} 55%, #f7d8a0)` : CREAM }} />
    {it.bg === "gold" && <div style={{ position: "absolute", left: 640, top: 560, width: 420, height: 420, borderRadius: 420, background: "radial-gradient(circle, #fff6d8, rgba(255,246,216,0))" }} />}
    <Rows y={1180} c={it.bg === "violet" ? "#8c55d8" : SAGE} o={it.bg === "violet" ? 0.5 : 0.7} />
    <Dot x={70 + 8} y={1296} r={9} c={it.bg === "violet" ? GOLDEN : VI} />
  </>),
  foot: (n, it) => <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: it.bg === "violet" ? "rgba(255,255,255,0.7)" : "rgba(21,18,28,0.6)", textTransform: "uppercase", position: "absolute", left: 100, right: 70, bottom: 38, display: "flex", justifyContent: "space-between" }}><span>TerraNode · Illustrative UI · Not agronomic advice</span><span>{String(n).padStart(2, "0")}/20</span></div>,
  lab: (t, tone) => <div style={{ fontFamily: Q, fontWeight: 700, fontSize: 20, letterSpacing: 5, color: tone.accent, textTransform: "uppercase", position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs, tone) => ({ fontFamily: Q, fontWeight: 700, fontSize: fs, letterSpacing: -fs * 0.03, color: tone.ink }),
  accent: (t, tone) => <span style={{ color: tone.accent }}>{t}</span>,
  s: (fs, tone) => ({ fontFamily: Q, fontWeight: 600, fontSize: fs, color: tone.mute, lineHeight: 1.3 }),
  num: (i, tone) => <div key={i} style={{ width: 22, height: 22, borderRadius: 22, background: tone.accent, flex: "0 0 auto" }} />,
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, borderRadius: 99, background: tone.ink === "#ffffff" ? "rgba(255,255,255,0.12)" : "#fff", boxShadow: tone.ink === "#ffffff" ? "0 0 0 1px rgba(255,255,255,0.35)" : "0 14px 34px rgba(60,40,100,0.14)", display: "flex", alignItems: "center", gap: 28, padding: "0 40px", boxSizing: "border-box" }}><span style={{ fontFamily: Q, fontWeight: 700, fontSize: 54, color: tone.accent, width: 50 }}>{"ABCD"[i]}</span><span style={{ fontFamily: Q, fontWeight: 700, fontSize: Math.min(42, h * 0.33), color: tone.ink }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b) => card(b, <div style={{ color: INK }}>{c}</div>),
  vis: (v, b: Box) => {
    if (v === "readings") return card({ x: b.x, y: b.y, w: b.w, h: 0 }, <div>{[["Soil Moisture", "68%"], ["Temperature", "24°C"], ["Humidity", "56%"], ["Light", "820 lux"], ["Air Quality", "Good"]].map(([k, val]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: Q, fontWeight: 700, fontSize: 30, borderBottom: "1px solid rgba(21,18,28,0.1)" }}><span style={{ color: "#5d5568" }}>{k}</span><span>{val}</span></div>)}<div style={{ fontFamily: MONO, fontSize: 14, color: "#5d5568", marginTop: 12, letterSpacing: 2 }}>ILLUSTRATIVE VALUES · NOT LIVE DATA</div></div>);
    if (v === "leaf") return card({ x: b.x, y: b.y, w: b.w, h: 0 }, <div style={{ display: "flex", gap: 30, alignItems: "center" }}><svg width={200} height={200} viewBox="0 0 100 100"><path d="M50 8 C86 24 90 66 50 94 C10 66 14 24 50 8Z" fill={SAGE} /><path d="M50 14 V90" stroke="#e6f1d8" strokeWidth={3} /><rect x={22} y={26} width={56} height={56} fill="none" stroke={VI} strokeWidth={3} strokeDasharray="6 5" /></svg><div><div style={{ fontFamily: Q, fontWeight: 700, fontSize: 36 }}>Leaf Analysis</div><div style={{ display: "inline-block", marginTop: 12, background: "#dff3d2", color: "#2b6a1e", fontFamily: Q, fontWeight: 700, fontSize: 30, padding: "8px 22px", borderRadius: 99 }}>Healthy</div><div style={{ fontFamily: MONO, fontSize: 14, color: "#5d5568", marginTop: 14, letterSpacing: 2 }}>ILLUSTRATIVE</div></div></div>);
    if (v === "irrig") return card({ x: b.x, y: b.y, w: b.w, h: 0 }, <div><div style={{ fontFamily: Q, fontWeight: 700, fontSize: 36, lineHeight: 1.2 }}>Zone 2 soil moisture is low. Irrigate for 15 min?</div><div style={{ display: "flex", gap: 16, marginTop: 24 }}><div style={{ background: VI, color: "#fff", fontFamily: Q, fontWeight: 700, fontSize: 30, padding: "14px 36px", borderRadius: 99 }}>Approve</div><div style={{ border: `2px solid ${VI}`, color: VI, fontFamily: Q, fontWeight: 700, fontSize: 30, padding: "12px 34px", borderRadius: 99 }}>Skip</div></div><div style={{ fontFamily: MONO, fontSize: 14, color: "#5d5568", marginTop: 16, letterSpacing: 2 }}>ILLUSTRATIVE EXAMPLE PROMPT</div></div>);
    if (v === "node") return (<svg width={300} height={Math.min(b.h, 380)} viewBox="0 0 150 190" style={{ position: "absolute", left: 700, top: b.y }}><rect x={72} y={60} width={6} height={130} fill={INK} /><g transform="rotate(-22 75 48)"><rect x={30} y={30} width={90} height={36} rx={4} fill="#2f2a55" /><path d="M30 48H120M60 30V66M90 30V66" stroke="#8c8fe0" strokeWidth={1.5} /></g><rect x={86} y={92} width={36} height={52} rx={6} fill="#fff" stroke={INK} strokeWidth={3} /><circle cx={104} cy={118} r={5} fill={VI} /><path d="M52 90 V50" stroke={INK} strokeWidth={3} /><circle cx={52} cy={46} r={5} fill={VI} /></svg>);
    if (v === "lora") return (<svg width={420} height={420} viewBox="0 0 200 200" style={{ position: "absolute", left: 600, top: b.y }}>{[24, 48, 72, 96].map((r, i) => <circle key={r} cx={100} cy={100} r={r} fill="none" stroke={VI} strokeWidth={3} opacity={1 - i * 0.2} />)}<circle cx={100} cy={100} r={9} fill={VI} /></svg>);
    if (v === "rows") return null;
    return null;
  },
  end: (it) => (<><Dot x={310} y={420} r={26} /><div style={{ fontFamily: Q, fontWeight: 700, fontSize: 128, letterSpacing: -4, color: INK, position: "absolute", left: 350, top: 340 }}>TerraNode</div><div style={{ fontFamily: Q, fontWeight: 700, fontSize: 64, color: INK, position: "absolute", left: 60, right: 60, top: 560, textAlign: "center", lineHeight: 1.1 }}>{it.s}</div></>),
};
export const TerranodeX20 = makeAccount(theme, data as Item[], CREAM);
