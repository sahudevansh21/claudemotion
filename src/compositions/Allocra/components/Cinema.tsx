import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * Per-shot colour grade ("LUT"), built from CSS filters + tint layers:
 *  - filter: contrast / saturation / brightness curve
 *  - shadows tint (multiply) and highlights tint (screen / soft-light)
 *  - halation (bright glow), vignette, per-frame film grain
 */
export type GradeName =
  | "night"
  | "cold"
  | "tension"
  | "dawn"
  | "warmUI"
  | "brand"
  | "none";

const GRADES: Record<
  GradeName,
  {
    filter: string;
    shadow: string;
    highlight: string;
    hlBlend: "screen" | "soft-light";
    vignette: number;
    grain: number;
    halation: number;
  }
> = {
  // Act 1: teal-orange night, crushed blacks
  night: {
    filter: "contrast(1.18) saturate(0.85) brightness(0.95)",
    shadow: "rgba(40,90,130,0.28)",
    highlight: "rgba(255,140,70,0.08)",
    hlBlend: "screen",
    vignette: 0.6,
    grain: 1,
    halation: 0.15,
  },
  // Crowd / apps: cold electric blue
  cold: {
    filter: "contrast(1.22) saturate(1.05) brightness(0.92)",
    shadow: "rgba(5,20,70,0.6)",
    highlight: "rgba(90,140,255,0.12)",
    hlBlend: "screen",
    vignette: 0.7,
    grain: 1,
    halation: 0.4,
  },
  // Eye + girl: bleach-bypass, desaturated cyan — tension peak
  tension: {
    filter: "contrast(1.3) saturate(0.55) brightness(0.9)",
    shadow: "rgba(20,45,50,0.5)",
    highlight: "rgba(200,230,230,0.06)",
    hlBlend: "soft-light",
    vignette: 0.8,
    grain: 1.2,
    halation: 0.25,
  },
  // Act 2: golden dawn, lifted warm shadows
  dawn: {
    filter: "contrast(1.06) saturate(1.08) brightness(1.02)",
    shadow: "rgba(60,25,10,0.35)",
    highlight: "rgba(255,175,95,0.18)",
    hlBlend: "screen",
    vignette: 0.45,
    grain: 0.8,
    halation: 0.5,
  },
  // UI inserts: warm, clean, gentle bloom
  warmUI: {
    filter: "contrast(1.08) saturate(1.05) brightness(1.0)",
    shadow: "rgba(40,15,8,0.25)",
    highlight: "rgba(255,190,140,0.10)",
    hlBlend: "screen",
    vignette: 0.5,
    grain: 0.6,
    halation: 0.35,
  },
  // End card: brand red, rich, filmic
  brand: {
    filter: "contrast(1.08) saturate(1.05)",
    shadow: "rgba(60,8,4,0.25)",
    highlight: "rgba(255,200,160,0.06)",
    hlBlend: "soft-light",
    vignette: 0.55,
    grain: 0.9,
    halation: 0.2,
  },
  none: {
    filter: "none",
    shadow: "transparent",
    highlight: "transparent",
    hlBlend: "screen",
    vignette: 0,
    grain: 0.6,
    halation: 0,
  },
};

export const Cinema: React.FC<{
  grade: GradeName;
  children: React.ReactNode;
}> = ({ grade, children }) => {
  const frame = useCurrentFrame();
  const g = GRADES[grade];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: g.filter }}>
        {children}
        {/* Halation: blurred, brightened copy of highlights approximated by a warm glow layer */}
        {g.halation > 0 ? (
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse at 50% 45%, rgba(255,120,80,${0.12 * g.halation}) 0%, transparent 60%)`,
              mixBlendMode: "screen",
            }}
          />
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill
        style={{ background: g.shadow, mixBlendMode: "multiply" }}
      />
      <AbsoluteFill
        style={{ background: g.highlight, mixBlendMode: g.hlBlend }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${g.vignette}) 100%)`,
        }}
      />
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1 * g.grain,
          mixBlendMode: "overlay",
        }}
      >
        <filter id={`al-grain-${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            seed={frame % 113}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#al-grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** 2.39:1 letterbox on the 1920×1080 design canvas (bars ≈ 138 px). */
export const LETTERBOX = Math.round((1080 - 1920 / 2.39) / 2);

export const Letterbox: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: LETTERBOX,
        background: "#000",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: LETTERBOX,
        background: "#000",
      }}
    />
  </>
);
