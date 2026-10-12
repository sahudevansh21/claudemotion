import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { TN } from "../brand";
import { Caption } from "../components/Caption";
import { FilmLook } from "../components/FilmLook";
import { GrassLayer, Landscape } from "../components/Landscape";
import { SensorNode } from "../components/SensorNode";
import { CAPTIONS } from "../data";
import { cue, ez, handheld, scene, TN_DOLLY } from "../timeline";

const F = 900;
const HORIZON = 540;
const CAM_H = 1.6;
// Field units in world space (x, z); drawn far → near.
const UNITS = [
  { x: 2.6, z: 16 },
  { x: -3.2, z: 12 },
  { x: 0.4, z: 8.5 },
  { x: 3.8, z: 6.5 },
];

/**
 * Shot 7 — wide sunset over the farm: several units talk to each other over
 * LoRa (arcs with travelling pulses). No internet in sight.
 */
export const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("network");
  const camX = interpolate(frame, [0, duration], [-0.6, 0.6], TN_DOLLY);
  const linksAt = cue("network", "links");
  const step = cue("network", "linkStep");

  const projected = UNITS.map((u) => {
    const s = F / u.z;
    const h = 2.4 * s;
    const x = 960 + (u.x - camX) * s;
    const ground = HORIZON + CAM_H * s;
    // Antenna tip in the SensorNode drawing is at (266, 30) of 400×1000.
    return {
      x,
      ground,
      h,
      tipX: x - h * 0.2 + h * 0.266,
      tipY: ground - h + h * 0.03,
    };
  });
  const links = [
    [0, 2],
    [1, 2],
    [2, 3],
  ] as const;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        <AbsoluteFill style={{ transform: handheld(frame, 0.4, 6) }}>
          <Landscape
            sky={["#7E90B6", "#E9B98A", "#F09A55"]}
            camH={CAM_H}
            camX={camX}
            camZ={1}
            horizonY={HORIZON}
            sun={{ x: 1450, y: 548, intensity: 0.9 }}
            grass={false}
            dusk={0.35}
            hillShift={camX * 200}
          />
          {projected.map((p, i) => (
            <SensorNode
              key={i}
              height={p.h}
              dusk={0.35}
              style={{
                position: "absolute",
                left: p.x - p.h * 0.2,
                top: p.ground - p.h,
              }}
            />
          ))}
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {links.map(([a, b], i) => {
              const A = projected[a];
              const B = projected[b];
              const cx = (A.tipX + B.tipX) / 2;
              const cy = Math.min(A.tipY, B.tipY) - 140;
              const t = ez(frame, linksAt + i * step, 16);
              // Pulse travelling along the quadratic arc (loops every 24 frames)
              const u = ((frame - linksAt - i * step) % 24) / 24;
              const px =
                (1 - u) ** 2 * A.tipX + 2 * (1 - u) * u * cx + u ** 2 * B.tipX;
              const py =
                (1 - u) ** 2 * A.tipY + 2 * (1 - u) * u * cy + u ** 2 * B.tipY;
              return (
                <g key={i} opacity={t}>
                  <path
                    d={`M ${A.tipX} ${A.tipY} Q ${cx} ${cy} ${B.tipX} ${B.tipY}`}
                    fill="none"
                    stroke={TN.white}
                    strokeWidth={3}
                    strokeDasharray="10 12"
                    strokeDashoffset={-frame * 2}
                    opacity={0.85}
                  />
                  {t > 0.9 ? (
                    <circle
                      cx={px}
                      cy={py}
                      r={8}
                      fill={TN.violetLight}
                      stroke={TN.white}
                      strokeWidth={3}
                    />
                  ) : null}
                </g>
              );
            })}
            {projected.map((p, i) => {
              const ping = ((frame + i * 9) % 36) / 36;
              return (
                <circle
                  key={i}
                  cx={p.tipX}
                  cy={p.tipY}
                  r={6 + ping * 60}
                  fill="none"
                  stroke={TN.white}
                  strokeWidth={2}
                  opacity={(1 - ping) * 0.7 * ez(frame, linksAt, 10)}
                />
              );
            })}
          </svg>
          <GrassLayer density={46} dusk={0.35} />
        </AbsoluteFill>
        <FilmLook leak={1.2} />
        <Caption
          text={CAPTIONS.network}
          start={cue("network", "caption")}
          end={duration + 30}
        />
      </Stage>
    </AbsoluteFill>
  );
};
