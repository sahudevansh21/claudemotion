import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Chart, chartXY, Chip, Guides, Head, Lockup, MARKS, Mono, Paper, Q, QMONO, SERIF, VH, VW } from "./qkit";

/**
 * QUANTORA campaign stills, all 1080×1920 (user request), fps = 1, one frame
 * per still: 0 QP1 · 1–5 QP2 carousel · 6 QP3 · 7 QP4 · 8–10 QA1–QA3 covers.
 * Copy only from the bio/banner and the approved plan; charts ILLUSTRATIVE.
 */
const Frame: React.FC<{ n?: string; children: React.ReactNode; seed?: number; tag?: string }> = ({ n, children, seed = 3, tag }) => (
  <AbsoluteFill>
    <Paper seed={seed} />
    <Guides />
    <div style={{ position: "absolute", left: 90, top: 120 }}>
      <Lockup size={0.6} tagline={false} />
    </div>
    {n ? (
      <div style={{ position: "absolute", right: 90, top: 150 }}>
        <Mono size={18} color={Q.soft}>{n}</Mono>
      </div>
    ) : null}
    {tag ? (
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        <Mono size={18}>{tag}</Mono>
      </div>
    ) : null}
    {children}
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 110, display: "flex", justifyContent: "space-between", borderTop: `1.5px solid ${Q.ink}`, paddingTop: 22 }}>
      <Mono size={16}>quantora.buzz</Mono>
      <Mono size={16} color={Q.soft}>@Quantora_Labs</Mono>
    </div>
  </AbsoluteFill>
);

const QP1: React.FC = () => (
  <AbsoluteFill>
    <Paper seed={5} />
    <Guides />
    <div style={{ position: "absolute", left: 90, top: 170 }}>
      <Lockup size={1.05} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 520 }}>
      <Head size={150} parts={[["The market,", false], ["read clearly.", true]]} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 940 }}>
      <Chart w={900} h={430} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 1480, fontFamily: SERIF, fontSize: 46, lineHeight: 1.3, color: Q.ink }}>
      Quantitative research
      <br />
      for <i>onchain finance.</i>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, bottom: 110, display: "flex", justifyContent: "space-between", borderTop: `1.5px solid ${Q.ink}`, paddingTop: 22 }}>
      <Mono size={16}>Tokenized stocks · ETFs · Market simulations</Mono>
    </div>
  </AbsoluteFill>
);

