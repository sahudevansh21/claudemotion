import { Img, staticFile, useCurrentFrame } from "remotion";
import { Cursor, EndCardA, Film, P, Preview, Reveal, Slate, Swap, Typed, VW, bgFrom, cueOf, ez, IO, interpolate, lenOf, mono, path, pulse, sans, serif, CL, Drift, Painting, SLATE_SLIDER, SLATE_TAB_Y, SLATE_W, slateTabX, type Tl } from "./kit";
import av1 from "./av1.json";
import av2 from "./av2.json";
import av3 from "./av3.json";
import av4 from "./av4.json";
import av5 from "./av5.json";
import av6 from "./av6.json";
import av7 from "./av7.json";
import av8 from "./av8.json";
import av9 from "./av9.json";
import av10 from "./av10.json";

const CUR = "#0d0d0f";
const centre = (t: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 60, right: 60, textAlign: "center", ...t });
const AUD = (n: number) => `allocra/content/audio/av${n}.wav`;
const T = (x: unknown) => x as unknown as Tl;

/* ================= V1 Your assets. Your allocation. ================= */
const t1 = T(av1);
const A1Hook: React.FC = () => (
  <Drift n={lenOf(t1, "hook")}>
    <Reveal at={6} style={{ ...mono(22, P.cream), position: "absolute", left: 90, top: 190 }}>MMXXVI + ——— Private allocation desk / 01</Reveal>
    <div style={centre({ top: 760 })}>
      <Swap at={cueOf(t1, "hook", "swap") - 20} each={cueOf(t1, "hook", "each")} items={[<span key="a" style={serif(190)}>Your assets.</span>, <span key="b" style={serif(170)}>Your allocation.</span>]} />
    </div>
  </Drift>
);
const SL_LEFT = (VW - SLATE_W) / 2;
const SL_TOP = 440;
const A1Slate: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t1, "slate", "card"), cur = cueOf(t1, "slate", "cursor");
  const p = ez(f, card, 36);
  const coreX = SL_LEFT + slateTabX(1), coreY = SL_TOP + SLATE_TAB_Y;
  const c = path(f, [[0, 940, 1760], [cur, 940, 1760], [cur + 40, coreX, coreY], [cur + 200, 900, 1700]]);
  return (
    <Drift n={lenOf(t1, "slate")} from={1.02} to={1}>
      <div style={{ ...mono(22, P.cream), position: "absolute", left: 90, top: 330, opacity: ez(f, card + 10, 24) }}>Private allocation desk / 01</div>
      <div style={{ position: "absolute", left: SL_LEFT, top: SL_TOP, opacity: p, transform: `translateY(${(1 - p) * 140}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <Slate p={ez(f, card + 14, 70)} metrics={ez(f, card + 80, 30)} monthly={1} tab={f >= cur + 44 ? 1 : -1} />
      </div>
      <Cursor {...c} click={pulse(f, cur + 44)} color={CUR} />
    </Drift>
  );
};
const A1Copy: React.FC = () => {
  const f = useCurrentFrame();
  const a = cueOf(t1, "copy", "a"), b = cueOf(t1, "copy", "b");
  return (
    <Drift n={lenOf(t1, "copy")} from={1} to={1.04}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 660 }}>
        <Swap at={a - 12} each={b - a} items={[
          <span key="a" style={sans(66, P.cream, { fontWeight: 400, lineHeight: 1.22 })}>Plan a tokenized ETF<br />basket around the positions<br />you actually want to own.</span>,
          <span key="b" style={sans(66, P.cream, { fontWeight: 400, lineHeight: 1.22 })}>See concentration,<br />overlap, quotes, and<br />trading costs before<br />you confirm.</span>,
        ]} />
      </div>
      <div style={{ ...mono(20, P.dim), position: "absolute", left: 90, bottom: 250, opacity: ez(f, a + 30, 20) }}>Allocation is a decision, not a default.</div>
    </Drift>
  );
};
const A1End: React.FC = () => <EndCardA n={lenOf(t1, "end")} line={<span>Plan clearly.<br />Act deliberately.</span>} />;
export const AllocraV1: React.FC = () => <Film tl={t1} audio={AUD(1)} bg={bgFrom([[0, P.red], [540, P.dark], [840, P.red]])} scenes={{ hook: A1Hook, slate: A1Slate, copy: A1Copy, end: A1End }} />;

/* ================= V2 Plan first (slate walkthrough) ================= */
const t2 = T(av2);
const A2Hook: React.FC = () => (
  <Drift n={lenOf(t2, "hook")}>
    <div style={centre({ top: 800 })}>
      <Swap at={cueOf(t2, "hook", "swap") - 20} each={cueOf(t2, "hook", "each")} items={[<span key="a" style={serif(200)}>Plan first.</span>, <span key="b" style={serif(150)}>Before you confirm.</span>]} />
    </div>
  </Drift>
);
const A2Slate: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t2, "slate", "card"), drag = cueOf(t2, "slate", "drag"), tab = cueOf(t2, "slate", "tab");
  const p = ez(f, card, 36);
  const monthly = interpolate(f, [drag, drag + 140], [0.4, 1], { ...CL, easing: IO });
  const hx = (m: number) => SL_LEFT + SLATE_SLIDER.x0 + (SLATE_SLIDER.x1 - SLATE_SLIDER.x0) * 0.46 * m;
  const sy = SL_TOP + SLATE_SLIDER.y;
  const c = path(f, [[0, 940, 1780], [drag - 40, 940, 1780], [drag - 6, hx(0.4), sy], [drag + 140, hx(1), sy], [drag + 240, 800, 1500], [tab - 10, SL_LEFT + slateTabX(1), SL_TOP + SLATE_TAB_Y], [tab + 90, 940, 1760]]);
  return (
    <Drift n={lenOf(t2, "slate")} from={1.02} to={1}>
      <div style={{ ...mono(22, P.cream), position: "absolute", left: 90, top: 330, opacity: ez(f, card + 10, 24) }}>Plan first / draft</div>
      <div style={{ position: "absolute", left: SL_LEFT, top: SL_TOP, opacity: p, transform: `translateY(${(1 - p) * 140}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <Slate p={ez(f, card + 14, 70)} metrics={ez(f, drag + 150, 30)} monthly={monthly} tab={f >= tab ? 1 : -1} />
      </div>
      <Cursor {...c} click={Math.max(pulse(f, drag), pulse(f, tab))} color={CUR} />
    </Drift>
  );
};
const A2End: React.FC = () => <EndCardA n={lenOf(t2, "end")} line={<span>Assets remain individually<br />held until you approve<br />a trade.</span>} />;
export const AllocraV2: React.FC = () => <Film tl={t2} audio={AUD(2)} bg={bgFrom([[0, P.red], [180, P.dark], [720, P.red]])} scenes={{ hook: A2Hook, slate: A2Slate, end: A2End }} />;

/* ================= Painting films (V3, V5, V6) ================= */
const PaintScene: React.FC<{ tl: Tl; img: string; h: number; items: React.ReactNode[]; sub: string; ratio?: number }> = ({ tl, img, h, items, sub }) => {
  const f = useCurrentFrame();
  const c = cueOf(tl, "paint", "img"), sw = cueOf(tl, "paint", "swap"), each = cueOf(tl, "paint", "each");
  const p = ez(f, c, 40);
  const top0 = Math.max(130, Math.round((1920 - (h + 480)) / 2));
  const zoom = interpolate(f, [0, lenOf(tl, "paint")], [1.0, 1.1], { ...CL, easing: IO });
  return (
    <Drift n={lenOf(tl, "paint")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 90, top: top0, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <Painting src={img} w={900} h={h} zoom={zoom} />
      </div>
      <div style={{ ...mono(20, P.dim), position: "absolute", left: 90, top: top0 + h + 90, opacity: ez(f, sw + 30, 20) }}>{sub}</div>
      <div style={{ position: "absolute", left: 90, right: 90, top: top0 + h + 150 }}>
        <Swap at={sw - 12} each={each} items={items} />
      </div>
    </Drift>
  );
};
const t3 = T(av3);
const A3Paint: React.FC = () => <PaintScene tl={t3} img="adam" h={580} sub="Plan with data. Decide yourself." items={[<span key="a" style={serif(130)}>Human<br />judgment,</span>, <span key="b" style={serif(130)}>machine<br />precision.</span>]} />;
const A3End: React.FC = () => <EndCardA n={lenOf(t3, "end")} line={<span>Plan with data.<br />Decide yourself.</span>} />;
export const AllocraV3: React.FC = () => <Film tl={t3} audio={AUD(3)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: A3Paint, end: A3End }} />;

const t5 = T(av5);
const A5Paint: React.FC = () => <PaintScene tl={t5} img="painter" h={600} sub="Know the risk" items={[<span key="a" style={serif(150)}>Know the<br />risk.</span>, <span key="b" style={serif(120)}>Looking back<br />is not looking<br />ahead.</span>]} />;
const A5End: React.FC = () => <EndCardA n={lenOf(t5, "end")} line={<span>Looking back is not<br />looking ahead.</span>} />;
export const AllocraV5: React.FC = () => <Film tl={t5} audio={AUD(5)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: A5Paint, end: A5End }} />;

const t6 = T(av6);
const A6Paint: React.FC = () => <PaintScene tl={t6} img="chess" h={760} sub="Strategy over reaction" items={[<span key="a" style={serif(120)}>Every move<br />is a decision.</span>, <span key="b" style={serif(120)}>Strategy<br />over reaction.</span>]} />;
const A6End: React.FC = () => <EndCardA n={lenOf(t6, "end")} line={<span>Strategy over<br />reaction.</span>} />;
export const AllocraV6: React.FC = () => <Film tl={t6} audio={AUD(6)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: A6Paint, end: A6End }} />;

