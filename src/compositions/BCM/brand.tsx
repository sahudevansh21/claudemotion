import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
// Loads JetBrains Mono (the banner's mono headline face) + Inter.
import "../../config/theme";

loadFont({
  family: "Lexend",
  url: staticFile("bcm/fonts/Lexend-Variable-latin.woff2"),
  weight: "100 900",
});

/** BCM Wallet tokens, sampled from the supplied logo + X banner. */
export const BCM = {
  black: "#07090F",
  panel: "#151927",
  white: "#F6F8FF",
  ink: "#0B0D14",
  sky: "#5DAAFF",
  blue: "#4A78FA",
  violet: "#4D25F7",
  grad: "linear-gradient(135deg, #5DAAFF 0%, #4A78FA 50%, #4D25F7 100%)",
} as const;

export const BCM_FONTS = {
  mono: "'JetBrains Mono', ui-monospace, monospace",
  word: "Lexend, Inter, sans-serif",
} as const;

/** Gradient-filled text (the banner's blue → violet headline treatment). */
export const gradText: React.CSSProperties = {
  backgroundImage: BCM.grad,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Rounded rect with independent corner radii (tl, tr, br, bl). */
const rr = (x: number, y: number, w: number, h: number, [tl, tr, br, bl]: number[]) =>
  `M${x + tl} ${y} H${x + w - tr} Q${x + w} ${y} ${x + w} ${y + tr} V${y + h - br} Q${x + w} ${y + h} ${x + w - br} ${y + h} H${x + bl} Q${x} ${y + h} ${x} ${y + h - bl} V${y + tl} Q${x} ${y} ${x + tl} ${y} Z`;

/**
 * The BCM logo as vector, traced from the supplied 400 px PNG (two
 * overlapping rounded tiles with the overlap cut out, blue → violet).
 */
export const Logo: React.FC<{ size: number; mono?: string; id?: string; style?: React.CSSProperties }> = ({ size, mono, id = "bcm", style }) => (
  <svg width={size} height={(size * 228) / 214} viewBox="93 82 214 228" style={style}>
    <defs>
      <linearGradient id={`${id}-g`} x1="100" y1="90" x2="300" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#5DAAFF" />
        <stop offset="0.5" stopColor="#4A78FA" />
        <stop offset="1" stopColor="#4D25F7" />
      </linearGradient>
      <mask id={`${id}-m`}>
        <path d={rr(93, 82, 141, 149, [50, 50, 0, 10])} fill="#fff" />
        <path d={rr(159, 157, 147, 152, [0, 10, 56, 56])} fill="#fff" />
        <path d={rr(160, 158, 73, 72, [6, 6, 6, 6])} fill="#000" />
      </mask>
    </defs>
    <rect x="93" y="82" width="214" height="228" fill={mono ?? `url(#${id}-g)`} mask={`url(#${id}-m)`} />
  </svg>
);
