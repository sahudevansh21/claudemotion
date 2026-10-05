import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_EASE, PM_FONTS } from "../brand";
import { ez, lerp } from "../components/motion";
import { cue } from "../timeline";

const Y = 560; // world baseline (design px)
const SIZE = 96;
const EXPLORE_X = 960;
const TRADE_XS = [1880, 2030, 2180, 2330, 2480];
const TRADE_DY = [0, -70, 50, -60, 0];
const AND_X = 3010;
const CHECK_X = 3230;
const TRACK_X = 3480;
const CAM = [960, 2180, 3240]; // camera centre per beat

const Word: React.FC<{
  text: string;
  x: number;
  y: number;
  frame: number;
  start: number;
  color?: string;
}> = ({ text, x, y, frame, start, color = PM.ink }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translate(-50%, -50%)",
      display: "flex",
      fontFamily: PM_FONTS.display,
      fontStyle: "italic",
      fontWeight: 800,
      fontSize: SIZE,
      lineHeight: 1.2,
      color,
      whiteSpace: "nowrap",
    }}
  >
    {Array.from(text).map((ch, i) => {
      const t = ez(frame, start + i * 2, 10);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            padding: "0 6px 10px",
            margin: "0 -6px -10px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: `translateY(${lerp(t, 105, 0)}%)`,
            }}
          >
            {ch}
          </span>
        </span>
      );
    })}
  </div>
);

/**
 * Shot 8 — the reference's continuous camera track: a line threads from
 * EXPLORE through a stepped T·R·A·D·E to "AND ✓ TRACK".
 */
export const StepsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pan1 = cue("steps", "pan1");
  const pan2 = cue("steps", "pan2");
  const tradeAt = cue("steps", "trade");
  const checkAt = cue("steps", "check");
  const trackAt = cue("steps", "track");

  const camX = interpolate(
    frame,
    [pan1, pan1 + 14, pan2, pan2 + 12],
    [CAM[0], CAM[1], CAM[1], CAM[2]],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: PM_EASE.inOut,
    },
  );

  // Compass (Polymate's bio uses a 🧭): ring draws, needle swings and settles.
  const ring = ez(frame, 0, 14);
  const needle = lerp(ez(frame, 2, 22), -220, 18);

  // Line segments, drawn progressively.
  const l1 = ez(frame, pan1 - 2, 14, PM_EASE.inOut);
  let stepPath = `M ${TRADE_XS[0] + 46} ${Y + TRADE_DY[0]}`;
  for (let i = 0; i < TRADE_XS.length - 1; i++) {
    const mid = (TRADE_XS[i] + TRADE_XS[i + 1]) / 2;
    stepPath += ` H ${mid} V ${Y + TRADE_DY[i + 1]} H ${TRADE_XS[i + 1] - 46}`;
    if (i < TRADE_XS.length - 2)
      stepPath += ` M ${TRADE_XS[i + 1] + 46} ${Y + TRADE_DY[i + 1]}`;
  }
  const l2 = ez(frame, tradeAt + 2, 16, PM_EASE.inOut);
  const l3 = ez(frame, pan2 - 2, 12, PM_EASE.inOut);
  const check = ez(frame, checkAt, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: PM.marble }}>
      <Stage>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 4000,
            height: 1080,
            transform: `translateX(${960 - camX}px)`,
          }}
        >
          {/* Compass + EXPLORE */}
          <svg
            width={170}
            height={170}
            viewBox="0 0 170 170"
            style={{ position: "absolute", left: EXPLORE_X - 85, top: Y - 290 }}
          >
            <circle
              cx={85}
              cy={85}
              r={72}
              fill="none"
              stroke={PM.ink}
              strokeWidth={9}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - ring}
              transform="rotate(-90 85 85)"
            />
            <g transform={`rotate(${needle} 85 85)`} opacity={ring}>
              <path
                d="M85 30 L97 85 L85 140 L73 85 Z"
                fill="none"
                stroke={PM.ink}
                strokeWidth={7}
                strokeLinejoin="round"
              />
              <path d="M85 30 L97 85 L73 85 Z" fill={PM.lapis} />
            </g>
            <text
              x={85}
              y={36}
              textAnchor="middle"
              fontFamily="Inter"
              fontWeight={800}
              fontSize={20}
              fill={PM.ink}
              opacity={ring}
            >
              N
            </text>
          </svg>
          <Word
            text="EXPLORE"
            x={EXPLORE_X}
            y={Y}
            frame={frame}
            start={cue("steps", "explore") + 2}
          />

          {/* Lines */}
          <svg
            width={4000}
            height={1080}
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            <g
              fill="none"
              stroke={PM.ink}
              strokeWidth={6}
              strokeLinecap="square"
            >
              <path
                d={`M ${EXPLORE_X + 260} ${Y} H ${TRADE_XS[0] - 70}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - l1}
              />
              <path
                d={stepPath}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - l2}
              />
              <path
                d={`M ${TRADE_XS[4] + 70} ${Y} H ${AND_X - 130}`}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - l3}
              />
            </g>
            {/* Check circle */}
            <g transform={`translate(${CHECK_X} ${Y})`}>
              <circle
                r={62}
                fill="none"
                stroke={PM.lapis}
                strokeWidth={8}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - check}
                transform="rotate(-90)"
              />
              <path
                d="M -26 2 L -8 20 L 28 -18"
                fill="none"
                stroke={PM.lapis}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - ez(frame, checkAt + 5, 10)}
              />
            </g>
          </svg>

          {/* T R A D E — letters land as the line reaches them */}
          {Array.from("TRADE").map((ch, i) => (
            <Word
              key={i}
              text={ch}
              x={TRADE_XS[i]}
              y={Y + TRADE_DY[i]}
              frame={frame}
              start={tradeAt + i * 3}
              color={PM.lapis}
            />
          ))}

          <Word text="AND" x={AND_X} y={Y} frame={frame} start={pan2 + 2} />
          <Word text="TRACK" x={TRACK_X} y={Y} frame={frame} start={trackAt} />
        </div>
      </Stage>
    </AbsoluteFill>
  );
};
