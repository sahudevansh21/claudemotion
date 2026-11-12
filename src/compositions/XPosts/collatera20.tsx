import { Mascot } from "../Collatera/components/Mascot";
import { CL, CL_FONTS } from "../Collatera/brand";
import { Bar, Bg, Chip, Foot, Head, Label, Moon, Panel, Stars, Water, body, px } from "./collatera";
import { makeStill } from "./still";

/** COLLATERA set 2 (20 new posts): pixel world, lime Silkscreen type. All gauges are illustrative. */
const F: React.FC<{ n: number }> = ({ n }) => <Foot n={n} total={20} />;
const Big: React.FC<{ n: number; k: string; w: React.ReactNode; sub?: string; moon?: boolean; water?: boolean }> = ({ n, k, w, sub, moon, water }) => (
  <>
    <Bg />{moon && <Moon x={880} y={200} r={80} />}<Stars seed={`b${n}`} n={18} maxY={460} /><Label>{k}</Label>
    <Head fs={104} top={300}>{w}</Head>
    {sub && <div style={{ ...body(36), position: "absolute", left: 60, right: 100, top: 900 }}>{sub}</div>}
    {water && <Water y={1030} />}<F n={n} />
  </>
);
const Step4: React.FC<{ n: number; i: number; t: string }> = ({ n, i, t }) => (
  <>
    <Bg /><Label>Workflow / 0{i + 1} of 04</Label>
    <div style={{ position: "absolute", left: 60, top: 160, display: "flex", gap: 14 }}>{[0, 1, 2, 3].map((k) => <div key={k} style={{ width: 130, height: 16, background: k === i ? CL.lime : CL.line }} />)}</div>
    <Head fs={i === 3 ? 92 : 124} top={420}>{t}</Head>
    <Mascot cell={20} style={{ position: "absolute", right: 70, bottom: 150 }} /><F n={n} />
  </>
);
const ps: React.FC[] = [
  () => (<><Bg /><Stars seed="c1" /><Moon x={880} y={180} /><Mascot cell={52} style={{ position: "absolute", left: 210, top: 250 }} /><Head fs={92} top={880} style={{ textAlign: "center" }}>Collatera</Head><Water y={1040} /><F n={1} /></>),
  () => <Big n={2} k="Brand intro" w="The future of collateral risk." moon water />,
  () => (<><Bg /><Label>Three things we watch</Label>{[["01", "Buffer"], ["02", "Price freshness"], ["03", "Closed-market liquidity risk"]].map(([n, t], i) => (<Panel key={t} x={60} y={260 + i * 300} w={960} h={250} hi={i === 0} style={{ display: "flex", alignItems: "center", gap: 36 }}><span style={px(60, CL.chartreuse)}>{n}</span><span style={px(i === 2 ? 36 : 56, CL.mint)}>{t}</span></Panel>))}<F n={3} /></>),
  () => <Step4 n={4} i={0} t="Monitor." />,
  () => <Step4 n={5} i={1} t="Stress test." />,
  () => <Step4 n={6} i={2} t="Get alerts." />,
  () => <Step4 n={7} i={3} t="Preview repayment." />,
  () => (<><Bg /><Label>Price freshness / illustrative</Label><Head fs={96} top={170}>Fresh. Aging. Stale.</Head><div style={{ position: "absolute", left: 60, top: 560, display: "flex", gap: 14 }}>{Array.from({ length: 16 }).map((_, i) => <div key={i} style={{ width: 52, height: 220 - i * 6, background: i < 6 ? CL.lime : i < 11 ? "#F3F460" : "#FF5A3C", marginTop: i * 6 }} />)}</div><div style={{ ...body(28, CL.sage), position: "absolute", left: 60, top: 900 }}>Oracle feed age, illustrative.</div><F n={8} /></>),
  () => (<><Bg /><Label>Closed-market liquidity risk</Label><Head fs={100} top={170}>Prices can gap.</Head><div style={{ position: "absolute", left: 60, top: 520, display: "flex", alignItems: "flex-end", gap: 12 }}>{[210, 220, 230, 225, 232, 100, 108, 112, 118].map((h, i) => <div key={i} style={{ width: 90, height: h * 1.5, background: i === 5 ? "#FF5A3C" : CL.lime, opacity: i === 4 || i === 5 ? 1 : 0.85 }} />)}</div><div style={{ ...body(34), position: "absolute", left: 60, right: 60, top: 940 }}>Prices can gap between market close and the next open.</div><div style={{ ...body(22, CL.sage), position: "absolute", left: 60, top: 1050 }}>Illustrative.</div><F n={9} /></>),
  () => (<><Bg /><Label>Buffer / illustrative</Label><Head fs={110} top={170}>The buffer.</Head>{[0.82, 0.62, 0.34].map((v, i) => (<div key={i}><Bar x={60} y={500 + i * 160} w={960} v={v} c={i === 2 ? "#FF5A3C" : i === 1 ? "#F3F460" : CL.lime} /></div>))}<div style={{ ...body(26, CL.sage), position: "absolute", left: 60, top: 1000 }}>Three example positions. Demo figures only.</div><F n={10} /></>),
  () => (<><Bg /><Label>Read-only</Label><Mascot cell={30} style={{ position: "absolute", left: 60, top: 220 }} /><Head fs={118} top={680}>Read-only.</Head><Chip style={{ position: "absolute", left: 60, top: 920 }}>No transaction is sent</Chip><F n={11} /></>),
  () => <Big n={12} k="Your call" w="You decide." sub="Preview only. No transaction is sent." />,
  () => <Big n={13} k="Safe by design" w="No transaction is sent." moon />,
  () => <Big n={14} k="Signals" w="Real-time signals." water />,
  () => <Big n={15} k="Decisions" w="Smarter risk decisions." moon />,
  () => (<><Bg /><Label>Where it applies</Label><Head fs={100} top={170}>DeFi</Head><Head fs={100} top={400} c={CL.chartreuse}>+</Head><Head fs={100} top={620}>Tokenized assets</Head><Panel x={60} y={980} w={960} h={140}><span style={px(28, CL.mint)}>Monitoring collateral risk across both.</span></Panel><F n={16} /></>),
  () => (<><Bg /><Stars seed="a17" n={26} maxY={560} /><Moon x={850} y={210} r={90} /><Head fs={104} top={540}>Starting on<br />Algorand.</Head><Water y={960} /><F n={17} /></>),
  () => (<><Bg c={CL.evergreen} /><Label>Roadmap</Label><Chip style={{ position: "absolute", left: 60, top: 250, fontSize: 40 }}>Demo v1</Chip><Head fs={110} top={430}>Monitoring first.</Head><Head fs={110} top={760} c={CL.chartreuse}>Automation later.</Head><F n={18} /></>),
  () => (<><Bg c={CL.lime} grid={false} /><div style={{ ...px(104, CL.night), position: "absolute", left: 60, right: 60, top: 220 }}>Collateral<br />risk doesn’t<br />wait.</div><div style={{ ...px(40, CL.night), position: "absolute", left: 60, right: 60, top: 840 }}>Your monitoring shouldn’t either.</div><Mascot cell={20} color={CL.night} shadow={false} style={{ position: "absolute", right: 70, bottom: 130 }} /><Foot n={19} total={20} c={CL.night} /></>),
  () => (<><Bg /><Stars seed="z2" n={22} maxY={480} /><Moon x={900} y={170} r={70} /><Mascot cell={40} style={{ position: "absolute", left: 270, top: 330 }} /><Head fs={88} top={800} style={{ textAlign: "center" }}>Collatera</Head><div style={{ ...px(24, CL.mint), position: "absolute", left: 0, right: 0, top: 930, textAlign: "center" }}>Monitoring collateral risk across DeFi and tokenized assets.</div><div style={{ ...px(30, CL.lime), position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: CL_FONTS.pixel }}>collatera.buzz · @collatera_io</div><F n={20} /></>),
];
export const Collatera20 = makeStill(ps, CL.night);
