import { AbsoluteFill, random } from "remotion";
import { CL } from "../Collatera/brand";
import { Cursor, cursorPath, ez, Film, Glyph, IO, K, lerp, Letters, LogoEnd, MONO, PIX, SANS, Tile, useT, Words } from "./kit";
import TL from "./v3.json";

/**
 * V3 · "Watch the price. Watch the oracle." (content plan Day 4).
 * 20 s · 1080p60 · recreates the locked Krea 3 reference (ANALYSIS.md §1):
 * ransom-note title that snaps clean, headline reflow over a bar chart with a
 * cursor-dragged bar, pill → node + dashed link, chart region fill, a
 * leaderboard-style card with the cursor on the highlighted row, motion-blur
 * text over drifting tiles, logo. All values SIMULATED / ILLUSTRATIVE.
 */
const INK = K.ink;
const GREEN = "#1E9B4F";
const T = { fontFamily: SANS, fontWeight: 500, letterSpacing: -1.6, color: INK } as const;

const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "#FFFFFF",
      backgroundImage: "linear-gradient(rgba(0,48,31,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,48,31,0.06) 1px, transparent 1px)",
      backgroundSize: "120px 120px",
    }}
  />
);

const FONTS = [PIX, "Georgia, serif", MONO, SANS, "Impact, sans-serif", "'Courier New', monospace"];
const COLS = [INK, CL.lime, "#E2A23B", "#2470FF", "#B6509E", "#111111"];

