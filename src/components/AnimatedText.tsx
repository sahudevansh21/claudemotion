import { type SpringConfig, useCurrentFrame, useVideoConfig } from "remotion";
import { enterUp, springIn, SPRINGS } from "../lib/animation";
import { stagger } from "../lib/timing";

type Props = {
  text: string;
  /** Animate per word or per character. */
  by?: "word" | "char";
  /** Frame (relative to the parent Sequence) when the first unit starts. */
  delay?: number;
  /** Frames between consecutive units. */
  step?: number;
  /** Vertical travel in px. */
  distance?: number;
  blur?: number;
  config?: Partial<SpringConfig>;
  style?: React.CSSProperties;
};

/**
 * Kinetic typography: splits text into words or characters and springs each
 * one in with a stagger (rise + fade + de-blur).
 *
 *   <AnimatedText text="Hello world" by="char" delay={10} step={2} />
 */
export const AnimatedText: React.FC<Props> = ({
  text,
  by = "word",
  delay = 0,
  step = by === "char" ? 2 : 5,
  distance = 50,
  blur = 10,
  config = SPRINGS.smooth,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const units = by === "char" ? Array.from(text) : text.split(" ");

  return (
    <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
      {units.map((unit, i) => {
        const t = springIn(frame, fps, {
          delay: stagger(i, step, delay),
          config,
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              ...enterUp(t, distance, blur),
            }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
