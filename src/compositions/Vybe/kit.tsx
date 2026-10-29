import { loadFont } from "@remotion/fonts";
import { Img, staticFile } from "remotion";

loadFont({ family: "Lilita One", url: staticFile("vybe/fonts/lilita-one-latin-400-normal.woff2"), weight: "400" });
for (const w of ["400", "500", "600", "700", "800"]) loadFont({ family: "Outfit", url: staticFile(`vybe/fonts/outfit-latin-${w}-normal.woff2`), weight: w });

/** VYBE palette sampled from the supplied banner and hero card. */
export const V = { cyan: "#62eaf8", sky: "#1fd9fc", chip: "#7fe8f8", lime: "#b9f35f", green: "#a8f060", yellow: "#f3f460", pink: "#f493e9", pinkDeep: "#e963d4", navy: "#18112e", teal: "#0b2e2a", mint: "#7ff0d0", white: "#ffffff" } as const;
export const LIL = "'Lilita One', 'Outfit', sans-serif";
export const OUT = "Outfit, system-ui, sans-serif";
export const W = 1080;
export const H = 1350;

export type BgKind = "grad" | "cyan" | "yellow" | "pink" | "lime" | "navy";
export const Bg: React.FC<{ kind?: BgKind }> = ({ kind = "grad" }) => {
  const bg: Record<BgKind, string> = {
    grad: `linear-gradient(180deg, #62eaf8 0%, #8bf3c8 38%, #c4f56c 68%, #f1f55e 100%)`,
    cyan: `linear-gradient(180deg, #5be7fb 0%, #7ef0f2 100%)`,
    yellow: `linear-gradient(180deg, #f6f662 0%, #e7f46a 100%)`,
    pink: `linear-gradient(180deg, #f8a5ef 0%, #f6bdf1 100%)`,
    lime: `linear-gradient(180deg, #c5f66b 0%, #a6f085 100%)`,
    navy: `linear-gradient(180deg, #1d1538 0%, #18112e 100%)`,
  };
  const line = kind === "navy" ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.38)";
  return (
    <div style={{ position: "absolute", inset: 0, background: bg[kind] }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${line} 2px, transparent 2px), linear-gradient(90deg, ${line} 2px, transparent 2px)`, backgroundSize: "62px 62px" }} />
    </div>
  );
};

/* ------------------------------ stickers ------------------------------ */
export const Sparkle: React.FC<{ x: number; y: number; s?: number; r?: number; fill?: string }> = ({ x, y, s = 80, r = 0, fill = "#fff" }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }} width={s} height={s} viewBox="-4 -4 108 108"><path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0Z" fill={fill} stroke={V.navy} strokeWidth={6} strokeLinejoin="round" /></svg>
);
export const Cube: React.FC<{ x: number; y: number; s?: number; c?: string; r?: number }> = ({ x, y, s = 140, c = V.pink, r = 0 }) => (
  <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }} width={s} height={s} viewBox="0 0 120 120">
    <polygon points="60,6 112,34 60,62 8,34" fill="#ffffffcc" stroke={V.navy} strokeWidth={5} strokeLinejoin="round" />
    <polygon points="8,34 60,62 60,116 8,88" fill={c} stroke={V.navy} strokeWidth={5} strokeLinejoin="round" />
    <polygon points="112,34 60,62 60,116 112,88" fill={c} stroke={V.navy} strokeWidth={5} strokeLinejoin="round" style={{ filter: "brightness(0.9)" }} />
  </svg>
);
export const Burst: React.FC<{ x: number; y: number; s?: number; fill?: string; r?: number }> = ({ x, y, s = 220, fill = V.pink, r = 0 }) => {
  const pts = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; const rad = i % 2 ? 36 : 50; return `${50 + Math.cos(a) * rad},${50 + Math.sin(a) * rad}`; }).join(" ");
  return <svg style={{ position: "absolute", left: x, top: y, transform: `rotate(${r}deg)` }} width={s} height={s} viewBox="-2 -2 104 104"><polygon points={pts} fill={fill} stroke={V.navy} strokeWidth={3.4} strokeLinejoin="round" /></svg>;
};

/* ------------------------------ text + chips ------------------------------ */
/** Bubbly white display text with a navy outline and hard shadow (two stacked layers). */
export const Pop: React.FC<{ children: React.ReactNode; size: number; fill?: string; style?: React.CSSProperties; align?: "left" | "center" }> = ({ children, size, fill = "#fff", style, align = "left" }) => {
  const base: React.CSSProperties = { fontFamily: LIL, fontSize: size, lineHeight: 1.02, letterSpacing: size * 0.01, textAlign: align, gridArea: "1 / 1" };
  return (
    <div style={{ display: "grid", ...style }}>
      <div style={{ ...base, color: V.navy, WebkitTextStroke: `${size * 0.2}px ${V.navy}`, textShadow: `${size * 0.05}px ${size * 0.08}px 0 ${V.navy}` }}>{children}</div>
      <div style={{ ...base, color: fill }}>{children}</div>
    </div>
  );
};
export const Chip: React.FC<{ children: React.ReactNode; bg?: string; fs?: number; fg?: string; style?: React.CSSProperties }> = ({ children, bg = V.yellow, fs = 44, fg = V.navy, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", background: bg, color: fg, border: `${Math.max(4, fs * 0.1)}px solid ${V.navy}`, borderRadius: 999, padding: `${fs * 0.22}px ${fs * 0.7}px`, fontFamily: OUT, fontWeight: 600, fontSize: fs, lineHeight: 1.1, whiteSpace: "nowrap", ...style }}>{children}</div>
);
export const Num: React.FC<{ n: number | string; s?: number; style?: React.CSSProperties }> = ({ n, s = 70, style }) => (
  <div style={{ width: s, height: s, borderRadius: 999, background: V.pink, border: `${Math.max(4, s * 0.08)}px solid ${V.navy}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OUT, fontWeight: 700, fontSize: s * 0.52, color: V.navy, flexShrink: 0, ...style }}>{n}</div>
);
export const Step: React.FC<{ n: number; label: string; bg: string; fs?: number }> = ({ n, label, bg, fs = 44 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: fs * 0.14 }}><Num n={n} s={fs * 1.35} /><Chip bg={bg} fs={fs}>{label}</Chip></div>
);
export const Btn: React.FC<{ children: React.ReactNode; dark?: boolean; fs?: number; style?: React.CSSProperties }> = ({ children, dark, fs = 40, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", background: dark ? V.navy : "#fff", color: dark ? V.yellow : V.navy, border: `${fs * 0.1}px solid ${V.navy}`, borderRadius: 999, padding: `${fs * 0.36}px ${fs * 1.0}px`, fontFamily: OUT, fontWeight: 600, fontSize: fs, whiteSpace: "nowrap", ...style }}>{children}</div>
);
export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; bg?: string; shadow?: number }> = ({ children, style, bg = "#fff", shadow = 12 }) => (
  <div style={{ position: "absolute", background: bg, border: `6px solid ${V.navy}`, borderRadius: 44, boxShadow: `${shadow * 0.7}px ${shadow}px 0 ${V.navy}`, boxSizing: "border-box", ...style }}>{children}</div>
);

