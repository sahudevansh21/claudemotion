import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { CL } from "../Collatera/brand";
import { Mascot, MASCOT_CELLS } from "../Collatera/components/Mascot";
import {
  Browser,
  Corners,
  ez,
  GlitchText,
  IN,
  INK,
  IO,
  Label,
  lerp,
  MONO,
  NeonWaves,
  Night,
  Paper,
  PIX,
  Rays,
  SANS,
  useSec,
} from "./Kit";

/* ───────────── 1. Hook: "YOUR ORACLE / SAYS FINE. / IT'S STALE." ───────────── */
export const Hook: React.FC = () => {
  const t = useSec();
  const shake = t > 1.5 && t < 1.75 ? Math.sin(t * 190) * (1.75 - t) * 40 : 0;
  const zoom = 1 + t * 0.03;
  const words: [string, number, number | undefined, number][] = [
    ["YOUR ORACLE", 0.02, 0.68, 150],
    ["SAYS FINE.", 0.75, 1.43, 150],
    ["IT'S STALE.", 1.5, undefined, 200],
  ];
  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill style={{ transform: `translateX(${shake}px) scale(${zoom})` }}>
        {words.map(([w, at, out, size]) => (
          <AbsoluteFill key={w} style={{ justifyContent: "center", alignItems: "center" }}>
            <GlitchText text={w} at={at} out={out} size={size} />
          </AbsoluteFill>
        ))}
        {/* lime underline slam on "STALE" */}
        <div
          style={{
            position: "absolute",
            left: 960 - 560,
            top: 660,
            height: 18,
            width: 1120 * ez(t, 1.62, 1.95),
            background: CL.lime,
          }}
        />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 300 + random(`hd${i}`) * 1320,
              top: 300 + random(`hdy${i}`) * 480,
              width: 7,
              height: 7,
              background: INK,
              opacity: 0.5 * ez(t, 0.1 + i * 0.05, 0.4 + i * 0.05),
            }}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 2. Browser: the real site, floating ───────────── */
