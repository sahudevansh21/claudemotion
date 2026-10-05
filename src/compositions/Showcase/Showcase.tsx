import { Audio } from "@remotion/media";
import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import {
  AbsoluteFill,
  type CalculateMetadataFunction,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";
import { Background } from "../../components/Background";
import { BeatProvider } from "../../components/Beat";
import { COLORS } from "../../config/theme";
import { CLAMP } from "../../lib/animation";
import { seconds } from "../../lib/timing";
import { FeaturesScene } from "./scenes/FeaturesScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";
import { ShapesScene } from "./scenes/ShapesScene";
import type { ShowcaseProps } from "./schema";
import {
  SCENE_SECONDS,
  showcaseDurationInFrames,
  TRANSITION_SECONDS,
} from "./timing";

/** Derives width/height/fps/duration from props so they are easy to change. */
export const calculateShowcaseMetadata: CalculateMetadataFunction<
  ShowcaseProps
> = ({ props }) => ({
  width: props.width,
  height: props.height,
  fps: props.fps,
  durationInFrames: showcaseDurationInFrames(props.fps),
});

export const Showcase: React.FC<ShowcaseProps> = ({
  title,
  subtitle,
  accentColor,
  bpm,
  musicVolume,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const transition = seconds(TRANSITION_SECONDS, fps);

  return (
    <BeatProvider bpm={bpm}>
      <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
        <Background
          blobs={[
            { color: accentColor, x: 0.2, y: 0.3, size: 0.55, speed: 0.6 },
            { color: COLORS.secondary, x: 0.8, y: 0.7, size: 0.5, speed: 0.45 },
            { color: COLORS.accent, x: 0.6, y: 0.15, size: 0.35, speed: 0.8 },
          ]}
        />

        <TransitionSeries>
          <TransitionSeries.Sequence
            name="Intro"
            durationInFrames={seconds(SCENE_SECONDS.intro, fps)}
            premountFor={fps}
          >
            <IntroScene
              title={title}
              subtitle={subtitle}
              accentColor={accentColor}
            />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: transition })}
          />
          <TransitionSeries.Sequence
            name="Shapes"
            durationInFrames={seconds(SCENE_SECONDS.shapes, fps)}
            premountFor={fps}
          >
            <ShapesScene accentColor={accentColor} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={slide({ direction: "from-right" })}
            timing={springTiming({
              config: { damping: 200 },
              durationInFrames: transition,
            })}
          />
          <TransitionSeries.Sequence
            name="Features"
            durationInFrames={seconds(SCENE_SECONDS.features, fps)}
            premountFor={fps}
          >
            <FeaturesScene accentColor={accentColor} />
          </TransitionSeries.Sequence>
          <TransitionSeries.Transition
            presentation={wipe({ direction: "from-left" })}
            timing={linearTiming({ durationInFrames: transition })}
          />
          <TransitionSeries.Sequence
            name="Outro"
            durationInFrames={seconds(SCENE_SECONDS.outro, fps)}
            premountFor={fps}
          >
            <OutroScene accentColor={accentColor} />
          </TransitionSeries.Sequence>
        </TransitionSeries>

        <Audio
          src={staticFile("audio/beat-120bpm.mp3")}
          // Callback volume: frame is relative to this <Audio>. Fade out over the
          // last second so the music ends with the picture.
          volume={(f) =>
            musicVolume *
            interpolate(
              f,
              [durationInFrames - fps, durationInFrames - 1],
              [1, 0],
              CLAMP,
            )
          }
        />
      </AbsoluteFill>
    </BeatProvider>
  );
};
