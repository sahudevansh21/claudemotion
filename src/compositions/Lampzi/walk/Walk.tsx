import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Stage } from "../../../components/Stage";
import tl from "./timeline.json";
import { WCreate, WEditor, WEnd, WHome, WIntro, WMore, WResumes, WTemplates, WTips, WTracker } from "./scenes";

const MAP: Record<string, React.FC> = { intro: WIntro, home: WHome, create: WCreate, editor: WEditor, resumes: WResumes, templates: WTemplates, tips: WTips, tracker: WTracker, more: WMore, end: WEnd };

/**
 * LAMPZI website walkover: 40 s, 1920x1080 @ 60 fps (2,400 frames). Follows the
 * order of the supplied screen recording (Home, Create, editor, My Resumes,
 * Templates, Resume Tips, Job Tracker, More menu, CTA) with a cursor leading the
 * story. Pages are rebuilt crisply (supplied screenshots where available).
 */
export const LampziWalk: React.FC = () => (
  <AbsoluteFill style={{ background: "#fff" }}>
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
    <Audio src={staticFile("lampzi/audio/walk.wav")} />
  </AbsoluteFill>
);