export const BrowserShot: React.FC = () => {
  const t = useSec();
  const p = ez(t, 0, 0.7);
  const drift = ez(t, 0, 1.5, IO);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", top: 96, width: 1920, display: "flex", justifyContent: "center" }}>
        <GlitchText text="It's time to watch the oracle." at={0.08} size={46} font={SANS} weight={600} />
      </div>
      <AbsoluteFill style={{ perspective: 2200, justifyContent: "center", alignItems: "center", paddingTop: 110 }}>
        <div
          style={{
            transform: `translateY(${(1 - p) * 260}px) rotateX(${lerp(p, 32, 4) - drift * 4}deg) rotateY(${lerp(drift, -3, 3)}deg) scale(${lerp(p, 0.82, 0.96) + drift * 0.04})`,
            opacity: Math.min(1, p * 3),
          }}
        >
          <Browser clip="hero" width={1240} rate={1.4} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 3. Introducing COLLATERA ───────────── */
export const Intro: React.FC = () => {
  const t = useSec();
  const box = ez(t, 0.05, 0.5);
  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill style={{ transform: `scale(${1 + t * 0.035})` }}>
        <div style={{ position: "absolute", left: 300, top: 352 }}>
          {t > 0.05 && t < 1.28 ? (
            <div style={{ opacity: ez(t, 0.05, 0.3) }}>
              <Label text="Introducing" size={34} />
            </div>
          ) : null}
        </div>
        <div style={{ position: "absolute", left: 300, top: 470 }}>
          <GlitchText text="COLLATERA" at={0.18} out={1.28} size={176} dur={0.5} />
        </div>
        <Corners
          x={lerp(box, 900, 260)}
          y={lerp(box, 560, 430)}
          w={lerp(box, 120, 1400)}
          h={lerp(box, 20, 270)}
          opacity={box * (1 - ez(t, 1.25, 1.4))}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 4. Terminal (rebuilt from the site, crisp at 4K) ───────────── */
const CANDLES = Array.from({ length: 34 }, (_, i) => {
  const base = 452 + i * 0.95 + Math.sin(i * 0.7) * 3;
  const o = base + (random(`co${i}`) - 0.5) * 4;
  const c = base + (random(`cc${i}`) - 0.35) * 5;
  return { o, c, h: Math.max(o, c) + random(`ch${i}`) * 3, l: Math.min(o, c) - random(`cl${i}`) * 3 };
});
const TICKER = [
  ["tQQQ", "478.20", "▲ 0.08%", true],
  ["tTSLA", "262.66", "▲ 0.10%", true],
  ["tSPY", "528.98", "▼ 0.50%", false],
  ["tAAPL", "229.65", "▲ 1.10%", true],
  ["tNVDA", "142.65", "▲ 0.66%", true],
] as const;
const ASKS = [["486.21", 92], ["486.10", 58], ["485.99", 108], ["485.88", 71], ["485.77", 124]] as const;
const BIDS = [["485.61", 108], ["485.50", 66], ["485.39", 119], ["485.28", 77], ["485.17", 39]] as const;

export const Terminal: React.FC<{ t: number }> = ({ t }) => {
  const W = 1360;
  const shown = Math.floor(ez(t, 0.35, 1.6, IO) * CANDLES.length);
  const price = 485.69 + Math.sin(t * 9) * 0.06 + Math.floor(t * 8) * 0.01;
  const blink = Math.floor(t * 4) % 2 === 0;
  const y = (v: number) => 360 - ((v - 440) / 60) * 300;
  const tick = (t * 140) % 900;
  return (
    <div
      style={{
        width: W,
        background: "#00241A",
        border: `2px solid ${CL.line}`,
        boxShadow: `14px 14px 0 ${CL.shadow}, 0 50px 120px rgba(0,0,0,0.5)`,
        fontFamily: MONO,
        color: CL.mint,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: `2px solid ${CL.line}`, fontFamily: PIX, fontSize: 22 }}>
        {[CL.lime, CL.sage, CL.sage].map((c, i) => (
          <div key={i} style={{ width: 13, height: 13, background: c }} />
        ))}
        <span style={{ marginLeft: 10 }}>COLLATERA://TERMINAL</span>
        <span style={{ marginLeft: "auto", color: blink ? CL.lime : CL.sage }}>● ORACLE STALE</span>
      </div>
      <div style={{ overflow: "hidden", whiteSpace: "nowrap", borderBottom: `2px solid ${CL.line}`, padding: "10px 0", fontSize: 19 }}>
        <div style={{ transform: `translateX(${-tick}px)`, display: "inline-flex", gap: 46 }}>
          {[...TICKER, ...TICKER, ...TICKER].map(([s, p, ch, up], i) => (
            <span key={i}>
              <span style={{ color: CL.lime }}>{s}</span> {p}{" "}
              <span style={{ color: up ? CL.lime : "#FF6B5A" }}>{ch}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "20px 24px", borderRight: `2px solid ${CL.line}` }}>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: PIX, fontSize: 32, color: CL.lime }}>tQQQ / USDCa</div>
              <div style={{ fontSize: 17, color: CL.sage, marginTop: 4 }}>Tokenized Nasdaq-100 ETF</div>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: PIX, fontSize: 52 }}>
              {price.toFixed(2)} <span style={{ fontSize: 22, color: CL.lime }}>▲ 3.43%</span>
            </div>
          </div>
          <svg width={900} height={380} style={{ marginTop: 14, display: "block", background: "#001C14", border: `1px solid ${CL.line}` }}>
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={0} x2={900} y1={60 + i * 90} y2={60 + i * 90} stroke={`${CL.line}66`} />
            ))}
            <line x1={0} x2={900 * ez(t, 0.9, 1.6)} y1={y(446)} y2={y(446)} stroke="#FF6B5A" strokeWidth={2} strokeDasharray="8 6" />
            {CANDLES.slice(0, shown).map((c, i) => {
              const x = 20 + i * 25.5;
              const up = c.c >= c.o;
              return (
                <g key={i}>
                  <line x1={x + 6} x2={x + 6} y1={y(c.h)} y2={y(c.l)} stroke={up ? CL.lime : CL.sage} strokeWidth={2} />
                  <rect x={x} y={y(Math.max(c.o, c.c))} width={12} height={Math.max(4, Math.abs(y(c.o) - y(c.c)))} fill={up ? CL.lime : CL.sage} />
                </g>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 30, marginTop: 12, fontSize: 17 }}>
            <span><span style={{ color: "#FF6B5A" }}>━</span> Liquidation 412.50</span>
            <span><span style={{ color: CL.lime }}>━</span> Last {price.toFixed(2)}</span>
            <span style={{ marginLeft: "auto", color: CL.sage }}>SIMULATED DATA</span>
          </div>
        </div>
        <div style={{ width: 360, padding: "20px 22px", fontSize: 18 }}>
          <div style={{ fontFamily: PIX, color: CL.lime, fontSize: 20, marginBottom: 12 }}>Order book</div>
          {ASKS.map(([p, q], i) => (
            <div key={p} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "5px 8px", opacity: ez(t, 0.3 + i * 0.05, 0.6 + i * 0.05) }}>
              <div style={{ position: "absolute", right: 0, top: 2, bottom: 2, width: `${(q / 130) * 100 * ez(t, 0.3 + i * 0.05, 0.9)}%`, background: "rgba(255,107,90,0.22)" }} />
              <span style={{ color: "#FF8A7A", position: "relative" }}>{p}</span>
              <span style={{ position: "relative" }}>{q}</span>
            </div>
          ))}
          <div style={{ textAlign: "center", fontFamily: PIX, fontSize: 24, padding: "10px 0" }}>{price.toFixed(2)}</div>
          {BIDS.map(([p, q], i) => (
            <div key={p} style={{ position: "relative", display: "flex", justifyContent: "space-between", padding: "5px 8px", opacity: ez(t, 0.55 + i * 0.05, 0.85 + i * 0.05) }}>
              <div style={{ position: "absolute", right: 0, top: 2, bottom: 2, width: `${(q / 130) * 100 * ez(t, 0.55 + i * 0.05, 1.1)}%`, background: "rgba(117,255,0,0.22)" }} />
              <span style={{ color: CL.lime, position: "relative" }}>{p}</span>
              <span style={{ position: "relative" }}>{q}</span>
            </div>
          ))}
          <div style={{ fontFamily: PIX, color: CL.lime, fontSize: 20, margin: "18px 0 10px" }}>Position health</div>
          <div style={{ height: 16, background: "#00140E", border: `1px solid ${CL.line}` }}>
            <div style={{ height: "100%", width: `${lerp(ez(t, 0.8, 1.8), 0, 64)}%`, background: CL.lime }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TerminalShot: React.FC = () => {
  const t = useSec();
  const p = ez(t, 0, 1.0);
  const cam = ez(t, 0.2, 2.5, IO);
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: "absolute", left: 140, top: 92 }}>
        <div style={{ fontFamily: PIX, fontSize: 20, color: CL.lime, opacity: ez(t, 0.05, 0.3), marginBottom: 14 }}>
          LIVE VIEW / SIMULATED DATA
        </div>
        <GlitchText text="WATCH THE PRICE." at={0.05} size={68} color={CL.mint} />
        <GlitchText text="WATCH THE ORACLE." at={0.3} size={68} color={CL.lime} />
      </div>
      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: 280,
            top: 300,
            transformOrigin: "50% 30%",
            transform: `translateY(${(1 - p) * 500}px) rotateX(${lerp(p, 38, 12) - cam * 8}deg) rotateY(${lerp(cam, -14, 6)}deg) rotateZ(${lerp(cam, 2, -1)}deg) scale(${lerp(p, 0.88, 0.96) + cam * 0.1})`,
          }}
        >
          <Terminal t={t} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 5. Lending stack ───────────── */