const Slide: React.FC<{ n: number; tag: string; parts: [string, boolean][]; body: string; mark?: number }> = ({ n, tag, parts, body, mark }) => (
  <Frame n={`0${n} / 05`} tag={tag} seed={10 + n}>
    <div style={{ position: "absolute", left: 90, top: 380 }}>
      <Head size={112} parts={parts} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 760, width: 900, fontFamily: SERIF, fontSize: 40, lineHeight: 1.35, color: Q.soft }}>{body}</div>
    <div style={{ position: "absolute", left: 90, top: 1080 }}>
      <Chart w={900} h={480} marks={mark === undefined ? 1 : 0} labels />
      {mark !== undefined
        ? (() => {
            const [x, y] = chartXY(900, 480, MARKS[mark].i);
            return (
              <>
                <svg width={900} height={520} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  <line x1={x} x2={x} y1={0} y2={480} stroke={Q.ink} strokeDasharray="2 6" strokeWidth={1.5} />
                  <circle cx={x} cy={y} r={11} fill={Q.ink} />
                </svg>
                <div style={{ position: "absolute", left: Math.min(x + 20, 560), top: y + 24 }}>
                  <Chip text={MARKS[mark].label} dark size={22} />
                </div>
              </>
            );
          })()
        : null}
    </div>
    <div style={{ position: "absolute", left: 90, top: 1640 }}>
      <Mono size={15} color={Q.faint}>Illustrative chart · no data</Mono>
    </div>
  </Frame>
);
const QP2a: React.FC = () => <Slide n={1} tag="How we read a chart" parts={[["A chart is", false], ["a claim.", true]]} body="Before treating any move as a signal, we ask three questions of it." />;
const QP2b: React.FC = () => <Slide n={2} tag="01 · Risk" parts={[["What could", false], ["this cost?", true]]} body="Not just how far price could fall, but how fast, and whether you could act in time." mark={0} />;
const QP2c: React.FC = () => <Slide n={3} tag="02 · Context" parts={[["Why is it", false], ["moving?", true]]} body="Market hours, flows and events. The same move means different things at the close and at the open." mark={1} />;
const QP2d: React.FC = () => <Slide n={4} tag="03 · Evidence" parts={[["What does the", false], ["data support?", true]]} body="A pattern seen once is a story. A pattern that survives testing starts to become evidence." mark={2} />;
const QP2e: React.FC = () => (
  <Frame n="05 / 05" tag="The method" seed={20}>
    <div style={{ position: "absolute", left: 90, top: 380 }}>
      <Head size={124} parts={[["The market,", false], ["read clearly.", true]]} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 760, width: 900 }}>
      {["Risk", "Context", "Evidence"].map((k, i) => (
        <div key={k} style={{ display: "flex", alignItems: "baseline", gap: 30, padding: "34px 0", borderTop: `1.5px solid ${Q.ink}` }}>
          <span style={{ fontFamily: QMONO, fontSize: 24 }}>0{i + 1}</span>
          <span style={{ fontFamily: SERIF, fontSize: 64, fontStyle: i === 1 ? "italic" : "normal" }}>{k}</span>
        </div>
      ))}
      <div style={{ borderTop: `1.5px solid ${Q.ink}` }} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 1460, width: 900, fontFamily: SERIF, fontSize: 40, lineHeight: 1.35, color: Q.soft }}>Quantitative research for onchain finance. Follow for the method in practice.</div>
  </Frame>
);

const QP3: React.FC = () => (
  <Frame tag="Coverage · what to watch" seed={30}>
    <div style={{ position: "absolute", left: 90, top: 380 }}>
      <Head size={100} parts={[["Tokenized stocks", false], ["& ETFs:", false], ["what to watch.", true]]} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 780, width: 900, display: "flex" }}>
      {["Tokenized stocks", "ETFs"].map((k, i) => (
        <div key={k} style={{ flex: 1, padding: "30px 30px", borderLeft: i ? `1.5px solid ${Q.ink}` : "none", borderTop: `1.5px solid ${Q.ink}`, borderBottom: `1.5px solid ${Q.ink}` }}>
          <div style={{ fontFamily: SERIF, fontSize: 52, fontStyle: i ? "italic" : "normal" }}>{k}</div>
          <Mono size={16} color={Q.soft} style={{ marginTop: 14 }}>
            {i ? "Baskets, onchain" : "Single names, onchain"}
          </Mono>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 90, top: 1030, width: 900, fontFamily: SERIF, fontSize: 40, lineHeight: 1.35, color: Q.soft }}>Two instruments, one question: what moves the price you see onchain? Check three things first.</div>
    <div style={{ position: "absolute", left: 90, top: 1240, width: 900 }}>
      {[
        ["Market hours", "The token may trade 24/7 while the underlying market sleeps."],
        ["Liquidity", "Onchain depth can differ from the underlying's depth."],
        ["Price route", "Issuers, market makers or oracles: each adds timing."],
      ].map(([k, d], i) => (
        <div key={k} style={{ padding: "22px 0", borderTop: `1.5px solid ${Q.ink}` }}>
          <Mono size={20}>
            0{i + 1} · {k}
          </Mono>
          <div style={{ fontFamily: SERIF, fontSize: 32, color: Q.soft, marginTop: 6 }}>{d}</div>
        </div>
      ))}
    </div>
  </Frame>
);

