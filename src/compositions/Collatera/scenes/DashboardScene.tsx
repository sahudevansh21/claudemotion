import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { CL, CL_EASE, CL_FONTS } from "../brand";
import { Cursor, DotGrid, LineGrid, Panel, Tag } from "../components/Kit";
import { Mascot } from "../components/Mascot";
import { cue, ez, lerp } from "../timeline";

const P = [
  { x: 110, cx: 380 },
  { x: 700, cx: 960 },
  { x: 1290, cx: 1550 },
];
const PY = 230;
const PW = 520;
const PH = 700;
const BLOCKS = 20;

const Title: React.FC<{ tag: string; title: string; caption: string }> = ({
  tag,
  title,
  caption,
}) => (
  <>
    <Tag size={26}>{tag}</Tag>
    <div
      style={{
        marginTop: 18,
        fontFamily: CL_FONTS.pixel,
        fontWeight: 700,
        fontSize: 46,
        color: CL.mint,
        lineHeight: 1.1,
      }}
    >
      {title}
    </div>
    <div
      style={{
        marginTop: 12,
        fontFamily: CL_FONTS.mono,
        fontSize: 22,
        color: CL.sage,
        lineHeight: 1.35,
      }}
    >
      {caption}
    </div>
  </>
);

/**
 * Scene 03 (11–18 s) — the COLLATERA dashboard. Camera visits each panel
 * close-up (reference-style UI zooms with a cursor), then pulls back.
 * All values are illustrative demo data, and labelled as such.
 */
