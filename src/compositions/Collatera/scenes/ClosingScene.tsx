import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { CL, CL_EASE, CL_FONTS } from "../brand";
import { DotGrid, LineGrid, TypeOn } from "../components/Kit";
import { Mascot, MASCOT_COLS, MASCOT_ROWS } from "../components/Mascot";
import { cue, ez, lerp } from "../timeline";

const BIG = 28;
const SMALL = 12;

/**
 * Scene 05 (24–30 s) — brand reveal: mascot + monitoring frame, the
 * positioning lines, then the final lock-up and footer. Holds to the end.
 */
export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const out = ez(frame, 0, 24, CL_EASE.inOut); // lime card pushes off left
  const mascotAt = cue("closing", "mascot");
  const lockAt = cue("closing", "lockup");
  const toLock = ez(frame, lockAt - 14, 22, CL_EASE.inOut);
  const lineOut = ez(frame, lockAt - 16, 12, CL_EASE.inOut);
  const footer = ez(frame, cue("closing", "footer"), 18);
  const scan = ((frame - mascotAt) % 120) / 120;

  // Mascot size/position interpolates from hero to lock-up.
  const cell = Math.round(lerp(toLock, BIG, SMALL));
  const mw = MASCOT_COLS * cell;
  const mh = MASCOT_ROWS * cell;
  const heroX = 960 - (MASCOT_COLS * BIG) / 2;
  const heroY = 160;
  const lockX = 960 - 470;
  const lockY = 430;
  const mx = Math.round(lerp(toLock, heroX, lockX));
  const my = Math.round(lerp(toLock, heroY, lockY));

  const cellProgress = (i: number) =>
    ez(frame, mascotAt + random(`close-${i}`) * 30, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: CL.evergreen }}>
      <Stage>
        <DotGrid />
        <LineGrid />

        {/* Restrained pixel particles drifting around the mascot */}
        {new Array(12).fill(0).map((_, i) => {
          const a = random(`pp-a-${i}`) * Math.PI * 2 + frame / (180 + i * 20);
          const r = 260 + random(`pp-r-${i}`) * 180;
          const blink = Math.floor((frame + i * 13) / 24) % 5 !== 0;
          const fade =
            ez(frame, mascotAt + 10 + i * 3, 20) * (1 - toLock * 0.6);
          return blink ? (
            <div
              key={i}
              style={{
                position: "absolute",
                left: Math.round(960 + Math.cos(a) * r * 1.3),
                top: Math.round(330 + Math.sin(a) * r * 0.6),
                width: i % 3 === 0 ? 16 : 10,
                height: i % 3 === 0 ? 16 : 10,
                background: i % 2 ? CL.lime : CL.chartreuse,
                opacity: 0.8 * fade,
              }}
            />
          ) : null;
        })}

        {/* Monitoring frame: corner brackets + scan line around the hero mascot */}
        <svg
          width={1920}
          height={1080}
          shapeRendering="crispEdges"
          style={{
            position: "absolute",
            inset: 0,
            opacity: ez(frame, mascotAt + 20, 14) * (1 - toLock),
          }}
        >
          {(
            [
              [heroX - 50, heroY - 40, 1, 1],
              [heroX + MASCOT_COLS * BIG + 50, heroY - 40, -1, 1],
              [heroX - 50, heroY + MASCOT_ROWS * BIG + 40, 1, -1],
              [
                heroX + MASCOT_COLS * BIG + 50,
                heroY + MASCOT_ROWS * BIG + 40,
                -1,
                -1,
              ],
            ] as const
          ).map(([x, y, sx, sy], i) => (
            <path
              key={i}
              d={`M ${x} ${y + sy * 44} V ${y} H ${x + sx * 44}`}
              stroke={CL.lime}
              strokeWidth={6}
              fill="none"
            />
          ))}
          <rect
            x={heroX - 40}
            y={heroY - 30 + scan * (MASCOT_ROWS * BIG + 60)}
            width={MASCOT_COLS * BIG + 80}
            height={3}
            fill={CL.lime}
            opacity={0.5}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            left: mx,
            top: my,
            width: mw,
            height: mh,
          }}
        >
          <Mascot cell={cell} cellProgress={cellProgress} scatter={300} />
        </div>

        {/* Positioning lines */}
        <AbsoluteFill
          style={{
            alignItems: "center",
            opacity: 1 - lineOut,
            transform: `translateY(${lerp(lineOut, 0, -30)}px)`,
          }}
        >
          <TypeOn
            text="MONITORING FIRST."
            start={cue("closing", "line1")}
            step={3}
            size={92}
            color={CL.mint}
            cursor={false}
            style={{ position: "absolute", top: 640 }}
          />
          <TypeOn
            text="AUTOMATION LATER."
            start={cue("closing", "line2")}
            step={3}
            size={92}
            color={CL.lime}
            style={{ position: "absolute", top: 760 }}
          />
        </AbsoluteFill>

        {/* Final lock-up */}
        <div
          style={{
            position: "absolute",
            left: lockX + MASCOT_COLS * SMALL + 40,
            top: lockY + 6,
            opacity: toLock,
            transform: `translateX(${lerp(toLock, 30, 0)}px)`,
            fontFamily: CL_FONTS.pixel,
            fontWeight: 700,
            fontSize: 132,
            lineHeight: 1,
            color: CL.lime,
            textShadow: `8px 8px 0 ${CL.shadow}`,
          }}
        >
          COLLATERA
        </div>
        <AbsoluteFill style={{ alignItems: "center" }}>
          <TypeOn
            text="READ-ONLY RISK MONITORING"
            start={cue("closing", "readonly") + 10}
            step={2}
            size={48}
            weight={400}
            color={CL.mint}
            cursor={false}
            style={{ position: "absolute", top: 640 }}
          />
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 90,
            textAlign: "center",
            fontFamily: CL_FONTS.pixel,
            fontSize: 30,
            color: CL.sage,
            opacity: footer,
          }}
        >
          STARTING ON ALGORAND · DEMO V1
        </div>

        {/* Lime principle card from the previous scene, pushing off left */}
        {out < 1 ? (
          <AbsoluteFill
            style={{
              background: CL.lime,
              transform: `translateX(${Math.round(-1920 * out)}px)`,
            }}
          />
        ) : null}
      </Stage>
    </AbsoluteFill>
  );
};
