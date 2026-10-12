import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { CL, CL_EASE, CL_FONTS } from "../brand";
import { DotGrid, LineGrid, Panel, Tag } from "../components/Kit";
import { cue, ez, scene } from "../timeline";

const SIZE = 70;

/** One headline line, revealed word by word behind a hard lime block wipe. */
const WipeLine: React.FC<{
  words: string[];
  start: number;
  step: number;
  color: string;
}> = ({ words, start, step, color }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        gap: SIZE * 0.45,
        fontFamily: CL_FONTS.pixel,
        fontWeight: 700,
        fontSize: SIZE,
        lineHeight: 1.25,
        color,
      }}
    >
      {words.map((w, i) => {
        const t0 = start + i * step;
        const cover = ez(frame, t0, 8, CL_EASE.inOut); // block grows over the word
        const uncover = ez(frame, t0 + 8, 9, CL_EASE.inOut); // then slides off
        return (
          <span
            key={i}
            style={{ position: "relative", display: "inline-block" }}
          >
            <span style={{ opacity: frame >= t0 + 8 ? 1 : 0 }}>{w}</span>
            {frame >= t0 && uncover < 1 ? (
              <span
                style={{
                  position: "absolute",
                  top: "8%",
                  bottom: "8%",
                  left: `${uncover * 100}%`,
                  width: `${(cover - uncover) * 100}%`,
                  background: CL.lime,
                }}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** Scene 02 (5–11 s) — the problem: headline + an oracle feed that goes stale. */
export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("problem");
  const enter = ez(frame, 0, 18, CL_EASE.inOut);
  const step = cue("problem", "wordStep");
  const feedAt = cue("problem", "feed");
  const feedStep = cue("problem", "feedStep");
  const feedStop = cue("problem", "feedStop");
  const staleAt = cue("problem", "stale");
  const wipeT = ez(frame, cue("problem", "wipe"), 24, CL_EASE.inOut);
  const updates = Math.max(
    0,
    Math.min(7, Math.floor((frame - feedAt) / feedStep) + 1),
  );
  const stale = frame >= staleAt;
  // Age since the last update (scaled ×30 so staleness is legible in 3 s).
  const lastUpdate = feedAt + (updates - 1) * feedStep;
  const ageSec =
    updates > 0
      ? Math.max(
          0,
          Math.floor(((frame - lastUpdate) / 60) * (frame > feedStop ? 30 : 1)),
        )
      : 0;
  const age =
    ageSec >= 60
      ? `${Math.floor(ageSec / 60)}M ${String(ageSec % 60).padStart(2, "0")}S`
      : `${ageSec}S`;
  const flash =
    stale &&
    Math.floor((frame - staleAt) / 10) % 2 === 0 &&
    frame < staleAt + 60;
  const camera = 1 + 0.025 * (frame / duration);

  return (
    <AbsoluteFill style={{ backgroundColor: CL.evergreen }}>
      <Stage>
        <AbsoluteFill
          style={{
            transform: `translateX(${Math.round(1920 * (1 - enter))}px)`,
          }}
        >
          <DotGrid />
          <LineGrid />
          <AbsoluteFill style={{ transform: `scale(${camera})` }}>
            {/* Headline */}
            <div style={{ position: "absolute", left: 130, top: 300 }}>
              <Tag size={30} style={{ marginBottom: 34 }}>
                THE PROBLEM / 002
              </Tag>
              <WipeLine
                words={["CATCH", "STALE", "ORACLES"]}
                start={cue("problem", "line1")}
                step={step}
                color={CL.mint}
              />
              <WipeLine
                words={["BEFORE"]}
                start={cue("problem", "line2")}
                step={step}
                color={CL.mint}
              />
              <WipeLine
                words={["THEY", "CATCH", "YOU."]}
                start={cue("problem", "line3")}
                step={step}
                color={CL.lime}
              />
            </div>

            {/* Oracle feed */}
            <Panel
              highlight={flash ? 1 : 0}
              style={{
                left: 1330,
                top: 170,
                width: 460,
                height: 720,
                padding: 28,
                overflow: "hidden",
                opacity: ez(frame, feedAt - 20, 16),
              }}
            >
              <Tag size={26}>ORACLE PRICE FEED</Tag>
              <Tag size={20} color={CL.sage} style={{ marginTop: 6 }}>
                ILLUSTRATIVE · NO REAL DATA
              </Tag>
              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: CL_FONTS.pixel,
                  fontSize: 24,
                  color: CL.sage,
                }}
              >
                <span>LAST UPDATE</span>
                <span style={{ color: stale ? CL.lime : CL.mint }}>
                  {updates > 0 ? `${age} AGO` : "--"}
                </span>
              </div>

              {/* Update rows: newest at the bottom, list scrolls up */}
              <div
                style={{
                  position: "relative",
                  marginTop: 20,
                  height: 420,
                  overflow: "hidden",
                }}
              >
                {new Array(updates).fill(0).map((_, i) => {
                  const appear = ez(frame, feedAt + i * feedStep, 10);
                  const fromBottom = updates - 1 - i;
                  const isLast = i === updates - 1;
                  const w = 90 + Math.round(random(`feed-${i}`) * 150);
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top:
                          420 -
                          62 * (fromBottom + 1) +
                          Math.round((1 - appear) * 30),
                        height: 50,
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        opacity: appear * (fromBottom > 5 ? 0.3 : 1),
                        borderBottom: `2px solid ${CL.line}`,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          background: isLast && stale ? CL.sage : CL.lime,
                        }}
                      />
                      <div
                        style={{
                          width: w,
                          height: 16,
                          background: isLast && stale ? CL.sage : CL.chartreuse,
                          opacity: 0.85,
                        }}
                      />
                      <div style={{ flex: 1 }} />
                      <span
                        style={{
                          fontFamily: CL_FONTS.pixel,
                          fontSize: 22,
                          color: isLast && stale ? CL.lime : CL.sage,
                        }}
                      >
                        {isLast && stale ? "STALE" : "FRESH"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Heartbeat: a blip per update, flat once the feed stops */}
              <svg
                width={404}
                height={70}
                shapeRendering="crispEdges"
                style={{ marginTop: 18 }}
              >
                {new Array(40).fill(0).map((_, k) => {
                  const fx = feedAt + k * (feedStep / 2);
                  if (frame < fx) return null;
                  const isBeat = k % 2 === 0 && fx <= feedStop;
                  return (
                    <rect
                      key={k}
                      x={k * 10}
                      y={isBeat ? 10 : 46}
                      width={8}
                      height={isBeat ? 44 : 8}
                      fill={fx > feedStop ? CL.sage : CL.lime}
                    />
                  );
                })}
              </svg>

              {/* Warning badge */}
              {stale ? (
                <div
                  style={{
                    position: "absolute",
                    left: 28,
                    right: 28,
                    bottom: 28,
                    padding: "14px 18px",
                    background: CL.lime,
                    color: CL.evergreen,
                    fontFamily: CL_FONTS.pixel,
                    fontWeight: 700,
                    fontSize: 30,
                    transform: `scaleY(${ez(frame, staleAt, 9)})`,
                    boxShadow: `8px 8px 0 ${CL.shadow}`,
                  }}
                >
                  ! PRICE NOT UPDATING
                </div>
              ) : null}
            </Panel>
          </AbsoluteFill>
        </AbsoluteFill>
        {/* Hard-edged lime wipe out */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: Math.round(1920 * wipeT),
            background: CL.lime,
          }}
        />
      </Stage>
    </AbsoluteFill>
  );
};
