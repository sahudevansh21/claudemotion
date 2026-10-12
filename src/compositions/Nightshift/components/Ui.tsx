import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NS, NS_FONTS } from "../brand";

/** The Nightshift "N" — two rotationally symmetric blades (from the logo). */
export const Mark: React.FC<{
  size: number;
  /** 0 → 1: blades slide together from opposite corners. */
  t?: number;
  glow?: number;
  color?: string;
  id?: string;
}> = ({ size, t = 1, glow = 1, color, id = "ns" }) => {
  const off = (1 - t) * 34;
  const fill = color ?? `url(#${id}-g)`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: "visible",
        filter:
          glow > 0
            ? `drop-shadow(0 0 ${size * 0.06 * glow}px ${NS.glow}) drop-shadow(0 0 ${size * 0.18 * glow}px rgba(111,240,194,0.35))`
            : undefined,
      }}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8FFF5" />
          <stop offset="0.55" stopColor={NS.mint} />
          <stop offset="1" stopColor="#5FD9AE" />
        </linearGradient>
      </defs>
      <g
        transform={`translate(${-off} ${off})`}
        opacity={Math.min(1, t * 2)}
      >
        <path d="M6 94 L40 8 L60 40 Q52 34 45 37 L31 66 Z" fill={fill} />
      </g>
      <g
        transform={`translate(${off} ${-off})`}
        opacity={Math.min(1, t * 2)}
      >
        <path d="M94 6 L60 92 L40 60 Q48 66 55 63 L69 34 Z" fill={fill} />
      </g>
    </svg>
  );
};

