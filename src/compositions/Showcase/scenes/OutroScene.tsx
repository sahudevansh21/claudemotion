import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  VERSION,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { COLORS, FONTS, TYPE } from "../../../config/theme";
import {
  enterUp,
  fadeOut,
  mix,
  springIn,
  SPRINGS,
} from "../../../lib/animation";
import { seconds } from "../../../lib/timing";

export const OutroScene: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const pop = springIn(frame, fps, {
    delay: seconds(0.2, fps),
    config: SPRINGS.bouncy,
  });
  const meta = springIn(frame, fps, { delay: seconds(0.7, fps) });
  const ring = springIn(frame, fps, { durationInFrames: seconds(1.4, fps) });
  // Fade the whole frame to black at the very end.
  const blackout = 1 - fadeOut(frame, durationInFrames, seconds(0.6, fps));

  return (
    <AbsoluteFill>
      <Stage>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 900,
            height: 900,
            marginLeft: -450,
            marginTop: -450,
            borderRadius: "50%",
            border: `4px solid ${accentColor}`,
            opacity: mix(ring, 0.8, 0),
            transform: `scale(${mix(ring, 0.2, 1.4)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: TYPE.h1,
              letterSpacing: -2,
              color: COLORS.text,
              transform: `scale(${pop})`,
            }}
          >
            Made with <span style={{ color: accentColor }}>Remotion</span>
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: TYPE.caption,
              color: COLORS.muted,
              ...enterUp(meta, 24, 0),
            }}
          >
            v{VERSION} · remotion.dev
          </div>
        </div>
      </Stage>
      <AbsoluteFill style={{ backgroundColor: "black", opacity: blackout }} />
    </AbsoluteFill>
  );
};
