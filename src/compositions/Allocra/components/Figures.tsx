import { random, useCurrentFrame } from "remotion";

/**
 * Stylised, cinematic people: backlit silhouettes lit by screen glow.
 * (Faces are intentionally not photoreal — the light does the acting.)
 */

/** Female profile facing right, long hair. Drawn in a 600×800 box. */
export const Profile: React.FC<{
  height: number;
  glow?: number; // 0..1 screen light on the face
  glowColor?: string;
  rim?: string; // rim light colour on the back edge
  tilt?: number; // degrees, negative = looking up
  style?: React.CSSProperties;
  id: string;
}> = ({
  height,
  glow = 1,
  glowColor = "#9CC8FF",
  rim = "#FFB070",
  tilt = 0,
  style,
  id,
}) => {
  const face =
    "M300 115 C 345 118, 378 160, 382 215 C 384 240, 392 262, 404 285 C 414 303, 426 322, 420 334 C 414 342, 400 344, 398 352 C 402 362, 410 368, 404 377 C 400 384, 404 392, 400 401 C 396 410, 404 420, 398 436 C 392 452, 372 460, 352 462 C 336 464, 330 476, 336 500 C 342 530, 352 590, 372 640 C 430 690, 520 730, 600 800 L 0 800 C 40 720, 90 650, 120 560 C 140 470, 120 360, 150 250 C 175 165, 235 112, 300 115 Z";
  return (
    <svg
      width={(height * 600) / 800}
      height={height}
      viewBox="0 0 600 800"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.78" cy="0.48" r="0.42">
          <stop offset="0" stopColor={glowColor} stopOpacity={0.9 * glow} />
          <stop offset="0.5" stopColor={glowColor} stopOpacity={0.35 * glow} />
          <stop offset="1" stopColor={glowColor} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}-rim`} x1="0" x2="1">
          <stop offset="0" stopColor={rim} stopOpacity={0.9} />
          <stop offset="0.25" stopColor={rim} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={face} />
        </clipPath>
      </defs>
      <g transform={`rotate(${tilt} 330 470)`}>
        <path d={face} fill="#07090C" />
        <g clipPath={`url(#${id}-clip)`}>
          <rect width={600} height={800} fill={`url(#${id}-glow)`} />
          <rect
            width={600}
            height={800}
            fill={`url(#${id}-rim)`}
            opacity={0.6}
          />
        </g>
        {/* Hair strands catching the rim light */}
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M${150 - i * 8} ${260 + i * 30} C ${120 - i * 10} ${400}, ${130 - i * 6} ${560}, ${90 - i * 12} ${720}`}
            stroke={rim}
            strokeOpacity={0.35 - i * 0.07}
            strokeWidth={3}
            fill="none"
          />
        ))}
        {/* Face edge highlight from the screen */}
        <path
          d="M382 215 C 384 240, 392 262, 404 285 C 414 303, 426 322, 420 334 C 414 342, 400 344, 398 352 C 402 362, 410 368, 404 377 C 400 384, 404 392, 400 401 C 396 410, 404 420, 398 436"
          stroke={glowColor}
          strokeOpacity={0.85 * glow}
          strokeWidth={4}
          fill="none"
        />
      </g>
    </svg>
  );
};

/** A phone seen edge-on/at an angle: a glowing slab. */
export const PhoneGlow: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number;
  on?: number;
  color?: string;
}> = ({ x, y, w = 70, h = 130, rot = -20, on = 1, color = "#CFE4FF" }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: x - 260,
        top: y - 260,
        width: 520,
        height: 520,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}55 0%, transparent 60%)`,
        opacity: on,
        mixBlendMode: "screen",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 12,
        background:
          on > 0.05 ? `linear-gradient(160deg, #FFFFFF, ${color})` : "#0B0D10",
        boxShadow: `0 0 ${40 * on}px ${color}`,
        transform: `rotate(${rot}deg)`,
        border: "3px solid #0B0D10",
        opacity: 0.4 + 0.6 * Math.max(on, 0.2),
      }}
    />
  </>
);

/** Rows of head-and-shoulder silhouettes, each lit by a phone. */
export const Crowd: React.FC<{ rows?: number; color?: string }> = ({
  rows = 3,
  color = "#7FB0FF",
}) => {
  const frame = useCurrentFrame();
  const people: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const scale = 0.55 + r * 0.35;
    const y = 420 + r * 190;
    const count = 9 - r * 2;
    for (let i = 0; i < count; i++) {
      const x =
        ((i + 0.5) / count) * 1920 + (random(`cx-${r}-${i}`) - 0.5) * 120;
      const sway = Math.sin(frame / 40 + i + r) * 4;
      const lit = random(`cl-${r}-${i}`) > 0.25;
      const flick = 0.75 + 0.25 * Math.sin(frame / (6 + (i % 4)) + i);
      people.push(
        <g
          key={`${r}-${i}`}
          transform={`translate(${x + sway} ${y}) scale(${scale})`}
        >
          <ellipse cx={0} cy={-150} rx={62} ry={78} fill="#05070C" />
          <path
            d="M-150 120 C -140 -10, -80 -60, 0 -66 C 80 -60, 140 -10, 150 120 Z"
            fill="#05070C"
          />
          {lit ? (
            <>
              <ellipse
                cx={0}
                cy={-130}
                rx={48}
                ry={58}
                fill={color}
                opacity={0.18 * flick}
              />
              <rect
                x={-26}
                y={-40}
                width={52}
                height={86}
                rx={8}
                fill="#E8F1FF"
                opacity={0.85 * flick}
              />
            </>
          ) : null}
        </g>,
      );
    }
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {people}
    </svg>
  );
};