const VENUES = [
  ["Aave", "Lending market", "#B6509E"],
  ["Euler", "Lending vaults", "#E7473C"],
  ["Morpho", "Lending network", "#2470FF"],
  ["Sentora", "Vault curator", "#5B47FF"],
] as const;

export const Lending: React.FC = () => {
  const t = useSec();
  const p = ez(t, 0, 0.6);
  const cam = ez(t, 0, 1.5, IO);
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: "absolute", left: 110, top: 170, width: 700 }}>
        <div style={{ fontFamily: PIX, fontSize: 20, color: CL.lime, marginBottom: 16, opacity: ez(t, 0, 0.2) }}>
          ECOSYSTEM / WHERE THE COLLATERAL LIVES
        </div>
        <GlitchText text={"BUILT AROUND\nTHE LENDING\nSTACK."} at={0.02} size={64} color={CL.mint} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 44 }}>
          {VENUES.map(([n, r, c], i) => {
            const q = ez(t, 0.25 + i * 0.15, 0.6 + i * 0.15);
            return (
              <div
                key={n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 18px",
                  background: CL.evergreen,
                  border: `2px solid ${i === 0 ? CL.lime : CL.line}`,
                  boxShadow: `8px 8px 0 ${CL.shadow}`,
                  opacity: q,
                  transform: `translateY(${(1 - q) * 40}px) scale(${0.9 + q * 0.1})`,
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: c }} />
                <div>
                  <div style={{ fontFamily: PIX, fontSize: 28, color: CL.mint }}>{n}</div>
                  <div style={{ fontFamily: MONO, fontSize: 16, color: CL.sage }}>{r}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 15, color: CL.sage, marginTop: 22, opacity: ez(t, 0.8, 1.0) * 0.8 }}>
          Ecosystem coverage targets. Not affiliated with these projects.
        </div>
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: 930,
            top: 250,
            transformOrigin: "0% 50%",
            transform: `translateX(${(1 - p) * 700}px) rotateY(${lerp(cam, -30, -18)}deg) rotateX(${lerp(cam, 6, 2)}deg) scale(${lerp(cam, 0.95, 1.05)})`,
          }}
        >
          <Browser clip="lending" width={1100} rate={1.6} dark />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 6. Wall of screens ───────────── */
