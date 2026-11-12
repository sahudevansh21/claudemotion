import { Bg, DIM, DEEP, Foot, GOLD, GOLD2, J, Logo, Molecule, MONO, gt } from "./desci";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/desci.json";

/** desciBnb: 20 new posts in the banner system (black stage, gold light, widely tracked caps, molecules, planet arc, hex logo). */
const tone = { ink: "#f7ecd0", mute: DIM, accent: GOLD2, line: "rgba(232,185,54,0.35)" };
const theme: Theme = {
  cw: 0.47, sCw: 0.48, lh: 1.04, hMax: 150, hMin: 56,
  tone: () => tone,
  bg: (n, it) => <Bg planet={it.bg === "planet" && it.k !== "poll" && it.k !== "list" && it.k !== "vs"} seed={`d${n}`} glow={1 + (n % 3) * 0.1} />,
  foot: (n) => <Foot n={n} total={20} />,
  lab: (t) => <div style={{ fontFamily: J, fontWeight: 400, fontSize: 20, letterSpacing: 10, color: DIM, textTransform: "uppercase", position: "absolute", left: 70, top: 76 }}>{t}</div>,
  h: (fs) => ({ fontFamily: J, fontWeight: 300, fontSize: fs, letterSpacing: -fs * 0.02, color: "#f7ecd0" }),
  accent: (t) => <span style={{ ...gt, fontWeight: 400 }}>{t}</span>,
  s: (fs) => ({ fontFamily: J, fontWeight: 300, fontSize: fs, color: DIM, lineHeight: 1.3 }),
  num: (i) => <div style={{ fontFamily: MONO, fontSize: 22, color: GOLD, width: 50 }}>{String(i + 1).padStart(2, "0")}</div>,
  opt: (i, t, w, h) => (<div style={{ width: w, height: h, border: "1px solid rgba(232,185,54,0.45)", background: "rgba(232,185,54,0.05)", display: "flex", alignItems: "center", gap: 34, padding: "0 36px", boxSizing: "border-box" }}><span style={{ fontFamily: J, fontWeight: 300, fontSize: 64, ...gt }}>{"ABCD"[i]}</span><span style={{ fontFamily: J, fontWeight: 400, fontSize: Math.min(44, h * 0.34), color: "#f7ecd0", lineHeight: 1.1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, _t, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: "1px solid rgba(232,185,54,0.45)", background: i ? "rgba(232,185,54,0.1)" : "rgba(232,185,54,0.04)", padding: 34, boxSizing: "border-box", color: "#f7ecd0" }}>{c}</div>,
  vis: (v, b: Box) => {
    if (v === "mol") return <Molecule pts={[[b.x + 120, b.y + 150, 40], [b.x + 330, b.y + 60, 24], [b.x + 420, b.y + 220, 28], [b.x + 80, b.y + 300, 18], [b.x + 560, b.y + 120, 14]]} links={[[0, 1], [0, 2], [0, 3], [1, 4]]} />;
    if (v === "flow") return <div style={{ position: "absolute", left: b.x, top: b.y + 20, width: b.w, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>{["Research", "Funding", "Collaboration", "AI"].map((t, i) => <span key={t} style={{ display: "inline-block", border: "1px solid rgba(232,185,54,0.4)", padding: "16px 24px", fontFamily: J, fontSize: 30, color: "#f7ecd0" }}>{t}{i < 3 ? <span style={{ color: GOLD, marginLeft: 16 }}>×</span> : null}</span>)}</div>;
    if (v === "chain") return <div style={{ position: "absolute", left: b.x, top: b.y + 20, display: "flex", alignItems: "center" }}>{[1, 2, 3, 4].map((n) => <span key={n} style={{ display: "contents" }}><div style={{ width: 150, height: 110, border: "1px solid rgba(232,185,54,0.5)", background: "rgba(232,185,54,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, color: GOLD, fontSize: 24 }}>#{n}</div>{n < 4 && <div style={{ width: 40, height: 3, background: DEEP }} />}</span>)}</div>;
    if (v === "nodes") return <Molecule pts={[[b.x + 140, b.y + 110, 30], [b.x + 440, b.y + 70, 22], [b.x + 700, b.y + 160, 30], [b.x + 330, b.y + 280, 18], [b.x + 600, b.y + 320, 18]]} links={[[0, 1], [1, 2], [0, 3], [3, 4], [2, 4], [1, 3]]} />;
    if (v === "logo") return <Logo s={Math.min(240, b.h - 10)} style={{ position: "absolute", left: b.x, top: b.y + 10 }} />;
    return null;
  },
  end: (it) => (<><Logo s={300} style={{ position: "absolute", left: 390, top: 200 }} /><div style={{ fontFamily: J, fontWeight: 400, fontSize: 74, color: "#f7ecd0", position: "absolute", left: 0, right: 0, textAlign: "center", top: 540 }}>{it.h}</div><div style={{ fontFamily: J, fontWeight: 300, fontSize: 56, color: "#f7ecd0", position: "absolute", left: 80, right: 80, top: 680, textAlign: "center", lineHeight: 1.1 }}>{it.s}</div><div style={{ fontFamily: J, fontSize: 20, letterSpacing: 8, color: DIM, position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", textTransform: "uppercase" }}>desciai.vercel.app · @desci_bnb</div></>),
};
export const DesciX20 = makeAccount(theme, data as Item[], "#050403");
