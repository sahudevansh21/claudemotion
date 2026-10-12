import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Stage } from "../../../components/Stage";
import { TN, TN_FONTS } from "../brand";
import { Caption } from "../components/Caption";
import { Phone } from "../components/Devices";
import { FilmLook } from "../components/FilmLook";
import { Landscape } from "../components/Landscape";
import { CAPTIONS } from "../data";
import { cue, ez, handheld, lerp, scene } from "../timeline";

/**
 * Shot 6 — "farmer-approved actions": an irrigation suggestion arrives on a
 * phone, the farmer taps Approve, irrigation starts. Illustrative UI.
 */
export const ApproveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { duration } = scene("approve");
  const enter = ez(frame, 0, 18);
  const card = spring({
    frame: frame - cue("approve", "card"),
    fps,
    config: { damping: 14, stiffness: 170 },
  });
  const tapAt = cue("approve", "tap");
  const tap = interpolate(frame, [tapAt, tapAt + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pressed = frame >= tapAt && frame < tapAt + 6;
  const done = frame >= cue("approve", "done");
  const doneT = ez(frame, cue("approve", "done"), 12);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill style={{ filter: "blur(12px)", transform: "scale(1.1)" }}>
          <Landscape
            camH={0.8}
            camZ={5}
            camX={0.4}
            horizonY={460}
            sun={{ x: 520, y: 420, intensity: 1 }}
            grass={false}
            dusk={0.15}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transform: `${handheld(frame, 1, 5)} translateY(${lerp(enter, 120, 0)}px)`,
          }}
        >
          <Phone
            width={500}
            height={1000}
            style={{ left: 1180, top: 90, transform: "rotate(-5deg)" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "70px 26px",
                fontFamily: TN_FONTS.ui,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontSize: 30,
                  color: "#55605A",
                  fontWeight: 600,
                }}
              >
                Field 1
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: 96,
                  fontWeight: 300,
                  color: "#1E2A22",
                  letterSpacing: -3,
                }}
              >
                6:42
              </div>

              {/* Notification card */}
              <div
                style={{
                  marginTop: 40,
                  borderRadius: 30,
                  background: "rgba(255,255,255,0.96)",
                  padding: 26,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
                  opacity: Math.min(1, card * 1.5),
                  transform: `translateY(${lerp(card, -60, 0)}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 11,
                      background: "#fff",
                      border: `2px solid ${TN.uiLine}`,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      padding: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        background: TN.violet,
                      }}
                    />
                  </div>
                  <span
                    style={{ fontSize: 24, fontWeight: 700, color: TN.ink }}
                  >
                    TerraNode
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 22,
                      color: TN.uiMuted,
                    }}
                  >
                    now
                  </span>
                </div>
                {!done ? (
                  <>
                    <div
                      style={{
                        marginTop: 16,
                        fontSize: 30,
                        fontWeight: 700,
                        color: TN.ink,
                        lineHeight: 1.2,
                      }}
                    >
                      Zone 2 soil moisture is low
                    </div>
                    <div
                      style={{ marginTop: 8, fontSize: 26, color: TN.uiMuted }}
                    >
                      Irrigate for 15 min?
                    </div>
                    <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
                      <div
                        style={{
                          flex: 1,
                          position: "relative",
                          overflow: "hidden",
                          textAlign: "center",
                          padding: "16px 0",
                          borderRadius: 16,
                          background: TN.violet,
                          color: TN.white,
                          fontSize: 28,
                          fontWeight: 700,
                          transform: `scale(${pressed ? 0.95 : 1})`,
                        }}
                      >
                        Approve
                        {frame >= tapAt ? (
                          <div
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: "50%",
                              width: 300 * tap,
                              height: 300 * tap,
                              marginLeft: -150 * tap,
                              marginTop: -150 * tap,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.35)",
                              opacity: 1 - tap,
                            }}
                          />
                        ) : null}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          textAlign: "center",
                          padding: "16px 0",
                          borderRadius: 16,
                          background: "#EEF1EC",
                          color: "#55605A",
                          fontSize: 28,
                          fontWeight: 600,
                        }}
                      >
                        Skip
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      opacity: doneT,
                      transform: `translateY(${lerp(doneT, 10, 0)}px)`,
                    }}
                  >
                    <svg width={56} height={56} viewBox="0 0 42 42">
                      <circle cx={21} cy={21} r={20} fill={TN.leaf} />
                      <path
                        d="M12 22 L18 28 L30 15"
                        fill="none"
                        stroke="#fff"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <div
                        style={{ fontSize: 30, fontWeight: 700, color: TN.ink }}
                      >
                        Approved
                      </div>
                      <div style={{ fontSize: 24, color: TN.uiMuted }}>
                        Irrigation started · Zone 2
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 40,
                  textAlign: "center",
                  fontFamily: TN_FONTS.mono,
                  fontSize: 16,
                  color: "#8C978F",
                  letterSpacing: 2,
                }}
              >
                ILLUSTRATIVE UI
              </div>
            </div>
          </Phone>
        </AbsoluteFill>
        <FilmLook />
        <Caption
          text={CAPTIONS.approve}
          start={cue("approve", "caption")}
          end={duration + 30}
          maxWidth={900}
        />
      </Stage>
    </AbsoluteFill>
  );
};
