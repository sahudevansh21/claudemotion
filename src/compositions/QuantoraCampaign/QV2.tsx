import { AbsoluteFill, random } from "remotion";
import { Cursor, cursorPath, ez, IO, lerp, Letters, useT, Words } from "../CollateraCampaign/kit";
import { Chart, chartXY, Chip, Guides, Lockup, MARKS, Mono, Paper, Q, QMONO, SERIF, useL, VFilm, WORD } from "./qkit";
import TL from "./qv2.json";

/**
 * QV2 · "Risk. Context. Evidence." (Quantora plan Day 4). 1080×1920 · 60 fps · 20 s.
 * Locked Krea 3 reference (ANALYSIS.md §1), vertical: ransom-note title that
 * snaps clean, headline reflow over a drawing chart, cursor-dropped guides,
 * pill → annotation morphs, region fill, leaderboard-style card, end line.
 * Chart ILLUSTRATIVE (no tickers, no values).
 */
const FONTS = [SERIF, QMONO, WORD, "Georgia, serif", "Impact, sans-serif"];

const Ransom: React.FC = () => {
  const t = useT();
  const word = "Read";
  const snap = ez(t, 1.35, 1.6);
  const fly = ez(t, 1.3, 2.3, IO);
  const frags: [number, number][] = [
    [140, 420],
    [760, 360],
    [120, 1400],
    [800, 1480],
    [460, 260],
    [520, 1650],
  ];
  const L = useL();
  const fragsL: [number, number][] = [[200, 160], [1500, 140], [160, 820], [1560, 800], [880, 90], [900, 880]];
  return (
    <AbsoluteFill>
      <Paper />
      {(L ? fragsL : frags).map(([x, y], i) => {
        const p = ez(t, i * 0.08, 0.5 + i * 0.08);
        const [mx, my] = L ? [960, 540] : [540, 960];
        return (
          <div key={i} style={{ position: "absolute", left: x + (x - mx) * fly * 1.5, top: y + (y - my) * fly * 1.5, opacity: p * (1 - fly), transform: `rotate(${(random(`fr${i}`) - 0.5) * 20}deg)`, background: "rgba(255,253,247,0.75)", boxShadow: "0 12px 26px rgba(22,21,20,0.12)", padding: 14 }}>
            <svg width={180} height={80}>
              <polyline points={Array.from({ length: 12 }, (_, k) => `${k * 16},${40 + Math.sin(k * 0.9 + i) * 20 - k * 1.5}`).join(" ")} fill="none" stroke={Q.ink} strokeWidth={2} />
            </svg>
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: lerp(snap, 14, 0) }}>
          {Array.from(word).map((ch, i) => {
            const at = 0.1 + i * 0.14;
            const p = ez(t, at, at + 0.2);
            const f = Math.floor((t * 10 + i * 2) % FONTS.length);
            const clean = snap > 0.5;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  fontFamily: clean ? SERIF : FONTS[f],
                  fontStyle: clean ? "italic" : f % 2 ? "italic" : "normal",
                  fontWeight: clean ? 400 : 700,
                  fontSize: clean ? 260 : 200 + random(`rs${i}-${f}`) * 80,
                  color: clean ? Q.ink : f % 3 === 0 ? Q.paper : Q.ink,
                  background: clean ? "transparent" : f % 3 === 0 ? Q.ink : i % 2 ? "rgba(255,253,247,0.8)" : "transparent",
                  padding: clean ? 0 : "0 10px",
                  transform: clean ? "none" : `rotate(${(random(`rr${i}-${f}`) - 0.5) * 16}deg) translateY(${(random(`ry${i}-${f}`) - 0.5) * 40}px)`,
                  WebkitTextStroke: !clean && f === 4 ? `2px ${Q.ink}` : undefined,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LAY = { v: { CW: 900, CH: 620, CX: 90, CY: 820 }, l: { CW: 1000, CH: 600, CX: 820, CY: 260 } };
const NOTE = ["What could it cost?", "Why is it moving?", "What does the data support?"];

const ChartScene: React.FC = () => {
  const t = useT();
  const l2 = ez(t, 0.6, 1.1, IO);
  const L = useL();
  const { CW, CH, CX, CY } = L ? LAY.l : LAY.v;
  const draw = ez(t, 0.6, 2.6, IO);
  const times = [2.8, 5.8, 8.8];
  const pts = MARKS.map((m) => chartXY(CW, CH, m.i));
  const c = cursorPath(
    t,
    [
      [0, L ? 1800 : 980, L ? 1000 : 1750],
      [2.6, CX + pts[0][0], CY + pts[0][1]],
      [5.0, CX + pts[0][0], CY + pts[0][1]],
      [5.6, CX + pts[1][0], CY + pts[1][1]],
      [8.0, CX + pts[1][0], CY + pts[1][1]],
      [8.6, CX + pts[2][0], CY + pts[2][1]],
      [12, CX + pts[2][0], CY + pts[2][1]],
    ],
    times.map((x) => x + 0.4),
  );
  const marks = times.reduce((a, x) => a + ez(t, x, x + 0.35) / 3, 0);
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <div style={{ position: "absolute", left: L ? 110 : 90, top: L ? lerp(l2, 400, 300) : lerp(l2, 330, 220), width: L ? 640 : undefined, fontFamily: SERIF, fontWeight: 500, fontSize: L ? lerp(l2, 84, 64) : lerp(l2, 96, 72), letterSpacing: -1.5, color: Q.ink }}>Every move has a story.</div>
      <div style={{ position: "absolute", left: L ? 110 : 90, top: L ? 480 : 330, fontFamily: SERIF, fontSize: L ? 84 : 96, letterSpacing: -2, color: Q.ink, fontStyle: "italic" }}>
        {t > 0.7 ? <Words text="Read it clearly." at={0.7} /> : null}
      </div>
      <div style={{ position: "absolute", left: CX, top: CY }}>
        <Chart w={CW} h={CH} draw={draw} marks={marks} fill={ez(t, 9.4, 10.4)} fillFrom={0.7} />
      </div>
      {MARKS.map((m, k) => {
        const a = times[k];
        const pin = ez(t, a + 0.3, a + 0.7);
        const shrink = ez(t, a + 1.3, a + 1.9, IO);
        const [x, y] = pts[k];
        const big = 1 - shrink;
        const left = lerp(shrink, L ? 1320 : 540, CX + x + (k === 2 ? -560 : 20));
        const top = lerp(shrink, L ? 560 : 1160, CY + y + (k === 2 ? -80 : 26));
        return (
          <div key={m.label} style={{ position: "absolute", left, top, opacity: pin, transform: `translate(${-50 * big}%, ${-50 * big}%) scale(${1 + big * 1.5})`, transformOrigin: "left top", whiteSpace: "nowrap" }}>
            <Chip text={shrink > 0.5 ? `${m.label} · ${NOTE[k]}` : m.label} dark={big > 0.5} size={shrink > 0.5 ? 16 : 30} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CX + pts[1][0] - 160, top: CY + CH + 70, opacity: ez(t, 6.6, 7.0) * (1 - ez(t, 9, 9.4)) }}>
        <Mono size={18} color={Q.soft}>market closed · gap (illustrative)</Mono>
      </div>
      <div style={{ position: "absolute", left: L ? CX : 90, top: L ? 980 : 1560 }}>
        <Mono size={16} color={Q.faint}>Illustrative chart · no data</Mono>
      </div>
      <Cursor x={c.x} y={c.y} press={c.press} color={Q.ink} opacity={ez(t, 1.6, 2.0)} />
    </AbsoluteFill>
  );
};

const ROWS: [string, string][] = [
  ["Risk", "What could this cost, and how fast?"],
  ["Context", "Why is it moving: hours, flows, events?"],
  ["Evidence", "What survives testing, not just one look?"],
];
const Board: React.FC = () => {
  const t = useT();
  const hi = t < 0.8 ? 0 : t < 1.6 ? 1 : 2;
  const L = useL();
  const c = cursorPath(t, L ? [
    [0, 1800, 1000],
    [0.7, 1700, 270],
    [1.5, 1700, 510],
    [2.3, 1700, 750],
  ] : [
    [0, 980, 1700],
    [0.7, 900, 820],
    [1.5, 900, 1060],
    [2.3, 900, 1300],
  ], [2.4]);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: L ? 110 : 90, top: L ? 400 : 420, width: L ? 700 : undefined, fontFamily: SERIF, fontWeight: 500, fontSize: 84, letterSpacing: -1.5, color: Q.ink }}>
        <Words text="Before it's a signal," at={0.05} />
        <div style={{ fontStyle: "italic", fontWeight: 400 }}>
          <Words text="three questions." at={0.35} />
        </div>
      </div>
      <div style={{ position: "absolute", left: L ? 880 : 90, top: L ? 160 : 720, width: 900, background: "rgba(255,253,247,0.7)", border: `1.5px solid ${Q.ink}`, padding: "16px 0" }}>
        {ROWS.map(([k, d], i) => {
          const p = ez(t, 0.1 + i * 0.1, 0.45 + i * 0.1);
          const on = i === hi;
          return (
            <div key={k} style={{ margin: "8px 16px", padding: "34px 30px", background: on ? Q.ink : "transparent", color: on ? Q.paper : Q.ink, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
                <span style={{ fontFamily: QMONO, fontSize: 22, opacity: 0.7 }}>0{i + 1}</span>
                <span style={{ fontFamily: SERIF, fontSize: 56, fontStyle: on ? "italic" : "normal" }}>{k}</span>
              </div>
              <div style={{ fontFamily: QMONO, fontSize: 22, marginTop: 12, opacity: 0.85, letterSpacing: 1 }}>{d}</div>
            </div>
          );
        })}
      </div>
      <Cursor x={c.x} y={c.y} press={c.press} color={Q.ink} />
    </AbsoluteFill>
  );
};

const End: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Paper />
      <Guides />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 90 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 110, lineHeight: 1.05, letterSpacing: -2.5, color: Q.ink, textAlign: "center" }}>
          <Letters text="The market," at={0.05} step={0.04} />
          <br />
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>
            <Letters text="read clearly." at={0.55} step={0.045} />
          </span>
        </div>
        <Lockup size={0.8} tagline={false} p={ez(t, 1.3, 1.8)} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const QuantoraV2: React.FC = () => <VFilm scenes={TL.scenes} map={{ ransom: Ransom, chart: ChartScene, board: Board, end: End }} audio="collatera-campaign/qv2/mix.wav" />;
