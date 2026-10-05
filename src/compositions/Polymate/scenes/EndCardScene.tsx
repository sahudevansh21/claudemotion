import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { Wordmark } from "../components/Wordmark";
import { ez, lerp } from "../components/motion";
import { SOURCES } from "../data";
import { cue } from "../timeline";

/** Shot 10 — logo stamps down, CTA to the Telegram bot, compact sources. */
export const EndCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = cue("endcard", "stamp");
  const stamp = spring({
    frame: frame - stampAt,
    fps,
    config: { damping: 12, stiffness: 220, mass: 0.7 },
  });
  const tagline = ez(frame, cue("endcard", "wordmark") + 10, 14);
  const cta = ez(frame, cue("endcard", "cta"), 14);
  const sources = ez(frame, cue("endcard", "sources"), 14);
  const settle = interpolate(frame, [0, 75], [1.03, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.cream }}>
      <Stage>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            transform: `scale(${settle})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <div
              style={{
                transform: `scale(${lerp(stamp, 1.8, 1)}) rotate(${lerp(stamp, -14, 0)}deg)`,
                opacity: Math.min(1, stamp * 2),
              }}
            >
              <PolymateMark size={200} />
            </div>
            <Wordmark frame={frame - cue("endcard", "wordmark")} size={176} />
          </div>

          <div
            style={{
              marginTop: 30,
              fontFamily: PM_FONTS.serif,
              fontSize: 60,
              color: PM.inkSoft,
              opacity: tagline,
              transform: `translateY(${lerp(tagline, 20, 0)}px)`,
            }}
          >
            The trading layer for <i>prediction markets.</i>
          </div>

          <div
            style={{
              marginTop: 60,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "24px 44px",
              borderRadius: 999,
              background: PM.ink,
              color: PM.marble,
              fontFamily: PM_FONTS.ui,
              fontWeight: 600,
              fontSize: 44,
              opacity: cta,
              transform: `translateY(${lerp(cta, 30, 0)}px) scale(${lerp(cta, 0.92, 1)})`,
            }}
          >
            <span>Start trading</span>
            <span style={{ color: PM.goldLight }}>→</span>
            <span>
              <span style={{ fontFamily: PM_FONTS.mono, fontWeight: 500 }}>
                @Tryoddsbot
              </span>{" "}
              <span style={{ color: PM.muted }}>on Telegram</span>
            </span>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 70,
            textAlign: "center",
            fontFamily: PM_FONTS.mono,
            fontSize: 22,
            letterSpacing: 1,
            color: PM.muted,
            opacity: sources,
          }}
        >
          {SOURCES} · Markets and odds shown are illustrative
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
