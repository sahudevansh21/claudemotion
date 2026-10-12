import { random, useCurrentFrame } from "remotion";

/** Mix two #rrggbb colours (t = 0 → a, 1 → b). */
export const mixHex = (a: string, b: string, t: number): string => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) =>
    Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, t))),
  );
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const W = 1920;
const H = 1080;
const F = 900; // focal length (design px)

export type LandscapeProps = {
  /** Sky gradient top → horizon. */
  sky?: [string, string, string];
  horizonY?: number;
  sun?: { x: number; y: number; intensity?: number };
  /** Forward camera travel in world units (dolly). */
  camZ?: number;
  /** Lateral camera offset in world units (truck). */
  camX?: number;
  /** Camera height above the crop in world units. */
  camH?: number;
  rows?: boolean;
  grass?: boolean;
  /** Extra slide of the hills (px) for parallax. */
  hillShift?: number;
  /** 0 = golden hour, 1 = dusk (cooler, darker ground). */
  dusk?: number;
};

const ridge = (x: number, seed: number, amp: number, base: number) =>
  base -
  amp *
    (0.55 * Math.sin(x * 0.0021 + seed) +
      0.3 * Math.sin(x * 0.0057 + seed * 2.1) +
      0.15 * Math.sin(x * 0.013 + seed * 3.7) +
      0.6);

const hillPath = (seed: number, amp: number, base: number, shift: number) => {
  let d = `M -40 ${H}`;
  for (let x = -40; x <= W + 40; x += 24) {
    d += ` L ${x} ${ridge(x + shift, seed, amp, base).toFixed(1)}`;
  }
  return d + ` L ${W + 40} ${H} Z`;
};

/**
 * Procedural golden-hour farmland — the stand-in for the reference's
 * live-action fields. Everything is a pure function of the frame.
 */
