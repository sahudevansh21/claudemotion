import { random } from "remotion";
import { Mascot } from "../Collatera/components/Mascot";
import "../Collatera/brand";
import { CL, CL_FONTS } from "../Collatera/brand";
import { makeStill } from "./still";

/** COLLATERA X-profile posts (15): banner system = night-green pixel world, lime pixel type (Silkscreen), pixel moon + stars, bordered panels with offset pixel shadow, the decoded mascot. All figures are labelled illustrative. */
const px = (fs: number, color: string = CL.lime, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: CL_FONTS.pixel, fontWeight: 700, fontSize: fs, color, lineHeight: 1.12, letterSpacing: 1, textTransform: "uppercase", ...extra });
const body = (fs: number, color: string = CL.mint, extra: React.CSSProperties = {}): React.CSSProperties => ({ fontFamily: CL_FONTS.mono, fontSize: fs, lineHeight: 1.4, color, ...extra });

const Stars: React.FC<{ n?: number; seed?: string; maxY?: number }> = ({ n = 26, seed = "s", maxY = 700 }) => (
  <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">
    {Array.from({ length: n }).map((_, i) => {
      const s = 6 + Math.floor(random(`${seed}s${i}`) * 3) * 6;
      return <rect key={i} x={Math.round(random(`${seed}x${i}`) * 1000 / 6) * 6 + 30} y={Math.round(random(`${seed}y${i}`) * maxY / 6) * 6 + 60} width={s} height={s} fill={CL.lime} opacity={0.35 + random(`${seed}o${i}`) * 0.5} />;
    })}
  </svg>
);
const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 90 }) => {
  const cells = [];
  const c = 12;
  for (let gy = -r; gy <= r; gy += c) for (let gx = -r; gx <= r; gx += c) if (gx * gx + gy * gy <= r * r && !(gy > 10 && gy < 30)) cells.push(<rect key={`${gx}${gy}`} x={x + gx} y={y + gy} width={c} height={c} fill={CL.lime} />);
  return <svg width={1080} height={1350} style={{ position: "absolute", inset: 0 }} shapeRendering="crispEdges">{cells}</svg>;
};
const Water: React.FC<{ y: number }> = ({ y }) => (
  <svg width={1080} height={400} style={{ position: "absolute", left: 0, top: y }} shapeRendering="crispEdges">
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={540 - (240 - i * 14) * (1 - i * 0.03)} y={i * 18} width={(240 - i * 14) * 2 * (1 - i * 0.03)} height={6} fill={CL.lime} opacity={0.75 - i * 0.055} />)}
    <rect x={0} y={0} width={1080} height={4} fill={CL.lime} opacity={0.5} />
  </svg>
);
const Bg: React.FC<{ c?: string; grid?: boolean }> = ({ c = CL.night, grid = true }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: c }} />
    {grid && <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.line} 2px, transparent 2px)`, backgroundSize: "36px 36px", opacity: 0.55 }} />}
  </>
);
const Panel: React.FC<{ x: number; y: number; w: number; h?: number; children?: React.ReactNode; hi?: boolean; style?: React.CSSProperties }> = ({ x, y, w, h, children, hi, style }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: CL.panel, border: `3px solid ${hi ? CL.lime : CL.line}`, boxShadow: `14px 14px 0 ${CL.shadow}`, boxSizing: "border-box", padding: 36, ...style }}>{children}</div>
);
const Foot: React.FC<{ n: number; c?: string }> = ({ n, c = CL.sage }) => (
  <div style={{ ...px(15, c, { fontWeight: 400 }), position: "absolute", left: 60, right: 60, bottom: 44, display: "flex", justifyContent: "space-between" }}>
    <span>Collatera · Illustrative demo data · Not financial advice</span><span>{String(n).padStart(2, "0")}/15</span>
  </div>
);
const Label: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = CL.lime }) => <div style={{ ...px(22, c), position: "absolute", left: 60, top: 64 }}>{children}</div>;
const Head: React.FC<{ children: React.ReactNode; fs: number; top: number; c?: string; style?: React.CSSProperties }> = ({ children, fs, top, c = CL.lime, style }) => <div style={{ ...px(fs, c), position: "absolute", left: 60, right: 60, top, ...style }}>{children}</div>;
const Chip: React.FC<{ children: React.ReactNode; bg?: string; fg?: string; style?: React.CSSProperties }> = ({ children, bg = CL.lime, fg = CL.night, style }) => <div style={{ ...px(20, fg), background: bg, padding: "8px 16px", display: "inline-block", ...style }}>{children}</div>;
const Bar: React.FC<{ x: number; y: number; w: number; v: number; c?: string }> = ({ x, y, w, v, c = CL.lime }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: 34, border: `3px solid ${CL.line}`, boxSizing: "border-box", background: CL.night }}>
    <div style={{ width: `${v * 100}%`, height: "100%", background: c }} />
  </div>
);

const P1: React.FC = () => (
  <>
    <Bg /><Stars seed="a" /><Moon x={880} y={190} />
    <Mascot cell={36} style={{ position: "absolute", left: 60, top: 320 }} />
    <Head fs={92} top={780}>Collatera</Head>
    <div style={{ ...body(34), position: "absolute", left: 60, right: 100, top: 910 }}>Monitoring collateral risk across DeFi and tokenized assets.</div>
    <Water y={1060} /><Foot n={1} />
  </>
);
const P2: React.FC = () => (
  <>
    <Bg /><Stars seed="b" n={18} maxY={400} />
    <Label>Collateral risk</Label>
    <Head fs={104} top={200}>Collateral risk doesn't wait.</Head>
    <Head fs={104} top={760} c={CL.mint}>Your monitoring shouldn't either.</Head>
    <Foot n={2} />
  </>
);
const P3: React.FC = () => (
  <>
    <Bg c={CL.evergreen} />
    <Label>Collateral risk monitoring / 001</Label>
    <Head fs={104} top={190}>Catch stale<br />oracles<br /><span style={{ color: CL.chartreuse }}>before</span><br />they catch<br />you.</Head>
    <Mascot cell={20} style={{ position: "absolute", right: 70, bottom: 150 }} />
    <Foot n={3} />
  </>
);
const P4: React.FC = () => (
  <>
    <Bg /><Moon x={870} y={210} r={80} /><Stars seed="d" n={20} maxY={500} />
    <Label>Signals</Label>
    <Head fs={120} top={360}>Real-time signals.</Head>
    <Head fs={120} top={770} c={CL.chartreuse}>Smarter risk decisions.</Head>
    <Foot n={4} />
  </>
);
const P5: React.FC = () => (
  <>
    <Bg /><Label>01 / Buffer</Label>
    <Head fs={110} top={170}>Watch the buffer.</Head>
    <Panel x={60} y={480} w={960} h={520} hi>
      <div style={px(24, CL.sage)}>Collateral buffer · Illustrative</div>
      <div style={{ ...px(100, CL.lime), marginTop: 30 }}>Buffer</div>
      <Bar x={36} y={250} w={888} v={0.62} />
      <div style={{ ...body(26, CL.mint), marginTop: 190 }}>A buffer is the room a position has before it needs attention. Demo figures only.</div>
    </Panel>
    <Foot n={5} />
  </>
);
const P6: React.FC = () => (
  <>
    <Bg /><Label>02 / Price freshness</Label>
    <Head fs={110} top={170}>Is the price still fresh?</Head>
    <Panel x={60} y={560} w={960} h={470}>
      <div style={px(24, CL.sage)}>Oracle price feed · Illustrative</div>
      {[["Feed", "FRESH", CL.lime, CL.night], ["Feed", "AGING", "#F3F460", CL.night], ["Feed", "STALE", "#FF5A3C", "#fff"]].map(([k, v, bg, fg], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 100, borderBottom: i < 2 ? `2px solid ${CL.line}` : "none", marginTop: i === 0 ? 24 : 0 }}>
          <span style={px(34, CL.mint)}>{k} 0{i + 1}</span><Chip bg={bg} fg={fg}>{v}</Chip>
        </div>
      ))}
    </Panel>
    <Foot n={6} />
  </>
);
const P7: React.FC = () => (
  <>
    <Bg /><Moon x={860} y={200} r={70} /><Label>03 / Closed-market liquidity risk</Label>
    <Head fs={104} top={340}>Closed-market liquidity risk.</Head>
    <div style={{ ...body(38, CL.mint), position: "absolute", left: 60, right: 100, top: 880 }}>Prices can gap between market close and the next open.</div>
    <Foot n={7} />
  </>
);
const P8: React.FC = () => (
  <>
    <Bg /><Label>Workflow</Label>
    <Head fs={88} top={190}>How it works.</Head>
    {["Monitor", "Stress test", "Get alerts", "Preview repayment"].map((t, i) => (
      <Panel key={t} x={60} y={380 + i * 200} w={960} h={160} hi={i === 0} style={{ padding: "0 40px", display: "flex", alignItems: "center", gap: 36 }}>
        <span style={px(54, CL.chartreuse)}>0{i + 1}</span><span style={px(48, CL.mint)}>{t}</span>
      </Panel>
    ))}
    <Foot n={8} />
  </>
);
const P9: React.FC = () => (
  <>
    <Bg /><Label>Stress test</Label>
    <Head fs={104} top={190}>Drag the price.</Head>
    <Panel x={60} y={620} w={960} h={380}>
      <div style={px(24, CL.sage)}>Stress scenario · Illustrative</div>
      <div style={{ ...px(120, "#FF5A3C", { fontFamily: CL_FONTS.mono }), marginTop: 20 }}>-20%</div>
      <div style={{ position: "absolute", left: 36, right: 36, top: 270, height: 8, background: CL.line }} />
      <div style={{ position: "absolute", left: 36, width: 590, top: 270, height: 8, background: CL.lime }} />
      <div style={{ position: "absolute", left: 610, top: 246, width: 36, height: 56, background: CL.lime, boxShadow: `6px 6px 0 ${CL.shadow}` }} />
    </Panel>
    <div style={{ ...body(24, CL.sage), position: "absolute", left: 60, right: 60, top: 1080 }}>A user-chosen stress scenario, not a forecast.</div>
    <Foot n={9} />
  </>
);
const P10: React.FC = () => (
  <>
    <Bg /><Label>Read-only</Label>
    <Head fs={100} top={230}>Read-only<br />risk<br />monitoring.</Head>
    <Panel x={60} y={900} w={960} hi style={{ padding: "30px 36px" }}><div style={px(26, CL.mint)}>Preview only · No transaction is sent · You decide</div></Panel>
    <Foot n={10} />
  </>
);
const P11: React.FC = () => (
  <>
    <Bg c={CL.lime} grid={false} />
    <div style={{ ...px(96, CL.night), position: "absolute", left: 60, right: 60, top: 260 }}>See it.<br />Understand<br />it.<br />Decide.</div>
    <Mascot cell={22} color={CL.night} shadow={false} style={{ position: "absolute", left: 60, bottom: 150 }} />
    <Foot n={11} c={CL.night} />
  </>
);
const P12: React.FC = () => (
  <>
    <Bg /><Stars seed="l" n={14} maxY={300} /><Label>What we watch</Label>
    <Head fs={80} top={190}>Across DeFi and tokenized assets.</Head>
    {["DeFi", "Tokenized assets"].map((t, i) => (
      <Panel key={t} x={60} y={640 + i * 230} w={960} h={190} hi={i === 1} style={{ display: "flex", alignItems: "center" }}><span style={px(66, CL.mint)}>{t}</span></Panel>
    ))}
    <Foot n={12} />
  </>
);
const P13: React.FC = () => (
  <>
    <Bg c={CL.evergreen} /><Label>Principle</Label>
    <Head fs={96} top={230}>Monitoring<br />first.</Head>
    <Head fs={96} top={650} c={CL.chartreuse}>Automation<br />later.</Head>
    <Water y={1020} /><Foot n={13} />
  </>
);
const P14: React.FC = () => (
  <>
    <Bg /><Moon x={850} y={230} r={90} /><Stars seed="n" n={18} maxY={460} />
    <Label>Demo v1</Label>
    <Head fs={100} top={440}>Starting on<br />Algorand.</Head>
    <Chip style={{ position: "absolute", left: 60, top: 760 }}>Demo v1</Chip>
    <Water y={1010} /><Foot n={14} />
  </>
);
const P15: React.FC = () => (
  <>
    <Bg /><Stars seed="z" n={22} maxY={480} /><Moon x={900} y={170} r={70} />
    <Mascot cell={40} style={{ position: "absolute", left: 270, top: 330 }} />
    <Head fs={88} top={800} style={{ textAlign: "center" }}>Collatera</Head>
    <div style={{ ...px(26, CL.mint), position: "absolute", left: 0, right: 0, top: 930, textAlign: "center" }}>Real-time signals. Smarter risk decisions.</div>
    <div style={{ ...px(30, CL.lime), position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center" }}>collatera.buzz · @collatera_io</div>
    <Foot n={15} />
  </>
);
export const CollateraX = makeStill([P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15], CL.night);
