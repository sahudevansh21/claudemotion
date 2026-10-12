import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { Caption } from "../components/Caption";
import { FilmLook } from "../components/FilmLook";
import { Landscape } from "../components/Landscape";
import { CAPTIONS } from "../data";
import { cue, handheld, scene } from "../timeline";

/** Shot 1 — wide golden-hour field, slow handheld dolly toward the low sun. */
export const FieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("field");
  const camZ = interpolate(frame, [0, duration], [0, 1.4]);
  const push = interpolate(frame, [0, duration], [1.0, 1.06]);
  const sunUp = interpolate(frame, [0, duration], [0.85, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill
          style={{ transform: `${handheld(frame, 0.6)} scale(${push})` }}
        >
          <Landscape
            camZ={camZ}
            sun={{ x: 1220, y: 520, intensity: sunUp }}
            horizonY={560}
          />
        </AbsoluteFill>
        <FilmLook />
        <Caption
          text={CAPTIONS.field}
          start={cue("field", "caption")}
          end={duration + 30}
        />
      </Stage>
    </AbsoluteFill>
  );
};
