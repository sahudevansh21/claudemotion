import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CL, CL_FONTS } from "../brand";

/** Fine dotted grid (website background). `drift` moves it slowly. */
export const DotGrid: React.FC<{
  opacity?: number;
  drift?: number;
  gap?: number;
}> = ({ opacity = 1, drift = 0.15, gap = 24 }) => {
  const frame = useCurrentFrame();
  const o = (frame * drift) % gap;
  return (
    <AbsoluteFill
      style={{
        opacity,
        backgroundImage: `radial-gradient(${CL.sage}55 1.2px, transparent 1.3px)`,
        backgroundSize: `${gap}px ${gap}px`,
        backgroundPosition: `${o}px ${o * 0.5}px`,
      }}
    />
  );
};

/** Subtle large-cell grid lines seen faintly on the site. */
export const LineGrid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill
    style={{
      opacity: opacity * 0.5,
      backgroundImage: `linear-gradient(${CL.line}33 1px, transparent 1px), linear-gradient(90deg, ${CL.line}33 1px, transparent 1px)`,
      backgroundSize: "96px 96px",
    }}
  />
);

/**
 * Pixel text that types on (reference demo style): characters appear one at a
 * time from `start`, `step` frames apart, with a solid block cursor.
 */
export const TypeOn: React.FC<{
  text: string;
  start: number;
  step?: number;
  size: number;
  color?: string;
  weight?: 400 | 700;
  cursor?: boolean;
  cursorColor?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  start,
  step = 3,
  size,
  color = CL.mint,
  weight = 700,
  cursor = true,
  cursorColor = CL.lime,
  style,
}) => {
  const frame = useCurrentFrame();
  const shown = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) / step) + 1),
  );
  const typing = frame >= start && shown < text.length;
  const blink = Math.floor(frame / 16) % 2 === 0;
  const showCursor =
    cursor &&
    frame >= start &&
    (typing || (blink && frame < start + text.length * step + 40));
  return (
    <div
      style={{
        fontFamily: CL_FONTS.pixel,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.15,
        color,
        whiteSpace: "pre",
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    >
      <span>{frame >= start ? text.slice(0, shown) : ""}</span>
      {/* Zero-width anchor: the block cursor never shifts the layout */}
      <span style={{ position: "relative", width: 0, height: size * 0.9 }}>
        {showCursor ? (
          <span
            style={{
              position: "absolute",
              left: size * 0.08,
              top: 0,
              width: size * 0.55,
              height: size * 0.9,
              background: cursorColor,
            }}
          />
        ) : null}
      </span>
      {/* Invisible remainder keeps the final layout stable while typing */}
      <span style={{ opacity: 0 }}>
        {frame >= start ? text.slice(shown) : text}
      </span>
    </div>
  );
};

/** Bordered panel with the site's offset dark pixel shadow. */
export const Panel: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  shadow?: number;
  highlight?: number;
}> = ({ children, style, shadow = 14, highlight = 0 }) => (
  <div
    style={{
      position: "absolute",
      background: CL.panel,
      border: `2px solid ${highlight > 0 ? CL.lime : CL.line}`,
      boxShadow: `${shadow}px ${shadow}px 0 ${CL.shadow}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small pixel label: "01 / BUFFER" etc. */
export const Tag: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = CL.lime, size = 26, style }) => (
  <div
    style={{
      fontFamily: CL_FONTS.pixel,
      fontWeight: 700,
      fontSize: size,
      color,
      letterSpacing: 1,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Pixel arrow cursor (the reference demo's pointer, in brand colours). */
export const Cursor: React.FC<{
  x: number;
  y: number;
  pressed?: boolean;
  size?: number;
}> = ({ x, y, pressed = false, size = 6 }) => {
  const shape = [
    "#.........",
    "##........",
    "#m#.......",
    "#mm#......",
    "#mmm#.....",
    "#mmmm#....",
    "#mmmmm#...",
    "#mmmmmm#..",
    "#mmmm####.",
    "#m##m#....",
    "##..#m#...",
    "....#m#...",
    ".....##...",
  ];
  const s = pressed ? size * 0.85 : size;
  return (
    <svg
      width={10 * s}
      height={13 * s}
      shapeRendering="crispEdges"
      style={{
        position: "absolute",
        left: Math.round(x),
        top: Math.round(y),
        zIndex: 50,
        filter: `drop-shadow(${s}px ${s}px 0 ${CL.shadow})`,
      }}
    >
      {shape.flatMap((row, r) =>
        Array.from(row).map((ch, c) =>
          ch === "." ? null : (
            <rect
              key={`${r}-${c}`}
              x={c * s}
              y={r * s}
              width={s}
              height={s}
              fill={ch === "#" ? CL.evergreen : CL.mint}
            />
          ),
        ),
      )}
    </svg>
  );
};
