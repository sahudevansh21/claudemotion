import { loadFont } from "@remotion/fonts";
import { Img, random, staticFile } from "remotion";
import { PM } from "../brand";

loadFont({ family: "Cinzel", url: staticFile("polymate/fonts/cinzel-latin-500-normal.woff2"), weight: "500" });
loadFont({ family: "Cinzel", url: staticFile("polymate/fonts/cinzel-latin-700-normal.woff2"), weight: "700" });

/** Poster design canvas (4:5). Rendered at 2x → 2160x2700. */
export const W = 1080;
export const H = 1350;

export const P = {
  night: "#0B0F1E",
  dusk: "#1B1830",
  lime: "#E9DDC4", // limestone
  limeShade: "#B9A685",
  limeDeep: "#7D6A50",
  sand: "#D9B57A",
  sandDeep: "#A9824A",
  gold: PM.goldLight,
  goldDeep: PM.gold,
  sapphire: "#122C86",
  sapphireDeep: "#071542",
  crimson: "#8E1F1F",
  ivory: "#F6F0E4",
  ink: "#141414",
};

export const FONT = {
  caps: "Cinzel, 'Instrument Serif', serif",
  serif: "'Instrument Serif', Georgia, serif",
  ui: "Inter, system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ----------------------------- sky ----------------------------- */
export const Stars: React.FC<{ n?: number; seed: string; h?: number; o?: number }> = ({ n = 140, seed, h = H, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => (
      <circle key={i} cx={random(`${seed}x${i}`) * W} cy={random(`${seed}y${i}`) ** 1.4 * h} r={0.5 + random(`${seed}r${i}`) * 1.3} fill="#FFF6E0" opacity={0.25 + random(`${seed}o${i}`) * 0.7} />
    ))}
  </g>
);

/* --------------------------- limestone column ------------------- */
export const Column: React.FC<{ x: number; y: number; w: number; h: number; lit?: number; id: string }> = ({ x, y, w, h, lit = 1, id }) => (
  <g>
    <defs>
      <linearGradient id={`col-${id}`} x1="0" x2="1">
        <stop offset="0" stopColor={P.limeDeep} />
        <stop offset={0.35 + 0.2 * (1 - lit)} stopColor={P.lime} />
        <stop offset="1" stopColor="#5A4A36" />
      </linearGradient>
    </defs>
    {/* papyrus capital */}
    <path d={`M${x - w * 0.28} ${y} Q ${x + w / 2} ${y - w * 0.55} ${x + w * 1.28} ${y} L ${x + w * 1.08} ${y + w * 0.32} L ${x - w * 0.08} ${y + w * 0.32} Z`} fill={`url(#col-${id})`} />
    <rect x={x - w * 0.34} y={y - w * 0.16} width={w * 1.68} height={w * 0.14} fill={P.limeShade} />
    <rect x={x} y={y + w * 0.32} width={w} height={h} fill={`url(#col-${id})`} />
    {[0.2, 0.4, 0.6, 0.8].map((k) => (
      <rect key={k} x={x + w * k - 1.5} y={y + w * 0.32} width={3} height={h} fill="rgba(60,45,30,0.22)" />
    ))}
    {/* carved gold band */}
    <rect x={x} y={y + w * 0.6} width={w} height={6} fill={P.gold} opacity={0.75} />
    <rect x={x} y={y + w * 0.6 + 12} width={w} height={2} fill={P.gold} opacity={0.5} />
  </g>
);

/* ------------------------------ glyphs -------------------------- */
/** Abstract temple glyphs (decorative, not real hieroglyph text). */
export const GLYPHS = [
  "M0 -18 A8 8 0 1 1 0 -2 A8 8 0 1 1 0 -18 M0 -2 L0 20 M-12 4 L12 4", // ankh-like
  "M-14 0 A14 14 0 1 0 14 0 A14 14 0 1 0 -14 0 M-4 0 A4 4 0 1 0 4 0 A4 4 0 1 0 -4 0", // sun disc
  "M-16 -6 Q -8 -14 0 -6 T 16 -6 M-16 4 Q -8 -4 0 4 T 16 4 M-16 14 Q -8 6 0 14 T 16 14", // water
  "M0 -18 L4 -4 L18 0 L4 4 L0 18 L-4 4 L-18 0 L-4 -4 Z", // star
  "M8 -16 A16 16 0 1 0 8 16 A12 12 0 1 1 8 -16", // crescent
  "M0 -18 L16 14 L-16 14 Z", // pyramid
  "M-4 18 Q -10 0 0 -18 Q 10 0 4 18 Z M0 -10 L0 18", // feather
  "M-18 0 Q 0 -14 18 0 Q 0 14 -18 0 M-5 0 A5 5 0 1 0 5 0 A5 5 0 1 0 -5 0", // eye
  "M-14 -14 L14 -14 L14 14 L-14 14 Z M-14 0 L14 0 M0 -14 L0 14", // field
  "M-16 10 L-6 -12 L0 4 L6 -12 L16 10", // mountains
];

export const Glyph: React.FC<{ i: number; x: number; y: number; s?: number; glow?: number; color?: string }> = ({ i, x, y, s = 1, glow = 1, color = P.gold }) => (
  <path
    d={GLYPHS[i % GLYPHS.length]}
    transform={`translate(${x} ${y}) scale(${s})`}
    fill="none"
    stroke={color}
    strokeWidth={2.4 / s}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: glow > 0 ? `drop-shadow(0 0 ${6 * glow}px ${P.gold}) drop-shadow(0 0 ${16 * glow}px rgba(221,184,104,0.6))` : undefined }}
  />
);