const Ransom: React.FC = () => {
  const t = useT();
  const word = "ORACLE";
  const snap = ez(t, 1.35, 1.6);
  const fly = ez(t, 1.2, 2.2, IO);
  const tiles: [string, number, number][] = [
    ["tQQQ", 300, 230], ["oracle", 1500, 200], ["tSPY", 1580, 760], ["price", 380, 780], ["tNVDA", 980, 150], ["buffer", 1180, 880], ["tAAPL", 160, 520], ["ltv", 1720, 470],
  ];
  return (
    <AbsoluteFill>
      <Grid />
      {tiles.map(([k, x, y], i) => {
        const p = ez(t, i * 0.08, 0.5 + i * 0.08);
        const dx = (x - 960) * fly * 1.4;
        const dy = (y - 540) * fly * 1.4;
        return (
          <div key={k} style={{ position: "absolute", left: x + dx, top: y + dy, opacity: p * (1 - fly), transform: `rotate(${(random(`r${i}`) - 0.5) * 24}deg)` }}>
            {k.startsWith("t") ? (
              <div style={{ padding: "12px 18px", borderRadius: 12, background: "#FFFFFF", boxShadow: "0 14px 30px rgba(0,48,31,0.14)", fontFamily: MONO, fontSize: 24, color: INK }}>{k}</div>
            ) : (
              <Tile light size={84}>
                <Glyph kind={k} size={40} color={GREEN} />
              </Tile>
            )}
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: lerp(snap, 18, 4) }}>
          {Array.from(word).map((ch, i) => {
            const at = 0.08 + i * 0.12;
            const p = ez(t, at, at + 0.2);
            const f = Math.floor((t * 10 + i * 3) % FONTS.length);
            const clean = snap > 0.5;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: p,
                  fontFamily: clean ? PIX : FONTS[f],
                  fontWeight: 700,
                  fontSize: clean ? 150 : 120 + (random(`s${i}-${f}`) * 60),
                  color: clean ? INK : COLS[(f + i) % COLS.length],
                  background: clean ? "transparent" : i % 2 ? "#F1F5F0" : "transparent",
                  padding: clean ? 0 : "0 8px",
                  transform: clean ? "none" : `rotate(${(random(`rr${i}-${f}`) - 0.5) * 18}deg) translateY(${(random(`ry${i}-${f}`) - 0.5) * 30}px)`,
                  boxShadow: !clean && i % 2 ? "0 10px 20px rgba(0,0,0,0.1)" : "none",
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

const BARS: [string, number, string][] = [
  ["tSPY", 12, "#2470FF"],
  ["tAAPL", 7, "#B6509E"],
  ["tQQQ", 89, GREEN],
  ["tNVDA", 22, "#E2A23B"],
  ["tTSLA", 4, "#7A8F84"],
];
const Bars: React.FC = () => {
  const t = useT();
  const l2 = ez(t, 0.5, 0.9, IO);
  const grow = ez(t, 0.2, 1.0);
  const drag = ez(t, 1.15, 2.2, IO);
  const c = cursorPath(t, [
    [0, 1300, 1000],
    [1.0, 1035, 700],
    [2.2, 1035, 390],
  ], [1.1]);
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{ position: "absolute", top: lerp(l2, 150, 110), width: 1920, textAlign: "center", ...T, fontSize: lerp(l2, 84, 64) }}>Watch the price.</div>
      <div style={{ position: "absolute", top: 190, width: 1920, textAlign: "center", ...T, fontSize: 84 }}>
        <Words text="Watch the oracle." at={0.55} hi={["oracle"]} hiColor={GREEN} />
      </div>
      <div style={{ position: "absolute", left: 460, top: 330, width: 1000, height: 600, display: "flex", alignItems: "flex-end", gap: 50 }}>
        {BARS.map(([k, v, col]) => {
          const sel = k === "tQQQ";
          const h = sel ? lerp(drag, 160, 460) * grow : (v / 89) * 460 * grow + 40;
          return (
            <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              {sel ? <div style={{ fontFamily: MONO, fontSize: 26, color: GREEN, opacity: drag }}>{Math.round(lerp(drag, 30, 89))} min</div> : null}
              <div style={{ position: "relative", width: 150, height: h, border: `3px solid ${col}`, borderRadius: 12, background: sel ? "rgba(30,155,79,0.22)" : "transparent" }}>
                {sel
                  ? [
                      [-7, -7],
                      [143, -7],
                    ].map(([x, y], j) => <div key={j} style={{ position: "absolute", left: x, top: y, width: 12, height: 12, background: "#FFFFFF", border: `2px solid ${GREEN}` }} />)
                  : null}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 22, color: "#5D6F64" }}>{k}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 460, top: 960, fontFamily: MONO, fontSize: 18, color: "#7A8F84" }}>ORACLE AGE · ILLUSTRATIVE</div>
      <Cursor x={c.x} y={c.y} press={c.press} color="#2470FF" />
    </AbsoluteFill>
  );
};

const Node: React.FC<{ label: string; x: number; y: number; p: number; dark?: boolean; icon?: string }> = ({ label, x, y, p, dark, icon = "oracle" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, display: "flex", alignItems: "center", gap: 14, padding: "16px 26px", borderRadius: 99, background: dark ? INK : "#FFFFFF", color: dark ? "#FFFFFF" : INK, boxShadow: "0 18px 40px rgba(0,48,31,0.16)", fontFamily: SANS, fontWeight: 600, fontSize: 34, whiteSpace: "nowrap" }}>
    <Glyph kind={icon} size={34} color={dark ? CL.lime : GREEN} />
    {label}
  </div>
);
const Nodes: React.FC = () => {
  const t = useT();
  const big = ez(t, 0.2, 0.7) * (1 - ez(t, 1.0, 1.5, IO));
  const line = ez(t, 1.5, 2.2, IO);
  const x1 = lerp(ez(t, 1.0, 1.5, IO), 960, 620);
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{ position: "absolute", left: x1, top: 560, transform: `translate(-50%, -50%) scale(${1 + big * 1.1})` }}>
        <Node label="Oracle age" x={0} y={0} p={ez(t, 0, 0.3)} dark />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line x1={760} y1={560} x2={lerp(line, 760, 1150)} y2={560} stroke={GREEN} strokeWidth={4} strokeDasharray="14 12" />
      </svg>
      <Node label="Last trade" x={1310} y={560} p={ez(t, 2.0, 2.4)} icon="price" />
      <div style={{ position: "absolute", top: 230, width: 1920, textAlign: "center", ...T, fontSize: 80 }}>
        {t > 2.1 ? <Words text="Price moved. Oracle didn't." at={2.1} hi={["didn't."]} hiColor={GREEN} /> : null}
      </div>
    </AbsoluteFill>
  );
};

const Region: React.FC = () => {
  const t = useT();
  const cam = ez(t, 0, 4.2, IO);
  const fill = ez(t, 0.6, 1.4);
  const shrink = ez(t, 2.0, 3.4, IO);
  const W = 1300;
  const H = 560;
  const y = (v: number) => H - ((v - 400) / 100) * H;
  const pts = Array.from({ length: 40 }, (_, i) => [i * (W / 39), 470 + Math.sin(i * 0.5) * 6 + i * 0.4 - shrink * Math.max(0, i - 25) * 3.2]);
  const shown = Math.floor(ez(t, 0.1, 1.2) * pts.length);
  const top = lerp(shrink, y(474), y(450));
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{ position: "absolute", top: 120, width: 1920, textAlign: "center", ...T, fontSize: 72 }}>
        <Words text="Stale price. Smaller buffer." at={0.15} hi={["buffer."]} hiColor={GREEN} />
      </div>
      <div style={{ position: "absolute", left: 310, top: 300, transform: `scale(${1 + cam * 0.08}) translateX(${-cam * 40}px)`, transformOrigin: "70% 60%" }}>
        <svg width={W} height={H + 60} style={{ overflow: "visible" }}>
          <rect x={0} y={top} width={W * fill} height={Math.max(0, y(412.5) - top)} fill="rgba(30,155,79,0.16)" />
          <line x1={0} x2={W} y1={y(412.5)} y2={y(412.5)} stroke="#E0533D" strokeWidth={3} strokeDasharray="10 8" />
          <text x={W - 10} y={y(412.5) + 34} textAnchor="end" fontFamily="JetBrains Mono" fontSize={22} fill="#E0533D">Liquidation 412.50</text>
          {pts.slice(0, shown).map(([x, v], i) => (
            <circle key={i} cx={x} cy={y(v)} r={7} fill={i > 25 && shrink > 0.1 ? "#E2A23B" : GREEN} />
          ))}
          <text x={20} y={top + 50} fontFamily="Inter" fontWeight={600} fontSize={34} fill={GREEN} opacity={fill}>
            Buffer {lerp(shrink, 14.7, 8.6).toFixed(1)}%
          </text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 310, top: 960, fontFamily: MONO, fontSize: 18, color: "#7A8F84" }}>SIMULATED DATA · NOT A LIVE FEED</div>
    </AbsoluteFill>
  );
};