/** Figma-style multiplayer cursor with a name tag. Tip sits at (x, y). */
export const Cursor: React.FC<{
  x: number;
  y: number;
  who: "you" | "engine";
  scale?: number;
  press?: number;
}> = ({ x, y, who, scale = 1, press = 0 }) => {
  const engine = who === "engine";
  const fill = engine ? NS.mint : NS.paper;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${scale * (1 - 0.12 * press)})`,
        transformOrigin: "0 0",
        zIndex: 50,
        filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.55))",
      }}
    >
      <svg
        width={40}
        height={44}
        viewBox="0 0 40 44"
        style={{ position: "absolute", left: -4, top: -4 }}
      >
        <path
          d="M4 4 L36 18 L21 22 L15 38 Z"
          fill={fill}
          stroke={NS.bg}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 34,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: engine ? "8px 18px 8px 12px" : "8px 18px",
          borderRadius: 12,
          background: fill,
          color: NS.ink,
          fontFamily: NS_FONTS.display,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 1,
          whiteSpace: "nowrap",
        }}
      >
        {engine ? <Mark size={26} glow={0} color={NS.ink} /> : null}
        {engine ? "ENGINE" : "YOU"}
      </div>
    </div>
  );
};

/** Dark node-canvas with a dot grid; `pan` scrolls it. */
export const GridCanvas: React.FC<{
  pan?: [number, number];
  cell?: number;
  children?: React.ReactNode;
}> = ({ pan = [0, 0], cell = 48, children }) => (
  <AbsoluteFill
    style={{
      background: NS.canvas,
      backgroundImage: `linear-gradient(${NS.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${NS.grid} 1.5px, transparent 1.5px)`,
      backgroundSize: `${cell}px ${cell}px`,
      backgroundPosition: `${pan[0]}px ${pan[1]}px`,
      overflow: "hidden",
    }}
  >
    {children}
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }}
    />
  </AbsoluteFill>
);

/** A graph node like the workflow editor in the reference. */
export const Node: React.FC<{
  x: number;
  y: number;
  w: number;
  title: string;
  /** 0 → 1 appear. */
  t?: number;
  accent?: string;
  inputs?: string[];
  outputs?: string[];
  children?: React.ReactNode;
  scale?: number;
}> = ({
  x,
  y,
  w,
  title,
  t = 1,
  accent = NS.mint,
  inputs = [],
  outputs = [],
  children,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      opacity: Math.min(1, t * 1.6),
      transform: `scale(${scale * (0.86 + 0.14 * t)})`,
      transformOrigin: "50% 50%",
      borderRadius: 18,
      background: NS.panel,
      border: `1.5px solid ${NS.line}`,
      boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      fontFamily: NS_FONTS.mono,
      color: NS.text,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "16px 22px",
        borderBottom: `1.5px solid ${NS.line}`,
        fontSize: 22,
        letterSpacing: 2.5,
        color: NS.text,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: accent,
          boxShadow: `0 0 12px ${accent}`,
        }}
      />
      {title}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ padding: "12px 0" }}>
        {inputs.map((p) => (
          <Port key={p} label={p} side="in" />
        ))}
      </div>
      <div style={{ padding: "12px 0", textAlign: "right" }}>
        {outputs.map((p) => (
          <Port key={p} label={p} side="out" />
        ))}
      </div>
    </div>
    {children ? <div style={{ padding: "0 22px 22px" }}>{children}</div> : null}
  </div>
);

const Port: React.FC<{ label: string; side: "in" | "out" }> = ({
  label,
  side,
}) => (
  <div
    style={{
      position: "relative",
      height: 40,
      lineHeight: "40px",
      padding: side === "in" ? "0 0 0 26px" : "0 26px 0 0",
      fontSize: 19,
      letterSpacing: 1.5,
      color: NS.dim,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 13,
        [side === "in" ? "left" : "right"]: -8,
        width: 14,
        height: 14,
        borderRadius: 7,
        background: NS.mint,
        boxShadow: `0 0 10px ${NS.glow}`,
      }}
    />
    {label}
  </div>
);

/** Bezier wire between two points, drawn on with `t`. */
export const Wire: React.FC<{
  from: [number, number];
  to: [number, number];
  t: number;
  color?: string;
  width?: number;
}> = ({ from, to, t, color = NS.mint, width = 4 }) => {
  const dx = Math.max(80, Math.abs(to[0] - from[0]) * 0.5);
  const d = `M${from[0]} ${from[1]} C${from[0] + dx} ${from[1]} ${to[0] - dx} ${to[1]} ${to[0]} ${to[1]}`;
  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - t}
        style={{ filter: `drop-shadow(0 0 6px ${NS.glow})` }}
        opacity={t > 0 ? 1 : 0}
      />
    </svg>
  );
};

/** Fair-value card, as on the site hero. */
export const PriceCard: React.FC<{
  sym: string;
  price: string;
  chg: string;
  conf: number;
  label?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({ sym, price, chg, conf, label = "FAIR VALUE", width = 360, style }) => {
  const up = chg.startsWith("+");
  return (
    <div
      style={{
        width,
        padding: "22px 28px",
        borderRadius: 18,
        background: "rgba(17,24,22,0.92)",
        border: `1.5px solid ${NS.line}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: NS_FONTS.mono,
          fontSize: 18,
          letterSpacing: 3,
          color: NS.dim,
        }}
      >
        {sym} · {label}
      </div>
      <div
        style={{
          fontFamily: NS_FONTS.display,
          fontWeight: 500,
          fontSize: width * 0.15,
          color: NS.text,
          margin: "8px 0 6px",
          letterSpacing: -1,
        }}
      >
        {price}
      </div>
      <div
        style={{
          fontFamily: NS_FONTS.mono,
          fontSize: 19,
          letterSpacing: 2,
          color: up ? NS.up : NS.down,
        }}
      >
        {chg} <span style={{ color: NS.dim }}>· CONF {conf}</span>
      </div>
    </div>
  );
};

/** Mint pill with ink type. */
export const Chip: React.FC<{
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 40, style }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.22}px ${size * 0.5}px`,
      borderRadius: size * 0.36,
      background: NS.mint,
      color: NS.ink,
      fontFamily: NS_FONTS.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: 0.5,
      lineHeight: 1.1,
      whiteSpace: "nowrap",
      boxShadow: `0 0 30px rgba(111,240,194,0.35)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Mono status line ("LIVE · NYSE CLOSED · MON 06:36 ET"). */
export const StatusLine: React.FC<{
  text: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, size = 22, style }) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontFamily: NS_FONTS.mono,
        fontSize: size,
        letterSpacing: size * 0.22,
        color: NS.dim,
        ...style,
      }}
    >
      <div
        style={{
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: size,
          background: NS.mint,
          boxShadow: `0 0 ${10 + 6 * Math.sin(f / 4)}px ${NS.glow}`,
          opacity: 0.6 + 0.4 * Math.abs(Math.sin(f / 8)),
        }}
      />
      {text}
    </div>
  );
};

/** Characters of `text` revealed at `step` frames each, starting `start`. */
export const typed = (text: string, frame: number, start: number, step: number) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) / step)));
