import { Chart, DD, F, FAN, H, I, Mark, Mono, PA, PB, Q, Shell, Sub, peak, series, trough } from "./quantora";
import { makeStill } from "./still";

/** QUANTORA LABS, set 2 (20 new posts). Same banner system; every chart is synthetic and labelled. */
const T = 20;
const S: React.FC<{ n: number; children: React.ReactNode; label?: string }> = ({ n, children, label }) => <Shell n={n} total={T} seed={40 + n} label={label}>{children}</Shell>;
const Word: React.FC<{ n: number; k: string; w: React.ReactNode; sub: string; chart: React.ReactNode }> = ({ n, k, w, sub, chart }) => (
  <S n={n}>
    <Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>{k}</Mono>
    <H fs={200} top={230}>{w}</H>
    <Sub top={560}>{sub}</Sub>
    {chart}
  </S>
);
const rise = series("r2", 120, (t) => 0.8 + t * 1.2 + Math.sin(t * 9) * 0.12, 0.07);
const ps: React.FC[] = [
  () => (<S n={1} label=""><Mark s={260} style={{ position: "absolute", left: 70, top: 300 }} /><div style={{ fontFamily: F.word, fontSize: 100, letterSpacing: 16, color: Q.ink, position: "absolute", left: 70, top: 640, lineHeight: 1 }}>QUANTORA</div><Mono size={18} style={{ position: "absolute", left: 74, top: 770, letterSpacing: 11 }}>The market, read clearly.</Mono><Chart x={70} y={900} w={940} h={220} lines={[{ d: rise }]} /></S>),
  () => (<S n={2}><H fs={190} top={230}>Research for <I>onchain</I> finance.</H><Sub top={900}>Quantitative research for onchain finance.</Sub></S>),
  () => (<S n={3}><Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Question</Mono><H fs={150} top={230}>How bad can it <I>get?</I></H><div style={{ position: "absolute", left: 70, right: 70, top: 640, borderTop: `1.4px solid ${Q.line}`, paddingTop: 36 }}><Mono size={17}>Answer</Mono><div style={{ fontFamily: F.serif, fontSize: 64, lineHeight: 1.15, color: Q.ink, marginTop: 18 }}>Drawdown, path and the assumptions behind both.</div></div></S>),
  () => <Word n={4} k="01 / Drawdown" w={<I>Drawdown.</I>} sub="From the peak to the trough. Synthetic demo data." chart={<Chart x={70} y={760} w={940} h={360} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 110, up: true }, { i: trough, label: "Trough", line: 80 }]} />} />,
  () => <Word n={5} k="02 / Path" w={<>The <I>path.</I></>} sub="Same start, different route. Synthetic demo data." chart={<Chart x={70} y={760} w={940} h={360} lines={[{ d: PA }, { d: PB, op: 0.5 }]} />} />,
  () => (<S n={6}><Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>03 / Assumptions</Mono><H fs={150} top={230}><I>Assumptions.</I></H>{["Assumption one", "Assumption two", "Assumption three"].map((t, i) => (<div key={t} style={{ position: "absolute", left: 70, right: 70, top: 520 + i * 190, borderTop: `1.4px solid ${Q.line}`, paddingTop: 30 }}><Mono size={15}>{t} · illustrative</Mono><div style={{ height: 16, width: 760 - i * 210, background: Q.ink, opacity: 0.8 - i * 0.2, marginTop: 26 }} /></div>))}</S>),
  () => (<S n={7}>{[["01", "Tokenized stocks"], ["02", "ETFs"], ["03", "Market simulations"]].map(([n, t], i) => (<div key={t} style={{ position: "absolute", left: 70, right: 70, top: 200 + i * 330, borderTop: `1.4px solid ${Q.line}`, paddingTop: 36, display: "flex", gap: 40, alignItems: "baseline" }}><Mono size={18}>{n}</Mono><span style={{ fontFamily: F.serif, fontSize: 130, letterSpacing: -4, color: Q.ink, fontStyle: i === 1 ? "italic" : "normal", lineHeight: 1 }}>{t}</span></div>))}</S>),
  () => (<S n={8}><Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Fig. 03</Mono><H fs={120} top={220}>Read the market, <I>clearly.</I></H><Chart x={70} y={620} w={940} h={520} lines={[{ d: rise }]} marks={[{ i: 40, label: "Rise", line: 130, up: true }, { i: 70, label: "Context", line: 90 }, { i: 105, label: "Evidence", line: 140, up: true }]} /></S>),
  () => (<S n={9}><Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Fig. 04 / Market simulations</Mono><H fs={150} top={220}>Many paths. <I>One picture.</I></H><Chart x={70} y={620} w={940} h={520} lo={0} hi={2.4} lines={FAN.map((d, k) => ({ d, width: 1.4, op: 0.35 + (k % 3) * 0.15 }))} /></S>),
  () => (<S n={10}><H fs={160} top={220}>Peak.<br />Trough.<br /><I>Recovery.</I></H><Chart x={70} y={880} w={940} h={260} lines={[{ d: DD }]} marks={[{ i: peak, label: "Peak", line: 80, up: true }, { i: trough, label: "Trough", line: 60 }]} /></S>),
  () => (<S n={11}><H fs={170} top={260}>Synthetic <I>demo data.</I></H><Sub top={720}>Every chart in this series is synthetic and says so.</Sub></S>),
  () => (<S n={12}><Mono size={17} style={{ position: "absolute", left: 70, top: 160 }}>Tags</Mono><H fs={190} top={300}>#Quantora</H><H fs={190} top={560}><I>#Research</I></H></S>),
  () => (<S n={13}><H fs={210} top={250}>Quantitative.</H><H fs={210} top={520}><I>Onchain.</I></H><Sub top={900}>Quantitative research for onchain finance.</Sub></S>),
  () => (<S n={14}><H fs={150} top={220}>Same start.<br /><I>Different path.</I></H><Chart x={70} y={720} w={940} h={420} lines={[{ d: PA }, { d: PB, op: 0.5 }]} /></S>),
  () => (<S n={15}><H fs={150} top={230}>Assumptions are part of <I>the answer.</I></H></S>),
  () => (<S n={16} label=""><Mark s={560} style={{ position: "absolute", left: 260, top: 320 }} /><Mono size={16} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 1000, letterSpacing: 10 }}>Quantora Labs</Mono></S>),
  () => <Word n={17} k="Topic / Tokenized stocks" w={<>Tokenized <I>stocks.</I></>} sub="Quantitative research for onchain finance." chart={<Chart x={70} y={760} w={940} h={360} lines={[{ d: rise }]} />} />,
  () => <Word n={18} k="Topic / ETFs" w={<I>ETFs.</I>} sub="Read clearly. Synthetic demo data." chart={<Chart x={70} y={760} w={940} h={360} lines={[{ d: PA }]} marks={[{ i: 55, label: "Context", line: 100, up: true }]} />} />,
  () => (<S n={19}><H fs={150} top={220}>Research <I>preview.</I></H><div style={{ position: "absolute", left: 70, right: 70, top: 620, border: `1.4px solid ${Q.line}`, padding: 50 }}><Mono size={16}>Quantora research preview</Mono><div style={{ fontFamily: F.serif, fontSize: 62, lineHeight: 1.15, marginTop: 20 }}>Synthetic demo data, shown to explain a method.</div></div></S>),
  () => (<S n={20} label=""><Mark s={210} style={{ position: "absolute", left: 435, top: 300 }} /><div style={{ fontFamily: F.word, fontSize: 90, letterSpacing: 14, color: Q.ink, position: "absolute", left: 0, right: 0, textAlign: "center", top: 560, paddingLeft: 14 }}>QUANTORA</div><H fs={60} top={720} style={{ textAlign: "center" }}>Quantitative research for <I>onchain</I> finance.</H><Mono size={19} style={{ position: "absolute", left: 0, right: 0, textAlign: "center", top: 1000 }}>quantora.buzz · @Quantora_Labs</Mono></S>),
];
export const Quantora20 = makeStill(ps, Q.paper);
