import { random } from "remotion";
import { CL } from "../brand";

/**
 * The COLLATERA mascot, decoded cell-by-cell from the supplied logo
 * (24.75 px grid on the 400 px avatar → 12 × 11 cells). '#' = lime pixel.
 * Includes the three "crown" pixels, the eye notch and the mouth slit.
 */
export const MASCOT = [
  "....#.......",
  "..#..#......",
  "#..######...",
  ".#####..##..",
  ".######.####",
  ".###########",
  ".####.......",
  ".###########",
  ".##########.",
  "..#######...",
  "...#####....",
];

export const MASCOT_COLS = MASCOT[0].length;
export const MASCOT_ROWS = MASCOT.length;

export const MASCOT_CELLS: { r: number; c: number; i: number }[] = [];
MASCOT.forEach((row, r) =>
  Array.from(row).forEach((ch, c) => {
    if (ch === "#") MASCOT_CELLS.push({ r, c, i: MASCOT_CELLS.length });
  }),
);

/**
 * Renders the mascot with crisp square cells and the site's offset dark
 * pixel shadow. `cellProgress(i)` (0 → 1) lets callers assemble it
 * pixel-by-pixel; each cell flies in from a scattered position.
 */
export const Mascot: React.FC<{
  cell: number;
  color?: string;
  shadow?: boolean;
  cellProgress?: (i: number) => number;
  scatter?: number;
  style?: React.CSSProperties;
}> = ({
  cell,
  color = CL.lime,
  shadow = true,
  cellProgress = () => 1,
  scatter = 600,
  style,
}) => {
  const w = MASCOT_COLS * cell;
  const h = MASCOT_ROWS * cell;
  const off = Math.round(cell * 0.28);
  const cells = MASCOT_CELLS.map(({ r, c, i }) => {
    const p = cellProgress(i);
    const ang = random(`m-a-${i}`) * Math.PI * 2;
    const dist = scatter * (0.4 + random(`m-d-${i}`) * 0.6);
    const x = Math.round(c * cell + Math.cos(ang) * dist * (1 - p));
    const y = Math.round(r * cell + Math.sin(ang) * dist * (1 - p));
    return { x, y, p, i };
  });
  return (
    <svg
      width={w + off}
      height={h + off}
      viewBox={`0 0 ${w + off} ${h + off}`}
      shapeRendering="crispEdges"
      style={{ overflow: "visible", ...style }}
    >
      {shadow
        ? cells.map(({ x, y, p, i }) =>
            p >= 1 ? (
              <rect
                key={`s${i}`}
                x={x + off}
                y={y + off}
                width={cell}
                height={cell}
                fill={CL.shadow}
              />
            ) : null,
          )
        : null}
      {cells.map(({ x, y, p, i }) =>
        p > 0 ? (
          <rect
            key={i}
            x={x}
            y={y}
            width={cell}
            height={cell}
            fill={color}
            opacity={Math.min(1, p * 3)}
          />
        ) : null,
      )}
    </svg>
  );
};
