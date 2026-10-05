import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { ez, lerp, push } from "../components/motion";
import { TICKET } from "../data";
import { cue, scene } from "../timeline";

/**
 * Shot 7 — the trade ticket: "Executing trade…" fills, then flips to
 * "Position opened · YES · $50" (copy from Polymate's banner).
 */
export const TradeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duration } = scene("trade");
  const pStart = cue("trade", "progress");
  const pEnd = cue("trade", "progressEnd");
  const confirmedAt = cue("trade", "confirmed");

  const enter = ez(frame, 0, 16);
  const progress = interpolate(frame, [pStart, pEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const confirmed = frame >= confirmedAt;
  const bounce = spring({
    frame: frame - confirmedAt,
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.5 },
  });
  const check = ez(frame, confirmedAt + 2, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.cream }}>
      <Stage>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            transform: `scale(${push(frame, duration, 1, 1.05)})`,
          }}
        >
          <div
            style={{
              width: 1040,
              borderRadius: 40,
              background: PM.marble,
              border: `2px solid ${PM.marbleShade}`,
              boxShadow: "0 40px 80px rgba(20,20,20,0.10)",
              padding: "56px 64px",
              transform: `translateY(${lerp(enter, 120, 0)}px) scale(${confirmed ? lerp(bounce, 0.97, 1) : 1})`,
              opacity: enter,
            }}
          >
            <div
              style={{
                fontFamily: PM_FONTS.ui,
                fontSize: 34,
                fontWeight: 600,
                color: PM.inkSoft,
              }}
            >
              {TICKET.question}
            </div>
            <div
              style={{
                marginTop: 28,
                display: "flex",
                alignItems: "center",
                gap: 28,
              }}
            >
              <span
                style={{
                  fontFamily: PM_FONTS.display,
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 48,
                  color: PM.marble,
                  background: PM.lapis,
                  borderRadius: 18,
                  padding: "6px 28px",
                }}
              >
                {TICKET.side}
              </span>
              <span
                style={{
                  fontFamily: PM_FONTS.display,
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: 132,
                  lineHeight: 1.1,
                  color: PM.ink,
                }}
              >
                {TICKET.amount}
              </span>
            </div>

            <div style={{ marginTop: 40, height: 96, position: "relative" }}>
              {/* State A: executing */}
              <div style={{ opacity: confirmed ? 0 : 1 }}>
                <div
                  style={{
                    fontFamily: PM_FONTS.mono,
                    fontSize: 28,
                    color: PM.inkSoft,
                    letterSpacing: 1,
                  }}
                >
                  Executing trade{".".repeat(1 + (Math.floor(frame / 6) % 3))}
                </div>
                <div
                  style={{
                    marginTop: 16,
                    height: 20,
                    borderRadius: 10,
                    background: PM.marbleShade,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress * 100}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${PM.lapis}, ${PM.lapisLight})`,
                    }}
                  />
                </div>
              </div>

              {/* State B: confirmed */}
              {confirmed ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    transform: `translateY(${lerp(bounce, 16, 0)}px)`,
                  }}
                >
                  <svg width={84} height={84} viewBox="0 0 84 84">
                    <circle cx={42} cy={42} r={40} fill={PM.lapis} />
                    <path
                      d="M24 43 L37 56 L61 30"
                      fill="none"
                      stroke={PM.marble}
                      strokeWidth={8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - check}
                    />
                  </svg>
                  <span
                    style={{
                      fontFamily: PM_FONTS.serif,
                      fontSize: 72,
                      color: PM.ink,
                    }}
                  >
                    Position opened
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
