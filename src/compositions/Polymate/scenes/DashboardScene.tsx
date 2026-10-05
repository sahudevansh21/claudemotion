import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { PolymateMark } from "../components/PolymateMark";
import { ez, lerp, push } from "../components/motion";
import { MARKETS, NAV } from "../data";
import { cue, scene } from "../timeline";

const HEADER = "Live markets";

/**
 * Shot 5 — the trading dashboard (nav taken from Polymate's banner).
 * Header types in with a caret, rows resolve in sequence.
 */
export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("dashboard");
  const enter = ez(frame, 0, 18);
  const typingAt = cue("dashboard", "typing");
  const typed = Math.max(
    0,
    Math.min(HEADER.length, Math.floor((frame - typingAt) / 1.6) + 1),
  );
  const caretOn = Math.floor(frame / 8) % 2 === 0 || typed < HEADER.length;

  return (
    <AbsoluteFill style={{ backgroundColor: PM.cream }}>
      <Stage>
        <AbsoluteFill
          style={{
            transform: `scale(${push(frame, duration, 1.0, 1.045)}) translateY(${lerp(enter, 60, 0)}px)`,
          }}
        >
          {/* Device edge, as in the reference's phone-frame UI shots */}
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 120,
              width: 1620,
              height: 840,
              borderRadius: 40,
              background: PM.marble,
              border: `14px solid ${PM.ink}`,
              boxShadow: "0 40px 80px rgba(20,20,20,0.12)",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Sidebar */}
            <div
              style={{
                width: 380,
                padding: "56px 44px",
                borderRight: `2px solid ${PM.marbleShade}`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 36,
                }}
              >
                <PolymateMark size={64} />
                <span
                  style={{
                    fontFamily: PM_FONTS.display,
                    fontStyle: "italic",
                    fontWeight: 800,
                    fontSize: 40,
                    color: PM.ink,
                  }}
                >
                  Polymate
                </span>
              </div>
              {NAV.map((item, i) => {
                const t = ez(
                  frame,
                  cue("dashboard", "nav") + i * cue("dashboard", "navStep"),
                  12,
                );
                const active = item === "Markets";
                return (
                  <div
                    key={item}
                    style={{
                      fontFamily: PM_FONTS.ui,
                      fontSize: 34,
                      fontWeight: 600,
                      padding: "14px 22px",
                      borderRadius: 16,
                      background: active ? PM.lapis : "transparent",
                      color: active ? PM.marble : PM.inkSoft,
                      opacity: t,
                      transform: `translateX(${lerp(t, -30, 0)}px)`,
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>

            {/* Main panel */}
            <div
              style={{ flex: 1, padding: "56px 64px", position: "relative" }}
            >
              <div
                style={{
                  fontFamily: PM_FONTS.serif,
                  fontSize: 92,
                  color: PM.ink,
                  height: 110,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {frame >= typingAt ? HEADER.slice(0, typed) : ""}
                <span
                  style={{
                    display: "inline-block",
                    width: 5,
                    height: 76,
                    marginLeft: 8,
                    background: PM.lapis,
                    opacity: caretOn ? 1 : 0,
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {MARKETS.map((m, i) => {
                  const start =
                    cue("dashboard", "rows") + i * cue("dashboard", "rowStep");
                  const t = ez(frame, start, 14);
                  return (
                    <div
                      key={m.question}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 28,
                        padding: "26px 32px",
                        borderRadius: 22,
                        background: "#FFFFFF",
                        border: `2px solid ${PM.marbleShade}`,
                        opacity: t,
                        transform: `translateY(${lerp(t, 40, 0)}px)`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: PM_FONTS.mono,
                          fontSize: 24,
                          color: PM.gold,
                          width: 150,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                        }}
                      >
                        {m.category}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontFamily: PM_FONTS.ui,
                          fontSize: 36,
                          fontWeight: 600,
                          color: PM.ink,
                        }}
                      >
                        {m.question}
                      </span>
                      <span
                        style={{
                          fontFamily: PM_FONTS.display,
                          fontStyle: "italic",
                          fontWeight: 800,
                          fontSize: 40,
                          color: PM.lapis,
                        }}
                      >
                        {m.yes}% YES
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  position: "absolute",
                  right: 64,
                  bottom: 40,
                  fontFamily: PM_FONTS.mono,
                  fontSize: 22,
                  color: PM.muted,
                  letterSpacing: 2,
                }}
              >
                ILLUSTRATIVE UI
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