const PATHS = Array.from({ length: 30 }, (_, k) => {
  const ys = [0];
  for (let i = 1; i < 44; i++) ys.push(ys[i - 1] + (random(`fp${k}-${i}`) - 0.5) * 0.1);
  return ys;
});
const QP4: React.FC = () => {
  const w = 900;
  const h = 520;
  const x = (i: number) => (i / 43) * w;
  const y = (v: number) => h / 2 - v * h * 0.6;
  const band = Array.from({ length: 44 }, (_, i) => {
    const v = PATHS.map((p) => p[i]).sort((a, b) => a - b);
    return [v[3], v[26]];
  });
  return (
    <Frame tag="Market simulations" seed={40}>
      <div style={{ position: "absolute", left: 90, top: 380 }}>
        <Head size={100} parts={[["What a simulation", false], ["is,", false], ["and isn't.", true]]} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 780 }}>
        <svg width={w} height={h}>
          <polygon points={[...band.map(([lo], i) => `${x(i)},${y(lo)}`), ...band.map(([, hi], i) => `${x(i)},${y(hi)}`).reverse()].join(" ")} fill={Q.ink} opacity={0.1} />
          {PATHS.map((p, k) => (
            <polyline key={k} points={p.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={Q.ink} strokeWidth={1.4} opacity={0.4} />
          ))}
        </svg>
        <Mono size={15} color={Q.faint} style={{ marginTop: 10 }}>
          Illustrative simulation
        </Mono>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1400, width: 900, display: "flex" }}>
        {[
          ["Is", ["A stress test", "A range of outcomes", "A way to ask “what if?”"]],
          ["Isn't", ["A forecast", "A price target", "Advice"]],
        ].map(([k, items], i) => (
          <div key={k as string} style={{ flex: 1, borderTop: `1.5px solid ${Q.ink}`, paddingTop: 20, paddingLeft: i ? 30 : 0, borderLeft: i ? `1.5px solid ${Q.ink}` : "none" }}>
            <div style={{ fontFamily: SERIF, fontSize: 52, fontStyle: i ? "italic" : "normal" }}>{k as string}</div>
            {(items as string[]).map((it) => (
              <div key={it} style={{ fontFamily: SERIF, fontSize: 32, color: Q.soft, marginTop: 8, textDecoration: i ? "line-through" : "none" }}>
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
};

const Cover: React.FC<{ n: number; parts: [string, boolean][]; seed: number }> = ({ n, parts, seed }) => (
  <Frame tag={`Article · 0${n}`} seed={seed}>
    <div style={{ position: "absolute", left: 90, top: 400 }}>
      <Head size={104} parts={parts} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 1100 }}>
      <Chart w={900} h={420} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 1640 }}>
      <Mono size={18}>Read on X · quantora.buzz</Mono>
    </div>
  </Frame>
);
const QA1: React.FC = () => <Cover n={1} seed={51} parts={[["Reading the", false], ["market clearly:", false], ["risk, context,", true], ["evidence.", true]]} />;
const QA2: React.FC = () => <Cover n={2} seed={52} parts={[["Tokenized stocks", false], ["& ETFs onchain:", false], ["what to measure.", true]]} />;
const QA3: React.FC = () => <Cover n={3} seed={53} parts={[["Why we simulate", false], ["markets before", false], ["forming a view.", true]]} />;

const LIST = [QP1, QP2a, QP2b, QP2c, QP2d, QP2e, QP3, QP4, QA1, QA2, QA3];
export const QUANTORA_STILLS = ["QP1-launch-poster", "QP2-slide-1-of-5", "QP2-slide-2-of-5", "QP2-slide-3-of-5", "QP2-slide-4-of-5", "QP2-slide-5-of-5", "QP3-tokenized-stocks-vs-etfs", "QP4-what-a-simulation-is", "QA1-cover", "QA2-cover", "QA3-cover"];

export const QuantoraPostsV: React.FC = () => {
  const f = useCurrentFrame();
  const P = LIST[Math.min(f, LIST.length - 1)];
  return (
    <AbsoluteFill style={{ background: Q.paper }}>
      <div style={{ position: "relative", width: VW, height: VH, overflow: "hidden" }}>
        <P />
      </div>
    </AbsoluteFill>
  );
};