/* ------------------------------ brand pieces ------------------------------ */
export const Logo: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => <Img src={staticFile("vybe/img/wordmark.png")} style={{ width: w, height: "auto", ...style }} />;
export const Mascot: React.FC<{ s: number; style?: React.CSSProperties; ring?: number }> = ({ s, style, ring = 8 }) => (
  <div style={{ width: s, height: s, borderRadius: 999, border: `${ring}px solid ${V.navy}`, overflow: "hidden", background: "#fff", boxSizing: "border-box", ...style }}>
    <Img src={staticFile("vybe/img/mascot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);
export const HLPill: React.FC<{ fs?: number; style?: React.CSSProperties }> = ({ fs = 40, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: fs * 0.4, background: V.teal, border: `${fs * 0.08}px solid #3f7a6f`, borderRadius: 999, padding: `${fs * 0.34}px ${fs * 0.9}px`, fontFamily: OUT, fontSize: fs, color: V.mint, whiteSpace: "nowrap", ...style }}>
    <Img src={staticFile("vybe/img/hl-mark.png")} style={{ height: fs * 1.05, width: "auto" }} />
    <span>Built on <b style={{ color: "#fff", fontWeight: 600 }}>Hyperliquid</b></span>
  </div>
);
export const Testnet: React.FC<{ style?: React.CSSProperties; fs?: number }> = ({ style, fs = 24 }) => <Chip bg={V.yellow} fs={fs} style={{ fontWeight: 700, letterSpacing: fs * 0.12, ...style }}>TESTNET</Chip>;
export const Photo: React.FC<{ src: string; x: number; y: number; w: number; h: number; pos?: string; scale?: number; r?: number }> = ({ src, x, y, w, h, pos = "50% 50%", scale = 1, r = 36 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: r, border: `6px solid ${V.navy}`, overflow: "hidden", boxShadow: `8px 11px 0 ${V.navy}`, boxSizing: "border-box" }}>
    <Img src={staticFile(`vybe/img/${src}`)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${scale})` }} />
  </div>
);
export const Foot: React.FC<{ n: number; dark?: boolean; note?: string }> = ({ n, dark, note }) => (
  <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: OUT, fontWeight: 600, fontSize: 24, color: dark ? "#fff" : V.navy }}>
    <Logo w={130} />
    <span style={{ opacity: 0.9 }}>{note ?? "X @vybe_fi"}</span>
    <span style={{ fontWeight: 700 }}>{String(n).padStart(2, "0")}/15</span>
  </div>
);
