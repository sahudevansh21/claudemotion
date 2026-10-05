import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { Stage } from "../../../components/Stage";
import { PM, PM_FONTS } from "../brand";
import { ez, push } from "../components/motion";
import { cue, scene } from "../timeline";

const CELL_W = 24;
const CELL_H = 30;
const COLS = 34;
const ROWS = 27;
const UNIT = (ROWS * CELL_H) / 1.4; // P is 1 unit wide, 1.4 units tall
const CHARS = "0123456789%$.YESNO";

/** Is (x, y) — in P units, y down — inside an italic capital P? */
const insideP = (xRaw: number, y: number): boolean => {
  const x = xRaw - (1.4 - y) * 0.22; // italic shear
  if (y < 0 || y > 1.4 || x < 0) return false;
  const stem = x <= 0.3;
  const bowlOuter =
    y <= 0.86 &&
    (x <= 0.55 || ((x - 0.55) / 0.45) ** 2 + ((y - 0.43) / 0.43) ** 2 <= 1);
  const bowlHole =
    y >= 0.24 &&
    y <= 0.62 &&
    x > 0.3 &&
    (x <= 0.55 || ((x - 0.55) / 0.17) ** 2 + ((y - 0.43) / 0.19) ** 2 <= 1);
  return stem || (bowlOuter && !bowlHole);
};

/**
 * Shot 2 — a giant italic "P" built from flickering odds characters
 * (the reference's binary-glyph reveal, recoloured to lapis on ink).
 */
export const GlyphScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { duration } = scene("glyph");
  const resolve = cue("glyph", "resolve");
  const tick =
    frame < resolve ? Math.floor(frame / 2) : Math.floor(resolve / 2);
  const settled = ez(frame, resolve, 8);

  const originX = (1920 - COLS * CELL_W) / 2;
  const originY = (1080 - ROWS * CELL_H) / 2;

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = ((c + 0.5) * CELL_W - (COLS * CELL_W - UNIT * 1.3) / 2) / UNIT;
      const y = ((r + 0.5) * CELL_H) / UNIT;
      const inside = insideP(x, y);
      const seed = `${r}-${c}`;
      // Stray "data spill" cells near the glyph, fading out as it resolves.
      const stray = !inside && random(`stray-${seed}`) < 0.06;
      if (!inside && !stray) continue;
      const appear = random(`appear-${seed}`) * 12;
      if (frame < appear) continue;
      const opacity = inside ? 1 : 0.6 * (1 - settled);
      const ch = CHARS[Math.floor(random(`ch-${seed}-${tick}`) * CHARS.length)];
      const bright = random(`b-${seed}`) < 0.18;
      cells.push(
        <div
          key={seed}
          style={{
            position: "absolute",
            left: originX + c * CELL_W,
            top: originY + r * CELL_H,
            width: CELL_W,
            height: CELL_H,
            fontFamily: PM_FONTS.mono,
            fontSize: 24,
            lineHeight: `${CELL_H}px`,
            textAlign: "center",
            color: bright ? PM.cream : inside ? PM.lapisLight : PM.lapis,
            opacity,
          }}
        >
          {ch}
        </div>,
      );
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: PM.ink }}>
      <Stage>
        <AbsoluteFill
          style={{
            transform: `scale(${push(frame, duration, 1, 1.1)})`,
            filter: `drop-shadow(0 0 ${12 * settled}px ${PM.lapis})`,
          }}
        >
          {cells}
        </AbsoluteFill>
      </Stage>
    </AbsoluteFill>
  );
};
