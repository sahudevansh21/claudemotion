import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Stage } from "../../components/Stage";
import tl from "./timeline.json";
import { SceneA, SceneB, SceneC, SceneD, SceneE, SceneF, SceneG, SceneH, SceneI, SceneJ, SceneK } from "./scenes";

const MAP: Record<string, React.FC> = { status: SceneA, log: SceneB, dark: SceneC, plan: SceneD, wait: SceneE, dialog: SceneF, composer: SceneG, board: SceneH, wall: SceneI, zoomlog: SceneJ, brand: SceneK };

/**
 * LAMPZI launch film: 15 s, 2560x1440 @ 60 fps (900 frames). Shot-for-shot
 * timing and motion grammar of the supplied reference (spinner status swaps,
 * zoom-through log, plan checklist, dialog press, composer, task list, wall of
 * work, collapse to loader, brand reveal), rebuilt with Lampzi's own UI,
 * palette and site copy. Cuts and sound cues: timeline.json.
 */
export const Lampzi: React.FC = () => (
  <AbsoluteFill style={{ background: "#fbfbfb" }}>
    <Stage>
      {tl.scenes.map((s, i) => {
        const S = MAP[s.id];
        const end = i === tl.scenes.length - 1 ? s.end : s.end + 10;
        return (
          <Sequence key={s.id} name={s.id} from={s.start} durationInFrames={end - s.start} premountFor={60}>
            <S />
          </Sequence>
        );
      })}
    </Stage>
    <Audio src={staticFile("lampzi/audio/mix.wav")} />
  </AbsoluteFill>
);
