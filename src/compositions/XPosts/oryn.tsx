import { Img, staticFile } from "remotion";
import { DEPLOYMENTS, DISPLAY, MONO, SANS, VERDICTS, type Status } from "../Oryn/brand";
import { makeStill } from "./still";

/** ORYN X-profile posts (15): banner system = cream stock, cyan halftone glow, navy cloud scallops, orange asterisk + flame, navy tracked caps. Verdict copy is verbatim from the Oryn board (simulated issuer data). */
export const NAVY = "#1d3fa8";
export const CYAN = "#58c3dc";
export const OR = "#f0501e";
export const CREAM = "#f0e9d6";

export const cap = (fs: number, color: string = NAVY, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: SANS, fontWeight: 700, fontSize: fs, letterSpacing: fs * 0.22, textTransform: "uppercase", color, ...extra });
export const disp = (fs: number, color: string = NAVY, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: DISPLAY, fontSize: fs, lineHeight: 0.98, textTransform: "uppercase", color, letterSpacing: 1, ...extra });

export const Halftone: React.FC<{ cx: number; cy: number; w: number; h: number; dot?: number }> = ({ cx, cy, w, h, dot = 20 }) => {
  const mask = "radial-gradient(ellipse at center, #000 0%, rgba(0,0,0,0.85) 35%, transparent 70%)";
  return <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, backgroundImage: `radial-gradient(circle, ${CYAN} 36%, transparent 40%)`, backgroundSize: `${dot}px ${dot}px`, WebkitMaskImage: mask, maskImage: mask, opacity: 0.9 }} />;
};
export const Cloud: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `scale(${flip ? -s : s}, ${s})`, transformOrigin: "0 0" }} width={420} height={220} viewBox="0 0 420 220">
    {[[60, 160, 70], [150, 120, 90], [250, 140, 75], [340, 150, 70], [210, 190, 80]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={NAVY} />)}
    {[[130, 90, 50], [235, 108, 44], [330, 120, 36]].map(([cx, cy, r], i) => <path key={i} d={`M${cx - r} ${cy + 20} A${r} ${r} 0 0 1 ${cx + r} ${cy + 20}`} fill="none" stroke={CREAM} strokeWidth={6} strokeLinecap="round" opacity={0.9} />)}
  </svg>
);
export const Clouds: React.FC<{ y?: number }> = ({ y = 1130 }) => (
  <>
    <Cloud x={-120} y={y} /><Cloud x={250} y={y + 50} s={0.8} /><Cloud x={620} y={y + 10} s={1.05} /><Cloud x={870} y={y + 60} s={0.8} />
  </>
);
export const Asterisk: React.FC<{ s: number; color?: string; style?: React.CSSProperties }> = ({ s, color = OR, style }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={style}>
    {[0, 60, 120].map((a) => <rect key={a} x={42} y={8} width={16} height={84} rx={3} fill={color} transform={`rotate(${a} 50 50)`} />)}
  </svg>
);
export const Ring: React.FC<{ s: number }> = ({ s }) => (
  <div style={{ width: s, height: s, borderRadius: s, border: `${s * 0.03}px solid ${NAVY}`, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", background: CREAM }}>
    <Asterisk s={s * 0.6} />
  </div>
);
export const Flame: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s * 1.25} viewBox="0 0 80 100"><path d="M42 2C44 22 70 34 70 62c0 20-14 34-30 34S10 82 10 64c0-14 8-22 14-30 2 10 8 14 12 14C34 34 36 16 42 2z" fill={OR} /></svg>
);
export const Rule: React.FC<{ y: number }> = ({ y }) => (
  <div style={{ position: "absolute", left: 120, right: 120, top: y, display: "flex", alignItems: "center", gap: 14 }}>
    <div style={{ flex: 1, height: 3, background: NAVY }} /><Asterisk s={34} /><div style={{ flex: 1, height: 3, background: NAVY }} />
  </div>
);
export const Bg: React.FC<{ glow?: boolean; clouds?: boolean; cx?: number; cy?: number }> = ({ glow = true, clouds = true, cx = 540, cy = 430 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: CREAM }} />
    {glow && <Halftone cx={cx} cy={cy} w={1300} h={900} />}
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: NAVY }} /><div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 16, background: NAVY }} />
    {clouds && <Clouds />}
  </>
);
export const Foot: React.FC<{ n: number; total?: number; light?: boolean }> = ({ n, total = 15, light }) => (
  <div style={{ ...cap(13, light ? CREAM : NAVY, { letterSpacing: 3 }), position: "absolute", left: 60, right: 60, bottom: 40, display: "flex", justifyContent: "space-between", zIndex: 4 }}>
    <span>ORYN · Simulated issuer data · Not investment advice</span><span>{String(n).padStart(2, "0")}/{total}</span>
  </div>
);
export const Head: React.FC<{ children: React.ReactNode; fs: number; top: number; c?: string; center?: boolean; style?: React.CSSProperties }> = ({ children, fs, top, c = NAVY, center, style }) => (
  <div style={{ ...disp(fs, c), position: "absolute", left: 70, right: 70, top, textAlign: center ? "center" : "left", ...style }}>{children}</div>
);
export const Tag: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 70 }) => <div style={{ ...cap(20, NAVY), position: "absolute", left: 70, top }}>{children}</div>;

