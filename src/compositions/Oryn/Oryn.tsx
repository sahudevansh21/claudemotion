import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Stage } from "../../components/Stage";
import { C, CL, IO } from "./brand";
import { SCENES } from "./scenes";
import { tl } from "./timeline";

/** Three chunky colour panels sweep across each cut (the site's block language). */
const Wipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const cols = [C.blue, C.yellow, C.red];
  const half = 22;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {cols.map((col, i) => {
        const a = at - half + i * 5;
        const x = interpolate(f, [a, a + half * 2 - i * 3], [-110, 110], { ...CL, easing: IO });
        if (f < a - 2 || f > a + half * 2 + 4) return null;
        return <div key={col} style={{ position: "absolute", top: -40, bottom: -40, width: "62%", left: `${x}%`, background: col, transform: "skewX(-8deg)", boxShadow: `14px 0 0 ${C.ink}` }} />;
      })}
    </AbsoluteFill>
  );
};

/**
 * ORYN — 30 s brand film, 3840x2160 @ 120 fps (3,600 frames). Scenes, cues and
 * sound hits come from timeline.json. Real screen-recording is framed inside
 * code-built UI; verdict copy is taken verbatim from the Oryn board.
 */
export const Oryn: React.FC = () => (
  <AbsoluteFill style={{ background: C.cream }}>
    <Stage>
      {tl.scenes.map((s) => {
        const S = SCENES[s.id];
        return (
          <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={s.end - s.start} premountFor={120}>
            <S />
          </Sequence>
        );
      })}
      {tl.scenes.slice(1).map((s) => (<Wipe key={s.id} at={s.start} />))}
    </Stage>
    <Audio src={staticFile("oryn/audio/mix.wav")} />
  </AbsoluteFill>
);
