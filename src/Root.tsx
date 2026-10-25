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
import { AllocraLaunch } from "./compositions/Allocra/AllocraLaunch";
import { Oryn } from "./compositions/Oryn/Oryn";
import { OrynSite } from "./compositions/Oryn/OrynSite";
import { OrynPosts } from "./compositions/Oryn/OrynPosts";
import { OrynIntro } from "./compositions/Oryn/OrynIntro";
import { OrynCarousel2 } from "./compositions/Oryn/OrynCarousel2";
import { OrynDay3Hero } from "./compositions/Oryn/OrynDay3Hero";
import { OrynV2, OrynV4, OrynV5, OrynV6 } from "./compositions/Oryn/films";
import { OrynV3, OrynV7, OrynV8 } from "./compositions/Oryn/films2";
import { OrynPosts2 } from "./compositions/Oryn/OrynPosts2";
import { AllocraV1, AllocraV2, AllocraV3, AllocraV4, AllocraV5, AllocraV6, AllocraV7, AllocraV8, AllocraV9, AllocraV10 } from "./compositions/AllocraContent/videos";
import { AllocraPosts } from "./compositions/AllocraContent/posts";
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

      {/* ALLOCRA launch film: 1920x1080 @ 60 fps, exactly 30 s = 1,800
          frames; must match Allocra/launch/launch.json. */}
      <Composition
        id="AllocraLaunch"
        component={AllocraLaunch}
        width={1920}
        height={1080}
        fps={60}
        durationInFrames={1800}
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
      {/* ORYN brand film: 3840x2160 @ 120 fps, exactly 30 s = 3,600 frames; must match timeline.json + the audio. */}
      <Composition id="Oryn" component={Oryn} width={3840} height={2160} fps={120} durationInFrames={3600} />

      {/* ORYN website/SaaS animation: 1920x1080 @ 60 fps, 15 s = 900 frames. */}
      <Composition id="OrynSite" component={OrynSite} width={1920} height={1080} fps={60} durationInFrames={900} />

      {/* ORYN social posts: 6 stills at 1080x1350 (4:5); frame N = post N. Render with --scale=2. */}
      <Composition id="OrynPosts" component={OrynPosts} width={1080} height={1350} fps={1} durationInFrames={6} />

      {/* ORYN Day 1 / V1 "Introducing Oryn": 3840x2160 @ 60 fps, 30 s = 1,800 frames; timing in intro.json. */}
      <Composition id="OrynIntro" component={OrynIntro} width={3840} height={2160} fps={60} durationInFrames={1800} />

      {/* ORYN Day 2 / P2 "The six verdicts" carousel: 7 slides at 1080x1350 (4:5); frame N = slide N+1. Render with --scale=2. */}
      <Composition id="OrynCarousel2" component={OrynCarousel2} width={1080} height={1350} fps={1} durationInFrames={7} />

      {/* ORYN Day 3 / A1 hero image: 1080x1350 (4:5), one still. Render with --scale=2. */}
      <Composition id="OrynDay3Hero" component={OrynDay3Hero} width={1080} height={1350} fps={1} durationInFrames={1} />

      {/* ORYN content-plan videos, all 1920x1080 @ 60 fps; timing in v2/v4/v5/v6.json. */}
      <Composition id="OrynV2" component={OrynV2} width={1920} height={1080} fps={60} durationInFrames={1200} />
      <Composition id="OrynV4" component={OrynV4} width={1920} height={1080} fps={60} durationInFrames={1200} />
      <Composition id="OrynV5" component={OrynV5} width={1920} height={1080} fps={60} durationInFrames={1500} />
      <Composition id="OrynV6" component={OrynV6} width={1920} height={1080} fps={60} durationInFrames={1200} />

      <Composition id="OrynV3" component={OrynV3} width={1920} height={1080} fps={60} durationInFrames={900} />
      <Composition id="OrynV7" component={OrynV7} width={1920} height={1080} fps={60} durationInFrames={1200} />
      <Composition id="OrynV8" component={OrynV8} width={1920} height={1080} fps={60} durationInFrames={2700} />

      {/* ORYN posts P4-P8 (days 7-14): 9 frames at 1080x1350; render with --scale=2. */}
      <Composition id="OrynPosts2" component={OrynPosts2} width={1080} height={1350} fps={1} durationInFrames={9} />

      {/* ALLOCRA content-plan videos: 1080x1920 vertical @ 60 fps; timing in AllocraContent/av*.json. */}
      <Composition id="AllocraV1" component={AllocraV1} width={1080} height={1920} fps={60} durationInFrames={1080} />
      <Composition id="AllocraV2" component={AllocraV2} width={1080} height={1920} fps={60} durationInFrames={960} />
      <Composition id="AllocraV3" component={AllocraV3} width={1080} height={1920} fps={60} durationInFrames={840} />
      <Composition id="AllocraV4" component={AllocraV4} width={1080} height={1920} fps={60} durationInFrames={960} />
      <Composition id="AllocraV5" component={AllocraV5} width={1080} height={1920} fps={60} durationInFrames={840} />
      <Composition id="AllocraV6" component={AllocraV6} width={1080} height={1920} fps={60} durationInFrames={840} />
      <Composition id="AllocraV7" component={AllocraV7} width={1080} height={1920} fps={60} durationInFrames={1320} />
      <Composition id="AllocraV8" component={AllocraV8} width={1080} height={1920} fps={60} durationInFrames={840} />
      <Composition id="AllocraV9" component={AllocraV9} width={1080} height={1920} fps={60} durationInFrames={840} />
      <Composition id="AllocraV10" component={AllocraV10} width={1080} height={1920} fps={60} durationInFrames={1080} />

      {/* ALLOCRA posts: 10 stills at 1080x1350 (4:5); render with --scale=2. */}
      <Composition id="AllocraPosts" component={AllocraPosts} width={1080} height={1350} fps={1} durationInFrames={10} />

    </>
  );
};
