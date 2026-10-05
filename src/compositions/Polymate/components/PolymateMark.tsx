import { interpolate, random } from "remotion";
import { PM } from "../brand";

/**
 * Vector re-drawing of the Polymate mark: a gold laurel branch wrapped around
 * a slanted lapis tile that sits on a marble tile.
 *
 * `assemble` (0 → 1) drives the build: tiles slide/rotate into place and each
 * laurel leaf spins in from a scattered position, landing in sequence.
 * `mono` renders a single-colour version (for use on coloured tiles).
 */
export const PolymateMark: React.FC<{
  size: number;
  assemble?: number;
  mono?: string;
  style?: React.CSSProperties;
}> = ({ size, assemble = 1, mono, style }) => {
  const clamp = {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  } as const;
  const ease = (x: number) => 1 - Math.pow(1 - x, 4);

  // Laurel stem: quadratic bezier from bottom to top, bowing left.
  const P0 = { x: 74, y: 182 };
  const P1 = { x: -6, y: 118 };
  const P2 = { x: 56, y: 22 };
  const at = (s: number) => ({
    x: (1 - s) ** 2 * P0.x + 2 * (1 - s) * s * P1.x + s ** 2 * P2.x,
    y: (1 - s) ** 2 * P0.y + 2 * (1 - s) * s * P1.y + s ** 2 * P2.y,
  });
  const tangent = (s: number) => {
    const dx = 2 * (1 - s) * (P1.x - P0.x) + 2 * s * (P2.x - P1.x);
    const dy = 2 * (1 - s) * (P1.y - P0.y) + 2 * s * (P2.y - P1.y);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };

  const LEAVES = 9;
  const tileT = ease(interpolate(assemble, [0.15, 0.75], [0, 1], clamp));
  const marbleT = ease(interpolate(assemble, [0.25, 0.85], [0, 1], clamp));
  const stemT = interpolate(assemble, [0, 0.5], [0, 1], clamp);

  const gold = mono ?? "url(#pm-gold)";
  const lapis = mono ?? "url(#pm-lapis)";
  const marble = mono ? "transparent" : "url(#pm-marble)";

  return (
    <svg
      width={size}
      height={(size * 200) / 240}
      viewBox="0 0 240 200"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id="pm-lapis" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PM.lapisLight} />
          <stop offset="0.55" stopColor={PM.lapis} />
          <stop offset="1" stopColor={PM.lapisDeep} />
        </linearGradient>
        <linearGradient id="pm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PM.goldLight} />
          <stop offset="1" stopColor={PM.gold} />
        </linearGradient>
        <linearGradient id="pm-marble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor={PM.marbleShade} />
        </linearGradient>
      </defs>

      {/* Marble tile (behind) */}
      <g
        opacity={marbleT}
        transform={`translate(${(1 - marbleT) * 40} ${(1 - marbleT) * 30})`}
      >
        <g transform="translate(104 70) skewX(-12)">
          <rect
            width={112}
            height={104}
            rx={20}
            fill={marble}
            stroke={mono ?? "#CDBF9F"}
            strokeWidth={mono ? 6 : 2}
          />
        </g>
      </g>

      {/* Lapis tile */}
      <g
        transform={`translate(135 85) rotate(${(1 - tileT) * -35}) scale(${0.4 + 0.6 * tileT}) translate(-135 -85)`}
        opacity={tileT}
      >
        <g transform="translate(76 26) skewX(-12)">
          <rect width={120} height={110} rx={22} fill={lapis} />
          {mono ? null : (
            <g
              stroke="#FFFFFF"
              strokeOpacity={0.18}
              fill="none"
              strokeWidth={2}
            >
              <path d="M18 92 C 40 70, 58 74, 72 50 S 98 24, 112 18" />
              <path d="M34 104 C 60 88, 82 92, 104 64" />
              <path d="M10 40 C 26 34, 38 22, 52 8" />
            </g>
          )}
        </g>
      </g>

      {/* Laurel stem */}
      <path
        d={`M${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
        fill="none"
        stroke={gold}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - stemT}
      />

      {/* Laurel leaves: spin in from scattered positions */}
      {new Array(LEAVES).fill(0).map((_, i) => {
        const s = 0.1 + (i / (LEAVES - 1)) * 0.86;
        const p = at(s);
        const angle = tangent(s);
        const side = i % 2 === 0 ? -1 : 1;
        const lt = ease(
          interpolate(
            assemble,
            [0.05 + i * 0.05, 0.45 + i * 0.05],
            [0, 1],
            clamp,
          ),
        );
        const scatterR = 120 + random(`leaf-r-${i}`) * 80;
        const scatterA = random(`leaf-a-${i}`) * Math.PI * 2;
        const dx = Math.cos(scatterA) * scatterR * (1 - lt);
        const dy = Math.sin(scatterA) * scatterR * (1 - lt);
        const spin = (1 - lt) * (random(`leaf-s-${i}`) > 0.5 ? 220 : -220);
        const leafAngle = angle + side * 34;
        return (
          <g
            key={i}
            opacity={lt}
            transform={`translate(${p.x + dx} ${p.y + dy}) rotate(${leafAngle + spin}) scale(${0.6 + 0.4 * lt})`}
          >
            <path d="M0 0 C 7 -9, 21 -9, 30 0 C 21 9, 7 9, 0 0 Z" fill={gold} />
          </g>
        );
      })}
    </svg>
  );
};