export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = 1 - ez(frame, 0, 18, CL_EASE.inOut); // lime wipe continues off-screen
  const pushT = ez(frame, cue("dashboard", "push"), 18, CL_EASE.inOut);

  // Camera keyframes: [frame, centreX, centreY, scale]
  const K = [
    [0, P[0].cx, 570, 1.6],
    [cue("dashboard", "pan2"), P[0].cx, 570, 1.6],
    [cue("dashboard", "pan2") + 30, P[1].cx, 570, 1.6],
    [cue("dashboard", "pan3"), P[1].cx, 570, 1.6],
    [cue("dashboard", "pan3") + 30, P[2].cx, 570, 1.6],
    [cue("dashboard", "zoomOut"), P[2].cx, 570, 1.6],
    [cue("dashboard", "zoomOut") + 44, 960, 560, 1],
  ];
  const kf = (idx: number) =>
    interpolate(
      frame,
      K.map((k) => k[0]),
      K.map((k) => k[idx]),
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: CL_EASE.camera,
      },
    );
  const cx = kf(1);
  const cy = kf(2);
  const s = kf(3);

  // Panel 1: buffer bar fills, threshold marker.
  const p1 = ez(frame, cue("dashboard", "p1"), 16);
  const fill = Math.round(
    13 * ez(frame, cue("dashboard", "p1Bar"), 40, CL_EASE.inOut),
  );
  const threshold = 6;
  // Panel 2: freshness.
  const p2 = ez(frame, cue("dashboard", "p2"), 16);
  const staleFlip = frame >= cue("dashboard", "p2") + 50;
  const freshAge = 2 + (Math.floor(frame / 60) % 3);
  // Panel 3: closed market + overnight gap.
  const p3 = ez(frame, cue("dashboard", "p3"), 16);
  const chart = ez(frame, cue("dashboard", "p3") + 14, 26, CL_EASE.inOut);
  const gap = ez(frame, cue("dashboard", "p3") + 40, 14);

  // Cursor path (world coords) — hovers the thing each panel is about.
  const cursorX = interpolate(
    frame,
    [0, 60, 110, 150, 190, 250, 300, 340],
    [
      P[0].x + 470,
      P[0].x + 340,
      P[0].x + 340,
      P[1].x + 400,
      P[1].x + 420,
      P[2].x + 300,
      P[2].x + 290,
      P[2].x + 290,
    ],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: CL_EASE.camera,
    },
  );
  const cursorY = interpolate(
    frame,
    [0, 60, 110, 150, 190, 250, 300, 340],
    [
      PY + 600,
      PY + 470,
      PY + 470,
      PY + 470,
      PY + 500,
      PY + 540,
      PY + 520,
      PY + 520,
    ],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: CL_EASE.camera,
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: CL.forest }}>
      <Stage>
        <AbsoluteFill
          style={{ transform: `translateX(${Math.round(-1920 * pushT)}px)` }}
        >
          <DotGrid />
          {/* World (dashboard) transformed by the camera */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 1920,
              height: 1080,
              transformOrigin: "0 0",
              transform: `translate(${960 - cx * s}px, ${540 - cy * s}px) scale(${s})`,
            }}
          >
            <LineGrid />
            {/* Header */}
            <div
              style={{
                position: "absolute",
                left: 110,
                right: 110,
                top: 70,
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <Mascot cell={4} shadow={false} />
              <span
                style={{
                  fontFamily: CL_FONTS.pixel,
                  fontWeight: 700,
                  fontSize: 32,
                  color: CL.lime,
                }}
              >
                COLLATERA
              </span>
              <span
                style={{
                  marginLeft: 30,
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 24,
                  color: CL.sage,
                }}
              >
                DEMO VAULT · MODELED ON ALGORAND LENDING
              </span>
              <div style={{ flex: 1 }} />
              <span
                style={{
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 22,
                  color: CL.lime,
                  border: `2px solid ${CL.lime}`,
                  padding: "6px 14px",
                }}
              >
                READ-ONLY
              </span>
              <span
                style={{
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 22,
                  color: CL.sage,
                  border: `2px solid ${CL.line}`,
                  padding: "6px 14px",
                }}
              >
                ILLUSTRATIVE DEMO DATA
              </span>
            </div>

            {/* 01 / BUFFER */}
            <Panel
              highlight={
                frame > cue("dashboard", "p1") &&
                frame < cue("dashboard", "pan2")
                  ? 1
                  : 0
              }
              style={{
                left: P[0].x,
                top: PY,
                width: PW,
                height: PH,
                padding: 34,
                opacity: p1,
                transform: `translateY(${lerp(p1, 30, 0)}px)`,
              }}
            >
              <Title
                tag="01 / BUFFER"
                title="COLLATERAL HEALTH"
                caption="Collateral value vs. the loan's liquidation threshold."
              />
              <div
                style={{ position: "absolute", left: 34, right: 34, top: 360 }}
              >
                <div style={{ display: "flex", gap: 4 }}>
                  {new Array(BLOCKS).fill(0).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 56,
                        background:
                          i < fill
                            ? i < threshold
                              ? CL.sage
                              : CL.lime
                            : CL.evergreen,
                        border: `1px solid ${CL.line}`,
                      }}
                    />
                  ))}
                </div>
                {/* Threshold marker */}
                <div
                  style={{
                    position: "absolute",
                    left: `${(threshold / BLOCKS) * 100}%`,
                    top: -26,
                    height: 108,
                    width: 4,
                    background: CL.mint,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${(threshold / BLOCKS) * 100}%`,
                    top: 92,
                    transform: "translateX(-50%)",
                    fontFamily: CL_FONTS.pixel,
                    fontSize: 18,
                    color: CL.mint,
                    whiteSpace: "nowrap",
                  }}
                >
                  LIQUIDATION THRESHOLD
                </div>
                {/* Buffer bracket */}
                {fill > threshold ? (
                  <div
                    style={{
                      position: "absolute",
                      left: `${(threshold / BLOCKS) * 100}%`,
                      width: `${((fill - threshold) / BLOCKS) * 100}%`,
                      top: -46,
                      borderTop: `3px solid ${CL.lime}`,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        position: "relative",
                        top: -34,
                        fontFamily: CL_FONTS.pixel,
                        fontSize: 22,
                        color: CL.lime,
                      }}
                    >
                      BUFFER
                    </span>
                  </div>
                ) : null}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  bottom: 34,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 26,
                  color: CL.mint,
                  opacity: fill >= 13 ? 1 : 0,
                }}
              >
                <div style={{ width: 16, height: 16, background: CL.lime }} />{" "}
                ABOVE THRESHOLD
              </div>
            </Panel>

            {/* 02 / PRICE */}
            <Panel
              highlight={
                frame > cue("dashboard", "p2") &&
                frame < cue("dashboard", "pan3")
                  ? 1
                  : 0
              }
              style={{
                left: P[1].x,
                top: PY,
                width: PW,
                height: PH,
                padding: 34,
                opacity: p2,
                transform: `translateY(${lerp(p2, 30, 0)}px)`,
              }}
            >
              <Title
                tag="02 / PRICE"
                title="FRESHNESS CHECKS"
                caption="Is each oracle price recent enough to trust?"
              />
              {[
                { name: "FEED A", age: `${freshAge}S AGO`, ok: true },
                {
                  name: "FEED B",
                  age: staleFlip ? "STOPPED" : `${freshAge + 1}S AGO`,
                  ok: !staleFlip,
                },
              ].map((f, i) => (
                <div
                  key={f.name}
                  style={{
                    position: "absolute",
                    left: 34,
                    right: 34,
                    top: 330 + i * 120,
                    padding: "18px 20px",
                    border: `2px solid ${f.ok ? CL.line : CL.lime}`,
                    background: f.ok ? CL.evergreen : `${CL.lime}22`,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: CL_FONTS.pixel,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      background: f.ok ? CL.lime : "transparent",
                      border: `3px solid ${CL.lime}`,
                      opacity: f.ok && Math.floor(frame / 15) % 2 ? 0.5 : 1,
                    }}
                  />
                  <span style={{ fontSize: 26, color: CL.mint }}>{f.name}</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 20,
                      color: CL.sage,
                      textAlign: "right",
                    }}
                  >
                    UPDATED {f.age}
                  </span>
                  <span
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: f.ok ? CL.lime : CL.evergreen,
                      background: f.ok ? "transparent" : CL.lime,
                      padding: "2px 8px",
                    }}
                  >
                    {f.ok ? "FRESH" : "STALE"}
                  </span>
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  bottom: 34,
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 20,
                  color: CL.sage,
                }}
              >
                ORACLE TIMESTAMP VS. FRESHNESS WINDOW
              </div>
            </Panel>

            {/* 03 / CLOSED MARKETS */}
            <Panel
              highlight={
                frame > cue("dashboard", "p3") &&
                frame < cue("dashboard", "zoomOut")
                  ? 1
                  : 0
              }
              style={{
                left: P[2].x,
                top: PY,
                width: PW,
                height: PH,
                padding: 34,
                opacity: p3,
                transform: `translateY(${lerp(p3, 30, 0)}px)`,
              }}
            >
              <Title
                tag="03 / CLOSED MARKETS"
                title="LIQUIDITY RISK"
                caption="Prices can gap between market close and the next open."
              />
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  top: 300,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 16px",
                  background: CL.evergreen,
                  border: `2px solid ${CL.line}`,
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 24,
                  color: CL.mint,
                }}
              >
                <svg width={24} height={24} shapeRendering="crispEdges">
                  <rect
                    x={6}
                    y={0}
                    width={12}
                    height={4}
                    fill={CL.chartreuse}
                  />
                  <rect
                    x={2}
                    y={4}
                    width={8}
                    height={16}
                    fill={CL.chartreuse}
                  />
                  <rect
                    x={6}
                    y={20}
                    width={12}
                    height={4}
                    fill={CL.chartreuse}
                  />
                </svg>
                MARKET CLOSED
              </div>
              {/* Conceptual overnight-gap chart (no axis values) */}
              <svg
                width={452}
                height={250}
                shapeRendering="crispEdges"
                style={{ position: "absolute", left: 34, top: 380 }}
              >
                {new Array(18).fill(0).map((_, k) => {
                  const shown = k / 18 < chart;
                  if (!shown) return null;
                  const pre = k < 9;
                  const y = pre
                    ? 80 + ((k * 7) % 5) * 6 - k * 2
                    : 150 + ((k * 5) % 4) * 6;
                  const x = pre ? k * 18 : 290 + (k - 9) * 18;
                  return (
                    <rect
                      key={k}
                      x={x}
                      y={y}
                      width={14}
                      height={14}
                      fill={pre ? CL.lime : CL.chartreuse}
                      opacity={pre ? 1 : gap}
                    />
                  );
                })}
                <rect
                  x={168}
                  y={10}
                  width={4}
                  height={220}
                  fill={CL.mint}
                  opacity={chart > 0.5 ? 1 : 0}
                />
                <rect
                  x={282}
                  y={10}
                  width={4}
                  height={220}
                  fill={CL.mint}
                  opacity={gap}
                />
                {/* Hatched gap */}
                {new Array(10).fill(0).map((_, k) => (
                  <rect
                    key={k}
                    x={176 + k * 11}
                    y={20}
                    width={4}
                    height={200}
                    fill={CL.lime}
                    opacity={0.25 * gap}
                  />
                ))}
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: 34,
                  right: 34,
                  top: 640,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 18,
                  color: CL.sage,
                }}
              >
                <span>CLOSE</span>
                <span style={{ color: CL.lime, opacity: gap }}>
                  OVERNIGHT GAP
                </span>
                <span style={{ opacity: gap }}>OPEN</span>
              </div>
            </Panel>

            <Cursor x={cursorX} y={cursorY} size={5} />
          </div>
        </AbsoluteFill>
        {/* Lime wipe finishing its sweep off to the right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: Math.round(1920 * reveal),
            background: CL.lime,
          }}
        />
      </Stage>
    </AbsoluteFill>
  );
};