/* ------------------------------ figures ------------------------- */
/** Lone cloaked traveler silhouette, standing; feet at (x, y), height h. */
export const Traveler: React.FC<{ x: number; y: number; h: number; color?: string; staff?: boolean }> = ({ x, y, h, color = "#0E0A08", staff = true }) => {
  const s = h / 100;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <circle cx={0} cy={-88} r={7} />
      <path d="M-7 -84 Q -16 -80 -18 -60 L -22 -10 Q -20 0 -12 0 L 12 0 Q 20 0 21 -8 L 17 -60 Q 15 -80 7 -84 Z" />
      <path d="M-9 -92 Q 0 -104 9 -92 L 10 -82 L -10 -82 Z" />
      {staff ? <rect x={20} y={-100} width={2.2} height={100} /> : null}
    </g>
  );
};

/** Seated colossus (stylised): base at (x, y), height h. */
export const Colossus: React.FC<{ x: number; y: number; h: number; id: string; lit?: string }> = ({ x, y, h, id, lit = P.lime }) => {
  const s = h / 400;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`colos-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#4C3D2C" />
          <stop offset="0.5" stopColor={lit} />
          <stop offset="1" stopColor="#3A2E21" />
        </linearGradient>
      </defs>
      <g fill={`url(#colos-${id})`}>
        <rect x={-110} y={-60} width={220} height={60} />
        <rect x={-90} y={-170} width={180} height={115} />
        <rect x={-70} y={-170} width={36} height={110} fill="rgba(0,0,0,0.15)" />
        <path d="M-62 -175 L -70 -300 Q 0 -320 70 -300 L 62 -175 Z" />
        <path d="M-40 -300 L -52 -350 Q 0 -400 52 -350 L 40 -300 Z" />
        <path d="M-52 -350 L -78 -290 L -60 -290 Z M52 -350 L 78 -290 L 60 -290 Z" />
        <rect x={-30} y={-345} width={60} height={50} rx={10} />
      </g>
      <rect x={-52} y={-352} width={104} height={6} fill={P.gold} opacity={0.8} />
    </g>
  );
};

/* ------------------------------ marble -------------------------- */
const veinPath = (seed: string, w: number, h: number) => {
  let x = -60 + random(`${seed}x`) * w * 0.5;
  let y = random(`${seed}y`) * h;
  let a = -0.5 + random(`${seed}a`) * 0.8;
  let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
  for (let i = 0; i < 22; i++) {
    a += (random(`${seed}t${i}`) - 0.5) * 0.9;
    const len = 40 + random(`${seed}l${i}`) * 50;
    const cx = x + Math.cos(a) * len * 0.5 + (random(`${seed}c${i}`) - 0.5) * 24;
    const cy = y + Math.sin(a) * len * 0.5 + (random(`${seed}d${i}`) - 0.5) * 24;
    x += Math.cos(a) * len;
    y += Math.sin(a) * len;
    d += ` Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
};

export const Marble: React.FC<{ w: number; h: number; seed: string; tone: "sapphire" | "cream"; veins?: number }> = ({ w, h, seed, tone, veins = 12 }) => {
  const sap = tone === "sapphire";
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id={`mb-${seed}`} cx="0.3" cy="0.25" r="1">
          <stop offset="0" stopColor={sap ? "#2149C9" : "#FBF7EE"} />
          <stop offset="0.5" stopColor={sap ? P.sapphire : "#EDE3D0"} />
          <stop offset="1" stopColor={sap ? P.sapphireDeep : "#CDBFA5"} />
        </radialGradient>
        <filter id={`mbb-${seed}`}><feGaussianBlur stdDeviation="0.6" /></filter>
        <filter id={`mbw-${seed}`}><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <rect width={w} height={h} fill={`url(#mb-${seed})`} />
      <g fill="none" strokeLinecap="round">
        {Array.from({ length: veins }, (_, i) => {
          const d = veinPath(`${seed}${i}`, w, h);
          const gold = random(`${seed}g${i}`) < 0.3;
          const sw = 0.8 + random(`${seed}w${i}`) * 2;
          const o = 0.2 + random(`${seed}o${i}`) * 0.4;
          return (
            <g key={i}>
              <path d={d} stroke={sap ? "#C9D6FF" : "#9C8F80"} strokeWidth={sw * 8} opacity={o * 0.15} filter={`url(#mbw-${seed})`} />
              <path d={d} stroke={gold ? P.gold : sap ? "#DCE5FF" : "#7E7368"} strokeWidth={sw} opacity={gold ? o + 0.2 : o} filter={`url(#mbb-${seed})`} />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ------------------------------ emblem -------------------------- */
/** The supplied PolyMate emblem, unaltered (background removed only). */
export const Emblem: React.FC<{ w: number; style?: React.CSSProperties; shadow?: boolean }> = ({ w, style, shadow = true }) => (
  <Img
    src={staticFile("polymate/img/emblem.png")}
    style={{ width: w, height: (w * 1232) / 1476, filter: shadow ? "drop-shadow(0 18px 30px rgba(10,5,2,0.5))" : undefined, ...style }}
  />
);

/** Film grain + vignette finish. */
export const Finish: React.FC<{ seed: number; vignette?: number }> = ({ seed, vignette = 0.6 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(5,3,2,${vignette}) 100%)` }} />
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.1, mixBlendMode: "overlay" }}>
      <filter id={`gr-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter={`url(#gr-${seed})`} />
    </svg>
  </>
);
