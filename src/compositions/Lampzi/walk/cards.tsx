import { Img, staticFile } from "remotion";
import { L, Mini, SANS } from "./parts";

export const DOTS = ["#000000", "#2785c9", "#b03a3a", "#0b8a6c", "#33338f", "#0000ee", "#ee1111"];
export const TPL: { id: string; title: string; desc: string; thumb?: string; accent: string; sel: number }[] = [
  { id: "T1", title: "T1 : Simple and Elegant", desc: "Professional template for any career path", thumb: "t1", accent: "#111", sel: 0 },
  { id: "T2", title: "T2 : Neat and Professional", desc: "Great for tech roles and startups", thumb: "t2", accent: "#1d4ed8", sel: 5 },
  { id: "T3", title: "T3 : Minimalist and Sophisticated", desc: "Ideal for designers, artists, and professionals", thumb: "t3", accent: "#111", sel: 0 },
  { id: "T4", title: "T4", desc: "", accent: "#16866a", sel: 0 },
  { id: "T5", title: "T5", desc: "", accent: "#3a3f9a", sel: 0 },
  { id: "T6", title: "T6", desc: "", accent: "#c0392b", sel: 0 },
  { id: "T7", title: "T7 : Elegant and Modern", desc: "For tech innovators and entrepreneurs", accent: "#2785c9", sel: 1 },
  { id: "T8", title: "T8 : Harvard CV Classic", desc: "Trusted by academics, researchers, and…", accent: "#b03a3a", sel: 2 },
  { id: "T9", title: "T9 : Academic", desc: "Suited for research and academic positions", accent: "#111", sel: 0 },
];
export const CARD_W = 415, CARD_H = 686, CARD_X = [307, 751, 1194], ROW0 = 278, ROWP = 735;
export const cardPos = (i: number) => ({ x: CARD_X[i % 3], y: ROW0 + Math.floor(i / 3) * ROWP });

export const TemplateCard: React.FC<{ i: number; sel?: number; compact?: boolean; press?: number; hl?: number }> = ({ i, sel, compact, press = 0, hl = 0 }) => {
  const t = TPL[i], { x, y } = cardPos(i);
  const s = sel ?? t.sel;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: CARD_W, height: CARD_H, background: "#fff", border: `1.5px solid ${L.line}`, borderRadius: 14, boxShadow: "0 6px 22px rgba(0,0,0,0.05)", fontFamily: SANS }}>
      <div style={{ position: "absolute", left: 14, top: 12, width: CARD_W - 28, height: 410, overflow: "hidden" }}>
        {t.thumb ? <Img src={staticFile(`lampzi/site/${t.thumb}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} /> : <Mini w={CARD_W - 28} h={410} accent={t.accent} variant={i} />}
      </div>
      <div style={{ position: "absolute", left: 20, top: 432, fontSize: 26, fontWeight: 500, color: L.ink, whiteSpace: "nowrap" }}>{t.title}</div>
      <div style={{ position: "absolute", left: 20, top: 470, fontSize: 19, color: L.muted, whiteSpace: "nowrap" }}>{t.desc}</div>
      {DOTS.map((c, k) => (
        <div key={k} style={{ position: "absolute", left: 20 + k * 36, top: 503, width: 28, height: 28, borderRadius: 99, background: c, boxShadow: k === s ? `0 0 0 3px #fff, 0 0 0 5px ${c === "#000000" ? "#2d6a4f" : c}` : "none" }} />
      ))}
      <div style={{ position: "absolute", left: 20, top: 548, fontSize: 13, fontWeight: 600, letterSpacing: 2, color: L.muted }}>LAYOUT</div>
      {["Standard", "Compact"].map((n, k) => {
        const on = (k === 1) === !!compact;
        return (
          <div key={n} style={{ position: "absolute", left: 20 + k * 193, top: 574, width: 186, height: 42, borderRadius: 12, border: `2px solid ${on ? L.green : L.line}`, background: on ? L.greenSoft : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: 1.15 }}>
            <span style={{ fontSize: 17, fontWeight: 500, color: on ? L.greenDeep : L.ink }}>{n}</span>
            <span style={{ fontSize: 12, color: on ? L.greenDeep : L.muted }}>{k === 0 ? "Recommended" : "One-Page Optimized"}</span>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 20, top: 628, width: CARD_W - 40, height: 46, borderRadius: 14, background: hl > 0.5 ? L.greenDeep : L.green, color: "#fff", fontSize: 20, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 - 0.04 * press})` }}>Use This Template</div>
    </div>
  );
};
