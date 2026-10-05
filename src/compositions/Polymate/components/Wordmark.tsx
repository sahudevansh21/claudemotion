import { interpolate } from "remotion";
import { PM, PM_EASE, PM_FONTS } from "../brand";

/**
 * "Polymate" wordmark. Each letter rises from behind a mask with a stagger
 * (the reference's EXPLORE-style letter drop). `frame` is relative to when
 * the reveal should start.
 */
export const Wordmark: React.FC<{
  frame: number;
  size: number;
  color?: string;
  step?: number;
  style?: React.CSSProperties;
}> = ({ frame, size, color = PM.ink, step = 2, style }) => {
  const letters = Array.from("Polymate");
  return (
    <div
      style={{
        display: "flex",
        fontFamily: PM_FONTS.display,
        fontStyle: "italic",
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -size * 0.035,
        lineHeight: 1.25,
        color,
        ...style,
      }}
    >
      {letters.map((ch, i) => {
        const t = interpolate(frame, [i * step, i * step + 12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: PM_EASE.out,
        });
        return (
          // Mask is padded so the italic overhang and descender aren't clipped.
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              padding: `0 ${size * 0.06}px ${size * 0.12}px`,
              margin: `0 ${-size * 0.06}px ${-size * 0.12}px`,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - t) * 110}%) rotate(${(1 - t) * 12}deg)`,
              }}
            >
              {ch}
            </span>
          </span>
        );
      })}
    </div>
  );
};