export const Wall: React.FC = () => {
  const t = useSec();
  const cam = ez(t, 0, 1.5, IO);
  const cols = 7;
  const rows = 6;
  const tw = 520;
  const th = Math.round((tw * 418) / 772);
  const txt = ez(t, 0.35, 0.75);
  return (
    <AbsoluteFill>
      <Night glow={0.5} />
      <AbsoluteFill style={{ perspective: 1800, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: `translate(-50%, -50%) rotateX(52deg) rotateZ(-28deg) translate(${lerp(cam, -420, 260)}px, ${lerp(cam, 300, -260)}px) scale(${lerp(cam, 1.25, 1.0)})`,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${tw}px)`,
            gap: 34,
          }}
        >
          {Array.from({ length: cols * rows }, (_, i) => {
            const s = (i * 7) % 18;
            const pop = ez(t, random(`w${i}`) * 0.18, random(`w${i}`) * 0.18 + 0.3);
            return (
              <div
                key={i}
                style={{
                  width: tw,
                  height: th,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${CL.line}`,
                  boxShadow: "0 30px 50px rgba(0,0,0,0.45)",
                  opacity: pop,
                  transform: `translateZ(${(1 - pop) * -260}px)`,
                }}
              >
                <Img src={staticFile(`collatera-launch/stills/s${s + 1}.jpg`)} style={{ width: tw, height: th, display: "block" }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(0,42,31,${0.75 * txt}) 0%, rgba(0,42,31,${0.35 * txt}) 45%, transparent 75%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <GlitchText text="ONE FOCUSED VIEW." at={0.35} size={110} color={CL.mint} />
        <div style={{ height: 18 }} />
        <GlitchText text="Read-only monitoring for tokenized stocks & ETFs." at={0.6} size={36} font={MONO} weight={500} color={CL.lime} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 7. Know what backs your position ───────────── */
const CARDS = [
  ["01 / BUFFER", "COLLATERAL HEALTH", "Understand the distance between your position and its liquidation threshold."],
  ["02 / PRICE", "FRESHNESS CHECKS", "Spot stale oracle prices, issuer events, and changing market conditions."],
  ["03 / CLOSED MARKETS", "LIQUIDITY RISK", "Account for closed exchanges, overnight gaps, and thinner liquidity."],
] as const;

export const Backs: React.FC = () => {
  const t = useSec();
  const cam = ez(t, 0, 1.5, IO);
  return (
    <AbsoluteFill>
      <Night />
      <div style={{ position: "absolute", left: 140, top: 120 }}>
        <div style={{ fontFamily: PIX, fontSize: 20, color: CL.lime, marginBottom: 16, opacity: ez(t, 0, 0.2) }}>
          ONE FOCUSED VIEW / FIRST RELEASE
        </div>
        <GlitchText text="KNOW WHAT BACKS" at={0.02} size={84} color={CL.mint} />
        <GlitchText text="YOUR POSITION." at={0.12} size={84} color={CL.lime} />
      </div>
      <AbsoluteFill style={{ perspective: 2000 }}>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 470,
            display: "flex",
            gap: 30,
            transform: `rotateY(${lerp(cam, 10, -6)}deg) rotateX(${lerp(cam, 8, 2)}deg) translateX(${lerp(cam, 30, -10)}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {CARDS.map(([k, h, d], i) => {
            const q = ez(t, 0.2 + i * 0.25, 0.7 + i * 0.25);
            const lit = t > 0.2 + i * 0.25 && t < 0.75 + i * 0.25;
            return (
              <div
                key={k}
                style={{
                  width: 520,
                  height: 380,
                  padding: "36px 34px",
                  boxSizing: "border-box",
                  background: CL.evergreen,
                  border: `2px solid ${lit ? CL.lime : CL.line}`,
                  boxShadow: `12px 12px 0 ${CL.shadow}${lit ? `, 0 0 60px rgba(117,255,0,0.25)` : ""}`,
                  transformOrigin: "50% 100%",
                  transform: `rotateX(${(1 - q) * -80}deg) translateY(${(1 - q) * 80}px)`,
                  opacity: Math.min(1, q * 2),
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontFamily: PIX, fontSize: 18, color: CL.lime }}>{k}</div>
                <div style={{ fontFamily: PIX, fontSize: 34, color: CL.mint, marginTop: 40 }}>{h}</div>
                <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.45, color: CL.sage, marginTop: 20 }}>{d}</div>
                <div style={{ position: "absolute", right: 0, bottom: 0, width: 0, height: 0, borderLeft: "48px solid transparent", borderBottom: `48px solid ${CL.line}` }} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 8. Monitor any address (rays) ───────────── */
export const Monitor: React.FC = () => {
  const t = useSec();
  const p = ez(t, 0, 0.7);
  const cam = ez(t, 0, 2.0, IO);
  return (
    <AbsoluteFill>
      <Night glow={0.4} />
      <Rays strength={ez(t, 0, 0.5) * (0.85 + Math.sin(t * 6) * 0.1)} />
      <AbsoluteFill style={{ perspective: 2200, justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            marginTop: -60,
            transform: `scale(${lerp(p, 0.5, 0.78) + cam * 0.06}) rotateX(${lerp(p, 45, 6)}deg) rotateY(${lerp(cam, -6, 6)}deg)`,
            opacity: Math.min(1, p * 2.5),
          }}
        >
          <Browser clip="monitor" width={1500} rate={1.15} dark />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 110, width: 1920, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <GlitchText text="PASTE ANY ADDRESS. WATCH IT." at={0.35} size={56} color={CL.mint} />
        <GlitchText text="Read-only. No keys. No signatures." at={0.6} size={30} font={MONO} weight={500} color={CL.lime} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 9. Four steps on neon waves ───────────── */
const STEPS = [
  ["MONITOR", "See positions and collateral buffers in one dashboard."],
  ["STRESS TEST", "Explore price drops, stale feeds, and overnight gaps."],
  ["GET ALERTS", "Learn what changed, why it matters, and what to review."],
  ["PREVIEW REPAYMENT", "Review before-and-after impact. You confirm it yourself."],
] as const;

export const Steps: React.FC = () => {
  const t = useSec();
  return (
    <AbsoluteFill>
      <Night glow={0.3} />
      <NeonWaves reveal={ez(t, 0, 0.9, IO)} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,42,31,0.92) 0%, rgba(0,42,31,0.55) 45%, rgba(0,42,31,0.85) 100%)" }} />
      <div style={{ position: "absolute", left: 110, top: 360 }}>
        <div style={{ fontFamily: PIX, fontSize: 20, color: CL.lime, marginBottom: 16, opacity: ez(t, 0, 0.2) }}>
          SEE IT / UNDERSTAND IT / DECIDE
        </div>
        <GlitchText text="KNOW WHAT" at={0.02} size={64} color={CL.mint} />
        <GlitchText text="CHANGED BEFORE" at={0.1} size={64} color={CL.mint} />
        <GlitchText text="YOU ACT." at={0.18} size={64} color={CL.lime} />
      </div>
      <div style={{ position: "absolute", left: 1040, top: 200, width: 780 }}>
        {STEPS.map(([h, d], i) => {
          const at = 0.25 + i * 0.5;
          const q = ez(t, at, at + 0.35);
          const active = t >= at && t < at + 0.5;
          return (
            <div
              key={h}
              style={{
                display: "flex",
                gap: 26,
                padding: "26px 0",
                borderTop: `2px solid ${active ? CL.lime : CL.line}`,
                opacity: 0.25 + q * 0.75,
                transform: `translateX(${(1 - q) * 60}px)`,
              }}
            >
              <div style={{ fontFamily: PIX, fontSize: 28, color: CL.lime, width: 60 }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: PIX, fontSize: 38, color: active ? CL.lime : CL.mint }}>{h}</div>
                <div style={{ fontFamily: MONO, fontSize: 24, color: CL.sage, marginTop: 8 }}>{d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 10. End card: stacked lines on paper ───────────── */
export const End: React.FC = () => {
  const t = useSec();
  const lines: [string, number][] = [
    ["Catch stale oracles", 0.05],
    ["before", 0.45],
    ["they catch you.", 0.85],
  ];
  const n = lines.filter(([, at]) => t >= at).length;
  const h = 140 + Math.max(0, n - 1) * 128 * ez(t, lines[Math.max(0, n - 1)][1], lines[Math.max(0, n - 1)][1] + 0.3) + (n > 1 ? (n - 2) * 128 : 0);
  const exit = ez(t, 1.8, 2.0, IN);
  return (
    <AbsoluteFill>
      <Paper />
      <AbsoluteFill style={{ transform: `scale(${1 + t * 0.02})`, opacity: 1 - exit, filter: `blur(${exit * 20}px)` }}>
        <div style={{ position: "absolute", left: 250, top: 270 }}>
          <div style={{ opacity: ez(t, 0, 0.25), marginBottom: 26 }}>
            <Label text="COLLATERA" size={30} />
          </div>
          {lines.map(([l, at]) => (
            <div key={l} style={{ height: 128 }}>
              <GlitchText text={l} at={at} size={104} color={INK} />
            </div>
          ))}
          <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 32, color: "#3B6B55", opacity: ez(t, 1.25, 1.5) }}>
            collatera.buzz
          </div>
        </div>
        <Corners x={226} y={340} w={1440} h={h} opacity={ez(t, 0.05, 0.3)} />
        <div style={{ position: "absolute", left: 250, top: 340 + 128 * 2 + 112, height: 12, width: 980 * ez(t, 1.0, 1.35), background: CL.lime, opacity: 0.9 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────────── 11. Logo: pixel noise → mascot ───────────── */
export const Logo: React.FC = () => {
  const t = useSec();
  const cols = 48;
  const rows = 27;
  const cell = 40;
  const clear = ez(t, 0.05, 0.9, IO);
  const noise: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = Math.hypot(c - cols / 2, (r - rows / 2) * 1.6) / (cols / 2);
      const flick = random(`n${r}-${c}-${Math.floor(t * 30)}`);
      const keep = d > clear * 1.3 + 0.05 && flick > 0.62;
      if (keep) {
        noise.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell - 2} height={cell - 2} fill={flick > 0.9 ? CL.lime : CL.panel} opacity={0.35 + flick * 0.4} />,
        );
      }
    }
  }
  const slice = t < 0.18 ? Math.sin(t * 160) * 60 : 0;
  const glow = ez(t, 0.4, 1.0);
  const fade = ez(t, 1.38, 1.5, IN);
  return (
    <AbsoluteFill style={{ background: CL.night }}>
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `translateX(${slice}px)` }} shapeRendering="crispEdges">
        {noise}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, rgba(117,255,0,${0.22 * glow}) 0%, transparent 40%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", transform: `scale(${1 + t * 0.04})` }}>
        <Mascot
          cell={30}
          scatter={900}
          cellProgress={(i) => ez(t, 0.08 + (i / MASCOT_CELLS.length) * 0.35, 0.38 + (i / MASCOT_CELLS.length) * 0.35)}
        />
        <div style={{ height: 50 }} />
        <GlitchText text="COLLATERA" at={0.6} size={96} color={CL.mint} />
        <div style={{ height: 18 }} />
        <div style={{ fontFamily: MONO, fontSize: 30, color: CL.lime, opacity: ez(t, 0.85, 1.05) }}>
          @collatera_io · collatera.buzz
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#000", opacity: fade }} />
    </AbsoluteFill>
  );
};

