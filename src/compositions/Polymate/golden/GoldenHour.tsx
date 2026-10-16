import { AbsoluteFill, Img, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PM_EASE, PM_FONTS } from "../brand";
import { ArmillaryBack, ArmillaryFront } from "./Armillary";
import { Painting } from "./Painting";
import { COLUMNS } from "./scene";
import {
  BURGUNDY,
  C,
  CREAM,
  EMBLEM,
  EMBLEM_AR,
  GOLD,
  GOLD_HI,
  INK,
  PAPER,
  RING,
  SAPPHIRE,
  SAPPHIRE_DEEP,
  camera,
  iv,
  lerp,
  lin,
  toScreen,
  toWorld,
} from "./shared";

/* ------------------------------------------------------------------ */
/* Pencil under-drawing (the reference opens on a sketch)               */
/* ------------------------------------------------------------------ */
const sketchPaths = (() => {
  const p: string[] = [];
  p.push("M590 712 L630 170 L880 170 L880 712", "M1330 712 L1290 170 L1040 170 L1040 712", "M860 262 L1060 262 L1060 338 L860 338 Z", "M880 338 L880 712 M1040 338 L1040 712 M960 338 L960 712");
  p.push("M-60 712 L1980 712", "M770 714 L1150 714 L1150 870 L770 870 Z M800 690 L1120 690 L1150 714 M800 690 L770 714");
  for (const c of COLUMNS) {
    for (const m of [false, true]) {
      const cx = m ? 1920 - c.cx : c.cx;
      const x0 = cx - c.w / 2;
      const cap = c.w * 0.62;
      p.push(`M${x0} ${c.top + cap} L${x0} ${c.bot} M${x0 + c.w} ${c.top + cap} L${x0 + c.w} ${c.bot}`);
      p.push(`M${x0} ${c.top + cap} C${x0 - c.w * 0.2} ${c.top + cap * 0.4}, ${x0 - c.w * 0.25} ${c.top + cap * 0.2}, ${x0 - c.w * 0.2} ${c.top} L${x0 + c.w * 1.2} ${c.top} C${x0 + c.w * 1.25} ${c.top + cap * 0.2}, ${x0 + c.w * 1.2} ${c.top + cap * 0.4}, ${x0 + c.w} ${c.top + cap}`);
    }
  }
  for (let i = -5; i <= 5; i++) p.push(`M${960 + i * 40} 712 L${960 + i * 260} 1150`);
  p.push("M-60 600 C 200 560, 420 610, 600 590", "M1320 600 C 1500 570, 1700 620, 1980 590");
  return p;
})();

