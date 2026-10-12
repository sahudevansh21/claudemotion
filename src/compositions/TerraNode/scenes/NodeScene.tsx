import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { TN, TN_FONTS } from "../brand";
import { Caption } from "../components/Caption";
import { FilmLook } from "../components/FilmLook";
import { Landscape } from "../components/Landscape";
import { SensorNode } from "../components/SensorNode";
import { CAPTIONS } from "../data";
import { cue, ez, handheld, lerp, scene, TN_DOLLY } from "../timeline";

// Node placement (design px). SVG units map 1:1 at height 1000.
const NODE_H = 1000;
const NODE_LEFT = 1110;
const NODE_TOP = 40;
const ANTENNA = { x: NODE_LEFT + 266, y: NODE_TOP + 40 };
const CALLOUTS = [
  {
    label: "LoRa long-range radio",
    x: NODE_LEFT + 266,
    y: NODE_TOP + 200,
    ly: 230,
  },
  { label: "Solar powered", x: NODE_LEFT + 150, y: NODE_TOP + 290, ly: 370 },
  {
    label: "Edge-AI on the device",
    x: NODE_LEFT + 140,
    y: NODE_TOP + 520,
    ly: 510,
  },
];

/**
 * Shot 3 — close on the unit, slow orbit with a soft-focus field behind;
 * LoRa rings pulse from the antenna, callouts label the hardware.
 */
export const NodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("node");
  const orbit = interpolate(frame, [0, duration], [0, 1], TN_DOLLY);
  const pings = ["ping1", "ping2", "ping3"].map((p) => cue("node", p));

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill style={{ transform: handheld(frame, 0.7, 2) }}>
          {/* Background field, shallow depth of field, parallax opposite to orbit */}
          <AbsoluteFill
            style={{
              filter: "blur(10px)",
              transform: `scale(1.15) translateX(${lerp(orbit, 40, -40)}px)`,
            }}
          >
            <Landscape
              camH={0.7}
              horizonY={600}
              sun={{ x: 820, y: 520, intensity: 1 }}
              grass={false}
            />
          </AbsoluteFill>

          <AbsoluteFill
            style={{
              transform: `translateX(${lerp(orbit, -30, 20)}px) scale(${lerp(orbit, 1, 1.05)})`,
              transformOrigin: "75% 50%",
            }}
          >
            <SensorNode
              height={NODE_H}
              style={{ position: "absolute", left: NODE_LEFT, top: NODE_TOP }}
            />

            {/* LoRa rings */}
            <svg
              width={1920}
              height={1080}
              style={{ position: "absolute", inset: 0, overflow: "visible" }}
            >
              {pings.map((p, i) => {
                const t = interpolate(frame, [p, p + 40], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
                if (frame < p) return null;
                return (
                  <circle
                    key={i}
                    cx={ANTENNA.x}
                    cy={ANTENNA.y}
                    r={20 + t * 380}
                    fill="none"
                    stroke={TN.white}
                    strokeWidth={4 * (1 - t) + 1}
                    opacity={(1 - t) * 0.85}
                  />
                );
              })}
              {/* Callout leader lines */}
              {CALLOUTS.map((c, i) => {
                const t = ez(
                  frame,
                  cue("node", "chips") + i * cue("node", "chipStep"),
                  14,
                );
                const x0 = 760;
                return (
                  <g key={c.label} opacity={t}>
                    <path
                      d={`M ${x0} ${c.ly} H ${x0 + 80} L ${c.x} ${c.y}`}
                      fill="none"
                      stroke={TN.white}
                      strokeWidth={3}
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1 - t}
                    />
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={9 * t}
                      fill={TN.violetLight}
                      stroke={TN.white}
                      strokeWidth={3}
                    />
                  </g>
                );
              })}
            </svg>

            {CALLOUTS.map((c, i) => {
              const t = ez(
                frame,
                cue("node", "chips") + i * cue("node", "chipStep"),
                14,
              );
              return (
                <div
                  key={c.label}
                  style={{
                    position: "absolute",
                    right: 1920 - 760,
                    top: c.ly - 36,
                    padding: "10px 26px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.88)",
                    color: TN.forest,
                    fontFamily: TN_FONTS.brand,
                    fontWeight: 700,
                    fontSize: 44,
                    whiteSpace: "nowrap",
                    opacity: t,
                    transform: `translateX(${lerp(t, -24, 0)}px)`,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                  }}
                >
                  {c.label}
                </div>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
        <FilmLook />
        <Caption
          text={CAPTIONS.node}
          start={cue("node", "caption")}
          end={duration + 30}
          maxWidth={1000}
        />
      </Stage>
    </AbsoluteFill>
  );
};