const ROWS: [string, string][] = [
  ["Buffer", "14.7%"],
  ["Oracle age", "89 min"],
  ["LTV", "39.8%"],
  ["Liquidation", "412.50"],
  ["Last", "483.79"],
];
const Board: React.FC = () => {
  const t = useT();
  const hi = t < 0.9 ? 0 : t < 1.6 ? 2 : 1;
  const c = cursorPath(t, [
    [0, 1500, 900],
    [0.9, 1290, 560],
    [1.6, 1290, 470],
    [2.3, 1295, 472],
  ], [2.3]);
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{ position: "absolute", left: 480, top: 150, display: "flex", alignItems: "center", gap: 18, ...T, fontSize: 64 }}>
        <Words text="Position health" at={0.05} />
        <span style={{ fontFamily: MONO, fontSize: 24, color: "#7A8F84", marginLeft: 20 }}>tQQQ / USDCa · SIMULATED</span>
      </div>
      <div style={{ position: "absolute", left: 480, top: 280, width: 960, background: "#FFFFFF", borderRadius: 22, boxShadow: "0 30px 70px rgba(0,48,31,0.14)", padding: "18px 0" }}>
        {ROWS.map(([k, v], i) => {
          const p = ez(t, 0.1 + i * 0.08, 0.45 + i * 0.08);
          const on = i === hi;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", margin: "6px 18px", padding: "18px 26px", borderRadius: 14, background: on ? INK : "transparent", color: on ? "#FFFFFF" : INK, fontFamily: SANS, fontSize: 34, opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
              <span style={{ fontFamily: MONO, fontSize: 24, width: 50, color: on ? CL.lime : "#9AAEA3" }}>{i + 1}</span>
              <span>{k}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO }}>{v}</span>
            </div>
          );
        })}
      </div>
      <Cursor x={c.x} y={c.y} press={c.press} color="#2470FF" />
    </AbsoluteFill>
  );
};

const Fresh: React.FC = () => {
  const t = useT();
  const s = ez(t, 0, 0.6);
  const tiles = ["tQQQ", "tSPY", "tAAPL", "tNVDA", "tTSLA", "oracle", "price", "buffer"];
  return (
    <AbsoluteFill>
      <Grid />
      {tiles.map((k, i) => {
        const x = ((i * 263 + t * 120) % 2100) - 100;
        const y = 160 + (i % 4) * 230 + (i % 2) * 60;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, filter: "blur(2px)", opacity: 0.7 }}>
            {k.startsWith("t") ? (
              <div style={{ padding: "12px 18px", borderRadius: 12, background: "#FFFFFF", boxShadow: "0 14px 30px rgba(0,48,31,0.14)", fontFamily: MONO, fontSize: 24, color: INK }}>{k}</div>
            ) : (
              <Tile light size={84}>
                <Glyph kind={k} size={40} color={GREEN} />
              </Tile>
            )}
          </div>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...T, fontSize: 104, filter: `blur(${(1 - s) * 18}px)`, transform: `translateX(${(1 - s) * 120}px)`, opacity: s }}>
          <Letters text="Freshness checks" at={0.0} step={0.02} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Logo: React.FC = () => <LogoEnd light at={0} line="collatera.buzz" />;

export const CollateraV3: React.FC = () => (
  <Film scenes={TL.scenes} map={{ ransom: Ransom, bars: Bars, nodes: Nodes, region: Region, board: Board, fresh: Fresh, logo: Logo }} audio="collatera-campaign/v3/mix.wav" bg="#FFFFFF" glow={false} />
);