export const Landscape: React.FC<LandscapeProps> = ({
  sky = ["#9DB6C9", "#F3D7A6", "#F6B66C"],
  horizonY = 560,
  sun = { x: 1240, y: 500, intensity: 1 },
  camZ = 0,
  camX = 0,
  camH = 1.1,
  rows = true,
  grass = true,
  hillShift = 0,
  dusk = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const intensity = sun.intensity ?? 1;

  // Crop plants in perspective, far → near.
  const plants: React.ReactNode[] = [];
  if (rows) {
    const SPACING = 0.75;
    const zOffset = camZ % SPACING;
    for (let k = 60; k >= 0; k--) {
      const z = 0.9 + k * SPACING - zOffset;
      if (z < 0.6) continue;
      const scale = F / z;
      const y = horizonY + camH * scale;
      if (y > H + 80) continue;
      const fog = Math.min(1, Math.pow(z / 40, 0.7));
      const base = mixHex(
        mixHex("#3F7A22", "#26401E", dusk),
        mixHex("#B9AE78", "#857A70", dusk),
        fog,
      );
      const rim = mixHex("#F9D27A", "#E59A57", dusk);
      for (let r = -14; r <= 14; r++) {
        const wx = r * 0.95 - camX;
        const sx = W / 2 + wx * scale;
        if (sx < -200 || sx > W + 200) continue;
        const s = 0.34 * scale * (0.85 + 0.3 * random(`ps-${k}-${r}`));
        if (s < 1.2) continue;
        const jitter = (random(`pj-${k}-${r}`) - 0.5) * 0.25 * scale;
        const sway = Math.sin(t * 1.4 + r * 0.7 + k * 0.4) * 0.08;
        const tone = random(`pt-${k}-${r}`);
        const fill = mixHex(
          base,
          mixHex("#6FAE3A", "#3C5A2A", dusk),
          (1 - fog) * tone * 0.55,
        );
        const leaves = s > 10 ? 7 : s > 4 ? 5 : 3;
        plants.push(
          <g
            key={`${k}-${r}`}
            transform={`translate(${(sx + jitter).toFixed(1)} ${y.toFixed(1)}) rotate(${(sway * 30).toFixed(2)})`}
          >
            {new Array(leaves).fill(0).map((_, j) => {
              const a =
                -80 +
                (160 * j) / (leaves - 1) +
                (random(`pa-${k}-${r}-${j}`) - 0.5) * 20;
              const len = s * (0.55 + 0.35 * random(`pl-${k}-${r}-${j}`));
              return (
                <ellipse
                  key={j}
                  cx={0}
                  cy={-len * 0.5}
                  rx={s * 0.13}
                  ry={len * 0.5}
                  fill={fill}
                  stroke={s > 8 ? rim : undefined}
                  strokeWidth={s * 0.025}
                  strokeOpacity={0.55 * (1 - fog)}
                  transform={`rotate(${a.toFixed(1)})`}
                />
              );
            })}
          </g>,
        );
      }
    }
  }

  const ground = [
    mixHex("#C4AB7A", "#7E6E66", dusk),
    mixHex("#7A5E3C", "#4A3B30", dusk),
    mixHex("#3E2C1C", "#241A14", dusk),
  ];

  return (
    <>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="tn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky[0]} />
            <stop
              offset={String(Math.max(0.2, horizonY / H - 0.18))}
              stopColor={sky[1]}
            />
            <stop offset={String(horizonY / H)} stopColor={sky[2]} />
            <stop offset="1" stopColor={sky[2]} />
          </linearGradient>
          <linearGradient id="tn-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ground[0]} />
            <stop offset="0.35" stopColor={ground[1]} />
            <stop offset="1" stopColor={ground[2]} />
          </linearGradient>
          <radialGradient id="tn-sunglow">
            <stop
              offset="0"
              stopColor="#FFF6DC"
              stopOpacity={0.95 * intensity}
            />
            <stop
              offset="0.12"
              stopColor="#FFE3A3"
              stopOpacity={0.75 * intensity}
            />
            <stop
              offset="0.45"
              stopColor="#F6B66C"
              stopOpacity={0.28 * intensity}
            />
            <stop offset="1" stopColor="#F6B66C" stopOpacity={0} />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#tn-sky)" />
        {/* Sun glow sits behind the hills so it sets "into" them */}
        <circle cx={sun.x} cy={sun.y} r={700} fill="url(#tn-sunglow)" />
        <circle
          cx={sun.x}
          cy={sun.y}
          r={46}
          fill="#FFF8E6"
          opacity={0.95 * intensity}
        />

        <path
          d={hillPath(1.2, 70, horizonY - 40, hillShift * 0.3)}
          fill={mixHex("#C7AE86", "#8F8597", dusk)}
          opacity={0.85}
        />
        <path
          d={hillPath(3.4, 55, horizonY - 8, hillShift * 0.6)}
          fill={mixHex("#8E8B55", "#5B5A5A", dusk)}
        />
        <rect
          x={0}
          y={horizonY}
          width={W}
          height={H - horizonY}
          fill="url(#tn-ground)"
        />

        {plants}

        {/* Low sun scatters over everything in front of it */}
        <circle
          cx={sun.x}
          cy={sun.y + 60}
          r={520}
          fill="url(#tn-sunglow)"
          opacity={0.25}
          style={{ mixBlendMode: "screen" }}
        />

        {/* Lens flare ghosts along the sun → centre axis */}
        {[0.35, 0.7, 1.15, 1.5].map((k, i) => {
          const gx = sun.x + (W / 2 - sun.x) * k * 1.6;
          const gy = sun.y + (H / 2 - sun.y) * k * 1.6;
          return (
            <circle
              key={i}
              cx={gx}
              cy={gy}
              r={[60, 26, 90, 40][i]}
              fill={["#FFD58A", "#FFFFFF", "#F2A65A", "#BFE3FF"][i]}
              opacity={0.1 * intensity}
              style={{ mixBlendMode: "screen" }}
            />
          );
        })}
      </svg>
      {grass ? <GrassLayer dusk={dusk} /> : null}
    </>
  );
};

/** Out-of-focus foreground grass; render it last so it sits in front. */
export const GrassLayer: React.FC<{ dusk?: number; density?: number }> = ({
  dusk = 0,
  density = 70,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  // Foreground grass blades (out of focus).
  const blades: React.ReactNode[] = [];
  {
    for (let i = 0; i < density; i++) {
      const x = random(`gx-${i}`) * (W + 200) - 100;
      const h = 160 + random(`gh-${i}`) * 300;
      const w = 10 + random(`gw-${i}`) * 14;
      const bend = (random(`gb-${i}`) - 0.5) * 140 + Math.sin(t * 1.6 + i) * 18;
      const y0 = H + 30;
      const tipX = x + bend;
      const tipY = y0 - h;
      blades.push(
        <path
          key={i}
          d={`M ${x - w / 2} ${y0} Q ${x + bend * 0.3} ${y0 - h * 0.55} ${tipX} ${tipY} Q ${x + bend * 0.3 + w * 0.3} ${y0 - h * 0.5} ${x + w / 2} ${y0} Z`}
          fill={
            i % 3 === 0
              ? mixHex("#5E7A26", "#3B4A2A", dusk)
              : mixHex("#2E4A18", "#1E2A16", dusk)
          }
        />,
      );
    }
  }

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="tn-dof" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <g filter="url(#tn-dof)">{blades}</g>
    </svg>
  );
};
