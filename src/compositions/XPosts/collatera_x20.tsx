import { Mascot } from "../Collatera/components/Mascot";
import { CL, CL_FONTS } from "../Collatera/brand";
import { Bg, Foot, Moon, Stars, Water, body, px } from "./collatera";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/collatera.json";

/** COLLATERA: 20 new posts in the pixel-world system. All gauges, feeds and the -20% scenario are illustrative. */
const TONES: Record<string, { ink: string; mute: string; accent: string; line: string }> = {
  night: { ink: CL.mint, mute: CL.sage, accent: CL.lime, line: CL.line },
  green: { ink: CL.mint, mute: CL.sage, accent: CL.chartreuse, line: CL.line },
  lime: { ink: CL.night, mute: "#14402a", accent: CL.forest, line: "rgba(0,42,31,0.5)" },
};
const tn = (it: Item) => TONES[it.bg ?? "night"];
const chip = (t: string, bg: string, fg: string) => <div style={{ ...px(20, fg), background: bg, padding: "8px 16px", display: "inline-block" }}>{t}</div>;
const bar = (x: number, y: number, w: number, v: number, c: string) => <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, border: `3px solid ${CL.line}`, boxSizing: "border-box", background: CL.night }}><div style={{ width: `${v * 100}%`, height: "100%", background: c }} /></div>;
const theme: Theme = {
  cw: 0.92, sCw: 0.58, lh: 1.14, hMax: 108, hMin: 38,
  tone: tn,
  bg: (n, it) => (<><Bg c={it.bg === "lime" ? CL.lime : it.bg === "green" ? CL.evergreen : CL.night} grid={it.bg !== "lime"} />{it.bg !== "lime" && <Stars seed={`x${n}`} n={14} maxY={1000} />}</>),
  foot: (n, it) => <Foot n={n} total={20} c={it.bg === "lime" ? CL.night : CL.sage} />,
  lab: (t, tone) => <div style={{ ...px(20, tone.accent), position: "absolute", left: 60, top: 64 }}>{t}</div>,
  h: (fs, tone) => px(fs, tone.accent === CL.forest ? CL.night : CL.lime),
  accent: (t, tone) => <span style={{ color: tone.accent === CL.forest ? CL.forest : CL.mint }}>{t}</span>,
  s: (fs, tone) => body(fs * 0.8, tone.ink),
  num: (i, tone) => <div style={px(44, tone.accent)}>{String(i + 1).padStart(2, "0")}</div>,
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, background: tone.accent === CL.forest ? "#bfff66" : CL.panel, border: `3px solid ${tone.accent === CL.forest ? CL.night : CL.line}`, boxShadow: `10px 10px 0 ${CL.shadow}`, display: "flex", alignItems: "center", gap: 30, padding: "0 30px", boxSizing: "border-box" }}><span style={px(54, tone.accent)}>{"ABCD"[i]}</span><span style={{ ...px(Math.min(30, h * 0.26), tone.ink), lineHeight: 1.1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, tone, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, background: CL.panel, border: `3px solid ${i ? CL.lime : CL.line}`, boxShadow: `12px 12px 0 ${CL.shadow}`, padding: 30, boxSizing: "border-box", color: tone.ink }}>{c}</div>,
  vis: (v, b: Box, it) => {
    if (v === "feed") return (<div style={{ position: "absolute", left: b.x, top: b.y, width: b.w }}>{[["Feed 01", "FRESH", CL.lime, CL.night], ["Feed 02", "AGING", "#F3F460", CL.night], ["Feed 03", "STALE", "#FF5A3C", "#fff"]].map(([k, t, bg, fg]) => <div key={k} style={{ height: 84, borderBottom: `2px solid ${CL.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={px(30, CL.mint)}>{k}</span>{chip(t, bg, fg)}</div>)}<div style={{ ...body(22, CL.sage), marginTop: 14 }}>Illustrative feed ages.</div></div>);
    if (v === "gap") return (<div style={{ position: "absolute", left: b.x, top: b.y, display: "flex", alignItems: "flex-end", gap: 12 }}>{[200, 214, 226, 220, 230, 96, 104, 110, 118].map((h, i) => <div key={i} style={{ width: 90, height: Math.min(h, b.h - 60), background: i === 5 ? "#FF5A3C" : CL.lime, marginTop: 0 }} />)}<div style={{ ...body(22, CL.sage), position: "absolute", left: 0, top: -34 }}>Illustrative close-to-open gap.</div></div>);
    if (v === "buffer") return (<>{[0.82, 0.62, 0.34].map((x, i) => <div key={i}>{bar(b.x, b.y + 16 + i * 74, b.w, x, i === 2 ? "#FF5A3C" : i === 1 ? "#F3F460" : CL.lime)}</div>)}<div style={{ ...body(22, CL.sage), position: "absolute", left: b.x, top: b.y + 245 }}>Three example positions. Illustrative.</div></>);
    if (v === "slider") return (<div style={{ position: "absolute", left: b.x, top: b.y, width: b.w }}><div style={{ ...px(110, "#FF5A3C", { fontFamily: CL_FONTS.mono }) }}>-20%</div><div style={{ height: 8, background: CL.line, marginTop: 24, position: "relative" }}><div style={{ position: "absolute", left: 0, width: "62%", height: 8, background: CL.lime }} /><div style={{ position: "absolute", left: "60%", top: -22, width: 36, height: 52, background: CL.lime, boxShadow: `6px 6px 0 ${CL.shadow}` }} /></div><div style={{ ...body(22, CL.sage), marginTop: 36 }}>User-chosen scenario. Not a forecast.</div></div>);
    if (v === "ro") return <div style={{ position: "absolute", left: b.x, top: b.y }}>{chip("PREVIEW ONLY", CL.lime, CL.night)}<span style={{ display: "inline-block", width: 14 }} />{chip("NO TRANSACTION IS SENT", CL.panel, CL.mint)}<span style={{ display: "inline-block", width: 14 }} />{chip("YOU DECIDE", CL.panel, CL.mint)}</div>;
    if (v === "moon") return (<><Moon x={820} y={b.y + 80} r={80} /><div style={{ position: "absolute", left: 0, top: b.y + 150 }}><Water y={0} /></div></>);
    if (v === "mascot") return <Mascot cell={26} color={it.bg === "lime" ? CL.night : CL.lime} shadow={it.bg !== "lime"} style={{ position: "absolute", right: 70, top: Math.max(b.y, 760) }} />;
    return null;
  },
  end: (it) => (<>
    <Moon x={900} y={170} r={70} /><Mascot cell={40} style={{ position: "absolute", left: 270, top: 330 }} />
    <div style={{ ...px(88, CL.lime), position: "absolute", left: 0, right: 0, textAlign: "center", top: 800 }}>{it.h}</div>
    <div style={{ ...px(22, CL.mint), position: "absolute", left: 60, right: 60, top: 930, textAlign: "center" }}>{it.s}</div>
    <div style={{ ...px(28, CL.lime), position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center" }}>collatera.buzz · @collatera_io</div>
  </>),
};
export const CollateraX20 = makeAccount(theme, data as Item[], CL.night);
