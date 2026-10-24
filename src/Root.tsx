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
import { TerraNode } from "./compositions/TerraNode/TerraNode";
import { Collatera } from "./compositions/Collatera/Collatera";
import { Allocra } from "./compositions/Allocra/Allocra";
import { Nightshift } from "./compositions/Nightshift/Nightshift";
import { NightshiftLive } from "./compositions/Nightshift/NightshiftLive";
import { PolymateMinimal } from "./compositions/Polymate/PolymateMinimal";
import { PolymateForum } from "./compositions/Polymate/PolymateForum";
import { QuantoraPosts } from "./compositions/Quantora/Posts";
import { NightshiftLaunch } from "./compositions/Nightshift/NightshiftLaunch";
import { AegisLaunch } from "./compositions/Aegis/AegisLaunch";
import { CollateraLaunch } from "./compositions/CollateraLaunch/Launch";
import { CollateraPoster } from "./compositions/CollateraLaunch/Poster";
import { CollateraPosts } from "./compositions/CollateraLaunch/Posts";
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

      {/* TerraNode brand film: fixed by the brief (1920x1080, 30 fps, exactly
          20 s = 600 frames); must match its timeline.json + generated audio. */}
      <Composition
        id="TerraNode"
        component={TerraNode}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={600}
      />

      {/* COLLATERA brand film: fixed by the brief (1920x1080, 60 fps, exactly
          30 s = 1,800 frames); must match its timeline.json + generated audio. */}
      <Composition
        id="Collatera"
        component={Collatera}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={1800}
      />

      {/* ALLOCRA short film: 2K (2560x1440) @ 60 fps, exactly 30 s = 1,800
          frames; must match its timeline.json, vo.json and generated mix. */}
      <Composition
        id="Allocra"
        component={Allocra}
        width={2560}
        height={1440}
        fps={60}
        durationInFrames={1800}
      />

      {/* NIGHTSHIFT motion-graphics teaser: 1920x1080 @ 30 fps, exactly 30 s
          = 900 frames; must match its timeline.json and generated mix. */}
      <Composition
        id="Nightshift"
        component={Nightshift}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={900}
      />

      {/* NIGHTSHIFT "Now live on" announcement: 1920x1080 @ 30 fps, 15 s =
          450 frames; must match live.json and its generated mix. */}
      <Composition
        id="NightshiftLive"
        component={NightshiftLive}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={450}
      />

      {/* POLYMATE minimal product film: 4K (3840x2160) @ 60 fps, exactly
          10 s = 600 frames; must match minimal/minimal.json and its mix. */}
      <Composition
        id="PolymateMinimal"
        component={PolymateMinimal}
        width={3840}
        height={2160}
        fps={60}
        durationInFrames={600}
      />

      {/* POLYMATE "The Forum": one seamless take, 4K (3840x2160) @ 60 fps,
          exactly 30 s = 1,800 frames; must match forum/forum.json. */}
      <Composition
        id="PolymateForum"
        component={PolymateForum}
        width={3840}
        height={2160}
        fps={60}
        durationInFrames={1800}
      />

      {/* QUANTORA LABS: 10 still posts, 4K. Frame N renders post N+1. */}
      <Composition
        id="QuantoraPosts"
        component={QuantoraPosts}
        width={3840}
        height={2160}
        fps={1}
        durationInFrames={10}
      />

      {/* NIGHTSHIFT launch film: 1920x1080 @ 30 fps, 39.4 s = 1,182 frames;
          must match launch/launch.json and launch/vo.json. */}
      <Composition
        id="NightshiftLaunch"
        component={NightshiftLaunch}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={1182}
      />

      {/* AEGISNET launch film: 1920x1080 @ 30 fps, 30 s = 900 frames; must
          match Aegis/aegis.json and its generated mix. */}
      <Composition
        id="AegisLaunch"
        component={AegisLaunch}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={900}
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

      {/* COLLATERA launch: 20 s, 4K (3840x2160) @ 120 fps = 2,400 frames;
          must match CollateraLaunch/launch.json and its generated mix. */}
      <Composition
        id="CollateraLaunch"
        component={CollateraLaunch}
        width={3840}
        height={2160}
        fps={120}
        durationInFrames={2400}
      />

      {/* COLLATERA launch posters (stills): 16:9 4K and 4:5 (2160x2700). */}
      <Composition id="CollateraPoster" component={CollateraPoster} width={3840} height={2160} fps={1} durationInFrames={1} />
      <Composition id="CollateraPoster45" component={CollateraPoster} width={2160} height={2700} fps={1} durationInFrames={1} />
      {/* COLLATERA social posts: 5 stills at 4:5 (2160x2700), one per frame. */}
      <Composition id="CollateraPosts" component={CollateraPosts} width={2160} height={2700} fps={1} durationInFrames={5} />
    </>
  );
};
