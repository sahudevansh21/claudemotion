import { AbsoluteFill, random } from "remotion";
import { ez, IO, lerp, Letters, Swap, useT } from "../CollateraCampaign/kit";
import { Chart, chartXY, Chip, Guides, Head, Lockup, MARKS, Mono, Paper, Q, QEnd, SERIF, useL, VFilm } from "./qkit";
import TL from "./qv1.json";

/**
 * QV1 · "Introducing Quantora Labs" (Quantora plan Day 1). 1920×1080 (16:9) or 1080×1920 · 60 fps · 20 s.
 * Locked Supabase Middleware reference (ANALYSIS.md §5), re-laid for vertical:
 * letter blur-in, title morph to lockup, chart draws in, phrase swap + label
 * reel, burst-out of RISK / CONTEXT / EVIDENCE, tilted chart with annotation
 * pills, italic accent line, lockup + typed URL. Chart ILLUSTRATIVE.
 */
const Intro: React.FC = () => {
  const t = useT();
  const m = ez(t, 1.0, 1.6, IO);
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: lerp(m, 120, 52), color: m > 0.5 ? Q.soft : Q.ink, letterSpacing: -1.5, transform: `translateY(${lerp(m, 0, -40)}px)` }}>
          <Letters text="Introducing" at={0.05} step={0.04} />
        </div>
        <div style={{ height: lerp(m, 0, 160), overflow: "visible", display: "flex", alignItems: "center", opacity: ez(t, 1.2, 1.6) }}>
          <Lockup size={0.95} p={ez(t, 1.2, 1.8)} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ChartIn: React.FC = () => {
  const t = useT();
  const up = ez(t, 0, 0.7, IO);
  const L = useL();
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <div style={{ position: "absolute", left: L ? lerp(up, 660, 120) : 90, top: L ? lerp(up, 470, 470) : lerp(up, 820, 300) }}>
        <Lockup size={0.95} />
      </div>
      <div style={{ position: "absolute", left: L ? 900 : 90, top: L ? 300 : 760, opacity: ez(t, 0.3, 0.7) }}>
        <Chart w={L ? 900 : 900} h={L ? 480 : 560} draw={ez(t, 0.4, 2.0, IO)} marks={ez(t, 1.2, 2.2)} />
      </div>
      <div style={{ position: "absolute", left: L ? 900 : 90, top: L ? 860 : 1450, opacity: ez(t, 1.4, 1.8) }}>
        <Mono size={16} color={Q.faint}>Illustrative chart · no data</Mono>
      </div>
    </AbsoluteFill>
  );
};

const LABELS = ["Tokenized stocks", "ETFs", "Market simulations"];
const SwapScene: React.FC = () => {
  const t = useT();
  const base = TL.scenes.find((s) => s.id === "swap")!.from;
  const sw = TL.swaps.map((s) => s - base);
  const roll = sw.reduce((a, s) => a + ez(t, s - 0.05, s + 0.35, IO), 0) - 1;
  const L = useL();
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <div style={{ position: "absolute", left: L ? 120 : 90, top: L ? 330 : 520, fontFamily: SERIF, fontWeight: 500, fontSize: 92, lineHeight: 1.08, letterSpacing: -2, color: Q.ink }}>
        <div style={{ opacity: ez(t, 0, 0.4) }}>Quantitative</div>
        <div style={{ opacity: ez(t, 0.1, 0.5) }}>research for</div>
        <div style={{ fontStyle: "italic", fontWeight: 400 }}>
          <Swap items={["tokenized stocks.", "ETFs.", "market simulations."]} times={sw} color={Q.ink} minWidth={800} />
        </div>
      </div>
      <div style={{ position: "absolute", left: L ? 1500 : 540, top: L ? 500 : 1300 }}>
        {LABELS.map((l, i) => {
          const off = i - Math.max(0, roll);
          const d = Math.abs(off);
          return (
            <div key={l} style={{ position: "absolute", top: off * 150, left: 0, transform: `translateX(-50%) scale(${1 - Math.min(1, d) * 0.25}) perspective(800px) rotateX(${-off * 24}deg)`, opacity: Math.max(0, 1 - d * 0.55), filter: d > 0.05 ? `blur(${Math.min(1, d) * 2}px)` : undefined, whiteSpace: "nowrap" }}>
              <Chip text={l} dark={d < 0.5} size={30} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Burst: React.FC = () => {
  const t = useT();
  const b = ez(t, 0.1, 0.9);
  const L = useL();
  const [bx, by] = L ? [1450, 540] : [540, 1300];
  const spotsL: [number, number][] = [[1000, 260], [1520, 330], [1180, 560], [1600, 680], [980, 820], [1420, 880]];
  const spots: [string, number, number][] = [
    ["RISK", 200, 1150],
    ["CONTEXT", 640, 1320],
    ["EVIDENCE", 330, 1500],
    ["TOKENIZED STOCKS", 560, 1080],
    ["ETFS", 820, 1520],
    ["SIMULATIONS", 160, 1700],
  ];
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <div style={{ position: "absolute", left: L ? 120 : 90, top: L ? 380 : 520 }}>
        <Head size={L ? 110 : 92} parts={[["…for onchain", false], ["finance.", true]]} />
      </div>
      {spots.map(([l, x0, y0], i) => {
        const [x, y] = L ? spotsL[i] : [x0, y0];
        return (
        <div key={l} style={{ position: "absolute", whiteSpace: "nowrap", left: lerp(b, bx, x) - 60, top: lerp(b, by, y) + Math.sin(t * 1.3 + i) * 6, opacity: Math.min(1, b * 1.6) }}>
          <Chip text={l} dark={i < 3} size={L ? 24 : 20} />
        </div>
        );
      })}
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: lerp(b, bx, L ? 940 + random(`qx${i}`) * 860 : 100 + random(`qx${i}`) * 880), top: lerp(b, by, L ? 180 + random(`qy${i}`) * 760 : 1000 + random(`qy${i}`) * 800), width: 8, height: 8, borderRadius: 99, background: Q.ink, opacity: b * 0.5 }} />
      ))}
    </AbsoluteFill>
  );
};

