import { Img, staticFile } from "remotion";
import { DEPLOYMENTS, DISPLAY, MONO, SANS, VERDICTS, type Status } from "../Oryn/brand";
import { Asterisk, Clouds, Flame, Foot, Halftone, NAVY, OR, Ring, Rule, cap } from "./oryn";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/oryn.json";

/** ORYN: 20 new posts in the banner system (cream stock, cyan halftone, navy, orange). Board data is simulated issuer data. */
const CREAM = "#f0e9d6";
const TONES: Record<string, { bg: string; ink: string; accent: string; line: string; mute: string }> = {
  cream: { bg: CREAM, ink: NAVY, accent: OR, line: "rgba(29,63,168,0.4)", mute: "#5b6aa8" },
  navy: { bg: NAVY, ink: CREAM, accent: "#f2c200", line: "rgba(240,233,214,0.4)", mute: "#b9c2ea" },
  yellow: { bg: "#f2c200", ink: "#0d0d0f", accent: NAVY, line: "rgba(13,13,15,0.45)", mute: "#4b4300" },
  red: { bg: "#e5321f", ink: "#fff", accent: "#f2c200", line: "rgba(255,255,255,0.5)", mute: "#ffd9d3" },
};
const tn = (it: Item) => TONES[it.bg ?? "cream"];
const verdictChip = (s: Status, big = false) => { const v = VERDICTS[s]; return <div key={s} style={{ ...cap(big ? 26 : 20, v.chipFg, { letterSpacing: 3 }), background: v.chip, padding: big ? "18px 30px" : "12px 22px", display: "inline-block" }}>{v.glyph} {v.label}</div>; };
const tile = (b: Box, bg: string, fg: string, children: React.ReactNode) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, background: bg, color: fg, border: `4px solid ${NAVY}`, boxShadow: `8px 8px 0 ${NAVY}`, boxSizing: "border-box", padding: 26 }}>{children}</div>;

