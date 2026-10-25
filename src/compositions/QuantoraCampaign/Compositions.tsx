import { Composition } from "remotion";
import { QuantoraV1 } from "./QV1";
import qv1 from "./qv1.json";
import { QuantoraV2 } from "./QV2";
import qv2 from "./qv2.json";
import { QuantoraV3 } from "./QV3";
import qv3 from "./qv3.json";
import { QuantoraPostsV } from "./QPosts";

/** QUANTORA 7-day campaign: every video and post at 1080×1920, 60 fps (user request). */
export const QuantoraCompositions: React.FC = () => (
  <>
    <Composition id="QuantoraV1" component={QuantoraV1} width={1080} height={1920} fps={60} durationInFrames={qv1.durationInFrames} />
    <Composition id="QuantoraV2" component={QuantoraV2} width={1080} height={1920} fps={60} durationInFrames={qv2.durationInFrames} />
    <Composition id="QuantoraV3" component={QuantoraV3} width={1080} height={1920} fps={60} durationInFrames={qv3.durationInFrames} />
    {/* 16:9 versions (1920×1080, 60 fps). */}
    <Composition id="QuantoraV1Wide" component={QuantoraV1} width={1920} height={1080} fps={60} durationInFrames={qv1.durationInFrames} />
    <Composition id="QuantoraV2Wide" component={QuantoraV2} width={1920} height={1080} fps={60} durationInFrames={qv2.durationInFrames} />
    <Composition id="QuantoraV3Wide" component={QuantoraV3} width={1920} height={1080} fps={60} durationInFrames={qv3.durationInFrames} />
    <Composition id="QuantoraPostsV" component={QuantoraPostsV} width={1080} height={1920} fps={1} durationInFrames={11} />
  </>
);
