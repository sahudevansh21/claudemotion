import { Img, staticFile } from "remotion";
import { AL_FONTS } from "../Allocra/brand";
import { Logo, P, Slate, mono, sans, serif } from "../AllocraContent/kit";
import { BROWN, Cream, Dark, Foot, GOLD, Red, cap } from "../AllocraContent/posts15";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/allocra.json";

/** Allocra: 20 new posts in the account's banner system (vermilion, old masters, cream serif, hairlines). UI is the supplied Preview / TestNet demo. */
const TONES: Record<string, { ink: string; mute: string; accent: string; line: string }> = {
  red: { ink: P.cream, mute: "rgba(246,218,195,0.75)", accent: GOLD, line: "rgba(246,218,195,0.45)" },
  dark: { ink: P.cream, mute: "rgba(246,218,195,0.7)", accent: GOLD, line: "rgba(246,218,195,0.35)" },
  cream: { ink: BROWN, mute: "rgba(61,24,18,0.7)", accent: "#C12E19", line: "rgba(61,24,18,0.4)" },
};
const tn = (it: Item) => TONES[it.bg ?? "red"];
const frame = (src: string, b: Box, fit: "cover" | "top" = "cover", pos = "50% 40%") => (
  <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: "1px solid rgba(246,218,195,0.5)", padding: 12, boxSizing: "border-box", background: "rgba(0,0,0,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}>
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: fit === "top" ? "0% 0%" : pos }} /></div>
  </div>
);
const ROM = ["I", "II", "III", "IV", "V", "VI", "VII"];
const theme: Theme = {
  cw: 0.36, sCw: 0.5, lh: 0.98, hMax: 170, hMin: 64,
  tone: tn,
  bg: (n, it) => (<>{it.bg === "dark" ? <Dark /> : it.bg === "cream" ? <Cream /> : <Red />}<div style={{ position: "absolute", left: 70, right: 70, top: 120, height: 1, background: tn(it).line, opacity: 0.6 }} /></>),
  foot: (n, it) => <Foot n={n} total={20} color={it.bg === "cream" ? "rgba(61,24,18,0.7)" : "rgba(246,218,195,0.75)"} />,
  lab: (t, tone) => <div style={{ ...cap(17, tone.accent), position: "absolute", left: 70, top: 66 }}>{t}</div>,
  h: (fs, tone) => serif(fs, tone.ink, { lineHeight: 0.98 }),
  accent: (t, tone) => <span style={{ fontStyle: "italic", color: tone.accent }}>{t}</span>,
  s: (fs, tone) => sans(fs, tone.ink, { lineHeight: 1.3, color: tone.ink }),
  num: (i, tone) => <div style={{ fontFamily: AL_FONTS.serif, fontSize: 40, color: tone.accent, width: 62 }}>{ROM[i]}</div>,
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, borderTop: `1px solid ${tone.line}`, borderBottom: `1px solid ${tone.line}`, display: "flex", alignItems: "center", gap: 36 }}><span style={{ fontFamily: AL_FONTS.serif, fontSize: 64, fontStyle: "italic", color: tone.accent, width: 70 }}>{"ABCD"[i]}</span><span style={{ ...serif(Math.min(60, h * 0.5), tone.ink), lineHeight: 1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, tone, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: `1px solid ${tone.line}`, background: i ? "rgba(0,0,0,0.12)" : "transparent", padding: 34, boxSizing: "border-box", color: tone.ink }}>{c}</div>,
  vis: (v, b, _it, tone) => {
    const [k, id] = v.split(":");
    if (k === "p") return frame(`allocra/content/${id}.jpg`, { ...b, h: Math.min(b.h, 560) }, "cover", id === "lions" ? "50% 82%" : id === "reader" ? "50% 45%" : "50% 40%");
    if (k === "ui") return frame(`allocra/img/ui-${id}.webp`, { ...b, h: Math.min(b.h, 520) }, "top");
    if (k === "site") return frame(`allocra/content/site-${id}.jpg`, { ...b, h: Math.min(b.h, 520) }, "top");
    if (k === "slate") return (<div style={{ position: "absolute", left: 270, top: b.y - 10, transform: "scale(0.52)", transformOrigin: "50% 0" }}><Slate /></div>);
    if (k === "venn") return (<div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: Math.min(b.h, 420) }}>
      {[0, 1].map((i) => <div key={i} style={{ position: "absolute", left: 230 + i * 220, top: 10, width: 330, height: 330, borderRadius: 330, border: `2px solid ${tone.ink}`, background: i ? "rgba(246,218,195,0.12)" : "transparent" }} />)}
      <div style={{ ...mono(18, tone.ink), position: "absolute", left: 270, top: 160 }}>Fund A</div><div style={{ ...mono(18, tone.ink), position: "absolute", left: 590, top: 160 }}>Fund B</div><div style={{ ...mono(16, tone.accent), position: "absolute", left: 428, top: 160 }}>Overlap</div>
    </div>);
    if (k === "bars") return (<div style={{ position: "absolute", left: b.x, top: b.y + 10, width: b.w }}>{[["US equity", 55], ["International equity", 25], ["US bonds", 20]].map(([l, w]) => <div key={l} style={{ marginBottom: 28 }}><div style={{ ...mono(18, tone.ink), marginBottom: 10 }}>{l} · {w}% · sample</div><div style={{ height: 22, width: `${Number(w) * 1.6}%`, background: tone.accent }} /></div>)}</div>);
    return null;
  },
  end: (it) => (<>
    <div style={{ position: "absolute", left: 540 - 130, top: 330 }}><Logo size={260} /></div>
    <div style={{ ...sans(54, P.cream, { fontWeight: 500 }), position: "absolute", left: 0, right: 0, textAlign: "center", top: 640 }}>Allocra</div>
    <div style={{ ...serif(110, P.cream), position: "absolute", left: 60, right: 60, top: 760, textAlign: "center" }}>{it.h}</div>
    <div style={{ ...sans(32, P.cream), position: "absolute", left: 60, right: 60, top: 1030, textAlign: "center" }}>{it.s}</div>
    <div style={{ ...mono(24, P.cream), position: "absolute", left: 0, right: 0, textAlign: "center", top: 1120 }}>allocra.buzz · @allocraa</div>
  </>),
};
export const AllocraX20 = makeAccount(theme, data as Item[], "#C12E19");
