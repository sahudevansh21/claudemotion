import { Img, random, staticFile } from "remotion";
import { DISPLAY, MONO as OMONO, SANS as OSANS } from "../Oryn/brand";
import { AL_FONTS } from "../Allocra/brand";
import { Logo as AlLogo } from "../AllocraContent/kit";
import { CL, CL_FONTS } from "../Collatera/brand";
import { Mascot as PixMascot } from "../Collatera/components/Mascot";
import { Logo as VLogo, Mascot as VMascot, LIL, OUT as VOUT, V } from "../Vybe/kit";
import { DD, F as QF, Mark as QMark, peak, trough } from "../XPosts/quantora";
import { Mark as AMark, SANS as ASANS, SERIF as ASERIF } from "../XPosts/aegis";
import { Logo as SLogo, Shield } from "../XPosts/safefi";
import { Logo as GLogo, MINT } from "../XPosts/argus";
import { Logo as DLogo, J, gt } from "../XPosts/desci";
import { Emblem } from "../XPosts/polymate";
import { PM, PM_FONTS } from "../Polymate/brand";
import "../XPosts/terranode_x20";
import type { Tone, VTheme } from "./engine";

const T = (bg: string, ink: string, accent: string, mute: string, card: string, line: string, pill: string, pillInk: string): Tone => ({ bg, ink, accent, mute, card, line, pill, pillInk });
const soft = "0 28px 70px rgba(0,0,0,0.22)";