const P1: React.FC = () => (
  <>
    <Bg />
    <div style={{ position: "absolute", left: 250, top: 240, display: "flex", alignItems: "center", gap: 40 }}>
      <Ring s={300} /><div style={{ width: 4, height: 260, background: NAVY }} /><Flame s={170} />
    </div>
    <div style={{ ...cap(44, NAVY, { textAlign: "center" }), position: "absolute", left: 0, right: 0, top: 640 }}>State of assets activated</div>
    <Rule y={730} />
    <div style={{ ...cap(24, NAVY, { textAlign: "center", letterSpacing: 5 }), position: "absolute", left: 80, right: 80, top: 810 }}>Real-time intelligence for tokenized assets.</div>
    <Foot n={1} light />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg /><Tag>Pinned / 01</Tag>
    <Head fs={186} top={190}>Introducing ORYN.</Head>
    <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 46, lineHeight: 1.25, color: NAVY, position: "absolute", left: 70, right: 100, top: 700 }}>The real-time intelligence for tokenized assets.</div>
    <Foot n={2} light />
  </>
);
const P3: React.FC = () => (
  <>
    <Bg clouds={false} /><Tag>What it tracks</Tag>
    <Head fs={120} top={150}>It tracks</Head>
    {["Corporate actions", "Market sessions", "Redemption windows", "Data freshness"].map((t, i) => (
      <div key={t} style={{ position: "absolute", left: 70, right: 70, top: 380 + i * 200, borderTop: `4px solid ${NAVY}`, paddingTop: 30, display: "flex", alignItems: "center", gap: 28 }}>
        <Asterisk s={56} /><span style={disp(82, i % 2 ? OR : NAVY)}>{t}</span>
      </div>
    ))}
    <Foot n={3} />
  </>
);
const P4: React.FC = () => (
  <>
    <Bg /><Tag>Coverage</Tag>
    <Head fs={150} top={190}>Across issuers and chains.</Head>
    <div style={{ display: "flex", gap: 20, position: "absolute", left: 70, top: 760 }}>
      {["ETH", "SOL", "BASE", "ARB"].map((c) => <div key={c} style={{ ...cap(28, "#fff", { letterSpacing: 4 }), background: NAVY, padding: "16px 30px" }}>{c}</div>)}
    </div>
    <Foot n={4} light />
  </>
);
const P5: React.FC = () => (
  <>
    <Bg cy={600} /><Tag>One status</Tag>
    <Head fs={190} top={200}>One live status for every asset.</Head>
    <Foot n={5} light />
  </>
);
const P6: React.FC = () => {
  const order: Status[] = ["open", "closed", "pending", "redemption", "stale", "divergent"];
  return (
    <>
      <Bg clouds={false} /><Tag>The verdicts</Tag>
      <Head fs={130} top={140}>Six verdicts.</Head>
      {order.map((k, i) => {
        const v = VERDICTS[k];
        return (
          <div key={k} style={{ position: "absolute", left: 70 + (i % 2) * 480, top: 380 + Math.floor(i / 2) * 270, width: 460, height: 240, background: v.bg, border: `4px solid ${NAVY}`, boxShadow: `10px 10px 0 ${NAVY}`, padding: 30, boxSizing: "border-box", color: v.fg }}>
            <div style={{ fontSize: 70, lineHeight: 1 }}>{v.glyph}</div>
            <div style={disp(54, v.fg, { marginTop: 22 })}>{v.label}</div>
          </div>
        );
      })}
      <Foot n={6} />
    </>
  );
};
export const Dep: React.FC<{ n: number; idx: number; q: string }> = ({ n, idx, q }) => {
  const d = DEPLOYMENTS[idx]; const v = VERDICTS[d.status];
  return (
    <>
      <Bg clouds={false} glow={false} />
      <div style={{ position: "absolute", left: 16, right: 16, top: 0, height: 700, background: v.bg }} />
      <Halftone cx={800} cy={300} w={800} h={600} />
      <div style={{ ...cap(20, v.fg), position: "absolute", left: 70, top: 70 }}>{q}</div>
      <div style={disp(210, v.fg, { position: "absolute", left: 70, top: 150, textTransform: "none" })}>{d.sym}</div>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 34, lineHeight: 1.2, color: v.fg, position: "absolute", left: 70, top: 390, right: 70 }}>{d.name} · {d.chain}</div>
      <div style={{ position: "absolute", left: 70, top: 560, background: v.chip, color: v.chipFg, ...cap(30, v.chipFg), padding: "14px 28px" }}>{v.glyph} {v.label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 54, lineHeight: 1.25, color: NAVY, position: "absolute", left: 70, right: 70, top: 780 }}>{d.reason}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: NAVY, position: "absolute", left: 70, top: 1130, textTransform: "uppercase", letterSpacing: 2 }}>{d.next}</div>
      <Foot n={n} />
    </>
  );
};
const P7: React.FC = () => <Dep n={7} idx={0} q="Market closed" />;
const P8: React.FC = () => <Dep n={8} idx={1} q="Divergent" />;
const P9: React.FC = () => <Dep n={9} idx={2} q="Action pending" />;
const P10: React.FC = () => <Dep n={10} idx={4} q="Stale" />;
const P11: React.FC = () => <Dep n={11} idx={6} q="Redemption closed" />;
const P12: React.FC = () => <Dep n={12} idx={7} q="Open" />;
const P13: React.FC = () => (
  <>
    <Bg cy={620} /><Tag>Rule of thumb</Tag>
    <Head fs={200} top={190}>Unknown means not actionable.</Head>
    <Foot n={13} light />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg /><Tag>The question</Tag>
    <Head fs={240} top={190}>Is it safe to act?</Head>
    <div style={{ display: "flex", gap: 16, position: "absolute", left: 70, top: 880, flexWrap: "wrap", width: 940 }}>
      {(["open", "closed", "pending", "stale", "divergent"] as Status[]).map((k) => <div key={k} style={{ ...cap(24, VERDICTS[k].chipFg, { letterSpacing: 3 }), background: VERDICTS[k].chip, padding: "12px 22px" }}>{VERDICTS[k].glyph} {VERDICTS[k].label}</div>)}
    </div>
    <Foot n={14} light />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg cy={500} />
    <Img src={staticFile("oryn/img/logo.png")} style={{ position: "absolute", left: 340, top: 190, width: 400, height: 400, borderRadius: 400, border: `6px solid ${NAVY}` }} />
    <Head fs={150} top={640} center>ORYN</Head>
    <div style={{ ...cap(22, NAVY, { textAlign: "center", letterSpacing: 4 }), position: "absolute", left: 60, right: 60, top: 810 }}>Real-time intelligence for tokenized assets.</div>
    <div style={{ ...cap(26, OR, { textAlign: "center", letterSpacing: 5 }), position: "absolute", left: 0, right: 0, top: 900 }}>oryn.solrun.fun · @oryn_io</div>
    <Foot n={15} light />
  </>
);
export const OrynX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], CREAM);
