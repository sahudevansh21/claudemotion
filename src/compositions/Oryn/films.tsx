import { C, CL, DISPLAY, ez, IO, MONO, OUT, SANS, VERDICTS } from "./brand";
import { Chip, VerdictCard } from "./parts";
import { bgFrom, Cursor, Drift, EndCard, Film, Halftone, Illustrative, lenOf, path, pulse, Reveal, Swap, Typed, cueOf, type Tl } from "./motion";
import { interpolate, useCurrentFrame } from "remotion";
import v2 from "./v2.json";
import v4 from "./v4.json";
import v5 from "./v5.json";
import v6 from "./v6.json";

const big: React.CSSProperties = { fontFamily: SANS, fontWeight: 500, letterSpacing: -2, color: C.ink, textAlign: "center" };

/* ===================================================== V2 Divergent ===================== */
const T2 = v2 as unknown as Tl;
const V2Hook: React.FC = () => (
  <Drift n={lenOf(T2, "hook")}>
    <Halftone o={0.5} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, fontSize: 112, ...big }}>
      <Swap at={cueOf(T2, "hook", "swap") - 60} each={cueOf(T2, "hook", "each")} items={[<span key="a">A stock split is announced.</span>, <span key="b">The issuer <span style={{ color: C.blue }}>applies</span> it.</span>]} />
    </div>
  </Drift>
);
const V2Cards: React.FC = () => {
  const f = useCurrentFrame();
  const cards = cueOf(T2, "cards", "cards"), cur = cueOf(T2, "cards", "cursor");
  const click = cur + 40;
  const sel = ez(f, click, 22);
  const mk = (i: number, x: number, chain: string, name: string, status: "closed" | "divergent") => {
    const p = ez(f, cards + i * 18, 30);
    const dark = status === "divergent" && sel > 0.5;
    return (
      <div key={chain} style={{ position: "absolute", left: x, top: 330, width: 560, height: 470, opacity: p * (status === "closed" ? 1 - 0.5 * sel : 1), transform: `translateY(${(1 - p) * 140}px) scale(${status === "divergent" ? 1 + 0.03 * sel : 1})`, filter: `blur(${(1 - p) * 10}px)`, background: dark ? C.ink : "#fff", borderRadius: 32, boxShadow: "0 40px 90px rgba(13,13,15,0.18)", padding: "46px 48px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.55)" }}>Chain {chain}</div>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.05, color: dark ? C.red : C.blue, marginTop: 16, textTransform: "none" }}>xTSLA</div>
        <div style={{ fontFamily: SANS, fontSize: 26, color: dark ? "rgba(255,255,255,0.7)" : "rgba(13,13,15,0.6)", marginTop: 4 }}>{name}</div>
        <div style={{ marginTop: 40 }}><Chip status={dark ? "divergent" : status === "divergent" ? "closed" : status} size={26} /></div>
      </div>
    );
  };
  const c = path(f, [[0, 1500, 930], [cur, 1500, 930], [cur + 38, 1260, 640], [cur + 140, 1560, 860]]);
  return (
    <Drift n={lenOf(T2, "cards")} from={1.02} to={1}>
      <Reveal at={4} style={{ position: "absolute", left: 0, right: 0, top: 150, ...big, fontSize: 64 }}>Same token. Two chains.</Reveal>
      {mk(0, 340, "ETH", "Tesla xStock", "closed")}
      {mk(1, 1020, "SOL", "Tesla xStock", "divergent")}
      <Cursor {...c} click={pulse(f, click)} />
    </Drift>
  );
};
const V2Dark: React.FC = () => {
  const f = useCurrentFrame();
  const c = (n: string) => cueOf(T2, "dark", n);
  return (
    <Drift n={lenOf(T2, "dark")} from={1} to={1.04}>
      <Reveal at={c("pill")} style={{ position: "absolute", left: 220, top: 230 }}><Chip status="divergent" size={34} /></Reveal>
      <Reveal at={c("pill") + 8} style={{ position: "absolute", left: 210, top: 320, fontFamily: DISPLAY, fontSize: 300, lineHeight: 1, color: C.red, textTransform: "none" }}>xTSLA</Reveal>
      <div style={{ position: "absolute", left: 220, top: 660, width: 1500, fontFamily: SANS, fontWeight: 700, fontSize: 70, lineHeight: 1.15, color: "#fff", letterSpacing: -1 }}>
        <Typed text="Stock split 3:1 not applied on Solana." at={c("text")} cps={22} color="#fff" />
      </div>
      <div style={{ position: "absolute", left: 224, top: 880, fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", opacity: ez(f, c("meta"), 24) }}>Next change · unknown</div>
    </Drift>
  );
};
const V2End: React.FC = () => <EndCard n={lenOf(T2, "end")} line={<span>One chain behind. <span style={{ color: C.blue }}>Oryn catches it.</span></span>} />;
export const OrynV2: React.FC = () => (
  <Film tl={T2} audio="oryn/audio/v2.wav" bg={bgFrom([[0, C.cream], [540, C.ink], [900, C.cream]])} scenes={{ hook: V2Hook, cards: V2Cards, dark: V2Dark, end: V2End }} />
);

/* ===================================================== V4 Guard ========================= */
const T4 = v4 as unknown as Tl;
const V4Hook: React.FC = () => (
  <Drift n={lenOf(T4, "hook")}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 430, fontSize: 130, ...big }}>
      <Swap at={cueOf(T4, "hook", "swap") - 50} each={cueOf(T4, "hook", "each")} items={[<span key="a">Before you swap,</span>, <span key="b">ask the <span style={{ fontFamily: DISPLAY, letterSpacing: 2, color: C.blue }}>GUARD.</span></span>]} />
    </div>
  </Drift>
);
const FIELDS: [string, string, number][] = [["Token", "xTSLA", 70], ["Chain", "SOL", 190], ["Action", "Swap", 290]];
const V4Form: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(T4, "form", "card");
  const p = ez(f, card, 34);
  const btn = 345;
  const cur = path(f, [[0, 1500, 960], [250, 1500, 960], [330, 1160, 820], [btn + 100, 1300, 900]]);
  return (
    <Drift n={lenOf(T4, "form")} from={1.02} to={1}>
      <div style={{ position: "absolute", left: 460, top: 150, width: 1000, opacity: p, transform: `translateY(${(1 - p) * 150}px)`, filter: `blur(${(1 - p) * 10}px)`, background: "#fff", borderRadius: 34, boxShadow: "0 40px 90px rgba(13,13,15,0.2)", padding: "52px 60px 56px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 70, color: C.ink, letterSpacing: 1 }}>THE GUARD</div>
        {FIELDS.map(([k, v, at]) => (
          <div key={k} style={{ marginTop: 28 }}>
            <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 5, textTransform: "uppercase", opacity: 0.55 }}>{k}</div>
            <div style={{ marginTop: 8, border: `3px solid ${C.ink}`, borderRadius: 14, height: 84, display: "flex", alignItems: "center", padding: "0 26px", fontFamily: MONO, fontWeight: 700, fontSize: 40 }}>
              <Typed text={v} at={at} cps={14} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 44, height: 92, borderRadius: 18, background: f > btn ? C.ink : C.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, transform: `scale(${f >= btn && f < btn + 12 ? 0.97 : 1})` }}>Check before I act</div>
      </div>
      <Illustrative at={card + 30} style={{ left: 470, top: 108 }} />
      <Cursor {...cur} click={pulse(f, btn)} />
    </Drift>
  );
};
const V4Result: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(T4, "result", "card"), text = cueOf(T4, "result", "text");
  const p = ez(f, card, 34);
  return (
    <Drift n={lenOf(T4, "result")} from={1} to={1.03}>
      <div style={{ position: "absolute", left: 360, top: 190, width: 1200, opacity: p, transform: `translateY(${(1 - p) * 150}px) scale(${0.95 + 0.05 * p})`, filter: `blur(${(1 - p) * 10}px)`, background: "#fff", borderRadius: 40, boxShadow: "0 50px 110px rgba(13,13,15,0.3)", padding: "56px 70px 60px", boxSizing: "border-box" }}>
        <Chip status="divergent" size={30} />
        <div style={{ fontFamily: DISPLAY, fontSize: 300, lineHeight: 1.02, color: C.red, marginTop: 18 }}>BLOCKED</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", marginTop: 8 }}>xTSLA · SOL</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 48, lineHeight: 1.2, marginTop: 28, color: C.ink }}>
          <Typed text="Stock split 3:1 not applied on Solana." at={text} cps={22} />
        </div>
      </div>
    </Drift>
  );
};
const V4End: React.FC = () => <EndCard n={lenOf(T4, "end")} line={<span>Unknown means <span style={{ color: C.blue }}>not actionable.</span></span>} />;
export const OrynV4: React.FC = () => (
  <Film tl={T4} audio="oryn/audio/v4.wav" bg={bgFrom([[0, C.yellow], [600, C.red], [900, C.cream]])} scenes={{ hook: V4Hook, form: V4Form, result: V4Result, end: V4End }} />
);

