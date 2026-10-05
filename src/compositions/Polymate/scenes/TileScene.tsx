import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { PM } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { ez, lerp } from "../components/motion";
import { cue } from "../timeline";

/** Shot 3 — app-icon tile pops in; the mark spins on its Y axis inside it. */
export const TileScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - cue("tile", "pop"),
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.6 },
  });
  const spin = ez(frame, cue("tile", "spin"), 24);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.marble }}>
      <Stage>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            perspective: 1200,
          }}
        >
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 84,
              background: `linear-gradient(145deg, ${PM.lapisLight}, ${PM.lapis} 55%, ${PM.lapisDeep})`,
              boxShadow: "0 30px 60px rgba(19,42,128,0.25)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: `scale(${pop})`,
            }}
          >
            <div
              style={{
                transform: `rotateY(${lerp(spin, 720 + 90, 0)}deg)`,
              }}
            >
              <PolymateMark size={230} mono={PM.cream} />
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