const Sketch: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - iv(f, [C.paintStart + 110, C.paintEnd + 40], [0, 1]);
  if (o <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }}>
      <g fill="none" stroke="#4E473E" strokeLinecap="round" strokeLinejoin="round">
        {sketchPaths.map((d, i) => {
          const t = iv(f, [i * 1.6 - 20, i * 1.6 + 50], [0.15, 1], PM_EASE.out);
          return (
            <g key={i}>
              <path d={d} strokeWidth={1.7} opacity={0.75} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
              <path d={d} strokeWidth={1} opacity={0.3} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} transform="translate(2.5 -1.5)" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Sapphire beam: through the open roof, into the rings, then fanning out */
/* ------------------------------------------------------------------ */
const CARDS = [
  { cat: "ECONOMY", q: "Global growth beats forecasts in 2027?", yes: 54, x: 455, y: 300, seed: "e" },
  { cat: "CRYPTO", q: "BTC above $150K by year end?", yes: 38, x: 1465, y: 300, seed: "c" },
  { cat: "POLITICS", q: "Incumbent party wins the next election?", yes: 47, x: 400, y: 650, seed: "p" },
  { cat: "SPORTS", q: "Home side lifts the trophy in the final?", yes: 61, x: 1520, y: 650, seed: "s" },
];

const Beam: React.FC = () => {
  const f = useCurrentFrame();
  const draw = iv(f, [C.beam, C.beam + 40], [0, 1], PM_EASE.out);
  const o = 1 - iv(f, [C.symbolStart - 120, C.symbolStart], [0, 1]);
  if (f < C.beam || o <= 0) return null;
  const sx = 260;
  const sy = -140;
  const ex = sx + (RING.x - sx) * draw;
  const ey = sy + (RING.y - sy) * draw;
  const fan = iv(f, [C.fan, C.fan + 40], [0, 1], PM_EASE.out);
  const fanO = 1 - iv(f, [C.cardsIn + 90, C.cardsIn + 220], [0, 1]);
  const flicker = 0.85 + 0.15 * Math.sin(f / 7);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o, mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id="gh-beam" x1={sx} y1={sy} x2={RING.x} y2={RING.y} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7FA2FF" stopOpacity="0.05" />
          <stop offset="1" stopColor="#5C86FF" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path d={`M${sx - 50} ${sy} L${sx + 50} ${sy} L${ex + 22} ${ey} L${ex - 22} ${ey} Z`} fill="url(#gh-beam)" opacity={flicker} style={{ filter: "blur(10px)" }} />
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#DCE6FF" strokeWidth={3} opacity={0.9} style={{ filter: "drop-shadow(0 0 8px #4F7BFF)" }} />
      {CARDS.map((c, i) => {
        const t = iv(f, [C.fan + i * 8, C.fan + i * 8 + 40], [0, 1], PM_EASE.out) * fan;
        return (
          <line key={c.seed} x1={RING.x} y1={RING.y} x2={lerp(t, RING.x, c.x)} y2={lerp(t, RING.y, c.y)} stroke="#BFD0FF" strokeWidth={2} opacity={0.75 * fanO} style={{ filter: "drop-shadow(0 0 6px #4F7BFF)" }} />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Event-market cards + the travelling golden symbol                      */
/* ------------------------------------------------------------------ */
const Spark: React.FC<{ seed: string; t: number; w: number }> = ({ seed, t, w }) => {
  const pts = Array.from({ length: 20 }, (_, i) => {
    const y = 0.55 - 0.25 * Math.sin(i / 3 + seed.charCodeAt(0)) * 0.6 + (random(`${seed}${i}`) - 0.5) * 0.45;
    return `${(i / 19) * w},${Math.max(0.08, Math.min(0.92, y)) * 40}`;
  }).join(" ");
  return (
    <svg width={w} height={40}>
      <polyline points={pts} fill="none" stroke={GOLD} strokeWidth={2.6} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t} />
    </svg>
  );
};

const VISITS = [C.symbolStart, C.visit1, C.visit2, C.visit3];
const ORDER = [0, 1, 3, 2]; // A → B → D → C, then the altar

const Card: React.FC<{ i: number }> = ({ i }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const c = CARDS[i];
  const at = C.cardsIn + i * 30;
  const pop = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 150, mass: 0.8 } });
  const count = iv(f, [at, at + 50], [0, 1], PM_EASE.out);
  const visitAt = VISITS[ORDER.indexOf(i)];
  const lit = iv(f, [visitAt - 6, visitAt + 6, visitAt + 60], [0, 1, 0.35], (x) => x);
  const conv = iv(f, [C.converge + i * 10, C.convergeEnd + i * 6], [0, 1], PM_EASE.in);
  if (f < at || conv >= 1) return null;
  const bob = Math.sin((f + i * 40) / 55) * 7;
  const x = lerp(conv, c.x, RING.x);
  const y = lerp(conv, c.y + bob, RING.y);
  const sc = pop * lerp(conv, 1, 0.12);
  const yes = Math.round(c.yes * count + (f > visitAt ? 1 : 0));
  return (
    <div
      style={{
        position: "absolute",
        left: x - 175,
        top: y - 102,
        width: 350,
        height: 204,
        transform: `scale(${sc}) rotate(${(1 - pop) * (i % 2 ? 6 : -6)}deg)`,
        opacity: Math.min(1, pop * 1.5) * (1 - conv * 0.7),
        borderRadius: 20,
        background: CREAM,
        border: `3px solid ${INK}`,
        boxShadow: `0 0 0 ${2 + 4 * lit}px color-mix(in srgb, ${GOLD} ${Math.round(lit * 100)}%, transparent), 0 18px 40px rgba(30,18,8,0.35), 0 0 ${60 * lit}px color-mix(in srgb, ${GOLD} ${Math.round(lit * 70)}%, transparent)`,
        padding: "20px 24px",
        boxSizing: "border-box",
        fontFamily: PM_FONTS.ui,
        color: INK,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: PM_FONTS.mono, fontSize: 15, letterSpacing: 3, color: BURGUNDY, fontWeight: 600 }}>{c.cat}</div>
        <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${GOLD}`, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: SAPPHIRE }} />
        </div>
      </div>
      <div style={{ fontFamily: PM_FONTS.serif, fontStyle: "italic", fontSize: 31, lineHeight: 1.08, marginTop: 10, height: 68 }}>{c.q}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: PM_FONTS.serif, fontSize: 50, lineHeight: 0.9, color: SAPPHIRE }}>{yes}%</span>
          <span style={{ fontFamily: PM_FONTS.mono, fontSize: 14, letterSpacing: 2, color: "#6B6052" }}>YES</span>
        </div>
        <Spark seed={c.seed} t={count} w={130} />
      </div>
    </div>
  );
};

const SYMBOL_PTS = [...ORDER.map((i) => [CARDS[i].x, CARDS[i].y] as [number, number]), [EMBLEM.x, EMBLEM.y] as [number, number]];
const SYMBOL_T = [C.symbolStart, C.visit1, C.visit2, C.visit3, C.symbolEnd];

const symbolPos = (f: number): [number, number] => {
  for (let k = 0; k < SYMBOL_T.length - 1; k++) {
    if (f <= SYMBOL_T[k + 1]) {
      const t = iv(f, [SYMBOL_T[k], SYMBOL_T[k + 1]], [0, 1], PM_EASE.inOut);
      const [ax, ay] = SYMBOL_PTS[k];
      const [bx, by] = SYMBOL_PTS[k + 1];
      const lift = Math.sin(t * Math.PI) * -70; // gentle arc
      return [lerp(t, ax, bx), lerp(t, ay, by) + lift];
    }
  }
  return SYMBOL_PTS[SYMBOL_PTS.length - 1];
};

const Constellation: React.FC = () => {
  const f = useCurrentFrame();
  const o = 1 - iv(f, [C.converge, C.converge + 50], [0, 1]);
  const appear = iv(f, [C.symbolStart - 30, C.symbolStart], [0, 1]);
  const gone = iv(f, [C.symbolEnd - 10, C.symbolEnd + 30], [0, 1]);
  if (f < C.symbolStart - 30 || (o <= 0 && gone >= 1)) return null;
  const [sx, sy] = symbolPos(f);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g opacity={o}>
        {SYMBOL_PTS.slice(0, -1).map(([ax, ay], k) => {
          const [bx, by] = SYMBOL_PTS[k + 1];
          const t = iv(f, [SYMBOL_T[k], SYMBOL_T[k + 1]], [0, 1], PM_EASE.inOut);
          const mx = (ax + bx) / 2;
          const my = (ay + by) / 2 - 140; // quadratic control = 2× the arc lift
          return (
            <path key={k} d={`M${ax} ${ay} Q${mx} ${my} ${bx} ${by}`} fill="none" stroke={GOLD_HI} strokeWidth={3} strokeDasharray="1 1" pathLength={1} strokeDashoffset={1 - t} opacity={0.95} style={{ filter: `drop-shadow(0 0 5px ${GOLD})` }} />
          );
        })}
        {SYMBOL_PTS.slice(0, -1).map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={5} fill={GOLD_HI} opacity={f >= SYMBOL_T[k] ? 0.9 : 0} />
        ))}
      </g>
      {/* the symbol: a sun-disc glyph */}
      <g transform={`translate(${sx} ${sy}) rotate(${f * 1.2})`} opacity={appear * (1 - gone)} style={{ filter: `drop-shadow(0 0 14px ${GOLD}) drop-shadow(0 0 4px #FFF4D6)` }}>
        <circle r={24} fill="none" stroke={GOLD_HI} strokeWidth={2.5} />
        <circle r={13} fill={GOLD} stroke={INK} strokeWidth={2} />
        <circle r={5} fill={SAPPHIRE} />
        {[0, 1, 2, 3].map((k) => (
          <line key={k} x1={0} y1={-30} x2={0} y2={-40} stroke={GOLD_HI} strokeWidth={3} strokeLinecap="round" transform={`rotate(${k * 90})`} />
        ))}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Emblem — the supplied PNG, never redrawn                               */
/* ------------------------------------------------------------------ */
const Emblem: React.FC = () => {
  const f = useCurrentFrame();
  const reveal = iv(f, [C.emblemIn, C.emblemIn + 100], [0, 1], PM_EASE.out);
  if (reveal <= 0) return null;
  const lift = iv(f, [C.lift, C.lift + 130], [0, 1], PM_EASE.inOut);
  // finale: hold a fixed screen position in front of the pulled-back camera
  const target = toWorld(f, 960, 330);
  const x = lerp(lift, EMBLEM.x, target.x);
  const y = lerp(lift, EMBLEM.y, target.y);
  const w = lerp(lift, EMBLEM.w * lerp(reveal, 0.86, 1), 380 / target.s);
  const h = w * EMBLEM_AR;
  const turn = lerp(reveal, -70, 0) + Math.sin((f - C.emblemIn) / 95) * 10 * (1 - lift * 0.6);
  const float = Math.sin(f / 70) * 3 * lift;
  const sheen = ((f % 240) / 240) * 2.4 - 0.7;
  const src = staticFile("polymate/img/emblem.png");
  const mask: React.CSSProperties = { WebkitMaskImage: `url(${src})`, WebkitMaskSize: "100% 100%", maskImage: `url(${src})`, maskSize: "100% 100%" };
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2 + float, width: w, height: h, perspective: 1600, opacity: Math.min(1, reveal * 1.4) }}>
      <div style={{ position: "absolute", inset: -w * 0.5, borderRadius: "50%", background: `radial-gradient(circle, color-mix(in srgb, ${GOLD_HI} 55%, transparent) 0%, color-mix(in srgb, #4F7BFF 18%, transparent) 35%, transparent 65%)`, opacity: 0.8 * reveal }} />
      <div style={{ position: "absolute", inset: 0, transform: `rotateY(${turn}deg)`, transformStyle: "preserve-3d" }}>
        <Img src={src} style={{ position: "absolute", inset: 0, width: w, height: h, filter: "drop-shadow(0 14px 22px rgba(20,10,4,0.5))" }} />
        <div style={{ position: "absolute", inset: 0, ...mask, background: `linear-gradient(110deg, transparent ${(sheen - 0.12) * 100}%, rgba(255,250,235,0.45) ${sheen * 100}%, transparent ${(sheen + 0.12) * 100}%)`, mixBlendMode: "screen" }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Trading interface (screen space) — grows out of the flattened rings   */
/* ------------------------------------------------------------------ */
const PANEL = { x: 1000, y: 130, w: 790, h: 700 };

const Interface: React.FC = () => {
  const f = useCurrentFrame();
  const grow = iv(f, [C.morph, C.morphEnd], [0, 1]);
  const shrink = iv(f, [C.collapse, C.collapse + 55], [0, 1], PM_EASE.in);
  if (f < C.morph || shrink >= 1) return null;
  const ring = toScreen(f, RING.x, RING.y);
  const em = toScreen(f, EMBLEM.x, EMBLEM.y);
  const d0 = RING.r * 2 * ring.s;
  const fromX = f < C.collapse ? ring.x - d0 / 2 : em.x - 60;
  const fromY = f < C.collapse ? ring.y - d0 / 2 : em.y - 50;
  const fromW = f < C.collapse ? d0 : 120;
  const fromH = f < C.collapse ? d0 : 100;
  const m = f < C.collapse ? grow : 1 - shrink;
  const x = lerp(m, fromX, PANEL.x);
  const y = lerp(m, fromY, PANEL.y);
  const w = lerp(m, fromW, PANEL.w);
  const h = lerp(m, fromH, PANEL.h);
  const radius = lerp(m, Math.min(fromW, fromH) / 2, 34);
  const contentO = iv(f, [C.morphEnd - 15, C.morphEnd + 10], [0, 1]) * (1 - iv(f, [C.collapse - 4, C.collapse + 14], [0, 1]));

  const rowsIn = (i: number) => iv(f, [C.rows + i * 15, C.rows + i * 15 + 30], [0, 1], PM_EASE.out);
  const hiY = 132 + iv(f, [C.select, C.select + 22], [0, 1]) * 112;
  const hiO = iv(f, [C.rows + 45, C.rows + 60], [0, 1]);
  const press = iv(f, [C.click - 4, C.click, C.click + 10], [1, 0.96, 1], (t) => t);
  const detail = iv(f, [C.detail, C.detail + 30], [0, 1]);
  const trace = iv(f, [C.traceStart, C.traceEnd], [0, 1], PM_EASE.inOut);
  const buy = iv(f, [C.buy - 3, C.buy + 3], [0, 1], (t) => t);
  const buyPress = iv(f, [C.buy - 4, C.buy, C.buy + 10], [1, 0.95, 1], (t) => t);
  const done = iv(f, [C.confirmed, C.confirmed + 22], [0, 1], PM_EASE.out);
  const pulse = lin(f, [C.confirmed, C.confirmed + 45], [0, 1]);

  // chart: a refined gold line, traced left to right
  const chartPts = Array.from({ length: 40 }, (_, i) => {
    const t = i / 39;
    const y = 0.62 - 0.22 * t + Math.sin(t * 9) * 0.06 + (random(`gch${i}`) - 0.5) * 0.08;
    return [t * 690, y * 170] as [number, number];
  });
  const chartD = chartPts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const headIdx = Math.min(39, Math.floor(trace * 39));
  const head = chartPts[headIdx];

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        background: `radial-gradient(ellipse at 28% 18%, #2A55D6 0%, ${SAPPHIRE} 42%, ${SAPPHIRE_DEEP} 100%)`,
        border: `3px solid ${INK}`,
        boxShadow: `0 0 0 2px ${GOLD} inset, 0 40px 100px rgba(10,8,30,0.55)`,
        opacity: Math.min(1, m * 3),
      }}
    >
      <svg width={PANEL.w} height={PANEL.h} style={{ position: "absolute", left: 0, top: 0 }}>
        <g fill="none" strokeLinecap="round">
          <path d="M-20 560 C 140 470, 230 500, 340 380 S 560 220, 820 140" stroke="#DDE6FF" strokeWidth={1.6} opacity={0.16} />
          <path d="M60 720 C 210 600, 340 640, 470 510 S 660 410, 820 390" stroke="#DDE6FF" strokeWidth={1} opacity={0.1} />
          <path d="M340 380 C 380 450, 360 560, 440 720" stroke={GOLD} strokeWidth={1.2} opacity={0.32} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: PANEL.w, height: PANEL.h, opacity: contentO, fontFamily: PM_FONTS.ui, color: CREAM }}>
        {/* header */}
        <div style={{ position: "absolute", left: 44, right: 44, top: 34, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: PM_FONTS.serif, fontSize: 46 }}>TryOdds</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "rgba(246,240,228,0.12)", fontFamily: PM_FONTS.mono, fontSize: 15, letterSpacing: 2.5, color: GOLD_HI }}>
            <span style={{ width: 9, height: 9, borderRadius: 5, background: GOLD, boxShadow: `0 0 10px ${GOLD}`, opacity: 0.6 + 0.4 * Math.sin(f / 9) }} />
            LIVE
          </div>
          <div style={{ marginLeft: "auto", fontFamily: PM_FONTS.mono, fontSize: 14, letterSpacing: 3, color: "rgba(246,240,228,0.5)" }}>ILLUSTRATIVE</div>
        </div>
        <div style={{ position: "absolute", left: 44, right: 44, top: 108, height: 1, background: "rgba(215,170,85,0.5)" }} />

        {/* market list */}
        <div style={{ position: "absolute", left: 44, right: 44, top: 0, bottom: 0, opacity: 1 - detail }}>
          <div style={{ position: "absolute", left: -8, right: -8, top: hiY - 6, height: 104, borderRadius: 22, border: `2px solid ${GOLD}`, opacity: hiO, transform: `scale(${press})`, boxShadow: `0 0 24px color-mix(in srgb, ${GOLD} 45%, transparent)` }} />
          {CARDS.map((c, i) => {
            const t = rowsIn(i);
            return (
              <div key={c.seed} style={{ position: "absolute", left: 0, right: 0, top: 132 + i * 112, height: 92, borderRadius: 18, padding: "0 24px", display: "flex", alignItems: "center", gap: 20, background: "rgba(246,240,228,0.07)", opacity: t, transform: `translateX(${lerp(t, 40, 0)}px)` }}>
                <div style={{ fontFamily: PM_FONTS.mono, fontSize: 13, letterSpacing: 2.5, color: GOLD_HI, width: 96 }}>{c.cat}</div>
                <div style={{ fontSize: 24, fontWeight: 500, flex: 1, lineHeight: 1.2 }}>{c.q}</div>
                <div style={{ fontFamily: PM_FONTS.serif, fontSize: 40, color: GOLD_HI, width: 80, textAlign: "right" }}>{c.yes}%</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, bottom: 34, fontFamily: PM_FONTS.mono, fontSize: 14, letterSpacing: 2, color: "rgba(246,240,228,0.5)" }}>
            PRICES ARE PROBABILITIES, NOT PROMISES
          </div>
        </div>

        {/* market detail + trade */}
        <div style={{ position: "absolute", left: 44, right: 44, top: 130, opacity: detail, transform: `translateY(${lerp(detail, 24, 0)}px)` }}>
          <div style={{ fontFamily: PM_FONTS.mono, fontSize: 14, letterSpacing: 3, color: GOLD_HI }}>CRYPTO</div>
          <div style={{ fontSize: 32, fontWeight: 600, marginTop: 6 }}>{CARDS[1].q}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 10 }}>
            <span style={{ fontFamily: PM_FONTS.serif, fontSize: 72, lineHeight: 1, color: GOLD_HI }}>38%</span>
            <span style={{ fontSize: 22, color: "rgba(246,240,228,0.7)" }}>chance · market-implied</span>
          </div>
          <svg width={702} height={180} style={{ marginTop: 6, overflow: "visible" }}>
            {[0.25, 0.5, 0.75].map((k) => (
              <line key={k} x1={0} x2={690} y1={170 * k} y2={170 * k} stroke="rgba(246,240,228,0.1)" strokeWidth={1} />
            ))}
            <path d={chartD} fill="none" stroke={GOLD} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - trace} style={{ filter: `drop-shadow(0 0 6px color-mix(in srgb, ${GOLD} 70%, transparent))` }} />
            {trace > 0 ? <circle cx={head[0]} cy={head[1]} r={7} fill={GOLD_HI} stroke={INK} strokeWidth={2} /> : null}
          </svg>
          <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
            <div style={{ flex: 1, height: 84, borderRadius: 18, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 26px", fontSize: 28, fontWeight: 700, background: `linear-gradient(135deg, color-mix(in srgb, ${GOLD_HI} ${Math.round(buy * 100)}%, rgba(246,240,228,0.1)), color-mix(in srgb, ${GOLD} ${Math.round(buy * 100)}%, rgba(246,240,228,0.06)))`, color: buy > 0.5 ? INK : CREAM, border: `2px solid ${GOLD}`, transform: `scale(${buyPress})` }}>
              Buy YES <span>38¢</span>
            </div>
            <div style={{ flex: 1, height: 84, borderRadius: 18, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 26px", fontSize: 28, fontWeight: 600, border: "2px solid rgba(246,240,228,0.25)", color: "rgba(246,240,228,0.7)" }}>
              Buy NO <span>62¢</span>
            </div>
          </div>
          <div style={{ position: "relative", marginTop: 18, height: 78, borderRadius: 18, background: CREAM, color: INK, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", opacity: done, transform: `translateY(${lerp(done, 14, 0)}px)` }}>
            <div style={{ position: "relative", width: 48, height: 48 }}>
              <div style={{ position: "absolute", inset: -40 * pulse, borderRadius: "50%", border: `2px solid ${GOLD}`, opacity: 1 - pulse }} />
              <div style={{ width: 48, height: 48, borderRadius: 24, background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 26, fontWeight: 700 }}>✓</div>
            </div>
            <div style={{ fontSize: 27, fontWeight: 600 }}>Position opened</div>
            <div style={{ marginLeft: "auto", fontSize: 27, fontWeight: 700, color: BURGUNDY }}>YES · $50</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Captions: italic serif on a torn, painted cream label (reference)      */
/* ------------------------------------------------------------------ */
const RoughDefs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="gh-rough" x="-10%" y="-30%" width="120%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={3} seed={7} />
      <feDisplacementMap in="SourceGraphic" scale={22} />
    </filter>
  </svg>
);

const Label: React.FC<{ children: React.ReactNode; opacity: number; scale?: number; padding: string; style?: React.CSSProperties }> = ({ children, opacity, scale = 1, padding, style }) => (
  <div style={{ position: "relative", padding, opacity, transform: `scale(${scale})`, ...style }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "color-mix(in srgb, #F3ECDD 93%, transparent)", filter: "url(#gh-rough)", boxShadow: "0 8px 30px rgba(30,18,8,0.18)" }} />
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const Caption: React.FC<{ text: string; at: number; out: number; size?: number }> = ({ text, at, out, size = 84 }) => {
  const f = useCurrentFrame();
  const inn = iv(f, [at, at + 16], [0, 1], PM_EASE.out);
  const o = inn * (1 - iv(f, [out, out + 16], [0, 1]));
  const wipe = lin(f, [at + 6, at + 6 + text.length * 0.9], [0, 1]);
  if (o <= 0) return null;
  const edge = wipe * 115 - 8;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 104, display: "flex", justifyContent: "center" }}>
      <Label opacity={o} scale={lerp(inn, 0.94, 1)} padding="14px 54px 22px">
        <div
          style={{
            fontFamily: PM_FONTS.serif,
            fontStyle: "italic",
            fontSize: size,
            lineHeight: 1.1,
            color: INK,
            whiteSpace: "nowrap",
            letterSpacing: -0.5,
            WebkitMaskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 8}%)`,
            maskImage: `linear-gradient(90deg, #000 ${edge}%, transparent ${edge + 8}%)`,
          }}
        >
          {text}
        </div>
      </Label>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Finale lockup                                                          */
/* ------------------------------------------------------------------ */
const Lockup: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = spring({ frame: f - C.lockup, fps, config: { damping: 16, stiffness: 120 } });
  const tag = iv(f, [C.lockup + 18, C.lockup + 50], [0, 1], PM_EASE.out);
  const cta = spring({ frame: f - C.cta, fps, config: { damping: 14, stiffness: 140 } });
  const soon = spring({ frame: f - C.cta - 15, fps, config: { damping: 14, stiffness: 140 } });
  if (f < C.lockup) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Label opacity={Math.min(1, t * 1.4)} scale={lerp(t, 0.9, 1)} padding="18px 80px 30px">
          <div style={{ textAlign: "center", color: INK }}>
            <div style={{ fontFamily: PM_FONTS.serif, fontSize: 132, lineHeight: 1, letterSpacing: -1 }}>PolyMate</div>
            <div style={{ fontFamily: PM_FONTS.serif, fontStyle: "italic", fontSize: 48, marginTop: 10, opacity: tag, color: "#3A2E22" }}>The trading layer for prediction markets.</div>
          </div>
        </Label>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 878, display: "flex", justifyContent: "center", gap: 28 }}>
        <Label opacity={Math.min(1, cta * 1.4)} scale={lerp(cta, 0.85, 1)} padding="10px 36px 14px">
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: PM_FONTS.ui, fontSize: 44, fontWeight: 600, color: INK }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, background: "#2E9E5B", boxShadow: "0 0 12px #2E9E5B" }} />
            TryOdds is live
          </div>
        </Label>
        <Label opacity={Math.min(1, soon * 1.4) * 0.92} scale={lerp(soon, 0.85, 1)} padding="10px 36px 14px">
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontFamily: PM_FONTS.ui, fontSize: 36, fontWeight: 500, color: "#4A3E32", lineHeight: 1.45 }}>
            OddsAlert · CopyOdds
            <span style={{ fontFamily: PM_FONTS.mono, fontSize: 18, letterSpacing: 3, color: BURGUNDY }}>COMING SOON</span>
          </div>
        </Label>
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Golden dust                                                            */
/* ------------------------------------------------------------------ */
const DUST = Array.from({ length: 90 }, (_, i) => ({
  x: random(`dx${i}`) * 1920,
  y: random(`dy${i}`) * 1180,
  v: 0.15 + random(`dv${i}`) * 0.45,
  r: 1.2 + random(`dr${i}`) * 2.8,
  ph: random(`dp${i}`) * 100,
}));

