import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { ez, lerp } from "../components/motion";
import { cue } from "../timeline";

const SIZE = 168;

/**
 * Shot 9 — stacked headline with a swapping word (the reference's
 * "OVER A THOUSAND CURATED STAYS / PROJECTS / CAFES"), built from Polymate's
 * own line "Building tools to trade the future, fast."
 */
export const HeadlineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const swap1 = cue("headline", "swap1");
  const swap2 = cue("headline", "swap2");
  const fastAt = cue("headline", "fast");
  const words = ["NEWS,", "ODDS,", "FUTURE,"];
  const index = frame >= swap2 ? 2 : frame >= swap1 ? 1 : 0;
  const since = frame - [0, swap1, swap2][index];
  const swapIn = ez(since, 0, 6);
  const fast = ez(frame, fastAt, 8);
  // Camera punch on each beat.
  const punch =
    1 +
    0.03 * Math.exp(-since / 4) +
    (frame >= fastAt ? 0.05 * Math.exp(-(frame - fastAt) / 5) : 0);
  const intro = ez(frame, 0, 8);

  const line: React.CSSProperties = {
    fontFamily: PM_FONTS.display,
    fontStyle: "italic",
    fontWeight: 800,
    fontSize: SIZE,
    lineHeight: 1.0,
    color: PM.marble,
    letterSpacing: -4,
    textAlign: "center",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: PM.lapis }}>
      <Stage>
        {/* Gold laurel watermark */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.12,
            transform: `scale(${interpolate(frame, [0, 45], [1.6, 1.75])})`,
          }}
        >
          <PolymateMark size={900} mono={PM.goldLight} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 10,
            transform: `scale(${punch})`,
          }}
        >
          <div
            style={{
              ...line,
              opacity: intro,
              transform: `translateY(${lerp(intro, 40, 0)}px)`,
            }}
          >
            TRADE THE
          </div>
          <div
            style={{
              overflow: "hidden",
              padding: "0 30px 18px",
              marginBottom: -18,
            }}
          >
            <div
              style={{
                ...line,
                color: PM.goldLight,
                transform: `translateY(${lerp(swapIn, 100, 0)}%)`,
              }}
            >
              {words[index]}
            </div>
          </div>
          <div
            style={{
              ...line,
              opacity: fast,
              transform: `scale(${lerp(fast, 1.5, 1)})`,
            }}
          >
            FAST.
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
