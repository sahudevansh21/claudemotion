import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { CL, CL_EASE, CL_FONTS } from "../brand";
import {
  Cursor,
  DotGrid,
  LineGrid,
  Panel,
  Tag,
  TypeOn,
} from "../components/Kit";
import { cue, ez, lerp } from "../timeline";

const STAGES = ["MONITOR", "STRESS TEST", "GET ALERTS", "PREVIEW REPAYMENT"];
const BX = [100, 540, 980, 1420];
const BW = 400;
const BY = 150;
const BLOCKS = 20;
const THRESHOLD = 6;

/**
 * Scene 04 (18–24 s) — signal to decision: the four-step workflow, a
 * user-driven stress test with a repayment preview, then the principle card.
 * The user decides; nothing is executed (read-only).
 */
export const WorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = ez(frame, 0, 18, CL_EASE.inOut);
  const stagesAt = cue("workflow", "stages");
  const stageStep = cue("workflow", "stageStep");
  const scenarioAt = cue("workflow", "scenario");
  const dragAt = cue("workflow", "drag");
  const dragEnd = cue("workflow", "dragEnd");
  const riskAt = cue("workflow", "risk");
  const previewAt = cue("workflow", "preview");
  const cardAt = cue("workflow", "card");
  const word = cue("workflow", "cardWord");

  // Marker travelling through the stages.
  const markerX = interpolate(
    frame,
    [
      stagesAt,
      stagesAt + stageStep,
      stagesAt + 2 * stageStep,
      stagesAt + 3 * stageStep,
    ],
    BX.map((x) => x + BW / 2),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: CL_EASE.inOut,
    },
  );
  const reached = (i: number) => frame >= stagesAt + i * stageStep;

  const scenario = ez(frame, scenarioAt, 16);
  const drag = ez(frame, dragAt, dragEnd - dragAt, CL_EASE.inOut);
  const drop = Math.round(20 * drag); // illustrative user-chosen scenario: up to -20 %
  const fillNow = 13 - Math.round(5 * drag); // buffer shrinks toward the threshold
  const preview = ez(frame, previewAt, 18);
  const fillAfter = fillNow + Math.round(4 * preview);
  const risk = frame >= riskAt;

  // Slider geometry + cursor that drags it.
  const sliderX = 160;
  const sliderW = 620;
  const knobX = sliderX + drag * sliderW;
  const cursorX = interpolate(
    frame,
    [scenarioAt, dragAt, dragEnd, previewAt - 4, previewAt + 4],
    [sliderX + 300, sliderX, knobX, 500, 500],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: CL_EASE.camera,
    },
  );
  const cursorY = interpolate(
    frame,
    [scenarioAt, dragAt, dragEnd, previewAt - 4],
    [760, 668, 668, 852],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: CL_EASE.camera,
    },
  );
  const dragging = frame >= dragAt && frame <= dragEnd;
  const clicking = frame >= previewAt - 4 && frame < previewAt + 4;

  // Principle card (reference's flat colour text card), pushes in from right.
  const card = ez(frame, cardAt, 18, CL_EASE.inOut);

  return (
    <AbsoluteFill style={{ backgroundColor: CL.forest }}>
      <Stage>
        <AbsoluteFill
          style={{
            transform: `translateX(${Math.round(1920 * (1 - enter) - 1920 * card)}px)`,
          }}
        >
          <DotGrid />
          <LineGrid />
          <Tag size={30} style={{ position: "absolute", left: 100, top: 72 }}>
            FROM SIGNAL TO DECISION / 004
          </Tag>

          {/* Workflow stages */}
          <svg
            width={1920}
            height={400}
            shapeRendering="crispEdges"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {[0, 1, 2].map((i) => {
              const x0 = BX[i] + BW;
              const x1 = BX[i + 1];
              const lit = reached(i + 1);
              return new Array(Math.floor((x1 - x0) / 12))
                .fill(0)
                .map((_, k) => (
                  <rect
                    key={`${i}-${k}`}
                    x={x0 + 4 + k * 12}
                    y={BY + 56}
                    width={6}
                    height={6}
                    fill={lit ? CL.lime : CL.line}
                  />
                ));
            })}
          </svg>
          {STAGES.map((s, i) => {
            const on = reached(i);
            const t = ez(frame, stagesAt + i * stageStep - 10, 12);
            return (
              <Panel
                key={s}
                highlight={on ? 1 : 0}
                shadow={10}
                style={{
                  left: BX[i],
                  top: BY,
                  width: BW,
                  height: 118,
                  padding: "16px 22px",
                  opacity: t,
                  background: on ? CL.panel : CL.evergreen,
                }}
              >
                <Tag
                  size={20}
                  color={on ? CL.lime : CL.sage}
                >{`0${i + 1}`}</Tag>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: CL_FONTS.pixel,
                    fontWeight: 700,
                    fontSize: s.length > 12 ? 23 : 26,
                    color: on ? CL.mint : CL.sage,
                    whiteSpace: "nowrap",
                  }}
                >
                  {s}
                </div>
              </Panel>
            );
          })}
          {/* Progress track under the stages, with the travelling marker */}
          <div
            style={{
              position: "absolute",
              left: BX[0] + BW / 2,
              width: BX[3] - BX[0],
              top: BY + 150,
              height: 4,
              background: CL.line,
              opacity: ez(frame, stagesAt - 10, 12),
            }}
          />
          <div
            style={{
              position: "absolute",
              left: BX[0] + BW / 2,
              width: Math.max(0, markerX - BX[0] - BW / 2),
              top: BY + 150,
              height: 4,
              background: CL.lime,
            }}
          />
          {frame >= stagesAt ? (
            <div
              style={{
                position: "absolute",
                left: Math.round(markerX - 11),
                top: BY + 141,
                width: 22,
                height: 22,
                background: CL.lime,
                boxShadow: `4px 4px 0 ${CL.shadow}`,
              }}
            />
          ) : null}

          {/* Stress-test card */}
          <Panel
            style={{
              left: 100,
              right: 100,
              top: 360,
              height: 600,
              padding: 40,
              opacity: scenario,
              transform: `translateY(${lerp(scenario, 40, 0)}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Tag size={26}>STRESS TEST · SCENARIO</Tag>
              <Tag size={22} color={CL.sage}>
                ILLUSTRATIVE DEMO DATA · READ-ONLY
              </Tag>
            </div>
            <div
              style={{
                marginTop: 40,
                fontFamily: CL_FONTS.pixel,
                fontWeight: 700,
                fontSize: 52,
                color: CL.mint,
              }}
            >
              PRICE DROP{" "}
              <span style={{ color: CL.lime }}>
                {drop > 0 ? `-${drop}%` : "0%"}
              </span>
            </div>
          </Panel>
          {/* Slider (absolute in stage coords so the cursor can grab it) */}
          <div
            style={{
              position: "absolute",
              left: sliderX,
              top: 656,
              width: sliderW,
              height: 12,
              background: CL.evergreen,
              border: `2px solid ${CL.line}`,
              opacity: scenario,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: sliderX,
              top: 656,
              width: Math.round(drag * sliderW),
              height: 12,
              background: CL.lime,
              opacity: scenario,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: Math.round(knobX - 16),
              top: 646,
              width: 32,
              height: 32,
              background: CL.mint,
              boxShadow: `5px 5px 0 ${CL.shadow}`,
              opacity: scenario,
            }}
          />

          {/* Buffer preview */}
          <div
            style={{
              position: "absolute",
              left: 160,
              top: 760,
              width: 1600,
              opacity: scenario,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <span
                style={{
                  width: 300,
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 26,
                  color: CL.sage,
                }}
              >
                COLLATERAL BUFFER
              </span>
              <div
                style={{
                  position: "relative",
                  flex: 1,
                  display: "flex",
                  gap: 4,
                }}
              >
                {new Array(BLOCKS).fill(0).map((_, i) => {
                  const now = i < fillNow;
                  const ghost = !now && i < fillAfter;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 48,
                        background: now
                          ? i < THRESHOLD
                            ? CL.sage
                            : risk
                              ? CL.chartreuse
                              : CL.lime
                          : ghost
                            ? `${CL.lime}55`
                            : CL.evergreen,
                        border: `1px solid ${ghost ? CL.lime : CL.line}`,
                      }}
                    />
                  );
                })}
                <div
                  style={{
                    position: "absolute",
                    left: `${(THRESHOLD / BLOCKS) * 100}%`,
                    top: -18,
                    width: 4,
                    height: 84,
                    background: CL.mint,
                  }}
                />
              </div>
              {risk ? (
                <span
                  style={{
                    fontFamily: CL_FONTS.pixel,
                    fontWeight: 700,
                    fontSize: 28,
                    color: CL.evergreen,
                    background: CL.lime,
                    padding: "8px 14px",
                    opacity:
                      Math.floor((frame - riskAt) / 8) % 2 === 0 ||
                      frame > riskAt + 32
                        ? 1
                        : 0.35,
                  }}
                >
                  RISK: NEAR THRESHOLD
                </span>
              ) : (
                <span style={{ width: 340 }} />
              )}
            </div>
            {/* Repayment preview toggle */}
            <div
              style={{
                marginTop: 40,
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontFamily: CL_FONTS.pixel,
              }}
            >
              <div style={{ width: 300 }} />
              <div
                style={{
                  width: 60,
                  height: 32,
                  border: `2px solid ${CL.lime}`,
                  background: preview > 0.5 ? CL.lime : "transparent",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    left: preview > 0.5 ? 32 : 4,
                    width: 20,
                    height: 20,
                    background: preview > 0.5 ? CL.evergreen : CL.lime,
                  }}
                />
              </div>
              <span style={{ fontSize: 28, color: CL.mint }}>
                PREVIEW REPAYMENT
              </span>
              <span
                style={{
                  fontSize: 22,
                  color: CL.sage,
                  marginLeft: 24,
                  opacity: preview,
                }}
              >
                PREVIEW ONLY · NO TRANSACTION IS SENT · YOU DECIDE
              </span>
            </div>
          </div>

          {frame >= scenarioAt + 8 ? (
            <Cursor
              x={cursorX}
              y={cursorY}
              pressed={dragging || clicking}
              size={5}
            />
          ) : null}
        </AbsoluteFill>

        {/* Principle card */}
        {card > 0 ? (
          <AbsoluteFill
            style={{
              background: CL.lime,
              transform: `translateX(${Math.round(1920 * (1 - card))}px)`,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {["SEE IT.", "UNDERSTAND IT.", "DECIDE."].map((line, i) => (
              <TypeOn
                key={line}
                text={line}
                start={cardAt + 6 + i * word}
                step={2}
                size={120}
                color={CL.evergreen}
                cursorColor={CL.evergreen}
                cursor={i === 2}
              />
            ))}
          </AbsoluteFill>
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
