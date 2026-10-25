import { Composition } from "remotion";
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
  </>
);
