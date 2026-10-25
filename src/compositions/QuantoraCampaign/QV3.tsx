import { AbsoluteFill, random } from "remotion";
import { Corners, ez, IO, lerp, Letters, PixelDissolve, Swap, useT } from "../CollateraCampaign/kit";
import { Chart, Mark, Mono, Paper, Q, QMONO, SERIF, VFilm, VH, VW, WORD } from "./qkit";
import TL from "./qv3.json";

/**
 * QV3 · "Your thesis is… tested" (Quantora plan Day 6). 1080×1920 · 60 fps · 20 s.
 * Locked Conqueror reference (ANALYSIS.md §3), vertical: name cycler in crop
 * marks over a soft blob, pixel dissolve into a halftone plate with a giant
 * wordmark, extreme zoom into a typed question, phrase swap "Your thesis is…",
 * phone mockup with an ILLUSTRATIVE SIMULATION fan chart, end type-on.
 * Simulations are never shown as forecasts.
 */
const Halftone: React.FC<{ drift?: number }> = ({ drift = 0 }) => (
  <AbsoluteFill style={{ background: "#D9D3C6" }}>
    <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(22,21,20,0.55) 2.2px, transparent 2.6px)", backgroundSize: "11px 11px", backgroundPosition: `${drift}px 0`, WebkitMaskImage: "linear-gradient(170deg, #000 0%, rgba(0,0,0,0.2) 55%, #000 100%)", maskImage: "linear-gradient(170deg, #000 0%, rgba(0,0,0,0.2) 55%, #000 100%)" }} />
  </AbsoluteFill>
);
const Wordmark: React.FC = () => <div style={{ position: "absolute", left: 0, top: 860, width: VW, textAlign: "center", fontFamily: WORD, fontSize: 150, letterSpacing: 26, color: "rgba(22,21,20,0.88)" }}>QUANTORA</div>;

const Blob: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#3A3732", overflow: "hidden" }}>
      {[
        ["#161514", 380, 760, 520],
        ["#8F8A80", 720, 1200, 600],
        ["#B8B0A2", 520, 1000, 460],
      ].map(([c, x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) + Math.sin(t * 0.9 + i) * 70 - (r as number) / 2, top: (y as number) + Math.cos(t * 0.7 + i * 2) * 60 - (r as number) / 2, width: r as number, height: r as number, borderRadius: "50%", background: c as string, filter: "blur(120px)", opacity: 0.8 }} />
      ))}
    </AbsoluteFill>
  );
};

const Intro: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Halftone drift={t * 20} />
      <Wordmark />
      <AbsoluteFill style={{ opacity: t < 3.3 ? 1 : 0 }}>
        <Blob />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 10, fontFamily: SERIF, fontSize: 54, color: "#FFFFFF", textShadow: "0 2px 18px rgba(0,0,0,0.35)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            Introducing
            <span style={{ background: Q.paper, borderRadius: 10, padding: 6, display: "inline-flex" }}>
              <Mark size={40} />
            </span>
            Quantora
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            for
            <span style={{ fontStyle: "italic" }}>
              <Swap items={["tokenized stocks", "ETFs", "onchain markets"]} times={[0, 0.9, 1.7]} color="#FFFFFF" minWidth={420} />
            </span>
          </div>
        </AbsoluteFill>
        <Corners x={110} y={860} w={860} h={200} color="#FFFFFF" />
      </AbsoluteFill>
      {t >= 3.3 && t < 4.0 ? <PixelDissolve at={3.3} dur={0.6} cols={18} color="#8F8A80" w={VW} h={VH} /> : null}
    </AbsoluteFill>
  );
};

