import { useCurrentFrame } from "remotion";
import { TN, TN_FONTS } from "../brand";
import { ez, lerp } from "../timeline";

/**
 * Documentary-style super, bottom-left, with the brand's violet dot.
 * Fades in at `start` and out over the last 8 frames of the scene.
 */
export const Caption: React.FC<{
  text: string;
  start: number;
  end: number;
  color?: string;
  maxWidth?: number;
}> = ({ text, start, end, color = TN.white, maxWidth = 1500 }) => {
  const frame = useCurrentFrame();
  const inT = ez(frame, start, 14);
  const outT = 1 - ez(frame, end - 8, 8);
  const o = inT * outT;
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        bottom: 110,
        display: "flex",
        alignItems: "baseline",
        gap: 16,
        maxWidth,
        lineHeight: 1.15,
        opacity: o,
        transform: `translateY(${lerp(inT, 18, 0)}px)`,
        fontFamily: TN_FONTS.brand,
        fontWeight: 700,
        fontSize: 56,
        color,
        textShadow: "0 2px 24px rgba(0,0,0,0.35)",
        letterSpacing: -0.5,
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: TN.violet,
          boxShadow: "0 0 18px rgba(155,92,240,0.8)",
          transform: "translateY(-2px)",
          flexShrink: 0,
        }}
      />
      <span>{text}</span>
    </div>
  );
};
