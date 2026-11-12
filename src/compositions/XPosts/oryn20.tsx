import { Img, staticFile } from "remotion";
import { DEPLOYMENTS, MONO, SANS, VERDICTS, type Status } from "../Oryn/brand";
import { Asterisk, Bg, Dep, Flame, Foot, Halftone, Head, NAVY, OR, Ring, Rule, Tag, cap, disp } from "./oryn";
import { makeStill } from "./still";

/** ORYN set 2 (20 new posts). Verdict copy and board rows are verbatim from the Oryn board (simulated issuer data). */
const F: React.FC<{ n: number; light?: boolean }> = ({ n, light }) => <Foot n={n} total={20} light={light} />;
const depIdx = (sym: string, chain: string) => DEPLOYMENTS.findIndex((d) => d.sym === sym && d.chain === chain);
const Verdict: React.FC<{ n: number; s: Status; idx: number }> = ({ n, s, idx }) => {
  const v = VERDICTS[s]; const d = DEPLOYMENTS[idx];
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: v.bg }} /><Halftone cx={760} cy={420} w={1200} h={900} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: NAVY }} /><div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 16, background: NAVY }} />
      <div style={{ ...cap(20, v.fg), position: "absolute", left: 70, top: 70 }}>Verdict</div>
      <div style={{ fontSize: 300, lineHeight: 1, color: v.fg, position: "absolute", left: 60, top: 150 }}>{v.glyph}</div>
      <div style={disp(190, v.fg, { position: "absolute", left: 70, top: 500, right: 70 })}>{v.label}</div>
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 44, lineHeight: 1.25, color: v.fg, position: "absolute", left: 70, right: 70, top: 900 }}>{d.reason}</div>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: v.fg, position: "absolute", left: 70, top: 1190, textTransform: "uppercase", letterSpacing: 2 }}>{d.sym} · {d.chain}</div>
      <F n={n} light />
    </>
  );
};
const Word: React.FC<{ n: number; k: string; w: string; i: number }> = ({ n, k, w, i }) => (
  <>
    <Bg /><Tag>{k}</Tag><div style={{ position: "absolute", left: 70, top: 130, display: "flex", gap: 14 }}>{[0, 1, 2, 3].map((x) => <div key={x} style={{ width: 90, height: 8, background: x === i ? OR : "#c9c2ab" }} />)}</div>
    <Head fs={w.length > 14 ? 190 : 250} top={360}>{w}</Head><F n={n} light />
  </>
);
const mix = (["open", "closed", "pending", "redemption", "stale", "divergent"] as Status[]).map((s) => ({ s, c: DEPLOYMENTS.filter((d) => d.status === s).length }));
const chains = ["ETH", "SOL", "BASE", "ARB"].map((c) => ({ c, n: DEPLOYMENTS.filter((d) => d.chain === c).length }));
const ps: React.FC[] = [
  () => (<><Bg /><div style={{ position: "absolute", left: 360, top: 220 }}><Flame s={360} /></div><Head fs={200} top={800} center>ORYN</Head><Foot n={1} total={20} light /></>),
  () => (<><Bg cy={600} /><Tag>Real time</Tag><Head fs={190} top={200}>Real-time intelligence for tokenized assets.</Head><F n={2} light /></>),
  () => <Verdict n={3} s="open" idx={7} />,
  () => <Verdict n={4} s="closed" idx={0} />,
  () => <Verdict n={5} s="pending" idx={2} />,
  () => <Verdict n={6} s="redemption" idx={6} />,
  () => <Verdict n={7} s="stale" idx={4} />,
  () => <Verdict n={8} s="divergent" idx={1} />,
  () => <Dep n={9} idx={depIdx("oQQQ", "BASE")} q="Divergent" />,
  () => <Dep n={10} idx={depIdx("oNFLX", "ETH")} q="Divergent" />,
  () => <Word n={11} k="01 / Tracks" w="Corporate actions" i={0} />,
  () => <Word n={12} k="02 / Tracks" w="Market sessions" i={1} />,
  () => <Word n={13} k="03 / Tracks" w="Redemption windows" i={2} />,
  () => <Word n={14} k="04 / Tracks" w="Data freshness" i={3} />,
  () => (<><Bg clouds={false} /><Tag>Sample from the board</Tag><Head fs={130} top={150}>Four chains.</Head>{chains.map((x, i) => (<div key={x.c} style={{ position: "absolute", left: 70, right: 70, top: 400 + i * 190, display: "flex", alignItems: "center", gap: 30 }}><span style={disp(80, NAVY, { width: 220 })}>{x.c}</span><div style={{ height: 70, width: x.n * 130, background: i % 2 ? OR : NAVY }} /><span style={disp(70, NAVY)}>{x.n}</span></div>))}<div style={{ ...cap(14, NAVY, { letterSpacing: 3 }), position: "absolute", left: 70, top: 1180 }}>Deployments in the board sample, by chain</div><F n={15} /></>),
  () => (<><Bg clouds={false} /><Tag>Sample from the board</Tag><Head fs={130} top={150}>Status mix.</Head>{mix.map((x, i) => { const v = VERDICTS[x.s]; return (<div key={x.s} style={{ position: "absolute", left: 70, right: 70, top: 370 + i * 135, display: "flex", alignItems: "center", gap: 24 }}><span style={{ ...cap(24, NAVY, { letterSpacing: 3, width: 330 }) }}>{v.label}</span><div style={{ height: 70, width: x.c * 190, background: v.bg, border: `4px solid ${NAVY}` }} /><span style={disp(60, NAVY)}>{x.c}</span></div>); })}<F n={16} /></>),
  () => (<><Bg cy={620} /><Tag>Rule of thumb</Tag><Head fs={170} top={200}>Unknown<br />means not<br />actionable.</Head><F n={17} light /></>),
  () => (<><Bg /><Tag>The question</Tag><Head fs={210} top={190}>Is it safe to act?</Head><div style={{ position: "absolute", left: 70, top: 800, display: "flex", gap: 14 }}>{(["open", "closed", "pending", "redemption", "stale", "divergent"] as Status[]).map((k) => <div key={k} style={{ width: 128, height: 128, background: VERDICTS[k].bg, border: `4px solid ${NAVY}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, color: VERDICTS[k].fg }}>{VERDICTS[k].glyph}</div>)}</div><F n={18} light /></>),
  () => (<><Bg /><div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}><Ring s={260} /><Asterisk s={90} /></div><div style={{ ...cap(44, NAVY, { textAlign: "center" }), position: "absolute", left: 0, right: 0, top: 640 }}>State of assets activated</div><Rule y={730} /><F n={19} light /></>),
  () => (<><Bg cy={500} /><Img src={staticFile("oryn/img/logo.png")} style={{ position: "absolute", left: 340, top: 190, width: 400, height: 400, borderRadius: 400, border: `6px solid ${NAVY}` }} /><Head fs={150} top={640} center>ORYN</Head><div style={{ ...cap(22, NAVY, { textAlign: "center", letterSpacing: 4 }), position: "absolute", left: 60, right: 60, top: 810 }}>Real-time intelligence for tokenized assets.</div><div style={{ ...cap(26, OR, { textAlign: "center", letterSpacing: 5 }), position: "absolute", left: 0, right: 0, top: 900 }}>oryn.solrun.fun · @oryn_io</div><F n={20} light /></>),
];
export const Oryn20 = makeStill(ps, "#f0e9d6");
