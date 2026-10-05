import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_EASE, PM_FONTS } from "../brand";
import { ez, lerp } from "../components/motion";
import { MARKETS } from "../data";
import { cue, scene } from "../timeline";

/**
 * Shot 6 — three market cards rise in staggered (the reference's card-stack
 * shot) and their YES / NO odds bars fill like benchmark bars.
 */
export const MarketsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("markets");
  const cardsAt = cue("markets", "cards");
  const step = cue("markets", "cardStep");
  const barsAt = cue("markets", "bars");
  // Slow lateral camera drift across the cards.
  const drift = interpolate(frame, [0, duration], [40, -40]);
  const kicker = ez(frame, 0, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.ink }}>
      <Stage>
        <div
          style={{
            position: "absolute",
            left: 140,
            top: 96,
            display: "flex",
            alignItems: "baseline",
            gap: 28,
            opacity: kicker,
            transform: `translateY(${lerp(kicker, 20, 0)}px)`,
          }}
        >
          <span
            style={{
              fontFamily: PM_FONTS.serif,
              fontSize: 84,
              color: PM.cream,
            }}
          >
            Pick a side.
          </span>
          <span
            style={{
              fontFamily: PM_FONTS.mono,
              fontSize: 22,
              letterSpacing: 3,
              color: PM.muted,
            }}
          >
            ILLUSTRATIVE MARKETS
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: 140,
            right: 140,
            top: 260,
            display: "flex",
            gap: 44,
            transform: `translateX(${drift}px)`,
          }}
        >
          {MARKETS.map((m, i) => {
            const t = ez(frame, cardsAt + i * step, 18);
            const bar = ez(frame, barsAt + i * 4, 26, PM_EASE.inOut);
            const yes = Math.round(m.yes * bar);
            const no = Math.round((100 - m.yes) * bar);
            return (
              <div
                key={m.question}
                style={{
                  flex: 1,
                  height: 700,
                  borderRadius: 36,
                  background: PM.cream,
                  padding: "48px 44px",
                  display: "flex",
                  flexDirection: "column",
                  // Staggered heights like the reference's offset cards.
                  marginTop: [40, 0, 70][i],
                  transform: `translateY(${lerp(t, 900, 0)}px) rotate(${lerp(t, 6, 0)}deg)`,
                }}
              >
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontFamily: PM_FONTS.mono,
                    fontSize: 22,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: PM.gold,
                    border: `2px solid ${PM.gold}`,
                    borderRadius: 999,
                    padding: "8px 18px",
                  }}
                >
                  {m.category}
                </span>
                <div
                  style={{
                    marginTop: 36,
                    fontFamily: PM_FONTS.serif,
                    fontSize: 60,
                    lineHeight: 1.05,
                    color: PM.ink,
                  }}
                >
                  {m.question}
                </div>
                <div style={{ flex: 1 }} />
                {(
                  [
                    ["YES", yes, m.yes, PM.lapis],
                    ["NO", no, 100 - m.yes, PM.inkSoft],
                  ] as const
                ).map(([label, shown, target, color]) => (
                  <div key={label} style={{ marginTop: 22 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontFamily: PM_FONTS.display,
                        fontStyle: "italic",
                        fontWeight: 800,
                        fontSize: 40,
                        color,
                      }}
                    >
                      <span>{label}</span>
                      <span>{shown}%</span>
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        height: 26,
                        borderRadius: 13,
                        background: PM.marbleShade,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${target * bar}%`,
                          height: "100%",
                          borderRadius: 13,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
