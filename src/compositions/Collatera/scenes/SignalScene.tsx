import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { CL, CL_EASE } from "../brand";
import { DotGrid, LineGrid, TypeOn } from "../components/Kit";
import { Mascot, MASCOT_COLS, MASCOT_ROWS } from "../components/Mascot";
import { cue, ez, lerp } from "../timeline";

const CELL = 36;

/** Scene 01 (0–5 s) — the digital signal: grid, pixels, mascot, name, label. */
export const SignalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const dawn = ez(frame, cue("signal", "grid"), 60, CL_EASE.inOut);
  const pixelsAt = cue("signal", "pixels");
  const assembleAt = cue("signal", "assemble");
  const assembleEnd = cue("signal", "assembleEnd");
  const lift = ez(frame, assembleEnd + 6, 24);
  const pushT = ez(frame, cue("signal", "push"), 18, CL_EASE.inOut);

  // Each pixel lands at its own time inside the assemble window.
  const cellProgress = (i: number) => {
    const delay =
      assembleAt + random(`cell-${i}`) * (assembleEnd - assembleAt - 22);
    return ez(frame, delay, 22);
  };

  const mw = MASCOT_COLS * CELL;
  const mh = MASCOT_ROWS * CELL;

  return (
    <AbsoluteFill style={{ backgroundColor: CL.night }}>
      <AbsoluteFill style={{ backgroundColor: CL.evergreen, opacity: dawn }} />
      <Stage>
        <AbsoluteFill
          style={{ transform: `translateX(${Math.round(-1920 * pushT)}px)` }}
        >
          <DotGrid opacity={dawn} />
          <LineGrid opacity={dawn * 0.6} />

          {/* Signal pixels: blink in, then dissolve as the mascot forms */}
          {new Array(16).fill(0).map((_, i) => {
            const at = pixelsAt + i * 4;
            const on = frame >= at && Math.floor((frame - at) / 6) % 4 !== 1;
            const fade = 1 - ez(frame, assembleAt + i * 3, 20);
            const size = random(`sp-s-${i}`) > 0.6 ? 18 : 12;
            return on ? (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: Math.round(160 + random(`sp-x-${i}`) * 1600),
                  top: Math.round(120 + random(`sp-y-${i}`) * 840),
                  width: size,
                  height: size,
                  background: i % 3 === 0 ? CL.chartreuse : CL.lime,
                  opacity: fade,
                }}
              />
            ) : null;
          })}

          <div
            style={{
              position: "absolute",
              left: Math.round(960 - mw / 2),
              top: Math.round(lerp(lift, 540 - mh / 2, 170)),
            }}
          >
            <Mascot cell={CELL} cellProgress={cellProgress} scatter={700} />
          </div>

          <AbsoluteFill style={{ alignItems: "center" }}>
            <TypeOn
              text="COLLATERA"
              start={cue("signal", "name")}
              step={cue("signal", "nameStep")}
              size={132}
              color={CL.lime}
              style={{ position: "absolute", top: 640 }}
            />
            <TypeOn
              text="COLLATERAL RISK MONITORING / 001"
              start={cue("signal", "label")}
              step={1}
              size={44}
              weight={400}
              color={CL.chartreuse}
              cursor={false}
              style={{ position: "absolute", top: 820 }}
            />
          </AbsoluteFill>
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
