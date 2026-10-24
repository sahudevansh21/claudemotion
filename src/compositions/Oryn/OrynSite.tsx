import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";
import { C, CL, DEPLOYMENTS, DISPLAY, ez, IO, MONO, SANS, pop, VERDICTS } from "./brand";
import { Badge, Barcode, Block, Chip, Paper, VerdictCard } from "./parts";

/** Scroll keyframes [frame, scrollY]: eased glides with pauses on each section. */
const SCROLL: [number, number][] = [[0, 0], [150, 0], [270, 560], [380, 560], [520, 1100], [640, 1100], [780, 1760], [900, 1760]];
const scrollAt = (f: number) => {
  for (let i = 0; i < SCROLL.length - 1; i++) {
    const [a, ya] = SCROLL[i]; const [b, yb] = SCROLL[i + 1];
    if (f >= a && f <= b) return interpolate(f, [a, b], [ya, yb], { ...CL, easing: IO });
  }
  return SCROLL[SCROLL.length - 1][1];
};

const TABS = ["Board", "Asset", "Lookahead", "Divergence", "Wallet", "Guard", "API"];

const Page: React.FC<{ f: number }> = ({ f }) => (
  <div style={{ width: 1500, background: C.cream, position: "relative" }}>
    {/* nav */}
    <div style={{ height: 120, display: "flex", alignItems: "center", gap: 20, padding: "0 50px" }}>
      <div style={{ fontFamily: DISPLAY, fontSize: 56, color: C.blue }}>ORYN<span style={{ color: C.red }}>✦</span></div>
      <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, lineHeight: 1.4, textTransform: "uppercase" }}>State-of-the-asset layer<br /><span style={{ opacity: 0.6, textTransform: "none" }}>Is it safe to act on this token right now?</span></div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
        {TABS.map((t, i) => {
          const act = Math.min(6, Math.floor(interpolate(f, [0, 900], [0, 6.99], CL)));
          return <div key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, textTransform: "uppercase", padding: "7px 14px", borderRadius: 99, border: `3px solid ${C.ink}`, background: i === act ? C.blue : C.paper, color: i === act ? "#fff" : C.ink }}>{t}</div>;
        })}
      </div>
    </div>
    {/* time machine */}
    <Block bg={C.yellow} shadow={8} border={4} radius={16} style={{ margin: "0 50px", height: 86, padding: "18px 30px", boxSizing: "border-box" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, display: "flex", justifyContent: "space-between" }}><span>TIME MACHINE · REPLAY ANY MOMENT</span><span>26/10/26 07:59</span></div>
      <div style={{ position: "relative", height: 8, background: C.ink, borderRadius: 9, marginTop: 20 }}><div style={{ width: "46%", height: "100%", background: C.red, borderRadius: 9 }} /></div>
    </Block>
    {/* hero */}
    <div style={{ display: "flex", gap: 40, padding: "50px 50px 0", height: 520, boxSizing: "border-box" }}>
      <Block style={{ flex: 1.1, padding: 40, boxSizing: "border-box" }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 150, lineHeight: 0.92, color: C.blue }}>IS IT<br /><span style={{ WebkitTextStroke: `3px ${C.blue}`, color: "transparent" }}>SAFE</span><br />TO ACT?</div>
        <div style={{ fontFamily: MONO, fontSize: 15, marginTop: 20, maxWidth: 520, lineHeight: 1.5 }}>One verdict per token, per chain. A reason. The evidence. Branch on a single value instead of a pile of fields.</div>
      </Block>
      <Block bg={C.blue} style={{ flex: 0.9, position: "relative", boxSizing: "border-box", padding: 40 }}>
        <div style={{ position: "absolute", right: 30, top: 30, width: 110, height: 110, borderRadius: 99, background: "#f05d8a", display: "grid", placeItems: "center", color: "#fff", fontSize: 56 }}>✦</div>
        <div style={{ position: "absolute", left: 40, bottom: 130, fontFamily: DISPLAY, fontSize: 150, color: "#fff", lineHeight: 1 }}>1<span style={{ fontSize: 60, opacity: 0.8 }}>/15</span></div>
        <div style={{ position: "absolute", left: 44, bottom: 92, fontFamily: MONO, fontSize: 14, color: "#fff", textTransform: "uppercase", letterSpacing: 2 }}>deployments actionable now</div>
        <div style={{ position: "absolute", left: 44, right: 44, bottom: 36 }}><Barcode w={380} h={32} color="#fff" seed="site" /></div>
      </Block>
    </div>
    {/* board */}
    <div style={{ padding: "60px 50px 0" }}>
      <div style={{ fontFamily: MONO, fontSize: 14, color: C.red, letterSpacing: 3 }}>01 ✦ LIVE VERDICTS</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 96, color: C.ink, borderBottom: `4px solid ${C.ink}`, paddingBottom: 6 }}>THE BOARD</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginTop: 36 }}>
        {DEPLOYMENTS.map((d, i) => (<VerdictCard key={i} d={d} w={320} h={330} />))}
      </div>
    </div>
    {/* guard */}
    <div style={{ padding: "70px 50px 0", height: 700, boxSizing: "border-box" }}>
      <div style={{ fontFamily: MONO, fontSize: 14, color: C.red, letterSpacing: 3 }}>05 ✦ TRY THE GUARD</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 96, color: C.ink, borderBottom: `4px solid ${C.ink}`, paddingBottom: 6 }}>THE GUARD</div>
      <div style={{ display: "flex", gap: 36, marginTop: 36 }}>
        <Block style={{ width: 560, padding: 30, boxSizing: "border-box" }}>
          {[["Token", "xTSLA"], ["Chain", "SOL"], ["Action", "Swap"]].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 18 }}>
              <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: 3, textTransform: "uppercase", opacity: 0.6 }}>{k}</div>
              <div style={{ marginTop: 5, border: `3px solid ${C.ink}`, borderRadius: 9, background: "#fff", fontFamily: MONO, fontWeight: 700, fontSize: 24, padding: "8px 14px" }}>{v}</div>
            </div>
          ))}
        </Block>
        <Block bg={C.ink} borderColor={C.ink} shadow={10} style={{ flex: 1, padding: 34, boxSizing: "border-box" }}>
          <div style={{ fontFamily: DISPLAY, fontSize: 130, color: C.red, lineHeight: 1 }}>BLOCKED</div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.red, marginTop: 16 }}>DIVERGENT · Stock split 3:1 not applied on Solana</div>
          <div style={{ fontFamily: MONO, fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>Unknown means not actionable.</div>
        </Block>
      </div>
    </div>
    <div style={{ height: 110, fontFamily: MONO, fontSize: 13, textAlign: "center", opacity: 0.55, paddingTop: 30 }}>ORYN © 2026 · MVP · Simulated issuer data · Not investment advice</div>
  </div>
);

const CALLOUTS: { at: number; text: string; x: number; y: number; rot: number; bg: string; fg: string }[] = [
  { at: 40, text: "One verdict per token, per chain", x: 1180, y: 120, rot: 3, bg: C.yellow, fg: C.ink },
  { at: 300, text: "Every deployment, one board", x: 1240, y: 210, rot: -3, bg: C.blue, fg: "#fff" },
  { at: 540, text: "Replay any moment", x: 1260, y: 160, rot: 2, bg: C.red, fg: "#fff" },
  { at: 790, text: "Unknown means not actionable", x: 1130, y: 150, rot: -2, bg: C.ink, fg: C.cream },
];

/**
 * ORYN website / SaaS animation — 1920x1080 @ 60 fps, 15 s (900 frames).
 * A fully code-built Oryn page glides through each section inside a tilted
 * browser window with a live cursor and pop-in callouts. Copy and verdict data
 * are verbatim from the Oryn board (simulated issuer data).
 */
export const OrynSite: React.FC = () => {
  const f = useCurrentFrame();
  const y = scrollAt(f);
  const intro = ez(f, 0, 70);
  const tiltY = interpolate(f, [0, 900], [-8, 6], { ...CL, easing: IO });
  const tiltX = interpolate(f, [0, 900], [5, 1], { ...CL, easing: IO });
  const zoom = interpolate(f, [0, 900], [0.95, 1.03], { ...CL, easing: IO });
  const cx = interpolate(f, [0, 150, 270, 520, 640, 780, 900], [1200, 1000, 800, 1100, 700, 600, 800], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const cy = interpolate(f, [0, 150, 270, 520, 640, 780, 900], [700, 480, 540, 460, 520, 380, 420], { ...CL, easing: Easing.inOut(Easing.cubic) });
  const click = [300, 560, 800].some((k) => f >= k && f < k + 14);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Stage>
        <Paper bloom={1} x={55} y={50} />
        <div style={{ position: "absolute", left: 60, top: 40, opacity: intro }}><Badge size={96} /></div>
        <div style={{ position: "absolute", left: 210, top: 62, opacity: intro, fontFamily: DISPLAY, fontSize: 54, color: C.blue, letterSpacing: 2 }}>STATE OF ASSETS ACTIVATED</div>
        <div style={{ position: "absolute", left: 210, top: 98, fontFamily: MONO, fontSize: 14, letterSpacing: 4, opacity: intro, textTransform: "uppercase" }}>oryn · the state-of-the-asset layer</div>
        <div style={{ position: "absolute", left: 210, top: 185, width: 1500, height: 840, opacity: intro, transform: `translateY(${(1 - intro) * 160}px) perspective(2400px) rotateY(${tiltY}deg) rotateX(${tiltX}deg) scale(${zoom})`, transformOrigin: "50% 40%" }}>
          <Block radius={26} shadow={20} border={6} bg={C.cream} style={{ width: 1500, height: 840, overflow: "hidden", position: "relative" }}>
            <div style={{ height: 38, background: C.ink, display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
              {[C.red, C.yellow, C.green].map((c) => (<div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />))}
            </div>
            <div style={{ transform: `translateY(${-y}px)` }}><Page f={f} /></div>
            <div style={{ position: "absolute", left: cx - 210, top: cy - 185, width: 26, height: 26, borderRadius: 99, background: C.ink, border: "3px solid #fff", transform: `scale(${click ? 0.7 : 1})`, boxShadow: click ? `0 0 0 18px rgba(38,48,200,0.25)` : "none" }} />
          </Block>
        </div>
        {CALLOUTS.map((c) => {
          const p = pop(f, c.at, 26);
          const out = ez(f, c.at + 190, 20);
          return (
            <div key={c.text} style={{ position: "absolute", left: c.x, top: c.y, opacity: p * (1 - out), transform: `scale(${p}) rotate(${c.rot}deg)`, background: c.bg, color: c.fg, border: `4px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, borderRadius: 14, padding: "12px 22px", fontFamily: DISPLAY, fontSize: 40, letterSpacing: 1, textTransform: "uppercase", maxWidth: 560 }}>{c.text}</div>
          );
        })}
        <div style={{ position: "absolute", right: 70, top: 62 }}><Chip status="open" size={20} style={{ opacity: ez(f, 60, 30) }} /></div>
        <VerdictsTicker f={f} />
      </Stage>
      <Audio src={staticFile("oryn/audio/mix.wav")} trimAfter={900} volume={(fr) => interpolate(fr, [840, 900], [1, 0], CL)} />
    </AbsoluteFill>
  );
};

/** Scrolling verdict ticker along the bottom edge. */
const VerdictsTicker: React.FC<{ f: number }> = ({ f }) => {
  const items = [...DEPLOYMENTS, ...DEPLOYMENTS];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 44, background: C.ink, overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 46, whiteSpace: "nowrap", transform: `translateX(${-f * 2.2}px)`, paddingLeft: 40 }}>
        {items.map((d, i) => (
          <span key={i} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 18, color: d.status === "divergent" ? C.red : d.status === "pending" ? C.yellow : C.cream, letterSpacing: 1.5 }}>
            {d.sym}·{d.chain} {VERDICTS[d.status].glyph} {VERDICTS[d.status].label.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
};
