import { Composition, Folder } from "remotion";
import { VIDEO } from "./config/video";
import { seconds } from "./lib/timing";
import {
  calculateShowcaseMetadata,
  Showcase,
} from "./compositions/Showcase/Showcase";
import { showcaseSchema } from "./compositions/Showcase/schema";
import { showcaseDurationInFrames } from "./compositions/Showcase/timing";
import { Template, TEMPLATE_SECONDS } from "./compositions/_Template/Template";
import { Polymate } from "./compositions/Polymate/Polymate";
// @new-composition-imports (scripts/new-composition.mjs inserts above this line)

/**
 * Every <Composition> registered here shows up in Remotion Studio and can be
 * rendered by id:  npx remotion render <id> out/<id>.mp4
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        schema={showcaseSchema}
        // Keep defaultProps an inline literal: Studio can then save edits made
        // in its sidebar back into this file. width/height/fps here control
        // the output format (see calculateShowcaseMetadata).
        defaultProps={{
          title: "Claudemotion",
          subtitle: "Programmatic motion graphics, written by AI agents",
          accentColor: "#7c5cff",
          bpm: 120,
          musicVolume: 0.8,
          width: 1920,
          height: 1080,
          fps: 30,
        }}
        calculateMetadata={calculateShowcaseMetadata}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={showcaseDurationInFrames(VIDEO.fps)}
      />

      {/* Polymate brand film: format is fixed by the brief (1920x1080, 30 fps,
          exactly 20 s = 600 frames) and must match timeline.json + the audio. */}
      <Composition
        id="Polymate"
        component={Polymate}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={600}
      />

      {/* @new-composition-registrations (scripts/new-composition.mjs inserts above this line) */}

      <Folder name="Templates">
        <Composition
          id="Template"
          component={Template}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={seconds(TEMPLATE_SECONDS, VIDEO.fps)}
        />
      </Folder>
    </>
  );
};
