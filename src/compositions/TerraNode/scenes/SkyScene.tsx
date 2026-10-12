import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { TN, TN_EASE, TN_FONTS } from "../brand";
import { FilmLook } from "../components/FilmLook";
import { Landscape } from "../components/Landscape";
import { FOOTNOTE, TAGLINE } from "../data";
import { cue, ez, lerp } from "../timeline";

const WORD = "TerraNode";
const SIZE = 150;
// Where the leading dot of ".TerraNode" lands (design px, measured from
// the rendered wordmark). The ring collapses into this point.
const DOT = { x: 574, y: 536 };

/**
 * Shot 8 — the reference's ending: the camera tilts up from the field into a
 * clean blue sky, a glossy white ring rises, collapses into the logo's
 * violet dot and ".TerraNode" types on, letter by letter.
 */
export const SkyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tilt = interpolate(
    frame,
    [cue("sky", "tilt"), cue("sky", "tiltEnd")],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: TN_EASE.inOut,
    },
  );
  const ringAt = cue("sky", "ring");
  const collapseAt = cue("sky", "collapse");
  const rise = ez(frame, ringAt, collapseAt - ringAt, TN_EASE.out);
  const collapse = ez(frame, collapseAt, 6, TN_EASE.inOut);
  const typeAt = cue("sky", "type");
  const step = cue("sky", "typeStep");
  const dot2 = spring({
    frame: frame - cue("sky", "dot"),
    fps,
    config: { damping: 10, stiffness: 200 },
  });
  const tagline = ez(frame, cue("sky", "tagline"), 16);

  // Ring: rises from below the horizon to centre, then shrinks into the dot.
  const ringX = lerp(collapse, 960, DOT.x);
  const ringY = lerp(collapse, lerp(rise, 1250, 470), DOT.y);
  const ringD = lerp(collapse, lerp(rise, 260, 420), 26);
  const ringW = lerp(collapse, ringD * 0.2, 13);

  return (
    <AbsoluteFill style={{ backgroundColor: TN.skyTop }}>
      <Stage>
        {/* Tall plate: blue sky above, golden field below; camera tilts up */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1920,
            height: 2160,
            transform: `translateY(${lerp(tilt, -1080, 0)}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1084,
              background: `linear-gradient(180deg, ${TN.skyTop} 0%, ${TN.skyBottom} 85%, #D9CDB4 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 1078,
              width: 1920,
              height: 1080,
            }}
          >
            <Landscape
              sky={["#D9CDB4", "#F1D5A3", "#F6B66C"]}
              horizonY={520}
              sun={{ x: 1300, y: 480, intensity: 0.9 }}
            />
          </div>
        </div>

        {/* Glossy ring → violet dot */}
        {frame >= ringAt && frame < collapseAt + 8 ? (
          <div
            style={{
              position: "absolute",
              left: ringX - ringD / 2,
              top: ringY - ringD / 2,
              width: ringD,
              height: ringD,
              borderRadius: "50%",
              border: `${ringW}px solid ${collapse > 0.6 ? TN.violet : "#FFFFFF"}`,
              background: collapse > 0.6 ? TN.violet : "transparent",
              boxShadow:
                "0 30px 60px rgba(30,50,80,0.25), inset 0 -10px 24px rgba(120,140,170,0.35), inset 0 10px 20px rgba(255,255,255,0.9)",
              opacity: frame >= collapseAt + 6 ? 0 : 1,
            }}
          />
        ) : null}

        {/* Wordmark */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                background: TN.violet,
                marginBottom: 30,
                marginRight: 6,
                opacity: frame >= collapseAt + 5 ? 1 : 0,
              }}
            />
            <div
              style={{
                fontFamily: TN_FONTS.brand,
                fontWeight: 700,
                fontSize: SIZE,
                lineHeight: 1.1,
                letterSpacing: -3,
                color: TN.white,
                display: "flex",
              }}
            >
              {Array.from(WORD).map((ch, i) => {
                const t = ez(frame, typeAt + i * step, 6);
                return (
                  <span
                    key={i}
                    style={{ opacity: t, filter: `blur(${lerp(t, 6, 0)}px)` }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
            <span
              style={{
                position: "absolute",
                right: -14,
                top: 22,
                width: 26,
                height: 26,
                borderRadius: 13,
                background: TN.violet,
                transform: `scale(${dot2})`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: TN_FONTS.brand,
              fontWeight: 600,
              fontSize: 48,
              color: "rgba(255,255,255,0.9)",
              opacity: tagline,
              transform: `translateY(${lerp(tagline, 16, 0)}px)`,
            }}
          >
            {TAGLINE}
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 60,
            textAlign: "center",
            fontFamily: TN_FONTS.mono,
            fontSize: 22,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 1,
            opacity: tagline,
          }}
        >
          {FOOTNOTE}
        </div>
        <FilmLook
          warmth={1 - tilt * 0.8}
          leak={1 - tilt}
          grain={0.7}
          vignette={1 - tilt * 0.85}
        />
      </Stage>
    </AbsoluteFill>
  );
};
