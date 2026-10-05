import { Circle, Pie, Rect, Star, Triangle } from "@remotion/shapes";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { useBeat } from "../../../components/Beat";
import { Stage } from "../../../components/Stage";
import { COLORS, FONTS, TYPE } from "../../../config/theme";
import { mix, progress, springIn, SPRINGS } from "../../../lib/animation";
import { seconds, stagger } from "../../../lib/timing";

const SIZE = 220;

export const ShapesScene: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pulse } = useBeat();
  const pieFill = progress(frame, seconds(0.6, fps), seconds(2, fps));

  const shapes: { node: React.ReactNode; label: string; spin: number }[] = [
    {
      node: <Circle radius={SIZE / 2} fill={accentColor} />,
      label: "Circle",
      spin: 0,
    },
    {
      node: (
        <Triangle
          length={SIZE}
          direction="up"
          fill={COLORS.secondary}
          cornerRadius={18}
        />
      ),
      label: "Triangle",
      spin: 40,
    },
    {
      node: (
        <Star
          points={5}
          innerRadius={SIZE * 0.22}
          outerRadius={SIZE / 2}
          fill={COLORS.warm}
          cornerRadius={10}
        />
      ),
      label: "Star",
      spin: 60,
    },
    {
      node: (
        <Rect
          width={SIZE * 0.85}
          height={SIZE * 0.85}
          fill={COLORS.accent}
          cornerRadius={36}
        />
      ),
      label: "Rect",
      spin: -30,
    },
    {
      node: (
        <Pie
          radius={SIZE / 2}
          progress={pieFill}
          fill={COLORS.text}
          closePath
          rotation={-Math.PI / 2}
        />
      ),
      label: "Pie",
      spin: 0,
    },
  ];

  return (
    <Stage>
      <div style={{ position: "absolute", left: 160, top: 150 }}>
        <AnimatedText
          text="Shapes in motion"
          by="word"
          step={4}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: TYPE.h1,
            color: COLORS.text,
            letterSpacing: -2,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          top: 480,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {shapes.map((shape, i) => {
          const enter = springIn(frame, fps, {
            delay: stagger(i, 4, seconds(0.35, fps)),
            config: SPRINGS.bouncy,
          });
          const rotate = mix(enter, -90, 0) + (shape.spin * frame) / fps;
          const beatScale = 1 + 0.08 * pulse * enter;
          return (
            <div
              key={shape.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 36,
              }}
            >
              <div
                style={{
                  width: SIZE,
                  height: SIZE,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: `scale(${enter * beatScale}) rotate(${rotate}deg)`,
                }}
              >
                {shape.node}
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: TYPE.caption,
                  color: COLORS.muted,
                  opacity: enter,
                }}
              >
                {`<${shape.label} />`}
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};
