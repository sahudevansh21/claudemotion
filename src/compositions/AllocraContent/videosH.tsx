import { useCurrentFrame, interpolate } from "remotion";
import { Cursor, Drift, EndCardH, FilmH, HW, PaintingH, Reveal, Swap, SH_H, SH_SLIDER, SH_TAB_Y, SH_W, SlateH, bgFrom, cueOf, ez, IO, CL, lenOf, mono, P, path, pulse, sans, serif, shTabX, type Tl } from "./kitH";
import { Preview } from "./kit";
import { PROTOS } from "./videos";
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
const AUD = (n: number) => `allocra/content/audio/av${n}.wav`;
const T = (x: unknown) => x as unknown as Tl;
const mid = (top: number): React.CSSProperties => ({ position: "absolute", left: 120, right: 120, top, textAlign: "center" });
const SL_LEFT = (HW - SH_W) / 2;
const SL_TOP = 230;

/* ================= H1 Your assets. Your allocation. ================= */
const t1 = T(av1);
const H1Hook: React.FC = () => (
  <Drift n={lenOf(t1, "hook")}>
    <Reveal at={6} style={{ ...mono(20, P.cream), position: "absolute", left: 120, top: 110 }}>MMXXVI + ——— Private allocation desk / 01</Reveal>
    <div style={mid(380)}><Swap at={cueOf(t1, "hook", "swap") - 20} each={cueOf(t1, "hook", "each")} items={[<span key="a" style={serif(250)}>Your assets.</span>, <span key="b" style={serif(230)}>Your allocation.</span>]} /></div>
  </Drift>
);
const H1Slate: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t1, "slate", "card"), cur = cueOf(t1, "slate", "cursor");
  const p = ez(f, card, 36);
  const c = path(f, [[0, 1700, 980], [cur, 1700, 980], [cur + 40, SL_LEFT + shTabX(1), SL_TOP + SH_TAB_Y], [cur + 200, 1500, 900]]);
  return (
    <Drift n={lenOf(t1, "slate")} from={1.02} to={1}>
      <div style={{ ...mono(20, P.cream), position: "absolute", left: SL_LEFT, top: 130, opacity: ez(f, card + 10, 24) }}>Private allocation desk / 01</div>
      <div style={{ position: "absolute", left: SL_LEFT, top: SL_TOP, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <SlateH p={ez(f, card + 14, 70)} metrics={ez(f, card + 80, 30)} monthly={1} tab={f >= cur + 44 ? 1 : -1} />
      </div>
      <Cursor {...c} click={pulse(f, cur + 44)} color={CUR} />
    </Drift>
  );
};
const H1Copy: React.FC = () => {
  const f = useCurrentFrame();
  const a = cueOf(t1, "copy", "a"), b = cueOf(t1, "copy", "b");
  const s = sans(86, P.cream, { fontWeight: 400, lineHeight: 1.2 });
  return (
    <Drift n={lenOf(t1, "copy")} from={1} to={1.04}>
      <div style={{ position: "absolute", left: 220, top: 330 }}>
        <Swap at={a - 12} each={b - a} items={[
          <span key="a" style={s}>Plan a tokenized ETF basket<br />around the positions you<br />actually want to own.</span>,
          <span key="b" style={s}>See concentration, overlap,<br />quotes, and trading costs<br />before you confirm.</span>,
        ]} />
      </div>
      <div style={{ ...mono(18, P.dim), position: "absolute", left: 220, bottom: 120, opacity: ez(f, a + 30, 20) }}>Allocation is a decision, not a default.</div>
    </Drift>
  );
};
const H1End: React.FC = () => <EndCardH n={lenOf(t1, "end")} line={<span>Plan clearly. Act deliberately.</span>} />;
export const AllocraH1: React.FC = () => <FilmH tl={t1} audio={AUD(1)} bg={bgFrom([[0, P.red], [540, P.dark], [840, P.red]])} scenes={{ hook: H1Hook, slate: H1Slate, copy: H1Copy, end: H1End }} />;

/* ================= H2 Plan first ================= */
const t2 = T(av2);
const H2Hook: React.FC = () => (
  <Drift n={lenOf(t2, "hook")}>
    <div style={mid(400)}><Swap at={cueOf(t2, "hook", "swap") - 20} each={cueOf(t2, "hook", "each")} items={[<span key="a" style={serif(280)}>Plan first.</span>, <span key="b" style={serif(210)}>Before you confirm.</span>]} /></div>
  </Drift>
);
const H2Slate: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t2, "slate", "card"), drag = cueOf(t2, "slate", "drag"), tab = cueOf(t2, "slate", "tab");
  const p = ez(f, card, 36);
  const monthly = interpolate(f, [drag, drag + 140], [0.4, 1], { ...CL, easing: IO });
  const hx = (m: number) => SL_LEFT + SH_SLIDER.x0 + (SH_SLIDER.x1 - SH_SLIDER.x0) * 0.46 * m;
  const sy = SL_TOP + SH_SLIDER.y;
  const c = path(f, [[0, 1700, 980], [drag - 40, 1700, 980], [drag - 6, hx(0.4), sy], [drag + 140, hx(1), sy], [drag + 240, 1500, 800], [tab - 10, SL_LEFT + shTabX(1), SL_TOP + SH_TAB_Y], [tab + 90, 1600, 960]]);
  return (
    <Drift n={lenOf(t2, "slate")} from={1.02} to={1}>
      <div style={{ ...mono(20, P.cream), position: "absolute", left: SL_LEFT, top: 130, opacity: ez(f, card + 10, 24) }}>Plan first / draft</div>
      <div style={{ position: "absolute", left: SL_LEFT, top: SL_TOP, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)` }}>
        <SlateH p={ez(f, card + 14, 70)} metrics={ez(f, drag + 150, 30)} monthly={monthly} tab={f >= tab ? 1 : -1} />
      </div>
      <Cursor {...c} click={Math.max(pulse(f, drag), pulse(f, tab))} color={CUR} />
    </Drift>
  );
};
const H2End: React.FC = () => <EndCardH n={lenOf(t2, "end")} line={<span>Assets remain individually held<br />until you approve a trade.</span>} />;
export const AllocraH2: React.FC = () => <FilmH tl={t2} audio={AUD(2)} bg={bgFrom([[0, P.red], [180, P.dark], [720, P.red]])} scenes={{ hook: H2Hook, slate: H2Slate, end: H2End }} />;

/* ================= Painting films ================= */
const PaintSceneH: React.FC<{ tl: Tl; img: string; h: number; items: React.ReactNode[]; sub: string }> = ({ tl, img, h, items, sub }) => {
  const f = useCurrentFrame();
  const c = cueOf(tl, "paint", "img"), sw = cueOf(tl, "paint", "swap"), each = cueOf(tl, "paint", "each");
  const p = ez(f, c, 40);
  const top = Math.round((1080 - h - 28) / 2);
  const zoom = interpolate(f, [0, lenOf(tl, "paint")], [1, 1.1], { ...CL, easing: IO });
  return (
    <Drift n={lenOf(tl, "paint")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 120, top, opacity: p, transform: `translateX(${(1 - p) * -100}px)`, filter: `blur(${(1 - p) * 10}px)` }}><PaintingH src={img} w={980} h={h} zoom={zoom} /></div>
      <div style={{ ...mono(18, P.dim), position: "absolute", left: 1160, top: 1080 / 2 - 190, opacity: ez(f, sw + 30, 20) }}>{sub}</div>
      <div style={{ position: "absolute", left: 1160, right: 90, top: 1080 / 2 - 140 }}><Swap at={sw - 12} each={each} items={items} /></div>
    </Drift>
  );
};
const t3 = T(av3);
const H3Paint: React.FC = () => <PaintSceneH tl={t3} img="adam" h={650} sub="Plan with data. Decide yourself." items={[<span key="a" style={serif(124)}>Human<br />judgment,</span>, <span key="b" style={serif(124)}>machine<br />precision.</span>]} />;
const H3End: React.FC = () => <EndCardH n={lenOf(t3, "end")} line={<span>Plan with data. Decide yourself.</span>} />;
export const AllocraH3: React.FC = () => <FilmH tl={t3} audio={AUD(3)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: H3Paint, end: H3End }} />;
const t5 = T(av5);
const H5Paint: React.FC = () => <PaintSceneH tl={t5} img="painter" h={690} sub="Know the risk" items={[<span key="a" style={serif(150)}>Know the<br />risk.</span>, <span key="b" style={serif(110)}>Looking back<br />is not looking<br />ahead.</span>]} />;
const H5End: React.FC = () => <EndCardH n={lenOf(t5, "end")} line={<span>Looking back is not looking ahead.</span>} />;
export const AllocraH5: React.FC = () => <FilmH tl={t5} audio={AUD(5)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: H5Paint, end: H5End }} />;
const t6 = T(av6);
const H6Paint: React.FC = () => <PaintSceneH tl={t6} img="chess" h={800} sub="Strategy over reaction" items={[<span key="a" style={serif(112)}>Every move<br />is a decision.</span>, <span key="b" style={serif(112)}>Strategy<br />over reaction.</span>]} />;
const H6End: React.FC = () => <EndCardH n={lenOf(t6, "end")} line={<span>Strategy over reaction.</span>} />;
export const AllocraH6: React.FC = () => <FilmH tl={t6} audio={AUD(6)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ paint: H6Paint, end: H6End }} />;

/* ================= H4 Look beneath the percentages ================= */
const t4 = T(av4);
const H4Hook: React.FC = () => (
  <Drift n={lenOf(t4, "hook")}><div style={mid(330)}><Reveal at={cueOf(t4, "hook", "swap") - 14} style={serif(190, P.cream, { textAlign: "center" })}>Look beneath<br />the percentages.</Reveal></div></Drift>
);
const ROWS4: [string, string, string][] = [["Overlap", "0%", "How much your ETFs repeat each other"], ["Issuer tilt", "High", "Concentration in a single issuer"], ["Est. cost / yr", "$0.50", "What the basket costs to hold"]];
const H4Frame: React.FC = () => {
  const f = useCurrentFrame();
  const img = cueOf(t4, "frame", "img"), rows = cueOf(t4, "frame", "rows");
  const p = ez(f, img, 40);
  const hls = [200, 300, 400];
  const top = (i: number) => 300 + i * 200;
  const c = path(f, [[0, 1700, 980], [rows + 40, 1700, 980], [hls[0] - 10, 1500, top(0) + 80], [hls[1] - 10, 1500, top(1) + 80], [hls[2] - 10, 1500, top(2) + 80], [hls[2] + 80, 1700, 980]]);
  return (
    <Drift n={lenOf(t4, "frame")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 120, top: 300, opacity: p, transform: `translateX(${(1 - p) * -100}px)`, filter: `blur(${(1 - p) * 10}px)` }}><PaintingH src="scholars" w={800} h={420} zoom={1 + 0.06 * ez(f, 0, 400, IO)} /></div>
      <div style={{ ...mono(17, P.dim), position: "absolute", left: 1000, top: 230, opacity: ez(f, rows, 20) }}>Overlap, concentration, cost</div>
      <Preview style={{ position: "absolute", right: 120, top: 227, opacity: ez(f, rows, 20) }} />
      {ROWS4.map(([k, v, s], i) => {
        const rp = ez(f, rows + i * 16, 30);
        const hl = ez(f, hls[i], 18) * (1 - (i < 2 ? ez(f, hls[i + 1], 18) : 0));
        return (
          <div key={k} style={{ position: "absolute", left: 1000, top: top(i), width: 800, height: 170, opacity: rp, transform: `translateY(${(1 - rp) * 80}px)`, background: `rgba(246,218,195,${0.04 + 0.92 * hl})`, border: "1px solid rgba(246,218,195,0.35)", padding: "0 36px", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={serif(58, hl > 0.5 ? "#3d1812" : P.cream)}>{k}</div><div style={mono(14, hl > 0.5 ? "#6a3a2e" : P.dim, { marginTop: 8 })}>{s}</div></div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 60, color: hl > 0.5 ? "#3d1812" : P.cream }}>{v}</div>
          </div>
        );
      })}
      <Cursor {...c} click={Math.max(...hls.map((h) => pulse(f, h)))} color={CUR} />
    </Drift>
  );
};
const H4End: React.FC = () => <EndCardH n={lenOf(t4, "end")} line={<span>Overlap, concentration, cost.</span>} />;
export const AllocraH4: React.FC = () => <FilmH tl={t4} audio={AUD(4)} bg={bgFrom([[0, P.dark], [780, P.red]])} scenes={{ hook: H4Hook, frame: H4Frame, end: H4End }} />;

/* ================= Ecosystem ================= */
export const PROTO_VERIFY = { x: 840 + 70, y: 440 };
export const ProtoCardH: React.FC<{ i: number; hl?: number }> = ({ i, hl = 0 }) => {
  const x = PROTOS[i];
  return (
    <div style={{ position: "relative", width: 1500, height: 580, background: "rgba(61,24,18,0.92)", border: "1px solid rgba(246,218,195,0.35)", boxShadow: "0 50px 120px rgba(0,0,0,0.5)" }}>
      <div style={{ position: "absolute", left: 56, top: 40, ...serif(96, P.cream) }}>{x.n}</div>
      <div style={{ position: "absolute", left: 56, top: 158, ...mono(18, P.dim) }}>{x.h}</div>
      <div style={{ position: "absolute", left: 56, top: 206, ...mono(17, "#e0a45a") }}>{x.cat}</div>
      <div style={{ position: "absolute", left: 56, top: 262, width: 700, ...sans(34, P.cream, { lineHeight: 1.32 }) }}>{x.d}</div>
      <div style={{ position: "absolute", left: 840, top: 52, display: "flex", gap: 90 }}>
        <div><div style={mono(14, P.dim)}>Followers on X</div><div style={serif(86, P.cream, { marginTop: 6 })}>{x.fol}</div></div>
        <div><div style={mono(14, P.dim)}>Joined</div><div style={serif(86, P.cream, { marginTop: 6 })}>{x.join}</div></div>
      </div>
      <div style={{ position: "absolute", left: 840, top: 292, width: 600, ...sans(32, P.cream) }}>In a basket: {x.b}</div>
      <div style={{ position: "absolute", left: 840, top: 420, ...mono(20, P.cream), borderBottom: `2px solid rgba(246,218,195,${0.4 + 0.6 * hl})`, paddingBottom: 4, background: `rgba(246,218,195,${0.25 * hl})` }}>Verify on X ↗</div>
      <div style={{ position: "absolute", left: 840, top: 500, ...mono(14, "rgba(246,218,195,0.55)", { letterSpacing: 2 }) }}>Source: official X profile, checked 24 Oct 2026.</div>
    </div>
  );
};
const t7 = T(av7);
const H7Hook: React.FC = () => (
  <Drift n={lenOf(t7, "hook")}><div style={mid(340)}><Reveal at={cueOf(t7, "hook", "swap") - 14} style={serif(150, P.cream, { textAlign: "center" })}>Built around<br />the tokenization ecosystem.</Reveal></div></Drift>
);
const H7Cards: React.FC = () => {
  const f = useCurrentFrame();
  const first = cueOf(t7, "cards", "first"), each = cueOf(t7, "cards", "each");
  return (
    <Drift n={lenOf(t7, "cards")} from={1} to={1.02}>
      {PROTOS.map((_, i) => {
        const a = first + i * each;
        const inP = ez(f, a, 34), out = i === 4 ? 0 : ez(f, a + each - 16, 16, IO);
        return (
          <div key={i} style={{ position: "absolute", left: 210, top: 190, opacity: inP * (1 - out), transform: `translateY(${(1 - inP) * 120 - out * 50}px)`, filter: `blur(${(1 - inP) * 10 + out * 10}px)` }}><ProtoCardH i={i} /></div>
        );
      })}
      <div style={{ ...mono(14, "rgba(246,218,195,0.7)", { letterSpacing: 1.5, lineHeight: 1.6 }), position: "absolute", left: 210, right: 210, bottom: 90 }}>Logos and names belong to their owners. Allocra is not affiliated with, sponsored or endorsed by these protocols, and none of their assets can be bought in the TestNet demo.</div>
    </Drift>
  );
};
const H7End: React.FC = () => <EndCardH n={lenOf(t7, "end")} line={<span>Plan clearly. Act deliberately.</span>} />;
export const AllocraH7: React.FC = () => <FilmH tl={t7} audio={AUD(7)} bg={bgFrom([[0, P.dark], [1080, P.red]])} scenes={{ hook: H7Hook, cards: H7Cards, end: H7End }} />;

const t8 = T(av8);
const H8Card: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(t8, "card", "card"), click = cueOf(t8, "card", "click"), sw = cueOf(t8, "card", "swap");
  const p = ez(f, card, 40);
  const left = 210, top = 400;
  const c = path(f, [[0, 1700, 1000], [card + 80, 1700, 1000], [click - 30, left + PROTO_VERIFY.x + 40, top + PROTO_VERIFY.y + 20], [click + 100, 1500, 980]]);
  return (
    <Drift n={lenOf(t8, "card")} from={1} to={1.02}>
      <div style={{ position: "absolute", left: 210, top: 90 }}>
        <Swap at={card} each={sw - card} items={[<span key="a" style={serif(88, P.cream)}>Every figure comes from<br />the protocol’s own X profile.</span>, <span key="b" style={serif(88, P.cream)}>With a link to check<br />it yourself.</span>]} />
      </div>
      <div style={{ position: "absolute", left, top, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)` }}><ProtoCardH i={0} hl={ez(f, click - 20, 20)} /></div>
      <Cursor {...c} click={pulse(f, click)} color={CUR} />
    </Drift>
  );
};
const H8End: React.FC = () => <EndCardH n={lenOf(t8, "end")} line={<span>Check it yourself.</span>} />;
export const AllocraH8: React.FC = () => <FilmH tl={t8} audio={AUD(8)} bg={bgFrom([[0, P.dark], [600, P.red]])} scenes={{ card: H8Card, end: H8End }} />;

