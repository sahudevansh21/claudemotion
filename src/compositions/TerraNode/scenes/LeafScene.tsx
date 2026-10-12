import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { TN, TN_FONTS } from "../brand";
import { Caption } from "../components/Caption";
import { FilmLook } from "../components/FilmLook";
import { Leaf } from "../components/Leaf";
import { CAPTIONS } from "../data";
import { cue, ez, handheld, lerp, scene } from "../timeline";

// Leaf box on screen (design px)
const BOX = { x: 1160, y: 120, w: 560, h: 840 };

/**
 * Shot 5 — macro on a leaf against golden bokeh; the on-device model frames
 * it, scans it and returns "Healthy" (the banner's Leaf Analysis result).
 */
export const LeafScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("leaf");
  const frameT = ez(frame, cue("leaf", "frame"), 12);
  const scanY = interpolate(
    frame,
    [cue("leaf", "scan"), cue("leaf", "scanEnd")],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const scanning =
    frame >= cue("leaf", "scan") && frame <= cue("leaf", "scanEnd") + 2;
  const result = ez(frame, cue("leaf", "result"), 14);
  const drift = interpolate(frame, [0, duration], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Stage>
        {/* Golden bokeh background */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, #F6C77A 0%, #8C8A3E 40%, #2C4419 100%)",
          }}
        />
        <AbsoluteFill
          style={{
            filter: "blur(18px)",
            transform: `translateX(${lerp(drift, 30, -30)}px)`,
          }}
        >
          {new Array(26).fill(0).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: random(`bx-${i}`) * 1920,
                top: random(`by-${i}`) * 1080,
                width: 60 + random(`br-${i}`) * 160,
                height: 60 + random(`br-${i}`) * 160,
                borderRadius: "50%",
                background:
                  random(`bc-${i}`) > 0.5
                    ? "rgba(255,230,160,0.55)"
                    : "rgba(160,200,90,0.45)",
              }}
            />
          ))}
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: `${handheld(frame, 0.5, 4)} scale(${lerp(drift, 1, 1.06)})`,
            transformOrigin: "65% 50%",
          }}
        >
          <Leaf
            width={BOX.w}
            style={{
              position: "absolute",
              left: BOX.x,
              top: BOX.y - 20,
              transform: `rotate(${-8 + Math.sin(frame / 18) * 2}deg)`,
            }}
          />

          {/* Scan frame corners */}
          <svg
            width={1920}
            height={1080}
            style={{ position: "absolute", inset: 0 }}
          >
            {(
              [
                [BOX.x, BOX.y, 1, 1],
                [BOX.x + BOX.w, BOX.y, -1, 1],
                [BOX.x, BOX.y + BOX.h, 1, -1],
                [BOX.x + BOX.w, BOX.y + BOX.h, -1, -1],
              ] as const
            ).map(([x, y, sx, sy], i) => {
              const off = lerp(frameT, 60, 0);
              const cx = x - sx * off;
              const cy = y - sy * off;
              return (
                <path
                  key={i}
                  d={`M ${cx} ${cy + sy * 70} V ${cy} H ${cx + sx * 70}`}
                  fill="none"
                  stroke={TN.white}
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={frameT}
                />
              );
            })}
            {scanning ? (
              <g>
                <rect
                  x={BOX.x}
                  y={BOX.y + scanY * BOX.h - 90}
                  width={BOX.w}
                  height={90}
                  fill="url(#tn-scan)"
                />
                <line
                  x1={BOX.x}
                  x2={BOX.x + BOX.w}
                  y1={BOX.y + scanY * BOX.h}
                  y2={BOX.y + scanY * BOX.h}
                  stroke={TN.violetLight}
                  strokeWidth={4}
                />
              </g>
            ) : null}
            <defs>
              <linearGradient id="tn-scan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={TN.violetLight} stopOpacity={0} />
                <stop
                  offset="1"
                  stopColor={TN.violetLight}
                  stopOpacity={0.35}
                />
              </linearGradient>
            </defs>
            {/* Keypoints light up as the scan passes */}
            {new Array(9).fill(0).map((_, i) => {
              const py = BOX.y + 120 + i * 75;
              const px = BOX.x + BOX.w / 2 + (random(`kp-${i}`) - 0.5) * 220;
              const lit = scanY * BOX.h + BOX.y > py;
              return lit ? (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={9}
                  fill={TN.white}
                  stroke={TN.violetLight}
                  strokeWidth={4}
                  opacity={1 - result * 0.6}
                />
              ) : null;
            })}
          </svg>

          {/* Result chip */}
          <div
            style={{
              position: "absolute",
              left: BOX.x - 470,
              top: 430,
              padding: "26px 34px",
              borderRadius: 28,
              background: "rgba(255,255,255,0.92)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
              opacity: result,
              transform: `translateX(${lerp(result, 30, 0)}px) scale(${lerp(result, 0.94, 1)})`,
              fontFamily: TN_FONTS.ui,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 600, color: TN.uiMuted }}>
              Leaf Analysis
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 6,
              }}
            >
              <svg width={52} height={52} viewBox="0 0 42 42">
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
              <span
                style={{
                  fontFamily: TN_FONTS.brand,
                  fontWeight: 700,
                  fontSize: 60,
                  color: TN.forest,
                }}
              >
                Healthy
              </span>
            </div>
          </div>
        </AbsoluteFill>
        <FilmLook />
        <Caption
          text={CAPTIONS.leaf}
          start={cue("leaf", "caption")}
          end={duration + 30}
          maxWidth={900}
        />
      </Stage>
    </AbsoluteFill>
  );
};
