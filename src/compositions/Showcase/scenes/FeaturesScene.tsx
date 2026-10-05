import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../../components/AnimatedText";
import { useBeat } from "../../../components/Beat";
import { Stage } from "../../../components/Stage";
import { COLORS, FONTS, TYPE } from "../../../config/theme";
import { enterUp, springIn } from "../../../lib/animation";
import { seconds, stagger } from "../../../lib/timing";

const FEATURES = [
  { title: "Scenes", body: "Compose sequences and transitions in React." },
  { title: "Typography", body: "Kinetic text, staggered per word or letter." },
  {
    title: "Audio sync",
    body: "Animation driven by the beat, frame-accurate.",
  },
];

const BARS = 32;

export const FeaturesScene: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { beat, pulse, bpm } = useBeat();
  const colors = [accentColor, COLORS.secondary, COLORS.accent];

  return (
    <Stage>
      <div style={{ position: "absolute", left: 160, top: 130 }}>
        <AnimatedText
          text="Everything is code"
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
          top: 340,
          display: "flex",
          gap: 48,
        }}
      >
        {FEATURES.map((f, i) => {
          const t = springIn(frame, fps, {
            delay: stagger(i, seconds(0.2, fps), seconds(0.3, fps)),
          });
          return (
            <div
              key={f.title}
              style={{
                flex: 1,
                padding: 48,
                borderRadius: 32,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                ...enterUp(t, 80, 16),
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: colors[i],
                  // Each card's icon kicks on "its" beat, cycling through the three.
                  transform: `scale(${1 + (beat % 3 === i ? 0.25 * pulse : 0)})`,
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontWeight: 600,
                  fontSize: TYPE.h2 * 0.75,
                  color: COLORS.text,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: TYPE.caption,
                  color: COLORS.muted,
                  lineHeight: 1.4,
                }}
              >
                {f.body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Beat-reactive equalizer. random(seed) is deterministic per frame. */}
      <div
        style={{
          position: "absolute",
          left: 160,
          right: 160,
          bottom: 110,
          height: 160,
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        {new Array(BARS).fill(0).map((_, i) => {
          const enter = springIn(frame, fps, {
            delay: stagger(i, 1, seconds(0.8, fps)),
          });
          const base = 0.15 + 0.25 * random(`bar-${i}`);
          const kick = pulse * (0.4 + 0.6 * random(`bar-${i}-${beat}`));
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(base + kick * 0.6) * 100 * enter}%`,
                borderRadius: 6,
                background: `linear-gradient(0deg, ${accentColor}, ${COLORS.secondary})`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          right: 160,
          bottom: 290,
          fontFamily: FONTS.mono,
          fontSize: TYPE.caption * 0.8,
          color: COLORS.muted,
          opacity: springIn(frame, fps, { delay: seconds(1, fps) }),
        }}
      >
        {bpm} BPM · beat {beat + 1}
      </div>
    </Stage>
  );
};
