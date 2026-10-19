import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { Stage } from "../../components/Stage";
import { NightshiftLaunchFilm } from "./launch/Launch";

/**
 * NIGHTSHIFT launch film (39.4 s, 1920x1080 @ 30 fps). A shot-for-shot
 * remake of the supplied launch film's structure, timing, text animation,
 * effects and voiceover rhythm, rebuilt with Nightshift's product, copy and
 * live site screenshots. Timing: launch/launch.json + launch/vo.json.
 */
export const NightshiftLaunch: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Stage>
      <NightshiftLaunchFilm />
    </Stage>
    {/* Music + SFX: scripts/nightshift/generate_launch_audio.py */}
    <Audio src={staticFile("nightshift/launch-audio/bed.wav")} />
  </AbsoluteFill>
);
