import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../config/theme";

type Blob = {
  color: string;
  x: number;
  y: number;
  size: number;
  speed: number;
};

const DEFAULT_BLOBS: Blob[] = [
  { color: COLORS.primary, x: 0.2, y: 0.3, size: 0.55, speed: 0.6 },
  { color: COLORS.secondary, x: 0.8, y: 0.7, size: 0.5, speed: 0.45 },
  { color: COLORS.accent, x: 0.6, y: 0.15, size: 0.35, speed: 0.8 },
];

/**
 * Full-frame animated backdrop: slowly drifting colour blobs, a subtle grid
 * and a vignette. Fills the whole composition regardless of aspect ratio.
 */
export const Background: React.FC<{
  blobs?: Blob[];
  base?: string;
  grid?: boolean;
}> = ({ blobs = DEFAULT_BLOBS, base = COLORS.background, grid = true }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const span = Math.max(width, height);

  return (
    <AbsoluteFill style={{ backgroundColor: base, overflow: "hidden" }}>
      {blobs.map((b, i) => {
        const dx = Math.sin(t * b.speed + i * 2) * 0.06;
        const dy = Math.cos(t * b.speed * 0.8 + i) * 0.06;
        const size = span * b.size;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (b.x + dx) * width - size / 2,
              top: (b.y + dy) * height - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: `radial-gradient(circle, color-mix(in srgb, ${b.color} 33%, transparent) 0%, transparent 65%)`,
            }}
          />
        );
      })}
      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: `${span / 24}px ${span / 24}px`,
            backgroundPosition: `${(t * 12) % (span / 24)}px 0px`,
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
