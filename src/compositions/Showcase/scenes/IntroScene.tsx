import { useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { Stage } from "../../../components/Stage";
import { COLORS, FONTS, TYPE } from "../../../config/theme";
import { enterUp, progress, springIn, SPRINGS } from "../../../lib/animation";
import { seconds } from "../../../lib/timing";

export const IntroScene: React.FC<{
  title: string;
  subtitle: string;
  accentColor: string;
}> = ({ title, subtitle, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kicker = springIn(frame, fps, { delay: 0 });
  const titleDelay = seconds(0.3, fps);
  const titleEnd = titleDelay + title.length * 2;
  const underline = progress(frame, titleEnd, seconds(0.7, fps));
  const subtitleDelay = titleEnd + seconds(0.2, fps);
  // Gentle continuous drift so the frame never feels frozen.
  const drift = Math.sin(frame / fps) * 6;

  return (
    <Stage>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
          transform: `translateY(${drift}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: TYPE.caption,
            letterSpacing: 8,
            color: COLORS.secondary,
            textTransform: "uppercase",
            ...enterUp(kicker, 20, 0),
          }}
        >
          Remotion × AI agents
        </div>

        <AnimatedText
          text={title}
          by="char"
          delay={titleDelay}
          step={2}
          distance={80}
          config={SPRINGS.snappy}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 800,
            fontSize: TYPE.display,
            letterSpacing: -4,
            color: COLORS.text,
            lineHeight: 1,
          }}
        />

        <div
          style={{
            width: 520,
            height: 10,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${accentColor}, ${COLORS.secondary})`,
            transform: `scaleX(${underline})`,
            transformOrigin: "left center",
          }}
        />

        <AnimatedText
          text={subtitle}
          by="word"
          delay={subtitleDelay}
          step={3}
          distance={30}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 400,
            fontSize: TYPE.body,
            color: COLORS.muted,
            justifyContent: "center",
            maxWidth: 1400,
          }}
        />
      </div>
    </Stage>
  );
};