const Input: React.FC = () => {
  const t = useT();
  const s = "What if the market gaps 10% overnight?";
  const n = Math.max(0, Math.min(s.length, Math.floor((t - 0.5) * 22)));
  const zIn = ez(t, 1.6, 2.2, IO);
  const zOut = ez(t, 2.4, 2.95, IO);
  const z = 1 + (zIn - zOut) * 4.5;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Halftone drift={t * 20 + 60} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "760px 1250px" }}>
        <Wordmark />
        <div style={{ position: "absolute", top: 640, width: VW, textAlign: "center", fontFamily: SERIF, fontSize: 64, color: Q.ink }}>
          <Letters text="Start with a question" at={0.05} step={0.02} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 1110, width: 900, minHeight: 200, borderRadius: 22, background: "rgba(255,253,247,0.85)", boxShadow: "0 20px 50px rgba(0,0,0,0.18)", padding: "34px 36px", boxSizing: "border-box", fontFamily: SERIF, fontSize: 50, lineHeight: 1.25, color: Q.ink }}>
          {n === 0 ? <span style={{ color: Q.faint }}>Ask a market question…</span> : s.slice(0, n)}
          <span style={{ display: "inline-block", width: 3, height: 52, background: Q.ink, marginLeft: 4, verticalAlign: "middle", opacity: Math.floor(t * 2.4) % 2 ? 1 : 0.2 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Deterministic simulated paths from one start (ILLUSTRATIVE). */
const PATHS = Array.from({ length: 28 }, (_, k) => {
  const ys: number[] = [0];
  for (let i = 1; i < 40; i++) ys.push(ys[i - 1] + (random(`sp${k}-${i}`) - 0.5) * 0.12 + (i === 22 ? (random(`gap${k}`) - 0.6) * 0.5 : 0));
  return ys;
});
const Fan: React.FC<{ w: number; h: number; p: number; light?: boolean }> = ({ w, h, p, light }) => {
  const shown = Math.max(2, Math.floor(p * 40));
  const col = light ? Q.paper : Q.ink;
  const y = (v: number) => h / 2 - v * h * 0.55;
  const band = Array.from({ length: shown }, (_, i) => {
    const vals = PATHS.map((ps) => ps[i]).sort((a, b) => a - b);
    return [vals[3], vals[24]];
  });
  const x = (i: number) => (i / 39) * w;
  return (
    <svg width={w} height={h}>
      <polygon points={[...band.map(([lo], i) => `${x(i)},${y(lo)}`), ...band.map(([, hi], i) => `${x(i)},${y(hi)}`).reverse()].join(" ")} fill={col} opacity={0.12} />
      {PATHS.map((ps, k) => (
        <polyline key={k} points={ps.slice(0, shown).map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke={col} strokeWidth={1.3} opacity={0.45} />
      ))}
      <line x1={x(22)} x2={x(22)} y1={0} y2={h} stroke={col} strokeDasharray="3 6" opacity={0.6} />
    </svg>
  );
};

const Phrase: React.FC = () => {
  const t = useT();
  const times = [0.6, 1.8, 3.2, 4.6];
  const stage = times.filter((x) => t >= x).length - 1;
  const v = (k: number) => (stage === k ? ez(t, times[k], times[k] + 0.4) : 0);
  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <div style={{ position: "absolute", top: 520, width: VW, display: "flex", justifyContent: "center", transform: "scale(1.45)", transformOrigin: "50% 60%" }}>
        <div style={{ position: "relative", width: 560, height: 320 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity: v(0) }}>
            <div style={{ width: 220, height: 220, borderRadius: 999, border: `3px solid ${Q.ink}`, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: SERIF, fontSize: 150, fontStyle: "italic" }}>?</div>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: v(1) }}>
            <svg width={560} height={320}>
              <polyline points="0,220 70,200 140,230 210,160 280,180 350,110 420,140 490,70 560,90" fill="none" stroke={Q.ink} strokeWidth={4} />
            </svg>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: v(2) }}>
            <Fan w={560} h={320} p={ez(t, 3.2, 4.4)} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: v(3), paddingTop: 30 }}>
            <Chart w={560} h={270} stroke={3} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 980, width: VW, textAlign: "center", fontFamily: SERIF, fontWeight: 500, fontSize: 90, letterSpacing: -2, color: Q.ink, opacity: ez(t, 0.4, 0.8) }}>
        <div>Your thesis is…</div>
        <div style={{ position: "relative", height: 110, fontStyle: "italic", fontWeight: 400 }}>
          {["a hunch.", "a chart.", "simulated.", "evidence."].map((w, i) => {
            const a = ez(t, times[i] - 0.05, times[i] + 0.3);
            const b = i < 3 ? ez(t, times[i + 1] - 0.12, times[i + 1] + 0.1) : 0;
            const o = a * (1 - b);
            return (
              <div key={w} style={{ position: "absolute", left: 0, right: 0, top: 0, textAlign: "center", opacity: o, filter: o < 1 ? `blur(${(1 - o) * 12}px)` : undefined, transform: `translateY(${(1 - a) * 18 - b * 10}px)` }}>
                {w}
              </div>
            );
          })}
        </div>
      </div>
      {stage === 2 ? (
        <div style={{ position: "absolute", top: 1290, width: VW, textAlign: "center" }}>
          <Mono size={18} color={Q.faint}>Illustrative simulation</Mono>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Phone: React.FC = () => {
  const t = useT();
  const cam = ez(t, 0, 4.2, IO);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper />
      <div style={{ position: "absolute", left: VW / 2, top: VH / 2, transform: `translate(-50%, -50%) scale(${lerp(cam, 0.9, 1.08)}) rotate(${lerp(cam, -4, 2)}deg)` }}>
        <div style={{ width: 600, height: 1220, borderRadius: 80, background: "#111", padding: 18, boxShadow: "0 50px 100px rgba(0,0,0,0.3)" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 64, background: Q.paper, padding: "90px 40px", boxSizing: "border-box", position: "relative" }}>
            <div style={{ position: "absolute", top: 24, left: "50%", transform: "translateX(-50%)", width: 160, height: 34, borderRadius: 99, background: "#111" }} />
            <Mono size={15}>Simulation · gap scenario</Mono>
            <div style={{ fontFamily: SERIF, fontSize: 46, lineHeight: 1.1, margin: "18px 0 30px", color: Q.ink }}>
              What if the market <i>gaps</i> overnight?
            </div>
            <Fan w={520} h={460} p={ez(t, 0.2, 2.6)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <Mono size={13}>Close</Mono>
              <Mono size={13}>Open</Mono>
            </div>
            <div style={{ marginTop: 40, padding: "20px 22px", border: `1.5px solid ${Q.ink}`, fontFamily: QMONO, fontSize: 18, lineHeight: 1.6, color: Q.ink, opacity: ez(t, 2.0, 2.5) }}>
              Range of outcomes, not a forecast.
              <br />
              <span style={{ color: Q.soft }}>Illustrative simulation · not advice</span>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Stress: React.FC = () => (
  <AbsoluteFill>
    <Paper />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 18, fontFamily: SERIF, fontWeight: 500, fontSize: 92, letterSpacing: -2, color: Q.ink, textAlign: "center" }}>
      <div>
        <Letters text="Simulations" at={0.05} step={0.03} />
        <br />
        <Letters text="stress ideas." at={0.35} step={0.03} />
      </div>
      <div style={{ fontStyle: "italic", fontWeight: 400, fontSize: 68, color: Q.soft }}>
        <Letters text="They don't predict prices." at={0.8} step={0.025} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

const End: React.FC = () => {
  const t = useT();
  const url = "quantora.buzz";
  const n = Math.max(0, Math.min(url.length, Math.floor((t - 0.15) * 18)));
  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
      <div style={{ width: 170, height: 170, borderRadius: 999, background: Q.paper, display: "flex", justifyContent: "center", alignItems: "center", opacity: ez(t, 0, 0.2) }}>
        <Mark size={110} />
      </div>
      <div style={{ fontFamily: QMONO, fontSize: 34, color: "#FFFFFF", letterSpacing: 4 }}>
        {url.slice(0, n)}
        <span style={{ opacity: Math.floor(t * 2.4) % 2 ? 1 : 0 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};

export const QuantoraV3: React.FC = () => <VFilm scenes={TL.scenes} map={{ intro: Intro, input: Input, phrase: Phrase, phone: Phone, stress: Stress, end: End }} audio="collatera-campaign/qv3/mix.wav" />;