/* ===================================================== V5 Same token ==================== */
const T5 = v5 as unknown as Tl;
const V5Hook: React.FC = () => (
  <Drift n={lenOf(T5, "hook")}>
    <Halftone o={0.45} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, fontSize: 120, ...big }}>
      <Swap at={cueOf(T5, "hook", "a")} each={cueOf(T5, "hook", "b") - cueOf(T5, "hook", "a") + 60} items={[<span key="a">Same <span style={{ color: C.blue }}>token.</span></span>, <span key="b">Different <span style={{ color: C.blue }}>chain.</span></span>]} />
    </div>
  </Drift>
);
const ROW2 = [
  { sym: "xTSLA", chain: "ETH", status: "closed" as const },
  { sym: "xTSLA", chain: "SOL", status: "divergent" as const },
];
const V5Rows: React.FC = () => {
  const f = useCurrentFrame();
  const rows = cueOf(T5, "rows", "rows"), mv = cueOf(T5, "rows", "move");
  const click1 = 100, click2 = mv + 20;
  const sel1 = ez(f, click1, 20) * (1 - ez(f, click2, 20));
  const sel2 = ez(f, click2, 20);
  const top = (i: number) => 380 + i * 170;
  const c = path(f, [[0, 1500, 960], [rows + 40, 1500, 960], [click1 - 18, 760, top(0) + 60], [click1 + 8, 760, top(0) + 60], [mv, 760, top(0) + 60], [click2 - 2, 760, top(1) + 60], [click2 + 120, 1500, 900]]);
  return (
    <Drift n={lenOf(T5, "rows")} from={1} to={1.03}>
      <Reveal at={6} style={{ position: "absolute", left: 360, top: 230, fontFamily: MONO, fontSize: 22, letterSpacing: 6, textTransform: "uppercase" }}>Tesla xStock · 2 deployments</Reveal>
      {ROW2.map((r, i) => {
        const p = ez(f, rows + i * 18, 30);
        const sel = i === 0 ? sel1 : sel2;
        const bg = mixHexLocal("#ffffff", C.ink, sel);
        return (
          <div key={r.chain} style={{ position: "absolute", left: 360, top: top(i), width: 1200, height: 130, opacity: p, transform: `translateY(${(1 - p) * 140}px) scale(${1 + 0.03 * sel})`, filter: `blur(${(1 - p) * 10}px)`, background: bg, color: sel > 0.5 ? "#fff" : C.ink, borderRadius: 30, boxShadow: sel > 0.1 ? "0 30px 70px rgba(13,13,15,0.35)" : "0 10px 30px rgba(13,13,15,0.08)", display: "flex", alignItems: "center", padding: "0 44px", gap: 34 }}>
            <div style={{ width: 52, height: 52, borderRadius: 99, background: r.status === "divergent" ? C.red : C.blue }} />
            <div style={{ fontFamily: DISPLAY, fontSize: 72, textTransform: "none" }}>{r.sym}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 5, opacity: 0.6 }}>{r.chain}</div>
            <div style={{ marginLeft: "auto" }}><Chip status={r.status} size={24} /></div>
          </div>
        );
      })}
      <Cursor {...c} click={Math.max(pulse(f, click1), pulse(f, click2))} />
    </Drift>
  );
};
const mixHexLocal = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a); const [r2, g2, b2] = p(b);
  const h = (x: number) => Math.round(x).toString(16).padStart(2, "0");
  return `#${h(r1 + (r2 - r1) * t)}${h(g1 + (g2 - g1) * t)}${h(b1 + (b2 - b1) * t)}`;
};
const V5Reasons: React.FC = () => {
  const f = useCurrentFrame();
  const t1 = cueOf(T5, "reasons", "t1"), t2 = cueOf(T5, "reasons", "t2");
  const card = (x: number, dark: boolean, at: number, chain: string, status: "closed" | "divergent", text: string, meta: string) => {
    const p = ez(f, at - 14, 30);
    return (
      <div style={{ position: "absolute", left: x, top: 220, width: 760, height: 640, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, filter: `blur(${(1 - p) * 10}px)`, background: dark ? C.ink : "#fff", borderRadius: 36, boxShadow: "0 40px 90px rgba(13,13,15,0.2)", padding: "50px 56px", boxSizing: "border-box" }}>
        <Chip status={status} size={26} />
        <div style={{ fontFamily: DISPLAY, fontSize: 130, lineHeight: 1.05, color: dark ? C.red : C.blue, marginTop: 20, textTransform: "none" }}>xTSLA</div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 5, textTransform: "uppercase", color: dark ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.55)" }}>Chain {chain}</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, lineHeight: 1.25, marginTop: 28, color: dark ? "#fff" : C.ink, minHeight: 150 }}><Typed text={text} at={at} cps={26} color={dark ? "#fff" : C.ink} /></div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: "uppercase", marginTop: 20, opacity: 0.6 * ez(f, at + 70, 20), color: dark ? "#fff" : C.ink }}>{meta}</div>
      </div>
    );
  };
  return (
    <Drift n={lenOf(T5, "reasons")} from={1.02} to={1}>
      {card(150, false, t1, "ETH", "closed", "Underlying exchange is closed; oracle price is frozen at the last close, as expected.", "Market opens in 6h")}
      {card(1010, true, t2, "SOL", "divergent", "Stock split 3:1 not applied on Solana.", "Next change · unknown")}
    </Drift>
  );
};
const V5End: React.FC = () => <EndCard n={lenOf(T5, "end")} line={<span>One verdict per token, <span style={{ color: C.blue }}>per chain.</span></span>} />;
export const OrynV5: React.FC = () => (
  <Film tl={T5} audio="oryn/audio/v5.wav" bg={bgFrom([[0, C.cream], [300, C.paper], [1320, C.cream]])} scenes={{ hook: V5Hook, rows: V5Rows, reasons: V5Reasons, end: V5End }} />
);

