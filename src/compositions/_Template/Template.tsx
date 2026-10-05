/**
 * Starter for new compositions. Don't edit this to make a video — run
 *   npm run new -- MyVideo
 * which copies this file to src/compositions/MyVideo/MyVideo.tsx and
 * registers it in src/Root.tsx.
 */
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedText } from "../../components/AnimatedText";
import { Background } from "../../components/Background";
import { Stage } from "../../components/Stage";
import { COLORS, FONTS, TYPE } from "../../config/theme";
import { fadeOut } from "../../lib/animation";
import { seconds } from "../../lib/timing";

/** Length of this composition in seconds. */
export const TEMPLATE_SECONDS = 4;

export const Template: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exit = fadeOut(frame, durationInFrames, seconds(0.5, fps));

  return (
    <AbsoluteFill>
      <Background />
      <Stage style={{ opacity: exit }}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <AnimatedText
            text="Template"
            by="char"
            style={{
              fontFamily: FONTS.sans,
              fontWeight: 800,
              fontSize: TYPE.display,
              color: COLORS.text,
            }}
          />
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
