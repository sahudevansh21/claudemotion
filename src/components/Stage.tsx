import { AbsoluteFill, useVideoConfig } from "remotion";
import { DESIGN } from "../config/video";

/**
 * Lays children out on a fixed 1920x1080 design canvas and scales it to fit
 * the actual composition size (contain). Author layouts in design pixels and
 * they will work at 4K, 720p or other aspect ratios.
 */
export const Stage: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => {
  const { width, height } = useVideoConfig();
  const scale = Math.min(width / DESIGN.width, height / DESIGN.height);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", ...style }}
    >
      <div
        style={{
          position: "relative",
          width: DESIGN.width,
          height: DESIGN.height,
          flexShrink: 0,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
