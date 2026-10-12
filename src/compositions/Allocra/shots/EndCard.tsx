import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AL, AL_EASE, AL_FONTS, cue, ez, lerp, shot } from "../brand";
import { Mark } from "../components/Devices";

/**
 * 17. End card. The painted asterisk lands (boom), then the brand banner
 * art ("Your assets. Your allocation.") with the Allocra lock-up.
 */
export const EndCardShot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duration } = shot("endcard");
  const markAt = cue("endcard", "mark");
  const lineAt = cue("endcard", "line");
  const land = spring({
    frame: f - markAt,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1.2 },
  });
  const toBanner = ez(f, lineAt - 14, 30, AL_EASE.inOut);
  const word = ez(f, cue("endcard", "wordmark"), 24);
  const footer = ez(f, cue("endcard", "footer"), 30);
  const settle = interpolate(f, [lineAt, duration], [1.06, 1.0]);

  return (
    <AbsoluteFill style={{ background: AL.logoRed }}>
      {/* The mark */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: 1 - toBanner,
        }}
      >
        <Img
          src={staticFile("allocra/img/logo.jpg")}
          style={{
            width: 560,
            height: 560,
            transform: `scale(${lerp(land, 1.6, 1)}) rotate(${lerp(land, -30, 0) + f * 0.05}deg)`,
            opacity: Math.min(1, land * 1.4),
          }}
        />
      </AbsoluteFill>

      {/* The banner art */}
      <AbsoluteFill style={{ opacity: toBanner, background: AL.red }}>
        <AbsoluteFill style={{ transform: `scale(${settle})` }}>
          <Img
            src={staticFile("allocra/img/banner.jpg")}
            style={{
              position: "absolute",
              left: 0,
              top: 220,
              width: 1920,
              height: 640,
              objectFit: "cover",
            }}
          />
          {/* extend the painted red above/below the banner */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 226,
              background: "linear-gradient(180deg, #C9301B, #E1371F)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 854,
              bottom: 0,
              background: "linear-gradient(180deg, #E1371F, #B92A16)",
            }}
          />
        </AbsoluteFill>
        {/* Lock-up */}
        <div
          style={{
            position: "absolute",
            left: 150,
            bottom: 180,
            display: "flex",
            alignItems: "center",
            gap: 18,
            opacity: word,
            transform: `translateY(${lerp(word, 16, 0)}px)`,
          }}
        >
          <Mark size={56} color={AL.cream} core={AL.accent} />
          <span
            style={{
              fontFamily: AL_FONTS.sans,
              fontWeight: 600,
              fontSize: 64,
              color: AL.cream,
              letterSpacing: -1,
            }}
          >
            Allocra
          </span>
          <span
            style={{
              marginLeft: 26,
              fontFamily: AL_FONTS.mono,
              fontSize: 22,
              letterSpacing: 3,
              color: "rgba(246,218,195,0.8)",
            }}
          >
            PRIVATE ALLOCATION DESK / 01
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            right: 150,
            bottom: 186,
            fontFamily: AL_FONTS.mono,
            fontSize: 22,
            letterSpacing: 3,
            color: "rgba(246,218,195,0.85)",
            opacity: footer,
          }}
        >
          ALLOCATION IS A DECISION, NOT A DEFAULT.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