/* ORYN */
const NAVY = "#1d3fa8";
export const oryn: VTheme = {
  cw: 0.46,
  tones: { cream: T("#f0e9d6", NAVY, "#f0501e", "#5b6aa8", "#f7f2e4", "rgba(29,63,168,0.35)", NAVY, "#f0e9d6"), yellow: T("#f2c200", "#0d0d0f", NAVY, "#4b4300", "#f7d84a", "rgba(13,13,15,0.4)", "#0d0d0f", "#f2c200"), navy: T(NAVY, "#f0e9d6", "#f2c200", "#b9c2ea", "#2a52c8", "rgba(240,233,214,0.35)", "#0d0d0f", "#f2c200"), red: T("#e5321f", "#fff", "#f2c200", "#ffd9d3", "#ee5a47", "rgba(255,255,255,0.5)", "#0d0d0f", "#fff") },
  backdrop: (t, _b, f) => <div style={{ position: "absolute", inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(${t.bg === "#f0e9d6" ? "#58c3dc" : "rgba(255,255,255,0.35)"} 38%, transparent 42%)`, backgroundSize: "22px 22px", WebkitMaskImage: `radial-gradient(ellipse 50% 55% at ${60 + Math.sin(f / 200) * 6}% 40%, #000, transparent 72%)` }} />,
  h: (fs, t) => ({ fontFamily: DISPLAY, fontSize: fs, color: t.ink, textTransform: "uppercase", letterSpacing: 1 }),
  accent: (s, t) => <span style={{ color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: OSANS, fontWeight: 500, fontSize: fs, color: t.ink }),
  mono: (fs, t) => ({ fontFamily: OMONO, fontWeight: 700, fontSize: fs, letterSpacing: fs * 0.18, textTransform: "uppercase", color: t.ink }),
  card: (t) => ({ background: t.card, border: `5px solid ${t.ink}`, boxShadow: `12px 12px 0 ${t.ink}`, borderRadius: 6 }),
  chip: (t, i) => ({ fontFamily: DISPLAY, fontSize: 52, textTransform: "uppercase", color: i % 3 === 1 ? t.bg : t.ink, background: i % 3 === 1 ? t.ink : "transparent", border: `5px solid ${t.ink}`, boxShadow: `8px 8px 0 ${t.ink}` }),
  logo: (s) => <Img src={staticFile("oryn/img/logo.png")} style={{ width: s, height: s, borderRadius: s, border: `8px solid ${NAVY}` }} />,
};
/* Allocra */
export const allocra: VTheme = {
  cw: 0.36,
  tones: { red: T("#C12E19", "#F6DAC3", "#F2C892", "rgba(246,218,195,0.75)", "rgba(0,0,0,0.18)", "rgba(246,218,195,0.4)", "#F6DAC3", "#3d1812"), dark: T("#20130E", "#F6DAC3", "#F2C892", "rgba(246,218,195,0.7)", "rgba(246,218,195,0.06)", "rgba(246,218,195,0.3)", "#F6DAC3", "#3d1812"), cream: T("#F6DAC3", "#3d1812", "#C12E19", "rgba(61,24,18,0.7)", "rgba(255,255,255,0.35)", "rgba(61,24,18,0.35)", "#3d1812", "#F6DAC3") },
  backdrop: (t) => <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.line} 1px, transparent 1px), linear-gradient(90deg, ${t.line} 1px, transparent 1px)`, backgroundSize: "54px 54px", opacity: 0.18 }} />,
  h: (fs, t) => ({ fontFamily: AL_FONTS.serif, fontSize: fs, lineHeight: 0.98, letterSpacing: -fs * 0.025, color: t.ink }),
  accent: (s, t) => <span style={{ fontStyle: "italic", color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: AL_FONTS.sans, fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: AL_FONTS.mono, fontSize: fs, letterSpacing: fs * 0.18, textTransform: "uppercase", color: t.accent }),
  card: (t) => ({ background: t.card, border: `1px solid ${t.line}`, boxShadow: soft }),
  chip: (t) => ({ fontFamily: AL_FONTS.serif, fontSize: 54, color: t.ink, border: `1px solid ${t.line}`, background: t.card }),
  logo: (s) => <AlLogo size={s} />,
};
/* Collatera */
export const collatera: VTheme = {
  cw: 0.55,
  tones: { night: T(CL.night, CL.mint, CL.lime, CL.sage, CL.panel, CL.line, CL.lime, CL.night), green: T(CL.evergreen, CL.mint, CL.chartreuse, CL.sage, CL.panel, CL.line, CL.lime, CL.night), lime: T(CL.lime, CL.night, CL.forest, "#14402a", "#bfff66", "rgba(0,42,31,0.5)", CL.night, CL.lime) },
  backdrop: (t, _b, f) => (<><div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.line} 2px, transparent 2px)`, backgroundSize: "36px 36px", opacity: t.bg === CL.lime ? 0 : 0.55 }} />{t.bg !== CL.lime && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">{Array.from({ length: 30 }).map((_, i) => <rect key={i} x={Math.round(random(`a${i}`) * 1860 / 6) * 6} y={Math.round(random(`b${i}`) * 1000 / 6) * 6} width={6 + (i % 3) * 6} height={6 + (i % 3) * 6} fill={CL.lime} opacity={0.2 + 0.4 * Math.abs(Math.sin(f / 60 + i))} />)}</svg>}</>),
  h: (fs, t) => ({ fontFamily: CL_FONTS.pixel, fontWeight: 700, fontSize: fs * 0.62, lineHeight: 1.12, letterSpacing: 1, textTransform: "uppercase", color: t.bg === CL.lime ? CL.night : t.ink }),
  accent: (s, t) => <span style={{ color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: CL_FONTS.mono, fontSize: fs * 0.82, color: t.ink, lineHeight: 1.35 }),
  mono: (fs, t) => ({ fontFamily: CL_FONTS.pixel, fontWeight: 700, fontSize: fs * 0.8, color: t.accent, textTransform: "uppercase", letterSpacing: 1 }),
  card: (t) => ({ background: t.card, border: `4px solid ${CL.line}`, boxShadow: `16px 16px 0 ${CL.shadow}` }),
  chip: (t) => ({ fontFamily: CL_FONTS.pixel, fontWeight: 700, fontSize: 34, textTransform: "uppercase", color: t.ink, background: t.card, border: `4px solid ${t.bg === CL.lime ? CL.night : CL.lime}`, boxShadow: `10px 10px 0 ${CL.shadow}` }),
  logo: (s, t) => <PixMascot cell={s / 12} color={t.bg === CL.lime ? CL.night : CL.lime} />,
};
/* Quantora */
const paper = (bg: string, ink = "#161514") => T(bg, ink, ink, ink === "#161514" ? "#55524C" : "#b8b4aa", ink === "#161514" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.05)", ink === "#161514" ? "rgba(22,21,20,0.4)" : "rgba(236,232,223,0.35)", ink, bg);
export const quantora: VTheme = {
  cw: 0.5,
  tones: { paper: paper("#ECE8DF"), paper2: paper("#E2DDD2"), ink: paper("#161514", "#ECE8DF") },
  backdrop: (t) => <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><g stroke={t.line} strokeWidth={1.4}><line x1={90} y1={0} x2={90} y2={200} /><line x1={0} y1={90} x2={200} y2={90} /><line x1={1830} y1={1080} x2={1830} y2={880} /><line x1={1920} y1={990} x2={1720} y2={990} /></g></svg>,
  h: (fs, t) => ({ fontFamily: QF.serif, fontWeight: 400, fontSize: fs, letterSpacing: -fs * 0.02, color: t.ink }),
  accent: (s) => <span style={{ fontStyle: "italic" }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: QF.serif, fontSize: fs, color: t.ink, lineHeight: 1.25 }),
  mono: (fs, t) => ({ fontFamily: QF.mono, fontSize: fs * 0.8, letterSpacing: fs * 0.4, textTransform: "uppercase", color: t.mute }),
  card: (t) => ({ background: t.card, border: `1.5px solid ${t.line}`, boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }),
  chip: (t) => ({ fontFamily: QF.serif, fontSize: 50, color: t.ink, border: `1.5px solid ${t.line}`, background: t.card }),
  logo: (s) => <QMark s={s} />,
  chartLine: () => ({ d: DD, marks: [{ i: peak, label: "Peak" }, { i: trough, label: "Trough" }] }),
};
/* AegisNet */
export const aegis: VTheme = {
  cw: 0.53, tilt: true,
  tones: { black: T("#050505", "#fff", "#c9ccd1", "rgba(255,255,255,0.62)", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.2)", "#e9e9ea", "#050505"), black2: T("#0b0b0d", "#fff", "#c9ccd1", "rgba(255,255,255,0.62)", "rgba(255,255,255,0.08)", "rgba(255,255,255,0.2)", "#e9e9ea", "#050505") },
  backdrop: (_t, _b, f) => <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 16 }).map((_, k) => Array.from({ length: 110 }).map((__, i) => <circle key={`${k}${i}`} cx={i * 17.5 + 6} cy={800 + k * 14 + Math.sin(i * 0.11 + k * 0.28 + f / 70) * 70 * (0.4 + k / 16)} r={1.3} fill="#fff" opacity={0.1 + (k / 16) * 0.35 * random(`w${k}${i}`)} />))}</svg>,
  h: (fs, t) => ({ fontFamily: ASANS, fontWeight: 500, fontSize: fs, letterSpacing: -fs * 0.045, color: t.ink }),
  accent: (s, t) => <span style={{ fontFamily: ASERIF, fontStyle: "italic", fontWeight: 400, color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: ASANS, fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: fs * 0.85, letterSpacing: fs * 0.3, textTransform: "uppercase", color: t.mute }),
  card: (t) => ({ background: t.card, border: `1px solid ${t.line}`, borderRadius: 24, boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }),
  chip: (t) => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, color: t.ink, border: `1px solid ${t.line}`, borderRadius: 14, background: t.card }),
  logo: (s) => <AMark s={s} />,
};
/* SafeFi */
const INKS = "#0d0d0f";
export const safefi: VTheme = {
  cw: 0.58,
  tones: { white: T("#fbfbfb", INKS, "#5c5c63", "#5c5c63", "#fff", "rgba(0,0,0,0.14)", INKS, "#fff"), gray: T("#eceef0", INKS, "#5c5c63", "#5c5c63", "#fff", "rgba(0,0,0,0.14)", INKS, "#fff"), ink: T(INKS, "#fff", "#c9c9cf", "rgba(255,255,255,0.65)", "rgba(255,255,255,0.08)", "rgba(255,255,255,0.22)", "#fff", INKS) },
  backdrop: (t, b, f) => (<><div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.ink === INKS ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)"} 1px, transparent 1px), linear-gradient(90deg, ${t.ink === INKS ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)"} 1px, transparent 1px)`, backgroundSize: "180px 180px" }} />{b.k !== "end" && <div style={{ position: "absolute", right: 90, top: 80 + Math.sin(f / 60) * 12, opacity: 0.9 }}><Shield s={170} /></div>}</>),
  h: (fs, t) => ({ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: fs, letterSpacing: -fs * 0.045, color: t.ink }),
  accent: (s, t) => <span style={{ fontWeight: 400, color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: "Inter, sans-serif", fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: fs * 0.85, letterSpacing: fs * 0.3, textTransform: "uppercase", color: t.mute }),
  card: (t) => ({ background: t.card, borderRadius: 32, boxShadow: "0 24px 70px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)" }),
  chip: (t) => ({ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 40, color: t.ink, background: t.card, borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(128,128,128,0.2)" }),
  logo: (s) => <SLogo w={s * 1.8} invert={false} />,
};
/* Argus */
export const argus: VTheme = {
  cw: 0.54, tilt: true,
  tones: { black: T("#030504", "#f4f6f5", MINT, "rgba(255,255,255,0.66)", "rgba(255,255,255,0.06)", "rgba(255,255,255,0.2)", MINT, "#030504"), black2: T("#050807", "#f4f6f5", MINT, "rgba(255,255,255,0.66)", "rgba(255,255,255,0.07)", "rgba(255,255,255,0.2)", MINT, "#030504") },
  backdrop: (_t, b, f) => <><div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 45% at ${55 + Math.sin(f / 160) * 12}% 55%, rgba(20,200,140,0.45), rgba(8,100,70,0.2) 45%, transparent 75%)` }} /><svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 70 }).map((_, i) => <circle key={i} cx={random(`sx${b.id}${i}`) * 1920} cy={(random(`sy${b.id}${i}`) * 1080 + f * 0.1 * (1 + (i % 3))) % 1080} r={1.5 + random(`sr${i}`) * 6} fill={MINT} opacity={0.25 + random(`so${i}`) * 0.6} />)}</svg></>,
  h: (fs, t) => ({ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: fs, letterSpacing: -fs * 0.04, color: t.ink }),
  accent: (s) => <span style={{ background: `linear-gradient(90deg, #7ff5c9, ${MINT} 50%, #12b783)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: "Inter, sans-serif", fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: "'JetBrains Mono', monospace", fontSize: fs * 0.85, letterSpacing: fs * 0.3, textTransform: "uppercase", color: t.accent }),
  card: (t) => ({ background: t.card, border: `1px solid ${t.line}`, borderRadius: 26, boxShadow: "0 40px 100px rgba(0,0,0,0.55)" }),
  chip: (t) => ({ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 40, color: t.ink, border: `1px solid ${t.line}`, borderRadius: 18, background: t.card }),
  logo: (s) => <GLogo w={s * 1.3} />,
};
/* TerraNode (provisional) */
const VI = "#701CD0"; const QS = "Quicksand, sans-serif";
export const terranode: VTheme = {
  cw: 0.56,
  tones: { cream: T("#FBF6EC", "#15121c", VI, "#5d5568", "#fff", "rgba(21,18,28,0.2)", VI, "#fff"), gold: T("#F7D58E", "#15121c", VI, "#5a4630", "#fffaf0", "rgba(21,18,28,0.25)", VI, "#fff"), violet: T("#2a0c5c", "#fff", "#F4C36B", "rgba(255,255,255,0.75)", "rgba(255,255,255,0.12)", "rgba(255,255,255,0.3)", "#F4C36B", "#2a0c5c") },
  backdrop: (t) => <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 15 }).map((_, i) => <line key={i} x1={960 + (i - 7) * 30} y1={880} x2={960 + (i - 7) * 260} y2={1080} stroke={t.bg === "#2a0c5c" ? "#8c55d8" : "#6f9a52"} strokeWidth={5} opacity={0.6} />)}</svg>,
  h: (fs, t) => ({ fontFamily: QS, fontWeight: 700, fontSize: fs, letterSpacing: -fs * 0.03, color: t.ink }),
  accent: (s, t) => <span style={{ color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: QS, fontWeight: 600, fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: QS, fontWeight: 700, fontSize: fs * 0.85, letterSpacing: fs * 0.2, textTransform: "uppercase", color: t.accent }),
  card: (t) => ({ background: t.card, borderRadius: 30, boxShadow: "0 26px 64px rgba(60,40,100,0.2)", color: t.ink }),
  chip: (t) => ({ fontFamily: QS, fontWeight: 700, fontSize: 40, color: t.ink, background: t.card, borderRadius: 999, boxShadow: "0 14px 34px rgba(60,40,100,0.16)" }),
  logo: (s, t) => <div style={{ display: "flex", alignItems: "center", gap: 18 }}><div style={{ width: s * 0.14, height: s * 0.14, borderRadius: 99, background: t.accent }} /><div style={{ fontFamily: QS, fontWeight: 700, fontSize: s * 0.5, color: t.ink }}>TerraNode</div></div>,
};
/* DeSci */
export const desci: VTheme = {
  cw: 0.47,
  tones: { black: T("#050403", "#f7ecd0", "#f6d56a", "rgba(240,215,160,0.66)", "rgba(232,185,54,0.07)", "rgba(232,185,54,0.4)", "#f6d56a", "#050403"), black2: T("#0a0703", "#f7ecd0", "#f6d56a", "rgba(240,215,160,0.66)", "rgba(232,185,54,0.08)", "rgba(232,185,54,0.4)", "#f6d56a", "#050403") },
  backdrop: (_t, _b, f) => <><div style={{ position: "absolute", inset: 0, background: `radial-gradient(70% 45% at ${80 + Math.sin(f / 150) * 5}% 8%, rgba(200,146,31,0.4), transparent 70%)` }} /><div style={{ position: "absolute", left: -300, top: 800, width: 2520, height: 2520, borderRadius: 2520, background: "radial-gradient(circle at 50% 0%, rgba(232,185,54,0.4), rgba(120,78,10,0.2) 4%, rgba(5,4,3,0.95) 16%)", border: "2px solid rgba(246,213,106,0.5)", boxShadow: "0 -4px 40px rgba(246,213,106,0.4)" }} /></>,
  h: (fs, t) => ({ fontFamily: J, fontWeight: 300, fontSize: fs, letterSpacing: -fs * 0.02, color: t.ink }),
  accent: (s) => <span style={{ ...gt, fontWeight: 400 }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: J, fontWeight: 300, fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: J, fontWeight: 400, fontSize: fs * 0.85, letterSpacing: fs * 0.5, textTransform: "uppercase", color: t.mute }),
  card: (t) => ({ background: t.card, border: `1px solid ${t.line}`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }),
  chip: (t) => ({ fontFamily: J, fontWeight: 300, fontSize: 48, color: t.ink, border: `1px solid ${t.line}`, background: t.card }),
  logo: (s) => <DLogo s={s} />,
};
/* PolyMate */
export const polymate: VTheme = {
  cw: 0.6,
  tones: { cream: T("#F4EFE6", PM.ink, PM.lapis, PM.inkSoft, "linear-gradient(160deg,#fffdf8,#f1eadb)", "rgba(180,138,60,0.45)", PM.lapis, "#fff"), lapis: T("#2445C4", "#fff", PM.goldLight, "rgba(255,255,255,0.78)", "rgba(255,255,255,0.13)", "rgba(221,184,104,0.55)", PM.goldLight, PM.lapisDeep), red: T("#8E1F1F", "#fff", PM.goldLight, "rgba(255,255,255,0.8)", "rgba(255,255,255,0.12)", "rgba(221,184,104,0.55)", PM.goldLight, "#5e1111") },
  backdrop: (t) => <div style={{ position: "absolute", inset: 24, border: `2px solid ${t.line}`, opacity: 0.7 }} />,
  h: (fs, t) => ({ fontFamily: PM_FONTS.display, fontWeight: 800, fontStyle: "italic", fontSize: fs, letterSpacing: -fs * 0.035, color: t.ink }),
  accent: (s, t) => <span style={{ fontFamily: PM_FONTS.serif, fontStyle: "italic", fontWeight: 400, color: t.accent }}>{s}</span>,
  s: (fs, t) => ({ fontFamily: PM_FONTS.ui, fontWeight: 500, fontSize: fs, color: t.ink, lineHeight: 1.3 }),
  mono: (fs, t) => ({ fontFamily: "Cinzel, serif", fontWeight: 700, fontSize: fs * 0.8, letterSpacing: fs * 0.22, textTransform: "uppercase", color: t.accent }),
  card: (t) => ({ background: t.card, border: `2px solid ${PM.goldLight}`, borderRadius: 30, boxShadow: soft }),
  chip: (t) => ({ fontFamily: PM_FONTS.ui, fontWeight: 700, fontSize: 40, color: t.ink, background: t.card, border: `2px solid ${PM.goldLight}`, borderRadius: 999 }),
  logo: (s) => <Emblem s={s * 1.1} />,
};
/* VYBE */
export const vybe: VTheme = {
  cw: 0.5,
  tones: { cyan: T("#62eaf8", V.navy, "#fff", "#2b4a70", "#fff", V.navy, V.navy, "#fff"), yellow: T("#f3f460", V.navy, V.pinkDeep, "#4f4a00", "#fff", V.navy, V.navy, V.yellow), pink: T("#f493e9", V.navy, "#fff", "#5a1a55", "#fff", V.navy, V.navy, "#fff"), lime: T("#b9f35f", V.navy, "#fff", "#2f5a00", "#fff", V.navy, V.navy, V.lime) },
  backdrop: (_t, _b, f) => <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.35) 3px, transparent 3px), linear-gradient(90deg, rgba(255,255,255,0.35) 3px, transparent 3px)", backgroundSize: "84px 84px", backgroundPosition: `${f * 0.3}px ${f * 0.3}px`, opacity: 0.6 }} />,
  h: (fs) => ({ fontFamily: LIL, fontSize: fs, color: "#fff", WebkitTextStroke: `${Math.max(6, fs * 0.07)}px ${V.navy}`, paintOrder: "stroke fill", textShadow: `0 ${fs * 0.06}px 0 ${V.navy}`, lineHeight: 1.02 }) as React.CSSProperties & { paintOrder?: string },
  accent: (s, t) => <span style={{ color: t.accent === "#fff" ? V.yellow : t.accent }}>{s}</span>,
  s: (fs) => ({ fontFamily: VOUT, fontWeight: 700, fontSize: fs, color: V.navy, lineHeight: 1.25 }),
  mono: (fs) => ({ fontFamily: VOUT, fontWeight: 800, fontSize: fs * 0.9, letterSpacing: fs * 0.15, textTransform: "uppercase", color: V.navy }),
  card: () => ({ background: "#fff", border: `7px solid ${V.navy}`, borderRadius: 34, boxShadow: `14px 14px 0 ${V.navy}` }),
  chip: (_t, i) => ({ fontFamily: LIL, fontSize: 48, color: V.navy, background: [V.yellow, V.chip, V.pink, V.lime][i % 4], border: `6px solid ${V.navy}`, borderRadius: 999, boxShadow: `8px 8px 0 ${V.navy}` }),
  logo: (s) => <div style={{ display: "flex", alignItems: "center", gap: 30 }}><VMascot s={s * 0.7} /><VLogo w={s * 1.6} /></div>,
};