/* ===================================================== V6 Action pending =============== */
const T6 = v6 as unknown as Tl;
const V6Hook: React.FC = () => (
  <Drift n={lenOf(T6, "hook")}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, fontSize: 118, ...big }}>
      <Swap at={cueOf(T6, "hook", "swap") - 40} each={cueOf(T6, "hook", "each")} items={[<span key="a">A dividend is coming.</span>, <span key="b">Is your <span style={{ color: C.blue }}>multiplier</span> ready?</span>]} />
    </div>
  </Drift>
);
const V6Card: React.FC = () => {
  const f = useCurrentFrame();
  const card = cueOf(T6, "card", "card"), hl = cueOf(T6, "card", "hl");
  const p = ez(f, card, 34), p2 = ez(f, card + 24, 34);
  const sel = ez(f, hl, 22);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const off = 3; // 1 Oct 2026 is a Thursday (Mon-first grid)
  const cur = path(f, [[0, 1500, 960], [hl - 70, 1500, 960], [hl - 6, 385, 655], [hl + 100, 1200, 900]]);
  return (
    <Drift n={lenOf(T6, "card")} from={1.02} to={1}>
      <div style={{ position: "absolute", left: 200, top: 180, width: 640, opacity: p, transform: `translateY(${(1 - p) * 140}px)`, filter: `blur(${(1 - p) * 10}px)`, background: "#fff", borderRadius: 34, boxShadow: "0 40px 90px rgba(13,13,15,0.2)", padding: "44px 48px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 60, letterSpacing: 1 }}>OCTOBER 2026</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 24, fontFamily: MONO, fontSize: 18, textAlign: "center", opacity: 0.5 }}>{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (<div key={i}>{d}</div>))}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 10, fontFamily: MONO, fontWeight: 700, fontSize: 24, textAlign: "center" }}>
          {Array.from({ length: off }).map((_, i) => (<div key={`o${i}`} />))}
          {days.map((d) => (
            <div key={d} style={{ height: 62, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: d === 27 ? `rgba(38,48,200,${sel})` : "transparent", color: d === 27 && sel > 0.5 ? "#fff" : C.ink, transform: d === 27 ? `scale(${1 + 0.12 * sel})` : "none" }}>{d}</div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 3, textTransform: "uppercase", marginTop: 22, opacity: ez(f, hl + 8, 20) * 0.7 }}>Effective 2026-10-27 22:00 UTC</div>
      </div>
      <Illustrative at={card + 30} style={{ left: 210, top: 140 }} />
      <div style={{ position: "absolute", left: 920, top: 330, width: 800, opacity: p2, transform: `translateY(${(1 - p2) * 140}px)`, filter: `blur(${(1 - p2) * 10}px)`, background: sel > 0.5 ? C.ink : "#fff", borderRadius: 32, boxShadow: "0 40px 90px rgba(13,13,15,0.25)", padding: "40px 48px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 28 }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 96, color: sel > 0.5 ? C.yellow : C.blue, textTransform: "none" }}>xAAPL</div>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: sel > 0.5 ? "rgba(255,255,255,0.6)" : "rgba(13,13,15,0.5)" }}>ETH</div>
        <div style={{ marginLeft: "auto" }}><Chip status="pending" size={24} /></div>
      </div>
      <Cursor {...cur} click={pulse(f, hl)} />
    </Drift>
  );
};
const V6Count: React.FC = () => {
  const f = useCurrentFrame();
  const chip = cueOf(T6, "count", "chip"), text = cueOf(T6, "count", "text");
  return (
    <Drift n={lenOf(T6, "count")} from={1} to={1.04}>
      <Reveal at={chip} style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}><Chip status="pending" size={32} /></Reveal>
      <Reveal at={chip + 8} style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: DISPLAY, fontSize: 380, lineHeight: 1, color: C.ink }}>38H</Reveal>
      <Reveal at={chip + 22} style={{ position: "absolute", left: 0, right: 0, top: 650, textAlign: "center", fontFamily: MONO, fontSize: 30, letterSpacing: 8, textTransform: "uppercase" }}>Event effective in</Reveal>
      <div style={{ position: "absolute", left: 0, right: 0, top: 770, fontSize: 70, ...big, opacity: ez(f, text, 20) }}>
        <Swap at={text} each={90} items={[<span key="a">Dividend $0.27 / share.</span>, <span key="b">Multiplier not yet applied.</span>]} />
      </div>
    </Drift>
  );
};
const V6End: React.FC = () => <EndCard n={lenOf(T6, "end")} line={<span>Know what’s coming <span style={{ color: C.blue }}>before it lands.</span></span>} />;
export const OrynV6: React.FC = () => (
  <Film tl={T6} audio="oryn/audio/v6.wav" bg={bgFrom([[0, C.yellow], [1020, C.cream]])} scenes={{ hook: V6Hook, card: V6Card, count: V6Count, end: V6End }} />
);
export { CL, IO, OUT, VERDICTS, VerdictCard, interpolate };
