import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { Wordmark } from "../components/Wordmark";
import { ez, lerp, push } from "../components/motion";
import { cue, scene } from "../timeline";

const TAGLINE = "The trading layer for prediction markets.";

/** Shot 4 — mark + wordmark lock-up, then the official tagline resolves. */
export const WordmarkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("wordmark");
  const markIn = ez(frame, 0, 16);
  const taglineAt = cue("wordmark", "tagline");
  const words = TAGLINE.split(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: PM.cream }}>
      <Stage>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 56,
            transform: `scale(${push(frame, duration, 1, 1.035)})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <div
              style={{
                transform: `translateX(${lerp(markIn, -80, 0)}px) scale(${lerp(markIn, 0.6, 1)})`,
                opacity: markIn,
              }}
            >
              <PolymateMark size={230} />
            </div>
            <Wordmark
              frame={frame - cue("wordmark", "letters")}
              step={cue("wordmark", "letterStep")}
              size={200}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              fontFamily: PM_FONTS.serif,
              fontSize: 72,
              lineHeight: 1.1,
            }}
          >
            {words.map((w, i) => {
              const start = taglineAt + i * 3;
              const t = ez(frame, start, 10);
              // Words resolve from muted grey to ink, like the reference's
              // search-result text.
              const ink = interpolate(frame, [start + 4, start + 14], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <span
                  key={i}
                  style={{
                    opacity: t,
                    transform: `translateY(${lerp(t, 24, 0)}px)`,
                    color: `color-mix(in srgb, ${PM.ink} ${ink * 100}%, ${PM.muted})`,
                    fontStyle:
                      w === "prediction" || w === "markets."
                        ? "italic"
                        : "normal",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