const theme: Theme = {
  cw: 0.46, sCw: 0.5, lh: 0.98, hMax: 200, hMin: 70,
  tone: tn,
  bg: (n, it) => { const t = tn(it); return (<><div style={{ position: "absolute", inset: 0, background: t.bg }} /><div style={{ opacity: it.bg === "navy" || it.bg === "red" ? 0.45 : 1 }}><Halftone cx={[760, 300, 640, 880][n % 4]} cy={[300, 900, 1000, 500][n % 4]} w={1200} h={900} /></div><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: NAVY }} /><div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 16, background: NAVY }} /></>); },
  foot: (n, it) => <Foot n={n} total={20} light={it.bg === "navy" || it.bg === "red"} />,
  lab: (t, tone) => <div style={{ ...cap(20, tone.ink), position: "absolute", left: 70, top: 70 }}>{t}</div>,
  h: (fs, tone) => ({ fontFamily: DISPLAY, fontSize: fs, color: tone.ink, textTransform: "uppercase", letterSpacing: 1 }),
  accent: (t, tone) => <span style={{ color: tone.accent }}>{t}</span>,
  s: (fs, tone) => ({ fontFamily: SANS, fontWeight: 500, fontSize: fs, lineHeight: 1.28, color: tone.ink }),
  num: (i, tone) => (i % 2 ? <Asterisk s={46} color={tone.accent} /> : <div style={{ fontFamily: DISPLAY, fontSize: 56, color: tone.accent, width: 46, textAlign: "center" }}>{i + 1}</div>),
  opt: (i, t, w, h, tone) => (<div style={{ width: w, height: h, border: `4px solid ${tone.ink}`, boxShadow: `8px 8px 0 ${tone.ink}`, display: "flex", alignItems: "center", gap: 28, padding: "0 32px", boxSizing: "border-box" }}><div style={{ fontFamily: DISPLAY, fontSize: 64, color: tone.accent }}>{"ABCD"[i]}</div><div style={{ fontFamily: SANS, fontWeight: 700, fontSize: Math.min(44, h * 0.34), color: tone.ink, lineHeight: 1.1 }}>{t.replace(/^[A-D]\s+/, "")}</div></div>),
  card: (c, b, tone, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: `4px solid ${tone.ink}`, boxShadow: `8px 8px 0 ${tone.ink}`, background: i ? tone.accent : "transparent", padding: 30, boxSizing: "border-box", color: tone.ink }}>{c}</div>,
  vis: (v, b, it, tone) => {
    if (v === "cs") return (<>{tile({ x: b.x, y: b.y, w: 450, h: Math.min(b.h, 300) }, VERDICTS.closed.bg, VERDICTS.closed.fg, <><div style={{ fontSize: 60 }}>◐</div><div style={{ fontFamily: DISPLAY, fontSize: 56, textTransform: "uppercase", marginTop: 10 }}>Market closed</div></>)}{tile({ x: b.x + 490, y: b.y, w: 450, h: Math.min(b.h, 300) }, VERDICTS.stale.bg, VERDICTS.stale.fg, <><div style={{ fontSize: 60 }}>◌</div><div style={{ fontFamily: DISPLAY, fontSize: 56, textTransform: "uppercase", marginTop: 10 }}>Stale</div></>)}</>);
    if (v === "split") return (<>{["ETH", "BASE"].map((c, i) => tile({ x: b.x + i * 490, y: b.y, w: 450, h: Math.min(b.h, 300) }, "#0d0d0f", "#e5321f", <><div style={{ fontFamily: MONO, fontSize: 28, color: "#fff" }}>oNFLX · {c}</div><div style={{ fontSize: 60, marginTop: 10 }}>✖</div><div style={{ fontFamily: DISPLAY, fontSize: 54, textTransform: "uppercase" }}>Divergent</div></>))}</>);
    if (v === "chips") return <div style={{ position: "absolute", left: b.x, top: b.y, display: "flex", gap: 14, flexWrap: "wrap", width: 940 }}>{(["open", "closed", "pending", "redemption", "stale", "divergent"] as Status[]).map((s) => verdictChip(s, true))}</div>;
    if (v === "tl") return (<div style={{ position: "absolute", left: b.x, top: b.y + 30, width: b.w }}><div style={{ height: 8, background: tone.line, position: "relative", marginTop: 40 }}>{["−1D", "NOW", "NEXT OPEN", "+1D"].map((l, i) => <div key={l} style={{ position: "absolute", left: `${i * 33}%`, top: -22 }}><div style={{ width: 36, height: 36, borderRadius: 36, background: i === 1 ? tone.accent : tone.ink, border: `4px solid ${tone.ink}` }} /><div style={{ ...cap(18, tone.ink, { letterSpacing: 3 }), marginTop: 18, whiteSpace: "nowrap" }}>{l}</div></div>)}</div></div>);
    if (v === "bar") { const parts: [Status, number][] = [["open", 1], ["closed", 5], ["pending", 2], ["redemption", 2], ["stale", 1], ["divergent", 4]]; return (<div style={{ position: "absolute", left: b.x, top: b.y + 20, width: b.w }}><div style={{ display: "flex", height: 130, border: `4px solid ${NAVY}` }}>{parts.map(([s, c]) => <div key={s} style={{ flex: c, background: VERDICTS[s].bg, borderRight: `4px solid ${NAVY}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 56, color: VERDICTS[s].fg }}>{c}</div>)}</div><div style={{ ...cap(16, tone.ink, { letterSpacing: 3 }), marginTop: 22 }}>Board sample · 15 deployments · simulated issuer data</div></div>); }
    if (v.startsWith("card:")) { const d = DEPLOYMENTS[Number(v.slice(5))]; const vv = VERDICTS[d.status]; return tile({ x: b.x, y: b.y, w: 940, h: Math.min(b.h, 280) }, vv.bg, vv.fg, <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}><div><div style={{ fontFamily: DISPLAY, fontSize: 96, textTransform: "none" }}>{d.sym}</div><div style={{ fontFamily: MONO, fontSize: 22 }}>{d.chain} · {d.next}</div></div><div>{verdictChip(d.status, true)}</div></div>); }
    if (v === "ast") return <div style={{ position: "absolute", right: 90, bottom: 130 }}><Asterisk s={260} color={tone.accent} /></div>;
    if (v === "flame") return <div style={{ position: "absolute", right: 90, bottom: 130 }}><Flame s={200} /></div>;
    return null;
  },
  end: (it) => (<>
    <Halftone cx={540} cy={560} w={1300} h={900} />
    <Img src={staticFile("oryn/img/logo.png")} style={{ position: "absolute", left: 340, top: 190, width: 400, height: 400, borderRadius: 400, border: `6px solid ${NAVY}` }} />
    <div style={{ fontFamily: DISPLAY, fontSize: 150, color: NAVY, position: "absolute", left: 0, right: 0, textAlign: "center", top: 640, textTransform: "uppercase" }}>{it.h}</div>
    <div style={{ ...cap(22, NAVY, { textAlign: "center", letterSpacing: 4 }), position: "absolute", left: 60, right: 60, top: 810 }}>{it.s}</div>
    <div style={{ ...cap(26, OR, { textAlign: "center", letterSpacing: 5 }), position: "absolute", left: 0, right: 0, top: 910 }}>oryn.solrun.fun · @oryn_io</div>
    <Clouds y={1150} /><Rule y={1040} /><Ring s={0} /><Flame s={0} />
  </>),
};
export const OrynX20 = makeAccount(theme, data as Item[], CREAM);