/* ================= H9, H10 ================= */
const t9 = T(av9);
const H9Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sw = cueOf(t9, "hook", "swap"), each = cueOf(t9, "hook", "each"), btn = cueOf(t9, "hook", "btn");
  const bp = ez(f, btn, 34);
  const c = path(f, [[0, 1700, 1000], [btn + 30, 1700, 1000], [btn + 100, 760, 820], [btn + 260, 780, 830]]);
  return (
    <Drift n={lenOf(t9, "hook")}>
      <div style={mid(250)}><Swap at={sw - 20} each={each} items={[<span key="a" style={serif(300)}>Plan first.</span>, <span key="b" style={serif(130, P.cream, { textAlign: "center", display: "inline-block" })}>Assets remain individually held<br />until you approve a trade.</span>]} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", opacity: bp, transform: `translateY(${(1 - bp) * 80}px)` }}>
        <div style={{ background: P.cream, ...sans(34, "#3d1812", { fontWeight: 500 }), padding: "26px 46px" }}>Open workspace →</div>
      </div>
      <div style={{ ...mono(16, "rgba(246,218,195,0.8)", { letterSpacing: 2 }), position: "absolute", left: 0, right: 0, textAlign: "center", top: 880, opacity: bp }}>ⓘ Plan first. Assets remain individually held until you approve a trade.</div>
      <Cursor {...c} click={pulse(f, btn + 100)} color={CUR} />
    </Drift>
  );
};
const H9End: React.FC = () => <EndCardH n={lenOf(t9, "end")} line={<span>Allocation is a decision, not a default.</span>} />;
export const AllocraH9: React.FC = () => <FilmH tl={t9} audio={AUD(9)} bg={bgFrom([[0, P.red]])} scenes={{ hook: H9Hook, end: H9End }} />;
const t10 = T(av10);
const H10Swap: React.FC = () => (
  <Drift n={lenOf(t10, "swap")}>
    <div style={mid(360)}><Swap at={cueOf(t10, "swap", "swap") - 20} each={cueOf(t10, "swap", "each")} items={[
      <span key="a" style={serif(260)}>Your assets.</span>, <span key="b" style={serif(230)}>Your allocation.</span>,
      <span key="c" style={serif(190, P.cream, { textAlign: "center" })}>A decision, not a default.</span>]} /></div>
  </Drift>
);
const H10End: React.FC = () => <EndCardH n={lenOf(t10, "end")} line={<span>Plan clearly. Act deliberately.</span>} />;
export const AllocraH10: React.FC = () => <FilmH tl={t10} audio={AUD(10)} bg={bgFrom([[0, P.red]])} scenes={{ swap: H10Swap, end: H10End }} />;
export { SH_H };
