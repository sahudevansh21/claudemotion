import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Stage } from "../../components/Stage";
import { TIMELINE } from "./brand";
import { Captions } from "./components/Captions";
import { Cinema, type GradeName, Letterbox } from "./components/Cinema";
import {
  AppsShot,
  BlackShot,
  CityShot,
  CrowdShot,
  EyeShot,
  FeedShot,
  GirlShot,
  ProfileShot,
  TickerShot,
  TipsShot,
} from "./shots/Act1";
import {
  ApproveShot,
  BasketShot,
  DawnShot,
  DiagnosticsShot,
  PhoneShot,
  ScreenShot,
} from "./shots/Act2";
import { EndCardShot } from "./shots/EndCard";

/**
 * ALLOCRA — "My allocation." A 30 s short film, 2560×1440 @ 60 fps.
 *
 * Structure mirrors the supplied reference (demo1.mp4): a fast, cold act of
 * noise and screens → a hard cut to black → a calm, warm act where the
 * product answers → brand end card. A girl's voiceover carries the story.
 * Each shot has its own colour grade (see components/Cinema.tsx).
 */
const SHOTS: Record<string, React.FC> = {
  city: CityShot,
  feed: FeedShot,
  profile: ProfileShot,
  crowd: CrowdShot,
  apps: AppsShot,
  ticker: TickerShot,
  tips: TipsShot,
  eye: EyeShot,
  girl: GirlShot,
  black: BlackShot,
  dawn: DawnShot,
  screen: ScreenShot,
  basket: BasketShot,
  diagnostics: DiagnosticsShot,
  phone: PhoneShot,
  approve: ApproveShot,
  endcard: EndCardShot,
};

export const Allocra: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {TIMELINE.shots.map((s) => {
        const Shot = SHOTS[s.id];
        return (
          <Sequence
            key={s.id}
            name={s.id}
            from={s.start}
            durationInFrames={s.end - s.start}
            premountFor={60}
          >
            <Stage>
              <Cinema grade={s.grade as GradeName}>
                <Shot />
              </Cinema>
            </Stage>
          </Sequence>
        );
      })}
      <Stage>
        <Letterbox />
        <Captions />
      </Stage>
      {/* Score + SFX + Kokoro voiceover, mixed by scripts/allocra/generate_audio.py */}
      <Audio src={staticFile("allocra/audio/mix.wav")} />
    </AbsoluteFill>
  );
};