const Dust: React.FC = () => {
  const f = useCurrentFrame();
  const base = iv(f, [C.paintEnd, C.paintEnd + 60], [0, 0.35]);
  const finale = iv(f, [C.doors, C.doors + 120], [0, 1]);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, mixBlendMode: "screen" }}>
      {DUST.map((d, i) => {
        const y = ((((d.y - f * d.v) % 1180) + 1180) % 1180) - 50;
        const x = d.x + Math.sin((f + d.ph * 10) / (80 + d.ph)) * 24;
        const near = Math.hypot(x - 960, y - 380) < 520 ? 1 : 0.45;
        const tw = 0.6 + 0.4 * Math.sin(f / 13 + d.ph);
        return <circle key={i} cx={x} cy={y} r={d.r * (1 + finale * 0.4)} fill={GOLD_HI} opacity={(base + finale * 0.6 * near) * tw} style={{ filter: `drop-shadow(0 0 ${3 + d.r}px ${GOLD})` }} />;
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
export const GoldenHourFilm: React.FC = () => {
  const f = useCurrentFrame();
  const { s, tx, ty } = camera(f);
  const bloom = iv(f, [C.doors, C.doors + 160], [0, 1]) * (1 - 0.35 * iv(f, [C.lockup, C.lockup + 60], [0, 1]));
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      <RoughDefs />
      <Painting />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "960px 540px" }}>
        <Sketch />
        <ArmillaryBack />
        <Emblem />
        <ArmillaryFront />
        <Beam />
        {CARDS.map((c, i) => (
          <Card key={c.seed} i={i} />
        ))}
        <Constellation />
      </div>
      <Interface />
      {/* sunrise bloom washing over the frame */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(255,236,190,0.38) 0%, rgba(255,210,140,0.12) 35%, transparent 65%)", opacity: bloom, mixBlendMode: "screen" }} />
      <Dust />
      <Caption text="THE FUTURE IS FULL OF POSSIBILITIES." at={C.caption1} out={C.caption1Out} size={78} />
      <Caption text="TRADE WHAT HAPPENS NEXT." at={C.caption2} out={C.caption2Out} />
      <Lockup />
      {/* paper grain over everything + soft vignette */}
      <Img src={staticFile("polymate/golden/paper.png")} style={{ position: "absolute", inset: 0, width: 1920, height: 1080, mixBlendMode: "overlay", opacity: 0.55 }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(40,24,12,0.32) 100%)" }} />
    </AbsoluteFill>
  );
};
