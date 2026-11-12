import { Img, staticFile } from "remotion";
import { PM } from "../Polymate/brand";
import { Banner, D, Emblem, Foot, Lapis, Marble, S, U, cin } from "./polymate";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/polymate.json";

/** PolyMate: 20 new posts (set C) in the banner system (golden-hour Rome, marble, lapis + gold, red banner walls, robot centurion). All numbers are illustrative. */
const TONES: Record<string, { ink: string; mute: string; accent: string; line: string }> = {
  cream: { ink: PM.ink, mute: PM.inkSoft, accent: PM.lapis, line: "rgba(180,138,60,0.55)" },
  lapis: { ink: "#fff", mute: "rgba(255,255,255,0.78)", accent: PM.goldLight, line: "rgba(221,184,104,0.6)" },
  red: { ink: "#fff", mute: "rgba(255,255,255,0.8)", accent: PM.goldLight, line: "rgba(221,184,104,0.6)" },
};
const tn = (it: Item) => TONES[it.bg ?? "cream"];
const photo = (src: string, b: Box, pos = "50% 50%") => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, overflow: "hidden", border: `4px solid ${PM.goldLight}`, boxShadow: "0 30px 70px rgba(60,40,10,0.35)" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos }} /></div>;
const theme: Theme = {
  cw: 0.6, sCw: 0.5, lh: 1.0, hMax: 150, hMin: 56,
  tone: tn,
  bg: (n, it) => (it.bg === "lapis" ? <Lapis /> : it.bg === "red" ? (<><div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 60% at 30% 10%, #b12a2a, #8E1F1F 50%, #5e1111)" }} /><div style={{ position: "absolute", inset: 18, border: `2px solid ${PM.goldLight}`, opacity: 0.7 }} /></>) : (<><Marble />{n % 4 === 0 && <Banner x={930} y={0} h={240} />}</>)),
  foot: (n, it) => <Foot n={n} total={20} c={it.bg === "cream" || !it.bg ? PM.inkSoft : "rgba(255,255,255,0.78)"} />,
  lab: (t, tone) => <div style={{ ...cin(18, tone.accent), position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs, tone) => ({ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: fs, letterSpacing: -fs * 0.035, color: tone.ink }),
  accent: (t, tone) => <span style={{ fontFamily: S, fontStyle: "italic", fontWeight: 400, letterSpacing: "-0.02em", color: tone.accent }}>{t}</span>,
  s: (fs, tone) => ({ fontFamily: U, fontWeight: 500, fontSize: fs, color: tone.mute, lineHeight: 1.3 }),
  num: (i, tone) => <div style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 54, color: tone.accent, width: 70 }}>{["I", "II", "III", "IV", "V"][i]}</div>,
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, borderRadius: 26, background: tone.ink === "#fff" ? "rgba(255,255,255,0.14)" : "linear-gradient(160deg,#fffdf8,#f1eadb)", border: `2px solid ${PM.goldLight}`, boxShadow: "0 18px 40px rgba(60,40,10,0.18)", display: "flex", alignItems: "center", gap: 30, padding: "0 40px", boxSizing: "border-box" }}><span style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 56, color: tone.accent, width: 56 }}>{"ABCD"[i]}</span><span style={{ fontFamily: U, fontWeight: 700, fontSize: Math.min(42, h * 0.33), color: tone.ink }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, tone, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 28, background: tone.ink === "#fff" ? (i ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)") : i ? "linear-gradient(160deg,#2445C4,#132A80)" : "linear-gradient(160deg,#fffdf8,#f1eadb)", border: `2px solid ${PM.goldLight}`, boxShadow: "0 24px 60px rgba(60,40,10,0.25)", padding: 34, boxSizing: "border-box", color: tone.ink }}>{c}</div>,
  vis: (v, b: Box, _it, tone) => {
    const h = Math.min(b.h - 10, 520);
    if (v === "robot") return photo("polymate/img/robot.jpg", { x: 300, y: b.y + 10, w: 480, h }, "50% 30%");
    if (v === "forum") return photo("polymate/img/forum.jpg", { x: b.x, y: b.y + 10, w: b.w, h: Math.min(h, 420) }, "50% 65%");
    if (v === "emblem") return <Emblem s={Math.min(330, b.h * 1.2)} style={{ position: "absolute", left: 375, top: b.y + 10 }} />;
    if (v === "yesno") return (<div style={{ position: "absolute", left: b.x, top: b.y + 10, display: "flex", gap: 30 }}><div style={{ width: 450, height: Math.min(h, 330), borderRadius: 28, background: `linear-gradient(160deg, ${PM.lapisLight}, ${PM.lapisDeep})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 110, color: "#fff" }}>YES</div><div style={{ width: 450, height: Math.min(h, 330), borderRadius: 28, background: "linear-gradient(160deg,#b02a2a,#6f1414)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 110, color: "#fff" }}>NO</div></div>);
    if (v === "price") return (<div style={{ position: "absolute", left: b.x, top: b.y + 20, width: b.w }}><div style={{ display: "flex", justifyContent: "space-between", fontFamily: U, fontWeight: 700, fontSize: 40, color: tone.ink }}><span>YES 0.60</span><span>≈ 60%</span></div><div style={{ height: 36, borderRadius: 18, background: "#e4dccd", marginTop: 20, overflow: "hidden" }}><div style={{ width: "60%", height: "100%", background: `linear-gradient(90deg, ${PM.gold}, ${PM.goldLight})` }} /></div><div style={{ ...cin(14, tone.mute, { fontWeight: 500 }), marginTop: 18 }}>Illustrative numbers</div></div>);
    if (v === "cards") return (<div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w }}>{[["Position Opened", "YES · $50"], ["Executing Trade…", "in progress"]].map(([a, c]) => <div key={a} style={{ marginBottom: 16, borderRadius: 24, background: "linear-gradient(160deg,#fffdf8,#f1eadb)", border: `2px solid ${PM.goldLight}`, boxShadow: "0 18px 40px rgba(60,40,10,0.18)", padding: "26px 34px", display: "flex", justifyContent: "space-between", fontFamily: U, fontWeight: 700, fontSize: 38, color: PM.ink }}><span>{a}</span><span style={{ color: PM.inkSoft, fontWeight: 600 }}>{c}</span></div>)}<div style={{ ...cin(14, PM.inkSoft, { fontWeight: 500 }) }}>Illustrative · not live data</div></div>);
    return null;
  },
  end: (it) => (<><Marble /><Emblem s={330} style={{ position: "absolute", left: 375, top: 160 }} />{photo("polymate/img/robot.jpg", { x: 380, y: 540, w: 320, h: 290 }, "50% 30%")}<div style={{ fontFamily: D, fontWeight: 800, fontStyle: "italic", fontSize: 110, letterSpacing: -4, color: PM.ink, position: "absolute", left: 0, right: 0, top: 860, textAlign: "center" }}>{it.h}</div><div style={{ fontFamily: S, fontStyle: "italic", fontSize: 44, color: PM.inkSoft, position: "absolute", left: 60, right: 60, top: 1010, textAlign: "center" }}>{it.s}</div><div style={{ ...cin(20, PM.gold), position: "absolute", left: 0, right: 0, textAlign: "center", top: 1110 }}>t.me/Tryoddsbot · @Polymatedotfun</div></>),
};
export const PolymateX20 = makeAccount(theme, data as Item[], PM.cream);
