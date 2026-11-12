import { Mark, Mono, Paper, Q, F, Chart, DD, FAN, PA, PB, peak, series, trough } from "./quantora";
import { type Box, type Item, type Theme, makeAccount } from "./engine";
import data from "./data/quantora.json";

/** QUANTORA LABS: 20 new posts in the banner system (warm paper, Newsreader, Jost wordmark, mono labels, fine charts). All charts are synthetic and labelled. */
const rise = series("r20", 120, (t) => 0.8 + t * 1.2 + Math.sin(t * 9) * 0.12, 0.07);
const smooth = series("sm", 120, (t) => 0.9 + t * 1.0, 0.015);
const jag = series("jg", 120, (t) => 0.9 + t * 1.0, 0.16);
const recov = DD.map((v) => v);
const tone = { ink: Q.ink, mute: Q.soft, accent: Q.ink, line: Q.line };
const theme: Theme = {
  cw: 0.5, sCw: 0.52, lh: 1.0, hMax: 168, hMin: 60,
  tone: () => tone,
  bg: (n) => (<><Paper seed={50 + n} /><svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }}><g stroke={Q.grid} strokeWidth={1.2}><line x1={60} y1={0} x2={60} y2={120} /><line x1={0} y1={60} x2={120} y2={60} /><line x1={1020} y1={1350} x2={1020} y2={1230} /><line x1={1080} y1={1290} x2={960} y2={1290} /></g><line x1={70} y1={1262} x2={1010} y2={1262} stroke={Q.line} strokeWidth={1.2} /></svg></>),
  foot: (n) => <Mono size={12} style={{ position: "absolute", left: 70, right: 70, bottom: 38, display: "flex", justifyContent: "space-between", letterSpacing: 4, color: Q.soft }}><span>Quantora research preview · Synthetic demo data</span><span>{String(n).padStart(2, "0")}/20</span></Mono>,
  lab: (t) => <Mono size={16} style={{ position: "absolute", left: 70, top: 78 }}>{t}</Mono>,
  h: (fs) => ({ fontFamily: F.serif, fontWeight: 400, fontSize: fs, letterSpacing: -fs * 0.02, color: Q.ink }),
  accent: (t) => <span style={{ fontStyle: "italic" }}>{t}</span>,
  s: (fs) => ({ fontFamily: F.serif, fontSize: fs, color: Q.soft, lineHeight: 1.25 }),
  num: (i) => <Mono size={18}>{String(i + 1).padStart(2, "0")}</Mono>,
  opt: (i, t, w, h) => (<div style={{ width: w, height: h, borderTop: `1.4px solid ${Q.line}`, borderBottom: `1.4px solid ${Q.line}`, display: "flex", alignItems: "center", gap: 36 }}><Mono size={24}>{"ABCD"[i]}</Mono><span style={{ fontFamily: F.serif, fontSize: Math.min(58, h * 0.5), color: Q.ink, lineHeight: 1 }}>{t.replace(/^[A-D]\s+/, "")}</span></div>),
  card: (c, b, _t, i) => <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, border: `1.4px solid ${Q.line}`, padding: 34, boxSizing: "border-box", background: i ? "rgba(255,255,255,0.25)" : "transparent", color: Q.ink }}>{c}</div>,
  vis: (v, b: Box) => {
    const h = Math.min(b.h - 40, 440); const w = 940;
    if (v === "dd") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: h * 0.3, up: true }, { i: trough, label: "Low", line: h * 0.22 }]} />;
    if (v === "paths") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lines={[{ d: PA }, { d: PB, op: 0.5 }]} />;
    if (v === "fan") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lo={0} hi={2.4} lines={FAN.map((d, k) => ({ d, width: 1.4, op: 0.35 + (k % 3) * 0.15 }))} />;
    if (v === "rise") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lines={[{ d: rise }]} marks={[{ i: 70, label: "Context", line: h * 0.25 }]} />;
    if (v === "vol") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lines={[{ d: jag, op: 0.8 }, { d: smooth, width: 2.8 }]} />;
    if (v === "recov") return <Chart x={b.x} y={b.y + 10} w={w} h={h} lines={[{ d: recov }]} marks={[{ i: trough, label: "-50% needs +100%", line: h * 0.2 }]} />;
    if (v === "basket") return (<div style={{ position: "absolute", left: b.x, top: b.y + 10, width: w }}>{[["Holding 1", 34], ["Holding 2", 26], ["Holding 3", 18], ["Holding 4", 12], ["Holding 5", 10]].map(([l, x]) => <div key={l} style={{ display: "flex", alignItems: "center", gap: 20, height: 56 }}><Mono size={14} style={{ width: 200 }}>{l}</Mono><div style={{ height: 22, width: Number(x) * 18, background: Q.ink, opacity: 0.8 }} /></div>)}<Mono size={13} style={{ color: Q.soft, marginTop: 10 }}>Illustrative basket · synthetic</Mono></div>);
    if (v === "hist") return (<svg style={{ position: "absolute", left: b.x, top: b.y + 20 }} width={w} height={Math.min(b.h - 40, 360)}>{Array.from({ length: 28 }).map((_, i) => { const hh = 20 + 260 * Math.exp(-Math.pow((i - 13) / 6, 2)); return <rect key={i} x={i * 33 + 6} y={Math.min(b.h - 40, 360) - hh} width={26} height={hh} fill={Q.ink} opacity={0.75} />; })}</svg>);
    if (v === "mark") return <Mark s={Math.min(260, b.h - 20)} style={{ position: "absolute", left: b.x, top: b.y + 10 }} />;
    return null;
  },
  end: (it) => (<><Mark s={210} style={{ position: "absolute", left: 435, top: 300 }} /><div style={{ fontFamily: F.word, fontSize: 90, letterSpacing: 14, color: Q.ink, position: "absolute", left: 0, right: 0, textAlign: "center", top: 560, paddingLeft: 14 }}>QUANTORA</div><div style={{ fontFamily: F.serif, fontSize: 56, color: Q.ink, position: "absolute", left: 80, right: 80, top: 720, textAlign: "center", lineHeight: 1.05 }}>{it.s}</div><Mono size={19} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 1000 }}>quantora.buzz · @Quantora_Labs</Mono></>),
};
export const QuantoraX20 = makeAccount(theme, data as Item[], Q.paper);