const NOTES = ["Risk · what could it cost?", "Context · why is it moving?", "Evidence · what does data support?"];
const Tilt: React.FC = () => {
  const t = useT();
  const cam = ez(t, 0, 3.7, IO);
  const inP = ez(t, 0, 0.7, IO);
  const L = useL();
  const cw = L ? 1300 : 960;
  const ch = L ? 560 : 620;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Paper />
      <div style={{ position: "absolute", left: L ? 120 : 90, top: L ? 110 : 260 }}>
        <Mono size={20}>One chart · three questions</Mono>
      </div>
      <div style={{ position: "absolute", left: L ? 960 : 540, top: L ? 590 : 980, perspective: 1800 }}>
        <div style={{ transform: `translate(-50%, -50%) rotateX(${lerp(inP, 44, 24)}deg) rotateZ(${lerp(cam, -10, -5)}deg) scale(${lerp(inP, 0.8, 1.0) + cam * 0.12})`, position: "relative", width: cw }}>
          <Chart w={cw} h={ch} />
          {MARKS.map((m, k) => {
            const [x, y] = chartXY(cw, ch, m.i);
            const q = ez(t, 0.8 + k * 0.5, 1.15 + k * 0.5);
            return (
              <div key={m.label} style={{ position: "absolute", left: k === 2 ? x - 520 : x + 14, top: L && k === 2 ? y - 90 : y + 30, opacity: q, transform: `scale(${0.85 + 0.15 * q})`, transformOrigin: "left top", whiteSpace: "nowrap" }}>
                <Chip text={NOTES[k]} size={17} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: L ? 120 : 90, bottom: L ? 80 : 150 }}>
        <Mono size={16} color={Q.faint}>Illustrative · not data · not advice</Mono>
      </div>
    </AbsoluteFill>
  );
};

const Read: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 120, lineHeight: 1.05, letterSpacing: -2.5, color: Q.ink, textAlign: "center" }}>
          <div>
            <Letters text="The market," at={0.05} step={0.04} />
          </div>
          <div style={{ fontStyle: "italic", fontWeight: 400 }}>
            <Letters text="read clearly." at={0.6} step={0.045} />
          </div>
          <div style={{ width: lerp(ez(t, 1.4, 2.0, IO), 0, 520), height: 2, background: Q.ink, margin: "36px auto 0" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const End: React.FC = () => <QEnd at={0.05} />;

export const QuantoraV1: React.FC = () => (
  <VFilm scenes={TL.scenes} map={{ intro: Intro, chart: ChartIn, swap: SwapScene, burst: Burst, tilt: Tilt, read: Read, end: End }} audio="collatera-campaign/qv1/mix.wav" />
);
