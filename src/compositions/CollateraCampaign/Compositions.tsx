import { Composition } from "remotion";
import { CampaignPosts45, CampaignPostsSquare, CampaignPostsWide } from "./Posts";
import { CollateraV5 } from "./V5";
import v5 from "./v5.json";
import { CollateraV7 } from "./V7";
import v7 from "./v7.json";
import { CollateraV4 } from "./V4";
import v4 from "./v4.json";
import { CollateraV6 } from "./V6";
import v6 from "./v6.json";
import { CollateraV2 } from "./V2";
import v2 from "./v2.json";
import { CollateraV3 } from "./V3";
import v3 from "./v3.json";

/** COLLATERA 15-day campaign films (all 1080p60, per the default-format rule). */
export const CampaignCompositions: React.FC = () => (
  <>
    <Composition id="CollateraV2" component={CollateraV2} width={1920} height={1080} fps={60} durationInFrames={v2.durationInFrames} />
    <Composition id="CollateraV3" component={CollateraV3} width={1920} height={1080} fps={60} durationInFrames={v3.durationInFrames} />
    <Composition id="CollateraV6" component={CollateraV6} width={1920} height={1080} fps={60} durationInFrames={v6.durationInFrames} />
    <Composition id="CollateraV4" component={CollateraV4} width={1920} height={1080} fps={60} durationInFrames={v4.durationInFrames} />
    <Composition id="CollateraV7" component={CollateraV7} width={1920} height={1080} fps={60} durationInFrames={v7.durationInFrames} />
    <Composition id="CollateraV5" component={CollateraV5} width={1920} height={1080} fps={60} durationInFrames={v5.durationInFrames} />
    {/* 9:16 cuts (1080×1920, 60 fps): same films, portrait layouts. */}
    <Composition id="CollateraV2Vertical" component={CollateraV2} width={1080} height={1920} fps={60} durationInFrames={v2.durationInFrames} />
    <Composition id="CollateraV3Vertical" component={CollateraV3} width={1080} height={1920} fps={60} durationInFrames={v3.durationInFrames} />
    <Composition id="CollateraV4Vertical" component={CollateraV4} width={1080} height={1920} fps={60} durationInFrames={v4.durationInFrames} />
    <Composition id="CollateraV5Vertical" component={CollateraV5} width={1080} height={1920} fps={60} durationInFrames={v5.durationInFrames} />
    <Composition id="CollateraV6Vertical" component={CollateraV6} width={1080} height={1920} fps={60} durationInFrames={v6.durationInFrames} />
    <Composition id="CollateraV7Vertical" component={CollateraV7} width={1080} height={1920} fps={60} durationInFrames={v7.durationInFrames} />
    {/* Campaign stills: one frame per post (fps = 1). */}
    <Composition id="CampaignPosts45" component={CampaignPosts45} width={2160} height={2700} fps={1} durationInFrames={6} />
    <Composition id="CampaignPostsSquare" component={CampaignPostsSquare} width={2160} height={2160} fps={1} durationInFrames={2} />
    <Composition id="CampaignPostsWide" component={CampaignPostsWide} width={3840} height={2160} fps={1} durationInFrames={6} />
  </>
);
