import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { ez, lerp, push } from "../components/motion";
import { cue, scene } from "../timeline";

/** Shot 1 — the mark assembles from spinning laurel leaves on cream. */
export const MarkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("mark");
  const assembled = cue("mark", "assembled");

  const assemble = interpolate(frame, [0, assembled], [0, 1], {
    extrapolateRight: "clamp",
  });
  const settle = ez(frame, 0, assembled + 4);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.cream }}>
      <Stage>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${push(frame, duration, 1, 1.08)}) rotate(${lerp(settle, -10, 0)}deg)`,
          }}
        >
          <PolymateMark size={560} assemble={assemble} />
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
