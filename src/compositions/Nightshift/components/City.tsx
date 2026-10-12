import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { ETFS, NS } from "../brand";

/**
 * Procedural night city (stands in for the reference's live-action inserts):
 * three parallax tower layers with lit windows, a ticker ring around the
 * tallest tower (as on the site hero), rain, and light trails on an elevated
 * road. `cam` frames the shot; every value derives from the frame.
 */
type Building = { x: number; w: number; h: number; seed: string };

const layer = (n: number, key: string, minH: number, maxH: number, minW: number, maxW: number): Building[] => {
  const out: Building[] = [];
  let x = -200;
  for (let i = 0; x < 2300 && i < n; i++) {
    const w = minW + random(`${key}w${i}`) * (maxW - minW);
    const h = minH + random(`${key}h${i}`) ** 1.6 * (maxH - minH);
    out.push({ x, w, h, seed: `${key}${i}` });
    x += w + 4 + random(`${key}g${i}`) * 26;
  }
  return out;
};

const FAR = layer(60, "far", 220, 560, 60, 150);
const MID = layer(40, "mid", 260, 700, 90, 200);
const NEAR = layer(20, "near", 160, 520, 160, 300);
const GROUND = 860;

const Tower: React.FC<{ b: Building; fill: string; lit: number; win: number }> = ({ b, fill, lit, win }) => {
  const f = useCurrentFrame();
  const cols = Math.max(2, Math.floor(b.w / win / 2));
  const rows = Math.floor(b.h / win / 2.2);
  const cells: React.ReactNode[] = [];
  for (let r = 1; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = `${b.seed}-${r}-${c}`;
      const on = random(k) < lit;
      if (!on) continue;
      const flicker = random(`${k}f`) < 0.03 && Math.floor(f / 6 + random(`${k}p`) * 10) % 3 === 0;
      const warm = random(`${k}c`) < 0.25;
      cells.push(
        <rect
          key={k}
          x={b.x + (c + 0.5) * (b.w / cols) - win / 2}
          y={GROUND - b.h + r * win * 2.2}
          width={win}
          height={win * 1.2}
          fill={warm ? "#F3C98B" : NS.mint}
          opacity={flicker ? 0.15 : 0.35 + 0.5 * random(`${k}o`)}
        />,
      );
    }
  }
  return (
    <g>
      <rect x={b.x} y={GROUND - b.h} width={b.w} height={b.h + 300} fill={fill} />
      {random(`${b.seed}sp`) < 0.3 ? (
        <rect x={b.x + b.w / 2 - 2} y={GROUND - b.h - 60} width={4} height={60} fill={fill} />
      ) : null}
      {cells}
    </g>
  );
};

export const City: React.FC<{
  cam: { scale: number; x: number; y: number };
  speed?: number;
}> = ({ cam, speed = 1 }) => {
  const f = useCurrentFrame();
  const drift = f * speed;
  const ring = ETFS.map((e) => `${e.sym} ${e.price.toFixed(2)} · CONF ${e.conf}`).join("   ·   ");
  return (
    <AbsoluteFill style={{ background: "#020403", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
          transformOrigin: "50% 60%",
        }}
      >
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="ns-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#020403" />
              <stop offset="0.6" stopColor="#0B1915" />
              <stop offset="1" stopColor="#1A3A30" />
            </linearGradient>
            <radialGradient id="ns-haze" cx="0.55" cy="0.75" r="0.6">
              <stop offset="0" stopColor="rgba(111,240,194,0.28)" />
              <stop offset="1" stopColor="rgba(111,240,194,0)" />
            </radialGradient>
          </defs>
          <rect x={-400} y={-300} width={2720} height={1680} fill="url(#ns-sky)" />
          <rect x={-400} y={-300} width={2720} height={1680} fill="url(#ns-haze)" />
          <g transform={`translate(${-drift * 0.3} 0)`}>
            {FAR.map((b) => (
              <Tower key={b.seed} b={b} fill="#0C1714" lit={0.18} win={4} />
            ))}
          </g>
          {/* Hero tower with the ticker ring */}
          <g transform={`translate(${1060 - drift * 0.55} 0)`}>
            <polygon points={`-70,${GROUND} -46,120 0,20 46,120 70,${GROUND}`} fill="#08110E" />
            <line x1={0} y1={20} x2={0} y2={-140} stroke="#2B4A40" strokeWidth={3} />
            <circle cx={0} cy={-140} r={5} fill={NS.mint} opacity={0.5 + 0.5 * Math.sin(f / 5)} />
            <ellipse cx={0} cy={300} rx={330} ry={86} fill="none" stroke="rgba(185,245,216,0.35)" strokeWidth={2} />
            <ellipse cx={0} cy={300} rx={380} ry={100} fill="none" stroke="rgba(232,160,90,0.4)" strokeWidth={1.5} strokeDasharray="6 10" strokeDashoffset={-f * 2} />
            <path id="ns-ring-path" d="M-330 300 A330 86 0 1 0 330 300 A330 86 0 1 0 -330 300" fill="none" />
            <text fontFamily="'JetBrains Mono', monospace" fontSize={18} letterSpacing={3} fill={NS.mint} opacity={0.85}>
              <textPath href="#ns-ring-path" startOffset={`${(f * 0.4) % 100}%`}>
                {ring}
              </textPath>
            </text>
            <circle cx={0} cy={300} r={46} fill="#0E1A16" stroke={NS.mint} strokeWidth={3} style={{ filter: `drop-shadow(0 0 14px ${NS.glow})` }} />
            <polygon points="0,270 12,300 0,330 -12,300" fill={NS.mint} />
          </g>
          <g transform={`translate(${-drift * 0.6} 0)`}>
            {MID.map((b) => (
              <Tower key={b.seed} b={b} fill="#060D0B" lit={0.28} win={6} />
            ))}
          </g>
          <g transform={`translate(${-drift * 1.1} 0)`}>
            {NEAR.map((b) => (
              <Tower key={b.seed} b={{ ...b, h: b.h * 0.32 }} fill="#010202" lit={0.1} win={8} />
            ))}
          </g>
          {/* Elevated road with light trails */}
          <rect x={-400} y={GROUND} width={2720} height={400} fill="#030605" />
          <rect x={-400} y={GROUND - 6} width={2720} height={6} fill="#22352F" />
          <rect x={-400} y={GROUND + 8} width={2720} height={4} fill="#1C2C27" />
          {Array.from({ length: 34 }, (_, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            const len = 120 + random(`tr${i}`) * 260;
            const v = (14 + random(`tv${i}`) * 22) * dir;
            const x = (((random(`tx${i}`) * 2600 + f * v) % 2600) + 2600) % 2600 - 400;
            const y = GROUND + 22 + (dir > 0 ? 0 : 16) + random(`ty${i}`) * 10;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={len}
                height={3}
                rx={1.5}
                fill={dir > 0 ? "#FF6A4D" : "#FFF4D8"}
                opacity={0.75}
                style={{ filter: "blur(1.5px)" }}
              />
            );
          })}
          {/* Rain */}
          {Array.from({ length: 140 }, (_, i) => {
            const x = random(`rx${i}`) * 2200 - 140;
            const y = ((random(`ry${i}`) * 1300 + f * (38 + random(`rv${i}`) * 20)) % 1300) - 150;
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x - 8}
                y2={y + 46}
                stroke="rgba(200,240,225,0.22)"
                strokeWidth={1.6}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
