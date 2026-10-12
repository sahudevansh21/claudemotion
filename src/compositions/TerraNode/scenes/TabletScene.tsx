import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { TN, TN_FONTS } from "../brand";
import { FilmLook } from "../components/FilmLook";
import { Landscape } from "../components/Landscape";
import { Leaf } from "../components/Leaf";
import { Tablet } from "../components/Devices";
import { READINGS } from "../data";
import { cue, ez, handheld, lerp, scene } from "../timeline";

const ICONS: Record<string, React.ReactNode> = {
  soil: (
    <path d="M8 26 C 14 14, 26 14, 32 26 M20 26 V 10 M20 14 C 14 8, 10 10, 10 10 M20 12 C 26 6, 30 8, 30 8" />
  ),
  temp: <path d="M17 8 a3 3 0 0 1 6 0 V 22 a6 6 0 1 1 -6 0 Z" />,
  drop: (
    <path d="M20 8 C 14 16, 11 21, 11 25 a9 9 0 0 0 18 0 C 29 21, 26 16, 20 8 Z" />
  ),
  sun: (
    <g>
      <circle cx="20" cy="20" r="6" />
      <path d="M20 6 V10 M20 30 V34 M6 20 H10 M30 20 H34 M10 10 L13 13 M27 27 L30 30 M10 30 L13 27 M27 13 L30 10" />
    </g>
  ),
  air: (
    <path d="M6 15 H24 a4 4 0 1 0 -4 -4 M6 22 H30 a4 4 0 1 1 -4 4 M6 29 H18" />
  ),
};

/**
 * Shot 4 — the TerraNode dashboard on a tablet held out in the field
 * (the reference's tablet-in-nature shot). Readings are the X banner's.
 */
export const TabletScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("tablet");
  const enter = ez(frame, 0, 20);
  const push = interpolate(frame, [0, duration], [1, 1.05]);
  const leafAt = cue("tablet", "leaf");
  const leafT = ez(frame, leafAt, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill
          style={{ filter: "blur(12px)", transform: "scale(1.12)" }}
        >
          <Landscape
            camH={0.9}
            camZ={2}
            horizonY={420}
            sun={{ x: 1500, y: 360, intensity: 1 }}
            grass={false}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            transform: `${handheld(frame, 0.9, 3)} scale(${push}) translateY(${lerp(enter, 80, 0)}px)`,
            perspective: 2200,
          }}
        >
          <Tablet
            width={1360}
            height={880}
            style={{
              left: 280,
              top: 150,
              transform: "rotateX(9deg) rotateZ(-1.5deg)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "40px 48px",
                fontFamily: TN_FONTS.ui,
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: ez(frame, cue("tablet", "ui"), 10),
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: TN.violet,
                    alignSelf: "flex-end",
                    marginBottom: 8,
                  }}
                />
                <span
                  style={{
                    fontFamily: TN_FONTS.brand,
                    fontWeight: 700,
                    fontSize: 46,
                    color: TN.ink,
                  }}
                >
                  TerraNode
                </span>
                <div style={{ flex: 1 }} />
                <span
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: "#E7F3E2",
                    color: TN.forest,
                    fontWeight: 600,
                    fontSize: 26,
                  }}
                >
                  ● Field 1 · Live
                </span>
                <span
                  style={{
                    padding: "8px 20px",
                    borderRadius: 999,
                    background: "#EFE9F9",
                    color: TN.violet,
                    fontWeight: 600,
                    fontSize: 26,
                  }}
                >
                  Offline mode
                </span>
              </div>

              <div style={{ display: "flex", gap: 36, marginTop: 34 }}>
                {/* Readings */}
                <div
                  style={{
                    flex: 1.15,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  {READINGS.map((r, i) => {
                    const start =
                      cue("tablet", "rows") + i * cue("tablet", "rowStep");
                    const t = ez(frame, start, 12);
                    const count = ez(
                      frame,
                      cue("tablet", "values") + i * 3,
                      22,
                    );
                    const value =
                      r.value === null
                        ? r.unit
                        : `${Math.round(r.value * count)}${r.unit}`;
                    return (
                      <div
                        key={r.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 22,
                          padding: "16px 24px",
                          borderRadius: 20,
                          background: "#FFFFFF",
                          border: `2px solid ${TN.uiLine}`,
                          opacity: t,
                          transform: `translateX(${lerp(t, -30, 0)}px)`,
                        }}
                      >
                        <svg
                          width={46}
                          height={46}
                          viewBox="0 0 40 40"
                          fill="none"
                          stroke={TN.leaf}
                          strokeWidth={2.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {ICONS[r.icon]}
                        </svg>
                        <span
                          style={{
                            flex: 1,
                            fontSize: 32,
                            fontWeight: 600,
                            color: TN.uiMuted,
                          }}
                        >
                          {r.label}
                        </span>
                        <span
                          style={{
                            fontSize: 40,
                            fontWeight: 700,
                            color: TN.ink,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Leaf analysis */}
                <div
                  style={{
                    flex: 1,
                    borderRadius: 24,
                    background: "#FFFFFF",
                    border: `2px solid ${TN.uiLine}`,
                    padding: 28,
                    display: "flex",
                    flexDirection: "column",
                    opacity: ez(frame, cue("tablet", "rows") + 8, 14),
                  }}
                >
                  <span
                    style={{ fontSize: 30, fontWeight: 600, color: TN.uiMuted }}
                  >
                    Leaf Analysis
                  </span>
                  <div
                    style={{
                      flex: 1,
                      marginTop: 18,
                      borderRadius: 18,
                      background: "linear-gradient(160deg, #3F6B2A, #1E3A18)",
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Leaf width={180} style={{ transform: "rotate(-18deg)" }} />
                    <div
                      style={{
                        position: "absolute",
                        left: "22%",
                        top: "12%",
                        width: "56%",
                        height: "76%",
                        border: `4px solid ${TN.white}`,
                        borderRadius: 10,
                        opacity: leafT,
                        transform: `scale(${lerp(leafT, 1.15, 1)})`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      fontSize: 38,
                      fontWeight: 700,
                      color: TN.forest,
                      opacity: leafT,
                    }}
                  >
                    <svg width={42} height={42} viewBox="0 0 42 42">
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
                    Healthy
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 48,
                  bottom: 22,
                  fontFamily: TN_FONTS.mono,
                  fontSize: 18,
                  color: "#A2ACA3",
                  letterSpacing: 2,
                }}
              >
                ILLUSTRATIVE DATA
              </div>
            </div>
          </Tablet>
        </AbsoluteFill>
        <FilmLook leak={0.7} />
      </Stage>
    </AbsoluteFill>
  );
};