/* ================= V4 Look beneath the percentages ================= */
const t4 = T(av4);
const A4Hook: React.FC = () => (
  <Drift n={lenOf(t4, "hook")}>
    <div style={centre({ top: 760 })}><Reveal at={cueOf(t4, "hook", "swap") - 14} style={serif(150, P.cream, { textAlign: "center" })}>Look beneath<br />the percentages.</Reveal></div>
  </Drift>
);
const ROWS4: [string, string, string][] = [["Overlap", "0%", "How much your ETFs repeat each other"], ["Issuer tilt", "High", "Concentration in a single issuer"], ["Est. cost / yr", "$0.50", "What the basket costs to hold"]];
const A4Frame: React.FC = () => {
  const f = useCurrentFrame();
  const img = cueOf(t4, "frame", "img"), rows = cueOf(t4, "frame", "rows");
  const p = ez(f, img, 40);
  const hls = [200, 300, 400];
  const top = (i: number) => 1000 + i * 190;
  const c = path(f, [[0, 900, 1800], [rows + 40, 900, 1800], [hls[0] - 10, 700, top(0) + 60], [hls[1] - 10, 700, top(1) + 60], [hls[2] - 10, 700, top(2) + 60], [hls[2] + 80, 900, 1800]]);
  return (
    <Drift n={lenOf(t4, "frame")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 90, top: 260, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <Painting src="scholars" w={900} h={430} zoom={1 + 0.06 * ez(f, 0, 400, IO)} />
      </div>
      <Preview style={{ position: "absolute", right: 90, top: 900, opacity: ez(f, rows, 20) }} />
      <div style={{ ...mono(18, P.dim), position: "absolute", left: 90, top: 900, opacity: ez(f, rows, 20) }}>Overlap, concentration, cost</div>
      {ROWS4.map(([k, v, s], i) => {
        const rp = ez(f, rows + i * 16, 30);
        const hl = ez(f, hls[i], 18) * (1 - (i < 2 ? ez(f, hls[i + 1], 18) : 0));
        return (
          <div key={k} style={{ position: "absolute", left: 90, top: top(i), width: 900, height: 160, opacity: rp, transform: `translateY(${(1 - rp) * 90}px)`, background: `rgba(246,218,195,${0.04 + 0.92 * hl})`, border: "1px solid rgba(246,218,195,0.35)", padding: "0 36px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={serif(58, hl > 0.5 ? "#3d1812" : P.cream)}>{k}</div>
              <div style={mono(15, hl > 0.5 ? "#6a3a2e" : P.dim, { marginTop: 8 })}>{s}</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 64, color: hl > 0.5 ? "#3d1812" : P.cream }}>{v}</div>
          </div>
        );
      })}
      <Cursor {...c} click={Math.max(...hls.map((h) => pulse(f, h)))} color={CUR} />
    </Drift>
  );
};
const A4End: React.FC = () => <EndCardA n={lenOf(t4, "end")} line={<span>Overlap, concentration,<br />cost.</span>} />;
export const AllocraV4: React.FC = () => <Film tl={t4} audio={AUD(4)} bg={bgFrom([[0, P.dark], [780, P.red]])} scenes={{ hook: A4Hook, frame: A4Frame, end: A4End }} />;

/* ================= V7 Ecosystem ================= */
const t7 = T(av7);
export const PROTOS = [
  { n: "Ondo Finance", h: "@Ondo", cat: "Tokenized treasuries & stocks", d: "Bringing Wall Street to the world. Tokenization & tech behind OndoPerps, Ondo Stocks, USDY, OUSG.", fol: "383.9K", join: "March 2021", b: "Low-volatility treasury and equity exposure" },
  { n: "xStocks", h: "@xStocksFi", cat: "Tokenized equities & ETFs", d: "xStocks by @Payward. Access US and global tokenized equities, ETFs, and IPOs. 1,000+ assets. 45B+ volume. 110+ countries.", fol: "87.3K", join: "April 2025", b: "Equity and ETF sleeves" },
  { n: "Centrifuge", h: "@centrifuge", cat: "Tokenized funds & credit", d: "Bringing the full power of onchain finance to asset managers and investors. Built on Ethereum.", fol: "94.2K", join: "April 2018", b: "Credit and fixed-income sleeves" },
  { n: "Maple", h: "@maplefinance", cat: "Onchain credit", d: "The onchain asset manager that activates capital through lending. $25B originated. $4.8B in AUM. $100M in yield back to lenders.", fol: "62.4K", join: "August 2019", b: "Yield from onchain lending" },
  { n: "Chainlink", h: "@chainlink", cat: "Oracles & data", d: "The market-leading oracle platform bringing the global financial system onchain. $36+ trillion enabled.", fol: "1.3M", join: "June 2013", b: "Price feeds behind tokenized assets" },
];
export const ProtoCard: React.FC<{ i: number; hl?: number; w?: number }> = ({ i, hl = 0, w = 900 }) => {
  const x = PROTOS[i];
  return (
    <div style={{ width: w, background: "rgba(61,24,18,0.92)", border: "1px solid rgba(246,218,195,0.35)", padding: "44px 48px", boxSizing: "border-box", boxShadow: "0 50px 120px rgba(0,0,0,0.5)" }}>
      <div style={serif(84, P.cream)}>{x.n}</div>
      <div style={mono(20, P.dim, { marginTop: 10 })}>{x.h}</div>
      <div style={mono(18, P.cream, { marginTop: 26, color: "#e0a45a" })}>{x.cat}</div>
      <div style={sans(36, P.cream, { marginTop: 18, lineHeight: 1.32 })}>{x.d}</div>
      <div style={{ display: "flex", gap: 90, marginTop: 34 }}>
        <div><div style={mono(15, P.dim)}>Followers on X</div><div style={serif(70, P.cream, { marginTop: 6 })}>{x.fol}</div></div>
        <div><div style={mono(15, P.dim)}>Joined</div><div style={serif(70, P.cream, { marginTop: 6 })}>{x.join}</div></div>
      </div>
      <div style={sans(30, P.cream, { marginTop: 28 })}>In a basket: {x.b}</div>
      <div style={{ ...mono(20, P.cream), marginTop: 28, display: "inline-block", borderBottom: `2px solid rgba(246,218,195,${0.4 + 0.6 * hl})`, paddingBottom: 4, background: `rgba(246,218,195,${0.25 * hl})` }}>Verify on X ↗</div>
      <div style={mono(14, "rgba(246,218,195,0.55)", { marginTop: 24, letterSpacing: 2 })}>Source: official X profile, checked 24 Oct 2026.</div>
    </div>
  );
};
const A7Hook: React.FC = () => (
  <Drift n={lenOf(t7, "hook")}>
    <div style={centre({ top: 640 })}><Reveal at={cueOf(t7, "hook", "swap") - 14} style={serif(128, P.cream, { textAlign: "center" })}>Built around<br />the tokenization<br />ecosystem.</Reveal></div>
  </Drift>
);
const A7Cards: React.FC = () => {
  const f = useCurrentFrame();
  const first = cueOf(t7, "cards", "first"), each = cueOf(t7, "cards", "each");
  return (
    <Drift n={lenOf(t7, "cards")} from={1} to={1.02}>
      {PROTOS.map((_, i) => {
        const a = first + i * each;
        const inP = ez(f, a, 34), out = i === 4 ? 0 : ez(f, a + each - 16, 16, IO);
        return (
          <div key={i} style={{ position: "absolute", left: 90, top: 400, opacity: inP * (1 - out), transform: `translateY(${(1 - inP) * 140 - out * 60}px)`, filter: `blur(${(1 - inP) * 10 + out * 10}px)` }}>
            <ProtoCard i={i} />
          </div>
        );
      })}
      <div style={{ ...mono(15, "rgba(246,218,195,0.7)", { letterSpacing: 2, lineHeight: 1.6 }), position: "absolute", left: 90, right: 90, bottom: 130 }}>Logos and names belong to their owners. Allocra is not affiliated with, sponsored or endorsed by these protocols, and none of their assets can be bought in the TestNet demo.</div>
    </Drift>
  );
};
const A7End: React.FC = () => <EndCardA n={lenOf(t7, "end")} line={<span>Plan clearly.<br />Act deliberately.</span>} />;
export const AllocraV7: React.FC = () => <Film tl={t7} audio={AUD(7)} bg={bgFrom([[0, P.dark], [1080, P.red]])} scenes={{ hook: A7Hook, cards: A7Cards, end: A7End }} />;

/* ================= V8 Verify it yourself ================= */
const t8 = T(av8);
const A8Card: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t8, "card", "card"), click = cueOf(t8, "card", "click"), sw = cueOf(t8, "card", "swap");
  const p = ez(f, card, 40);
  const c = path(f, [[0, 900, 1800], [card + 80, 900, 1800], [click - 30, 260, 1470], [click + 100, 700, 1700]]);
  return (
    <Drift n={lenOf(t8, "card")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 90, right: 90, top: 150 }}>
        <Swap at={card} each={sw - card} items={[<span key="a" style={serif(84, P.cream)}>Every figure comes from<br />the protocol’s own X profile.</span>, <span key="b" style={serif(84, P.cream)}>With a link to check<br />it yourself.</span>]} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 560, opacity: p, transform: `translateY(${(1 - p) * 140}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <ProtoCard i={0} hl={ez(f, click - 20, 20)} />
      </div>
      <Cursor {...c} click={pulse(f, click)} color={CUR} />
    </Drift>
  );
};
const A8End: React.FC = () => <EndCardA n={lenOf(t8, "end")} line={<span>Check it<br />yourself.</span>} />;
export const AllocraV8: React.FC = () => <Film tl={t8} audio={AUD(8)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ card: A8Card, end: A8End }} />;

/* ================= V9 Plan first (CTA) ================= */
const t9 = T(av9);
const A9Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sw = cueOf(t9, "hook", "swap"), each = cueOf(t9, "hook", "each"), btn = cueOf(t9, "hook", "btn");
  const bp = ez(f, btn, 34);
  const c = path(f, [[0, 900, 1800], [btn + 30, 900, 1800], [btn + 100, 380, 1360], [btn + 260, 400, 1370]]);
  return (
    <Drift n={lenOf(t9, "hook")}>
      <div style={centre({ top: 440 })}>
        <Swap at={sw - 20} each={each} items={[<span key="a" style={serif(210)}>Plan first.</span>, <span key="b" style={serif(110)}>Assets remain<br />individually held<br />until you approve<br />a trade.</span>]} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1300, opacity: bp, transform: `translateY(${(1 - bp) * 80}px)`, display: "flex", gap: 24 }}>
        <div style={{ background: P.cream, color: "#3d1812", ...sans(34, "#3d1812", { fontWeight: 500 }), padding: "28px 44px" }}>Open workspace →</div>
      </div>
      <div style={{ ...mono(16, "rgba(246,218,195,0.8)", { letterSpacing: 2 }), position: "absolute", left: 90, right: 90, top: 1470, opacity: bp }}>ⓘ Plan first. Assets remain individually held until you approve a trade.</div>
      <Cursor {...c} click={pulse(f, btn + 100)} color={CUR} />
    </Drift>
  );
};
const A9End: React.FC = () => <EndCardA n={lenOf(t9, "end")} line={<span>Allocation is a decision,<br />not a default.</span>} />;
export const AllocraV9: React.FC = () => <Film tl={t9} audio={AUD(9)} bg={bgFrom([[0, P.red]])} scenes={{ hook: A9Hook, end: A9End }} />;

/* ================= V10 Recap ================= */
const t10 = T(av10);
const A10Swap: React.FC = () => (
  <Drift n={lenOf(t10, "swap")}>
    <div style={centre({ top: 760 })}>
      <Swap at={cueOf(t10, "swap", "swap") - 20} each={cueOf(t10, "swap", "each")} items={[
        <span key="a" style={serif(200)}>Your assets.</span>, <span key="b" style={serif(170)}>Your allocation.</span>,
        <span key="c" style={serif(120, P.cream, { textAlign: "center", display: "inline-block" })}>A decision,<br />not a default.</span>,
      ]} />
    </div>
  </Drift>
);
const A10End: React.FC = () => <EndCardA n={lenOf(t10, "end")} line={<span>Plan clearly.<br />Act deliberately.</span>} />;
export const AllocraV10: React.FC = () => <Film tl={t10} audio={AUD(10)} bg={bgFrom([[0, P.red]])} scenes={{ swap: A10Swap, end: A10End }} />;
export { VW, Img, staticFile, Typed };
