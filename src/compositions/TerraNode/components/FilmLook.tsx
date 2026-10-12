import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Cinematic finish over every live-action-style shot: warm grade, soft
 * vignette, drifting light leak and per-frame film grain (feTurbulence seeded
 * by the frame number, so it is deterministic).
 */
export const FilmLook: React.FC<{
  warmth?: number;
  leak?: number;
  grain?: number;
  vignette?: number;
}> = ({ warmth = 1, leak = 1, grain = 1, vignette = 1 }) => {
  const frame = useCurrentFrame();
  const leakX = 30 + Math.sin(frame / 40) * 25;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `rgba(255, 170, 80, ${0.1 * warmth})`,
          mixBlendMode: "soft-light",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${leakX}% 10%, rgba(255,190,110,${0.28 * leak}) 0%, rgba(255,140,60,0) 55%)`,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,10,0,${0.45 * vignette}) 100%)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.09 * grain,
          mixBlendMode: "overlay",
        }}
      >
        <filter id={`tn-grain-${frame % 1000}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={frame % 97}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#tn-grain-${frame % 1000})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
