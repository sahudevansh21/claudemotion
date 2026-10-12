import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { Caption } from "../components/Caption";
import { FilmLook } from "../components/FilmLook";
import { GrassLayer, Landscape } from "../components/Landscape";
import { SensorNode } from "../components/SensorNode";
import { CAPTIONS } from "../data";
import { cue, handheld, scene, TN_DOLLY } from "../timeline";

const F = 900;
const HORIZON = 520;
const CAM_H = 0.55;

/**
 * Shot 2 — low dolly down a crop row (the reference's walking shots);
 * a TerraNode unit grows out of the field ahead.
 */
export const RowsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("rows");
  const camZ = interpolate(frame, [0, duration], [0, 2.6], TN_DOLLY);
  const camX = interpolate(frame, [0, duration], [0.08, -0.05]);

  // Node in world space; projected with the same camera as the crop.
  const nodeZ = 9 - camZ;
  const scale = F / nodeZ;
  const nodeH = 2.4 * scale;
  const sx = 960 + (0.95 - camX) * scale;
  const groundY = HORIZON + CAM_H * scale;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill style={{ transform: handheld(frame, 1.1, 1) }}>
          <Landscape
            camZ={camZ}
            camX={camX}
            camH={CAM_H}
            horizonY={HORIZON}
            sun={{ x: 760, y: 470, intensity: 1 }}
            grass={false}
          />
          <SensorNode
            height={nodeH}
            style={{
              position: "absolute",
              left: sx - (nodeH * 0.4) / 2,
              top: groundY - nodeH,
            }}
          />
          <GrassLayer density={40} />
        </AbsoluteFill>
        <FilmLook />
        <Caption
          text={CAPTIONS.rows}
          start={cue("rows", "caption")}
          end={duration + 30}
        />
      </Stage>
    </AbsoluteFill>
  );
};
